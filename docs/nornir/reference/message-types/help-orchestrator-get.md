---
id: help-orchestrator-get
title: "Help.Orchestrator.Get"
sidebar_label: "Help.Orchestrator.Get"
sidebar_position: 1
description: "Request and response contract for the Help.Orchestrator.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


20 Bifrost message types for managing job queues, building workflow playbooks, and generating reports.
Call `Help.Implementation.Get` with `subject = "<type>"` for per-type technical guides.

## Quick Decision Tree for AI Agents

**I need to...**
- Check orchestrator health → `Orchestrator.Status.Get`
- Restart the orchestrator → `Orchestrator.Status.Restart` or `Orchestrator.Status.RestartIfNeeded`
- Run an orchestrator entry now → `Orchestrator.Entry.Run`
- Restart a failed entry → `Orchestrator.Entry.Restart` or `Orchestrator.JobQueueEntry.Restart`
- Register a JQ entry → `Orchestrator.Entry.Register`
- Schedule an entry → `Orchestrator.Entry.Schedule`
- Build a workflow → Create playbook + steps via `Data.Records.Set`, set request templates with `@` workspace references
- Run a workflow → `Orchestrator.Playbook.Run`
- Queue a workflow for later → `Orchestrator.Playbook.Enqueue`
- Send a Telegram message → `Orchestrator.Telegram.Message`
- List available reports → `Orchestrator.Report.List`
- Get report details + layouts → `Orchestrator.Report.Get`
- Generate PDF/Excel/Word report → `Orchestrator.Report.SaveAs`
- Run a batch job / processing-only report → `Orchestrator.Report.Run`
- See what workspace variables are available → `Orchestrator.Workspace.Preview`

## Message Types (20)

| Type | Description |
|---|---|
| `Orchestrator.Entry.Run` | Execute entry immediately (one-time) |
| `Orchestrator.Entry.Restart` | Restart a failed/held entry |
| `Orchestrator.Entry.Register` | Register a Job Queue Entry as an orchestrator entry |
| `Orchestrator.Entry.Schedule` | Delete + immediately reschedule entry |
| `Orchestrator.Email.Send` | Send an email (same params as Email.Draft.Set) |
| `Orchestrator.Status.Get` | Get orchestrator health + entry counts |
| `Orchestrator.Status.Restart` | Restart orchestrator unconditionally |
| `Orchestrator.Status.RestartIfNeeded` | Restart only if not running |
| `Orchestrator.JobQueueEntry.Restart` | Restart any Job Queue Entry |
| `Orchestrator.JobQueueEntry.RestartIfNeeded` | Restart only if in Error/On Hold |
| `Orchestrator.Playbook.Run` | Execute playbook, return results |
| `Orchestrator.Playbook.Schedule` | Schedule playbook as an Orchestrator Entry with recurring template |
| `Orchestrator.Playbook.Enqueue` | Queue playbook for one-time execution with custom data |
| `Orchestrator.Telegram.Message` | Send a Telegram message to the current user |
| `Orchestrator.Report.List` | List available reports with metadata |
| `Orchestrator.Report.Get` | Get report details, layouts, and saved preset |
| `Orchestrator.Report.SaveAs` | Generate report output (PDF, Excel, Word, XML) |
| `Orchestrator.Report.Run` | Run a processing-only report (batch job) |
| `Orchestrator.Workspace.Preview` | Preview seeded workspace (_sys dates, _who user context) |
| `Help.Orchestrator.Get` | This help document |

## Run Reporting — `_run` and `_steps`

The runner maintains two reserved top-level workspace keys. Reference them together
as `@_run,_steps` to hand a language model the whole execution narrative with none of
the bulk data the steps collected.

`_run` — playbook status:
```json
{ "playbookCode": "MONTHEND", "instanceId": "...", "durationMs": 41230,
  "stepsExecuted": 7, "stepsSucceeded": 5, "stepsFailed": 2, "stepsSkipped": 1,
  "itemsProcessed": 143, "itemsFailed": 2, "failed": true,
  "firstFailedStepNo": 30, "failedStepNos": [30, 50] }
```

`_steps.<stepNo>` — one entry per step, accumulating across pages and iterations:
```json
{ "stepNo": 30, "description": "Post sales invoices", "messageType": "Sales.Document.Post",
  "status": "Failed", "durationMs": 1180, "iterated": true, "pages": 1,
  "items": { "total": 5, "succeeded": 3, "failed": 2, "skipped": 0, "checkFailed": 0 },
  "failures": [ { "iteration": 2, "outcome": "Failed",
                  "item": { "no": "103002", "name": "CRONUS Ltd." },
                  "error": "Posting Date is not within your range." } ],
  "result": { "postedInvoices": 3, "totalAmount": 45280 } }
```

