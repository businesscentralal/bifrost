---
id: iceland-customs-categories
title: "Iceland.Customs.Categories"
sidebar_label: "Iceland.Customs.Categories"
sidebar_position: 23
description: "Beiðni- og svarsamningur fyrir Iceland.Customs.Categories Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar fulla Icelandic customs tariff product category tree frá island.er.
Notaðu this til browse eða search fyrir the correct tariff number áður en calling `Iceland.Customs.Calculate`.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public island.er API.

## Notað þegar
- You need til look up the correct tariff number fyrir a product áður en calculating import duties.
- You want til display the Icelandic customs category tree til a user fyrir selection.
- You eru building a customs classification Verkflæði og need the fulla category hierarchy.

## Beiðni

- **Subject**: Not used. Leave empty.
- **Body**: Not used.

## Svar structure

- `topLevel`: Hierarchical tree of product categories (up til 3 levels).
  - Each node: `id`, `label`, `description`, `children[]`
- `bottomLevel`: Flat Listi of Allt leaf categories með tariff numbers.
  - Each item: `id`, `tariffNumber`, `label`, `description`, `parentLabels[]`

## Leiðbeiningar fyrir gervigreind/umboð
1. Kallaðu á með empty subject til retrieve the fulla category tree.
2. Notaðu `bottomLevel` fyrir flat search — filter by `label` eða `description` til find matching tariff numbers.
3. Pass the found `tariffNumber` til `Iceland.Customs.Calculate` til compute the actual duty amount.
4. Notaðu `topLevel` fyrir hierarchical navigation in a UI picker eða guided classification flow.
Capability boundary: reads public API data Aðeins; no BC færslur eru modified.

## Authentication

None nauðsynlegt — public API.

## Status

> **NOT YET LIVE** — Endapunktur merged til island.er but not deployed til production as of 2026-06-27.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://api.island.is`.


