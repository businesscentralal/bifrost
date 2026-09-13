---
id: subscription-contract-createinvoice
title: "Subscription.Contract.CreateInvoice"
sidebar_label: "Subscription.Contract.CreateInvoice"
sidebar_position: 5
description: "Request and response contract for the Subscription.Contract.CreateInvoice Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Bills one viðskiptavinur Subscription Contract to an unposted sales reikningur (or credit memo,
when a lína calls fyrir one). The due Subscription Lines on the samningur eru copied í a
temporary set og handed to Microsoft's ad-hoc billing proposal entry point - the same
entry point the per-samningur billing dialog in the client uses - which creates Billing
Line proposal rows með no billing template attached. The skjal er then created from
those rows. Ekkert er posted, og the skjal er never opened.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Customer Subscription Contract to bill. May also be supplied as the message subject. |
| billingDate | Date | No | Lines due on eða áður en this dagsetning eru billed. Sjálfgefið er the work dagsetning. |
| billingToDate | Date | No | Bills complete periods up to this dagsetning. Sleppið til notkunar hver lína's own billing rhythm. |
| skjalDate | Date | No | Document dagsetning on the created skjal. Sjálfgefið er the work dagsetning. |
| postingDate | Date | No | Posting dagsetning on the created skjal. Sjálfgefið er the work dagsetning. |

Dates use the ISO format `YYYY-MM-DD`.

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
  "documents": [
    { "documentType": "Invoice", "documentNo": "SINV-000123" }
  ],
  "billingLineCount": 3
}
```

Þegar ekkert on the samningur er due, the call still succeeds með `documents: []` og a
`message` explaining that nothing was due.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Customer Subscription Contract '%1' gerir ekki exist. |
| Another samningur has pending template-less proposal línur | Contract '%1' has %2 pending billing lína(s) með no billing template assigned... |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes an unposted skjal; it never posts og never opens a page.
The proposal rows this call creates carry a blank Billing Template Code, because that is
what the ad-hoc, per-samningur billing entry point produces. Microsoft's own skjal
creation kóðiunit converts every blank-template Billing Line in the company þegar it runs -
not aðeins the ones fyrir this samningur - so áður en doing anything this call checks for
blank-template Billing Lines that belong to a different samningur og refuses to run,
naming that samningur, rather than silently invoicing someone else's pending proposal.
The write runs in an isolated transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Contract.PreviewInvoice`
- `Subscription.Contract.GetLines`
- `Subscription.Billing.CreateProposal`