`_run.itemsProcessed` is the total number of *iterations* across every forEach step,
not the number of distinct items the playbook handled. Three customers taken through
four forEach steps count as twelve. When a report needs "how many customers", read
`_steps.<no>.items.total` for the specific step, and say which step it came from —
a language model handed `itemsProcessed` will confidently call it a customer count.

`failures` is capped at 20 entries per step (`failuresTruncated` flags the cut), errors
are truncated to 500 characters, and `item` is a projection of at most 5 scalar fields.
The counts stay exact regardless. The full request, response and error text remain in
the step log — filter it by `@_run.instanceId` when the report needs more.

`result` is populated from the step's `Summary Paths`, which is deliberately separate
from `Result Log Paths`: the latter feeds later steps and often carries large arrays,
the former feeds the report and must stay small.

### The reporting tail

A notification tail is four steps: compose and send for success, compose and send for
failure. Every step carries `Exclude From Run Status`. This is the shape running in
production, verified on both branches:

```
Step 900  Start: _run.failed Equals false        [Exclude From Run Status]
          AND _who.telegramChatId Exists
          LLM.Prompt.Complete  prompt "@_run,_steps"
          Result Log Paths: text>noticeText       → next 910 on BOTH edges
Step 910  Start: 900.noticeText Exists           [Exclude From Run Status]
          Orchestrator.Telegram.Message  {"message":"@900.noticeText"}
                                                  → next 920 on BOTH edges
Step 920  Start: _run.failed Equals true         [Exclude From Run Status]
          ... same shape, → 930
Step 930  Start: 920.noticeText Exists           [Exclude From Run Status]
```

Four rules, each of which cost a debugging round to learn:

1. **Point both edges at the next tail step.** A tail step that is skipped, or that
   fails because a provider was down, must not end the chain — the other branch still
   has to get its chance. Leaving `Next Step No. (Failure)` at 0 silently drops the
   failure notification exactly when it is most wanted.
2. **Guard the send step on the composed text existing**, not on the run outcome. If
   the compose step was skipped there is nothing to send, and the model occasionally
   returns an empty completion even when it succeeds.
3. **Guard on the delivery address too.** `_who.telegramChatId Exists` AND
   `NotEquals ""` — a user with no chat ID should skip the notice, not fail the run.
4. **The whole tail is excluded from run status**, so it never narrates itself or
   inflates the totals the notice is about.

### `_tail` — where excluded steps are recorded

An excluded step is not dropped from the workspace; it is recorded under `_tail.<no>`
with the same shape as a `_steps` entry. It stays out of `_run` totals and out of the
`@_run,_steps` dump the report is built from, while remaining referenceable — so one
tail step can condition on another's outcome via `_tail.910.status`.

Do not confuse the two namespaces a step writes to:

| Written by | Path | Purpose |
|---|---|---|
| `Result Log Paths` | `<stepNo>.<field>` | Data for later steps. Unaffected by exclusion |
| `Summary Paths` | `_steps.<no>.result` or `_tail.<no>.result` | Figures for the report |
| the runner | `_steps.<no>` or `_tail.<no>` | Status, duration, errors, item counts |

This is why the send step above references `@900.noticeText` and not
`@_tail.900.result.noticeText`: `Result Log Paths` writes to the step-number
namespace whether or not the step is excluded.

## Common Playbook Step Types (from Core Library)

Playbook steps can call **any** registered message type. These are the most commonly used:

| Type | Purpose | Help |
|---|---|---|
| `Data.Records.Get` | Read records from any BC table | `Help.Implementation.Get` subject `Data.Records.Get` |
| `Data.Records.Set` | Write/update records in any BC table | `Help.Implementation.Get` subject `Data.Records.Set` |
| `LLM.Prompt.Complete` | One-shot AI completion for reasoning, formatting, decisions | `Help.Implementation.Get` subject `LLM.Prompt.Complete` |
| `Email.Draft.Set` | Create email draft with attachments | `Help.Implementation.Get` subject `Email.Draft.Set` |
| `Customer.Statement.Pdf` | Generate customer statement PDF | `Help.Implementation.Get` subject `Customer.Statement.Pdf` |
| `Iceland.Kennitala.Validate` | Validate Icelandic kennitala | `Help.Implementation.Get` subject `Iceland.Kennitala.Validate` |
| `Iceland.AddressInfo.Get` | Lookup address from national registry | `Help.Implementation.Get` subject `Iceland.AddressInfo.Get` |
| `DocumentExchange.Advania.*` | E-document exchange (GetUnread, GetDocument, UpdateStatus) | `Help.Implementation.Get` subject `DocumentExchange.Advania.GetUnread` |

