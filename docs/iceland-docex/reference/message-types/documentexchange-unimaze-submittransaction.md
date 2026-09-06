---
id: documentexchange-unimaze-submittransaction
title: "DocumentExchange.Unimaze.SubmitTransaction"
sidebar_label: "DocumentExchange.Unimaze.SubmitTransaction"
sidebar_position: 73
description: "Request and response contract for the DocumentExchange.Unimaze.SubmitTransaction Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Generic transaction submission for ALL Unimaze MAPI transaction types.
Sends orders, billing responses, quotations, catalogues, payment notifications, etc.
For invoices and credit notes, prefer CreateInvoice (stamps BC posted document fields).

## Supported Transaction Types
| transaction value | Document | MAPI Endpoint |
|-------------------|----------|---------------|
| `submit-invoice` | Invoice | POST /transactions/submit-invoice |
| `correct-with-credit` | Credit Note | POST /transactions/correct-with-credit |
| `submit-order` | Purchase Order | POST /transactions/submit-order |
| `submit-order-change` | Order Change | POST /transactions/submit-order-change |
| `submit-order-cancellation` | Order Cancellation | POST /transactions/submit-order-cancellation |
| `submit-order-response` | Order Response | POST /transactions/submit-order-response |
| `submit-billing-response` | Invoice Response (accept/reject) | POST /transactions/submit-billing-response |
| `submit-payment-notification` | Remittance Advice | POST /transactions/submit-payment-notification |
| `submit-catalogue` | Product Catalogue | POST /transactions/submit-catalogue |
| `request-quotation` | Quotation Request | POST /transactions/request-quotation |
| `submit-quotation` | Quotation | POST /transactions/submit-quotation |

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transaction | string | **Yes** | Transaction type from table above |
| payload | object | **Yes** | MAPI JSON body (structure varies by transaction type) |
| messageId | string | No | Custom message GUID (auto-generated if omitted) |
| more | boolean | No | If true, message is held for additional attachments (default: false) |
| conversationIdentifier | string | No | Correlate related messages |

## Payload Structure: Invoice / Credit Note
```json
{
  "messageHandling": {
    "receiverIdentifier": "0196:1010101111",
    "fallbackEmailAddress": "receiver@company.is"
  },
  "Invoice": {
    "invoiceNo": "103301",
    "issueDate": "2026-07-04",
    "dueDate": "2026-08-04",
    "currencyCode": "ISK",
    "buyerReference": "PO-12345",
    "supplier": { "name": "My Company", "identifier": "0196:2020202222", "vatNumber": "80112", "address": { "streetNameAndNumber": "Street 1", "city": "Reykjavik", "postalZone": "101", "countryCode": "IS" } },
    "customer": { "name": "Receiver Co", "identifier": "0196:1010101111", "address": { "streetNameAndNumber": "Ave 2", "city": "Reykjavik", "postalZone": "105", "countryCode": "IS" } },
    "invoiceLines": [
      { "itemNo": "ITEM-1", "name": "Service", "quantity": 10, "unitPriceAmount": 10000, "taxableAmount": 100000, "taxAmount": 24000, "taxCategoryType": "StandardRated", "taxPercentage": 24, "unitOfMeasure": { "unit": "Hour" } }
    ],
    "payableAmount": 124000
  }
}
```

## Payload Structure: Order (submit-order)
```json
{
  "messageHandling": {
    "receiverIdentifier": "0196:1010101111",
    "fallbackEmailAddress": "vendor@company.is"
  },
  "order": {
    "orderNo": "PO-001",
    "issueDate": "2026-07-04",
    "currencyCode": "ISK",
    "supplier": { "name": "Vendor Co", "identifier": "0196:1010101111", "address": { "streetNameAndNumber": "Vendor St 1", "city": "Reykjavik", "postalZone": "101", "countryCode": "IS" } },
    "customer": { "name": "My Company", "identifier": "0196:2020202222", "address": { "streetNameAndNumber": "My St 1", "city": "Reykjavik", "postalZone": "105", "countryCode": "IS" } },
    "orderLines": [
      { "itemNo": "ITEM-1", "name": "Widget", "quantity": 100, "unitPriceAmount": 500, "taxableAmount": 50000, "taxAmount": 12000, "taxCategoryType": "StandardRated", "taxPercentage": 24, "unitOfMeasure": { "unit": "Piece" } }
    ]
  }
}
```

## Payload Structure: Billing Response (submit-billing-response)
```json
{
  "messageHandling": {
    "receiverIdentifier": "0196:6907982479",
    "fallbackEmailAddress": "seller@company.is"
  },
  "InvoiceResponse": {
    "documentReference": { "id": "INV-001" },
    "receiverIdentifier": "0196:6907982479",
    "billingResponseLines": [
      { "status": "Accepted", "reason": "NoIssue", "actions": [{ "type": "NoActionRequired" }] }
    ]
  }
}
```

