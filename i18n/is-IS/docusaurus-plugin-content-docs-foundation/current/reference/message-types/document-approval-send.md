---
id: document-approval-send
title: "Document.Approval.Send"
sidebar_label: "Document.Approval.Send"
sidebar_position: 30
description: "Beiðni- og svarsamningur fyrir Document.Approval.Send Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Sendir a skjal til approval með creating Approval færsla rows directly (bypassing BC standard approval workflow definitions). Kallandinn fully specifies the approver chain. aðeins callable með users granted heimild in Bifrost Setup. Restricted til a fixed set of stutt skjal töflur.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
ekki endurtekningarþolið. Re-sending while opið færslur already exist Býr til a parallel approval chain.

## stutt töflur
- 36 Sales Header
- 38 Purchase Header
- 130 Incoming skjal

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableId / tableNumber / tableName | Int eða Text | Yes | Identifies the skjal tafla |
| recordSystemId | GUID | Yes | SystemId of the skjal |
| approvals | fylki | Yes | ein eða fleiri approval lines (Sjá below) |
| comment | Text | No | Stored as Approval Comment Line on hver færsla |

### Approval Line Fields
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| approverUserId | Text | Yes | User ID of the approver |
| sequenceNo | heiltala | No | Order within the chain (defaults til line index) |
| dueDate | dagsetning | No | Approval Due dagsetning |
| lineNumbers | fylki | No | Subset of skjal line numbers til approve (partial approval); omit fyrir the whole skjal |

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Send",
  "data": {
    "tableId": 36,
    "recordSystemId": "a1b2c3d4-...",
    "approvals": [
      { "approverUserId": "JANE", "sequenceNo": 1, "dueDate": "2024-06-15" },
      { "approverUserId": "BOB",  "sequenceNo": 2 }
    ]
  }
}
```

## Partial Approval
þegar `lineNumbers` er supplied on hvaða approval line, the upphæð og quantity fyrir that færsla eru summed aðeins across the selected lines. A note er added til Svarið describing the coverage:
> `Approval covers {N} of {M} lines ({Pct}%), {AmountPct}% of total amount.`

## Uppbygging svars
Skilar an approval log wrapper of `approvalType` `Send` með `linkedApprovalEntries` populated fyrir hver created færsla.

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar approvals fylki | `Missing required 'approvals' array in request.` |
| vantar approver on line | `Missing required 'approverUserId' in approval line {n}.` |
| Unsupported tafla | `Table {tableId} ({tableName}) is not supported for Document.Approval.Send. Supported tables: Sales Header (36), Purchase Header (38), Incoming Document (130).` |
| vantar recordSystemId | `Missing required 'recordSystemId' in request.` |
| heimild denied | `User {userId} does not have permissions to send documents to approval via Bifrost.` |
| Nothing til approve | `There is nothing to approve for {tableId} {recordSystemId}.` |

## Tengdar skilaboðategundir
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`

