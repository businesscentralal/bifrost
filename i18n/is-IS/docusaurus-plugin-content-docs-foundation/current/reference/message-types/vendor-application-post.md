---
id: vendor-application-post
title: "Vendor.Application.Post"
sidebar_label: "Vendor.Application.Post"
sidebar_position: 142
description: "Beiðni- og svarsamningur fyrir Vendor.Application.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Applies an opið `Vendor Ledger Entry` (the *applying* færsla, identified via subject/request JSON) against ein eða fleiri opið birgi bók færslur (the *applies-til* færslur) using Microsoft codeunit `VendEntry-Apply Posted Entries`. Persists the jöfnun immediately — no preview.

Implementation delegates til codeunit `Vend. Apply Post Process` via `Codeunit.Run`; hvaða Villa er caught og returned via `Argument.RespondWithLastError()`.

**Stefna**: Innkomandi  **Efnisgerð**: text/json

## Idempotency / Safety
ekki endurtekningarþolið. A second call replaying the sama request mun either re-apply an færsla that er still opið (creating duplicate jöfnanir) eða fail með `Applying vendor ledger entry {n} is closed and cannot be applied.` ef the prior jöfnun lokað the applying færsla. nota `Vendor.Application.Reverse` til undo.

hver jöfnun er tagged með `Apply Unapply Parameters."Apply ID" = 'BIF-' + <applyingEntryNo> + '-' + UserId()` fyrir traceability.

## Forgangsröð auðkenna (Applying færsla)
Resolved með `Argument.FindVendorLedgerEntry`:
1. `subject` as GUID → `VendorLedgerEntry.GetBySystemId`.
2. `subject` parseable as heiltala (`Evaluate` fmt 9) → `Get` með `Entry No.`.
3. Request JSON keys (fyrsta hit wins): `systemId`, `recordSystemId`, `id` (all GUID); `entryNo`, `entryNumber` (integers).

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| appliesToEntries | fylki | Yes | Non-empty fylki of *applies-til* birgi bók færslur. hver element may be: an heiltala færsla No.; a GUID; a strengur GUID; eða an hlutur með `entryNo` / `systemId` / `recordSystemId` / `id`. |
| postingDate | dagsetning | No | jöfnun posting dagsetning. Defaults til the applying færsla's `Posting Date`. |
| documentNo | Text[20] | No | skjal No. tagged onto the jöfnun. Defaults til the applying færsla's `Document No.`. |
| amountToApply | tugabrot | No | upphæð til apply on the applying færsla. Defaults til the applying færsla's `Remaining Amount`. |

All applies-til færslur verður að belong til the sama birgi as the applying færsla. The full applied upphæð on the applying færsla side equals `amountToApply`; the sum across applying og applies-til sides verður að be zero fyrir a full apply (sign convention: reikningur / Refund negative, Payment / Credit Memo positive).

## Dæmi um beiðni
Pay reikningur 4001 (færsla 12) með payment færsla 21:
```json
{ "type": "Vendor.Application.Post", "subject": "21", "data": { "appliesToEntries": [ 12 ] } }
```

Pay multiple reikningar með a single payment og an explicit posting dagsetning:
```json
{
  "type": "Vendor.Application.Post",
  "subject": "21",
  "data": { "appliesToEntries": [ { "entryNo": 12 }, { "entryNo": 14 } ], "postingDate": "2026-03-15" }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "applyingEntryNo": 21,
  "applyingRecordSystemId": "<guid>",
  "vendorNo": "V01",
  "documentNo": "PMT-001",
  "postingDate": "2026-03-15",
  "amountToApply": 1500.00,
  "totalApplied": 1500.00,
  "remainingAmount": 0,
  "open": false,
  "applications": [
    { "entryNo": 12, "recordSystemId": "<guid>", "documentType": "Invoice", "documentNo": "INV-001", "amountApplied": -1000.00 },
    { "entryNo": 14, "recordSystemId": "<guid>", "documentType": "Invoice", "documentNo": "INV-002", "amountApplied": -500.00 }
  ]
}
```

| Property | Lýsing |
|----------|-------------|
| applyingEntryNo | `Entry No.` of the applying bók færsla. |
| amountToApply | The applying-side upphæð as written. |
| totalApplied | Sum of `amountApplied` across `applications`. |
| remainingAmount | `Remaining Amount` on the applying færsla eftir the jöfnun er posted. |
| opið | `Open` flag on the applying færsla eftir the call. |
| jöfnanir[].amountApplied | Signed upphæð applied on the applies-til færsla. |

## Takmörkun bókunardags

**Gefðu alltaf upp `postingDate` skýrt.** Ef það er ekki gefið upp, BC defaults til the applying færsla's `Posting Date` — but ef that dagsetning er áður en the BC company `Work Date`, eða áður en hvaða applies-til færsla's `Posting Date`, BC mun reject the jöfnun.

The posting dagsetning verður að uppfylla öll þrjú skilyrðin:
1. ≥ the applying færsla's `Posting Date`
2. ≥ every applies-til færsla's `Posting Date` (getur ekki apply a payment against a future-dated reikningur)
3. ≥ the BC company `Work Date`

Ef eitthvert skilyrði stenst ekki, BC Skilar: *"Innfærð bókunardagsetning má ekki vera á undan bókunardagsetningunni á lánardrottinsfærslu"* ("The entered posting dagsetning may ekki be áður en the posting dagsetning of the birgi bók færsla.")

**Best er að:** gefa upp dagsetningu dagsins eða a dagsetning that er clearly later than all involved færslur og the BC work dagsetning.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur
| Villa | Orsök |
|-------|-------|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Request JSON must include 'appliesToEntries' as a non-empty array.` | `appliesToEntries` vantar, ekki an fylki, eða empty. |
| `Applying vendor ledger entry {n} is closed and cannot be applied.` | Applying færsla er already lokað (`Open = false`). |
| `Target vendor ledger entry {n} not found.` | Applies-til færsla resolution returned no færsla. |
| `Target entry {n} belongs to vendor {a}; expected vendor {b}.` | Applies-til færsla belongs til a different birgi than the applying færsla. |
| `Target vendor ledger entry {n} is closed and cannot be applied.` | Applies-til færsla er already lokað. |
| `Failed to post application for entry {n}.` | `VendEntry-Apply Posted Entries` raised an Villa during post. The underlying BC Villa text er einnig included via `RespondWithLastError()`. |
| `Vendor Ledger Entry identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, entryNo, entryNumber.` (`MissingParameter`); gefið en fannst ekki: `Vendor Ledger Entry "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No applying færsla resolved með `FindVendorLedgerEntry`. |

## Tengdar skilaboðategundir
- `Vendor.Application.Reverse` — Unapply a posted jöfnun.
- `Data.Records.Get` on `Vendor Ledger Entry` / `Detailed Vendor Ledg. Entry` — Inspect færsla state.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

