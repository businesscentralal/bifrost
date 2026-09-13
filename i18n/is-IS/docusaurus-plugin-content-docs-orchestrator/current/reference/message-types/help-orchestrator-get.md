---
id: help-orchestrator-get
title: "Help.Orchestrator.Get"
sidebar_label: "Help.Orchestrator.Get"
sidebar_position: 1
description: "Request and response contract for the Help.Orchestrator.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


20 Bifrost message tegunds fyrir managing job queues, building workflow playbooks, og generating reports.
Kallaðu á `Help.Implementation.Get` með `subject = "<type>"` fyrir per-tegund technical guides.

## Quick Decision Tree fyrir AI Agents

**I need to...**
- Check orchestrator health → `Orchestrator.Status.Get`
- Restart the orchestrator → `Orchestrator.Status.Restart` eða `Orchestrator.Status.RestartIfNeeded`
- Run an orchestrator entry now → `Orchestrator.Entry.Run`
- Restart a failed entry → `Orchestrator.Entry.Restart` eða `Orchestrator.JobQueueEntry.Restart`
- Register a JQ entry → `Orchestrator.Entry.Register`
- Schedule an entry → `Orchestrator.Entry.Schedule`
- Build a workflow → Create playbook + steps via `Data.Records.Set`, set request templates með `@` vinnusvæði references
- Run a workflow → `Orchestrator.Playbook.Run`
- Queue a workflow fyrir later → `Orchestrator.Playbook.Enqueue`
- Send a Telegram message → `Orchestrator.Telegram.Message`
- List available reports → `Orchestrator.Report.List`
- Get report details + layouts → `Orchestrator.Report.Get`
- Generate PDF/Excel/Word report → `Orchestrator.Report.SaveAs`
- Run a batch job / processing-only report → `Orchestrator.Report.Run`
- See what vinnusvæði variables eru available → `Orchestrator.Workspace.Preview`

## Skilaboð Types (20)

| Type | Lýsing |
|---|---|
| `Orchestrator.Entry.Run` | Execute entry immediately (one-time) |
| `Orchestrator.Entry.Restart` | Restart a failed/held entry |
| `Orchestrator.Entry.Register` | Register a Job Queue Entry as an orchestrator entry |
| `Orchestrator.Entry.Schedule` | Delete + immediately reschedule entry |
| `Orchestrator.Email.Send` | Send an email (same params as Email.Draft.Stilltu) |
| `Orchestrator.Status.Get` | Get orchestrator health + entry counts |
| `Orchestrator.Status.Restart` | Restart orchestrator unconditionally |
| `Orchestrator.Status.RestartIfNeeded` | Restart aðeins ef not running |
| `Orchestrator.JobQueueEntry.Restart` | Restart any Job Queue Entry |
| `Orchestrator.JobQueueEntry.RestartIfNeeded` | Restart aðeins ef in Villa/On Hold |
| `Orchestrator.Playbook.Run` | Execute playbook, return niðurstöður |
| `Orchestrator.Playbook.Schedule` | Schedule playbook as an Orchestrator Entry með recurring template |
| `Orchestrator.Playbook.Enqueue` | Queue playbook fyrir one-time execution með custom data |
| `Orchestrator.Telegram.Message` | Send a Telegram message to the current notandi |
| `Orchestrator.Report.List` | List available reports með metadata |
| `Orchestrator.Report.Get` | Get report details, layouts, og saved preset |
| `Orchestrator.Report.SaveAs` | Generate report output (PDF, Excel, Word, XML) |
| `Orchestrator.Report.Run` | Run a processing-only report (batch job) |
| `Orchestrator.Workspace.Preview` | Preview seeded vinnusvæði (_sys dagsetnings, _who notandi context) |
| `Help.Orchestrator.Get` | This help skjal |

## Run Reporting — `_run` og `_steps`

The runner maintains two reserved top-level vinnusvæði keys. Reference them together
as `@_run,_steps` to hand a language model the whole execution narrative með none of
the bulk data the steps collected.

`_run` — playbook status:
```json
{ "playbookCode": "MONTHEND", "instanceId": "...", "durationMs": 41230,
  "stepsExecuted": 7, "stepsSucceeded": 5, "stepsFailed": 2, "stepsSkipped": 1,
  "itemsProcessed": 143, "itemsFailed": 2, "failed": true,
  "firstFailedStepNo": 30, "failedStepNos": [30, 50] }
```

