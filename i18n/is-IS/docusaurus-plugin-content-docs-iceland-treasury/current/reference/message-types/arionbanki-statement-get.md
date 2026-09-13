---
id: arionbanki-statement-get
title: "Arionbanki.Statement.Get"
sidebar_label: "Arionbanki.Statement.Get"
sidebar_position: 33
description: "Beiðni- og svarsamningur fyrir Arionbanki.Statement.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir bank statement fyrir an Arion reikningur over a date span. The reikningur header er returned once; færsla lines support skip/take paging. færslur eru returned **newest first**.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need statement headers og færsla lines frá an Arion bankareikningur.
- You want til reconcile a date span eða inspect bank activity áður en posting.
- You need paged statement lines fyrir large accounts.

## Beiðni
```json
{
  "bankAccountNo":     "ARION-USD",      // (one of) BC bank account no.
  "normalizedAccount": "0133-26-019566", // ... or normalized Arion account number
  "dateFrom": "2026-01-01",              // (required) ISO date YYYY-MM-DD
  "dateTo":   "2026-01-31",              // (required) ISO date YYYY-MM-DD
  "skip": 0,                              // (optional) number of lines to skip
  "take": 50                              // (optional) maximum lines to return (0 = all)
}
```

## reikningur selection
| Reitur | Notaðu |
|---|---|
| `bankAccountNo` | BC bankareikningur number. Tengingin resolves the Arion reikningur frá the BC bankareikningur setup. |
| `normalizedAccount` | Direct Arion reikningur number með separators (e.g. `0133-26-019566`). Notað þegar querying without a BC bankareikningur færsla. |

## Paging
Notaðu `skip` og `take` fyrir large date spans. `take = 0` Skilar Allt available lines fyrir the date range.

## Svar
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

## reikningur Header fields
| Reitur | Gerð | Lýsing |
|---|---|---|
| `account` | string | Arion reikningur number. |
| `currency` | string | reikningur currency (e.g. `ISK`, `USD`). |
| `overdraft` | decimal | Credit limit in reikningur currency. |
| `balance` | decimal | Current reikningur balance. |
| `availableAmount` | decimal | Available funds (balance + overdraft; fyrir restricted accounts: the available amount). |
| `status` | string | `Available` eða `Closed`. |
| `totalAmountWaiting` | decimal | Amount pending clearing. |
| `iban` | string | IBAN of the reikningur. |
| `accountOwnerId` | string | Kennitala of the reikningur owner. |
| `customAccountName` | string | User-set reikningur Heiti; Skilar AccountType Heiti Ef not customized. |
| `accountInformation` | string | AccountType Heiti frá the bank. |

## færsla fields
færslur eru ordered **newest first**.

| Reitur | Gerð | Lýsing |
|---|---|---|
| `transactionId` | string | Unique færsla identifier. **Note:** Not available fyrir same-day færslur (Skilar empty string). |
| `transactionDate` | string | Booking date (ISO date). |
| `valueDate` | string | Value date (ISO date). |
| `amount` | decimal | færsla amount (positive = deposit, negative = withdrawal). |
| `balance` | decimal | reikningur balance eftir this entry. |
| `currencyCode` | string | Currency of the færsla. |
| `transactionTypeCode` | string | Entry key: `01` = deposit, `02` = withdrawal. |
| `batchNumber` | string | 4-digit originator code (e.g. `5041` eða `5071` = online bank). |
| `redeemingBank` | string | 4-digit redeeming bank code. |
| `reference` | string | 16-char reference, usually payor kennitala. |
| `billNumber` | string | 7-char bill number visible on the receiver's statement. |
| `categoryCode` | string | `03` = transfer, `04` = salary. |
| `category` | string | Human-readable Lýsing of `categoryCode`. |
| `referenceDetail` | string | Ef `reference` er a kennitala: Heiti of the payor. |
| `payorId` | string | Kennitala of the payor (Ef available). |

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
- `Arion banki returned no statement ...`

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


