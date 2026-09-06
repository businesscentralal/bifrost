---
id: landsbankinn-foreignpayment-query
title: "Landsbankinn.ForeignPayment.Query"
sidebar_label: "Landsbankinn.ForeignPayment.Query"
sidebar_position: 124
description: "Request and response contract for the Landsbankinn.ForeignPayment.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Queries the status of foreign payments at Landsbankinn via Landsbankaskema `LI_Fyrirspurn_erlendar_greidslur`.
Returns one row per payment within the requested date range, optionally narrowed by filter fields.

**Direction:** Outbound (read)  
**Content-Type:** text/json  
**Access:** Requires `Lbi ForeignPay Gate` (read) permission  
**Schema:** Landsbankaskema `LI_Fyrirspurn_erlendar_greidslur` v1.1 (process.ashx)

## Request
`paymentDateFrom` and `paymentDateTo` are required. All other fields are optional filters.

```json
{
  "paymentDateFrom":  "2026-06-01",              // required — ISO date (YYYY-MM-DD)
  "paymentDateTo":    "2026-06-30",              // required — must not be before paymentDateFrom
  "batchId":          "7",                       // optional — filter by bank batch id
  "currency":         "EUR",                     // optional — ISO 4217 currency code
  "identifier":       "INV-2026-042",            // optional — caller reference (audkenni)
  "costAccount":      "0133-26-019566",          // optional — branch-ledger-account form
  "debitAccount":     "0133-26-019566",          // optional — branch-ledger-account form
  "recipientName":    "ACME GmbH",              // optional — partial name match
  "recipientCountry": "DE",                      // optional — ISO 3166-1 alpha-2
  "recipientAccount": "DE89370400440532013000",  // optional — IBAN or local account
  "statusFilter":     "unpaid"                   // optional — unpaid | paid | error | cancelled | rejected
}
```

## Status filter values
| statusFilter | Bank wire value | Meaning |
|---|---|---|
| `unpaid`    | `OGREIDD`   | Submitted, not yet processed |
| `paid`      | `GREIDD`    | Processed and settled |
| `error`     | `A VILLU`   | Processing error |
| `cancelled` | `NIDURFELLD`| Cancelled |
| `rejected`  | `HAFNAD`    | Rejected by bank |

## Response
```json
{
  "status":     "success",
  "operation":  "ForeignPayment.Query",
  "httpStatus": 200,
  "logEntryNo": 12346,
  "payments": [
    {
      "identifier":      "INV-2026-042",           // caller reference
      "customerNo":      "C00010",
      "debitAccount":    "0133-26-019566",         // reassembled from sub-elements
      "costAccount":     "0133-26-019566",
      "batchId":         7,
      "statusCode":      "02",                      // raw bank status code
      "status":          2,                          // LbiForeignPayStatus enum ordinal
      "costCurrency":    "ISK",
      "debitCurrency":   "ISK",
      "paymentCurrency": "EUR",
      "amountOut":       10500.00,                   // ISK debit amount
      "amountIn":        100.00,                     // foreign currency amount
      "exchangeRate":    10500.00,
      "paymentDate":     "2026-06-21",
      "processingDate":  "2026-06-22",
      "recipientName":   "ACME GmbH",
      "recipientAccount":"DE89370400440532013000",
      "recipientCountry":"DE",
      "costs": {
        "fee":          250.00,  // toknun_kostnadur
        "disbursement": 0.00,    // utlagdur_kostnadur
        "cable":        0.00,    // myndsending_kostnadur
        "foreignCost":  0.00,    // erlendur_kostnadur
        "extra":        0.00     // auka_kostnadur
      }
    }
  ],
  "responseXml": "..."   // raw XML for diagnostics
}
```

## Agent notes
- **Workflow:** use `Landsbankinn.ForeignPayment.Create` to submit payments, then `Landsbankinn.ForeignPayment.Query` with the returned `batchId` to track their status.
- **Date range required:** the bank does not support open-ended queries. Always provide both `paymentDateFrom` and `paymentDateTo`.
- **Filter narrowing:** start with `batchId` when you have it — this is the most selective filter and minimises response size.
- **Status interpretation:** `statusCode` is the raw bank value; `status` is the enum ordinal (0=Unpaid, 1=Paid, 2=InProgress, 3=Error, 4=Cancelled, 5=Rejected).
- **Account reassembly:** `debitAccount` and `costAccount` are reassembled from the bank's sub-element structure (`utibu-hb-reikningsnr`) into `branch-ledger-account` text.
- **Costs block:** all five cost sub-fields are always present in the response; zero means no charge of that type.

## Authentication
The connector logs in to Landsbankaskema (`LI_Innskra`) automatically and reuses the session token.

