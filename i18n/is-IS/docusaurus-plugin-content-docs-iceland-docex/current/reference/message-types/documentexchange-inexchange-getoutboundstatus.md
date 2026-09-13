---
id: documentexchange-inexchange-getoutboundstatus
title: "DocumentExchange.InExchange.GetOutboundStatus"
sidebar_label: "DocumentExchange.InExchange.GetOutboundStatus"
sidebar_position: 45
description: "Beiðni- og svarsamningur fyrir DocumentExchange.InExchange.GetOutboundStatus Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks delivery status of an outbound skjal in InExchange.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentId | string | No | Fyrirspurn stakan outbound skjal status |

Ef documentId er omitted, posts til the Listi Endapunktur með filter payload.

## Svar
JSON með delivery status information.


