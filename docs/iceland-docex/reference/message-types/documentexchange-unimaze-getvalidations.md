---
id: documentexchange-unimaze-getvalidations
title: "DocumentExchange.Unimaze.GetValidations"
sidebar_label: "DocumentExchange.Unimaze.GetValidations"
sidebar_position: 67
description: "Request and response contract for the DocumentExchange.Unimaze.GetValidations Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns validation results for a submitted message (Unimaze only).
Call after SubmitTransaction or CreateInvoice to check if the document passed schema/business rules validation.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Response
```json
{ "messages": [{ "statusType": "ok", "referenceKey": "UBL2-INVOICE BISENUBL-3.0", "friendlyMessage": "Document passes validation", "detailMessage": "" }] }
```

### Validation statusType values
| statusType | Meaning | Action |
|-----------|---------|--------|
| ok | All rules passed | None — document will be delivered |
| warning | Non-critical issues | Review but delivery continues |
| error | Critical failure | Document rejected — fix and resubmit |

## Workflow
```
1. Submit document → get messageId
2. GetValidations { "messageId": "<id>" }
3. If statusType = "error": fix payload and resubmit
4. If statusType = "ok": monitor delivery via GetDocumentInfo
```

