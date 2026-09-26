---
id: document-approval-reject
title: "Document.Approval.Reject"
sidebar_label: "Document.Approval.Reject"
sidebar_position: 29
description: "Beiðni- og svarsamningur fyrir Document.Approval.Reject Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Rejects ein eða fleiri opið Approval færsla færslur using BC standard `Approvals Mgmt.` þegar a áskilið færsla er rejected, BC removes the remaining opið færslur og reopens the underlying skjal.

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
| færslur | fylki | No | Batch of færsla references (`entryNo` eða `systemId`) |
| entryNo | heiltala | No | Single-færsla mode |
| systemId | GUID | No | Single-færsla mode |
| comment | Text | No | Stored as Approval Comment Line, word-wrapped ef long |

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Reject",
  "data": {
    "entries": [{"entryNo": 5}],
    "comment": "Budget exceeded — please revise."
  }
}
```

## Uppbygging svars
hver `result` element er an approval log wrapper (sama as `Document.Approval.Get`) með `approvalType` `Reject` og these extra fields:
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| entryNo | heiltala | Approval færsla No. that was rejected |
| statusBefore | Text | Always `Open` |

## Villur
| Condition | Villa message |
|-----------|---------------|
| No færslur resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| færsla fannst ekki | `Approval Entry {entryNo} not found.` |
| SystemId fannst ekki | `Approval Entry with SystemId {systemId} not found.` |
| færsla ekki opið | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be rejected.` |

## Tengdar skilaboðategundir
- `Document.Approval.Approve`
- `Document.Approval.Delegate`
- `Document.Approval.Cancel`
- `Document.Approval.Get`
- `Document.Approval.Me`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

