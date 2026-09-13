---
id: subscription-contract-previewinvoice
title: "Subscription.Contract.PreviewInvoice"
sidebar_label: "Subscription.Contract.PreviewInvoice"
sidebar_position: 7
description: "Request and response contract for the Subscription.Contract.PreviewInvoice Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Shows what `Subscription.Contract.CreateInvoice` would bill fyrir one viðskiptavinur Subscription
Contract, án keeping anything og án ever creating a skjal. The due
Subscription Lines eru handed to the same ad-hoc billing proposal entry point the write
call uses, so the reported línur, periods og fjárhæðs reflect what Business Central would
actually produce. The proposal rows built fyrir the preview eru read og then deleted again.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Customer Subscription Contract to preview. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on eða áður en this dagsetning eru billed. Sjálfgefið er the work dagsetning. |
| billingToDate | Date | No | Bills complete periods up to this dagsetning. Sleppið til notkunar hver lína's own billing rhythm. |

Dates use the ISO format `YYYY-MM-DD`. There eru no `documentDate` eða `postingDate`
parameters - a preview never creates a skjal, so no skjal dagsetnings apply.

## Dæmi um beiðni

```json
{
  "contractNo": "CC000010",
  "billingDate": "2026-08-31"
}
```

## Snið svars

```json
{
  "status": "Success",
  "contractNo": "CC000010",
  "billingDate": "2026-08-31",
  "lines": [
    { "subscriptionLineEntryNo": 1001, "billingFrom": "2026-08-01", "billingTo": "2026-08-31", "unitPrice": "99.00", "amount": "99.00" }
  ],
  "wouldBillLineCount": 1,
  "totalAmount": "99.00",
  "preview": true,
  "rollback": true
}
```

Þegar ekkert on the samningur er due, the call still succeeds með `lines: []`,
`wouldBillLineCount: 0` og a `message` explaining that nothing was due.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Customer Subscription Contract '%1' gerir ekki exist. |
| Another samningur has pending template-less proposal línur | Contract '%1' has %2 pending billing lína(s) með no billing template assigned... |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }`.

## Öryggi

Ekkert er left behind, but this er not a rolled-back transaction: Microsoft's billing
proposal kóðiunit commits internally partway through its own run, so an ordinary villa-based
rollback would not undo it. Instead, this call notes the last Billing Line entry number
before it does anything, builds the real proposal línur fyrir the samningur's due Subscription
Lines með that same entry point, reads back exactly the rows it just created, og then
deletes exactly those rows again - on both the success slóð og ef the proposal call itself
fails partway through. No skjal er ever created, even temporarily: this call never
reaches the step that turns proposal línur í an reikningur. The same blank-template billing
lína caveat as `Subscription.Contract.CreateInvoice` applies: another samningur's pending
template-less proposal línur block the preview so it geturnot touch them, even temporarily.

## Tengdar skilaboðategundir

- `Subscription.Contract.CreateInvoice`
- `Subscription.Contract.GetLines`

