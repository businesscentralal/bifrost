---
id: inventory-assemblyorder-previewpost
title: "Inventory.AssemblyOrder.PreviewPost"
sidebar_label: "Inventory.AssemblyOrder.PreviewPost"
sidebar_position: 79
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.PreviewPost Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Simulates posting an Assembly Order og Skilar the captured bók færslur (vöru bók, Gildi færsla, G/L færsla where applicable) án committing. Uses BC `Gen. Jnl.-Post Preview.SetContext(Assembly-Post, AssemblyHeader)` then `Run()` og the `Posting Preview Event Handler` til capture færslur áður en BC rolls back.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
Safe og endurtekningarþolið. The transaction er always rolled back. No `Posted Assembly Header`, bók færslur, eða No. Series numbers persist eftir the call. `rollback: true` er included in every tókst response til make this explicit.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.PreviewPost", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.PreviewPost",
  "data": { "documentNo": "AO000123" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Assembly Order AO000123 (BICYCLE x 5) preview produced 4 entries (balanced).",
  "documentNo": "AO000123",
  "itemNo": "BICYCLE",
  "locationCode": "BLUE",
  "quantityToAssemble": 5,
  "lcyCode": "USD",
  "predictedNumbers": { "postedAssemblyNo": "PA000045" },
  "totals": { "balanced": true, "totalDebitLCY": 0, "totalCreditLCY": 0 },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 4, "entries": [] }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` whenever the preview completed; `Error` ef preview itself threw. |
| rollback | Always `true` - reminder that nothing was persisted. |
| summary | Human-readable one-liner combining skjal, vöru, quantity, færsla count, og balance state. |
| documentNo / itemNo / locationCode / quantityToAssemble | Echo of header fields. |
| lcyCode | `General Ledger Setup."LCY Code"`. |
| predictedNumbers.postedAssemblyNo | fyrsta captured `Posted Assembly Header.No.` (the skjal númer that would be assigned at real post). |
| totals.balanced | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| totals.totalDebitLCY / totals.totalCreditLCY | Sums of G/L færsla debit/credit (LCY) - typically zero fyrir non-stockkeeping/non-cost-accounting items. |
| preview[] | One element per captured tafla. hver contains `tableId`, `tableName`, `entryCount`, `entries` (subset of fields configured með `Bifrost Preview Helper`). |

## Villur
| Villa | Orsök |
|-------|-------|
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| `Assembly order %1 has no lines to post.` | Order had zero `Assembly Line` rows. `%1` er the skjal `No.`. |
| `Posting preview failed and no entries were captured. The assembly order cannot be posted in its current state.` | `Gen. Jnl.-Post Preview.Run` mistókst án surfacing a specific BC Villa text. |
| (BC posting Villa text) | Preview captured a real BC posting Villa - returned verbatim. |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.Post` - actually post once preview er clean.
- `Inventory.AssemblyOrder.Statistics` - inspect costs án simulation.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

