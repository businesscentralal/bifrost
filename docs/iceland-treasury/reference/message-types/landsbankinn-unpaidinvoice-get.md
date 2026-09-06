---
id: landsbankinn-unpaidinvoice-get
title: "Landsbankinn.UnpaidInvoice.Get"
sidebar_label: "Landsbankinn.UnpaidInvoice.Get"
sidebar_position: 134
description: "Request and response contract for the Landsbankinn.UnpaidInvoice.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves a single unpaid bill by its ID from Landsbankinn.

API reference: https://developers.landsbankinn.is/docs/documentation-external-claims-apiunpaidbills-v1-proxy/1/routes/UnpaidBills/%7Bid%7D/get

## Request
```json
{ "id": "0133663409255302697609202607056306251060" }
```

| Field | Type | Description |
|---|---|---|
| `id` | string | **Required.** The unpaid bill ID (from UnpaidInvoice.Query). Composite: claimNumber + claimantNationalId + dueDate(yyyyMMdd) + payorNationalId. |

## Response
Returns the full UnpaidBill object with all fields:
`id`, `compositeClaimNumber`, `totalAmountDue`, `dueDate`, `finalDueDate`,
`reference`, `templateId`, `customerNumber`, `payorNationalId`, `payorName`,
`claimantNationalId`, `claimantName`, `type`, `cancellationDate`, `discount`,
`otherCost`, `otherDefaultCost`, `defaultInterest`, `noticeAndPaymentFee`,
`defaultCharge`, `principal` (amount + currency), `billNumber`, `categoryCode`,
`categoryName`, `description`.

