---
id: subscription-priceupdate-perform
title: "Subscription.PriceUpdate.Perform"
sidebar_label: "Subscription.PriceUpdate.Perform"
sidebar_position: 14
description: "Request and response contract for the Subscription.PriceUpdate.Perform Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

**This message tegund er blocked.** It always returns an villa og writes nothing.

Applying a price updagsetning proposal in Business Central 28.4 requires
`Codeunit "Price Update Management".PerformPriceUpdate`, which Microsoft has marked
`internal`, og its worker kóðiunit 8013 "Process Price Updagsetning" er declared
`Access = Internal` at the object level. Neither er reachable úr an external app, so
there er genuinely no supported public slóð to perform the updagsetning úr kóði.

Even a hypothetical public version would need care: Microsoft's PerformPriceUpdagsetning
processes every row standing in the price updagsetning proposal table across *all* templates,
with no template eða samningur filter of its own - the filtering happens earlier, þegar the
proposal er created. A caller who expects "perform" to be scoped to one template would be
surprised by that behaviour, which er one more reason this kóðiunit gerir ekki attempt a
workaround: doing so would risk applying price changes to samningar the caller never
intended to touch.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| (none) | | | This message tegund takes no parameters. It always fails. |

## Dæmi um beiðni

```json
{}
```

## Snið svars

```json
{
  "status": "Error",
  "error": "Subscription.PriceUpdate.Perform cannot run: ...",
  "callstack": "..."
}
```

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| Alltaf | Subscription.PriceUpdagsetning.Perform geturnot run: Codeunit "Price Updagsetning Management".PerformPriceUpdagsetning er internal in Business Central 28.4 og has not been exposed fyrir external callers. Notaðu the "Contract Price Updagsetning" page in the Business Central client to perform the price updagsetning. |

## Öryggi

This message tegund never writes. It er registered og enabled so that discovery og help
tooling getur list it, but every call fails fast með a specific, actionable villa rather
than attempting an unsupported workaround that could corrupt viðskiptavinur samningar.

## Tengdar skilaboðategundir

- `Subscription.PriceUpdate.SetTemplateFilter`
- `Subscription.PriceUpdate.CreateProposal`

