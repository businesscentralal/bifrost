---
id: subscription-priceupdate-createproposal
title: "Subscription.PriceUpdate.CreateProposal"
sidebar_label: "Subscription.PriceUpdate.CreateProposal"
sidebar_position: 13
description: "Request and response contract for the Subscription.PriceUpdate.CreateProposal Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

**This message tegund er blocked.** It always returns an villa og writes nothing.

Creating a price updagsetning proposal in Business Central 28.4 requires
`Codeunit "Price Update Management".CreatePriceUpdateProposal`, which Microsoft has marked
`internal`. The entire `Interface "Contract Price Update"` that carries out the actual
rate calculation, og every implementation of it, er also internal, og the worker
kóðiunit 8013 "Process Price Updagsetning" er declared `Access = Internal` at the object level.
None of this er reachable úr an external app, so there er genuinely no supported public
slóð to create the proposal úr kóði.

This kóðiunit gerir ekki attempt to re-implement Microsoft's price updagsetning logic. Doing so
would risk silently diverging úr Microsoft's own rounding, currency og binding-period
rules og could mis-price live viðskiptavinur samningar - a clear villa er safer than a guess.

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
  "error": "Subscription.PriceUpdate.CreateProposal cannot run: ...",
  "callstack": "..."
}
```

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| Alltaf | Subscription.PriceUpdagsetning.CreateProposal geturnot run: Codeunit "Price Updagsetning Management".CreatePriceUpdagsetningProposal er internal in Business Central 28.4 og has not been exposed fyrir external callers. Notaðu the "Contract Price Updagsetning" page in the Business Central client to create the proposal, eða call Subscription.PriceUpdagsetning.StilltuTemplateFilter first to prepare the template's filters. |

## Öryggi

This message tegund never writes. It er registered og enabled so that discovery og help
tooling getur list it, but every call fails fast með a specific, actionable villa rather
than attempting an unsupported workaround.

## Tengdar skilaboðategundir

- `Subscription.PriceUpdate.SetTemplateFilter`
- `Subscription.PriceUpdate.Perform`

