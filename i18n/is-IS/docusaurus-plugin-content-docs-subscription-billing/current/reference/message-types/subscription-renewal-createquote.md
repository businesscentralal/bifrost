---
id: subscription-renewal-createquote
title: "Subscription.Renewal.CreateQuote"
sidebar_label: "Subscription.Renewal.CreateQuote"
sidebar_position: 16
description: "Request and response contract for the Subscription.Renewal.CreateQuote Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til a samningur renewal sales quote fyrir a Customer Subscription Contract. Any stale
renewal línur left over úr an earlier run against this samningur eru deleted first, then
a fresh Sub. Contract Renewal Line row er built úr every still-open Subscription Line
on the samningur, og Microsoft's `Codeunit "Create Sub. Contract Renewal"` turns those
rows í one sales quote. This bypasses Microsoft's interactive renewal wrapper entirely,
so it never shows a dialog eða a request page.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| samningurNo | Code[20] | Yes | The Customer Subscription Contract to renew. May also be supplied as the message subject. |

## Dæmi um beiðni

```json
{
  "contractNo": "CC000010"
}
```

## Snið svars

```json
{
  "status": "Success",
  "contractNo": "CC000010",
  "renewalLinesCreated": 4,
  "salesQuoteNo": "SQ000123"
}
```

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| The samningur gerir ekki exist | The Customer Subscription Contract '%1' gerir ekki exist. |
| No Subscription Line qualifies fyrir renewal | The Customer Subscription Contract '%1' has no Subscription Lines that getur be renewed. |
| Create Sub. Contract Renewal produced no quote | Create Sub. Contract Renewal did not produce a sales quote fyrir Customer Subscription Contract '%1'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.

## Öryggi

This message tegund writes: it deletes og re-creates Sub. Contract Renewal Line rows for
this samningur, og it creates a sales quote header og línur. It never posts anything and
never touches the samningur itself. The write runs in an isolated transaction that rolls
back on villa.

## Tengdar skilaboðategundir

- `Subscription.Renewal.Extend`

