---
id: finance-fajournal-create
title: "Finance.FAJournal.Create"
sidebar_label: "Finance.FAJournal.Create"
sidebar_position: 43
description: "Beiðni- og svarsamningur fyrir Finance.FAJournal.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview

Adds lines to an existing fixed asset journal batch. Send `lines` to create lines with values, or leave `lines` out to create blank lines. This call never creates a batch.

Every line starts with the defaults BC gives a new line on the journal page: the FA posting date (the work date when BC leaves it blank), the depreciation book of the batch, the next `Document No.` from the batch's No. Series and the source code from the template.

Line numbers continue at the last `Line No.` + 10000 (10000 in an empty batch). The response returns every inserted line in the `Data.Records.Get` shape.

**Direction**: Inbound (write)  **Content-Type**: `text/json`

**Not idempotent**: each call adds lines. Sending the same request twice creates the lines twice, unless `clearExistingLines` is `true`.

## Identifying the Batch

The first match wins:
1. `data.templateName` (+ `data.batchName`).
2. `subject` is a GUID: the batch `SystemId`.
3. `subject` contains `|`: `TEMPLATE|BATCH`.

## Request Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `templateName` | string | See above | Journal template (Code[10]). |
| `batchName` | string | No | Journal batch (Code[10]). |
| `lines` | object[] | No | Lines with values, at most 200. See **With lines**. |
| `noOfLines` | int | No | Blank lines to create when `lines` is left out. Default `1`, from `1` to `100`. A JSON integer or a string of digits. Cannot be sent with `lines`. |
| `clearExistingLines` | bool | No | When `true`, every existing line in the batch is deleted (with its triggers) before the new lines are inserted. This is destructive and cannot be undone. Default `false`; `true` or `false`, any other value is an error. |
| `fieldNumbers` | int[] | No | Restrict the returned `fields` to these field numbers. All fields when omitted. |

## With lines

The call is all-or-nothing. Every line is checked before anything is inserted, and every problem is reported in one answer, so nothing is created when one line is wrong. An error that BC raises while validating a line also rolls back the whole call, including the lines before it.

- Field names are camelCase. Foundation assigns the line numbers; do not send `lineNo`.
- A request can contain at most 200 lines.
- The index in an error is 1-based: `lines[1]` is the first line.
- Validation order (the order BC validates the fields in): FA No., FA Posting Type, Depreciation Book Code, Posting Date, Document No., Amount, Description.
- A field you leave out keeps its BC default. A field you send overrides it.

| Field | Type | Required | Description |
|---|---|---|---|
| faNo | Text | Yes | Fixed asset number. It must exist and not be blocked. |
| faPostingType | Text | Yes | FA posting type name, such as `Acquisition Cost` or `Depreciation`. |
| depreciationBookCode | Text | No | Depreciation book code. It must exist. The batch default when omitted. |
| postingDate | Date | No | `YYYY-MM-DD`. Sets `Posting Date`; the batch default when omitted. |
| documentNo | Text | No | Document number. The batch No. Series number when omitted. |
| amount | Decimal | Yes | Amount of the FA posting type. |
| description | Text | No | Line description. BC fills it from the fixed asset when omitted. |

```json
{
  "type": "Finance.FAJournal.Create",
  "data": {
    "templateName": "ASSETS",
    "batchName": "DEFAULT",
    "lines": [
      { "faNo": "FA000010", "faPostingType": "Acquisition Cost", "depreciationBookCode": "COMPANY", "amount": 1000 }
    ]
  }
}
```

## Without lines

`noOfLines` (default `1`, from `1` to `100`) inserts that many blank lines with the BC defaults above. Blank lines do not post, and `Finance.FAJournal.Check` reports them. Fill them with `Data.Records.Set`, or send `lines` instead.

```json
{
  "type": "Finance.FAJournal.Create",
  "subject": "ASSETS|DEFAULT",
  "data": { "noOfLines": 2 }
}
```

## Response Shape

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "JournalTemplateName": "ASSETS", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "FANo_": "FA000010", "FAPostingType": "Acquisition Cost", "DepreciationBookCode": "COMPANY", "Amount": 1000, "FAPostingDate": "2026-09-27" }
    }
  ]
}
```

| Property | Description |
|---|---|
| `status` | `Success`. |
| `noOfRecords` | Number of lines inserted: the length of `lines`, or `noOfLines`. |
| `result[].id` | `SystemId` of the FA Journal Line. |
| `result[].primaryKey` | `JournalTemplateName`, `JournalBatchName`, `LineNo_`. |
| `result[].fields` | The line fields, limited by `fieldNumbers` and the field read restrictions. Names follow the `Data.Records.Get` rules. |

## Errors

| Code | Error | Cause |
|---|---|---|
| `MissingParameter` | `Fixed asset journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No batch was identified. |
| `RecordNotFound` | `FA Journal Batch "{template}\|{batch}" was not found (from subject).` | The batch does not exist. `parameter` is `subject`, or `templateName, batchName` when those keys were sent; `received` is the value. |
| `InvalidLine` | `{n} problem(s) in lines. Nothing was created.` | The pre-check found problems. `errors[]` lists each one with `parameter` `lines[n].<field>`: `MissingParameter` (`<field> is required.`), `InvalidParameterFormat` (not a number or not a date), `InvalidParameter` (not a valid option), `RecordNotFound` (the account, item or other record does not exist) or `PreconditionFailed` (it is blocked). With one problem, that problem is the answer and there is no `errors[]`. |
| `BusinessCentralError` | `lines[n].<field>: <BC error>` | BC rejected a value while validating line `n`. `parameter` is `lines[n].<field>`. Nothing was created. |
| `LimitExceeded` | `A request can contain at most 200 lines. Received: {n}.` | More than 200 lines. `received` is the count, `expected` is `200`. |
| `InvalidParameterFormat` | `lines must be an array.` | `lines` is not a JSON array. |
| `InvalidParameter` | `lines and noOfLines cannot both be sent.` | Both were sent. `parameter` is `noOfLines`. |
| `InvalidParameter` | `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` is out of range. |
| `InvalidParameterFormat` | `Parameter "{name}" has value "{value}", which is not a valid {type}. Expected {format}.` | `clearExistingLines` is not `true` or `false`, or `noOfLines` is not a whole number. `parameter`, `received` and `expected` name the value. |

## Typical Workflow

1. `Finance.FAJournal.Create`: send `lines`.
2. `Finance.FAJournal.Check`: validate the batch.
3. `Finance.FAJournal.PreviewPost`: optional, see the entries without posting.
4. `Finance.FAJournal.Post`: post the batch.

## Related Message Types

- `Finance.FAJournal.Check`: validate the batch.
- `Finance.FAJournal.PreviewPost`: simulate the post without committing.
- `Finance.FAJournal.Post`: post the batch.
- `Data.Records.Set`: change a field that `lines` does not take. Line values belong on `Finance.FAJournal.Create`.
- `Data.Records.Get`: read the lines again (same response shape).

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

