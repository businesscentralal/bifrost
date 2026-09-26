---
id: memory-user-list
title: "Memory.User.List"
sidebar_label: "Memory.User.List"
sidebar_position: 100
description: "Beiðni- og svarsamningur fyrir Memory.User.List Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Sýnir lista yfir user-scoped memory færslur með `userName`, `id`, og `description` aðeins. The `memory` blob er omitted. nota áður en `Memory.User.Get` til choose which vöru til load.

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
    { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes" }
  ]
}
```

## Tengdar skilaboðategundir
- `Memory.User.Get`
- `Memory.User.Set`
- `Memory.Company.List`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

