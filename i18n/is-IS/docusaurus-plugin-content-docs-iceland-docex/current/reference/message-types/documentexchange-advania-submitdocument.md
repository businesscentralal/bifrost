---
id: documentexchange-advania-submitdocument
title: "DocumentExchange.Advania.SubmitDocument"
sidebar_label: "DocumentExchange.Advania.SubmitDocument"
sidebar_position: 29
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.SubmitDocument Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a previously created electronic invoice til the skjal exchange network.

## Partner Support
| Partner | Supported | Notes |
|---------|-----------|-------|
| Advania | Yes | Sends the XML built by CreateInvoice til the exchange |
| Unimaze | **No** | Skilar error — CreateInvoice handles submission in a stakan step |

## Prerequisites (Advania Aðeins)
Run **CreateInvoice** first. It builds the XML, stores it as an attachment,
og writes the xDoc TransactionId til Reitur 712. SubmitDocument uses Reitur 712
til locate og send the XML.

## Beiðni — skjal Identifier (Gefðu upp ONE)
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| salesInvoiceNo | string | Posted sales invoice number |
| salesInvoiceRecordSystemId | string | SystemId GUID of posted sales invoice |
| salesCreditMemoNo | string | Posted sales credit memo number |
| salesCreditMemoRecordSystemId | string | SystemId GUID of posted sales credit memo |

## Beiðni — valfrjálst XML Override
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| xml | string | Raw UBL XML til submit directly (bypasses Reitur 712 lookup) |
| attachmentNo | integer | Specific skjal Attachment ID til read XML frá |
| attachmentRecordSystemId | string | SystemId of a skjal Attachment færsla |

XML source resolution order: `xml` → `attachmentRecordSystemId` → `attachmentNo` → Reitur 712 (xDoc fetch).

## Svar (Unified Format)
```json
{
  "documentNo": "103301",
  "completed": true,
  "workflow": "submitted",
  "originalIdentifier": "81303ED7...",
  "documentExchangeIdentifier": "557D19D8...",
  "documentExchangeStatus": "Sent to Document Exchange Service"
}
```

| Svar Reitur | Gerð | Lýsing |
|----------------|------|-------------|
| documentNo | string | The posted skjal number |
| completed | boolean | Always `true` — submission er the final step |
| Verkflæði | string | Always `"submitted"` |
| originalIdentifier | string | Reitur 712 value (xDoc TransactionId frá CreateInvoice) |
| documentExchangeIdentifier | string | Reitur 710 value (exchange message ID / UUID frá Svar) |
| documentExchangeStatus | string | Reitur 711 value (`"Sent to Document Exchange Service"`) |

## Fields Updated on the Posted skjal
| Reitur No. | Reitur Heiti | Value Set |
|-----------|------------|-----------|
| 710 | skjal Exchange Identifier | Exchange message ID frá partner Svar |
| 711 | skjal Exchange Status | "Sent til skjal Exchange Service" |

## Next Step
Notaðu **StatusSync** til poll the exchange fyrir delivery confirmation.