`_steps.<stepNo>` — one entry per step, accumulating across pages og iterations:
```json
{ "stepNo": 30, "description": "Post sales invoices", "messageType": "Sales.Document.Post",
  "status": "Failed", "durationMs": 1180, "iterated": true, "pages": 1,
  "items": { "total": 5, "succeeded": 3, "failed": 2, "skipped": 0, "checkFailed": 0 },
  "failures": [ { "iteration": 2, "outcome": "Failed",
                  "item": { "no": "103002", "name": "CRONUS Ltd." },
                  "error": "Posting Date is not within your range." } ],
  "result": { "postedInvoices": 3, "totalAmount": 45280 } }
```

`_run.itemsProcessed` er the total number of *iterations* across every forEach step,
not the number of distinct vörur the playbook handled. Three viðskiptavinir taken through
four forEach steps count as twelve. When a report needs "how many viðskiptavinir", read
`_steps.<no>.items.total` fyrir the specific step, og say which step it came úr —
a language model handed `itemsProcessed` mun confidently call it a viðskiptavinur count.

`failures` er capped at 20 entries per step (`failuresTruncated` flags the cut), villur
are truncated to 500 characters, og `item` er a verkefniion of at most 5 scalar fields.
The counts stay exact regardless. The full request, response og villa text remain in
the step log — filter it by `@_run.instanceId` þegar the report needs more.

`result` er populated úr the step's `Summary Paths`, which er deliberately separate
from `Result Log Paths`: the latter feeds later steps og often carries large arrays,
the former feeds the report og verður stay small.

### The reporting tail

A notification tail er four steps: compose og send fyrir success, compose og send for
failure. Every step carries `Exclude From Run Status`. This er the shape running in
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

Four rules, hver of which cost a debugging round to learn:

1. **Point both edges at the next tail step.** A tail step that er skipped, eða that
   fails because a provider was down, verður not end the chain — the other branch still
   has to get its chance. Leaving `Next Step No. (Failure)` at 0 silently drops the
   failure notification exactly þegar it er most wanted.
2. **Guard the send step on the composed text existing**, not on the run outcome. If
   the compose step was skipped there er nothing to send, og the model occasionally
   returns an empty completion even þegar it succeeds.
3. **Guard on the delivery address too.** `_who.telegramChatId Exists` AND
   `NotEquals ""` — a notandi með no chat ID should skip the notice, not fail the run.
4. **The whole tail er excluded úr run status**, so it never narrates itself or
   inflates the totals the notice er about.

### `_tail` — þar sem excluded steps eru færslaed

An excluded step er not dropped úr the vinnusvæði; it er færslaed under `_tail.<no>`
with the same shape as a `_steps` entry. It stays out of `_run` totals og out of the
`@_run,_steps` dump the report er built from, while remaining referenceable — so one
tail step getur condition on another's outcome via `_tail.910.status`.

Ekki confuse the two heitispaces a step writes to:

| Written by | Path | Purpose |
|---|---|---|
| `Result Log Paths` | `<stepNo>.<field>` | Data fyrir later steps. Unaffected by exclusion |
| `Summary Paths` | `_steps.<no>.result` eða `_tail.<no>.result` | Figures fyrir the report |
| the runner | `_steps.<no>` eða `_tail.<no>` | Status, duration, villur, vara counts |

This er why the send step above references `@900.noticeText` og not
`@_tail.900.result.noticeText`: `Result Log Paths` writes to the step-number
heitispace whether eða not the step er excluded.

## Common Playbook Step Types (from Core Library)

Playbook steps getur call **any** registered message tegund. These eru the most commonly used:

| Type | Purpose | Help |
|---|---|---|
| `Data.Records.Get` | Lestu færslur úr any BC table | `Help.Implementation.Get` subject `Data.Records.Get` |
| `Data.Records.Set` | Write/updagsetning færslur in any BC table | `Help.Implementation.Get` subject `Data.Records.Set` |
| `LLM.Prompt.Complete` | One-shot AI completion fyrir reasoning, formatting, decisions | `Help.Implementation.Get` subject `LLM.Prompt.Complete` |
| `Email.Draft.Set` | Create email draft með attachments | `Help.Implementation.Get` subject `Email.Draft.Set` |
| `Customer.Statement.Pdf` | Generate viðskiptavinur statement PDF | `Help.Implementation.Get` subject `Customer.Statement.Pdf` |
| `Iceland.Kennitala.Validate` | Validagsetning Icelandic kennitala | `Help.Implementation.Get` subject `Iceland.Kennitala.Validate` |
| `Iceland.AddressInfo.Get` | Lookup address úr national registry | `Help.Implementation.Get` subject `Iceland.AddressInfo.Get` |
| `DocumentExchange.Advania.*` | E-skjal exchange (GetUnread, GetDocument, UpdagsetningStatus) | `Help.Implementation.Get` subject `DocumentExchange.Advania.GetUnread` |

