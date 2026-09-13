---
id: user-notification-read
title: "User.Notification.Read"
sidebar_label: "User.Notification.Read"
sidebar_position: 139
description: "Beiðni- og svarsamningur fyrir User.Notification.Read Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Marks ein eða fleiri notification Athugasemdir as lesa eða unread. aðeins Athugasemdir where the current `UserId()` er the recipient eru affected. færslur that eru already in the requested state, eða that belong til other users, eru silently ignored. Svarið Sýnir lista yfir the færslur that were actually changed.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
endurtekningarþolið: re-sending the sama payload produces no further changes.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| entryNos | fylki of heiltala | Yes | `Entry No.` values til update |
| isRead | sanngildi | No | Target state (Sjálfgefið `true`) |

## Dæmi um beiðni
```json
{ "type": "User.Notification.Read", "data": { "entryNos": [101, 102, 103], "isRead": true } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": ["...one object per modified record..."]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar eða non-fylki entryNos | `Missing required field 'entryNos' (array of integers) in request.` |

## Tengdar skilaboðategundir
- `User.Notification.Get`
- `User.Notification.Count`

