---
id: documentexchange-inexchange-getincoming
title: "DocumentExchange.InExchange.GetIncoming"
sidebar_label: "DocumentExchange.InExchange.GetIncoming"
sidebar_position: 44
description: "Beiðni- og svarsamningur fyrir DocumentExchange.InExchange.GetIncoming Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Lists incoming (unhandled) skjöl frá InExchange.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| Gerð | string | No | skjal Gerð filter (default: Invoice) |

## Svar
JSON array of incoming skjal summaries með skjal IDs.


