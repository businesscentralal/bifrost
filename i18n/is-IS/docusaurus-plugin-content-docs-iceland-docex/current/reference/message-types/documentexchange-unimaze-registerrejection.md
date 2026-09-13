---
id: documentexchange-unimaze-registerrejection
title: "DocumentExchange.Unimaze.RegisterRejection"
sidebar_label: "DocumentExchange.Unimaze.RegisterRejection"
sidebar_position: 70
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.RegisterRejection Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Registers a rejection of a received invoice (Unimaze Aðeins).
Notifies the sender that their invoice has been rejected með a reason.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
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
This Endapunktur may not be available in Allt regions. fyrir staðlaða billing responses,
Notaðu SubmitTransaction með færsla=submit-billing-Svar instead.


