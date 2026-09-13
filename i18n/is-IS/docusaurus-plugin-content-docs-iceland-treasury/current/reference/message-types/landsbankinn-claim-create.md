---
id: landsbankinn-claim-create
title: "Landsbankinn.Claim.Create"
sidebar_label: "Landsbankinn.Claim.Create"
sidebar_position: 93
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Claim.Create Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til a stakan claim via the Claims REST API (POST /Claims).
Omitted valfrjálst values inherit frá the template.

## Date mapping
| This message Gerð | Bank API Reitur | Meaning |
|---|---|---|
| `claimDate` | `dueDate` | Claim key date (gjalddagi) |
| `dueDate` | `finalDueDate` | Final due date / eindagi (verður að be >= today og >= claimDate) |

## Beiðni (minimum nauðsynlegt)
```json
{
  "payorNationalId": "<10-digit kennitala>",
  "claimDate": "<ISO date>",
  "dueDate": "<ISO date, >= today, >= claimDate>",
  "templateId": "<bank 4-digit + 3-char code>",
  "principalAmount": 200
}
```

## Defaults frá fyrirtæki Information
- `templateId`: Ef Aðeins 7 chars (bank+code), the fyrirtæki Registration No. er prepended sjálfkrafa.
- `claimantNationalId`: Defaults til fyrirtæki Information "Registration No." Ef omitted.

## templateId format
Either 7-char short form (bank code 4 + template code 3) eða fulla 17-char (kennitala 10 + bank 4 + code 3).

## valfrjálst fields (inherit frá template Ef omitted)
autoCancellation, billNumber, referenceNumber, customerNumber,
Lýsing, number, isPartialPaymentAllowed, paymentSequenceType,
defaultCharge, discount, noticeAndPaymentFee, notifications, secondaryCollection

## Svar
Skilar created claim ID frá the bank API, plus `logEntryNo`.


