---
id: documentexchange-unimaze-getvalidations
title: "DocumentExchange.Unimaze.GetValidations"
sidebar_label: "DocumentExchange.Unimaze.GetValidations"
sidebar_position: 67
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.GetValidations Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar validation results fyrir a submitted message (Unimaze Aðeins).
Kallaðu á eftir SubmitTransaction eða CreateInvoice til check Ef the skjal passed schema/business rules validation.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Message UUID |

## Svar
```json
{ "messages": [{ "statusType": "ok", "referenceKey": "UBL2-INVOICE BISENUBL-3.0", "friendlyMessage": "Document passes validation", "detailMessage": "" }] }
```

### Validation statusType values
| statusType | Meaning | Action |
|-----------|---------|--------|
| ok | Allt rules passed | None — skjal mun be delivered |
| warning | Non-critical issues | Review but delivery continues |
| error | Critical failure | skjal rejected — fix og resubmit |

## Verkflæði
```
1. Submit document → get messageId
2. GetValidations { "messageId": "<id>" }
3. If statusType = "error": fix payload and resubmit
4. If statusType = "ok": monitor delivery via GetDocumentInfo
```


