---
id: document-approval-cancel
title: "Document.Approval.Cancel"
sidebar_label: "Document.Approval.Cancel"
sidebar_position: 25
description: "Beiðni- og svarsamningur fyrir Document.Approval.Cancel Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Cancels all opið approval færslur fyrir a skjal með routing through BC standard `Approvals Mgmt.OnCancelDocumentApprovalRequest`. aðeins callable með users granted heimild in Bifrost Setup. Restricted til a fixed set of stutt skjal töflur.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
ekki endurtekningarþolið. Re-running eftir all opið færslur eru gone Skilar `No open approval entries found for this document.`

## stutt töflur
- 36 Sales Header
- 38 Purchase Header
- 130 Incoming skjal

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int eða Text | Yes | Identifies the skjal tafla |
| recordSystemId | GUID | Yes | SystemId of the skjal |

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Cancel",
  "data": { "tableId": 36, "recordSystemId": "a1b2c3d4-..." }
}
```

## Uppbygging svars
Skilar an approval log wrapper of `approvalType` `Cancel` með `linkedApprovalEntries` reflecting the canceled færslur.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Cancel",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "a1b2c3d4-...", "approvalCode": "CE00000000010",
    "request": {},
    "linkedApprovalEntries": [],
    "linkedPostedApprovalEntries": []
  }]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| Unsupported tafla | `Table {tableId} ({tableName}) is not supported for Document.Approval.Cancel. Supported tables: Sales Header (36), Purchase Header (38), Incoming Document (130).` |
| vantar recordSystemId | `Missing required 'recordSystemId' in request.` |
| heimild denied | `User {userId} does not have permissions to cancel document approvals via Bifrost.` |
| færsla fannst ekki | `Record with SystemId {systemId} not found in table {tableId}.` |
| No opið færslur | `No open approval entries found for this document.` |

## Tengdar skilaboðategundir
- `Document.Approval.Send`
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Get`

