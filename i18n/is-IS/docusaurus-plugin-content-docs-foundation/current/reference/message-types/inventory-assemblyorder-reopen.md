---
id: inventory-assemblyorder-reopen
title: "Inventory.AssemblyOrder.Reopen"
sidebar_label: "Inventory.AssemblyOrder.Reopen"
sidebar_position: 82
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Reopen Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Reopens a Released Assembly Order so it getur be edited again. Internally delegates til the isolated `Assembly Order Reopen Process` codeunit via `Codeunit.Run` (so BC getur `LockTable` outside the outer TryFunction context).

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
endurtekningarþolið. Reopening an already-`Open` order Skilar `Success` með `statusBefore = Open` og `statusAfter = Open` án touching BC.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Reopen", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Reopen",
  "data": { "documentNo": "AO000123" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "systemId": "00000000-0000-0000-0000-000000000000",
  "itemNo": "BICYCLE",
  "statusBefore": "Released",
  "statusAfter": "Open"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` (þar á meðal the already-opið no-op path); `Error` ef `Assembly Order Reopen Process` mistókst. |
| documentNo | Assembly Order `No.`. |
| systemId | Header `SystemId` (Format `0,4`). |
| itemNo | Parent vöru. |
| statusBefore | `Released` eða `Open` - the Gildi áður en reopen was attempted. |
| statusAfter | Always `Open` on Tókst. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| (BC validation Villa text) | `Assembly Order Reopen Process` mistókst. |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.Release` - return til Released.
- `Inventory.AssemblyOrder.RefreshLines` - refresh BOM lines once opið again.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