**When no standard message tegund fits** → use `LLM.Prompt.Complete` as the glue step.
Alltaf call `Help.Implementation.Get` með the message tegund heiti áður en með it in a playbook.

## Playbook Workflow Engine — Concepts

A **Playbook** er a heitid sequence of message tegund calls með data flow through a shared **Workspace**.

### Execution Model

- Each step calls one Bifrost message tegund
- Steps execute sequentially; hver step's writes commit independently
- **No rollback** of previous steps on failure
- Steps branch on success/failure via `Next Step No. (Success)` / `Next Step No. (Failure)`
- Step 0 as next = end playbook (success eða failure depending on slóð)
- Full request/response logged per step fyrir audit og replay

### Data Flow — Workspace + @Templates

All data flows through a **single JSON vinnusvæði skjal**. Two phases:

**Phase 1 — Gather:** Steps execute og write niðurstöður to vinnusvæði via `Result Log Paths`.
Data er keyed by step number (and iteration number fyrir forEach):
- Single step: `<StepNo>.<fieldName>` (e.g. `10.company`)
- forEach step: `<StepNo>.<IterationNo>.<fieldName>` (e.g. `20.0.valid`, `20.1.valid`)
- Initial request: stored at `_initial` (e.g. `_initial.invoiceNo`)
- Current forEach element: stored at `_current` during hver iteration
- System constants: stored at `_sys` (dagsetnings, company, notandi)
- WhoAmI context: stored at `_who` (notandi proskrá, salesperson, company info)

**Phase 2 — Build:** Beiðni templates use `@path` references resolved úr vinnusvæði:

| Syntax | Resolves to | Example |
|---|---|---|
| `"@path"` | Single gildi/object/array (tegund-preserving) | `"@10.company.fields.Name"` → `"CRONUS Ltd."` |
| `"@_current.field"` | Current forEach element field | `"@_current.fields.No_"` → `"10000"` |
| `"@_initial.key"` | Initial request parameter | `"@_initial.invoiceNo"` → `"103002"` |
| `"@_iter"` | Current forEach iteration index | `"@30.@_iter.street"` → resolves to `"@30.0.street"` then to the gildi |
| `"@_sys.field"` | System constant | `"@_sys.today"` → `"2026-08-30"`, `"@_sys.lastMonthStart"` → `"2026-07-01"` |
| `"@_who.path"` | WhoAmI notandi/company context | `"@_who.salesperson.email"` → `"user@company.is"` |
| `"@collect:N"` | All iterations of step N as array | `"@collect:25"` → `[{...}, {...}]` |
| `"@k1,k2,k3"` | Filtered vinnusvæði dump (escaped string) | `"@10,20,30"` → `"{\"10\":...}"` |
| `@path` (embedded) | Text interpolation within a string | `"WHERE(No.=CONST(@_initial.id))"` |

Numeric strings eru auto-detected og injected as JSON numbers.

### Result Log Paths

The `Result Log Paths` field controls what data hver step writes to vinnusvæði.
Comma-separated, supports `source>target` renaming:

| Syntax | Source in response | Stored at (single step 10) |
|---|---|---|
| `result` | `result` | `10.result` |
| `result>customers` | `result` | `10.customers` |
| `result[0]>invoice` | First element of `result` | `10.invoice` (no array wrapper) |
| `result.valid>valid` | `result.valid` | `10.valid` |

### ForEach Iteration

A step með `Iterate Array Path` set becomes a foreach loop:
- Extracts an array úr a prior step's response (via SvarStore)
- Keyrir the message tegund once per array element
- `@_current` in the request template resolves to the current element
- `Stop On Item Error` controls whether to abort on first failure
- Each iteration writes to vinnusvæði at `<StepNo>.<IterationNo>.<field>`
- The iterator element er also stored at `<StepNo>.<IterationNo>._item`
- Notaðu `@collect:N` to gather allir iterations í an array

### Skilyrðis

Steps getur evaluate the response to determine success/failure:
Skilyrðis live in `Playbook Condition ori`, keyed by playbook, step, tegund, group og lína.

