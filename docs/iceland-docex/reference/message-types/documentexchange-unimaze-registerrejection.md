---
id: documentexchange-unimaze-registerrejection
title: "DocumentExchange.Unimaze.RegisterRejection"
sidebar_label: "DocumentExchange.Unimaze.RegisterRejection"
sidebar_position: 70
description: "Request and response contract for the DocumentExchange.Unimaze.RegisterRejection Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Registers a rejection of a received invoice (Unimaze only).
Notifies the sender that their invoice has been rejected with a reason.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | UUID of the received invoice message |
| payload | object | No | Rejection details |

## Payload Structure
```json
{ "reason": "PricesIncorrect", "comment": "Unit prices do not match purchase order" }
```

### Rejection reason values
`NoIssue`, `ReferencesIncorrect`, `LegalInformationIncorrect`, `ReceiverUnknown`,
`ItemQualityInsufficient`, `DeliveryIssues`, `PricesIncorrect`, `QuantityIncorrect`,
`ItemsIncorrect`, `PaymentTermsIncorrect`, `NotRecognized`, `FinanceIncorrect`, `Other`

## Note
This endpoint may not be available in all regions. For standard billing responses,
use SubmitTransaction with transaction=submit-billing-response instead.

