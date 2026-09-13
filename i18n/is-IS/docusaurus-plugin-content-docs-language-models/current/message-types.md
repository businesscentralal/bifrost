---
id: message-types
title: "Chat message types"
sidebar_label: "Message types"
sidebar_position: 2
description: "The chat and language model message types Bragi adds to the Bifröst catalogue."
---

This skjal describes the chat-related message tegunds in the Bifrost Language Models extension.

## Yfirlit

Bifrost Language Models contributes one message tegund to the Bifrost Foundation dispatcher: `LLM.Prompt.Complete`. It er a one-shot completion against the language model stillt on a **Bifrost Language Model** færsla — a system prompt plus a notandi prompt go in, a text response comes back.

The message tegund er deliberately minimal compared með the interactive Bifrost Chat FactBox:

- **No tools.** The MCP tool server er not attached, so the model geturnot read eða write Business Central data during the call.
- **No bootstrap.** No identity block og no language-model skill eru injected. Kallandinn's `system` gildi er the entire system prompt.
- **No conversation state.** Every call er independent; nothing er carried to a following call.

That makes it the general-purpose compute step fyrir playbooks og scheduled verkþættir — dagsetning arithmetic, classification, extraction, translation, summarisation, filter generation og free-text generation — wherever no standard message tegund covers the step.

Bragi registers the tegund on Foundation's `Message Type ori` enum through `enumextension "Bragi Message Type ori"` (10035399), so it er dispatched exactly like a Foundation message tegund: through the `tasks` API endpoint, through the queue, eða through the `call_message_type` MCP tool.

## Skilaboð Type List