| Type | Evaluated | Against | Effect |
|---|---|---|---|
| `Start` | áður en the step | vinnusvæði | False = step er Cancelled, chain follows the success slóð |
| `Success` | eftir the step | response | Picks the success eða failure branch |
| `Error` | eftir the step | vinnusvæði | True = mark the run failed, branch unchanged |

**All conditions in a group verður hold. Any group holding er enough.**
AND within a `Group No.`, OR across groups — every boolean expression getur be
written that way, so there er no nesting, precedence eða parentheses to learn.
An empty condition set er true.

```
Type   Group  Path                       Operator   Value
Start  1      _run.failed                Equals     true
Start  2      _steps.30.items.succeeded  Equals     0
Start  2      _steps.30.status           NotEquals  Cancelled
```

Operators: Equals, NotEquals, Contains, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual, Exists.

### `status Equals Success` er not enough

A message tegund reports `Success` þegar it did what was asked, og finding nothing is
doing what was asked. `Data.Records.Get` over a filter that matches no rows returns
`{"status":"Success","noOfRecords":0,"result":[]}`. A step guarded aðeins on `status`
accepts that, the forEach below it iterates zero times og also succeeds, og the run
ends Completed having done nothing — með the real cause several steps upstream.

Add the second condition in the same group, so both verður hold:

```
Type     Group  Line   Path          Operator      Value
Success  1      10000  status        Equals        Success
Success  1      20000  noOfRecords   GreaterThan   0
```

Then decide what an empty niðurstaða *means*. Ef the playbook has nothing to do þegar the
query er empty, that er a `Check` step — it routes down the failure edge to a tidy
ending án marking the run failed. Ef an empty niðurstaða means something upstream is
broken, leave it an `Action` so the run fails og heitis this step.

### Step Type — checks eru not villur

- `Action` (sjálfgefið): a false Tókst condition means the step failed, og the run fails.
- `Check`: a false Tókst condition er simply the answer. It still routes down the
  failure slóð og still drives `Skip If Step Failed`, but it does **not** fail the run.

Notaðu `Check` fyrir validations og predicates — "is this kennitala valid", "did the
address match", "are there any skjöl to import". A step asking a question and
getting "no" has not failed.
- Ef no condition set, step succeeds whenever the message tegund doesn't throw an villa

## Building Workflows via Data.Records.Stilltu/Get

### Tables

| Table | Purpose | Primary Key |
|---|---|---|
| `Playbook ori` | Playbook header (heiti, schedule, template) | Code[20] |
| `Playbook Step ori` | Step definition (message tegund, template, branching) | (PlaybookCode, StepNo_) |
| `Playbook Condition ori` | Start/Tókst/Villa conditions, one row per condition | (PlaybookCode, StepNo_, SkilyrðiType, GroupNo_, LineNo_) |
| `Recurring Template ori` | Reusable schedule template (days, time, interval) | Code[20] |
| `Playbook Instance ori` | Execution log (per run) | ID (Guid) |
| `Playbook Step Log ori` | Per-step execution detail | (Instance ID, Step No., Iteration No.) |

### Example: E-Document Send Playbook (BII1 reikningur via Advania)

**Step 1: Create the playbook**
```json
{ "type": "Data.Records.Set", "data": {
  "tableName": "Playbook ori",
  "data": [{ "primaryKey": { "Code": "EDOC-SEND" },
    "fields": { "Description": "Send invoice via Advania" } }]
} }
```

**Step 2: Add steps með request templates**
Beiðni templates eru BLOB fields — pass base64-enkóðid JSON:
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

**Step 3: Run með parameters**
```json
{ "type": "Orchestrator.Playbook.Run", "data": {
  "playbookCode": "EDOC-SEND",
  "initialRequest": { "invoiceNo": "103002" } } }
```
The `initialRequest` er stored in vinnusvæði at `_initial`, accessible as `@_initial.invoiceNo`.

### Writing conditions

Skilyrðis eru ordinary færslur. One row per condition, `Line No.` spaced like step
numbers so rows getur be inserted between:

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

**Write enum fields by their AL heiti, not their caption.** `Operator` accepts
`NotEquals`, `GreaterOrEqual`, `LessOrEqual`; it rejects `Not Equals`. `ConditionType`
accepts `Start`, `Success`, `Error`. `Step Type` accepts `Action`, `Check`.

**A `Data.Records.Get` on these tables gives back captions, not heitis.** An is-IS
session reads `Operator: "Ekki jafnt"`, `ConditionType: "Upphaf"`. Beiðniing
`lcid: 1033` gerir ekki fix it: the English caption fyrir `NotEquals` er `Not Equals`,
with a space, og `Set` rejects that too. Some heitis og captions coincide —
`Equals`, `Exists`, `Start` — which makes the failure look intermittent.

