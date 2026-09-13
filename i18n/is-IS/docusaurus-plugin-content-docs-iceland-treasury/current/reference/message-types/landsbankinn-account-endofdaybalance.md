---
id: landsbankinn-account-endofdaybalance
title: "Landsbankinn.Account.EndOfDayBalance"
sidebar_label: "Landsbankinn.Account.EndOfDayBalance"
sidebar_position: 71
description: "Beiðni- og svarsamningur fyrir Landsbankinn.reikningur.EndOfDayBalance Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Information about the financials of an reikningur at the end of a given (banking) day.
Sækir end-of-day balance, accrued deposit interest, og local-currency equivalents fyrir one eða Allt accounts.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "date": "2026-07-15",            // required — the date for which to get end-of-day financials
  "bban": "0133-26-019507",        // optional — filter to a single account (Icelandic BBAN)
  "skip": 0,                       // optional — paging
  "take": 50                       // optional — paging
}
```

### Upplýsingar um færibreytur
| Parameter | Gerð | nauðsynlegt | Lýsing |
|---|---|---|---|
| `date` | string (date) | yes | The date fyrir which til Sækja end-of-day financials. |
| `ownerNationalId` | string | no | The kennitala of the reikningur owner. Icelandic national identifier — accepted input: 10-11 digits, með eða without hyphen (e.g. `2205801569` eða `220580-1569`). Defaults til fyrirtæki Information "Registration No." Þegar omitted. |
| `bankAccountNo` | string | no | BC bankareikningur "No." — Tengingin reads the bankareikningur number frá the card og normalizes it til 12-digit BBAN. Filters til a stakan reikningur. |
| `bban` | string | no | Icelandic domestic basic bankareikningur number (BBAN). Accepted input: 12 digits without formatting (e.g. `010905012345`) eða hyphen-separated: 3-4 digit bank code, 1-2 digit ledger code, 1-6 digit reikningur number (e.g. `0109-05-012345` eða `109-5-12345`). Normalized til 12 digits með leading zeros. Filters til a stakan reikningur. |
| `skip` | integer | no | Number of færslur til skip (default 0). |
| `take` | integer | no | Number of færslur til return (default Allt). |

Ef both `bankAccountNo` og `bban` eru provided, `bankAccountNo` takes precedence.

## Svar
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
`totalItems` er the total number of færslur available at the bank (frá `X-Paging-TotalItems` header).

### Svar fields per reikningur
| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string (bban) | 12-digit Icelandic basic bankareikningur number. |
| `ownerNationalId` | string (kennitala) | 10-digit Icelandic national identifier of the reikningur owner. |
| `productName` | string | The Heiti of the product that the reikningur er associated með. |
| `date` | string (date) | The date Þegar the financials were calculated. |
| `balance` | Money | The balance of the reikningur in the reikningur currency. |
| `accruedDepositInterest` | Money | Interest accrued on deposits in the reikningur currency. |
| `balanceInLocalCurrency` | Money | The balance in ISK. |
| `accruedDepositInterestInLocalCurrency` | Money | Interest accrued on deposits in ISK. |

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til Sækja end-of-day balances fyrir reconciliation eða reporting. Pass `date` fyrir the target date. Omit `bban`/`bankAccountNo` til Sækja Allt accounts. The `ownerNationalId` defaults til the fyrirtæki's registration number frá fyrirtæki Information.


