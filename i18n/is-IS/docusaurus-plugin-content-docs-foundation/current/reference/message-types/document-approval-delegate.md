---
id: document-approval-delegate
title: "Document.Approval.Delegate"
sidebar_label: "Document.Approval.Delegate"
sidebar_position: 26
description: "Beiðni- og svarsamningur fyrir Document.Approval.Delegate Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Delegates ein eða fleiri opið Approval færsla færslur til another approver. The target user verður að already be set up as a Substitute in BC standard User Setup; otherwise the call fails.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
ekki endurtekningarþolið. Once delegated, the Approver ID changes og the original færsla er no longer addressable með the original approver.

## Identifier Resolution
1. `entries` fylki in request JSON
2. `entryNo` eða `systemId` in request JSON
3. Bifrost `subject` (heiltala færsla No. eða GUID SystemId)

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| delegateToUserId | Text | Yes | User ID of the substitute approver |
| færslur | fylki | No | Batch of færsla references (`entryNo` eða `systemId`) |
| entryNo | heiltala | No | Single-færsla mode |
| systemId | GUID | No | Single-færsla mode |
| comment | Text | No | Stored as Approval Comment Line |

## Dæmi um beiðni
```json
{
  "type": "Document.Approval.Delegate",
  "data": {
    "entries": [{"entryNo": 5}],
    "delegateToUserId": "JANE",
    "comment": "Out of office until Friday."
  }
}
```

## Uppbygging svars
hver `result` element er an approval log wrapper (sama as `Document.Approval.Get`) með `approvalType` `Delegate` og these extra fields:
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| entryNo | heiltala | Approval færsla No. that was delegated |
| statusBefore | Text | Always `Open` |
| delegatedTo | Text | ný Approver ID eftir delegation |

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar delegateToUserId | `The delegateToUserId field is required for delegation.` |
| Target user vantar User Setup | `User Setup for delegate target user {userId} not found.` |
| No færslur resolved | `No approval entries could be resolved from the request. Provide entryNo or systemId via subject, request JSON, or entries array.` |
| færsla fannst ekki | `Approval Entry {entryNo} not found.` |
| SystemId fannst ekki | `Approval Entry with SystemId {systemId} not found.` |
| færsla ekki opið | `Approval Entry {entryNo} has status {status}. Only entries with status Open can be delegated.` |

## Tengdar skilaboðategundir
- `Document.Approval.Approve`
- `Document.Approval.Reject`
- `Document.Approval.Get`
- `Document.Approval.Me`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

