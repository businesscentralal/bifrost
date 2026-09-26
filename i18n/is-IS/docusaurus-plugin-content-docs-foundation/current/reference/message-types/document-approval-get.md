---
id: document-approval-get
title: "Document.Approval.Get"
sidebar_label: "Document.Approval.Get"
sidebar_position: 27
description: "Beiðni- og svarsamningur fyrir Document.Approval.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar Bifrost Approval Log færslur — the audit trail fyrir every approval action processed með Bifrost (Send, Approve, Reject, Delegate, Cancel). hver færsla includes the original request payload, the linked opið Approval færsla rows, og hvaða Posted Approval færsla rows that resulted.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| skip | heiltala | No | Pagination offset (Sjálfgefið 0) |
| take | heiltala | No | Page size (Sjálfgefið 50, max 1000) |
| tableView | Text | No | BC-style filter against `Bifrost Approval Log` (e.g. `WHERE(Field1=FILTER(Value))`) |

## heimild Filtering
hver row er filtered against Kallandinn's lesa heimild fyrir the underlying færsla (resolved via tableId + recordSystemId). þegar Kallandinn lacks heimild, `tableId`, `tableName` og `tableCaption` eru omitted úr that row.

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Get",
  "data": { "skip": 0, "take": 50 }
}
```

## Uppbygging svars
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Approve",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "...", "approvalCode": "CE00000000001",
    "request": { "...": "original Bifrost payload" },
    "linkedApprovalEntries": [{
      "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
      "status": "Open", "approverId": "JANE",
      "dueDate": "2024-06-15", "currency": "USD",
      "amount": 1000.0, "amountLCY": 1000.0,
      "lastModified": "2024-06-10T14:30:00Z"
    }],
    "linkedPostedApprovalEntries": [{
      "entryNo": 5, "sequenceNo": 1, "documentNo": "SO-100",
      "status": "Approved", "approverId": "JANE",
      "dueDate": "2024-06-15", "currency": "USD",
      "amount": 1000.0, "amountLCY": 1000.0,
      "lastModified": "2024-06-10T14:35:00Z"
    }]
  }]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| id | GUID | Approval log SystemId |
| lastModified | DateTime | Approval log SystemModifiedAt |
| approvalType | Text | One of Send, Approve, Reject, Delegate, Cancel |
| tableId / tableName / tableCaption | Int / Text / Text | skjal tafla (omitted ef no heimild) |
| recordSystemId | GUID | skjal SystemId |
| approvalCode | Code | Bifrost sequential code (e.g. `CE00000000001`) |
| request | hlutur | Original Bifrost JSON |
| linkedApprovalEntries | fylki | opið Approval færsla rows fyrir the skjal |
| linkedPostedApprovalEntries | fylki | Posted Approval færsla rows fyrir the skjal |

## Tengdar skilaboðategundir
- `Document.Approval.Send`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Me`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

