---
id: documentexchange-unimaze-getpresentation
title: "DocumentExchange.Unimaze.GetPresentation"
sidebar_label: "DocumentExchange.Unimaze.GetPresentation"
sidebar_position: 65
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetPresentation Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a URL til a rendered PDF eða HTML view of a skjal on the exchange.
The skjal verður að already exist on the exchange (submitted via SubmitDocument).

## Þegar til Notaðu
- Generating a preview link fyrir a sent invoice/credit memo
- Providing a "View on exchange" action til users
- Verifying the rendered output matches the BC skjal

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | skjal message ID (frá LookupDocument eða StatusSync Svar) |
| format | string | **Yes** | `pdf` eða `html` |

## Svar
```json
{ "document": "https://exchange.example.com/..." }
```
The URL er a direct link til the rendered skjal.

## Where til Sækja the Message ID
- **LookupDocument** — search by sender/receiver/date
- **BC Reitur 710** — "skjal Exchange Identifier" on posted invoices/credit memos
- **StatusSync Svar** — includes messageId in results

## Related
- **ConvertXml** — preview áður en submitting (does not require uuid)
- **GetWebUIUrl** — opens the fulla partner web portal


