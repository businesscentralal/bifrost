---
id: user-notification-count
title: "User.Notification.Count"
sidebar_label: "User.Notification.Count"
sidebar_position: 137
description: "Beiðni- og svarsamningur fyrir User.Notification.Count Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar total, unread, og lesa counts of notification Athugasemdir addressed til the current `UserId()` recipient. Inexpensive — does ekki load the body blob.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
None.

## Uppbygging svars
```json
{ "status": "Success", "total": 12, "unread": 3, "read": 9 }
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| total | heiltala | All Athugasemdir addressed til the current user |
| unread | heiltala | Athugasemdir where `Is Read` er false |
| lesa | heiltala | total - unread |

## Tengdar skilaboðategundir
- `User.Notification.Get`
- `User.Notification.Read`

