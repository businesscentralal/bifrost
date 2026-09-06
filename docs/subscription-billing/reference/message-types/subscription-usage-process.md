---
id: subscription-usage-process
title: "Subscription.Usage.Process"
sidebar_label: "Subscription.Usage.Process"
sidebar_position: 19
description: "Request and response contract for the Subscription.Usage.Process Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Advances an existing Usage Data Import entry (table 8013) through its remaining processing
stages: turning imported lines into billable quantities, creating Usage Data Billing rows
(table 8006), and processing those rows into Billing Line entries. Each requested stage runs
Microsoft's own processing codeunit for that step, in its own committed transaction, so a
failure in a later stage does not undo an earlier one.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| usageDataImportEntryNo | Integer | Yes | The Usage Data Import entry to process. May also be supplied as the message subject when the subject is numeric. |
| steps | Array of Text | No | Which stages to run, in any subset of CreateImportedLines, ProcessImportedLines, CreateUsageDataBilling, ProcessUsageDataBilling. Defaults to the last three, always executed in that order regardless of the order given. |

`CreateImportedLines` re-parses the Usage Data Blob that `Subscription.Usage.ImportData`
already stored into Usage Data Generic Import rows. It is not in the default set, because
the import call runs it once already - ask for it when the first parse failed on a setup
problem, such as a Data Exchange Definition that did not match the file, and you want to
retry without re-sending the file.

## Request Example

```json
{
  "usageDataImportEntryNo": 137,
  "steps": ["ProcessImportedLines", "CreateUsageDataBilling"]
}
```

## Response Shape

```json
{
  "status": "Success",
  "usageDataImportEntryNo": 137,
  "steps": [
    { "step": "ProcessImportedLines", "status": "Ok", "reason": "" },
    { "step": "CreateUsageDataBilling", "status": "Ok", "reason": "" }
  ],
  "processingStatus": "Ok",
  "usageDataBillingCount": 10,
  "usageDataBillingErrorCount": 0
}
```

`processingStatus` is the entry's status after the last requested stage. `usageDataBillingCount`
and `usageDataBillingErrorCount` count Usage Data Billing rows (table 8006) for this entry,
the second filtered to rows whose own Processing Status is Error.

## Errors

| Condition | Message |
| --- | --- |
| The entry does not exist | The Usage Data Import entry %1 does not exist. |
| The entry is already Closed | Usage Data Import entry %1 is already Closed and cannot be processed again. |
| An unknown step name is given | '%1' is not a known processing step. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.
A stage that fails on its own data (for example a row with a missing price) is still reported
as a successful call - check each entry in `steps` and `processingStatus`.

## Safety

This message type writes. It advances an existing Usage Data Import entry through its
processing stages, creating Usage Data Billing rows; it does not post anything by itself.
Each requested stage commits once it completes, so a partially requested run cannot be
rolled back as a whole - rerun the remaining steps instead.

## Related Message Types

- `Subscription.Usage.ImportData`