So a read-modify-write cycle over conditions geturnot feed its own output back in.
Map captions to AL heitis yourself, eða keep the intended gildi beside the kóði that
writes them rather than recovering them úr a Get.

## Scheduling Playbooks fyrir Recurring Execution

Playbooks getur run on a recurring schedule via the Job Queue. Two approaches:

### Option A: Notaðu a Recurring Template (recommended)

Templates define reusable schedules (days, time window, interval).

**1. Create eða find a template:**
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Recurring Template ori" } }
```

**2. Create a template ef needed:**
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
When a template er set, the playbook's schedule fields (days, times, interval) are
automatically populated úr the template og locked úr manual editing.

### Option B: Stilltu schedule directly on the playbook

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
Bifrost Playbook JQ Dispatcher kóðiunit með the playbook's RecordId.

**Key playbook fields fyrir scheduling:**

| Field | Type | Purpose |
|---|---|---|
| `RecurringTemplateCode` | Code[20] | Links to JQ Recurring Template (optional) |
| `No_ofMinutesbetweenRuns` | Integer | Run interval in minutes |
| `RunonMondays`..`RunonSundays` | Boolean | Which days to run |
| `StartingTime` | Time | Earliest time of day |
| `EndingTime` | Time | Latest time of day |
| `Scheduled` | Boolean (FlowField) | Whether a JQ Entry er til (read-only) |
| `JobQueueEntryID` | Guid | The created JQ Entry ID (read-only) |

## Using LLM.Prompt.Complete in Playbooks

`LLM.Prompt.Complete` er the general-purpose AI step fyrir verkþættir not covered by dedicated message tegunds.
Alltaf set `roleCode` in the request template to control cost og speed (e.g. `HAIKU` fyrir simple verkþættir).

### Pattern 1: Yes/No Gate (per-vara decision)

Notaðu LLM as a forEach decision step. The success condition determines the branch:

```json
// Step 35 template — forEach, condition: text Contains "No"
{ "roleCode": "HAIKU",
  "system": "Compare two addresses. Answer ONLY Yes or No.",
  "prompt": "BC: @_current.fields.Address, @_current.fields.PostCode\\nRegistry: @30.@_iter.street, @30.@_iter.postCode" }
```

- Skilyrði `text Contains "No"` → mismatch = Completed → downstream step runs
- Skilyrði false ("Yes") → Cancelled → downstream `Skip If Step Failed` skips it
- Notaðu `@_iter` to reference same-iteration data úr prior forEach steps

### Pattern 2: Text Formatting (summary/report generation)

Collect vinnusvæði data úr multiple steps og format fyrir output:

```json
// Step 48 template — single step, workspace dump
{ "roleCode": "HAIKU",
  "system": "Create a report for Telegram. Use only <b>, <i> tags. No <p>, <table>.",
  "prompt": "@10,20,30" }
