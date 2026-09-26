---
id: document-approval-approve
title: "Document.Approval.Approve"
sidebar_label: "Document.Approval.Approve"
sidebar_position: 24
description: "Beiðni- og svarsamningur fyrir Document.Approval.Approve Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Approves ein eða fleiri opið Approval færsla færslur using BC standard `Approvals Mgmt.` Cascades automatically: þegar the síðasta áskilið færsla er approved, BC releases the underlying skjal. styður delegation via BC standard User Setup substitutes.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
ekki endurtekningarþolið. Re-running on an færsla whose status er no longer `Open` Skilar an Villa.

## Identifier Resolution
1. `entries` fylki in request JSON
2. `entryNo` eða `systemId` in request JSON
3. Bifrost `subject` (heiltala færsla No. eða GUID SystemId)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| færslur | fylki | No | Batch of færsla references, hver með `entryNo` eða `systemId` |
| entryNo | heiltala | No | Single-færsla mode |
| systemId | GUID | No | Single-færsla mode |
| comment | Text | No | Stored as Approval Comment Line, word-wrapped ef long |

## Request Examples
Single færsla via subject:
```json
{ "type": "Document.Approval.Approve", "subject": "5" }
```
Batch með comment:
```json
{
  "type": "Document.Approval.Approve",
  "data": {
    "entries": [{"entryNo": 5}, {"entryNo": 6}],
    "comment": "Approved for Q2 budget."
  }
}
```

## Uppbygging svars
hver `result` element er an approval log wrapper (sama as `Document.Approval.Get`) extended með action-specific fields.
```json
{
  "status": "Success", "noOfRecords": 1,
  "result": [{
    "id": "f1e2...", "lastModified": "2024-06-10T14:30:00Z",
    "approvalType": "Approve",
    "tableId": 36, "tableName": "Sales Header", "tableCaption": "Sales Header",
    "recordSystemId": "a1b2...", "approvalCode": "CE00000000001",
    "request": { },
    "linkedApprovalEntries": ["...see Document.Approval.Get for shape..."],
    "linkedPostedApprovalEntries": [],
    "entryNo": 5, "statusBefore": "Open"
  }]
}
```

## Action-Specific Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| entryNo | heiltala | Approval færsla No. that was approved |
| statusBefore | Text | Always `Open` |

## Villur
| Condition | Villa message |
|-----------|---------------|
| No færslur resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| færsla fannst ekki | `Approval Entry {entryNo} not found.` |
| SystemId fannst ekki | `Approval Entry with SystemId {systemId} not found.` |
| færsla ekki opið | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be approved.` |

## Tengdar skilaboðategundir
- `Document.Approval.Send`
- `Document.Approval.Reject`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`
- `Document.Approval.Me`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

