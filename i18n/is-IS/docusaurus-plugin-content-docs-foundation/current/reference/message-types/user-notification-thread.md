---
id: user-notification-thread
title: "User.Notification.Thread"
sidebar_label: "User.Notification.Thread"
sidebar_position: 141
description: "Beiðni- og svarsamningur fyrir User.Notification.Thread Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Sækir all notification Athugasemdir that belong til a specific thread. Visibility check: the current user verður að have at least one note in the thread (as recipient); ef so, the full thread er returned regardless of which users sent eða received hver individual note.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution
The Bifrost `subject` Reitur verður að contain the Thread ID as a GUID.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | númer of færslur til skip |
| take | heiltala | No | Page size (0 = no limit) |

## Uppbygging svars
```json
{
  "status": "Success",
  "noOfRecords": 4,
  "result": ["...one object per Bifrost Note in the thread..."]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| Subject er ekki a GUID | `The subject must contain the Thread ID (GUID) to retrieve.` |
| Kallandi has no note in this thread | `No notifications found for the specified Thread ID and current user.` |

## Tengdar skilaboðategundir
- `User.Notification.Get`
- `User.Notification.Send`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

