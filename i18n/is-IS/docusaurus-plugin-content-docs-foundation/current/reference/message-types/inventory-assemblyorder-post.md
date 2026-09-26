---
id: inventory-assemblyorder-post
title: "Inventory.AssemblyOrder.Post"
sidebar_label: "Inventory.AssemblyOrder.Post"
sidebar_position: 78
description: "Beiðni- og svarsamningur fyrir Inventory.AssemblyOrder.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Bókar an Assembly Order með calling BC `Assembly-Post.Run`. Optionally overrides `Posting Date` og `Quantity to Assemble` áður en posting. eftir posting, Svarið includes the posted skjal númer plus (þegar discoverable) the matching Posted Assembly Header `SystemId` og quantity.

**Stefna**: Innkomandi  **Efnisgerð**: `text/json`

## Idempotency / Safety
ekki endurtekningarþolið. tókst posting deletes the Uppruni `Assembly Header` row, writes a `Posted Assembly Header`, vöru bók færslur, og Gildi færslur. `Commit()` er issued áður en posting. Posting failures roll back via `Codeunit.Run`/BC og return `status: "Error"` með the BC message.

## Order Identification
Standard `Assembly Header` identification:
1. `subject` parsed as GUID -> header `SystemId`.
2. `subject` as text -> header `No.` (með `Document Type = Order`).
3. Request JSON keys (fyrsta match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| postingDate | dagsetning | No | Overrides header `Posting Date`. Format `0,9` (`yyyy-MM-dd`). |
| quantityToAssemble | tugabrot | No | Overrides `Quantity to Assemble` til support partial posting. Applied aðeins þegar `> 0`. |

## Request Examples
```json
{ "type": "Inventory.AssemblyOrder.Post", "subject": "AO000123" }
```
```json
{
  "type": "Inventory.AssemblyOrder.Post",
  "data": { "documentNo": "AO000123", "quantityToAssemble": 2 }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "documentNo": "AO000123",
  "postedDocumentNo": "PA000045",
  "itemNo": "BICYCLE",
  "postingDate": "2026-04-15",
  "assembledQuantityBefore": 0,
  "assembleToOrder": false,
  "postedSystemId": "00000000-0000-0000-0000-000000000000",
  "postedQuantity": 5
}
```

| Property | Lýsing |
|----------|-------------|
| status | `Success` on completed posting; `Error` otherwise. |
| documentNo | Original Assembly Order `No.`. |
| postedDocumentNo | Header `Posting No.` (the posted skjal númer assigned með BC). |
| itemNo | Parent vöru. |
| postingDate | Posting dagsetning notað (Format `0,9`). |
| assembledQuantityBefore | `Assembled Quantity` úr the header just áður en posting. |
| assembleToOrder | Header `Assemble to Order` flag. |
| postedSystemId | aðeins present þegar the Posted Assembly Header could be located (Format `0,4`). |
| postedQuantity | aðeins present þegar the Posted Assembly Header could be located. |

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST ItemPost ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST ItemPost ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST ItemPost ori' permission set.` | Kallandi lacks the `BIFROST ItemPost ori` heimild set. |
| `Assembly Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, documentNo, assemblyOrderNo, no.` (`MissingParameter`); gefið en fannst ekki: `Assembly Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier supplied eða lookup mistókst. |
| (BC posting Villa text) | `Assembly-Post.Run` threw (insufficient inventory, vantar fields, etc.). |

## Tengdar skilaboðategundir
- `Inventory.AssemblyOrder.PreviewPost` - dry run með predicted bók færslur.
- `Inventory.AssemblyOrder.Release` - release áður en posting.
- `Inventory.AssemblyOrder.Statistics` - inspect costs / quantities fyrsta.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

