---
id: landsbankinn-foreignpayment-create
title: "Landsbankinn.ForeignPayment.Create"
sidebar_label: "Landsbankinn.ForeignPayment.Create"
sidebar_position: 123
description: "Request and response contract for the Landsbankinn.ForeignPayment.Create Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a batch of foreign payments to Landsbankinn synchronously via Landsbankaskema `LI_Stofna_erlendar_greidslur`.
The bank validates each payment and returns per-payment results (accepted / rejected) in the same response.

**Direction:** Outbound (write — gated)  
**Content-Type:** text/json  
**Access:** Requires `Lbi ForeignPay Gate` (write) permission  
**Schema:** Landsbankaskema `LI_Stofna_erlendar_greidslur` v1.1 (process.ashx)

## Request
`payments` is required and must contain at least one payment object.

```json
{
  "payments": [
    {
      "classificationCode":    "REM",              // required — bank classification (e.g. REM, SAL, INT, DIV)
      "debitAccount":          "0133-26-019566",   // required — source account (branch-ledger-account)
      "costAccount":           "0133-26-019566",   // required — cost account (branch-ledger-account)
      "currency":              "EUR",              // required — ISO 4217 currency code
      "foreignAmount":         1250.00,            // required — amount in foreign currency (> 0)
      "identifier":            "INV-2026-042",     // optional — caller reference (max 20 chars)
      "customerNo":            "C00010",           // optional — customer number
      "paymentType":           "swift",            // optional — swift | urgent | sepa
      "receiptMode":           "email",            // optional — none | fax | email | faxAndEmail
      "receiptEmail":          "ap@corp.com",      // optional — receipt e-mail address
      "receiptFax":            "",                 // optional — receipt fax number
      "receiptLanguage":       "EN",               // optional — EN or IS
      "payForeignCosts":       true,               // optional — pay foreign bank charges
      "description1":          "Invoice 2026-042", // optional — narrative line 1
      "description2":          "",                 // optional — narrative line 2
      "description3":          "",                 // optional — narrative line 3
      "description4":          "",                 // optional — narrative line 4 (total d1-d4 max 140 chars)
      "customerInvoiceNumber": "INV-042",          // optional — invoice reference (max 20 chars)
      "customerExplanation":   "Q2 services",      // optional — payment explanation (max 50 chars)
      "recipient": {                               // required block
        "name":          "ACME GmbH",              // required
        "country":       "DE",                     // required — ISO 3166-1 alpha-2
        "account":       "DE89370400440532013000", // required — IBAN or local account
        "address":       "Musterstraße 1",         // optional
        "postalCode":    "10115",                  // optional
        "city":          "Berlin",                 // optional
        "bankName":      "Deutsche Bank",          // optional
        "bankAddress":   "Taunusanlage 12",        // optional
        "bankPostalCode":"60325",                  // optional
        "bankCity":      "Frankfurt",              // optional
        "bankCountry":   "DE",                     // optional
        "bankSwift":     "DEUTDEFF",               // optional — SWIFT/BIC
        "bankBic":       "DEUTDEFF"                // optional
      }
    }
  ]
}
```

## Response
```json
{
  "status":      "Success",
  "operation":   "LI_Stofna_erlendar_greidslur",
  "httpStatus":  200,
  "logEntryNo":  12345,
  "batchId":     7,           // bank batch identifier
  "batchName":   "ERLEND42", // bank batch name (if returned)
  "batchError":  "",          // batch-level error message (if any)
  "payments": [  /* accepted payments — status, identifier, debitAccount, batchId ... */ ],
  "errors":   [  /* rejected payments — identifier, errorNumber, errorMessage */ ],
  "responseXml": "..."        // raw XML from bank (for diagnostics)
}
```

## Account format
`debitAccount` and `costAccount` must be in `branch-ledger-account` form (e.g. `0133-26-019566`).
Use `Landsbankinn.Account.Verify` to confirm the destination account before submitting a foreign payment.

## Agent notes
- **Production guard:** do not submit test payments against the live bank to discover field formats. Validate inputs locally first.
- **Required preflight:** always verify recipient account validity before sending.
- **Partial failure:** the bank may accept some payments and reject others in the same batch. Check both `payments` and `errors` arrays in the response.
- **Classification codes:** use bank-defined values (REM = remittance, SAL = salary, INT = interest, DIV = dividend, GDS = goods). When in doubt, ask the user.
- **SWIFT vs SEPA:** SEPA is for EUR transfers within the SEPA zone. Use `swift` for non-SEPA or non-EUR payments. `urgent` sends via same-day SWIFT.
- **Foreign costs:** `payForeignCosts: true` means the sender bears correspondent bank charges (OUR). Omit or set false for standard (SHA) behaviour.
- **Description lines:** free-text narratives forwarded to the recipient bank. Total across d1–d4 must not exceed 140 characters.
- **Receipt email:** set `receiptMode` to `email` and provide `receiptEmail` to receive payment confirmation.
- After a successful create, use `Landsbankinn.ForeignPayment.Query` with `batchId` to poll for final status.

## Authentication
The connector logs in to Landsbankaskema (`LI_Innskra`) automatically and reuses the session token.

