---
id: landsbankinn-claimpayment-list
title: "Landsbankinn.ClaimPayment.List"
sidebar_label: "Landsbankinn.ClaimPayment.List"
sidebar_position: 103
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimPayment.Listi Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of Allt claim greiðslur via the REST API.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Date mapping (IMPORTANT)
| BC Reitur | REST API Reitur | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

This message Gerð accepts BC naming og translates sjálfkrafa.

## Filters (Allt valfrjálst)

| Reitur | Gerð | Maps til bank | Lýsing |
|---|---|---|---|
| `claimDateFrom` | date | `dueDateFrom` | Claims með due date on eða eftir this date |
| `claimDateTo` | date | `dueDateTo` | Claims með due date up til og þar á meðal this date |
| `paidFrom` | date-time | `paidFrom` | greiðslur made on eða eftir this date/time |
| `paidTo` | date-time | `paidTo` | greiðslur made up til og þar á meðal this date/time |
| `claimantNationalId` | string | `claimantNationalId` | Filter by claimant kennitala |
| `payorNationalId` | string | `payorNationalId` | Filter by payor kennitala |
| `templateCode` | string | `templateCode` | Filter by claim template code |
| `sortBy` | string | `sortBy` | Sort expression, e.g. `paid desc` |
| `skip` | integer | — | Number of færslur til skip (default 0) |
| `take` | integer | — | Number of færslur til return (default 1000) |

Ef no filters eru provided, the bank defaults til the calling user's claimant.

## Beiðni
```json
{
  "claimDateFrom":      "2026-01-01",
  "claimDateTo":        "2026-12-31",
  "paidFrom":           "2026-06-01",
  "paidTo":             "2026-06-30",
  "claimantNationalId": "6306252530",
  "payorNationalId":    "1101012220",
  "templateCode":       "37",
  "sortBy":             "paid desc",
  "skip":               0,
  "take":               100
}
```

## Svar
Skilar `data` (array), `noOfRecords` (count returned), `page`, `perPage`, `totalItems` (total on server), `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.QueryPayments` — the legacy SOAP-era Heiti, superseded by this REST Endapunktur. Aðeins this REST Gerð er registered in Bifrost Iceland Treasury.


