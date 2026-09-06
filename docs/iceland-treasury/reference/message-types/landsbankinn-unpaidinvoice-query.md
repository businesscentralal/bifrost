---
id: landsbankinn-unpaidinvoice-query
title: "Landsbankinn.UnpaidInvoice.Query"
sidebar_label: "Landsbankinn.UnpaidInvoice.Query"
sidebar_position: 135
description: "Request and response contract for the Landsbankinn.UnpaidInvoice.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries unpaid invoices from Landsbankinn via Landsbankaskema `LI_Fyrirspurn_ogreiddir_reikningar`.

**Direction:** Outbound  
**Content-Type:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_ogreiddir_reikningar` (process.ashx)

## Request
One selector may be supplied: `account`, `kennitala`, or `invoiceNo`. When none is supplied, the query defaults to the company's own registration number (Company Information "Registration Number", dashes stripped).

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

## Response
Returns `responseXml` from the bank together with `httpStatus` and `logEntryNo`.
It also returns normalized analysis fields (`invoiceCount`, `vendorFoundCount`, `matchingOpenVendorLedgerEntryCount`, `payableCount`, `doNotPayCount`, `invoices[]`).
Matching logic ranks every open entry for the vendor and keeps the best candidate, in this order:
exact remaining amount + same due date, exact remaining amount, fee tolerance (max 999) + same due date, fee tolerance.
Ties are broken by the smallest due-date distance, so recurring claims with identical amounts bind to the entry for the right period.
The due date compared is the bank's `finalDueDate` (eindagi), which is what BC stores as Due Date on the vendor ledger entry.
Only open payables (negative Remaining Amount) are matched; a positive Remaining Amount (credit/overpayment) is never matched against the bank's positive amount due.
Use `invoices[].matchingAmountDifference`, `invoices[].matchingUsedTolerance` and `invoices[].matchingDueDateMatched` for explainable decisions.

## Agent workflow (recommended)
1. Call `Landsbankinn.UnpaidInvoice.Query` with one selector (`account`, `kennitala`, or `invoiceNo`) and optional date/paging limits.
2. Parse `responseXml` and collect unpaid rows with fields: `banki`, `hofudbok`, `numer`, `kt_krofuhafa`, `gjalddagi`.
3. **Filter out hidden claims**: `get_records` on table "Lbi Hidden Claim" filtered by Reversed=false. Exclude any unpaid row whose (`kt_krofuhafa` + `account` + `gjalddagi`) matches a hidden record.
4. Build PaymentSlip query input from a non-hidden row:
   - `account` = `<banki><hofudbok><numer>` (concatenated digits; dashes are optional)
   - `kennitala` = `kt_krofuhafa`
   - `gjalddagi` = `gjalddagi` (YYYY-MM-DD)
5. Call `Landsbankinn.PaymentSlip.Query` to get detailed payment-slip amount components for that unpaid invoice.
6. Use unpaid analysis fields + payment-slip amount breakdown as your payment decision evidence; avoid hidden heuristics.

## Hidden claims
Table "Lbi Hidden Claim" (PK: Claimant Kt + Account + Due Date) tracks claims the user explicitly does not want to pay.
- To hide: `set_records` on "Lbi Hidden Claim" with the claim key, Hidden By = current user, Hidden At = now, and a Reason.
- To unhide: `set_records` setting Reversed = true, Reversed By = user, Reversed At = now.
- Always filter `Reversed = false` when checking hidden claims.
- A retention policy automatically deletes reversed records after 1 year.

## Cross-message key mapping
| Unpaid field | PaymentSlip field | Notes |
|---|---|---|
| `banki` + `hofudbok` + `numer` | `account` | Use 12-digit account; implementation also accepts dashed format. |
| `kt_krofuhafa` | `kennitala` | Claimant kennitala from unpaid row. |
| `gjalddagi` | `gjalddagi` | Due date must match the slip query key. |

## Typical reason to chain
Use unpaid query to discover candidate invoices, then payment-slip query to read `upphaed_til_greidslu`, `drattarvextir`, fees, and `samtals` for payment decisions.

## Authentication
The connector logs in to Landsbankaskema (`LI_Innskra`) and reuses the session token automatically.

