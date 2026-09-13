---
id: landsbankinn-unpaidinvoice-get
title: "Landsbankinn.UnpaidInvoice.Get"
sidebar_label: "Landsbankinn.UnpaidInvoice.Get"
sidebar_position: 134
description: "Beiðni- og svarsamningur fyrir Landsbankinn.UnpaidInvoice.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir stakan unpaid bill by its ID frá Landsbankinn.

API reference: https://developers.landsbankinn.er/docs/documentation-external-claims-apiunpaidbills-v1-proxy/1/routes/UnpaidBills/%7Bid%7D/Sækja

## Beiðni
```json
{ "id": "0133663409255302697609202607056306251060" }
```

| Reitur | Gerð | Lýsing |
|---|---|---|
| `id` | string | **nauðsynlegt.** The unpaid bill ID (frá UnpaidInvoice.Fyrirspurn). Composite: claimNumber + claimantNationalId + dueDate(yyyyMMdd) + payorNationalId. |

## Svar
Skilar fulla UnpaidBill object með Allt fields:
`id`, `compositeClaimNumber`, `totalAmountDue`, `dueDate`, `finalDueDate`,
`reference`, `templateId`, `customerNumber`, `payorNationalId`, `payorName`,
`claimantNationalId`, `claimantName`, `type`, `cancellationDate`, `discount`,
`otherCost`, `otherDefaultCost`, `defaultInterest`, `noticeAndPaymentFee`,
`defaultCharge`, `principal` (amount + currency), `billNumber`, `categoryCode`,
`categoryName`, `description`.