**When no standard message type fits** → use `LLM.Prompt.Complete` as the glue step.
Always call `Help.Implementation.Get` with the message type name before using it in a playbook.

## Playbook Workflow Engine — Concepts

A **Playbook** is a named sequence of message type calls with data flow through a shared **Workspace**.

### Execution Model

- Each step calls one Bifrost message type
- Steps execute sequentially; each step's writes commit independently
- **No rollback** of previous steps on failure
- Steps branch on success/failure via `Next Step No. (Success)` / `Next Step No. (Failure)`
- Step 0 as next = end playbook (success or failure depending on path)
- Full request/response logged per step for audit and replay

### Data Flow — Workspace + @Templates

All data flows through a **single JSON workspace document**. Two phases:

**Phase 1 — Gather:** Steps execute and write results to workspace via `Result Log Paths`.
Data is keyed by step number (and iteration number for forEach):
- Single step: `<StepNo>.<fieldName>` (e.g. `10.company`)
- forEach step: `<StepNo>.<IterationNo>.<fieldName>` (e.g. `20.0.valid`, `20.1.valid`)
- Initial request: stored at `_initial` (e.g. `_initial.invoiceNo`)
- Current forEach element: stored at `_current` during each iteration
- System constants: stored at `_sys` (dates, company, user)
- WhoAmI context: stored at `_who` (user profile, salesperson, company info)

**Phase 2 — Build:** Request templates use `@path` references resolved from workspace:

| Syntax | Resolves to | Example |
|---|---|---|
| `"@path"` | Single value/object/array (type-preserving) | `"@10.company.fields.Name"` → `"CRONUS Ltd."` |
| `"@_current.field"` | Current forEach element field | `"@_current.fields.No_"` → `"10000"` |
| `"@_initial.key"` | Initial request parameter | `"@_initial.invoiceNo"` → `"103002"` |
| `"@_iter"` | Current forEach iteration index | `"@30.@_iter.street"` → resolves to `"@30.0.street"` then to the value |
| `"@_sys.field"` | System constant | `"@_sys.today"` → `"2026-08-30"`, `"@_sys.lastMonthStart"` → `"2026-07-01"` |
| `"@_who.path"` | WhoAmI user/company context | `"@_who.salesperson.email"` → `"user@company.is"` |
| `"@collect:N"` | All iterations of step N as array | `"@collect:25"` → `[{...}, {...}]` |
| `"@k1,k2,k3"` | Filtered workspace dump (escaped string) | `"@10,20,30"` → `"{\"10\":...}"` |
| `@path` (embedded) | Text interpolation within a string | `"WHERE(No.=CONST(@_initial.id))"` |

Numeric strings are auto-detected and injected as JSON numbers.

### Result Log Paths

The `Result Log Paths` field controls what data each step writes to workspace.
Comma-separated, supports `source>target` renaming:

| Syntax | Source in response | Stored at (single step 10) |
|---|---|---|
| `result` | `result` | `10.result` |
| `result>customers` | `result` | `10.customers` |
| `result[0]>invoice` | First element of `result` | `10.invoice` (no array wrapper) |
| `result.valid>valid` | `result.valid` | `10.valid` |

### ForEach Iteration

A step with `Iterate Array Path` set becomes a foreach loop:
- Extracts an array from a prior step's response (via ResponseStore)
- Executes the message type once per array element
- `@_current` in the request template resolves to the current element
- `Stop On Item Error` controls whether to abort on first failure
- Each iteration writes to workspace at `<StepNo>.<IterationNo>.<field>`
- The iterator element is also stored at `<StepNo>.<IterationNo>._item`
- Use `@collect:N` to gather all iterations into an array

### Conditions

Steps can evaluate the response to determine success/failure:
Conditions live in `Playbook Condition ori`, keyed by playbook, step, type, group and line.

| Type | Evaluated | Against | Effect |
|---|---|---|---|
| `Start` | before the step | workspace | False = step is Cancelled, chain follows the success path |
| `Success` | after the step | response | Picks the success or failure branch |
| `Error` | after the step | workspace | True = mark the run failed, branch unchanged |

**All conditions in a group must hold. Any group holding is enough.**
AND within a `Group No.`, OR across groups — every boolean expression can be
written that way, so there is no nesting, precedence or parentheses to learn.
An empty condition set is true.

```
Type   Group  Path                       Operator   Value
Start  1      _run.failed                Equals     true
Start  2      _steps.30.items.succeeded  Equals     0
Start  2      _steps.30.status           NotEquals  Cancelled
```

Operators: Equals, NotEquals, Contains, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual, Exists.

### `status Equals Success` is not enough