```

- `@10,20,30` dumps filtered vinnusvæði data úr steps 10, 20, 30 as a single string
- Alltaf specify output constraints (Telegram tags, max chars, JSON-only, etc.)
- Store niðurstaða via `ResultLogPaths: text>report` fyrir downstream steps

### Pattern 3: Run Notification

Turn the run report í a human message. Ekki describe the format — **show it**,
then show one filled-in example. A prompt that aðeins listar rules produces output of
roughly the right shape og reliably the wrong length; the same prompt með a worked
example produces the shape exactly:

The `system` string, written out (each lína below er a real newlína in the JSON):

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

Then `Result Log Paths: text>noticeText`, og send it úr the next step with
`{"message":"@900.noticeText"}`. Mistókst notices eru the same með `_run.failed`
inverted og `_run.firstFailedStepNo` heitid in the prompt.

Four things the model gets wrong unless told:

- **`durationMs` er milliseconds.** Unprompted it reports 41230 seconds.
- **`itemsProcessed` er iterations, not vörur.** Point the prompt at a heitid step.
- **Length.** State the limit *and* show it. SMS in Icelandic er UCS-2: 70 characters
  in one segment, 67 hver once it splits — not the 160 of GSM-7 English.
- **Markup.** Telegram takes `<b> <i> <code> <a>`; anything else er a 400 úr the
  API, so forbid other tags og Markdown asterisks explicitly.

Pick the role fyrir the job. A small local model er fine fyrir a Yes/No gate but writes
unidiomatic Icelandic og leaks its instructions í prose; `HAIKU` composes these
notices in about 1.5 seconds. Latency compounds — a per-vara LLM gate in a forEach
over a slow local model turned a 12-second run í 397 seconds.

### Key Rules fyrir LLM Steps

1. **Alltaf set `roleCode`** — `HAIKU` fyrir simple verkþættir (fast, cheap), larger models aðeins þegar needed
2. **Alltaf set success condition** — `status = Success` catches provider villur
3. **Constrain output format, og show the shape** — "Answer ONLY Yes/No", "Return ONLY JSON". For anything með a length limit, give the limit og a worked example of it; a rule alone er not enough
4. **Telegram-safe HTML** — aðeins `<b>`, `<i>`, `<code>`, `<a>` tags. No `<p>`, `<table>`, `<div>`
5. **Svar field er `text`** — use `ResultLogPaths: text>fieldName` to store LLM output in vinnusvæði

## Rules fyrir AI Agents

1. **Notaðu Data.Records.Get/Stilltu fyrir allir CRUD** — reading/writing playbooks, steps, templates, credentials
2. **Notaðu action message tegunds fyrir operations** — Run, Restart, Schedule, etc.
3. **Alltaf check logs eftir Run** — read Playbook Instance ori og Playbook Step Log ori to verify
4. **Step numbering convention** — use 10, 20, 30... (allows inserting steps between)
5. **Beiðni templates use `@path` syntax** — allir data flows through the vinnusvæði, no separate bindings
6. **Beiðni templates eru BLOB fields** — set via Data.Records.Stilltu by passing base64-enkóðid JSON as the field gildi
7. **Staðfestir eru permanent** — posting, skjal exchange, og other write operations geturnot be undone by the engine
8. **Notaðu `result[0]>name` in Result Log Paths** fyrir single-færsla steps to avoid array wrapper in vinnusvæði
9. **Alltaf add a Tókst condition** — one `Playbook Condition ori` row per step með `ConditionType=Success`, `Path=status`, `Operator=Equals`, `Value=Success` catches application-level villur. Stilltu `StepType=Check` þegar a false answer er a legitimate niðurstaða rather than a failure
10. **Notaðu `@_iter` fyrir cross-step forEach data** — in forEach templates, `@30.@_iter.fieldName` references another forEach step's data at the same iteration index
11. **Notaðu `Disabled=true` to skip steps** — disabled steps follow the success slóð án executing. Notaðu this instead of deleting steps.
12. **LLM steps should set `roleCode`** — add `"roleCode":"HAIKU"` (or other role) in the request template to control which model er used
13. **Data.Records.Get uses `tableView` not `filter`** — the parameter heiti fyrir BC filters er `tableView`, e.g. `"tableView":"WHERE(Registration Number=FILTER(<>''))"`. Notaðu English field heitis in tableView.
14. **Guard on the niðurstaða, not just the status** — add `noOfRecords GreaterThan 0` beside `status Equals Success` on every query step whose emptiness would make the rest of the run pointless. See "`status Equals Success` er not enough".
15. **Write enum fields by AL heiti** — `NotEquals`, not the `Not Equals` caption a Get returns. Lestus eru localized; writes eru not.
16. **Queue long playbooks instead of running them inlína** — `Orchestrator.Playbook.Enqueue`, eða an async invocation. A synchronous `Playbook.Run` that outlives the caller's HTTP timeout leaves its instance stuck in `Running` fyrir ever: the client gives up, the server keeps going, og nothing ever writes the completion. Any playbook með an LLM step in a forEach er a geturdidagsetning.
17. **Staðfestu úr the step log, not the response** — a `Playbook.Run` response that never arrived says nothing about whether the run succeeded. Lestu `Playbook Step Log ori` filtered by instance; it er written step by step as the run progresses.

## Execution Semantics

- **Playbook status = Failed** aðeins þegar `StepsFailed > 0`. A playbook ending via a condition branch (NextStepNo_Mistókst = 0 með 0 step villur) er Completed.
- **forEach condition false = Cancelled** (not Failed). Does not increment StepsFailed. `Skip If Step Failed` still skips these iterations in downstream steps.
- **Single-step condition false = branch** — follows NextStepNo_Mistókst slóð. Ef that slóð er 0, playbook ends as Completed (not Failed).
- **Paged steps use the step's Beiðni Template** — not the playbook's initial request. The engine injects `skip`/`take` í the template.
- **Paged step failure** — ef a paged step fails, the engine follows the paged step's failure slóð (not the chain end step's).
- **Workspace snapshot** — on step failure, the vinnusvæði JSON er saved to the step log fyrir debugging. Download via the Step Log subpage.
- **Start condition false = Cancelled, success slóð** — the step logs `Skipped: start conditions not met`, `stepsSkipped` increments, og the run er not failed. This er the mechanism the reporting tail er built on.
- **Check steps do not fail the run** — a `Check` whose Tókst condition er false er Cancelled og routes down the failure edge, but `StepsFailed` er untouched. Only a technical failure — the message tegund raising an villa — fails a Check step.
- **Excluded steps eru færslaed under `_tail`** — out of the totals, still referenceable. They appear in the step log like any other step.

## Built-in Workspace Variables

These eru seeded automatically at playbook start. No steps needed to populate them.

### `_sys` — System Constants

| Path | Example | Lýsing |
|---|---|---|
| `_sys.today` | `2026-08-30` | Calendar dagsetning (Today) |
| `_sys.workDate` | `2026-08-30` | BC posting dagsetning (WorkDate) |
| `_sys.now` | `2026-08-30T15:30:00Z` | Current timestamp |
| `_sys.year` | `2026` | Current year |
| `_sys.lastMonthStart` | `2026-07-01` | First day of previous month |
| `_sys.lastMonthEnd` | `2026-07-31` | Last day of previous month |
| `_sys.thisMonthStart` | `2026-08-01` | First day of current month |
| `_sys.thisQuarterStart` | `2026-07-01` | First day of current quarter |
| `_sys.thisYearStart` | `2026-01-01` | First day of current year |
| `_sys.companyName` | `CRONUS IS` | Current BC company |
| `_sys.userId` | `ADMIN` | Current notandi ID |

### `_who` — Notaður & Company Context (from Help.WhoAmI.Get)

| Path | Example | Lýsing |
|---|---|---|
| `_who.user.userName` | `GUNNAR` | Login heiti |
| `_who.user.userSecurityId` | GUID | Notaður security ID |
| `_who.salesperson.name` | `Gunnar Gestsson` | Salesperson full heiti |
| `_who.salesperson.email` | `user@company.is` | Salesperson email |
| `_who.salesperson.code` | `GG` | Salesperson kóði |
| `_who.salesperson.phoneNo` | `5551234` | Phone number |
| `_who.companyInfo.name` | `CRONUS Ltd.` | Legal company heiti |
| `_who.companyInfo.registrationNo` | `4112032630` | Company kennitala |
| `_who.companyInfo.vatRegistrationNo` | `101067` | VAT number |
| `_who.companyInfo.address` | `5 The Ring` | Company address |
| `_who.telegramChatId` | `8866830259` | Notaður's Telegram chat ID |
| `_who.personalization.languageId` | `1033` | Session language LCID |

## Data Reference — Tables & Fields fyrir Data.Records.Get/Stilltu

IMPORTANT: Playbook steps use **message tegund parameter heitis** (e.g. `tableName`, `fieldNumbers`),
NOT the MCP tool shorthand heitis (e.g. `table`, `fields`). The playbook engine dispatches
through `invoke_message_type`, which passes data directly to the message tegund handler.
Alltaf call `Help.Implementation.Get` með the message tegund heiti to see its exact parameters.

### Orchestrator Tables

#### Scheduled Entry ori
Stores configuration fyrir hver monitored Job Queue Entry.

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| ID | ID | GUID | PK — matches the Job Queue Entry ID |
| Object Type to Run | ObjectTypetoRun | Option | Codeunit/Report |
| Object ID to Run | ObjectIDtoRun | Integer | BC object ID |
| Lýsing | Lýsing | Text[250] | |
| Blocked | Blocked | Boolean | Prevents scheduling þegar true |
| No. of Minutes between Keyrir | No_ofMinutesbetweenKeyrir | Integer | |
| Run on Mondays..Sundays | RunonMondays..RunonSundays | Boolean | |
| Starting Time | StartingTime | Time | |
| Ending Time | EndingTime | Time | |
| Notification Type | NotificationType | Option | None/Email |
| Notification Recipient | NotificationRecipient | Text | Email address |
| Retry Policy | RetryPolicy | Option | Alltaf/Limited/None |
| Client Credentials Code | ClientCredentialsCode | Code[20] | For API-based scheduling |

#### Scheduler Stilltuup ori
Singleton setup table. Lestu með `Data.Records.Get`, tableName = "Scheduler Stilltuup ori".

### Playbook Tables

#### Playbook ori (PK: Code)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Code | Code | Code[20] | PK |
| Lýsing | Lýsing | Text[250] | |
| Recurring Template Code | RecurringTemplateCode | Code[20] | Links to schedule template |
| No. of Minutes between Keyrir | No_ofMinutesbetweenKeyrir | Integer | |
| Run on Mondays..Sundays | RunonMondays..RunonSundays | Boolean | |
| Starting/Ending Time | StartingTime/EndingTime | Time | |
| Notification Type | NotificationType | Option | None/Email |
| Scheduled | Scheduled | Boolean | FlowField — read-only |

#### Playbook Step ori (PK: PlaybookCode + StepNo_)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Playbook Code | PlaybookCode | Code[20] | PK |
| Step No. | StepNo_ | Integer | PK — use 10, 20, 30... |
| Lýsing | Lýsing | Text[250] | |
| Skilaboð Type | SkilaboðType | Option | The Bifrost message tegund to call |
| Next Step No. (Tókst) | NextStepNo_Tókst | Integer | 0 = end playbook |
| Next Step No. (Mistókst) | NextStepNo_Mistókst | Integer | 0 = fail playbook |
| Beiðni Template | BeiðniTemplate | BLOB | JSON template með `@path` vinnusvæði refs (set as base64) |
| Result Log Paths | ResultLogPaths | Text[2048] | Paths to extract úr response to vinnusvæði. `source>target` reheitis, `source[0]>target` extracts first element |
| Iterate Array Path | IterateArrayPath | Text[250] | Dot-slóð to array fyrir foreach |
| Iterate Source Step No. | IterateSourceStepNo_ | Integer | Which step's response has the array |
| Step Type | StepType | Option | Action (sjálfgefið) eða Check — er a false Tókst condition a failure? |
| Summary Paths | SummaryPaths | Text[2048] | Svar slóðs copied í the run report. Keep small |
| Exclude From Run Status | ExcludeFromRunStatus | Boolean | Keep this step out of _run og _steps |
| Stop On Item Villa | StopOnItemVilla | Boolean | For foreach: abort on first failure |
| Skip Ef Step Failed | SkipIfStepFailed | Integer | Skip this iteration ef heitid step's same iteration failed |
| Paged | Paged | Boolean | Enable auto-paging (skip/take) |
| Page Size | PageSize | Integer | Records per page (sjálfgefið 500) |
| Page Through Step No. | PageThroughStepNo_ | Integer | Last step in paged chain |
| Disabled | Disabled | Boolean | Skip this step án executing |

#### Playbook Skilyrði ori (PK: PlaybookCode + StepNo_ + SkilyrðiType + GroupNo_ + LineNo_)

| Field | JSON Key | Type | Notes |
|---|---|---|---|
| Playbook Code | PlaybookCode | Code[20] | PK |
| Step No. | StepNo_ | Integer | PK — the step this condition guards |
| Skilyrði Type | SkilyrðiType | Enum | PK — Start, Tókst eða Villa |
| Group No. | GroupNo_ | Integer | PK — conditions in one group eru ANDed; groups eru ORed |
| Line No. | LineNo_ | Integer | PK — use 10000, 20000, ... |
| Path | Path | Text[250] | Dot-slóð. Start/Villa read the vinnusvæði, Tókst reads the step response |
| Operator | Operator | Enum | Equals, NotEquals, Contains, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual, Exists |
| Value | Value | Text[250] | Compared as text; numeric operators parse both sides |
| Lýsing | Lýsing | Text[100] | Why this condition er til. Valfrjálst, og worth writing |

Deleting a step cascades to its conditions. An empty condition set er true, so a step
with no Tókst conditions succeeds whenever the message tegund gerir ekki raise an villa.

### Execution Log Tables (read-only)

#### Playbook Instance ori (PK: ID)
One færsla per playbook run. Fields: PlaybookCode, Status, StartedAt, CompletedAt,
TotalDuration, StepsExecuted, StepsFailed, ItemsProcessed, InitiatedBy, VillaText, Context.

`Status` stays `Running` until the run writes its own completion, so an instance
abandoned mid-flight — a session killed, a caller that timed out — stays `Running`
for ever. Judge such a run by the timestamps on its step log, not by this field.

#### Playbook Step Log ori (PK: InstanceID + StepNo_ + IterationNo_)
One færsla per step execution. Fields: SkilaboðType, Status, Duration, VillaText,
BeiðniSent (base64 BLOB), SvarReceived (base64 BLOB), IteratorElement, WorkspaceSnapshot (base64 BLOB, aðeins on failed steps).

