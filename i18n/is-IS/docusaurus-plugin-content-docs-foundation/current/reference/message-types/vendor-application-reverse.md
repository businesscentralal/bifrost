---
id: vendor-application-reverse
title: "Vendor.Application.Reverse"
sidebar_label: "Vendor.Application.Reverse"
sidebar_position: 143
description: "Beiðni- og svarsamningur fyrir Vendor.Application.Reverse Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Unapplies a previously posted birgi bók jöfnun using Microsoft codeunit `VendEntry-Apply Posted Entries.PostUnApplyVendor`. Reopens both the applying og applies-til færslur (ef they were lokað með the jöfnun) og Bókar a reversing detailed bók færsla.

Implementation delegates til codeunit `Vend. Apply Reverse Process` via `Codeunit.Run`; hvaða Villa er caught og returned via `Argument.RespondWithLastError()`.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
**ekki endurtekningarþolið.** þegar `detailedEntryNo` er omitted, the impl resolves the síðasta jöfnun færsla via `VendEntryApplyPostedEntries.FindLastApplEntry`. Calling Reverse twice án `detailedEntryNo` mun reverse two **different** jöfnanir (ef hvaða exist). Always pass `detailedEntryNo` skýrt þegar retrying.

## Forgangsröð auðkenna (birgi bók færsla)
Resolved með `Argument.FindVendorLedgerEntry`:
1. `subject` as GUID → `VendorLedgerEntry.GetBySystemId`.
2. `subject` parseable as heiltala (`Evaluate` fmt 9) → `Get` með `Entry No.`.
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `entryNo`, `entryNumber` (integers).

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| detailedEntryNo | heiltala | No (recommended) | `Entry No.` of the `Detailed Vendor Ledg. Entry` row that represents the jöfnun til reverse. verður að have `Entry Type = Application`. Ef það er ekki gefið upp, the impl reverses the **síðasta** jöfnun on the birgi bók færsla. |
| postingDate | dagsetning | **Recommended** | Posting dagsetning fyrir the reversal. Defaults til `WorkDate()` (BC Sjálfgefið in `PostUnApplyVendor`). Gefðu alltaf upp skýrt — verður að be ≥ the birgi bók færsla's `Posting Date` og ≥ the BC work dagsetning. |
| documentNo | Text[20] | No | skjal No. tagged onto the reversal. Defaults til BC behaviour (typically the original jöfnun's `Document No.`). |

## Dæmi um beiðni
Reverse the síðasta jöfnun on færsla 21:
```json
{ "type": "Vendor.Application.Reverse", "subject": "21" }
```

Reverse a specific jöfnun með detailed færsla númer:
```json
{ "type": "Vendor.Application.Reverse", "subject": "21", "data": { "detailedEntryNo": 5043, "postingDate": "2026-03-15" } }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "entryNo": 21,
  "recordSystemId": "<guid>",
  "vendorNo": "V01",
  "reversedDetailedEntryNo": 5043,
  "reversedAmount": -1500.00,
  "postingDate": "2026-03-15",
  "documentNo": "PMT-001",
  "remainingAmount": 1500.00,
  "open": true
}
```

| Property | Lýsing |
|----------|-------------|
| entryNo | `Entry No.` of the birgi bók færsla Beiðnin was issued against. |
| reversedDetailedEntryNo | `Entry No.` of the detailed bók jöfnun that was reversed. |
| reversedAmount | `Detailed Vendor Ledg. Entry.Amount` of the reversed jöfnun (signed). |
| remainingAmount | `Remaining Amount` on the birgi bók færsla eftir the reversal — typically Skilar til the original signed upphæð þegar the jöfnun er fully reversed. |
| opið | `Open` flag on the birgi bók færsla eftir the reversal. |

## Posting dagsetning Guidance

**Gefðu alltaf upp `postingDate` skýrt.** Ef það er ekki gefið upp, BC defaults til `WorkDate()`. The reversal dagsetning verður að be ≥ the birgi bók færsla's `Posting Date` og ≥ the BC work dagsetning.

## detailedEntryNo Guidance

þegar `detailedEntryNo` er omitted, the implementation reverses the **síðasta** `Detailed Vendor Ledg. Entry` of Gerð `Application` on the færsla. Supply `detailedEntryNo` skýrt þegar:
- Reversing a specific older jöfnun (ekki the síðasta one)
- Retrying eftir a mistókst reversal til avoid accidentally reversing a different jöfnun

til find the `detailedEntryNo`, call `Data.Records.Get` on `Detailed Vendor Ledg. Entry` með a filter like `WHERE(Vendor Ledger Entry No.=CONST(21),Entry Type=CONST(Application))`.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `No posted application found on vendor ledger entry {n} to reverse.` | `detailedEntryNo` omitted og `FindLastApplEntry` returned 0 — no jöfnun exists on the færsla. |
| `Detailed vendor ledger entry {n} not found.` | Explicit `detailedEntryNo` does ekki exist. |
| `Detailed vendor ledger entry {n} is not an application entry.` | The detailed færsla exists but its `Entry Type` er ekki `Application`. |
| Underlying BC Villa text | hvaða Villa raised með `CheckVendorLedgerEntryToUnapply` eða `PostUnApplyVendor` (e.g. dimensions changed since jöfnun, posting period lokað). |
| `Vendor Ledger Entry identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, entryNo, entryNumber.` (`MissingParameter`); gefið en fannst ekki: `Vendor Ledger Entry "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No birgi bók færsla resolved með `FindVendorLedgerEntry`. |

## Tengdar skilaboðategundir
- `Vendor.Application.Post` — Post the original jöfnun.
- `Data.Records.Get` on `Vendor Ledger Entry` / `Detailed Vendor Ledg. Entry` — Inspect færsla state.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

