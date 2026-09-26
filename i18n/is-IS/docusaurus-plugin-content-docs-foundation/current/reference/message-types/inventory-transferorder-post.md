---
id: inventory-transferorder-post
title: "Inventory.TransferOrder.Post"
sidebar_label: "Inventory.TransferOrder.Post"
sidebar_position: 89
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar a Transfer Order via BC codeunit 5706 `TransferOrder-Post (Yes/No)`. Behaviour depends on the header `Direct Transfer` flag:

- **Non-direct transfer**: Kallandi verður að supply `postingType = "Ship"` eða `"Receive"`. BC Bókar aðeins the requested side.
- **Direct transfer**: `postingType` er ignored. BC Les `Inventory Setup."Direct Transfer Posting"` og Bókar either a single Direct Transfer eða Receipt + Shipment.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. `Commit()` er issued áður en posting. tókst posting writes vöru bók færslur, Gildi færslur, og Posted Transfer Shipment / Receipt færslur, og increments `Last Shipment No.` / `Last Receipt No.` on the header. Posting failures roll back via `Codeunit.Run`/BC og return `status: "Error"` með the BC text.

Implementation binds the `Transfer Post Subscriber` til override `OnBeforeGetPostingOptions` so the StrMenu prompt er suppressed og the chosen ship/receive/transfer flags eru injected.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| postingType | Text | áskilið fyrir non-direct transfers, ignored fyrir direct | `"Ship"` eða `"Receive"` (case-insensitive). |

## Request Examples
```json
{
  "type": "Inventory.TransferOrder.Post",
  "subject": "TO000456",
  "data": { "postingType": "Ship" }
}
```
```json
{ "type": "Inventory.TransferOrder.Post", "subject": "TO000457" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "postingType": "Ship",
  "directTransfer": false,
  "postedShipmentNo": "PTS00012",
  "postedReceiptNo": "",
  "postingDate": "2026-04-15"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| documentNo | Original Transfer Order `No.`. |
| postingType | `Ship`, `Receive`, eða `DirectTransfer` (fyrir direct transfers). Echoes the supplied case fyrir non-direct. |
| directTransfer | Header flag. |
| postedShipmentNo | Set þegar `Last Shipment No.` advanced during this post. Empty otherwise. |
| postedReceiptNo | Set þegar `Last Receipt No.` advanced during this post. Empty otherwise. |
| postingDate | Posting dagsetning on the header eftir posting (Format `0,9`). |

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST ItemPost ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Kallandi lacks the `BIFROST ItemPost ori` heimild set. |
| `Transfer Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, transferOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Transfer Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| `For a non-direct transfer order, postingType must be "Ship" or "Receive".` | Non-direct transfer og `postingType` omitted. |
| `postingType must be "Ship", "Receive", or "ShipReceive". Received: {value}` | `postingType` had an unsupported Gildi, eða `ShipReceive`/`Ship+Receive` was requested fyrir a non-direct transfer (ekki stutt með BC in one step). |
| (BC posting Villa text) | `TransferOrder-Post (Yes/No).Run` threw (e.g. insufficient inventory, unreleased order). |

## Tengdar skilaboðategundir
- `Inventory.TransferOrder.PreviewPost` - simulate áður en posting.
- `Inventory.TransferOrder.Release` - release áður en posting.
- `Inventory.TransferOrder.Statistics` - inspect totals.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

