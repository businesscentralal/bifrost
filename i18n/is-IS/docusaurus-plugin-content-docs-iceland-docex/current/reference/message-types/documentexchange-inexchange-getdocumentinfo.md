---
id: documentexchange-inexchange-getdocumentinfo
title: "DocumentExchange.InExchange.GetDocumentInfo"
sidebar_label: "DocumentExchange.InExchange.GetDocumentInfo"
sidebar_position: 43
description: "Beiðni- og svarsamningur fyrir DocumentExchange.InExchange.GetDocumentInfo Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir metadata/info fyrir a skjal by ID frá InExchange.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentId | string | Yes | The skjal identifier |

## Svar
JSON object með skjal metadata (sender, receiver, Gerð, dates).


