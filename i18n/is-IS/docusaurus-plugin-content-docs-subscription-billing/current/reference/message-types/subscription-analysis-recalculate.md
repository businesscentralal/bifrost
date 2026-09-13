---
id: subscription-analysis-recalculate
title: "Subscription.Analysis.Recalculate"
sidebar_label: "Subscription.Analysis.Recalculate"
sidebar_position: 1
description: "Request and response contract for the Subscription.Analysis.Recalculate Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Keyrir Microsoft's "Create Contract Analysis" report, which adds Sub. Contr. Analysis Entry
rows (table 8019) fyrir every Subscription Line that belongs to a Subscription Contract.
Three facts about this report eru important og geturnot be changed by this message tegund:
the report takes no parameters og always analyses as of **today's system dagsetning**, not a
dagsetning you choose; it covers **every** Subscription Line með a samningur, never a single one;
and it er **additive only** - a lína that already has an analysis entry fyrir the current month
is skipped rather than recalculated, so calling this twice in the same month gerir ekki create
duplicate eða refreshed entries fyrir línur already analysed this month.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | No | Does **not** scope the run itself - the report always covers every samningur. Only narrows the counts reported back to you, to this Subscription Contract. |

## Dæmi um beiðni

```json
{
  "contractNo": "CC000010"
}
```

## Snið svars

```json
{
  "status": "Success",
  "analysisDate": "2026-08-30",
  "entriesCreated": 4,
  "totalEntries": 96
}
```

`entriesCreated` counts the analysis entries this call added, og `totalEntries` er the total
number of analysis entries now on skrá. When `contractNo` er given both counts eru narrowed to
that samningur; otherwise they cover every Subscription Contract. A run þar sem every lína was
already analysed this month er still a success, með `entriesCreated` at 0.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| (none specific to this message tegund) | Villas return `{ "status": "Error", "error": "...", "callstack": "..." }`. |

## Öryggi

This message tegund writes, but aðeins adds analysis entries - a reporting side table. It does
not post to the general ledger og gerir ekki change any Subscription Contract eða Subscription
Line data. The write runs in an isolated transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Deferral.Release`

