---
id: subscription-priceupdate-createproposal
title: "Subscription.PriceUpdate.CreateProposal"
sidebar_label: "Subscription.PriceUpdate.CreateProposal"
sidebar_position: 13
description: "Request and response contract for the Subscription.PriceUpdate.CreateProposal Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

**This message type is blocked.** It always returns an error and writes nothing.

Creating a price update proposal in Business Central 28.4 requires
`Codeunit "Price Update Management".CreatePriceUpdateProposal`, which Microsoft has marked
`internal`. The entire `Interface "Contract Price Update"` that carries out the actual
rate calculation, and every implementation of it, is also internal, and the worker
codeunit 8013 "Process Price Update" is declared `Access = Internal` at the object level.
None of this is reachable from an external app, so there is genuinely no supported public
path to create the proposal from code.

This codeunit does not attempt to re-implement Microsoft's price update logic. Doing so
would risk silently diverging from Microsoft's own rounding, currency and binding-period
rules and could mis-price live customer contracts - a clear error is safer than a guess.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| (none) | | | This message type takes no parameters. It always fails. |

## Request Example

```json
{}
```

## Response Shape

```json
{
  "status": "Error",
  "error": "Subscription.PriceUpdate.CreateProposal cannot run: ...",
  "callstack": "..."
}
```

## Errors

| Condition | Message |
| --- | --- |
| Always | Subscription.PriceUpdate.CreateProposal cannot run: Codeunit "Price Update Management".CreatePriceUpdateProposal is internal in Business Central 28.4 and has not been exposed for external callers. Use the "Contract Price Update" page in the Business Central client to create the proposal, or call Subscription.PriceUpdate.SetTemplateFilter first to prepare the template's filters. |

## Safety

This message type never writes. It is registered and enabled so that discovery and help
tooling can list it, but every call fails fast with a specific, actionable error rather
than attempting an unsupported workaround.

## Related Message Types

- `Subscription.PriceUpdate.SetTemplateFilter`
- `Subscription.PriceUpdate.Perform`

