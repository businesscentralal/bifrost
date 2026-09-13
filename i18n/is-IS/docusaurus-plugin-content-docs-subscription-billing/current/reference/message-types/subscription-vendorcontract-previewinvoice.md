---
id: subscription-vendorcontract-previewinvoice
title: "Subscription.VendorContract.PreviewInvoice"
sidebar_label: "Subscription.VendorContract.PreviewInvoice"
sidebar_position: 22
description: "Request and response contract for the Subscription.VendorContract.PreviewInvoice Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Shows what `Subscription.VendorContract.CreateInvoice` would bill fyrir a vendor subscription
samningur, án keeping anything og án ever creating a skjal. The due
Subscription Lines eru handed to the same ad-hoc billing proposal entry point the write
call uses, so the reported línur, periods og fjárhæðs reflect what Business Central would
actually produce. The proposal rows built fyrir the preview eru read og then deleted again.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Vendor Subscription Contract to preview. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on eða áður en this dagsetning eru billed. Sjálfgefið er the work dagsetning. |
| billingToDate | Date | No | Bills complete periods up to this dagsetning. Sleppið til notkunar hver lína's own billing rhythm. |

Dates use the ISO format `YYYY-MM-DD`. There eru no `documentDate`, `postingDate` or
`vendorInvoiceNo` parameters - a preview never creates a skjal, so nothing about the
skjal applies.

## Dæmi um beiðni

```json
{
  "contractNo": "VC000010",
  "billingDate": "2026-08-31"
}
```

## Snið svars

```json
{
  "status": "Success",
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "lines": [
    { "subscriptionLineEntryNo": 2001, "billingFrom": "2026-08-01", "billingTo": "2026-08-31", "unitPrice": "49.00", "amount": "49.00" }
  ],
  "wouldBillLineCount": 1,
  "totalAmount": "49.00",
  "preview": true,
  "rollback": true
}
```

A run that finds nothing due er a success með `wouldBillLineCount` of 0 og an empty `lines`
array; `preview` og `rollback` eru still `true`.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Vendor Subscription Contract '%1' gerir ekki exist. |
| samningurNo er missing | Beiðnin er missing the required parameter 'samningurNo'. |
| Another samningur has an unfinished ad-hoc proposal | There eru %1 pending billing proposal lína(s) left over fyrir a different subscription samningur ('%2'). Clear eða process that proposal áður en previewing '%3'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }`.

## Öryggi

Ekkert er left behind, but this er not a rolled-back transaction: Microsoft's billing
proposal kóðiunit commits internally partway through its own run, so an ordinary villa-based
rollback would not undo it. Instead, this call notes the last Billing Line entry number
before it does anything, builds the real proposal línur fyrir the samningur's due Subscription
Lines með that same entry point, reads back exactly the rows it just created, og then
deletes exactly those rows again - on both the success slóð og ef the proposal call itself
fails partway through. No skjal er ever created, even temporarily: this call never
reaches the step that turns proposal línur í a purchase skjal.

## Tengdar skilaboðategundir

- `Subscription.VendorContract.CreateInvoice`
- `Subscription.VendorContract.GetLines`