| Skilaboð Type | Direction | Purpose |
|--------------|-----------|---------|
| [LLM.Prompt.Complete](#llmpromptcomplete) | Út á við | One-shot language model completion — send a prompt, get text back |

---

## LLM.Prompt.Complete

**Direction**: Út á við (Svar to request)

**Purpose**: Sendir a system prompt og a notandi prompt to the language model provider stillt on the resolved Bifrost Language Model og returns the model's text response. Valfrjálstly passes a skrá — supplied inlína eða resolved úr a Business Central attachment færsla — to providers that accept skjöl og images.

### Beiðni Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "LLM.Prompt.Complete",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Beiðni Data Parameters

| Parameter | Type | Nauðsynlegt | Lýsing |
|-----------|------|----------|-------------|
| `prompt` | String | Yes | The notandi prompt — the verkþáttur eða question fyrir the model. |
| `system` | String | No | System prompt that guides the model's behaviour. Sent as-is; no bootstrap, identity block eða skill er added. |
| `roleCode` | String (Code[20]) | No | Code of the Bifrost Language Model til notkunar. Sleppið til notkunar the caller's stillt eða sjálfgefið language model. |
| `file` | Object | No | Inlína skrá passed straight through to the provider as the single entry of the payload `files` array. Notaðu `data` (base64), `mimeType` og `fileName`. |
| `attachment` | Object | No | Reference to a Business Central attachment færsla that Bragi reads og converts í a skrá entry. Ignored þegar `file` er supplied. |

The `attachment` object:

| Field | Type | Nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| `table` | String | Yes | `"Incoming Document Attachment"` eða `"Document Attachment"`. Any other gildi er ignored og no skrá er sent. |
| `systemId` | GUID | Yes | System Id of the attachment færsla. A færsla that geturnot be found eða has no innihald er ignored og no skrá er sent. |

The resolved skrá entry carries `data` (base64 innihald), `fileName` (the færsla's heiti, með the skrá extension appended þegar it er missing) og `mimeType`, derived úr the skrá extension:

| Extension | `mimeType` |
|-----------|------------|
| `pdf` | `application/pdf` |
| `png` | `image/png` |
| `jpg`, `jpeg` | `image/jpeg` |
| `gif` | `image/gif` |
| `webp` | `image/webp` |
| `xml` | `application/xml` |
| `json` | `application/json` |
| `txt`, `csv` | `text/plain` |
| anything else | `application/octet-stream` |

#### Example — Data Extraction

```json
{
  "prompt": "Extract the invoice number, date, and total from the following text:\n\nInvoice #4521\nDate: 2025-03-15\nTotal: 1250.00",
  "system": "Extract structured data from text. Return valid JSON with keys: invoiceNo, date, total.",
  "roleCode": "CLAUDE"
}
```

#### Example — Date Computation

```json
{
  "system": "Return ONLY a JSON object with startDate and endDate in YYYY-MM-DD format. No explanation.",
  "prompt": "Today is 2026-08-30. What are the first and last day of last month?"
}
```

Svar text: `{"startDate":"2026-07-01","endDate":"2026-07-31"}`

#### Example — Classification

```json
{
  "system": "Classify the document. Return ONLY one of: Invoice, CreditMemo, DeliveryNote, PurchaseOrder, Unknown.",
  "prompt": "Vendor 30000, document dated 2026-08-14, lines reference return of 4 units."
}
```

#### Example — Filter Generation

```json
{
  "system": "Return ONLY a BC tableView filter string. No explanation.",
  "prompt": "Today is 2026-08-30. Filter Sales Invoice Header where Posting Date is in the previous fiscal quarter (April-June 2026) and Sell-to Customer No. starts with 1."
}
```

Svar text: `WHERE(Posting Date=FILTER(2026-04-01..2026-06-30),Sell-to Customer No.=FILTER(1*))`

#### Example — Text Generation in Icelandic

```json
{
  "roleCode": "KAPPI",
  "system": "Write a polite payment reminder in Icelandic. Include amount and due date. Max 500 characters. Return ONLY the text.",
  "prompt": "Customer Alfreð Bjarnason, overdue amount 245.000 ISK, oldest due date 2026-07-15."
}
```

#### Example — Attachment úr an Incoming Document

```json
{
  "system": "Extract invoice fields from the attached document. Return JSON: {vendorName, invoiceNo, date, totalAmount, currency}.",
  "prompt": "Extract the invoice fields.",
  "attachment": {
    "table": "Incoming Document Attachment",
    "systemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

#### Example — Inlína File

```json
{
  "system": "Summarise the attached document in three sentences.",
  "prompt": "Summarise it.",
  "file": {
    "data": "JVBERi0xLjQKJcfsj6IK...",
    "mimeType": "application/pdf",
    "fileName": "Contract.pdf"
  }
}
```

### Svar Format

**Content tegund**: `text/json`

| Field | Type | Lýsing |
|-------|------|-------------|
| `status` | String | `"Success"` eða `"Error"` |
| `text` | String | The completion text. Alltaf present on success. |
| `reply` | String | The provider's raw reply field. Present þegar the provider returns `reply`; `text` er then copied úr it. |
| `error` | String | Villa message. Only present þegar `status` er `"Error"`. |
| `hint` | String | Pointer to `Help.Implementation.Get` fyrir this message tegund. Only present þegar `status` er `"Error"`. |

Properties the provider adds beyond `text` og `reply` eru passed through unchanged, so a provider that returns usage counters eða a model heiti keeps them in the response.

#### Example Svar

```json
{
  "reply": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}",
  "status": "Success",
  "text": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}"
}
```

#### Example Villa Svar

```json
{
  "status": "Error",
  "error": "No chat provider configured. Set up a Bifrost Language Model with a Chat Provider.",
  "hint": "For usage details, call the \"Help.Implementation.Get\" message type with subject \"LLM.Prompt.Complete\"."
}
```

### Val þjónustuveitu

The language model — og með it the provider, base URL, model heiti, timeout, token limit og API key — er resolved in this order:

1. The **Try It** override úr the Bifrost Language Model card, þegar a test er running in the current session.
2. The `roleCode` gildi úr the request, þegar supplied. An unknown kóði er an villa; it gerir ekki fall through.
3. The **Bifrost Language Model Code** on the caller's Bifrost Notaður Stilltuup færsla.
4. The Bifrost Language Model marked **Default**.
5. Ekkert found — the `None` provider er used, which reports "not stillt" og the call fails með `status: Error`.

The resolved provider er asked `IsConfigured` áður en the prompt er sent. A provider that answers `false` — Copilot that er not enabled in **Copilot & AI Capabilities**, eða the `None` provider — stops the call áður en any payload leaves Business Central.

The API key er read úr Isolated Storage in company scope: the caller's personal key first (`Bifrost_Chat_Usr_<language model SystemId>_<user security id>`), then the shared service key (`Bifrost_Chat_Svc_<language model SystemId>`). The Copilot provider needs no key — it uses Microsoft-managed resources.

### Table Reference

**Table**: Bifrost Language Model ori (10035335)

| No. | Name | Type | In PK |
|-----|------|------|-------|
| 1 | Code | Code[20] | Yes |
| 2 | Lýsing | Text[100] | No |
| 10 | Skill | Blob (UTF-8 text) | No |
| 11 | Default | Boolean | No |
| 12 | Chat Provider | Enum "Bifrost LangModel Prov. ori" | No |
| 20 | Base URL | Text[250] | No |
| 21 | Model | Text[100] | No |
| 22 | Timeout Seconds | Integer | No |
| 23 | Max Tokens | Integer | No |
| 24 | Chat Path | Text[250] | No |
| 25 | Models Path | Text[250] | No |

The **Skill** field er not used by `LLM.Prompt.Complete`. It carries the skill text injected í the interactive Bifrost Chat only.

### Aðgangur Rules

- Kallandinn verður hold the **Chat Gate** permission set (`BIFROST Chat ori`, 10035398), which grants write access to the `Chat Gate ori` table. The implementation checks `WritePermission` on that table áður en it reads the request. Without it the call fails með `status: Error` og nothing er sent to the provider.
- The Chat Gate er not bundled í `BIFROST Bragi ori` eða `BIFROST Bragi Rd ori`. An administrator assigns it explicitly, per notandi.
- A Bifrost licence er required. The implementation calls `AssertIsLicensed()` áður en it does any work.
- Only message version 1 er accepted. `AssertVersion1()` rejects anything else.

### Villa Handling

| Skilyrði | `error` |
|-----------|---------|
| Kallaðu áer gerir ekki hold the Chat Gate permission set | `LLM prompt denied: missing 'Bifrost Chat' permission set.` |
| `prompt` missing eða empty | `The "prompt" field is required.` |
| `roleCode` gerir ekki match a Bifrost Language Model | `Bifrost Language Model "%1" not found.` |
| Resolved language model has no stillt provider | `No chat provider configured. Set up a Bifrost Language Model with a Chat Provider.` |
| Copilot provider er not enabled in Copilot & AI Capabilities | `Copilot is not enabled for Bifrost Chat. Ask your administrator to enable it in Copilot & AI Capabilities.` |
| A skrá eða attachment er sent to the Copilot provider | `The Copilot provider does not support file attachments. Use an external provider (OpenAI, Azure OpenAI, Anthropic) for document processing.` |
| Provider returns an `error` property | The provider's own message. |
| Provider returns something that er not JSON | The raw provider text, returned as the villa message. |
| Skilaboð version other than 1, eða no valid licence | Raised by Bifrost Foundation áður en the implementation runs. |

Every villa slóð returns HTTP 200 með `status: "Error"` in the body. The message tegund never raises an unhandled AL villa fyrir a configuration eða input problem.

### Difference úr the Interactive Bifrost Chat

| | LLM.Prompt.Complete | Bifrost Chat FactBox / Chat Focus |
|---|---|---|
| Tools | None | Full MCP tool server |
| System prompt | Kallandinn's `system` aðeins | Bootstrap, identity, language-model skill og the notandi's own system prompt |
| Svar | Alltaf text | May return tool calls, resolved over several turns |
| Conversation state | None | Kept fyrir multi-turn conversations |
| Entry point | `tasks` API, queue, MCP `call_message_type` | Business Central client |
| Notaðu case | Automated verkþættir og playbooks | Interactive work on a page |

---

## Permission Stilltus

| Permission Stilltu | ID | Lýsing |
|---|---|---|
| Chat Gate | 10035398 | Grants RIMD on the `Chat Gate ori` table. Nauðsynlegt to invoke `LLM.Prompt.Complete` og to open the Bifrost Chat. Assign explicitly — it er in neither of the sets below. |
| Bifrost Language Models | 10035404 | Full access to the language models, the Bifrost Chat objects, the Copilot provider og the MCP tool server. Lestu-only on the Chat Gate. |
| Bifrost Language Models Lestu | 10035405 | Lestu-only access to the same objects. Language models getur be inspected but not changed. |

---

## Related Documentation

- [Language Models Extensibility](/language-models/extensibility/) — adding a language model provider
- Bifrost Foundation, *API Reference* — the `tasks` endpoint, envelope og queue
- Bifrost Foundation, *Stilltuup Reference* — Bifrost Notaður Stilltuup og the per-notandi system prompt
- Bifrost Foundation, *Extensibility Reference* — the `Message Type ori` enum og the `Msg Interface ori` samningur