A message type reports `Success` when it did what was asked, and finding nothing is
doing what was asked. `Data.Records.Get` over a filter that matches no rows returns
`{"status":"Success","noOfRecords":0,"result":[]}`. A step guarded only on `status`
accepts that, the forEach below it iterates zero times and also succeeds, and the run
ends Completed having done nothing — with the real cause several steps upstream.

Add the second condition in the same group, so both must hold:

```
Type     Group  Line   Path          Operator      Value
Success  1      10000  status        Equals        Success
Success  1      20000  noOfRecords   GreaterThan   0
```

Then decide what an empty result *means*. If the playbook has nothing to do when the
query is empty, that is a `Check` step — it routes down the failure edge to a tidy
ending without marking the run failed. If an empty result means something upstream is
broken, leave it an `Action` so the run fails and names this step.

### Step Type — checks are not errors

- `Action` (default): a false Success condition means the step failed, and the run fails.
- `Check`: a false Success condition is simply the answer. It still routes down the
  failure path and still drives `Skip If Step Failed`, but it does **not** fail the run.

Use `Check` for validations and predicates — "is this kennitala valid", "did the
address match", "are there any documents to import". A step asking a question and
getting "no" has not failed.
- If no condition set, step succeeds whenever the message type doesn't throw an error

## Building Workflows via Data.Records.Set/Get

### Tables

| Table | Purpose | Primary Key |
|---|---|---|
| `Playbook ori` | Playbook header (name, schedule, template) | Code[20] |
| `Playbook Step ori` | Step definition (message type, template, branching) | (PlaybookCode, StepNo_) |
| `Playbook Condition ori` | Start/Success/Error conditions, one row per condition | (PlaybookCode, StepNo_, ConditionType, GroupNo_, LineNo_) |
| `Recurring Template ori` | Reusable schedule template (days, time, interval) | Code[20] |
| `Playbook Instance ori` | Execution log (per run) | ID (Guid) |
| `Playbook Step Log ori` | Per-step execution detail | (Instance ID, Step No., Iteration No.) |

### Example: E-Document Send Playbook (BII1 invoice via Advania)

**Step 1: Create the playbook**
```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook ori",
  "data": [{ "primaryKey": { "Code": "EDOC-SEND" },
    "fields": { "Description": "Send invoice via Advania" } }]
} }
```

**Step 2: Add steps with request templates**
Request templates are BLOB fields — pass base64-encoded JSON:
```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook Step ori",
  "data": [
    { "primaryKey": { "PlaybookCode": "EDOC-SEND", "StepNo_": 10 },
      "fields": { "Description": "Get company info",
        "MessageType": "Data.Records.Get",
        "RequestTemplate": "<base64 of {\"tableName\":\"Company Information\",...}>",
        "ResultLogPaths": "result[0]>company",
        "NextStepNo_Success": 20 } },
    { "primaryKey": { "PlaybookCode": "EDOC-SEND", "StepNo_": 20 },
      "fields": { "Description": "Render BII1 XML",
        "MessageType": "DocumentExchange.UBL.RenderBilling",
        "RequestTemplate": "<base64 of template with @10.company.fields.Name etc>",
        "ResultLogPaths": "xml,success" } }
  ] } }
```

**Step 3: Run with parameters**
```json
{ "type": "Orchestrator.Playbook.Run", "data": {
  "playbookCode": "EDOC-SEND",
  "initialRequest": { "invoiceNo": "103002" } } }
```
The `initialRequest` is stored in workspace at `_initial`, accessible as `@_initial.invoiceNo`.

### Writing conditions

Conditions are ordinary records. One row per condition, `Line No.` spaced like step
numbers so rows can be inserted between:

```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook Condition ori",
  "data": [
    { "primaryKey": { "PlaybookCode": "EDOC-SEND", "StepNo_": 10,
        "ConditionType": "Success", "GroupNo_": 1, "LineNo_": 10000 },
      "fields": { "Path": "status", "Operator": "Equals", "Value": "Success" } },
    { "primaryKey": { "PlaybookCode": "EDOC-SEND", "StepNo_": 10,
        "ConditionType": "Success", "GroupNo_": 1, "LineNo_": 20000 },
      "fields": { "Path": "noOfRecords", "Operator": "GreaterThan", "Value": "0" } }
  ] } }
```

**Write enum fields by their AL name, not their caption.** `Operator` accepts
`NotEquals`, `GreaterOrEqual`, `LessOrEqual`; it rejects `Not Equals`. `ConditionType`
accepts `Start`, `Success`, `Error`. `Step Type` accepts `Action`, `Check`.

**A `Data.Records.Get` on these tables gives back captions, not names.** An is-IS
session reads `Operator: "Ekki jafnt"`, `ConditionType: "Upphaf"`. Requesting
`lcid: 1033` does not fix it: the English caption for `NotEquals` is `Not Equals`,
with a space, and `Set` rejects that too. Some names and captions coincide —
`Equals`, `Exists`, `Start` — which makes the failure look intermittent.

