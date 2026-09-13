---
id: memory-company-list
title: "Memory.Company.List"
sidebar_label: "Memory.Company.List"
sidebar_position: 97
description: "Beiðni- og svarsamningur fyrir Memory.Company.List Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Sýnir lista yfir company-scoped memory færslur með `id` og `description` aðeins — the `memory` blob er omitted. nota this fyrir browsing eða selection screens áður en fetching content via `Memory.Company.Get`.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | númer of færslur til skip |
| take | heiltala | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression |

## Uppbygging svars
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "Pricing rules" },
    { "id": "e5f6a7b8-...", "description": "Discount policies" }
  ]
}
```

## áskilið heimildir
lesa access er granted með `BIFROST API ori` (the base API heimild set) plus the inherent heimild on the implementation codeunit. No additional heimild set er áskilið til list company memory.

## Tengdar skilaboðategundir
- `Memory.Company.Get`
- `Memory.Company.Set`
- `Memory.User.List`

