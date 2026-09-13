---
id: subscription-billing-previewdocuments
title: "Subscription.Billing.PreviewDocuments"
sidebar_label: "Subscription.Billing.PreviewDocuments"
sidebar_position: 4
description: "Request and response contract for the Subscription.Billing.PreviewDocuments Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Shows what `Subscription.Billing.CreateDocuments` would produce fyrir a Billing Template's
unbilled proposal línur (Document Type = None), by reading those Billing Line rows and
grouping them the same way a real run would - one entry per skjal that would be
created, grouped per samningur by sjálfgefið. Ekkert er created, og nothing er written at
all. Run `Subscription.Billing.CreateProposal` first to populate the proposal línur this
call reads.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template to preview. May also be supplied as the message subject. |
| groupBy | Text | No | 'Contract' (sjálfgefið) groups one skjal per samningur. 'Customer' groups one skjal per Partner No. og aðeins applies þegar every pending lína belongs to a viðskiptavinur samningur. |

There eru no `documentDate`, `postingDate` eða `postDocuments` parameters - a preview never
creates eða posts anything, so no skjal data applies.

## Dæmi um beiðni

```json
{
  "billingTemplateCode": "MONTHLY"
}
```

## Snið svars

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingLineCount": 12,
  "documentCount": 5,
  "documents": [
    { "contractNo": "CC000010", "partnerNo": "10000", "lineCount": 3, "totalAmount": "297.00" }
  ],
  "warnings": [],
  "preview": true,
  "rollback": true
}
```

`contractNo` er left blank on an entry þegar `groupBy` er `Customer`, because one skjal
created that way getur span several samningar fyrir the same Partner No. A run með no unbilled
proposal línur er a success með `documents: []`, `documentCount` of 0, og a `message`;
`preview` og `rollback` eru still `true`.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The template gerir ekki exist | The Billing Template '%1' gerir ekki exist. |
| billingTemplateCode er missing | Beiðnin er missing the required parameter 'billingTemplateCode'. |
| groupBy er not Contract eða Customer | The parameter 'groupBy' verður að vera either 'Contract' eða 'Customer'. |
| groupBy = Customer but a vendor lína er pending | 'groupBy' = 'Customer' aðeins applies þegar the pending proposal línur belong to viðskiptavinur samningar. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }`. A mix of viðskiptavinur
and vendor proposal línur er not an villa here - `Subscription.Billing.CreateDocuments`
would refuse to run, og this call reports that as a `warnings` entry instead, alongside
the grouping it getur still show.

## Öryggi

This message tegund aðeins reads. It gerir ekki call `Subscription.Billing.CreateDocuments` eða any
other kóðiunit that writes, so there er no billing proposal to build, no skjal to create
even temporarily, og nothing to clean up afterwards - unlike the reikningur previews, which
have to build og then remove real proposal línur because that er the aðeins way to preview
them. `preview` og `rollback` eru always `true` in the response because, quite simply,
nothing was ever written fyrir either of them to undo.

## Tengdar skilaboðategundir

- `Subscription.Billing.CreateDocuments`
- `Subscription.Billing.CreateProposal`