So a read-modify-write cycle over conditions cannot feed its own output back in.
Map captions to AL names yourself, or keep the intended values beside the code that
writes them rather than recovering them from a Get.

## Scheduling Playbooks for Recurring Execution

Playbooks can run on a recurring schedule via the Job Queue. Two approaches:

### Option A: Use a Recurring Template (recommended)

Templates define reusable schedules (days, time window, interval).

**1. Create or find a template:**
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Recurring Template ori" } }
```

**2. Create a template if needed:**
```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Recurring Template ori",
  "data": [{ "primaryKey": { "Code": "WORKDAYS" },
    "fields": { "Description": "Weekdays 08-18 every 30 min",
      "RunonMondays": true, "RunonTuesdays": true, "RunonWednesdays": true,
      "RunonThursdays": true, "RunonFridays": true,
      "RunonSaturdays": false, "RunonSundays": false,
      "StartingTime": "08:00:00", "EndingTime": "18:00:00",
      "No_ofMinutesbetweenRuns": 30 } }]
} }
```

**3. Assign template to playbook (auto-copies schedule fields):**
```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook ori",
  "data": [{ "primaryKey": { "Code": "MY-PLAYBOOK" },
    "fields": { "RecurringTemplateCode": "WORKDAYS" } }]
} }
```
When a template is set, the playbook's schedule fields (days, times, interval) are
automatically populated from the template and locked from manual editing.

### Option B: Set schedule directly on the playbook

```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook ori",
  "data": [{ "primaryKey": { "Code": "MY-PLAYBOOK" },
    "fields": { "RunonMondays": true, "RunonTuesdays": true,
      "RunonWednesdays": true, "RunonThursdays": true, "RunonFridays": true,
      "StartingTime": "06:00:00", "EndingTime": "22:00:00",
      "No_ofMinutesbetweenRuns": 60 } }]
} }
```

### Activating the schedule

After setting the schedule, use the **Schedule** action on the Playbook Card page
to create the Job Queue Entry. This creates a recurring JQ Entry pointing to the
Bifrost Playbook JQ Dispatcher codeunit with the playbook's RecordId.

**Key playbook fields for scheduling:**

| Field | Type | Purpose |
|---|---|---|
| `RecurringTemplateCode` | Code[20] | Links to JQ Recurring Template (optional) |
| `No_ofMinutesbetweenRuns` | Integer | Run interval in minutes |
| `RunonMondays`..`RunonSundays` | Boolean | Which days to run |
| `StartingTime` | Time | Earliest time of day |
| `EndingTime` | Time | Latest time of day |
| `Scheduled` | Boolean (FlowField) | Whether a JQ Entry exists (read-only) |
| `JobQueueEntryID` | Guid | The created JQ Entry ID (read-only) |

## Using LLM.Prompt.Complete in Playbooks

`LLM.Prompt.Complete` is the general-purpose AI step for tasks not covered by dedicated message types.
Always set `roleCode` in the request template to control cost and speed (e.g. `HAIKU` for simple tasks).

### Pattern 1: Yes/No Gate (per-item decision)

Use LLM as a forEach decision step. The success condition determines the branch:

```json
// Step 35 template — forEach, condition: text Contains "No"
{ "roleCode": "HAIKU",
  "system": "Compare two addresses. Answer ONLY Yes or No.",
  "prompt": "BC: @_current.fields.Address, @_current.fields.PostCode\\nRegistry: @30.@_iter.street, @30.@_iter.postCode" }
```

- Condition `text Contains "No"` → mismatch = Completed → downstream step runs
- Condition false ("Yes") → Cancelled → downstream `Skip If Step Failed` skips it
- Use `@_iter` to reference same-iteration data from prior forEach steps

### Pattern 2: Text Formatting (summary/report generation)

Collect workspace data from multiple steps and format for output:

```json
// Step 48 template — single step, workspace dump
{ "roleCode": "HAIKU",
  "system": "Create a report for Telegram. Use only <b>, <i> tags. No <p>, <table>.",
  "prompt": "@10,20,30" }
