---
id: documentexchange-unimaze-submittransaction
title: "DocumentExchange.Unimaze.SubmitTransaction"
sidebar_label: "DocumentExchange.Unimaze.SubmitTransaction"
sidebar_position: 73
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.SubmitTransaction Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Generic færsla submission fyrir Allt Unimaze MAPI færsla types.
Sends orders, billing responses, quotations, catalogues, greiðsla notifications, etc.
fyrir invoices og credit notes, prefer CreateInvoice (stamps BC posted skjal fields).

## Supported færsla Types
| færsla value | skjal | MAPI Endapunktur |
|-------------------|----------|---------------|
| `submit-invoice` | Invoice | POST /færslur/submit-invoice |
| `correct-with-credit` | Credit Note | POST /færslur/correct-með-credit |
| `submit-order` | Purchase Order | POST /færslur/submit-order |
| `submit-order-change` | Order Change | POST /færslur/submit-order-change |
| `submit-order-cancellation` | Order Cancellation | POST /færslur/submit-order-cancellation |
| `submit-order-response` | Order Svar | POST /færslur/submit-order-Svar |
| `submit-billing-response` | Invoice Svar (accept/reject) | POST /færslur/submit-billing-Svar |
| `submit-payment-notification` | Remittance Advice | POST /færslur/submit-greiðsla-notification |
| `submit-catalogue` | Product Catalogue | POST /færslur/submit-catalogue |
| `request-quotation` | Quotation Beiðni | POST /færslur/Beiðni-quotation |
| `submit-quotation` | Quotation | POST /færslur/submit-quotation |

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| færsla | string | **Yes** | færsla Gerð frá table above |
| payload | object | **Yes** | MAPI JSON body (structure varies by færsla Gerð) |
| messageId | string | No | Custom message GUID (auto-generated Ef omitted) |
| more | boolean | No | Ef true, message er held fyrir additional attachments (default: false) |
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

## Payload Structure: Billing Svar (submit-billing-Svar)
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
| BC Table / Reitur | Maps til MAPI Reitur |
|------------------|-------------------|
| Sales Invoice Header."No." | Invoice.invoiceNo |
| Sales Invoice Header."Posting Date" | Invoice.issueDate (YYYY-MM-DD) |
| Sales Invoice Header."Due Date" | Invoice.dueDate |
| Sales Invoice Header."Currency Code" | Invoice.currencyCode (blank = LCY frá GL Setup) |
| Sales Invoice Header."Order No." | Invoice.orderReference.orderReferenceId |
| Sales Invoice Header."External skjal No." | Invoice.buyerReference |
| fyrirtæki Information.Heiti | Invoice.supplier.Heiti |
| fyrirtæki Information."Registration No." | Invoice.supplier.identifier (prefix 0196:) |
| fyrirtæki Information."VAT Registration No." | Invoice.supplier.vatNumber |
| fyrirtæki Information.Address + City + "Post Code" | Invoice.supplier.address |
| viðskiptavinur.Heiti | Invoice.viðskiptavinur.Heiti |
| viðskiptavinur."Registration No." | Invoice.viðskiptavinur.identifier + messageHandling.receiverIdentifier |
| viðskiptavinur."E-Mail" | messageHandling.fallbackEmailAddress |
| viðskiptavinur.Address + City + "Post Code" | Invoice.viðskiptavinur.address |
| Sales Invoice Line.Lýsing | invoiceLines[].Heiti |
| Sales Invoice Line."No." | invoiceLines[].itemNo |
| Sales Invoice Line.Quantity | invoiceLines[].quantity |
| Sales Invoice Line."Unit Price" | invoiceLines[].unitPriceAmount |
| Sales Invoice Line.Amount | invoiceLines[].taxableAmount |
| Sales Invoice Line."Amount þar á meðal VAT" - Amount | invoiceLines[].taxAmount |
| Sales Invoice Line."VAT %" | invoiceLines[].taxPercentage |
| Sales Invoice Line."Unit of Measure Code" | invoiceLines[].unitOfMeasure.unit (map til MAPI enum) |

## Data Mapping: BC → MAPI JSON (Order)
| BC Table / Reitur | Maps til MAPI Reitur |
|------------------|-------------------|
| Purchase Header."No." | order.orderNo |
| Purchase Header."Order Date" | order.issueDate |
| Purchase Header."Currency Code" | order.currencyCode |
| Vendor.Heiti | order.supplier.Heiti |
| Vendor."Registration No." | order.supplier.identifier + messageHandling.receiverIdentifier |
| Vendor.Address + City + "Post Code" | order.supplier.address |
| fyrirtæki Information.Heiti | order.viðskiptavinur.Heiti |
| fyrirtæki Information."Registration No." | order.viðskiptavinur.identifier |
| Purchase Line.Lýsing | orderLines[].Heiti |
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
| staðlaða rate (24%) | StandardRated |
| Reduced rate (11%) | ReducedRated |
| Zero rated | ZeroRated |
| Exempt | Exempt |
| Outside scope / export | OutsideTaxScope |

## Svar
Skilar fulla MAPI message envelope (same as GetDocumentInfo Svar) þar á meðal:
- `uniqueId` / `messageId` — Notaðu fyrir status tracking
- `status` — initial processing status
- `validationStatus` — approved / rejected
- `documents[]` — með referenceId fyrir each skjal

## Agent Verkflæði: Send Invoice til Unimaze
```
1. Look up receiver: GetPartyInfo { "endpointId": "<receiver_kt>" }
2. Verify support: GetDocumentSupport { "endpointId": "<receiver_kt>", "transactionGroup": "SubmitInvoice" }
3. Build MAPI JSON payload from BC data (see Data Mapping above)
4. Submit: SubmitTransaction { "transaction": "submit-invoice", "payload": { ... } }
5. Check validation: GetValidations { "messageId": "<from response>" }
6. Monitor delivery: GetDocumentInfo { "messageId": "<id>" } → check status field
```

## Agent Verkflæði: Send Order til Vendor
```
1. Look up vendor: GetPartyInfo { "endpointId": "<vendor_kt>" }
2. Verify support: GetDocumentSupport { "endpointId": "<vendor_kt>", "transactionGroup": "SubmitOrder" }
3. Build order payload from Purchase Header + Lines
4. Submit: SubmitTransaction { "transaction": "submit-order", "payload": { ... } }
5. Track: GetDocumentInfo { "messageId": "<id>" }
```

## Related
- **CreateInvoice** — simplified invoice/credit submission með BC skjal stamping
- **GetDocumentSupport** — check receiver capabilities áður en sending
- **StatusSync** — bulk-poll Allt sent skjöl fyrir delivery status changes
- **AddAttachment** — attach PDF/other files til a submitted message (Notaðu more=true)


