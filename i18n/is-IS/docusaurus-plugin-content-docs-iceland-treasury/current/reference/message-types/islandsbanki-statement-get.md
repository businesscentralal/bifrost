---
id: islandsbanki-statement-get
title: "Islandsbanki.Statement.Get"
sidebar_label: "Islandsbanki.Statement.Get"
sidebar_position: 58
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Statement.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir an Islandsbanki reikningur statement (SaekjaReikningsyfirlit) fyrir an reikningur og date span.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need the færslur on an Islandsbanki reikningur over a date span.
- You eru reconciling a bankareikningur og need booked entries með a running balance.

## Beiðni
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

## Reitur notes
| Reitur | Notes |
|---|---|
| `account` | Hyphenated `bank-ledger-account` (e.g. `0133-26-019507`) eða a 12-digit string. |
| `dateFrom` / `dateTo` | nauðsynlegt ISO dates; `dateFrom` verður að not be eftir `dateTo`. |
| `skip` / `take` | Applied til the aggregated lines eftir Allt pages eru fetched. `take = 0` Skilar Allt. |

## Svar
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

### Svar Reitur notes
- The Islandsbanki statement er a flat Listi of færslur; each line carries the running `balance` (Stada). There er no separate balance header.
- Amounts eru ISK með the bank's native sign convention (negative = debit).

## Errors
- `Missing required 'account' ...` - no reikningur was supplied.
- `'account' is not in the expected Islandsbanki format ...` - the reikningur string could not be parsed.
- `Missing required 'dateFrom'/'dateTo' ...` - a nauðsynlegt date was missing eða not a valid ISO date.
- `Islandsbanki returned no statement ...` - no færslur fyrir the reikningur og date span.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** fyrir the extension in Extension Management, og allow `https://ws.isb.is` Ef your environment uses an Endapunktur allowlist.