```

- `@10,20,30` dumps filtered workspace data from steps 10, 20, 30 as a single string
- Always specify output constraints (Telegram tags, max chars, JSON-only, etc.)
- Store result via `ResultLogPaths: text>report` for downstream steps

### Pattern 3: Run Notification

Turn the run report into a human message. Do not describe the format — **show it**,
then show one filled-in example. A prompt that only lists rules produces output of
roughly the right shape and reliably the wrong length; the same prompt with a worked
example produces the shape exactly:

The `system` string, written out (each line below is a real newline in the JSON):

```text
JSON about an automated process that SUCCEEDED. Icelandic, for Telegram.
Format, exactly three lines:
OK <b>PLAYBOOK CODE</b>
<one sentence about what was achieved, with figures>
<i>x steps - y s</i>
Example:
OK <b>CUST-KT-SYNC</b>
5 customers checked, 4 valid kennitalas, 2 addresses updated.
<i>7 steps - 12 s</i>
Rules: use ONLY <b> and <i>, no other HTML and no Markdown asterisks. Real
line breaks, not <br>. durationMs is in MILLISECONDS - convert to seconds.
Take figures from _steps.*.result. No greeting, no signature.
Return ONLY the message.
```

and the step template that carries it:

```json
// Step 900 - Start: _run.failed Equals false, Exclude From Run Status
{ "roleCode": "HAIKU", "system": "<the text above>", "prompt": "@_run,_steps" }
```

Then `Result Log Paths: text>noticeText`, and send it from the next step with
`{"message":"@900.noticeText"}`. Failure notices are the same with `_run.failed`
inverted and `_run.firstFailedStepNo` named in the prompt.

Four things the model gets wrong unless told:

- **`durationMs` is milliseconds.** Unprompted it reports 41230 seconds.
- **`itemsProcessed` is iterations, not items.** Point the prompt at a named step.
- **Length.** State the limit *and* show it. SMS in Icelandic is UCS-2: 70 characters
  in one segment, 67 each once it splits — not the 160 of GSM-7 English.
- **Markup.** Telegram takes `<b> <i> <code> <a>`; anything else is a 400 from the
  API, so forbid other tags and Markdown asterisks explicitly.

Pick the role for the job. A small local model is fine for a Yes/No gate but writes
unidiomatic Icelandic and leaks its instructions into prose; `HAIKU` composes these
notices in about 1.5 seconds. Latency compounds — a per-item LLM gate in a forEach
over a slow local model turned a 12-second run into 397 seconds.

### Key Rules for LLM Steps

1. **Always set `roleCode`** — `HAIKU` for simple tasks (fast, cheap), larger models only when needed
2. **Always set success condition** — `status = Success` catches provider errors
3. **Constrain output format, and show the shape** — "Answer ONLY Yes/No", "Return ONLY JSON". For anything with a length limit, give the limit and a worked example of it; a rule alone is not enough
4. **Telegram-safe HTML** — only `<b>`, `<i>`, `<code>`, `<a>` tags. No `<p>`, `<table>`, `<div>`
5. **Response field is `text`** — use `ResultLogPaths: text>fieldName` to store LLM output in workspace

## Rules for AI Agents

1. **Use Data.Records.Get/Set for all CRUD** — reading/writing playbooks, steps, templates, credentials
2. **Use action message types for operations** — Run, Restart, Schedule, etc.
3. **Always check logs after Run** — read Playbook Instance ori and Playbook Step Log ori to verify
4. **Step numbering convention** — use 10, 20, 30... (allows inserting steps between)
5. **Request templates use `@path` syntax** — all data flows through the workspace, no separate bindings
6. **Request templates are BLOB fields** — set via Data.Records.Set by passing base64-encoded JSON as the field value
7. **Commits are permanent** — posting, document exchange, and other write operations cannot be undone by the engine
8. **Use `result[0]>name` in Result Log Paths** for single-record steps to avoid array wrapper in workspace
9. **Always add a Success condition** — one `Playbook Condition ori` row per step with `ConditionType=Success`, `Path=status`, `Operator=Equals`, `Value=Success` catches application-level errors. Set `StepType=Check` when a false answer is a legitimate result rather than a failure
10. **Use `@_iter` for cross-step forEach data** — in forEach templates, `@30.@_iter.fieldName` references another forEach step's data at the same iteration index
11. **Use `Disabled=true` to skip steps** — disabled steps follow the success path without executing. Use this instead of deleting steps.
12. **LLM steps should set `roleCode`** — add `"roleCode":"HAIKU"` (or other role) in the request template to control which model is used
13. **Data.Records.Get uses `tableView` not `filter`** — the parameter name for BC filters is `tableView`, e.g. `"tableView":"WHERE(Registration Number=FILTER(<>''))"`. Use English field names in tableView.
14. **Guard on the result, not just the status** — add `noOfRecords GreaterThan 0` beside `status Equals Success` on every query step whose emptiness would make the rest of the run pointless. See "`status Equals Success` is not enough".
15. **Write enum fields by AL name** — `NotEquals`, not the `Not Equals` caption a Get returns. Reads are localized; writes are not.
16. **Queue long playbooks instead of running them inline** — `Orchestrator.Playbook.Enqueue`, or an async invocation. A synchronous `Playbook.Run` that outlives the caller's HTTP timeout leaves its instance stuck in `Running` for ever: the client gives up, the server keeps going, and nothing ever writes the completion. Any playbook with an LLM step in a forEach is a candidate.
17. **Verify from the step log, not the response** — a `Playbook.Run` response that never arrived says nothing about whether the run succeeded. Read `Playbook Step Log ori` filtered by instance; it is written step by step as the run progresses.

## Execution Semantics

- **Playbook status = Failed** only when `StepsFailed > 0`. A playbook ending via a condition branch (NextStepNo_Failure = 0 with 0 step errors) is Completed.
- **forEach condition false = Cancelled** (not Failed). Does not increment StepsFailed. `Skip If Step Failed` still skips these iterations in downstream steps.
- **Single-step condition false = branch** — follows NextStepNo_Failure path. If that path is 0, playbook ends as Completed (not Failed).
- **Paged steps use the step's Request Template** — not the playbook's initial request. The engine injects `skip`/`take` into the template.
- **Paged step failure** — if a paged step fails, the engine follows the paged step's failure path (not the chain end step's).
- **Workspace snapshot** — on step failure, the workspace JSON is saved to the step log for debugging. Download via the Step Log subpage.
- **Start condition false = Cancelled, success path** — the step logs `Skipped: start conditions not met`, `stepsSkipped` increments, and the run is not failed. This is the mechanism the reporting tail is built on.
- **Check steps do not fail the run** — a `Check` whose Success condition is false is Cancelled and routes down the failure edge, but `StepsFailed` is untouched. Only a technical failure — the message type raising an error — fails a Check step.
- **Excluded steps are recorded under `_tail`** — out of the totals, still referenceable. They appear in the step log like any other step.

## Built-in Workspace Variables

These are seeded automatically at playbook start. No steps needed to populate them.

### `_sys` — System Constants

| Path | Example | Description |
|---|---|---|
| `_sys.today` | `2026-08-30` | Calendar date (Today) |
| `_sys.workDate` | `2026-08-30` | BC posting date (WorkDate) |
| `_sys.now` | `2026-08-30T15:30:00Z` | Current timestamp |
| `_sys.year` | `2026` | Current year |
| `_sys.lastMonthStart` | `2026-07-01` | First day of previous month |
| `_sys.lastMonthEnd` | `2026-07-31` | Last day of previous month |
| `_sys.thisMonthStart` | `2026-08-01` | First day of current month |
| `_sys.thisQuarterStart` | `2026-07-01` | First day of current quarter |
| `_sys.thisYearStart` | `2026-01-01` | First day of current year |
| `_sys.companyName` | `CRONUS IS` | Current BC company |
| `_sys.userId` | `ADMIN` | Current user ID |

### `_who` — User & Company Context (from Help.WhoAmI.Get)

| Path | Example | Description |
|---|---|---|
| `_who.user.userName` | `GUNNAR` | Login name |
| `_who.user.userSecurityId` | GUID | User security ID |
| `_who.salesperson.name` | `Gunnar Gestsson` | Salesperson full name |
| `_who.salesperson.email` | `user@company.is` | Salesperson email |
| `_who.salesperson.code` | `GG` | Salesperson code |
| `_who.salesperson.phoneNo` | `5551234` | Phone number |
| `_who.companyInfo.name` | `CRONUS Ltd.` | Legal company name |
| `_who.companyInfo.registrationNo` | `4112032630` | Company kennitala |
| `_who.companyInfo.vatRegistrationNo` | `101067` | VAT number |
| `_who.companyInfo.address` | `5 The Ring` | Company address |
| `_who.telegramChatId` | `8866830259` | User's Telegram chat ID |
| `_who.personalization.languageId` | `1033` | Session language LCID |

## Data Reference — Tables & Fields for Data.Records.Get/Set

IMPORTANT: Playbook steps use **message type parameter names** (e.g. `tableName`, `fieldNumbers`),
NOT the MCP tool shorthand names (e.g. `table`, `fields`). The playbook engine dispatches
through `invoke_message_type`, which passes data directly to the message type handler.
Always call `Help.Implementation.Get` with the message type name to see its exact parameters.

### Orchestrator Tables

#### Scheduled Entry ori
Stores configuration for each monitored Job Queue Entry.

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| ID | ID | GUID | PK — matches the Job Queue Entry ID |
| Object Type to Run | ObjectTypetoRun | Option | Codeunit/Report |
| Object ID to Run | ObjectIDtoRun | Integer | BC object ID |
| Description | Description | Text[250] | |
| Blocked | Blocked | Boolean | Prevents scheduling when true |
| No. of Minutes between Runs | No_ofMinutesbetweenRuns | Integer | |
| Run on Mondays..Sundays | RunonMondays..RunonSundays | Boolean | |
| Starting Time | StartingTime | Time | |
| Ending Time | EndingTime | Time | |
| Notification Type | NotificationType | Option | None/Email |
| Notification Recipient | NotificationRecipient | Text | Email address |
| Retry Policy | RetryPolicy | Option | Always/Limited/None |
| Client Credentials Code | ClientCredentialsCode | Code[20] | For API-based scheduling |

#### Scheduler Setup ori
Singleton setup table. Read with `Data.Records.Get`, tableName = "Scheduler Setup ori".

### Playbook Tables

#### Playbook ori (PK: Code)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Code | Code | Code[20] | PK |
| Description | Description | Text[250] | |
| Recurring Template Code | RecurringTemplateCode | Code[20] | Links to schedule template |
| No. of Minutes between Runs | No_ofMinutesbetweenRuns | Integer | |
| Run on Mondays..Sundays | RunonMondays..RunonSundays | Boolean | |
| Starting/Ending Time | StartingTime/EndingTime | Time | |
| Notification Type | NotificationType | Option | None/Email |
| Scheduled | Scheduled | Boolean | FlowField — read-only |

#### Playbook Step ori (PK: PlaybookCode + StepNo_)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Playbook Code | PlaybookCode | Code[20] | PK |
| Step No. | StepNo_ | Integer | PK — use 10, 20, 30... |
| Description | Description | Text[250] | |
| Message Type | MessageType | Option | The Bifrost message type to call |
| Next Step No. (Success) | NextStepNo_Success | Integer | 0 = end playbook |
| Next Step No. (Failure) | NextStepNo_Failure | Integer | 0 = fail playbook |
| Request Template | RequestTemplate | BLOB | JSON template with `@path` workspace refs (set as base64) |
| Result Log Paths | ResultLogPaths | Text[2048] | Paths to extract from response to workspace. `source>target` renames, `source[0]>target` extracts first element |
| Iterate Array Path | IterateArrayPath | Text[250] | Dot-path to array for foreach |
| Iterate Source Step No. | IterateSourceStepNo_ | Integer | Which step's response has the array |
| Step Type | StepType | Option | Action (default) or Check — is a false Success condition a failure? |
| Summary Paths | SummaryPaths | Text[2048] | Response paths copied into the run report. Keep small |
| Exclude From Run Status | ExcludeFromRunStatus | Boolean | Keep this step out of _run and _steps |
| Stop On Item Error | StopOnItemError | Boolean | For foreach: abort on first failure |
| Skip If Step Failed | SkipIfStepFailed | Integer | Skip this iteration if named step's same iteration failed |
| Paged | Paged | Boolean | Enable auto-paging (skip/take) |
| Page Size | PageSize | Integer | Records per page (default 500) |
| Page Through Step No. | PageThroughStepNo_ | Integer | Last step in paged chain |
| Disabled | Disabled | Boolean | Skip this step without executing |

#### Playbook Condition ori (PK: PlaybookCode + StepNo_ + ConditionType + GroupNo_ + LineNo_)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Playbook Code | PlaybookCode | Code[20] | PK |
| Step No. | StepNo_ | Integer | PK — the step this condition guards |
| Condition Type | ConditionType | Enum | PK — Start, Success or Error |
| Group No. | GroupNo_ | Integer | PK — conditions in one group are ANDed; groups are ORed |
| Line No. | LineNo_ | Integer | PK — use 10000, 20000, ... |
| Path | Path | Text[250] | Dot-path. Start/Error read the workspace, Success reads the step response |
| Operator | Operator | Enum | Equals, NotEquals, Contains, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual, Exists |
| Value | Value | Text[250] | Compared as text; numeric operators parse both sides |
| Description | Description | Text[100] | Why this condition exists. Optional, and worth writing |

Deleting a step cascades to its conditions. An empty condition set is true, so a step
with no Success conditions succeeds whenever the message type does not raise an error.

### Execution Log Tables (read-only)

#### Playbook Instance ori (PK: ID)
One record per playbook run. Fields: PlaybookCode, Status, StartedAt, CompletedAt,
TotalDuration, StepsExecuted, StepsFailed, ItemsProcessed, InitiatedBy, ErrorText, Context.

`Status` stays `Running` until the run writes its own completion, so an instance
abandoned mid-flight — a session killed, a caller that timed out — stays `Running`
for ever. Judge such a run by the timestamps on its step log, not by this field.

#### Playbook Step Log ori (PK: InstanceID + StepNo_ + IterationNo_)
One record per step execution. Fields: MessageType, Status, Duration, ErrorText,
RequestSent (base64 BLOB), ResponseReceived (base64 BLOB), IteratorElement, WorkspaceSnapshot (base64 BLOB, only on failed steps).