## Data Mapping: BC → MAPI JSON (Invoice)
| BC Table / Field | Maps to MAPI field |
|------------------|-------------------|
| Sales Invoice Header."No." | Invoice.invoiceNo |
| Sales Invoice Header."Posting Date" | Invoice.issueDate (YYYY-MM-DD) |
| Sales Invoice Header."Due Date" | Invoice.dueDate |
| Sales Invoice Header."Currency Code" | Invoice.currencyCode (blank = LCY from GL Setup) |
| Sales Invoice Header."Order No." | Invoice.orderReference.orderReferenceId |
| Sales Invoice Header."External Document No." | Invoice.buyerReference |
| Company Information.Name | Invoice.supplier.name |
| Company Information."Registration No." | Invoice.supplier.identifier (prefix 0196:) |
| Company Information."VAT Registration No." | Invoice.supplier.vatNumber |
| Company Information.Address + City + "Post Code" | Invoice.supplier.address |
| Customer.Name | Invoice.customer.name |
| Customer."Registration No." | Invoice.customer.identifier + messageHandling.receiverIdentifier |
| Customer."E-Mail" | messageHandling.fallbackEmailAddress |
| Customer.Address + City + "Post Code" | Invoice.customer.address |
| Sales Invoice Line.Description | invoiceLines[].name |
| Sales Invoice Line."No." | invoiceLines[].itemNo |
| Sales Invoice Line.Quantity | invoiceLines[].quantity |
| Sales Invoice Line."Unit Price" | invoiceLines[].unitPriceAmount |
| Sales Invoice Line.Amount | invoiceLines[].taxableAmount |
| Sales Invoice Line."Amount Including VAT" - Amount | invoiceLines[].taxAmount |
| Sales Invoice Line."VAT %" | invoiceLines[].taxPercentage |
| Sales Invoice Line."Unit of Measure Code" | invoiceLines[].unitOfMeasure.unit (map to MAPI enum) |

## Data Mapping: BC → MAPI JSON (Order)
| BC Table / Field | Maps to MAPI field |
|------------------|-------------------|
| Purchase Header."No." | order.orderNo |
| Purchase Header."Order Date" | order.issueDate |
| Purchase Header."Currency Code" | order.currencyCode |
| Vendor.Name | order.supplier.name |
| Vendor."Registration No." | order.supplier.identifier + messageHandling.receiverIdentifier |
| Vendor.Address + City + "Post Code" | order.supplier.address |
| Company Information.Name | order.customer.name |
| Company Information."Registration No." | order.customer.identifier |
| Purchase Line.Description | orderLines[].name |
| Purchase Line."No." | orderLines[].itemNo |
| Purchase Line.Quantity | orderLines[].quantity |
| Purchase Line."Direct Unit Cost" | orderLines[].unitPriceAmount |
| Purchase Line."Line Amount" | orderLines[].taxableAmount |
| Purchase Line."VAT %" | orderLines[].taxPercentage |
| Purchase Line."Unit of Measure Code" | orderLines[].unitOfMeasure.unit |

## Unit of Measure Mapping
| BC UoM Code | MAPI unit value |
|-------------|----------------|
| PCS / STK | Piece |
| HOUR / KST | Hour |
| KG | Kilogram |
| M / METRAR | Metre |
| L / LITRAR | Litre |
| DAY / DAGUR | Day |
| MONTH / MAN | Month |
| YEAR / AR | Year |
| KM | Kilometre |
| KWH | KiloWattHour |
| M2 | SquareMetre |
| M3 | CubicMetre |
| TON | Tonne |
| PKG / PAKKI | Package |
| (other) | One |

## Tax Category Mapping
| BC VAT Bus./Prod. setup | MAPI taxCategoryType |
|-------------------------|---------------------|
| Standard rate (24%) | StandardRated |
| Reduced rate (11%) | ReducedRated |
| Zero rated | ZeroRated |
| Exempt | Exempt |
| Outside scope / export | OutsideTaxScope |

## Response
Returns the full MAPI message envelope (same as GetDocumentInfo response) including:
- `uniqueId` / `messageId` — use for status tracking
- `status` — initial processing status
- `validationStatus` — approved / rejected
- `documents[]` — with referenceId for each document

## Agent Workflow: Send Invoice to Unimaze
```
1. Look up receiver: GetPartyInfo { "endpointId": "<receiver_kt>" }
2. Verify support: GetDocumentSupport { "endpointId": "<receiver_kt>", "transactionGroup": "SubmitInvoice" }
3. Build MAPI JSON payload from BC data (see Data Mapping above)
4. Submit: SubmitTransaction { "transaction": "submit-invoice", "payload": { ... } }
5. Check validation: GetValidations { "messageId": "<from response>" }
6. Monitor delivery: GetDocumentInfo { "messageId": "<id>" } → check status field
```

## Agent Workflow: Send Order to Vendor
```
1. Look up vendor: GetPartyInfo { "endpointId": "<vendor_kt>" }
2. Verify support: GetDocumentSupport { "endpointId": "<vendor_kt>", "transactionGroup": "SubmitOrder" }
3. Build order payload from Purchase Header + Lines
4. Submit: SubmitTransaction { "transaction": "submit-order", "payload": { ... } }
5. Track: GetDocumentInfo { "messageId": "<id>" }
```

## Related
- **CreateInvoice** — simplified invoice/credit submission with BC document stamping
- **GetDocumentSupport** — check receiver capabilities before sending
- **StatusSync** — bulk-poll all sent documents for delivery status changes
- **AddAttachment** — attach PDF/other files to a submitted message (use more=true)

