---
id: documentexchange-advania-getdocumentlight
title: "DocumentExchange.Advania.GetDocumentLight"
sidebar_label: "DocumentExchange.Advania.GetDocumentLight"
sidebar_position: 10
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentLight Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir skjal XML WITHOUT embedded base64 attachments. Faster than GetDocument fyrir large skjöl með attachments.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | skjal UUID |

## Svar
`{ messageId, contentType: "xml", content: "<base64-xml>" }`

The content er base64-encoded XML með Allt `<cbc:EmbeddedDocumentBinaryObject>` elements stripped.
Notaðu GetAttachments separately Ef you need the binary attachments.

## Þegar til Notaðu instead of GetDocument
- skjal has large PDF attachments (payload_kb > 100 frá GetUnread/GetInbox)
- You Aðeins need line items, amounts, og metadata — not embedded files
- Performance-sensitive batch processing


