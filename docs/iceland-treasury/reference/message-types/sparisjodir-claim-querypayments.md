---
id: sparisjodir-claim-querypayments
title: "Sparisjodir.Claim.QueryPayments"
sidebar_label: "Sparisjodir.Claim.QueryPayments"
sidebar_position: 149
description: "Request and response contract for the Sparisjodir.Claim.QueryPayments Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a paged list of payments received against Sparisjóður claims.

**Direction:** Outbound  
**Content-Type:** text/json

## AI note
Use `claimDate` for the BC/JSON claim key date and `dueDate` for the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` for the claim key date and `ct:FinalDueDate` for the final due date; do not rename those XML elements when generating bank-integration examples.

## Use when
Use this message to retrieve payments made against claims. Filters are optional; `dateFrom` and `dateTo` restrict the payment transaction date window.

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
Each payment object contains: `claimKey` (claimant/account/claimDate), `payorId`, `amount`, `dueDate`,
`identifier`, `reference`, `categoryCode`, `redeemingBank`, `transactionDate`, `bookingDate`, `valueDate`,
`paymentType`, `amountDeposited`, `totalAmount`, `capitalGainsTax`, `billNumber`, `customerNumber`.
The `dueDate` on a payment object is the final due date returned by ClaimService, not the claim key date.

## AI setup contract (required before posting)
- Payment Method configured and discoverable for the customer context.
- Standard Payment Method balancing fields configured (`Bal. Account Type`, `Bal. Account No.`).
- Payment Method extension fields configured: `Spar Claim Identifier` and `Spar Last Claim No.`
- Company registration number available as claimant fallback.
- Customer mapping rule defined: `payorId` is primary customer key; `customerNumber` is contract/reference context only.

## Mapping sources (reuse existing data)
- `Payment Method` (table 289): balancing and posting target metadata.
- `Spar Payment Method Ext` (tableextension 10035891): claim identifier and sequencing metadata.
- `Spar Claim Header` (table 10035922): claim-to-customer and status tracking.
- `Spar Payment Batch` (table 10035960): batch-level poll/post lifecycle.
- `Spar Payment Line` (table 10035961): journal context for debit-side application.
- `Bifrost Request Log` (Log Type = Sparisjodir): source XML payloads for detailed reconciliation.

## AI query baseline (validated example)
For this customer, use claimant = company registration number from statement `accountOwnerId`.

```json
{
  "claimant": "<company-registration-no>",
  "dateFrom": "2025-11-01",
  "dateTo": "2025-11-30",
  "recordFrom": 1,
  "recordTo": 200
}
```

Observed result in this dataset: returned 13 payment rows for November 2025.

## AI posting guidance (journal conversion)
- `bookingDate` is the posting date to use.
- `payorId` is the primary customer key and should match Customer No./registration-number mapping.
- `customerNumber` is a contract reference, not a direct customer key.
- Use setup-driven accounts only (do not hardcode account numbers in prompts, examples, or automation).
  In this pattern: customer control account (innheimtukrafa) and bank account are role-based targets.

### Amount model
- Principal = `amount`
- Finance component = `totalAmount - amount`
- Withholding tax = `capitalGainsTax`
- Net bank amount = `amountDeposited` = `totalAmount - capitalGainsTax`

### Validated posting example
Payment row `reference=200000002057`, `bookingDate=2025-11-03`:
- `amount` = 39,663
- `totalAmount` = 41,051
- `capitalGainsTax` = 228
- `amountDeposited` = 40,823
- Finance component = 1,388 (posted to configured fee/interest revenue lines in this setup).

Journal pattern for the example:
- Credit customer control account: 39,663 (customer principal)
- Credit configured fee/interest revenue lines: 1,388 (split by business rules)
- Debit configured withholding-tax account: 228
- Debit bank account: 40,823

### AI posting contract (no hardcoded accounts)
1. Posting date = `bookingDate`.
2. Customer candidate = `payorId`; verify against customer mapping policy.
3. Principal = `amount`; finance component = `totalAmount - amount`.
4. Net bank amount must equal `amountDeposited` (`totalAmount - capitalGainsTax`).
5. Use role-based accounts from setup (customer control, bank, fee/interest, tax).
6. If customer or applies-to document is unresolved, place in exception flow rather than silent posting.

Always enforce idempotency before posting (recommended key: claimant + reference + bookingDate + amountDeposited).

## Errors
- `'dateFrom' / 'dateTo' must be ISO dates YYYY-MM-DD when supplied`

## Tracking tables update

When payments are received, update the "Spar Claim Header" (table 10035922):

1. Match the payment to a header using the claim key (claimant + account + claimDate) or identifier.
2. Set `Status` = Paid and `Last Modified At` = now on matched headers.
3. The payment amount may be partial — only mark Paid if the full claim amount is covered.

## Finance note
Payments may include finance revenue (interest, collection fees) posted to an income G/L account, and a withholding tax (fjármagnstekjuskattur) on that revenue posted to an asset account. The specific G/L accounts are customer-configured.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission to change `Allow HttpClient Requests` and then enable it in Extension Management.

### Check permission before changing the setting
- Verify you have permission to update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) and to manage extension settings.
- If you do not have permission, ask a BC administrator to perform the change.

### Steps to resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://<bank>-iobs.heimabanki.is`.

