---
id: islandsbanki-statement-get
title: "Islandsbanki.Statement.Get"
sidebar_label: "Islandsbanki.Statement.Get"
sidebar_position: 58
description: "Request and response contract for the Islandsbanki.Statement.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves an Islandsbanki account statement (SaekjaReikningsyfirlit) for an account and date span.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need the transactions on an Islandsbanki account over a date span.
- You are reconciling a bank account and need booked entries with a running balance.

## Request
```json
{
  "account": "0133-26-019507",         // (required*) bank-ledger-account
  "dateFrom": "2026-01-01",            // (required) ISO date YYYY-MM-DD
  "dateTo": "2026-01-31",              // (required) ISO date YYYY-MM-DD
  "skip": 0,                           // (optional) lines to skip
  "take": 50                           // (optional) max lines to return (0 = all)
}
```

\* Instead of `account`, you may pass the three numeric parts: `banki`, `hofudbok`, `reikningsnumer`.

## Field notes
| Field | Notes |
|---|---|
| `account` | Hyphenated `bank-ledger-account` (e.g. `0133-26-019507`) or a 12-digit string. |
| `dateFrom` / `dateTo` | Required ISO dates; `dateFrom` must not be after `dateTo`. |
| `skip` / `take` | Applied to the aggregated lines after all pages are fetched. `take = 0` returns all. |

## Response
```json
{
  "status": "Success",
  "account": "0133-26-019507",
  "totalLines": 120,
  "skip": 0,
  "take": 50,
  "returned": 50,
  "lines": [
    {
      "transactionKey": "...",     // Faerslulykill
      "textKey": "...",            // Textalykill
      "referenceNumber": "...",    // Tilvisunarnumer
      "valueDate": "2026-01-05",   // Vaxtadagur
      "transactionDate": "2026-01-05", // Hreyfingardagur
      "billNumber": "...",         // Sedilnumer
      "amount": -1234.00,          // Upphaed
      "redeemingBank": 133,        // Innlausnarbanki
      "batchNumber": "...",        // Bunkanumer
      "balance": 56789.00          // Stada (running balance)
    }
  ],
  "logEntryNo": 42
}
```

### Response field notes
- The Islandsbanki statement is a flat list of transactions; each line carries the running `balance` (Stada). There is no separate balance header.
- Amounts are ISK with the bank's native sign convention (negative = debit).

## Errors
- `Missing required 'account' ...` - no account was supplied.
- `'account' is not in the expected Islandsbanki format ...` - the account string could not be parsed.
- `Missing required 'dateFrom'/'dateTo' ...` - a required date was missing or not a valid ISO date.
- `Islandsbanki returned no statement ...` - no transactions for the account and date span.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** for the extension in Extension Management, and allow `https://ws.isb.is` if your environment uses an endpoint allowlist.

