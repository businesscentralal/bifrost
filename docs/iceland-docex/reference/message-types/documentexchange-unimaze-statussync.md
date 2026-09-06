---
id: documentexchange-unimaze-statussync
title: "DocumentExchange.Unimaze.StatusSync"
sidebar_label: "DocumentExchange.Unimaze.StatusSync"
sidebar_position: 72
description: "Request and response contract for the DocumentExchange.Unimaze.StatusSync Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Syncs delivery status from the document exchange for sent invoices/credit memos.
Reads the exchange UUID from field 710, queries the exchange API for current status,
and updates field 711 (Document Exchange Status) on the posted document.

## Request — Document Identifier (provide ONE, or omit all for batch sync)
| Field | Type | Description |
|-------|------|-------------|
| salesInvoiceNo | string | Posted invoice number to sync |
| salesInvoiceRecordSystemId | string | SystemId of posted invoice |
| salesCreditMemoNo | string | Posted credit memo number to sync |
| salesCreditMemoRecordSystemId | string | SystemId of posted credit memo |

### Batch Sync
If **no parameters** are provided, syncs ALL documents where field 711 = "Sent to Document Exchange Service".
This is the recommended approach for periodic status polling.

## Response
```json
{
  "synced": 4,
  "updated": 2,
  "results": [
    {
      "documentNo": "103301",
      "type": "Invoice",
      "exchangeStatusId": 3,
      "exchangeStatus": "ssDeliverd",
      "bcStatus": "Delivered to Recipient",
      "changed": true
    }
  ]
}
```

| Response Field | Description |
|----------------|-------------|
| synced | Number of documents checked against the exchange |
| updated | Number of documents whose BC status was changed |
| results[].documentNo | Posted document number |
| results[].type | "Invoice" or "CreditMemo" |
| results[].exchangeStatusId | Raw status ID from exchange |
| results[].exchangeStatus | Raw status code from exchange (e.g. "ssDeliverd") |
| results[].bcStatus | Mapped BC status label (Icelandic) |
| results[].changed | true if field 711 was updated, false if already current |

## Typed Access (Unified Buffer)
The response items map
onto `DocEx Status Buffer ori` records with delivery status enum values.

## Status Mapping (Exchange → BC)
| Exchange status_id | Exchange Code | → BC Status (field 711) |
|-------------------|---------------|-------------------------|
| 1, 11, 28, 30, 31, 200 | ssUnDeliverd, etc. | Pending Connection to Recipient |
| 2, 3, 10, 13, 14, 20, 21, 23, 90 | ssDeliverd, ssApproved, etc. | Delivered to Recipient |
| 4, 5, 6, 7, 22, 992 | ssError, ssDenied, etc. | Delivery Failed |

## Verify After Sync with Data.Records.Get
```
# Check invoice status:
Data.Records.Get table="Sales Invoice Header" filter="No.=103301"
  fields=[No. (3), Document Exchange Identifier (710),
          Document Exchange Status (711), Doc. Exch. Original Identifier (712)]

# Check credit memo status:
Data.Records.Get table="Sales Cr.Memo Header" filter="No.=104004"
  fields=[No. (3), Document Exchange Identifier (710),
          Document Exchange Status (711), Doc. Exch. Original Identifier (712)]

# Find all sent documents (batch sync candidates):
Data.Records.Get table="Sales Invoice Header"
  filter="Document Exchange Status=Sent to Document Exchange Service"
  fields=[No. (3), Document Exchange Status (711)]
```

## Field Reference (Posted Sales Invoice Header / Sales Cr.Memo Header)
| Field No. | Field Name | Type | Description |
|-----------|------------|------|-------------|
| 710 | Document Exchange Identifier | Text[50] | Exchange UUID (set by SubmitDocument) |
| 711 | Document Exchange Status | Enum | BC status: Not Sent, Sent, Pending, Delivered, Failed |
| 712 | Doc. Exch. Original Identifier | Text[50] | xDoc TransactionId (set by CreateInvoice) |

