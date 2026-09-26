---
id: inventory-transferorder-previewpost
title: "Inventory.TransferOrder.PreviewPost"
sidebar_label: "Inventory.TransferOrder.PreviewPost"
sidebar_position: 90
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Simulates posting a Transfer Order og Skilar the captured bók færslur (vöru bók, Gildi færsla, G/L færsla where applicable) án committing. Uses BC `Gen. Jnl.-Post Preview.SetContext(TransferOrder-Post, TransferHeader)` then `Run()` með the `Transfer Post Subscriber` injecting the chosen ship/receive/transfer options.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
Safe og endurtekningarþolið. The transaction er always rolled back. No Posted Transfer Shipment / Receipt rows, bók færslur, eða No. Series numbers persist eftir the call. `rollback: true` er included in every tókst response til make this explicit.

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
  "type": "Inventory.TransferOrder.PreviewPost",
  "subject": "TO000456",
  "data": { "postingType": "Ship" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Transfer Order TO000456 (BLUE -> RED) Ship preview produced 2 entries (balanced).",
  "documentNo": "TO000456",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "postingType": "Ship",
  "lcyCode": "USD",
  "predictedNumbers": { "postedShipmentNo": "PTS00012" },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 2, "entries": [] }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` whenever the preview completed; `Error` ef preview itself threw. |
| rollback | Always `true`. |
| summary | Human-readable one-liner combining skjal, úr/til codes, posting Gerð, færsla count, og balance state. |
| documentNo / transferFromCode / transferToCode / directTransfer | Echo of header fields. |
| postingType | `Ship`, `Receive`, eða `DirectTransfer`. |
| lcyCode | `General Ledger Setup."LCY Code"`. |
| predictedNumbers | One of `postedShipmentNo` / `postedReceiptNo` / `postedDirectTransferNo` depending on the posting Gerð. Empty strengur þegar nothing predicted. |
| totals.balanced | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| totals.totalDebitLCY / totals.totalCreditLCY | Sums of G/L færsla debit/credit (LCY). |
| preview[] | One element per captured tafla (`tableId`, `tableName`, `entryCount`, `entries`). Reitur set per tafla er configured með `Bifrost Preview Helper`. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Transfer Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, transferOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Transfer Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| `Transfer order %1 has no lines to post.` | Order had zero `Transfer Line` rows. `%1` er the skjal `No.`. |
| `For a non-direct transfer order, postingType must be "Ship" or "Receive".` | Non-direct transfer og `postingType` omitted. |
| `postingType must be "Ship" or "Receive". Received: {value}` | `postingType` had an unsupported Gildi. |
| `Posting preview failed and no entries were captured. The transfer order cannot be posted in its current state.` | `Gen. Jnl.-Post Preview.Run` mistókst án surfacing a specific BC Villa text. |
| (BC posting Villa text) | Preview captured a real BC posting Villa - returned verbatim. |

## Tengdar skilaboðategundir
- `Inventory.TransferOrder.Post` - actually post once preview er clean.
- `Inventory.TransferOrder.Statistics` - inspect totals.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

