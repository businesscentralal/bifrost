---
id: finance-generaljournal-create
title: "Finance.GeneralJournal.Create"
sidebar_label: "Finance.GeneralJournal.Create"
sidebar_position: 50
description: "Beiðni- og svarsamningur fyrir Finance.GeneralJournal.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Overview

Adds lines to an existing general journal batch. Send `lines` to create lines with values, or leave `lines` out to create blank lines. This call never creates a batch.

Every line starts with the defaults BC gives a new line on the journal page: the posting date and document date from the previous line (or the work date), the next `Document No.` from the batch's No. Series, the source code from the template, the reason code and the batch's balancing account. On the last line the batch may also suggest a balancing amount.

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
- Validation order (the order BC validates the fields in): Document Type, Account Type, Account No., Posting Date, Document No., Currency Code, Amount, Bal. Account Type, Bal. Account No., Description.
- A field you leave out keeps its BC default. A field you send overrides it.

| Field | Type | Required | Description |
|---|---|---|---|
| documentType | Text | No | Gen. journal document type name, such as `Payment` or `Invoice`. Blank when omitted. |
| accountType | Text | Yes | `G/L Account`, `Customer`, `Vendor`, `Bank Account`, `Fixed Asset`, `IC Partner` or `Employee`. |
| accountNo | Text | Yes | Account number of `accountType`. It must exist and not be blocked. |
| postingDate | Date | No | `YYYY-MM-DD`. The batch default when omitted. |
| documentNo | Text | No | Document number. The batch No. Series number when omitted. |
| currencyCode | Text | No | Currency code. It must exist. |
| amount | Decimal | Yes | Signed amount: positive is a debit, negative a credit. |
| balAccountType | Text | No | Balancing account type. `G/L Account` when `balAccountNo` is sent without it. |
| balAccountNo | Text | No | Balancing account number. The batch default when omitted. |
| description | Text | No | Line description. BC fills it from the account when omitted. |

```json
{
  "type": "Finance.GeneralJournal.Create",
  "data": {
    "templateName": "GENERAL",
    "batchName": "DEFAULT",
    "lines": [
      { "accountType": "G/L Account", "accountNo": "8410", "amount": 100, "description": "Opening" },
      { "accountType": "G/L Account", "accountNo": "2910", "amount": -100, "description": "Opening" }
    ]
  }
}
```

## Without lines

`noOfLines` (default `1`, from `1` to `100`) inserts that many blank lines with the BC defaults above. Blank lines do not post, and `Finance.GeneralJournal.Check` reports them. Fill them with `Data.Records.Set`, or send `lines` instead.

```json
{
  "type": "Finance.GeneralJournal.Create",
  "subject": "GENERAL|DEFAULT",
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
      "primaryKey": { "JournalTemplateName": "GENERAL", "JournalBatchName": "DEFAULT", "LineNo_": 10000 },
      "fields": { "AccountType": "G/L Account", "AccountNo_": "8410", "Amount": 100, "PostingDate": "2026-09-27", "DocumentNo_": "G00001" }
    }
  ]
}
```

| Property | Description |
|---|---|
| `status` | `Success`. |
| `noOfRecords` | Number of lines inserted: the length of `lines`, or `noOfLines`. |
| `result[].id` | `SystemId` of the Gen. Journal Line. |
| `result[].primaryKey` | `JournalTemplateName`, `JournalBatchName`, `LineNo_`. |
| `result[].fields` | The line fields, limited by `fieldNumbers` and the field read restrictions. Names follow the `Data.Records.Get` rules. |

## Errors

| Code | Error | Cause |
|---|---|---|
| `MissingParameter` | `Journal batch must be identified via subject (TEMPLATE\|BATCH or SystemId) or data parameters (templateName, batchName).` | No batch was identified. |
| `RecordNotFound` | `Gen. Journal Batch "{template}\|{batch}" was not found (from subject).` | The batch does not exist. `parameter` is `subject`, or `templateName, batchName` when those keys were sent; `received` is the value. |
| `InvalidLine` | `{n} problem(s) in lines. Nothing was created.` | The pre-check found problems. `errors[]` lists each one with `parameter` `lines[n].<field>`: `MissingParameter` (`<field> is required.`), `InvalidParameterFormat` (not a number or not a date), `InvalidParameter` (not a valid option), `RecordNotFound` (the account, item or other record does not exist) or `PreconditionFailed` (it is blocked). With one problem, that problem is the answer and there is no `errors[]`. |
| `BusinessCentralError` | `lines[n].<field>: <BC error>` | BC rejected a value while validating line `n`. `parameter` is `lines[n].<field>`. Nothing was created. |
| `LimitExceeded` | `A request can contain at most 200 lines. Received: {n}.` | More than 200 lines. `received` is the count, `expected` is `200`. |
| `InvalidParameterFormat` | `lines must be an array.` | `lines` is not a JSON array. |
| `InvalidParameter` | `lines and noOfLines cannot both be sent.` | Both were sent. `parameter` is `noOfLines`. |
| `InvalidParameter` | `noOfLines must be between 1 and 100. Received: {n}.` | `noOfLines` is out of range. |
| `InvalidParameterFormat` | `Parameter "{name}" has value "{value}", which is not a valid {type}. Expected {format}.` | `clearExistingLines` is not `true` or `false`, or `noOfLines` is not a whole number. `parameter`, `received` and `expected` name the value. |

## Typical Workflow

1. `Finance.GeneralJournal.Create`: send `lines`.
2. `Finance.GeneralJournal.Check`: validate the batch.
3. `Finance.GeneralJournal.PreviewPost`: optional, see the entries without posting.
4. `Finance.GeneralJournal.Post`: post the batch.

## Related Message Types

- `Finance.GeneralJournal.Check`: validate the batch.
- `Finance.GeneralJournal.PreviewPost`: simulate the post without committing.
- `Finance.GeneralJournal.Post`: post the batch.
- `Data.Records.Set`: change a field that `lines` does not take. Line values belong on `Finance.GeneralJournal.Create`.
- `Data.Records.Get`: read the lines again (same response shape).

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

