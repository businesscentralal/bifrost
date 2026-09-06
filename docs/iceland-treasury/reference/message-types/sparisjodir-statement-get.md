---
id: sparisjodir-statement-get
title: "Sparisjodir.Statement.Get"
sidebar_label: "Sparisjodir.Statement.Get"
sidebar_position: 158
description: "Request and response contract for the Sparisjodir.Statement.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a bank statement for an Spar account over a date span. The account header is returned once; transaction lines support skip/take paging. Transactions are returned **newest first**.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need statement headers and transaction lines from an Spar bank account.
- You want to reconcile a date span or inspect bank activity before posting.
- You need paged statement lines for large accounts.

## Request
```json
{
  "bankAccountNo":     "SPAR-USD",      // (one of) BC bank account no.
  "normalizedAccount": "0133-26-019566", // ... or normalized Spar account number
  "dateFrom": "2026-01-01",              // (required) ISO date YYYY-MM-DD
  "dateTo":   "2026-01-31",              // (required) ISO date YYYY-MM-DD
  "skip": 0,                              // (optional) number of lines to skip
  "take": 50                              // (optional) maximum lines to return (0 = all)
}
```

## Account selection
| Field | Use |
|---|---|
| `bankAccountNo` | BC bank account number. The connector resolves the Spar account from the BC bank account setup. |
| `normalizedAccount` | Direct Spar account number with separators (e.g. `0133-26-019566`). Use when querying without a BC bank account record. |

## Paging
Use `skip` and `take` for large date spans. `take = 0` returns all available lines for the date range.

## Response
```json
{
  "status": "Success",
  "totalLines": 142,
  "skip": 0,
  "take": 50,
  "returned": 50,
  "logEntryNo": 42,
  "header": { /* see Account Header fields */ },
  "lines": [ /* see Transaction fields */ ]
}
```

## Account Header fields
| Field | Type | Description |
|---|---|---|
| `account` | string | Spar account number. |
| `currency` | string | Account currency (e.g. `ISK`, `USD`). |
| `overdraft` | decimal | Credit limit in account currency. |
| `balance` | decimal | Current account balance. |
| `availableAmount` | decimal | Available funds (balance + overdraft; for restricted accounts: the available amount). |
| `status` | string | `Available` or `Closed`. |
| `totalAmountWaiting` | decimal | Amount pending clearing. |
| `iban` | string | IBAN of the account. |
| `accountOwnerId` | string | Kennitala of the account owner. |
| `customAccountName` | string | User-set account name; returns AccountType name if not customized. |
| `accountInformation` | string | AccountType name from the bank. |

## Transaction fields
Transactions are ordered **newest first**.

| Field | Type | Description |
|---|---|---|
| `transactionId` | string | Unique transaction identifier. **Note:** Not available for same-day transactions (returns empty string). |
| `transactionDate` | string | Booking date (ISO date). |
| `valueDate` | string | Value date (ISO date). |
| `amount` | decimal | Transaction amount (positive = deposit, negative = withdrawal). |
| `balance` | decimal | Account balance after this entry. |
| `currencyCode` | string | Currency of the transaction. |
| `transactionTypeCode` | string | Entry key: `01` = deposit, `02` = withdrawal. |
| `batchNumber` | string | 4-digit originator code (e.g. `5041` or `5071` = online bank). |
| `redeemingBank` | string | 4-digit redeeming bank code. |
| `reference` | string | 16-char reference, usually payor kennitala. |
| `billNumber` | string | 7-char bill number visible on the receiver's statement. |
| `categoryCode` | string | `03` = transfer, `04` = salary. |
| `category` | string | Human-readable description of `categoryCode`. |
| `referenceDetail` | string | If `reference` is a kennitala: name of the payor. |
| `payorId` | string | Kennitala of the payor (if available). |

## Error codes (IOBSFault)
| Code | Meaning |
|---|---|
| `0001` | Service unavailable. |
| `1000` | General error. |
| `1100` | Access denied. |
| `1200` | Validation error. |
| `1300` | Business logic error. |

## Errors
- `Missing required 'bankAccountNo' or 'normalizedAccount'`
- `Missing required 'dateFrom'` / `Missing required 'dateTo'`
- `Sparisjóður returned no statement ...`

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

