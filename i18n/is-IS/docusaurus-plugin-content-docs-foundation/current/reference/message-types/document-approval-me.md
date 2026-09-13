---
id: document-approval-me
title: "Document.Approval.Me"
sidebar_label: "Document.Approval.Me"
sidebar_position: 28
description: "Beiðni- og svarsamningur fyrir Document.Approval.Me Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the calling user's opið Approval færsla færslur. The filter `Approver ID = UserId()` er applied unconditionally — hvaða Kallandi-supplied filter on Approver ID er ignored.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | Pagination offset (Sjálfgefið 0) |
| take | heiltala | No | Page size (Sjálfgefið 50, max 1000) |

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Me",
  "data": { "skip": 0, "take": 50 }
}
```

## Uppbygging svars
hver `result` element wraps one Approval færsla. Fields prefixed með `record*` describe the skjal being approved.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
    "status": "Open", "approverId": "ME",
    "dueDate": "2024-06-15", "currency": "USD",
    "amount": 1000.0, "amountLCY": 1000.0,
    "lastModified": "2024-06-10T14:30:00Z",
    "approvalCode": "CE00000000001",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "..."
  }]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| entryNo | heiltala | Approval færsla No. |
| sequenceNo | heiltala | Sequence within the approval chain |
| documentNo | Code | skjal No. |
| status | Text | Always `Open` fyrir results returned með Me |
| approverId | Text | Always the calling user |
| dueDate | dagsetning | Approval færsla Due dagsetning |
| currency | Code | Currency Code (LCY ef blank in BC) |
| upphæð | tugabrot | upphæð in skjal currency |
| amountLCY | tugabrot | upphæð in local currency |
| lastModified | DateTime | Approval færsla SystemModifiedAt |
| approvalCode | Code | Bifrost approval log code, ef a log færsla exists |
| tableId / tableName / tableCaption / recordSystemId | mixed | skjal being approved |

## Tengdar skilaboðategundir
- `Document.Approval.Get`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`

