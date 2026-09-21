---
id: mcp-tool-server
title: "In-process MCP tool server"
sidebar_label: "MCP tool server"
sidebar_position: 1
description: "Design note: how Bifröst message types are exposed as tools to chat providers inside Business Central."
---

# In-Process MCP Tool Server — Implementation Plan

> **Scope decision:** Lite mode aðeins (~16 tools). No queue/async support — synchronous verkþáttur execution only.
> No `OmitCommit` — allir calls go through the dispatcher með sjálfgefið commit behavior.
> `invoke_message_type` er the universal fallback fyrir anything not in the heitid tool set.

## Problem Statement

The Bifrost Chat needs an in-process tool server that exposes Bifrost message tegunds
as tools fyrir any AI chat provider. `AnthropicToolRunner` in the Anthropic app **already
proves** the pattern works: it exposes message tegunds as tools og executes them via
`Dispatcher ori` directly, með zero HTTP. We generalize this í a public
kóðiunit in the core app that any provider getur use.

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Chat Provider (Anthropic / OpenAI / Local LLM / etc.)      │
│  Runs the agentic tool loop                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ Bootstrap / ListTools / CallTool
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  MCP Tool Server ori  (Public codeunit in Core app)      │
│  ─ Session bootstrap (system prompt + identity + primer)    │
│  ─ Tool registry (~16 tools, lite mode)                     │
│  ─ Argument mapping (tool input → Bifrost envelope)         │
│  ─ Response mapping (Bifrost response → tool result text)   │
│  ─ OnlyEnabled filter (only message types with Enabled=true)│
│  ─ Blob store (large base64 ↔ reference tokens)            │
└──────────────────────────┬──────────────────────────────────┘
                           │ Execute(MessageType, ...)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Dispatcher ori  (existing)                    │
│  ─ Full pipeline (queue entry, language switch, commit)     │
│  ─ No OmitCommit — always commits normally                  │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Message Type Implementations (existing enum + codeunits)   │
└─────────────────────────────────────────────────────────────┘
```

---

## Target Code Path

```
Any provider → MCP Tool Server ori → Bifrost Dispatcher → Message Type Impl
```

All tool calls eru in-process. No external servers, no HTTP, no OAuth.

---

## Session Bootstrap

When a chat session starts, the provider verður call `MCP Tool Server ori.Bootstrap()` to prepare the session context.

### Bootstrap Sequence (mandatory, in order)

| Step | Action | Skilar |
|------|--------|---------|
| **1. Identity** | Dispatches `Help.WhoAmI.Get` | Notaður info, language, permissions, pending notifications |
| **2. Memory overview** | Dispatches `Memory.User.List` + `Memory.Company.List` | Lýsings of stored memories (not full innihald) |
| **3. System prompt** | Lestus `systemPrompt` úr WhoAmI response | Admin-injected behavioral instructions |
| **4. API primer** | Dispatches `Help.Bifrost.Get` then `Help.Implementation.Get` (subject: `Help.Bifrost.Get`) | Full API usage rules (tableView syntax, CalcSums, pagination, etc.) |

### Bootstrap Output

`Bootstrap()` returns a `Text` gildi containing the composed system prompt:
1. Base system prompt (rules fyrir BC chat assistant)
2. Identity context (notandi heiti, company, language, permissions)
3. Memory overview (titles/descriptions of available memories)
4. Admin system prompt (if any)
5. API primer (Bifrost usage rules — prevents query/write mistakes)
6. Record context (if the notandi er viewing a specific færsla — table ID, SystemId)

The provider feeds this as the `system` parameter to the LLM.

### Language Handling

- `who_am_i` returns `personalization.languageId` — this er **only** used to tell the chat model what language to reply in (innifalið in the system prompt).
- The tool server does **not** store eða pass LCID to tools. The dispatcher always uses the current BC session language (`GlobalLanguage()`) automatically.
- No `lcid` parameter on any tool. Language switching er handled by BC, not the tool server.

---

## New Codeunits

### 1. `MCP Tool Server ori`

| Property | Value |
|----------|-------|
| **File** | `app/src/BifrostChat/CEMCPToolServer.Codeunit.al` |
| **Object ID** | TBD (within 10077885–10078384) |
| **Access** | Public |
| **SingleInstance** | Yes (caches tool registry + session state) |

#### Public API

```al
/// Runs the session bootstrap sequence and returns the composed system prompt.
/// Must be called once at chat session start before any tool calls.
/// RecordContext is optional JSON with tableId + recordSystemId for page-contextual chat.
procedure Bootstrap(RecordContext: Text): Text

