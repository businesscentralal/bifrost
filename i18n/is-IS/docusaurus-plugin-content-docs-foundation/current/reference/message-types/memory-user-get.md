---
id: memory-user-get
title: "Memory.User.Get"
sidebar_label: "Memory.User.Get"
sidebar_position: 99
description: "Beiðni- og svarsamningur fyrir Memory.User.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar user-scoped memory færslur úr `Bifrost User Memory`, filtered til the current user. Includes the `memory` text blob.

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
  "noOfRecords": 1,
  "result": [
    { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." }
  ]
}
```

## Tengdar skilaboðategundir
- `Memory.User.List`
- `Memory.User.Set`
- `Memory.Company.Get`

