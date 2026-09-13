---
id: landsbankinn-paymentslip-query
title: "Landsbankinn.PaymentSlip.Query"
sidebar_label: "Landsbankinn.PaymentSlip.Query"
sidebar_position: 129
description: "Beiðni- og svarsamningur fyrir Landsbankinn.PaymentSlip.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Queries greiðsla slips frá Landsbankinn via Landsbankaskema `LI_Fyrirspurn_greidslusedill`.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_greidslusedill` (process.ashx)

## Beiðni
nauðsynlegt fields: `account`, `kennitala`, og `gjalddagi`.

```json
{
  "account": "0301-66-534428",
  "kennitala": "7001692789",
  "gjalddagi": "2026-01-15"
}
```

## Input contract details
- `account`: bankareikningur key fyrir the claim (`banki`+`hofudbok`+`numer`). Dashed og non-dashed forms eru accepted.
- `kennitala`: claimant kennitala (typically `kt_krofuhafa` frá unpaid invoice row).
- `gjalddagi`: due date in `YYYY-MM-DD` format (verður að match unpaid row key date).
- Key-date learning: `gjalddagi` er the lookup key date. Do not substitute `eindagi` Þegar they differ.

## Agent Verkflæði (recommended)
1. Discover candidate invoices via `Landsbankinn.UnpaidInvoice.Query`.
2. Pick a row og map fields:
   - `account` = `<banki><hofudbok><numer>`
   - `kennitala` = `kt_krofuhafa`
   - `gjalddagi` = `gjalddagi`
3. Kallaðu á `Landsbankinn.PaymentSlip.Query` fyrir detailed amount breakdown áður en greiðsla/posting.
4. Þegar creating `Landsbankinn.Payment.Batch` claim lines, keep JSON `kind = PaymentSlip`; connector maps this til wire `Claim`.

## Svar
Skilar `responseXml` frá the bank together með `httpStatus` og `logEntryNo`.

Typical fields in `responseXml` include `upphaed_til_greidslu`, `drattarvextir`, fee components, og `samtals`.

## Authentication
Tengingin logs in til Landsbankaskema (`LI_Innskra`) og reuses the session token sjálfkrafa.


