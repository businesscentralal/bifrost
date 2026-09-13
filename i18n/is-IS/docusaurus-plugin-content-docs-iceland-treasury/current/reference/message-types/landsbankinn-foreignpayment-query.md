---
id: landsbankinn-foreignpayment-query
title: "Landsbankinn.ForeignPayment.Query"
sidebar_label: "Landsbankinn.ForeignPayment.Query"
sidebar_position: 124
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ForeignPayment.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries the status of foreign greiðslur at Landsbankinn via Landsbankaskema `LI_Fyrirspurn_erlendar_greidslur`.
Skilar one row per greiðsla within the requested date range, optionally narrowed by filter fields.

**Stefna:** Outbound (read)  
**Efnisgerð:** text/json  
**Access:** Requires `Lbi ForeignPay Gate` (read) permission  
**Schema:** Landsbankaskema `LI_Fyrirspurn_erlendar_greidslur` v1.1 (process.ashx)

## Beiðni
`paymentDateFrom` og `paymentDateTo` eru nauðsynlegt. Allt other fields eru valfrjálst filters.

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
| `paid`      | `GREIDD`    | Processed og settled |
| `error`     | `A VILLU`   | Processing error |
| `cancelled` | `NIDURFELLD`| Cancelled |
| `rejected`  | `HAFNAD`    | Rejected by bank |

## Svar
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
- **Verkflæði:** Notaðu `Landsbankinn.ForeignPayment.Create` til submit greiðslur, then `Landsbankinn.ForeignPayment.Query` með the returned `batchId` til track their status.
- **Date range nauðsynlegt:** the bank does not support open-ended queries. Always Gefðu upp both `paymentDateFrom` og `paymentDateTo`.
- **Filter narrowing:** start með `batchId` Þegar you have it — this er the most selective filter og minimises Svar size.
- **Status interpretation:** `statusCode` er the raw bank value; `status` er the enum ordinal (0=Unpaid, 1=Paid, 2=InProgress, 3=Error, 4=Cancelled, 5=Rejected).
- **reikningur reassembly:** `debitAccount` og `costAccount` eru reassembled frá the bank's sub-element structure (`utibu-hb-reikningsnr`) í `branch-ledger-account` text.
- **Costs block:** Allt five cost sub-fields eru always present in Svarið; zero means no charge of that Gerð.

## Authentication
Tengingin logs in til Landsbankaskema (`LI_Innskra`) sjálfkrafa og reuses the session token.


