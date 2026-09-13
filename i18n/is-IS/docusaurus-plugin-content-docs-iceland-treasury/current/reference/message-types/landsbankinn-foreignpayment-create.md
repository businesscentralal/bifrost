---
id: landsbankinn-foreignpayment-create
title: "Landsbankinn.ForeignPayment.Create"
sidebar_label: "Landsbankinn.ForeignPayment.Create"
sidebar_position: 123
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ForeignPayment.Create Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of foreign greiðslur til Landsbankinn synchronously via Landsbankaskema `LI_Stofna_erlendar_greidslur`.
The bank Staðfestir each greiðsla og Skilar per-greiðsla results (accepted / rejected) in the same Svar.

**Stefna:** Outbound (write — gated)  
**Efnisgerð:** text/json  
**Access:** Requires `Lbi ForeignPay Gate` (write) permission  
**Schema:** Landsbankaskema `LI_Stofna_erlendar_greidslur` v1.1 (process.ashx)

## Beiðni
`payments` er nauðsynlegt og verður að contain at least one greiðsla object.

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

## Svar
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

## reikningur format
`debitAccount` og `costAccount` verður að be in `branch-ledger-account` form (e.g. `0133-26-019566`).
Notaðu `Landsbankinn.Account.Verify` til confirm the destination reikningur áður en submitting a foreign greiðsla.

## Agent notes
- **Production guard:** do not submit test greiðslur against the live bank til discover Reitur formats. Validate inputs locally first.
- **nauðsynlegt preflight:** always verify recipient reikningur validity áður en sending.
- **Partial failure:** the bank may accept some greiðslur og reject others in the same batch. Check both `payments` og `errors` arrays in Svarið.
- **Classification codes:** Notaðu bank-defined values (REM = remittance, SAL = salary, INT = interest, DIV = dividend, GDS = goods). Þegar in doubt, ask the user.
- **SWIFT vs SEPA:** SEPA er fyrir EUR transfers within the SEPA zone. Notaðu `swift` fyrir non-SEPA eða non-EUR greiðslur. `urgent` sends via same-day SWIFT.
- **Foreign costs:** `payForeignCosts: true` means the sender bears correspondent bank charges (OUR). Omit eða set false fyrir staðlaða (SHA) behaviour.
- **Lýsing lines:** free-text narratives forwarded til the recipient bank. Total across d1–d4 verður að not exceed 140 characters.
- **Receipt email:** set `receiptMode` til `email` og Gefðu upp `receiptEmail` til receive greiðsla confirmation.
- eftir a successful create, Notaðu `Landsbankinn.ForeignPayment.Query` með `batchId` til poll fyrir final status.

## Authentication
Tengingin logs in til Landsbankaskema (`LI_Innskra`) sjálfkrafa og reuses the session token.