/// Lists all available tools with their input schemas (~16 tools).
procedure ListTools(var Tools: JsonArray)

/// Executes a tool by name. Returns true on success (even if the tool itself reports an error).
/// IsError=true means the tool executed but returned a business error.
procedure CallTool(ToolName: Text; Arguments: JsonObject; var ResultText: Text; var IsError: Boolean): Boolean

/// Returns the count of registered tools.
procedure GetToolCount(): Integer

```

#### Internal State (SingleInstance)

- `ToolRegistry: JsonArray` — cached tool definitions (built once)
- `IsBootstrapped: Boolean` — guards against calling tools áður en bootstrap
- `BlobStore: Dictionary of [Text, Text]` — blob reference → base64 data

### 2. `MCP Tool Executor ori`

| Property | Value |
|----------|-------|
| **File** | `app/src/BifrostChat/CEMCPToolExecutor.Codeunit.al` |
| **Object ID** | TBD |
| **Access** | Internal |
| **SingleInstance** | Yes |

Wraps `Dispatcher ori.Execute()` inside `Codeunit.Run()` fyrir isolation. Write tools that fail don't roll back the chat session.

```al
procedure SetParameters(MessageType: Enum "Message Type ori"; Subject: Text; RequestText: Text)
procedure GetResponseText(): Text
procedure GetResponseContentType(): Text
trigger OnRun()  // calls Dispatcher.Execute
```

---

## Blob Store (Large Binary Data Handling)

### Problem

Some message tegunds return binary data (PDFs, images, Excel skrár) og some accept
binary input. Senduing large base64 blobs through the LLM context window wastes tokens
and getur exceed context limits. The model doesn't need to read eða reason about binary
data — it just needs to pass it úr one tool call to the next.

### How Content Types Flow

The `Dispatcher ori` returns a `ResponseContentType` fyrir every call.
The executor uses this to decide pass-through vs blob store:

**Sendu through (readable text):**

| Content Type | Example |
|-------------|---------|
| `text/json` | Data.Records.Get, Help.SkilaboðTypes.Get (sjálfgefið fyrir most message tegunds) |
| `text/markdown` | Help.Implementation.Get |
| `text/xml` | XML responses |
| `text/csv` | CSV.Records.Get |
| `text/plain` | Plain text responses |
| `application/json` | Some implementations set this instead of text/json |
| `application/xml` | Some XML responses |

**Blob store (binary):**

| Content Type | Example |
|-------------|---------|
| `application/pdf` | Sales.Invoice.GetPdf |
| `application/octet-stream` | Email attachments, skrá downloads |
| `image/*` | Report thumbnails, images |
| Everything else | Any innihald tegund not in the pass-through list |

### Design: Gagnategund-Driven Blob Detection

The tool executor checks `ResponseContentType` eftir hver dispatcher call:

- **Sendu-through tegunds** (`text/*`, `application/json`, `application/xml`) → return the text directly to the model
- **Binary tegunds** (everything else) → enkóði the response blob to base64, store it in the
  blob store, og return a JSON object með a reference token og metadata instead

No auto-detection of base64 patterns in JSON. No sgeturning of text responses.
The innihald tegund er the single source of truth.

### Reference Tokens

**On response (binary tool niðurstaða → model):**
- Executor gets a binary response (innihald tegund er not `text/*`)
- Enkóðis to base64, stores in blob store með a GUID key
- Skilar to model: `{ "blobRef": "{{blob:<guid>}}", "size": 204800, "contentType": "application/pdf" }`
- Model sees a small JSON object, not the binary data

**On request (model → tool):**
- Model passes `{{blob:<guid>}}` in a tool argument gildi (e.g. inside `data` JSON)
- Tool server sgeturs the argument string fyrir `{{blob:*}}` patterns og resolves them to
  actual base64 data áður en dispatching
- Ef the reference er invalid/expired, returns an villa

### Example Flow

```
1. Model calls: invoke_message_type({ type: "Sales.Invoice.GetPdf", subject: "INV-001" })
2. Dispatcher returns binary PDF (content type: application/pdf)
3. Executor encodes to base64, stores in blob store, returns to model:
   { "blobRef": "{{blob:a1b2c3d4}}", "size": 204800, "contentType": "application/pdf" }
4. Model calls: invoke_message_type({ type: "Incoming.Document.Create",
     data: "{ \"content\": \"{{blob:a1b2c3d4}}\" }" })
5. Tool server resolves {{blob:a1b2c3d4}} → actual base64 in the data string, dispatches
```

### Implementation in `MCP Tool Server ori`

```al
var
    BlobStore: Dictionary of [Text, Text];       // guid → base64 value
    BlobContentTypes: Dictionary of [Text, Text]; // guid → contentType
    BlobSizes: Dictionary of [Text, Integer];     // guid → byte size

procedure StoreBlob(Base64Value: Text; ContentType: Text; ByteSize: Integer): Text  // returns {{blob:<guid>}}
procedure ResolveBlob(Reference: Text): Text                     // returns base64 or error
procedure ResolveBlobsInText(var InputText: Text)                // replaces all {{blob:*}} in a string
procedure ClearBlobStore()                                       // called on session reset
```

The blob store er **not a tool** — it's internal plumbing in the executor/server. The model never
calls blob store procedures directly. It aðeins sees references in tool niðurstöður og passes them in
tool arguments.

### `encode_base64` / `decode_base64` — Removed

Replaced by `set_blob` / `get_blob` which eru more general purpose.
`set_blob` getur store any innihald (text eða base64). `get_blob` retrieves it.
Base64 encoding/decoding of binary dispatcher responses er handled automatically
by the executor (innihald-tegund driven), not by explicit tools.

### Rules

- **Content-tegund driven**: Only binary (non-pass-through) responses eru blob-stored. Sendu-through tegunds (`text/*`, `application/json`, `application/xml`) eru returned directly.
- **UTF-8 everywhere**: All text ↔ stream conversions use `TextEncoding::UTF8`. This applies to the executor reading dispatcher responses, blob store read/write, og request payload construction.
- **Lifetime**: Blobs live fyrir the duration of the SingleInstance (chat session). Cleared on `ResetSession()`.
- **No persistence**: Blobs eru never written to the database — purely in-memory fyrir the conversation.
- **Reference format**: `{{blob:<guid>}}` — easily regex-matchable, unlikely to collide með real data.
- **Úrlausn**: `ResolveBlobsInText` sgeturs the input string fyrir `{{blob:*}}` patterns og replaces allir of them áður en dispatching.
- **Memory cap**: Ef total stored blobs exceed a configurable limit (e.g. 50MB), oldest blobs eru evicted með a warning in the next tool response.

### Bootstrap Prompt Instruction

The blob handling instructions eru innifalið in the BLOB HANDLING section of the
bootstrap system prompt (see Bootstrap System Prompt Template below). They cover:
- What blob references eru og how to recognize them
- How to pass them between tools
- When til notkunar `storeJsonPaths` fyrir large responses
- How til notkunar `get_blob`, `set_blob`, `list_blobs`, `delete_blobs`

---

## Tool Catalog (Lite Mode — 16 tools)

All tools route through `Dispatcher ori`. The model uses `invoke_message_type` + `describe_message_type` fyrir anything not in this list.

### Core Skilaboð Type Tools (3)

| Tool Name | Skilaboð Type | Lýsing |
|-----------|-------------|-------------|
| `invoke_message_type` | (any — pass-through) | Universal tool — calls any registered message tegund |
| `list_message_types` | `Help.MessageTypes.Get` (with `OnlyEnabled=true`) | Lists enabled message tegunds aðeins |
| `describe_message_type` | `Help.Implementation.Get` | Detailed help fyrir a specific message tegund |

#### `invoke_message_type` — Input Schema

```json
{
  "type": "object",
  "properties": {
    "type": { "type": "string", "description": "Bifrost message type (e.g. 'Sales.Order.Post')" },
    "data": { "type": ["string", "object"], "description": "Payload — string or JSON object. May contain {{blob:<guid>}} references that are resolved before dispatch." },
    "subject": { "type": "string", "description": "Optional subject field" },
    "storeJsonPaths": { "type": "array", "items": { "type": "string" }, "description": "JSON paths in the response to store in blob storage and replace with {{blob:<guid>}} references. Use when the response contains large data you need to forward to another tool without reading it. Example: ['$.records']" }
  },
  "required": ["type"]
}
```

#### `storeJsonPaths` — Selective Blob Storage

When `storeJsonPaths` er gefið, the tool server:
1. Keyrir the message tegund normally
2. For hver JSON slóð: extracts the gildi, serializes it, stores in blob store
3. Replaces the gildi in-place með `{{blob:<guid>}}`
4. Appends `_blobs` metadata array to the response

Example:
```json
// Request
{ "type": "Data.Records.Get", "data": "...", "storeJsonPaths": ["$.records"] }

// Response (model sees)
{
  "noOfRecords": 5000,
  "records": "{{blob:a1b2c3d4}}",
  "_blobs": [{ "ref": "{{blob:a1b2c3d4}}", "jsonPath": "$.records", "size": 2400000, "type": "array", "count": 5000 }]
}
```

This also works on `get_records`, `batch_records`, og other heitid tools — they allir accept `storeJsonPaths`.

#### `list_message_types` — OnlyEnabled Filter

When listing tools, the tool server passes `OnlyEnabled=true` to `Help.MessageTypes.Get`.
This ensures aðeins message tegunds explicitly enabled by the administrator eru exposed to the chat model.
Skilaboð tegunds með `Enabled = false` eru invisible to the AI.

### Identity (1)

| Tool Name | Skilaboð Type |
|-----------|-------------|
| `who_am_i` | `Help.WhoAmI.Get` |

### Records (4)

| Tool Name | Skilaboð Type |
|-----------|-------------|
| `get_records` | `Data.Records.Get` |
| `set_records` | `Data.Records.Set` |
| `get_record_ids` | `Data.RecordIds.Get` |
| `batch_records` | `Data.Records.Batch` |

### Blob Tools (4)

| Tool Name | Lýsing |
|-----------|-------------|
| `get_blob` | Lestus a blob reference og returns its innihald. For text blobs returns the text directly. For binary blobs returns base64. |
| `set_blob` | Stores a gildi (text eða base64) in the blob store og returns a `{{blob:<guid>}}` reference. |
| `list_blobs` | Lists allir blob references in the current session með metadata (size, innihaldType, created). |
| `delete_blobs` | Eyðir one eða more blob references to free memory. |

#### `get_blob` — Input Schema

```json
{
  "type": "object",
  "properties": {
    "ref": { "type": "string", "description": "Blob reference ({{blob:<guid>}}) to read." },
    "maxChars": { "type": "integer", "description": "Max characters to return (default 20000). Truncates with a warning if exceeded." }
  },
  "required": ["ref"]
}
```

#### `set_blob` — Input Schema

```json
{
  "type": "object",
  "properties": {
    "content": { "type": "string", "description": "Text or base64 content to store." },
    "contentType": { "type": "string", "description": "MIME type (e.g. 'application/pdf', 'text/json'). Default: 'text/plain'." }
  },
  "required": ["content"]
}
```

Skilar: `{ "ref": "{{blob:<guid>}}", "size": 12345, "contentType": "text/json" }`

#### `list_blobs` — Input Schema

```json
{
  "type": "object",
  "properties": {}
}
```

Skilar: `{ "blobs": [{ "ref": "{{blob:<guid>}}", "size": 204800, "contentType": "application/pdf" }, ...], "totalSize": 500000 }`

#### `delete_blobs` — Input Schema

```json
{
  "type": "object",
  "properties": {
    "refs": { "type": "array", "items": { "type": "string" }, "description": "Blob references to delete. Pass ['*'] to clear all." }
  },
  "required": ["refs"]
}
```

Skilar: `{ "deleted": 3, "remainingSize": 100000 }`

### Memory (4)

| Tool Name | Skilaboð Type |
|-----------|-------------|
| `get_user_memory` | `Memory.User.Get` |
| `set_user_memory` | `Memory.User.Set` |
| `get_company_memory` | `Memory.Company.Get` |
| `set_company_memory` | `Memory.Company.Set` |

**Schemas fyrir heitid tools:** The data tools (`get_records`, `set_records`, `get_record_ids`, `batch_records`)
and memory tools mirror their message tegund's request format. Notaðu `describe_message_type` með the
message tegund heiti (e.g. `Data.Records.Get`) to get the exact schema. All heitid tools also accept
the optional `storeJsonPaths` parameter described under `invoke_message_type`.

### Not Included (handled by `invoke_message_type`)

- Table metadata (`Help.Tables.Get`, `Help.Fields.Get`, etc.)
- Search (model constructs `Data.Records.Get` með `@*query*` filters)
- Totals (`Data.Totals.Get`)
- Aging & period analysis (`Analysis.CustomerAging.Get`, `Analysis.VendorAging.Get`, `Analysis.PeriodBreakdown.Get`)
- Translations, timestamps, incoming skjöl
- BC business events
- Queue operations (not supported — synchronous verkþáttur only)
- `encrypt_data` (security-sensitive, denylisted)
- `get_cloud_events_api_skill` (large payload, model getur use `invoke_message_type` með `Help.Skill.Get` ef needed)
- `get_config` / `set_config` (environment-level config, not needed fyrir chat)

---

## Impact on Existing Code

### `AnthropicChatProxy` (Anthropic app)

```al
SystemPrompt := MCPToolServer.Bootstrap(RecordContext);
MCPToolServer.ListTools(McpTools);
// ... in tool loop:
MCPToolServer.CallTool(Name, Args, ...);
```

### `AnthropicToolRunner` (Anthropic app)

Currently builds a limited tool set úr explicit message tegund heitis. With `MCP Tool Server ori`:
- It getur either continue as-is (for curated tool sets) eða delegate to the tool server
- No breaking change needed
- Could be refactored til notkunar `MCP Tool Server ori.CallTool('invoke_message_type', ...)` internally

---

## Implementation Phases

### Phase 1: `MCP Tool Executor ori` (core app)

Move the executor pattern úr `AnthropicToolExecutor` í the core app.

**Files:** `app/src/BifrostChat/CEMCPToolExecutor.Codeunit.al`

### Phase 2: `MCP Tool Server ori` — Bootstrap + invoke_message_tegund

Implement the core kóðiunit with:
- `Bootstrap()` — runs the 4-step sequence, returns system prompt
- `ListTools()` — returns the ~16 tool definitions
- `CallTool()` — dispatches by tool heiti
- `list_message_types` passes `OnlyEnabled=true` to aðeins expose administrator-enabled tegunds
- Start með just `invoke_message_type`, `list_message_types`, `describe_message_type`, `who_am_i`

**Files:** `app/src/BifrostChat/CEMCPToolServer.Codeunit.al`

### Phase 3: Remaining Tools

Add the data tools (`get_records`, `set_records`, `get_record_ids`, `batch_records`), memory, blob tools (`get_blob`, `set_blob`, `list_blobs`, `delete_blobs`), og `storeJsonPaths` support.

### Phase 4: Provider Switch

Updagsetning `AnthropicChatProxy` til notkunar `MCP Tool Server ori`.

---

## Commit Behavior

All tool calls go through the dispatcher með **sjálfgefið commit behavior** (SleppiðCommit er never set to true).
This means every tool call exercises the full dispatcher pipelína including queue entry persistence.
The dispatcher handles commits internally — no special handling needed úr the tool server.

The model er instructed to ask fyrir notandi confirmation áður en calling write operations.
This er enforced at the prompt level, not the kóði level.

---

## Bootstrap System Prompt Template

```text
You are a Business Central assistant. You can use Bifrost tools to answer
questions with live data and perform actions in the user's BC environment.

RULES:
1. Use tools whenever the answer depends on live BC data or metadata.
2. Prefer read operations before write operations.
3. Before calling any write tool (set_records, batch_records, or invoke_message_type
   for posting/approval), explain what will change and ask the user for confirmation.
4. Keep answers concise and business-facing unless the user asks for technical detail.
5. If a tool fails, say what failed in plain language.
6. Do not mention secrets, credentials, or internal configuration values.

BLOB HANDLING:
- When a tool returns binary data (PDFs, images, files), you receive a blob reference
  like {{blob:<guid>}} with metadata (size, contentType) instead of the raw data.
- Pass blob references directly to other tools that accept binary input — the server
  resolves them automatically. Example: receive a PDF blob ref from one tool, pass it
  to Incoming.Document.Create in the next call.
- Never try to decode, display, or fabricate blob references.
- When calling invoke_message_type and expecting a large response (many records, big
  documents), use storeJsonPaths to specify which JSON paths should be stored as blob
  references instead of returned inline. Example:
  invoke_message_type({ type: "Data.Records.Get", data: "...", storeJsonPaths: ["$.records"] })
  This keeps your context small. You can pass the blob reference to the next tool, or
  use get_blob to inspect it (with maxChars to limit size).
- Use set_blob to store large text you want to forward to another tool without it
  filling your context.
- Use list_blobs to see what's stored. Use delete_blobs to free memory when done.

IDENTITY:
{who_am_i JSON}

LANGUAGE: Reply in {language name from who_am_i}.

{admin system prompt if any}

MEMORY AVAILABLE:
{user memory descriptions}
{company memory descriptions}

API PRIMER:
{Help.Bifrost.Get response}
{Help.Implementation.Get response for Help.Bifrost.Get}

{record context if viewing a specific record}
```

---

## Risks

| Risk | Mitigation |
|------|-----------|
| Bootstrap adds latency at session start (4 dispatcher calls) | All eru fast in-process calls (~5ms each); total ~20ms |
| Some message tegunds may not exist in the installed app version | `invoke_message_type` gracefully returns an villa ef enum gildi er invalid |
| Tool niðurstaða too large fyrir model context | Truncate at 20KB; blob store handles large base64 via references |
| SingleInstance state stale across company switches | `Bootstrap()` getur be called again to refresh; provider calls it on company change |
| Disabled message tegunds called via invoke_message_tegund | OnlyEnabled on list_message_tegunds hides them úr discovery; direct calls still work but model won't know about them |

---

## Tókst Criteria

1. `MCP Tool Server ori.Bootstrap()` returns a well-formed system prompt in &lt; 100ms
2. `MCP Tool Server ori.ListTools()` returns 16 tool definitions með correct schemas
3. `MCP Tool Server ori.CallTool('invoke_message_type', { type: 'Data.Records.Get', ... })` returns correct data
4. `list_message_types` aðeins returns message tegunds með `Enabled = true`
5. Blob store correctly replaces large base64 með references og resolves them on input
6. Svar time per tool call &lt; 50ms

---

## Object IDs Needed

| Codeunit | ID | Notes |
|----------|----|-------|
| `MCP Tool Server ori` | TBD | Check highest used in range |
| `MCP Tool Executor ori` | TBD | |

Check existing usage in `app.json` eða sgetur `src/` fyrir the next available IDs in 10077885–10078384.
