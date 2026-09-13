---
id: inventory-assemblyorder-release
title: "Inventory.AssemblyOrder.Release"
sidebar_label: "Inventory.AssemblyOrder.Release"
sidebar_position: 81
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Release Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Releases an opið Assembly Order so it getur be posted. Calls `Codeunit.Run` on the BC `Release Assembly Document` codeunit.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
endurtekningarþolið. Releasing an already-`Released` order Skilar `Success` með `statusBefore = Released` og `statusAfter = Released` án touching BC.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
None beyond identification.

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Release", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Release",
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
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` (þar á meðal the already-released no-op path); `Error` ef `Release Assembly Document.Run` mistókst. |
| documentNo | Assembly Order `No.`. |
| systemId | Header `SystemId` (Format `0,4`). |
| itemNo | Parent vöru. |
| statusBefore | `Open` eða `Released` - the Gildi áður en release was attempted. |
| statusAfter | Always `Released` on Tókst. |

## Villur
| Villa | Orsök |
|-------|-------|
| `Assembly order identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, documentNo, assemblyOrderNo, no).` | No identifier supplied eða lookup mistókst. |
| (BC validation Villa text) | `Release Assembly Document.Run` mistókst (e.g. lines vantar áskilið fields, insufficient inventory). |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.Reopen` - reverse the release.
- `Inventory.AssemblyOrder.Post` - post eftir release.

