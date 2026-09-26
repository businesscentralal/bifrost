---
id: user-notification-get
title: "User.Notification.Get"
sidebar_label: "User.Notification.Get"
sidebar_position: 138
description: "Beiðni- og svarsamningur fyrir User.Notification.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar notification Athugasemdir úr `Bifrost Note` where the current `UserId()` er the recipient. Includes the `Body` blob.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | númer of færslur til skip |
| take | heiltala | No | Page size (0 = no limit) |
| tableView | Text | No | BC `SetView` filter expression (additional filter on top of recipient filter) |

## Uppbygging svars
```json
{
  "status": "Success",
  "noOfRecords": 5,
  "result": ["...one object per Bifrost Note record..."]
}
```

## Tengdar skilaboðategundir
- `User.Notification.Count`
- `User.Notification.Thread`
- `User.Notification.Read`
- `User.Notification.Send`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

