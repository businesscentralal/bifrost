---
id: documentexchange-unimaze-getdocumenttransformed
title: "DocumentExchange.Unimaze.GetDocumentTransformed"
sidebar_label: "DocumentExchange.Unimaze.GetDocumentTransformed"
sidebar_position: 61
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetDocumentTransformed Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads the transformed (target-format) skjal content (Unimaze Aðeins).
Aðeins available Þegar `isTransformed: true` in the message skjöl array.
Skilar 404 Ef no transformation was applied.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Svar
```json
{ "messageId": "...", "variant": "transformed", "content": "<base64-encoded document>" }
```

## Þegar er a skjal transformed?
Unimaze transforms skjöl Þegar the receiver's registered profile requires a different
syntax than what the sender submitted. fyrir Dæmi:
- Sender Sendir UBL 2.1 Invoice → Receiver Aðeins supports CII → skjal er transformed
- Check `willBeTransformed` in GetDocumentSupport Svar
- Check `isTransformed` in message skjöl[] array


