---
id: inventory-assemblyorder-refreshlines
title: "Inventory.AssemblyOrder.RefreshLines"
sidebar_label: "Inventory.AssemblyOrder.RefreshLines"
sidebar_position: 80
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.RefreshLines Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Refreshes the component lines of an opið Assembly Order með re-validating the header `Item No.`. This re-Býr til `Assembly Line` rows úr the current parent vöru BOM og discards hvaða previous manual edits til those lines.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
Functionally endurtekningarþolið (re-running produces the sama lines), but **destructive**: hvaða manual changes til component lines eru lost. The order verður að be `Open` - BC raises an Villa fyrir `Released` orders.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.RefreshLines", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.RefreshLines",
  "data": { "documentNo": "AO000123" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "itemNo": "BICYCLE",
  "quantity": 5,
  "linesBefore": 0,
  "linesAfter": 3
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success`. Failures (e.g. released order) nota the Villa envelope. |
| documentNo | Assembly Order `No.`. |
| itemNo | Parent vöru. |
| quantity | Header `Quantity`. |
| linesBefore | númer of `Assembly Line` rows áður en the refresh. |
| linesAfter | númer of `Assembly Line` rows eftir the refresh. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied eða lookup mistókst. |
| (BC validation Villa text) | Released order, vantar BOM, eða other BC validation Mistókst on `Item No.`. |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.Create` - create a ný order.
- `Inventory.AssemblyOrder.Reopen` - return a Released order til opið áður en refreshing.

