---
id: documentexchange-inexchange-getdocument
title: "DocumentExchange.InExchange.GetDocument"
sidebar_label: "DocumentExchange.InExchange.GetDocument"
sidebar_position: 42
description: "Beiðni- og svarsamningur fyrir DocumentExchange.InExchange.GetDocument Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads a skjal by ID frá InExchange (binary content).

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentId | string | Yes | The skjal identifier til download |

## Svar
Binary skjal content (base64-encoded).


