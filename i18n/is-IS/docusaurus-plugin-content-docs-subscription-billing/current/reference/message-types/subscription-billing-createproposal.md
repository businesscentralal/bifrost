---
id: subscription-billing-createproposal
title: "Subscription.Billing.CreateProposal"
sidebar_label: "Subscription.Billing.CreateProposal"
sidebar_position: 3
description: "Request and response contract for the Subscription.Billing.CreateProposal Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Generates billing proposal línur (Billing Line, table 8061) fyrir a Billing Template.
Every Subscription Line whose next billing dagsetning falls on eða áður en the billing dagsetning and
that matches the template's own filter er proposed fyrir billing. Ekkert er reikningurd yet -
call `Subscription.Billing.CreateDocuments` afterwards to turn the proposal í skjöl.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template to run. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on eða áður en this dagsetning eru proposed. Sjálfgefið er the work dagsetning. |
| billingToDate | Date | No | Bills complete periods up to this dagsetning. Sleppið til notkunar hver lína's own billing rhythm. |
| automatedBilling | Boolean | No | Sjálfgefið er true, which keeps the run silent. Leave it at the sjálfgefið. |

Dates use the ISO format `YYYY-MM-DD`.

## Dæmi um beiðni

```json
{
  "billingTemplateCode": "MONTHLY",
  "billingDate": "2026-08-31",
  "billingToDate": "2026-09-30"
}
```

## Snið svars

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingDate": "2026-08-31",
  "billingToDate": "2026-09-30",
  "proposalLinesCreated": 12,
  "proposalLineCount": 12,
  "contracts": ["CC000010", "CC000011"]
}
```

`proposalLinesCreated` counts the línur this call added. `proposalLineCount` er the total
number of proposal línur now standing fyrir the template, including any created earlier.
A run that matches nothing er a success með `proposalLinesCreated` of 0.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The template gerir ekki exist | The Billing Template '%1' gerir ekki exist. |
| billingTemplateCode er missing | Beiðnin er missing the required parameter 'billingTemplateCode'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes. It aðeins creates proposal línur - no reikningur er created and
nothing er posted. The write runs in an isolated transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Billing.CreateDocuments`
- `Subscription.Billing.PreviewDocuments`
- `Subscription.Contract.CreateInvoice`

