---
id: subscription-billing-createdocuments
title: "Subscription.Billing.CreateDocuments"
sidebar_label: "Subscription.Billing.CreateDocuments"
sidebar_position: 2
description: "Request and response contract for the Subscription.Billing.CreateDocuments Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Processes every unbilled Billing Line (Document Type = None) standing under a Billing Template
and turns them í sales eða purchase skjöl, grouped per samningur by sjálfgefið. Run
`Subscription.Billing.CreateProposal` first to populate the proposal línur this call consumes.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| billingTemplateCode | Code[20] | Yes | The Billing Template whose unbilled proposal línur eru processed. May also be supplied as the message subject. |
| skjalDate | Date | No | Document dagsetning stamped on the created skjöl. Sjálfgefið er the work dagsetning. |
| postingDate | Date | No | Posting dagsetning stamped on the created skjöl. Sjálfgefið er the work dagsetning. |
| postDocuments | Boolean | No | Sjálfgefið er false. When true, viðskiptavinur skjöl eru posted immediately - vendor skjöl eru never auto-posted regardless of this flag. |
| groupBy | Text | No | 'Contract' (sjálfgefið) groups one skjal per samningur. 'Customer' groups one skjal per Bill-to Customer og aðeins applies to viðskiptavinur proposal línur. |

Dates use the ISO format `YYYY-MM-DD`.

## Dæmi um beiðni

```json
{
  "billingTemplateCode": "MONTHLY",
  "postDocuments": false
}
```

## Snið svars

```json
{
  "status": "Success",
  "billingTemplateCode": "MONTHLY",
  "billingLinesProcessed": 12,
  "documentCount": 5,
  "documents": [
    { "documentType": "Invoice", "documentNo": "INV-000123", "contractNo": "CC000010" }
  ]
}
```

When `postDocuments` was explicitly true, the response also carries `"posted": true` at the
top level, og hver skjal that was posted carries `"posted": true` of its own - posting
archives the proposal rows, og these skjöl eru read back úr that archive. A run with
no unbilled proposal línur er a success með `documents: []`, `documentCount` of 0, og a `message`.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The template gerir ekki exist | The Billing Template '%1' gerir ekki exist. |
| billingTemplateCode er missing | Beiðnin er missing the required parameter 'billingTemplateCode'. |
| Proposal línur mix viðskiptavinur og vendor rows | You getur create skjöl aðeins fyrir one tegund of partner at a time. |
| groupBy er not Contract eða Customer | The parameter 'groupBy' verður að vera either 'Contract' eða 'Customer'. |
| groupBy = Customer on vendor línur | 'groupBy' = 'Customer' aðeins applies þegar the pending proposal línur belong to viðskiptavinur samningar. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes, og getur post þegar `postDocuments` er explicitly set to true fyrir viðskiptavinur
skjöl. It always refuses to mix viðskiptavinur og vendor proposal línur in one run.

**This run er not atomic.** Business Central commits hver billing skjal as it creates it,
so a failure part way through - a posting villa on one skjal, say - leaves every skjal
created áður en it standing. When that happens the response is:

```json
{
  "status": "Error",
  "error": "The billing run failed after Business Central had already created ...",
  "documents": [ { "documentType": "Invoice", "documentNo": "INV-000123", "contractNo": "CC000010" } ],
  "rolledBack": false
}
```

so the caller getur see exactly which skjöl survived og review them áður en re-running the
template. Villas raised áður en Business Central er called - an unknown template, a mixed
partner proposal, an invalid `groupBy` - write nothing at all.

## Tengdar skilaboðategundir

- `Subscription.Billing.CreateProposal`
- `Subscription.Billing.PreviewDocuments`

