---
id: arionbanki-claim-querypayments
title: "Arionbanki.Claim.QueryPayments"
sidebar_label: "Arionbanki.Claim.QueryPayments"
sidebar_position: 13
description: "Request and response contract for the Arionbanki.Claim.QueryPayments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of payments received against Arion banki claims.

**Direction:** Outbound  
**Content-Type:** text/json

## Note
`claimDate` is the BC/JSON claim key date and `dueDate` is the final due date. The bank SOAP/XML API uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to retrieve payments made against claims. Filters are optional; `dateFrom` and `dateTo` restrict the payment transaction date window (booking/transaction date of the payment, not the original claim date).

## Known limitation: verify claimKey before relying on it
On the sibling Landsbankinn connector, the equivalent `claimKey` object on each payment row was found to be blank in production testing. This has not yet been independently verified for Arion banki — test it before relying on `claimKey` for matching. If it is blank here too, match payments to claims via `reference` or `billNumber` against the claims returned by `Arionbanki.Claim.Query` instead.

## Usage notes
Use one claimant/query window per call and keep the date range aligned to the question asked. Treat the returned payments as bank-confirmed facts, and verify the full response before using it to update BC tracking or posting logic.
Persist `logEntryNo` and use it as the evidence link to request-log payloads.

## Request (all fields optional)
```json
{
  "claimant":       "1234567",
  "identifier":     "INV-2026-0001",
  "disposalAccount":"0101-26-123456",
  "dateFrom":       "2026-01-01",
  "dateTo":         "2026-12-31",
  "recordFrom":     1,
  "recordTo":       100
}
```

## Paging defaults
`recordFrom` defaults to **1** and `recordTo` defaults to **100** when omitted.

## Response
Returns `status`, `returned`, `totalCount`, `recordFrom`, `recordTo`, `logEntryNo`, and a `payments` array.
Each payment object contains: `claimKey` (see limitation above), `payorId`, `amount`, `dueDate`,
`identifier`, `reference`, `categoryCode`, `redeemingBank`, `transactionDate`, `bookingDate`, `valueDate`,
`paymentType`, `amountDeposited`, `totalAmount`, `capitalGainsTax`, `billNumber`, `customerNumber`.
The `dueDate` on a payment object is the final due date, not the claim key date.

## Required setup (before posting)
- Payment Method configured and discoverable for the customer context.
- Standard Payment Method balancing fields configured (`Bal. Account Type`, `Bal. Account No.`).
- Payment Method extension fields configured: `ORI Arion Claim Identifier` and `ORI Arion Last Claim No.`.
- Company registration number available as claimant fallback.
- Customer mapping rule: `payorId` is the primary customer key; `customerNumber` is contract/reference context only.

## Related tables and codeunits
- `Payment Method` (table 289): balancing and posting target metadata.
- `Arion Payment Method Ext` (tableextension 10036152): claim identifier and sequencing metadata.
- `Arion Claim Header` (table 10036172): claim-to-customer and status tracking.
- `Arion Claim Payment` (table 10036187): duplicate prevention — one row per imported payment, with a Posted flag.
- `Arion Claim Payment Mgt` (codeunit 10036278): idempotency API (`IsAlreadyImported`, `IsAlreadyPosted`, `RegisterImport`, `MarkPosted`).
- `Arion Payment Batch` (table 10036185): batch-level poll/post lifecycle.
- `Arion Payment Line` (table 10036186): journal context for debit-side application.
- `Bifrost Request Log ori`: source XML payloads for detailed reconciliation (filter Log Type = Arion banki).

## Posting guidance (journal conversion)
- `bookingDate` is the posting date to use.
- `payorId` is the primary customer key and should match the Customer No./registration-number mapping.
- `customerNumber` is a contract reference, not a direct customer key.
- Use setup-driven accounts only; do not hardcode account numbers. Customer control account (innheimtukrafa) and bank account are role-based targets configured per company.

### Amount model
- Principal = `amount`
- Finance component = `totalAmount - amount`
- Withholding tax = `capitalGainsTax`
- Net bank amount = `amountDeposited` = `totalAmount - capitalGainsTax`

### Posting contract (no hardcoded accounts)
1. Posting date = `bookingDate`.
2. Customer candidate = `payorId`; verify against customer mapping policy.
3. Principal = `amount`; finance component = `totalAmount - amount`.
4. Net bank amount must equal `amountDeposited` (`totalAmount - capitalGainsTax`).
5. Use role-based accounts from setup (customer control, bank, fee/interest, tax).
6. If the customer or applies-to document cannot be resolved, route to an exception queue rather than posting silently.

## Duplicate prevention (mandatory)
Before posting any payment from `QueryPayments`, check the `Arion Claim Payment` table.
The natural key is: **Claimant + Reference + Booking Date + Amount Deposited**.

### Workflow
1. For each payment row returned by `QueryPayments`:
   a. Check `Arion Claim Payment` (table 10036187) for an existing row with a matching natural key.
   b. If a row exists with `Posted = true`, skip it — it is already posted.
   c. If a row exists with `Posted = false`, the payment was imported but posting failed previously; retry posting only.
   d. If no row exists, call `Arion Claim Payment Mgt.RegisterImport(...)` to create the tracking row.
2. Create journal lines for non-duplicate payments only.
3. After successful journal posting, call `Arion Claim Payment Mgt.MarkPosted(EntryNo, DocumentNo)`.

### API (codeunit 10036278 "Arion Claim Payment Mgt")
- `IsAlreadyImported(Claimant, Reference, BookingDate, AmountDeposited): Boolean`
- `IsAlreadyPosted(Claimant, Reference, BookingDate, AmountDeposited): Boolean`
- `RegisterImport(...): BigInteger` — returns Entry No. for later MarkPosted
- `MarkPosted(EntryNo, DocumentNo)` — sets Posted=true + timestamps
- `MarkPosted(EntryNo, DocumentNo, JnlTemplate, JnlBatch)` — with journal context

Re-running `QueryPayments` for the same date range returns the same payments again. Always run the duplicate check; do not skip it.

## Errors
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Tracking tables to update
When payments are received, update both tracking tables:

### 1. Arion Claim Payment (table 10036187) — duplicate prevention
- Insert one row per payment using `Arion Claim Payment Mgt.RegisterImport`.
- After posting, call `MarkPosted` with the Document No.

### 2. Arion Claim Header (table 10036172) — status lifecycle
1. Match the payment to a header using the claim key (claimant + account + claimDate) or identifier — resolved via `reference`/`billNumber` if `claimKey` on the payment row is not reliably populated (see limitation above).
2. Set `Status` = Paid and `Last Modified At` = now on matched headers.
3. The payment amount may be partial — only mark Paid if the full claim amount is covered.

## Finance note
Payments may include finance revenue (interest, collection fees) posted to an income G/L account, and a withholding tax (fjármagnstekjuskattur) on that revenue posted to an asset account. The specific G/L accounts are customer-configured.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

