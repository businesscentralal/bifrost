---
id: subscription-analysis-recalculate
title: "Subscription.Analysis.Recalculate"
sidebar_label: "Subscription.Analysis.Recalculate"
sidebar_position: 1
description: "Request and response contract for the Subscription.Analysis.Recalculate Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Runs Microsoft's "Create Contract Analysis" report, which adds Sub. Contr. Analysis Entry
rows (table 8019) for every Subscription Line that belongs to a Subscription Contract.
Three facts about this report are important and cannot be changed by this message type:
the report takes no parameters and always analyses as of **today's system date**, not a
date you choose; it covers **every** Subscription Line with a contract, never a single one;
and it is **additive only** - a line that already has an analysis entry for the current month
is skipped rather than recalculated, so calling this twice in the same month does not create
duplicate or refreshed entries for lines already analysed this month.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| contractNo | Code[20] | No | Does **not** scope the run itself - the report always covers every contract. Only narrows the counts reported back to you, to this Subscription Contract. |

## Request Example

```json
{
  "contractNo": "CC000010"
}
```

## Response Shape

```json
{
  "status": "Success",
  "analysisDate": "2026-08-30",
  "entriesCreated": 4,
  "totalEntries": 96
}
```

`entriesCreated` counts the analysis entries this call added, and `totalEntries` is the total
number of analysis entries now on file. When `contractNo` is given both counts are narrowed to
that contract; otherwise they cover every Subscription Contract. A run where every line was
already analysed this month is still a success, with `entriesCreated` at 0.

## Errors

| Condition | Message |
| --- | --- |
| (none specific to this message type) | Errors return `{ "status": "Error", "error": "...", "callstack": "..." }`. |

## Safety

This message type writes, but only adds analysis entries - a reporting side table. It does
not post to the general ledger and does not change any Subscription Contract or Subscription
Line data. The write runs in an isolated transaction that rolls back on error.

## Related Message Types

- `Subscription.Deferral.Release`

