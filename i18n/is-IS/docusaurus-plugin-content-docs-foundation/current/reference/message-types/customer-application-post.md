---
id: customer-application-post
title: "Customer.Application.Post"
sidebar_label: "Customer.Application.Post"
sidebar_position: 9
description: "Beiðni- og svarsamningur fyrir Customer.Application.Post Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bókar a viðskiptamanni bók færsla jöfnun — pairs an *applying* færsla (a Payment, Refund eða Credit Memo, typically) against ein eða fleiri *target* reikningar/charges. Runs `Cust. Entry-Apply Posted Entries` inside isolated process codeunit 65558 (`Cust. Apply Post Process`), so hvaða Mistókst rolls back the whole jöfnun.

**Stefna**: Innkomandi (state change)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- ekki endurtekningarþolið: hver call Bókar a ný jöfnun — re-running on the sama færslur Bókar another jöfnun (subject til BC rules og the resulting `Remaining Amount`).
- lokað færslur getur ekki participate — both the applying færsla og hver target eru validated til have `Open = true` áður en applying.
- All targets verður að belong til the **sama viðskiptamanni** as the applying færsla.
- jöfnun er posted under an `ApplyId = 'BIF-' + Format(EntryNo) + '-' + UserId()` so the resulting `Detailed Cust. Ledg. Entry` rows getur be traced back til the call.

## Applying-færsla Forgangsröð auðkenna

Via `FindCustLedgerEntry` — Subject fyrsta, then JSON:
1. `subject` — GUID = `Cust. Ledger Entry.SystemId`, otherwise interpreted as the heiltala `Entry No.`.
2. JSON `systemId` / `recordSystemId` / `id` — `Cust. Ledger Entry.SystemId`.
3. JSON `entryNo` / `entryNumber` — heiltala `Entry No.`.

## Snið markfærslu (`appliesToEntries`)

áskilið, non-empty JSON fylki. hver element may be:
- A **einfalt gildi** — númer (`Entry No.`) eða strengur (numeric `Entry No.` eða GUID `SystemId`).
- An **hlutur** með one of: `entryNo` / `entryNumber` (heiltala) eða `systemId` / `recordSystemId` / `id` (GUID).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| Applying færsla keys | — | Yes (Subject eða JSON) | Sjá Forgangsröð úrlausnar. |
| `appliesToEntries` | fylki | **Yes** | ein eða fleiri target færslur. Format above. |
| `postingDate` | dagsetning | No | Format 9. Sjálfgefið: applying færsla's `Posting Date`. |
| `documentNo` | strengur | No | Sjálfgefið: applying færsla's `Document No.`. |
| `amountToApply` | tugabrot | No | Override `Amount to Apply` on the applying færsla. |

### Dæmi um beiðni
```json
{
  "entryNo": 5001,
  "appliesToEntries": [
    { "entryNo": 4900 },
    { "systemId": "11111111-2222-3333-4444-555555555555" }
  ],
  "postingDate": "2026-01-15"
}
```

## Uppbygging svars

### Tókst
```json
{
  "status": "Success",
  "applyingEntryNo": 5001,
  "applyingRecordSystemId": "...",
  "customerNo": "10000",
  "documentNo": "PAY-005",
  "postingDate": "2026-01-15",
  "amountToApply": -2500.00,
  "totalApplied": 2500.00,
  "remainingAmount": 0.00,
  "open": false,
  "applications": [
    {
      "entryNo": 4900,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "PS-INV103001",
      "amountApplied": 2500.00
    }
  ]
}
```

### Mistókst
```json
{ "status": "Error", "code": "BusinessCentralError", "error": "...", "hint": "..." }
```

### Svarreitir

| Reitur | Uppruni |
|---|---|
| `remainingAmount` / `open` | Re-lesa úr the applying færsla eftir posting. |
| `applications[]` | One færsla per target. `amountApplied` comes úr the matched `Detailed Cust. Ledg. Entry` rows created under the `ApplyId`. |

## Takmörkun bókunardags

**Gefðu alltaf upp `postingDate` skýrt.** Ef það er ekki gefið upp, BC defaults til `WorkDate()` — which may differ úr the applying færsla's posting dagsetning og Orsök unexpected Villur.

The posting dagsetning verður að uppfylla öll þrjú skilyrðin:
1. ≥ the applying færsla's `Posting Date`
2. ≥ every applies-til færsla's `Posting Date` (getur ekki apply a payment against a future-dated reikningur)
3. ≥ the BC company `Work Date` (BC enforces this internally)

Ef eitthvert skilyrði stenst ekki, BC Skilar: *"The entered posting dagsetning may ekki be áður en the posting dagsetning of the viðskiptamanni bók færsla."*

**Best er að:** gefa upp dagsetningu dagsins eða a dagsetning that er later than all involved færslur.

## Hegðun greiðsluafsláttar

þegar an reikningur has an virkt payment discount (`Pmt. Discount Date` ekki yet expired), BC absorbs the discount automatically:
- `totalApplied` mun be **less** than the reikningur upphæð (reduced með the discount)
- `remainingAmount` on the applying færsla reflects the unabsorbed discount portion (the færsla stays `open: true` með a small residual)
- The reikningur closes fully despite the reduced payment upphæð

til prevent discount absorption, set `postingDate` eftir the `Pmt. Discount Date` on the reikningur.

## Dæmi (úr einingaprófum)

úr `Cust. Application Tests` (`test/test/Sales/CustApplicationTests.Codeunit.al`) — covers single og multi-target jöfnun, einfalt gildi vs hlutur færsla references, override of `postingDate`/`documentNo`/`amountToApply`, lokað-færsla rejections, og cross-viðskiptamanni rejections.

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Cust. Ledger Entry identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, entryNo, entryNumber.` (`MissingParameter`); gefið en fannst ekki: `Cust. Ledger Entry "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Applying færsla could ekki be resolved. |
| `Request JSON must include 'appliesToEntries' as a non-empty array.` | `appliesToEntries` vantar, ekki an fylki, eða empty. |
| `Applying customer ledger entry {entryNo} is closed and cannot be applied.` | Applying færsla `Open = false`. |
| `Target customer ledger entry {entryNo} not found.` | One of `appliesToEntries` did ekki match a `Cust. Ledger Entry`. |
| `Target entry {entryNo} belongs to customer {targetCustomerNo}; expected customer {applyingCustomerNo}.` | Cross-viðskiptamanni jöfnun rejected. |
| `Target customer ledger entry {entryNo} is closed and cannot be applied.` | Target færsla `Open = false`. |
| `Failed to post application for entry {entryNo}.` | `Cust. Entry-Apply Posted Entries` returned false / rolled back. |

## Tengdar skilaboðategundir

- `Customer.Application.Reverse` — reverse a previously posted jöfnun.
- `Customer.CreditLimit.Get` — Sjá how the jöfnun affects exposure.
- `Sales.Document.Post` — produces the reikningar/credit memos that get applied here.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

