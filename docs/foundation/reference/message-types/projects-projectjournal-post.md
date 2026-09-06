---
id: projects-projectjournal-post
title: "Projects.ProjectJournal.Post"
sidebar_label: "Projects.ProjectJournal.Post"
sidebar_position: 105
description: "Request and response contract for the Projects.ProjectJournal.Post Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Posts a project (job) journal batch via BC `Job Jnl.-Post Batch` and returns the resulting `Job Register` plus aggregate posting statistics. Recommend calling `Projects.ProjectJournal.Check` first.

**Direction**: Inbound (writes Job Ledger Entries) · **Content-Type**: `text/json`

## Idempotency
Not idempotent. Successful posting consumes the batch lines; reposting will produce different (or no) Job Ledger Entries.

## Identifier Resolution
Batch is resolved in this order:
1. JSON `templateName` (+ optional `batchName`)
2. `subject` is a GUID → batch SystemId
3. `subject` contains `|` → `TEMPLATE|BATCH`

## Request Parameters

| Name | Type | Description |
|---|---|---|
| `templateName` | string | Journal template name (`Code[10]`). |
| `batchName` | string | Journal batch name (`Code[10]`). |

## Request Example
```json
{ "templateName": "PROJECT", "batchName": "DEFAULT" }
```

## Response Shape (Success)

| Property | Type | Description |
|---|---|---|
| `status` | string | `"Success"`. |
| `templateName` | string | Journal template name posted. |
| `batchName` | string | Journal batch name posted. |
| `batchDescription` | string | Batch description. |
| `linesPosted` | integer | Number of lines in the batch before posting (`Count`). |
| `postingDate` | string | `Posting Date` of the first line, formatted XML (`yyyy-MM-dd`). |
| `totalQuantity` | decimal | `CalcSums(Quantity)` across posted lines. |
| `totalLineAmount` | decimal | `CalcSums("Line Amount")` across posted lines. |
| `jobRegisterNo` | integer | `Job Register."No."` created by the posting. |
| `jobRegisterId` | string | `Job Register.SystemId` (GUID, no braces). |
| `fromEntryNo` | integer | `Job Register."From Entry No."`. |
| `toEntryNo` | integer | `Job Register."To Entry No."`. |

```json
{
  "status": "Success",
  "templateName": "PROJECT",
  "batchName": "DEFAULT",
  "batchDescription": "Default project journal",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 16.0,
  "totalLineAmount": 4800.0,
  "jobRegisterNo": 42,
  "jobRegisterId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fromEntryNo": 1001,
  "toEntryNo": 1002
}
```

## Response Shape (Posting Failure)
Failures from `Job Jnl.-Post Batch.Run` are caught and returned as a structured error instead of thrown.

```json
{
  "status": "Error",
  "error": "Job No. must have a value in Job Journal Line ...",
  "callstack": "..."
}
```

## Posting Gate
Calling this message type requires the `BIFROST Job Post ori` permission set in addition to `BIFROST API ori`. Without it the request returns: `Posting denied: missing 'BIFROST Job Post ori' permission set.`

## Errors

| Message | Cause |
|---|---|
| `Posting denied: missing 'BIFROST Job Post ori' permission set.` | Caller lacks the `BIFROST Job Post ori` permission set. |
| `Project journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No identification provided. |
| `Project journal batch {templateName}\|{batchName} not found.` | Batch lookup failed. |
| `Project journal batch {templateName}\|{batchName} has no lines to post.` | Batch is empty. |
| `Nothing was posted. Review journal for errors.` | Posting completed but produced no Job Register entry. |

## Related Message Types
- `Projects.ProjectJournal.SetupNewLine`
- `Projects.ProjectJournal.Check`

