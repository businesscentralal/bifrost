---
id: landsbankinn-account-transactions
title: "Landsbankinn.Account.Transactions"
sidebar_label: "Landsbankinn.Account.Transactions"
sidebar_position: 74
description: "Request and response contract for the Landsbankinn.Account.Transactions Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves transactions for a specific bank account at Landsbankinn.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
Provide **one** of `bankAccountNo` or `bban`:
```json
{
  "bankAccountNo": "SAFN",         // BC Bank Account "No." — resolved and normalized automatically
  "bookingDateFrom": "2025-01-01", // required — ISO date filter start
  "bookingDateTo": "2025-01-31"    // required — ISO date filter end
}
```
or:
```json
{
  "bban": "0133-26-019566",        // Icelandic BBAN — normalized to 12 digits automatically
  "bookingDateFrom": "2025-01-01",
  "bookingDateTo": "2025-01-31"
}
```

### Parameter details
| Parameter | Type | Required | Description |
|---|---|---|---|
| `bankAccountNo` | string | one of | The BC Bank Account "No." field. The connector reads the bank account number from the card and normalizes it to 12-digit BBAN. |
| `bban` | string | one of | Icelandic domestic basic bank account number (BBAN). Accepted input: 12 digits without formatting (e.g. `010905012345`) or hyphen-separated: 3-4 digit bank code, 1-2 digit ledger code, 1-6 digit account number (e.g. `0109-05-012345` or `109-5-12345`). Normalized to 12 digits with leading zeros. Length: 5-14 chars. Pattern: `^\d{1,4}-?\d{1,2}-?\d{1,6}$`. |
| `bookingDateFrom` | string | yes | ISO date — start of booking date range. |
| `bookingDateTo` | string | yes | ISO date — end of booking date range. |
| `skip` | integer | no | Number of records to skip (default 0). |
| `take` | integer | no | Number of records to return (default all). |

If both `bankAccountNo` and `bban` are provided, `bankAccountNo` takes precedence.

## Response
```json
{
  "data": [...],
  "page": 1,
  "perPage": 50,
  "totalItems": 250,
  "logEntryNo": 123
}
```
`totalItems` is the total number of transactions available at the bank (from `X-Paging-TotalItems` header).

## AI/Agent playbook
Use `Account.Get` or `Account.List` to verify account access, then call this with a date range. Both `bookingDateFrom` and `bookingDateTo` are required by the bank API.

