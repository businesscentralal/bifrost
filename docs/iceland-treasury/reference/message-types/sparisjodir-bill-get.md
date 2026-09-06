---
id: sparisjodir-bill-get
title: "Sparisjodir.Bill.Get"
sidebar_label: "Sparisjodir.Bill.Get"
sidebar_position: 140
description: "Request and response contract for the Sparisjodir.Bill.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves all outstanding bills (kröfur) for the authenticated Sparisjóður user.

**Requires:** `Spar Bill Gate` permission set.

## Request
No request fields required. Send an empty JSON object `{}`.

## Response

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

The `details` sub-object is included when bill details are present (claimant/payor names, amounts breakdown, address).
Vendor matching uses `claimantId` -> `Vendor."Registration Number"` and then open `Vendor Ledger Entry` matching on `amountDue` (exact first, then small fee tolerance).

## Usage notes (for automation)

- This is the discovery entry point for bills: it needs no input and returns every outstanding bill with its full key.
- Response-level counters (`vendorFoundCount`, `matchingOpenVendorLedgerEntryCount`, `payableCount`, `doNotPayCount`) are quick triage metrics for agent flows.
- Bill-level decision fields are explainable evidence:
  - `vendorExists`: claimant kennitala resolved to a BC vendor
  - `hasMatchingOpenVendorLedgerEntry`: at least one open vendor ledger entry matched the bill amount
  - `matchingAmountDifference`: `amountDue - matchingRemainingAmount` (positive value means fee part on top of invoice amount)
  - `matchingUsedTolerance`: `true` when match required fee-tolerance path instead of exact match
  - `payable`: connector recommendation (`vendorExists` AND `hasMatchingOpenVendorLedgerEntry`)
  - `paymentDecision`: machine-readable reason code for audit/logging
- Decision code values:
  - `Payable_MatchedOpenVendorLedgerEntry`
  - `DoNotPay_NoVendorByRegistrationNumber`
  - `DoNotPay_NoMatchingOpenVendorLedgerEntry`
- To fetch one bill's full details, call `Sparisjodir.Bill.GetDetails` with that bill's `bank`, `ledger`, `number`, `dueDate`, **and both** `payorId` and `claimantId` (the bank requires both — see that type's notes).
- `dueDate` is returned as a timestamp (`YYYY-MM-DDT00:00:00`); pass only the date part (`YYYY-MM-DD`) to `Sparisjodir.Bill.GetDetails`.

