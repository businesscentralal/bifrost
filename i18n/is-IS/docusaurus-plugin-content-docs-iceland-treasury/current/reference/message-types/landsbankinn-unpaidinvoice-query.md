---
id: landsbankinn-unpaidinvoice-query
title: "Landsbankinn.UnpaidInvoice.Query"
sidebar_label: "Landsbankinn.UnpaidInvoice.Query"
sidebar_position: 135
description: "Beiðni- og svarsamningur fyrir Landsbankinn.UnpaidInvoice.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries unpaid invoices frá Landsbankinn via Landsbankaskema `LI_Fyrirspurn_ogreiddir_reikningar`.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_ogreiddir_reikningar` (process.ashx)

## Beiðni
One selector may be supplied: `account`, `kennitala`, eða `invoiceNo`. Þegar none er supplied, the Fyrirspurn defaults til the fyrirtæki's own registration number (fyrirtæki Information "Registration Number", dashes stripped).

```json
{
  "account": "0133-26-019507", // optional
  "kennitala": "5012345679",  // optional
  "invoiceNo": "INV-1001",    // optional
  "dateFrom": "2026-01-01",    // optional
  "dateTo": "2026-01-31",      // optional
  "recordFrom": 1,               // optional
  "recordTo": 100                // optional
}
```

## Svar
Skilar `responseXml` frá the bank together með `httpStatus` og `logEntryNo`.
It also Skilar normalized analysis fields (`invoiceCount`, `vendorFoundCount`, `matchingOpenVendorLedgerEntryCount`, `payableCount`, `doNotPayCount`, `invoices[]`).
Matching logic ranks every open entry fyrir the vendor og keeps the best candidate, in this order:
exact remaining amount + same due date, exact remaining amount, fee tolerance (max 999) + same due date, fee tolerance.
Ties eru broken by the smallest due-date distance, so recurring claims með identical amounts bind til the entry fyrir the right period.
The due date compared er the bank's `finalDueDate` (eindagi), which er what BC stores as Due Date on the vendor ledger entry.
Aðeins open payables (negative Remaining Amount) eru matched; a positive Remaining Amount (credit/overpayment) er never matched against the bank's positive amount due.
Notaðu `invoices[].matchingAmountDifference`, `invoices[].matchingUsedTolerance` og `invoices[].matchingDueDateMatched` fyrir explainable decisions.

## Agent Verkflæði (recommended)
1. Kallaðu á `Landsbankinn.UnpaidInvoice.Query` með one selector (`account`, `kennitala`, eða `invoiceNo`) og valfrjálst date/paging limits.
2. Parse `responseXml` og collect unpaid rows með fields: `banki`, `hofudbok`, `numer`, `kt_krofuhafa`, `gjalddagi`.
3. **Filter out hidden claims**: `get_records` on table "Lbi Hidden Claim" filtered by Reversed=false. Exclude any unpaid row whose (`kt_krofuhafa` + `account` + `gjalddagi`) matches a hidden færsla.
4. Build PaymentSlip Fyrirspurn input frá a non-hidden row:
   - `account` = `<banki><hofudbok><numer>` (concatenated digits; dashes eru valfrjálst)
   - `kennitala` = `kt_krofuhafa`
   - `gjalddagi` = `gjalddagi` (YYYY-MM-DD)
5. Kallaðu á `Landsbankinn.PaymentSlip.Query` til Sækja detailed greiðsla-slip amount components fyrir that unpaid invoice.
6. Notaðu unpaid analysis fields + greiðsla-slip amount breakdown as your greiðsla decision evidence; avoid hidden heuristics.

## Hidden claims
Table "Lbi Hidden Claim" (PK: Claimant Kt + reikningur + Due Date) tracks claims the user explicitly does not want til pay.
- til hide: `set_records` on "Lbi Hidden Claim" með the claim key, Hidden By = current user, Hidden At = now, og a Reason.
- til unhide: `set_records` setting Reversed = true, Reversed By = user, Reversed At = now.
- Always filter `Reversed = false` Þegar checking hidden claims.
- A retention policy sjálfkrafa Eyðir reversed færslur eftir 1 year.

## Cross-message key mapping
| Unpaid Reitur | PaymentSlip Reitur | Notes |
|---|---|---|
| `banki` + `hofudbok` + `numer` | `account` | Notaðu 12-digit reikningur; implementation also accepts dashed format. |
| `kt_krofuhafa` | `kennitala` | Claimant kennitala frá unpaid row. |
| `gjalddagi` | `gjalddagi` | Due date verður að match the slip Fyrirspurn key. |

## Typical reason til chain
Notaðu unpaid Fyrirspurn til discover candidate invoices, then greiðsla-slip Fyrirspurn til read `upphaed_til_greidslu`, `drattarvextir`, fees, og `samtals` fyrir greiðsla decisions.

## Authentication
Tengingin logs in til Landsbankaskema (`LI_Innskra`) og reuses the session token sjálfkrafa.


