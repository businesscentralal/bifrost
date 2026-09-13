---
id: memory-company-get
title: "Memory.Company.Get"
sidebar_label: "Memory.Company.Get"
sidebar_position: 96
description: "Beiðni- og svarsamningur fyrir Memory.Company.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar company-scoped memory færslur úr `Bifrost Memory` (filtered til the current company). Includes the `memory` text blob.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | númer of færslur til skip (paging) |
| take | heiltala | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression |

## Dæmi um beiðni
```json
{ "type": "Memory.Company.Get", "data": { "skip": 0, "take": 50 } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "Pricing rules",      "memory": "..." },
    { "id": "e5f6a7b8-...", "description": "Discount policies",  "memory": "..." }
  ]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| id | GUID | Memory færsla primary key |
| Lýsing | Text | Short Lýsing |
| memory | Text | Full memory blob (UTF-8) |

## áskilið heimildir
lesa access er granted með `BIFROST API ori` (the base API heimild set) plus the inherent heimild on the implementation codeunit. No additional heimild set er áskilið til lesa company memory.

## Tengdar skilaboðategundir
- `Memory.Company.List`
- `Memory.Company.Set`
- `Memory.User.Get`

