---
id: documentexchange-ubl-renderbilling
title: "DocumentExchange.UBL.RenderBilling"
sidebar_label: "DocumentExchange.UBL.RenderBilling"
sidebar_position: 49
description: "Request and response contract for the DocumentExchange.UBL.RenderBilling Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Renders a legal UBL Invoice or CreditNote XML document from structured buffer data.
Supports PEPPOL BIS 3.0, IS e-reikningur BII1, and PEPPOL BIS 2.0 standards.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| standard | string | **Yes** | `BIS30`, `BII1`, or `BIS20` |
| documentData | object | **Yes** | Buffer structure (same as CreateInvoice invoiceData) |
| storageTarget | string | No | `None` (default), `DocumentAttachment`, `IncomingDocument` |
| storageParams | object | Conditional | Required when storageTarget ≠ None (see below) |
| returnXml | boolean | No | Return XML in response (default: true) |

## storageParams for DocumentAttachment
| Field | Type | Description |
|-------|------|-------------|
| tableId | integer | BC table to link attachment to (e.g. 112 = Sales Invoice Header) |
| documentNo | string | Document No. for the attachment link |
| fileName | string | Optional filename (default: UBL_Document.xml) |

## storageParams for IncomingDocument
| Field | Type | Description |
|-------|------|-------------|
| description | string | Optional description for the Incoming Document record |
| fileName | string | Optional filename for the attachment |

## documentData structure
Same buffer JSON as CreateInvoice `invoiceData`:
`{ header: {...}, lines: [...], parties: [...], taxes: [...], payments: [...] }`

## Document Types
| documentType (header) | UBL Document |
|-----------------------|--------------|
| 380 | Invoice |
| 381 | CreditNote |
| 384 | Corrected Invoice |
| 386 | Prepayment Invoice |
| 389 | Self-billed Invoice |

## Response
```json
{ "success": true, "standard": "BIS30", "documentType": "Invoice",
  "xml": "<?xml ...", "storageResult": { "target": "...", ... } }
```

## Party Role Aliases
Use text roles instead of integer partyType:
- `"role": "supplier"` or `"seller"` or `"vendor"` → AccountingSupplierParty
- `"role": "customer"` or `"buyer"` → AccountingCustomerParty

## Field Aliases (convenience)
| Alias | Maps to |
|-------|---------|
| documentCurrencyCode | currencyCode (header) |
| lineAmount | lineExtensionAmount |
| unitPrice | priceAmount |
| description | itemName |
| taxCategoryCode | taxCategoryId |
| taxPercent | taxCategoryPercent |
| name | partyName |
| country | countryCode |
| partyIdSchemeId | partyIdScheme |
| electronicAddress | endpointId |
| electronicAddressScheme | endpointSchemeId |
| registrationNo | partyId |
| streetAddress | streetName |
| city | cityName |
| postalCode | postalZone |
| meansCode | paymentMeansCode |
| payeeAccountNo | accountId |

## Auto-Calculate
If header totals (lineExtensionAmount, taxExclusiveAmount, etc.) are omitted,
they are auto-calculated from lines and taxes.

## Input Validation
The following fields are validated before rendering. Missing required fields return an error:

**Required (header):** documentNo, issueDate, currencyCode (or documentCurrencyCode)

**Required (structure):** at least one line, a supplier party, and a customer party

**Per line:** lineId (or lineNo), itemName

**Validated codes:** taxCategoryId must be a valid Peppol code: S, Z, E, AE, K, G, O, L, M

**messageId** can be placed at the documentData level or inside header — both are accepted.

## Incoming Document Auto-Detection
When `storageTarget: "IncomingDocument"`, BC auto-detects the Data Exchange Type
(BIIINVOICE, BIICREDITMEMO) from the XML structure. The Incoming Document is
ready for `Incoming.Document.Process` without manual type selection.

## Sending Rendered XML via Exchange
After rendering, submit the XML directly to the exchange:

### Via Advania (any UBL type):
```json
{ "type": "DocumentExchange.Advania.SubmitDocument",
  "data": { "xml": "<raw XML string>", "salesInvoiceNo": "103001" } }
```
Uses `/outbox-simple` — auto-detects type from XML CustomizationID.

### Via Unimaze (any UBL type):
```json
{ "type": "DocumentExchange.Unimaze.SubmitXml",
  "data": { "xml": "<base64-encoded XML>", "transactionGroup": "SubmitInvoice" } }
```
Transaction groups: SubmitInvoice, CorrectWithCredit, SubmitOrder,
SubmitDespatchAdvice, SubmitCatalogue, SubmitOrderResponse.

### VAT CompanyID format (Peppol BR-CO-09):
The supplier`s PartyTaxScheme/CompanyID MUST have a country prefix:
- Correct: `IS5801120800` (country code + kennitala)
- Wrong: `5801120800` (no prefix → validation error 422)
Set `taxCompanyId: "IS" + registrationNo` when building documentData.

## Where to Get Data from BC

### For outgoing sales invoices/credit memos:
| Buffer field | BC Source | Table | Field |
|---|---|---|---|
| header.documentNo | Posted Sales Invoice No. | Sales Invoice Header (112) | No. |
| header.issueDate | Posting Date | Sales Invoice Header | Posting Date |
| header.dueDate | Due Date | Sales Invoice Header | Due Date |
| header.currencyCode | Currency Code | Sales Invoice Header | Currency Code (blank=LCY) |
| parties[supplier] | Company Information | Company Information (79) | Name, Address, VAT Reg No |
| parties[customer] | Sell-to fields | Sales Invoice Header | Sell-to Customer Name/Address |
| parties[customer].electronicAddress | Customer Registration No. | Customer (18) | Registration Number |
| lines[].itemName | Description | Sales Invoice Line (113) | Description |
| lines[].quantity | Quantity | Sales Invoice Line | Quantity |
| lines[].unitPrice | Unit Price | Sales Invoice Line | Unit Price |
| lines[].unitCode | Unit of Measure Code | Sales Invoice Line | Unit of Measure Code |
| taxes[].taxPercent | VAT % | VAT Entry (254) or VAT Posting Setup | VAT % |
| payments[].payeeAccountNo | Bank Account No. | Company Information / Bank Account | IBAN or No. |

### For incoming purchase invoices (receive flow):
1. Call `DocumentExchange.Advania.GetDocument` or `DocumentExchange.Unimaze.GetDocument`
   with `createIncomingDocument: true`
2. BC auto-detects Data Exchange Type (BIIINVOICE/BIICREDITMEMO)
3. Call `Incoming.Document.Process` → creates Purchase Invoice/Credit Memo
4. Vendor resolved by Registration Number (kennitala) from XML EndpointID

### BIS30 Code Mapping (DocEx BIS30 Code Map ori table):
Incoming XML codes are translated to BC codes via the mapping table.
| Map Type | Example: XML → BC |
|---|---|
| UOM | HUR → HOUR, EA → PCS, KGM → KG |
| Currency | (pass-through unless mapped) |
| VATCategory | S → Standard, Z → Zero |
| CountryRegion | (pass-through unless mapped) |
| PaymentMeans | 30 → Transfer, 42 → Bank |

