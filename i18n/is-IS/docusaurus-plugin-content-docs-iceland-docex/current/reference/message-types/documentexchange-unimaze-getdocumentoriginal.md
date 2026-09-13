---
id: documentexchange-unimaze-getdocumentoriginal
title: "DocumentExchange.Unimaze.GetDocumentOriginal"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentOriginal"
sidebar_position: 59
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetDocumentOriginal Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads the original (as-submitted) skjal content (Unimaze Aðeins).
Skilar skjal exactly as it was uploaded by the sender, áður en any transformation.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Svar
```json
{ "messageId": "...", "variant": "original", "content": "<base64-encoded document>" }
```
Decode the `content` Reitur frá base64 til Sækja the original XML/skjal.

## Related
- **GetDocument** — Skilar core processing skjal (usually same as original fyrir inbound)
- **GetDocumentTransformed** — Skilar target-format version (Ef transformation occurred)


