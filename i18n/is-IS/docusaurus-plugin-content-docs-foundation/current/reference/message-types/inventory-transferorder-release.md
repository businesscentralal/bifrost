---
id: inventory-transferorder-release
title: "Inventory.TransferOrder.Release"
sidebar_label: "Inventory.TransferOrder.Release"
sidebar_position: 91
description: "Beiðni- og svarsamningur fyrir Inventory.TransferOrder.Release Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Releases an opið Transfer Order so it getur be posted. Calls `Codeunit.Run` on the BC `Release Transfer Document` codeunit.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
endurtekningarþolið. Releasing an already-`Released` order Skilar `Success` með `statusBefore = Released` og `statusAfter = Released` án touching BC.

## Order Identification
Standard `Transfer Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.`.
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.TransferOrder.Release", "subject": "TO000456" }
```
```json
{
  "type": "Inventory.TransferOrder.Release",
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
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` (þar á meðal the already-released no-op path); `Error` ef `Release Transfer Document.Run` mistókst. |
| documentNo | Transfer Order `No.`. |
| transferFromCode / transferToCode / directTransfer | Header echo. |
| statusBefore | `Open` eða `Released` - Gildi áður en release was attempted. |
| statusAfter | Always `Released` on Tókst. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Transfer order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, transferOrderNo, no).` | No identifier supplied eða lookup mistókst. |
| (BC validation Villa text) | `Release Transfer Document.Run` mistókst (vantar in-transit code, ógilt lines, etc.). |

## Tengdar skilaboðategundir
- `Inventory.TransferOrder.Reopen` - reverse the release.
- `Inventory.TransferOrder.Post` - ship og/eða receive eftir release.

