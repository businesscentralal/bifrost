---
id: inventory-transferorder-reopen
title: "Inventory.TransferOrder.Reopen"
sidebar_label: "Inventory.TransferOrder.Reopen"
sidebar_position: 92
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.Reopen Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Reopens a Released Transfer Order so it getur be edited. Delegates til the isolated `Transfer Order Reopen Process` codeunit via `Codeunit.Run` (BC `LockTable` er ekki allowed inside the outer TryFunction, but er allowed inside `Codeunit.Run`).

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
endurtekningarþolið. Reopening an already-`Open` order Skilar `Success` með `statusBefore = Open` og `statusAfter = Open` án touching BC.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Reopen", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Reopen",
  "data": { "documentNo": "TO000456" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "TO000456",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusBefore": "Released",
  "statusAfter": "Open"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` (þar á meðal the already-opið no-op path); `Error` ef `Transfer Order Reopen Process` mistókst. |
| documentNo | Transfer Order `No.`. |
| transferFromCode / transferToCode / directTransfer | Header echo. |
| statusBefore | `Released` eða `Open` - Gildi áður en reopen was attempted. |
| statusAfter | Always `Open` on Tókst. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Transfer Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, transferOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Transfer Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| (BC validation Villa text) | `Transfer Order Reopen Process` mistókst (rare). |

## Tengdar skilaboðategundir
- `Inventory.TransferOrder.Release` - return til Released.
- `Data.Records.Set` on `Transfer Line` - edit lines once opið.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

