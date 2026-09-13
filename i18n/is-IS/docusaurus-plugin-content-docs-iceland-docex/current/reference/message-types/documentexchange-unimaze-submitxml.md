---
id: documentexchange-unimaze-submitxml
title: "DocumentExchange.Unimaze.SubmitXml"
sidebar_label: "DocumentExchange.Unimaze.SubmitXml"
sidebar_position: 74
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.SubmitXml Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Submit a pre-rendered XML skjal (UBL invoice, credit note, order, etc.) directly til
the Unimaze access point. Uses the `create-business-transaction` API-endapunktur which
Staðfestir the skjal áður en delivery. Notaðu this Þegar you already have a complete UBL XML
og want til skip the MAPI JSON transformation layer.

## Þegar til Notaðu SubmitXml vs SubmitTransaction
| Scenario | Notaðu |
|----------|-----|
| You have structured data (fields, lines) | SubmitTransaction (JSON) |
| You have a pre-rendered UBL XML skjal | **SubmitXml** |
| You built XML via UBL.RenderInvoice/RenderOrder | **SubmitXml** |
| You received XML frá an external system til forward | **SubmitXml** |

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| xml | string | **Yes** | Base64-encoded UBL XML skjal |
| transactionGroup | string | **Yes** | færsla group identifier (see table below) |
| messageId | string | No | Custom message GUID (auto-generated Ef omitted) |
| more | boolean | No | Ef true, hold fyrir AddAttachment calls (default: false) |
| conversationIdentifier | string | No | Correlate related messages |
| fallbackEmailAddress | string | No | Email Ef Peppol delivery fails |

## færsla Group Values
| transactionGroup | skjal Gerð |
|------------------|--------------|
| `SubmitInvoice` | UBL Invoice |
| `CorrectWithCredit` | UBL Credit Note |
| `SubmitOrder` | UBL Order |
| `SubmitOrderChange` | UBL Order Change |
| `SubmitOrderCancellation` | UBL Order Cancellation |
| `SubmitOrderResponse` | UBL Order Svar |
| `SubmitDespatchAdvice` | UBL Despatch Advice |
| `SubmitCatalogue` | UBL Catalogue |

## Dæmi
```json
{
  "xml": "<base64 of UBL Invoice XML>",
  "transactionGroup": "SubmitInvoice",
  "fallbackEmailAddress": "receiver@company.is"
}
```

## Svar
Skilar MAPI message envelope (same as GetDocumentInfo) þar á meðal:
- `uniqueId` / `messageId` — Notaðu fyrir status tracking
- `status` — initial processing status
- `validationStatus` — approved / rejected
- `documents[]` — með referenceId fyrir each skjal

## Validation
Unlike CreateGenericMessage, SubmitXml routes through the validation pipeline.
Ef the XML fails Peppol/UBL validation, Svarið mun contain validation errors.
Notaðu GetValidations &#123; "messageId": "&lt;id>" &#125; fyrir detailed validation results.

## Agent Verkflæði: Send Pre-Rendered XML
```
1. Render UBL XML: UBL.RenderInvoice { "salesInvoiceNo": "103301" }
2. Submit XML: SubmitXml { "xml": "<base64 output>", "transactionGroup": "SubmitInvoice" }
3. Check validation: GetValidations { "messageId": "<from response>" }
4. Monitor: GetDocumentInfo { "messageId": "<id>" }
```

## Related
- **SubmitTransaction** — JSON-based submission (Unimaze converts til XML)
- **CreateGenericMessage** — unvalidated skjal submission
- **AddAttachment** — attach PDF/other files eftir SubmitXml (Notaðu more=true)
- **GetValidations** — check validation result eftir submission


