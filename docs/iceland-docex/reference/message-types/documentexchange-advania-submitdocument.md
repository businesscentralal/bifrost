---
id: documentexchange-advania-submitdocument
title: "DocumentExchange.Advania.SubmitDocument"
sidebar_label: "DocumentExchange.Advania.SubmitDocument"
sidebar_position: 29
description: "Request and response contract for the DocumentExchange.Advania.SubmitDocument Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Submits a previously created electronic invoice to the document exchange network.

## Partner Support
| Partner | Supported | Notes |
|---------|-----------|-------|
| Advania | Yes | Sends the XML built by CreateInvoice to the exchange |
| Unimaze | **No** | Returns error — CreateInvoice handles submission in a single step |

## Prerequisites (Advania only)
Run **CreateInvoice** first. It builds the XML, stores it as an attachment,
and writes the xDoc TransactionId to field 712. SubmitDocument uses field 712
to locate and send the XML.

## Request — Document Identifier (provide ONE)
| Field | Type | Description |
|-------|------|-------------|
| salesInvoiceNo | string | Posted sales invoice number |
| salesInvoiceRecordSystemId | string | SystemId GUID of posted sales invoice |
| salesCreditMemoNo | string | Posted sales credit memo number |
| salesCreditMemoRecordSystemId | string | SystemId GUID of posted sales credit memo |

## Request — Optional XML Override
| Field | Type | Description |
|-------|------|-------------|
| xml | string | Raw UBL XML to submit directly (bypasses field 712 lookup) |
| attachmentNo | integer | Specific Document Attachment ID to read XML from |
| attachmentRecordSystemId | string | SystemId of a Document Attachment record |

XML source resolution order: `xml` → `attachmentRecordSystemId` → `attachmentNo` → field 712 (xDoc fetch).

## Response (Unified Format)
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

| Response Field | Type | Description |
|----------------|------|-------------|
| documentNo | string | The posted document number |
| completed | boolean | Always `true` — submission is the final step |
| workflow | string | Always `"submitted"` |
| originalIdentifier | string | Field 712 value (xDoc TransactionId from CreateInvoice) |
| documentExchangeIdentifier | string | Field 710 value (exchange message ID / UUID from response) |
| documentExchangeStatus | string | Field 711 value (`"Sent to Document Exchange Service"`) |

## Fields Updated on the Posted Document
| Field No. | Field Name | Value Set |
|-----------|------------|-----------|
| 710 | Document Exchange Identifier | Exchange message ID from partner response |
| 711 | Document Exchange Status | "Sent to Document Exchange Service" |

## Next Step
Use **StatusSync** to poll the exchange for delivery confirmation.

