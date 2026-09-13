---
id: sparisjodir-bill-get
title: "Sparisjodir.Bill.Get"
sidebar_label: "Sparisjodir.Bill.Get"
sidebar_position: 140
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Bill.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir Allt outstanding bills (kröfur) fyrir the authenticated Sparisjóður user.

**Requires:** `Spar Bill Gate` permission set.

## Beiðni
No Beiðni fields nauðsynlegt. Send an empty JSON object `{}`.

## Svar

```json
{
  "status": "Success",
  "count": 2,
  "vendorFoundCount": 2,
  "matchingOpenVendorLedgerEntryCount": 1,
  "payableCount": 1,
  "doNotPayCount": 1,
  "bills": [
    {
      "bank": "1234",
      "ledger": "38",
      "number": "12345678901234",
      "dueDate": "2024-12-31T00:00:00",
      "identifier": "AB123456",
      "description": "Húsaleiga desember",
      "amountDue": 120000.00,
      "minimumAmount": 120000.00,
      "claimantId": "5001234560",
      "payorId": "1234567890",
      "claimType": "Regular",
      "billType": "Regular",
      "isDebited": false,
      "isForwardPayment": false,
      "vendorExists": true,
      "vendorNo": "10000",
      "vendorName": "Acme ehf.",
      "hasMatchingOpenVendorLedgerEntry": true,
      "matchingVendorLedgerEntryNo": 12345,
      "matchingDocumentNo": "PI-100001",
      "matchingExternalDocumentNo": "AB123456",
      "matchingDueDate": "2024-12-31",
      "matchingRemainingAmount": 120000.00,
      "matchingAmountDifference": 0,
      "matchingUsedTolerance": false,
      "payable": true,
      "paymentDecision": "Payable_MatchedOpenVendorLedgerEntry"
    }
  ]
}
```

The `details` sub-object er included Þegar bill details eru present (claimant/payor names, amounts breakdown, address).
Vendor matching uses `claimantId` -> `Vendor."Registration Number"` og then open `Vendor Ledger Entry` matching on `amountDue` (exact first, then small fee tolerance).

## Usage notes (fyrir automation)

- This er the discovery entry point fyrir bills: it needs no input og Skilar every outstanding bill með its fulla key.
- Svar-level counters (`vendorFoundCount`, `matchingOpenVendorLedgerEntryCount`, `payableCount`, `doNotPayCount`) eru quick triage metrics fyrir agent flows.
- Bill-level decision fields eru explainable evidence:
  - `vendorExists`: claimant kennitala resolved til a BC vendor
  - `hasMatchingOpenVendorLedgerEntry`: at least one open vendor ledger entry matched the bill amount
  - `matchingAmountDifference`: `amountDue - matchingRemainingAmount` (positive value means fee part on top of invoice amount)
  - `matchingUsedTolerance`: `true` Þegar match nauðsynlegt fee-tolerance Slóð instead of exact match
  - `payable`: connector recommendation (`vendorExists` og `hasMatchingOpenVendorLedgerEntry`)
  - `paymentDecision`: machine-readable reason code fyrir audit/logging
- Decision code values:
  - `Payable_MatchedOpenVendorLedgerEntry`
  - `DoNotPay_NoVendorByRegistrationNumber`
  - `DoNotPay_NoMatchingOpenVendorLedgerEntry`
- til fetch one bill's fulla details, Kallaðu á `Sparisjodir.Bill.GetDetails` með that bill's `bank`, `ledger`, `number`, `dueDate`, **og both** `payorId` og `claimantId` (the bank requires both — see that Gerð's notes).
- `dueDate` er returned as a timestamp (`YYYY-MM-DDT00:00:00`); pass Aðeins the date part (`YYYY-MM-DD`) til `Sparisjodir.Bill.GetDetails`.


