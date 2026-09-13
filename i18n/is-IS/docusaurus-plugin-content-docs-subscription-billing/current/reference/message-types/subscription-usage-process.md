---
id: subscription-usage-process
title: "Subscription.Usage.Process"
sidebar_label: "Subscription.Usage.Process"
sidebar_position: 19
description: "Request and response contract for the Subscription.Usage.Process Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Advances an existing Usage Data Import entry (table 8013) through its remaining processing
stages: turning imported línur í billable quantities, creating Usage Data Billing rows
(table 8006), og processing those rows í Billing Line entries. Each requested stage runs
Microsoft's own processing kóðiunit fyrir that step, in its own committed transaction, so a
failure in a later stage gerir ekki undo an earlier one.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| usageDataImportEntryNo | Integer | Yes | The Usage Data Import entry to process. May also be supplied as the message subject þegar the subject er numeric. |
| steps | Array of Text | No | Which stages to run, in any subset of CreateImportedLines, ProcessImportedLines, CreateUsageDataBilling, ProcessUsageDataBilling. Sjálfgefið er the last three, always executed in that order regardless of the order given. |

`CreateImportedLines` re-parses the Usage Data Blob that `Subscription.Usage.ImportData`
already stored í Usage Data Generic Import rows. It er not in the sjálfgefið set, because
the import call runs it once already - ask fyrir it þegar the first parse failed on a setup
problem, such as a Data Exchange Definition that did not match the skrá, og you want to
retry án re-sending the skrá.

## Dæmi um beiðni

```json
{
  "usageDataImportEntryNo": 137,
  "steps": ["ProcessImportedLines", "CreateUsageDataBilling"]
}
```

## Snið svars

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

`processingStatus` er the entry's status eftir the last requested stage. `usageDataBillingCount`
and `usageDataBillingErrorCount` count Usage Data Billing rows (table 8006) fyrir this entry,
the second filtered to rows whose own Processing Status er Villa.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The entry gerir ekki exist | The Usage Data Import entry %1 gerir ekki exist. |
| The entry er already Closed | Usage Data Import entry %1 er already Closed og geturnot be processed again. |
| An unknown step heiti er given | '%1' er not a known processing step. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.
A stage that fails on its own data (for example a row með a missing price) er still reported
as a successful call - check hver entry in `steps` og `processingStatus`.

## Öryggi

This message tegund writes. It advances an existing Usage Data Import entry through its
processing stages, creating Usage Data Billing rows; it gerir ekki post anything by itself.
Each requested stage commits once it completes, so a partially requested run geturnot be
rolled back as a whole - rerun the remaining steps instead.

## Tengdar skilaboðategundir

- `Subscription.Usage.ImportData`

