---
id: documentexchange-ubl-renderbilling
title: "DocumentExchange.UBL.RenderBilling"
sidebar_label: "DocumentExchange.UBL.RenderBilling"
sidebar_position: 49
description: "Beiðni- og svarsamningur fyrir DocumentExchange.UBL.RenderBilling Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Renders a legal UBL Invoice eða CreditNote XML skjal frá structured buffer data.
Supports PEPPOL BIS 3.0, er e-reikningur BII1, og PEPPOL BIS 2.0 standards.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| staðlaða | string | **Yes** | `BIS30`, `BII1`, eða `BIS20` |
| documentData | object | **Yes** | Buffer structure (same as CreateInvoice invoiceData) |
| storageTarget | string | No | `None` (default), `DocumentAttachment`, `IncomingDocument` |
| storageParams | object | Conditional | nauðsynlegt Þegar storageTarget ≠ None (see below) |
| returnXml | boolean | No | Return XML in Svar (default: true) |

## storageParams fyrir DocumentAttachment
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| tableId | integer | BC table til link attachment til (e.g. 112 = Sales Invoice Header) |
| documentNo | string | skjal No. fyrir the attachment link |
| fileName | string | valfrjálst filename (default: UBL_Document.xml) |

## storageParams fyrir IncomingDocument
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| Lýsing | string | valfrjálst Lýsing fyrir the Incoming skjal færsla |
| fileName | string | valfrjálst filename fyrir the attachment |

## documentData structure
Same buffer JSON as CreateInvoice `invoiceData`:
`{ header: {...}, lines: [...], parties: [...], taxes: [...], payments: [...] }`

## skjal Types
| documentType (header) | UBL skjal |
|-----------------------|--------------|
| 380 | Invoice |
| 381 | CreditNote |
| 384 | Corrected Invoice |
| 386 | Prepayment Invoice |
| 389 | Self-billed Invoice |

## Svar
```json
{ "success": true, "standard": "BIS30", "documentType": "Invoice",
  "xml": "<?xml ...", "storageResult": { "target": "...", ... } }
```

## Party Role Aliases
Notaðu text roles instead of integer partyType:
- `"role": "supplier"` eða `"seller"` eða `"vendor"` → AccountingSupplierParty
- `"role": "customer"` eða `"buyer"` → AccountingCustomerParty

## Reitur Aliases (convenience)
| Alias | Maps til |
|-------|---------|
| documentCurrencyCode | currencyCode (header) |
| lineAmount | lineExtensionAmount |
| unitPrice | priceAmount |
| Lýsing | itemName |
| taxCategoryCode | taxCategoryId |
| taxPercent | taxCategoryPercent |
| Heiti | partyName |
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
Ef header totals (lineExtensionAmount, taxExclusiveAmount, etc.) eru omitted,
they eru auto-calculated frá lines og taxes.

## Input Validation
The following fields eru validated áður en rendering. Missing nauðsynlegt fields return an error:

**nauðsynlegt (header):** documentNo, issueDate, currencyCode (eða documentCurrencyCode)

**nauðsynlegt (structure):** at least one line, a supplier party, og a viðskiptavinur party

**Per line:** lineId (eða lineNo), itemName

**Validated codes:** taxCategoryId verður að be a valid Peppol code: S, Z, E, AE, K, G, O, L, M

**messageId** getur be placed at the documentData level eða inside header — both eru accepted.

## Incoming skjal Auto-Detection
Þegar `storageTarget: "IncomingDocument"`, BC auto-detects the Data Exchange Gerð
(BIIINVOICE, BIICREDITMEMO) frá the XML structure. The Incoming skjal er
ready fyrir `Incoming.Document.Process` without manual Gerð selection.

## Sending Rendered XML via Exchange
eftir rendering, submit the XML directly til the exchange:

### Via Advania (any UBL Gerð):
```json
{ "type": "DocumentExchange.Advania.SubmitDocument",
  "data": { "xml": "<raw XML string>", "salesInvoiceNo": "103001" } }
```
Uses `/outbox-simple` — auto-detects Gerð frá XML CustomizationID.

### Via Unimaze (any UBL Gerð):
```json
{ "type": "DocumentExchange.Unimaze.SubmitXml",
  "data": { "xml": "<base64-encoded XML>", "transactionGroup": "SubmitInvoice" } }
```
færsla groups: SubmitInvoice, CorrectWithCredit, SubmitOrder,
SubmitDespatchAdvice, SubmitCatalogue, SubmitOrderResponse.

### VAT CompanyID format (Peppol BR-CO-09):
The supplier`s PartyTaxScheme/CompanyID verður að have a country prefix:
- Correct: `IS5801120800` (country code + kennitala)
- Wrong: `5801120800` (no prefix → validation error 422)
Set `taxCompanyId: "IS" + registrationNo` Þegar building documentData.

## Where til Sækja Data frá BC

### fyrir outgoing sales invoices/credit memos:
| Buffer Reitur | BC Source | Table | Reitur |
|---|---|---|---|
| header.documentNo | Posted Sales Invoice No. | Sales Invoice Header (112) | No. |
| header.issueDate | Posting Date | Sales Invoice Header | Posting Date |
| header.dueDate | Due Date | Sales Invoice Header | Due Date |
| header.currencyCode | Currency Code | Sales Invoice Header | Currency Code (blank=LCY) |
| parties[supplier] | fyrirtæki Information | fyrirtæki Information (79) | Heiti, Address, VAT Reg No |
| parties[viðskiptavinur] | Sell-til fields | Sales Invoice Header | Sell-til viðskiptavinur Heiti/Address |
| parties[viðskiptavinur].electronicAddress | viðskiptavinur Registration No. | viðskiptavinur (18) | Registration Number |
| lines[].itemName | Lýsing | Sales Invoice Line (113) | Lýsing |
| lines[].quantity | Quantity | Sales Invoice Line | Quantity |
| lines[].unitPrice | Unit Price | Sales Invoice Line | Unit Price |
| lines[].unitCode | Unit of Measure Code | Sales Invoice Line | Unit of Measure Code |
| taxes[].taxPercent | VAT % | VAT Entry (254) eða VAT Posting Setup | VAT % |
| greiðslur[].payeeAccountNo | bankareikningur No. | fyrirtæki Information / bankareikningur | IBAN eða No. |

### fyrir incoming purchase invoices (receive flow):
1. Kallaðu á `DocumentExchange.Advania.GetDocument` eða `DocumentExchange.Unimaze.GetDocument`
   með `createIncomingDocument: true`
2. BC auto-detects Data Exchange Gerð (BIIINVOICE/BIICREDITMEMO)
3. Kallaðu á `Incoming.Document.Process` → Býr til Purchase Invoice/Credit Memo
4. Vendor resolved by Registration Number (kennitala) frá XML EndpointID

### BIS30 Code Mapping (DocEx BIS30 Code Map ori table):
Incoming XML codes eru translated til BC codes via the mapping table.
| Map Gerð | Dæmi: XML → BC |
|---|---|
| UOM | HUR → HOUR, EA → PCS, KGM → KG |
| Currency | (pass-through unless mapped) |
| VATCategory | S → staðlaða, Z → Zero |
| CountryRegion | (pass-through unless mapped) |
| PaymentMeans | 30 → Transfer, 42 → Bank |


