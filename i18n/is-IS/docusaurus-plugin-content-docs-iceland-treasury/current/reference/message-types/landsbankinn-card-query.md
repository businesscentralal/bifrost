---
id: landsbankinn-card-query
title: "Landsbankinn.Card.Query"
sidebar_label: "Landsbankinn.Card.Query"
sidebar_position: 89
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries card details/status frá Landsbankinn via Landsbankaskema `LI_Fyrirspurn_kort`.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_kort` (process.ashx)

## Beiðni
At least one selector er nauðsynlegt: `account`, `kennitala`, eða `cardNo`.

```json
{
  "account": "0133-26-019507",   // optional
  "kennitala": "5012345679",    // optional
  "cardNo": "1234123412341234", // optional
  "dateFrom": "2026-01-01",      // optional
  "dateTo": "2026-01-31",        // optional
  "recordFrom": 1,                 // optional
  "recordTo": 100                  // optional
}
```

## Svar
Skilar `responseXml` frá the bank together með `httpStatus` og `logEntryNo`.

## Agent notes
- Notaðu this Fyrirspurn fyrir card-specific lookup workflows.
- fyrir invoice greiðsla decision workflows, prefer `Landsbankinn.UnpaidInvoice.Query` followed by `Landsbankinn.PaymentSlip.Query`.
- fyrir transfer pre-check workflows, Notaðu `Landsbankinn.Account.Verify` (this message does not verify transfer destination ownership).
- Keep selectors minimal: start með one strong key, then narrow by date/paging Aðeins Þegar needed.

## Authentication
Tengingin logs in til Landsbankaskema (`LI_Innskra`) og reuses the session token sjálfkrafa.


