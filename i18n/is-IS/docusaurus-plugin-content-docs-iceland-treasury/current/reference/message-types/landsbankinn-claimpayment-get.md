---
id: landsbankinn-claimpayment-get
title: "Landsbankinn.ClaimPayment.Get"
sidebar_label: "Landsbankinn.ClaimPayment.Get"
sidebar_position: 102
description: "Beiðni- og svarsamningur fyrir Landsbankinn.ClaimPayment.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar greiðslur fyrir a stakan claim via the REST API.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Date mapping (IMPORTANT)
| BC Reitur | REST API Reitur | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date |
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## nauðsynlegt parameter
`claimId` — the unique claim identifier frá the bank.

## Beiðni
```json
{
  "claimId":  "abc123-...",
  "paidFrom": "2026-01-01",
  "paidTo":   "2026-12-31",
  "sortBy":   "paid desc",
  "skip":     0,
  "take":     100
}
```

## Svar
Skilar `data` (array of greiðsla objects), `claimId`, `page`, `perPage`, `totalItems`, `logEntryNo`.

## SOAP equivalent
`Landsbankinn.Claim.QueryPayments` — the legacy SOAP-era Heiti, superseded by this REST Endapunktur. Aðeins this REST Gerð er registered in Bifrost Iceland Treasury.


