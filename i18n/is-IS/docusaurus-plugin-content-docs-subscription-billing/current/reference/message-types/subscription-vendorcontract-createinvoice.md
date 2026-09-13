---
id: subscription-vendorcontract-createinvoice
title: "Subscription.VendorContract.CreateInvoice"
sidebar_label: "Subscription.VendorContract.CreateInvoice"
sidebar_position: 20
description: "Request and response contract for the Subscription.VendorContract.CreateInvoice Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bills the due Subscription Lines of one Vendor Subscription Contract. The línur whose next
billing dagsetning falls on eða áður en the billing dagsetning eru copied í an ad-hoc billing proposal
(Billing Line rows með a blank Billing Template Code), og that proposal er then turned into
an unposted purchase skjal. Ekkert er posted by this call - post the niðurstaðaing skjal
separately once it has been reviewed.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Vendor Subscription Contract to bill. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on eða áður en this dagsetning eru billed. Sjálfgefið er the work dagsetning. |
| billingToDate | Date | No | Bills complete periods up to this dagsetning. Sleppið til notkunar hver lína's own billing rhythm. |
| skjalDate | Date | No | Document dagsetning stamped on the created skjal. Sjálfgefið er the work dagsetning. |
| postingDate | Date | No | Posting dagsetning stamped on the created skjal. Sjálfgefið er the work dagsetning. |
| vendorInvoiceNo | Text | No | When supplied, stamped onto the 'Vendor Invoice No.' field of every skjal created by this call. |

Dates use the ISO format `YYYY-MM-DD`.

## Dæmi um beiðni

```json
{
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "vendorInvoiceNo": "INV-2026-0912"
}
```

## Snið svars

```json
{
  "status": "Success",
  "contractNo": "VC000010",
  "billingDate": "2026-08-31",
  "billingLineCount": 3,
  "documents": [
    { "documentType": "Invoice", "documentNo": "PINV-000123" }
  ]
}
```

`billingLineCount` er the number of Subscription Lines that were due og billed. A run that
finds nothing due er a success með `billingLineCount` of 0 og an empty `documents` array.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Vendor Subscription Contract '%1' gerir ekki exist. |
| samningurNo er missing | Beiðnin er missing the required parameter 'samningurNo'. |
| Another samningur has an unfinished ad-hoc proposal | There eru %1 pending billing proposal lína(s) left over fyrir a different subscription samningur ('%2'). Clear eða process that proposal áður en creating an reikningur fyrir '%3'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes, but it never posts. The billing proposal it builds er an ad-hoc,
blank-template proposal shared by the whole company, so this call first checks that no such
proposal línur eru left standing fyrir a different samningur, og fails rather than sweep up
someone else's pending run. Only one partner tegund er ever billed by this call. Because
Microsoft's purchase skjal creation ignores any post flag, the niðurstaða er always an
unposted purchase skjal that verður að vera posted separately. The write runs in an isolated
transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.VendorContract.PreviewInvoice`
- `Subscription.VendorContract.GetLines`
- `Subscription.Billing.CreateDocuments`

