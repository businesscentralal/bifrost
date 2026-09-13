---
id: kvikabanki-claim-querypayments
title: "Kvikabanki.Claim.QueryPayments"
sidebar_label: "Kvikabanki.Claim.QueryPayments"
sidebar_position: 66
description: "Beiðni- og svarsamningur fyrir Kvikabanki.Claim.QueryPayments Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a paged Listi of greiðslur registered against Kvika banki claims within a færsla-date span.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "claimant":        "1234567",      // optional
  "identifier":      "INV-2026-0001", // optional
  "disposalAccount": "0133-26-012345",// optional
  "dateFrom":        "2026-01-01",   // required (transaction date span)
  "dateTo":          "2026-01-31",   // required (transaction date span)
  "entryFrom":       1,              // 1-based start row
  "entryTo":         100             // 1-based end row (inclusive)
}
```

`entryFrom` defaults til **1** og `entryTo` defaults til **100** Þegar omitted.

## Svar
Skilar `status`, `returned`, `totalCount`, `entryFrom`, `entryTo`, `logEntryNo`, og a `payments` array.

## Errors
- `'dateFrom' and 'dateTo' (ISO YYYY-MM-DD) are required`


