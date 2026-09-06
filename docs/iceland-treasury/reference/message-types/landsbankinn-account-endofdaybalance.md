---
id: landsbankinn-account-endofdaybalance
title: "Landsbankinn.Account.EndOfDayBalance"
sidebar_label: "Landsbankinn.Account.EndOfDayBalance"
sidebar_position: 71
description: "Request and response contract for the Landsbankinn.Account.EndOfDayBalance Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Information about the financials of an account at the end of a given (banking) day.
Retrieves end-of-day balance, accrued deposit interest, and local-currency equivalents for one or all accounts.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "date": "2026-07-15",            // required — the date for which to get end-of-day financials
  "bban": "0133-26-019507",        // optional — filter to a single account (Icelandic BBAN)
  "skip": 0,                       // optional — paging
  "take": 50                       // optional — paging
}
```

### Parameter details
| Parameter | Type | Required | Description |
|---|---|---|---|
| `date` | string (date) | yes | The date for which to get end-of-day financials. |
| `ownerNationalId` | string | no | The kennitala of the account owner. Icelandic national identifier — accepted input: 10-11 digits, with or without hyphen (e.g. `2205801569` or `220580-1569`). Defaults to Company Information "Registration No." when omitted. |
| `bankAccountNo` | string | no | BC Bank Account "No." — the connector reads the bank account number from the card and normalizes it to 12-digit BBAN. Filters to a single account. |
| `bban` | string | no | Icelandic domestic basic bank account number (BBAN). Accepted input: 12 digits without formatting (e.g. `010905012345`) or hyphen-separated: 3-4 digit bank code, 1-2 digit ledger code, 1-6 digit account number (e.g. `0109-05-012345` or `109-5-12345`). Normalized to 12 digits with leading zeros. Filters to a single account. |
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Number of records to return (default all). |

If both `bankAccountNo` and `bban` are provided, `bankAccountNo` takes precedence.

## Response
```json
{
  "data": [
    {
      "id": "013326019507",
      "ownerNationalId": "6306251060",
      "productName": "Viðskiptareikningur",
      "date": "2026-07-15",
      "balance": { "amount": 1234567.89, "currency": "ISK" },
      "accruedDepositInterest": { "amount": 123.45, "currency": "ISK" },
      "balanceInLocalCurrency": { "amount": 1234567.89, "currency": "ISK" },
      "accruedDepositInterestInLocalCurrency": { "amount": 123.45, "currency": "ISK" }
    }
  ],
  "page": 1,
  "perPage": 50,
  "totalItems": 3,
  "logEntryNo": 123
}
```
`totalItems` is the total number of records available at the bank (from `X-Paging-TotalItems` header).

### Response fields per account
| Field | Type | Description |
|---|---|---|
| `id` | string (bban) | 12-digit Icelandic basic bank account number. |
| `ownerNationalId` | string (kennitala) | 10-digit Icelandic national identifier of the account owner. |
| `productName` | string | The name of the product that the account is associated with. |
| `date` | string (date) | The date when the financials were calculated. |
| `balance` | Money | The balance of the account in the account currency. |
| `accruedDepositInterest` | Money | Interest accrued on deposits in the account currency. |
| `balanceInLocalCurrency` | Money | The balance in ISK. |
| `accruedDepositInterestInLocalCurrency` | Money | Interest accrued on deposits in ISK. |

## AI/Agent playbook
Use this to get end-of-day balances for reconciliation or reporting. Pass `date` for the target date. Omit `bban`/`bankAccountNo` to get all accounts. The `ownerNationalId` defaults to the company's registration number from Company Information.

