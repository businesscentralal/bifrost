---
id: help-namespaces-get
title: "Help.Namespaces.Get"
sidebar_label: "Help.Namespaces.Get"
sidebar_position: 65
description: "Beiðni- og svarsamningur fyrir Help.Namespaces.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the distinct list of AL namespace values fyrir all non-obsolete normal töflur in `Table Metadata`. This er a lightweight server-side aggregation — the BC server collects unique namespace strings án returning full tafla metadata. nota this as **Step 1** in tafla discovery áður en calling `Help.Tables.Get` með a `namespace` filter.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| namespaceFilter | Text | No | valfrjálst filter expression. styður BC wildcards: `Microsoft.Finance.*` Skilar aðeins Finance namespaces. Omit til return all namespaces. |

## Request Examples
All namespaces:
```json
{ "type": "Help.Namespaces.Get" }
```
aðeins Finance namespaces:
```json
{ "type": "Help.Namespaces.Get", "data": { "namespaceFilter": "Microsoft.Finance.*" } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "namespaces": [
    "Microsoft.Sales.Customer",
    "Microsoft.Finance.GeneralLedger.Account",
    "Microsoft.Finance.ReceivablesPayables",
    "Origo.Bifrost"
  ]
}
```

## Recommended Two-Step tafla Uppgötvunarferli
þegar you do ekki know which töflur exist, always nota this two-step approach til avoid context-window overflow:
```
Step 1 — discover namespaces (this type, lightweight):
  { "type": "Help.Namespaces.Get" }
  → { "namespaces": ["Microsoft.Sales.Customer", "Microsoft.Finance.GeneralLedger", ...] }

Step 2 — list tables in the relevant namespace:
  { "type": "Help.Tables.Get", "data": { "namespace": "Microsoft.Sales.*" } }
  → { "result": [ { "id": 18, "name": "Customer", ... }, ... ] }
```

> ⚠️ **Never call `Help.Tables.Get` án a tafla identifier eða namespace filter.** Unfiltered calls return thousands of rows og mun overflow the AI context window.

## Athugasemdir
- aðeins non-obsolete (`ObsoleteState = No | Pending`) töflur of Gerð `Normal` eru included.
- Namespaces eru returned in the order fyrsta encountered during a tafla scan; the order may vary between calls.
- The `namespace` filter uses standard BC `SetFilter` wildcards: `*` matches hvaða substring, `?` matches a single character.

## Tengdar skilaboðategundir
- `Help.Tables.Get` — nota eftir this Gerð til list töflur within a namespace
- `Help.Fields.Get` — list fields fyrir a specific tafla

