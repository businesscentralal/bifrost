---
id: subscription-priceupdate-perform
title: "Subscription.PriceUpdate.Perform"
sidebar_label: "Subscription.PriceUpdate.Perform"
sidebar_position: 14
description: "Request and response contract for the Subscription.PriceUpdate.Perform Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

**This message type is blocked.** It always returns an error and writes nothing.

Applying a price update proposal in Business Central 28.4 requires
`Codeunit "Price Update Management".PerformPriceUpdate`, which Microsoft has marked
`internal`, and its worker codeunit 8013 "Process Price Update" is declared
`Access = Internal` at the object level. Neither is reachable from an external app, so
there is genuinely no supported public path to perform the update from code.

Even a hypothetical public version would need care: Microsoft's PerformPriceUpdate
processes every row standing in the price update proposal table across *all* templates,
with no template or contract filter of its own - the filtering happens earlier, when the
proposal is created. A caller who expects "perform" to be scoped to one template would be
surprised by that behaviour, which is one more reason this codeunit does not attempt a
workaround: doing so would risk applying price changes to contracts the caller never
intended to touch.

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
  "error": "Subscription.PriceUpdate.Perform cannot run: ...",
  "callstack": "..."
}
```

## Errors

| Condition | Message |
| --- | --- |
| Always | Subscription.PriceUpdate.Perform cannot run: Codeunit "Price Update Management".PerformPriceUpdate is internal in Business Central 28.4 and has not been exposed for external callers. Use the "Contract Price Update" page in the Business Central client to perform the price update. |

## Safety

This message type never writes. It is registered and enabled so that discovery and help
tooling can list it, but every call fails fast with a specific, actionable error rather
than attempting an unsupported workaround that could corrupt customer contracts.

## Related Message Types

- `Subscription.PriceUpdate.SetTemplateFilter`
- `Subscription.PriceUpdate.CreateProposal`

