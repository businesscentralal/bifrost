---
id: documentexchange-unimaze-submitxml
title: "DocumentExchange.Unimaze.SubmitXml"
sidebar_label: "DocumentExchange.Unimaze.SubmitXml"
sidebar_position: 74
description: "Request and response contract for the DocumentExchange.Unimaze.SubmitXml Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submit a pre-rendered XML document (UBL invoice, credit note, order, etc.) directly to
the Unimaze access point. Uses the `create-business-transaction` API endpoint which
validates the document before delivery. Use this when you already have a complete UBL XML
and want to skip the MAPI JSON transformation layer.

## When to use SubmitXml vs SubmitTransaction
| Scenario | Use |
|----------|-----|
| You have structured data (fields, lines) | SubmitTransaction (JSON) |
| You have a pre-rendered UBL XML document | **SubmitXml** |
| You built XML via UBL.RenderInvoice/RenderOrder | **SubmitXml** |
| You received XML from an external system to forward | **SubmitXml** |

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| xml | string | **Yes** | Base64-encoded UBL XML document |
| transactionGroup | string | **Yes** | Transaction group identifier (see table below) |
| messageId | string | No | Custom message GUID (auto-generated if omitted) |
| more | boolean | No | If true, hold for AddAttachment calls (default: false) |
| conversationIdentifier | string | No | Correlate related messages |
| fallbackEmailAddress | string | No | Email if Peppol delivery fails |

## Transaction Group Values
| transactionGroup | Document Type |
|------------------|--------------|
| `SubmitInvoice` | UBL Invoice |
| `CorrectWithCredit` | UBL Credit Note |
| `SubmitOrder` | UBL Order |
| `SubmitOrderChange` | UBL Order Change |
| `SubmitOrderCancellation` | UBL Order Cancellation |
| `SubmitOrderResponse` | UBL Order Response |
| `SubmitDespatchAdvice` | UBL Despatch Advice |
| `SubmitCatalogue` | UBL Catalogue |

## Example
```json
{
  "xml": "<base64 of UBL Invoice XML>",
  "transactionGroup": "SubmitInvoice",
  "fallbackEmailAddress": "receiver@company.is"
}
```

## Response
Returns the MAPI message envelope (same as GetDocumentInfo) including:
- `uniqueId` / `messageId` — use for status tracking
- `status` — initial processing status
- `validationStatus` — approved / rejected
- `documents[]` — with referenceId for each document

## Validation
Unlike CreateGenericMessage, SubmitXml routes through the validation pipeline.
If the XML fails Peppol/UBL validation, the response will contain validation errors.
Use GetValidations &#123; "messageId": "&lt;id>" &#125; for detailed validation results.

## Agent Workflow: Send Pre-Rendered XML
```
1. Render UBL XML: UBL.RenderInvoice { "salesInvoiceNo": "103301" }
2. Submit XML: SubmitXml { "xml": "<base64 output>", "transactionGroup": "SubmitInvoice" }
3. Check validation: GetValidations { "messageId": "<from response>" }
4. Monitor: GetDocumentInfo { "messageId": "<id>" }
```

## Related
- **SubmitTransaction** — JSON-based submission (Unimaze converts to XML)
- **CreateGenericMessage** — unvalidated document submission
- **AddAttachment** — attach PDF/other files after SubmitXml (use more=true)
- **GetValidations** — check validation result after submission

