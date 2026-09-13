---
id: user-notification-send
title: "User.Notification.Send"
sidebar_label: "User.Notification.Send"
sidebar_position: 140
description: "Beiðni- og svarsamningur fyrir User.Notification.Send Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til a ný notification note in `Bifrost Note`. The sender er always set til the current `UserId()`. nota `threadId` + `parentEntryNo` til append til an fyrirliggjandi thread, eða omit both til start a ný conversation. valfrjálst `relatedTableId` + `relatedRecordSystemId` link the note til a BC færsla.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| recipientUserId | Code[50] | Yes | Recipient user (the BC user Heiti) |
| subject | Text[250] | Yes | Notification subject |
| body | Text | No | Body content stored in the Body blob |
| threadId | GUID | No | fyrirliggjandi thread til append til |
| parentEntryNo | heiltala | áskilið þegar `threadId` er supplied | færsla No. of the parent note |
| relatedTableId | heiltala | No | Linked BC tafla ID |
| relatedRecordSystemId | GUID | No | Linked BC færsla SystemId |
| notificationType | Text | No | Heiti of a `Notification Entry Type` enum Gildi |

## Dæmi um beiðni
```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JANE",
    "subject": "Please review SO-1023",
    "body": "Customer asked about shipping date.",
    "relatedTableId": 36,
    "relatedRecordSystemId": "a1b2c3d4-..."
  }
}
```

## Uppbygging svars
The created Bifrost Note færsla serialized til JSON (no wrapping `status`/`result` envelope).

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar recipientUserId | `Missing required field 'recipientUserId' in request.` |
| vantar eða empty subject | `Missing required field 'subject' in request.` |
| threadId án parentEntryNo | `Missing required field 'parentEntryNo' when 'threadId' is specified.` |

## Tengdar skilaboðategundir
- `User.Notification.Get`
- `User.Notification.Thread`
- `User.Notification.Read`

