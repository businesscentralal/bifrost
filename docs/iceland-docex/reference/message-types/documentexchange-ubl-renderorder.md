---
id: documentexchange-ubl-renderorder
title: "DocumentExchange.UBL.RenderOrder"
sidebar_label: "DocumentExchange.UBL.RenderOrder"
sidebar_position: 51
description: "Request and response contract for the DocumentExchange.UBL.RenderOrder Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Renders a UBL Order or OrderResponse XML. Supports two input modes:
1. **purchaseOrderNo** — reads a BC Purchase Order and builds the XML automatically
2. **documentData** — manual buffer structure (same as other render types)

## Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| purchaseOrderNo | string | Option A | BC Purchase Order number — auto-reads header, lines, parties |
| documentData | object | Option B | Manual buffer structure (if purchaseOrderNo not provided) |
| standard | string | No | `BIS30` (default), `BII1`, or `BIS20` |
| responseCode | string | No | If present: builds OrderResponse (29=Accepted, 27=Rejected) |
| storageTarget | string | No | `None`, `DocumentAttachment`, `IncomingDocument` |
| storageParams | object | Conditional | Required when storageTarget ≠ None |
| returnXml | boolean | No | Return XML in response (default: true) |

## Example: Render from Purchase Order
```json
{ "purchaseOrderNo": "106002", "standard": "BIS30" }
```
→ Reads PO 106002, builds UBL Order with buyer=Company Info, seller=Vendor.

## Incoming Order → Sales Order Workflow
When you RECEIVE an order (someone ordering from you):
1. Document arrives via GetDocument with `createIncomingDocument: true`
2. BC auto-detects Data Exchange Type as `BIIORDER`
3. Call `Incoming.Document.Process` → creates Sales Order via Order Handler

## Party Roles
| role | UBL Element | Meaning |
|------|-------------|---------|
| customer / buyer | BuyerCustomerParty | The one placing the order |
| supplier / seller | SellerSupplierParty | The one fulfilling the order |

## documentData structure (manual mode)
Same as RenderBilling: `{ header, lines, parties, taxes }`
- Lines use standard buffer: lineNo, itemName, quantity, unitCode, unitPrice
- Parties: use `role: "customer"` for buyer, `role: "supplier"` for seller

## Where to Get Data from BC (auto-mode: purchaseOrderNo)
The `purchaseOrderNo` mode reads from:
| Data | BC Source |
|------|-----------|
| Order ID | Purchase Header (38).No. |
| Issue Date | Purchase Header.Document Date |
| Currency | Purchase Header.Currency Code (blank=LCY) |
| Buyer (us) | Company Information (79): Name, Address, VAT Reg No |
| Seller (vendor) | Purchase Header: Buy-from fields + VAT Registration No. |
| Lines | Purchase Line (39): Description, Quantity, Direct Unit Cost, Unit of Measure Code |

## Where to Get Data from BC (manual mode):
For orders you build manually (e.g. from a Sales Quote → outbound order):
| Buffer field | BC Source |
|---|---|
| parties[buyer].electronicAddress | Customer.Registration Number or VAT Registration No. |
| parties[seller].electronicAddress | Vendor.Registration Number or VAT Registration No. |
| lines[].quantity | Sales Line or Purchase Line Quantity |
| lines[].unitPrice | Direct Unit Cost or Unit Price |
| lines[].unitCode | Unit of Measure Code (mapped via BIS30 Code Map) |

## Advania CustomizationID Compatibility
Advania`s /outbox-simple auto-detects document type from CustomizationID.
| Standard | Type | CustomizationID accepted by Advania |
|---|---|---|
| BIS30 | Invoice | urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0 |
| BIS30 | CreditNote | same as Invoice |
| BIS30 | Order | urn:fdc:peppol.eu:2017:poacc:trns:order:3 (NOT the #compliant# variant) |
| BII1 | Invoice | urn:www.cenbii.eu:transaction:biicoretrdm010:ver1.0 (bare, no Peppol extension) |
| BII1 | Order | urn:www.cenbii.eu:transaction:biicoretrdm001:ver1.0 (bare, ProfileID=bii03) |
| BIS30 | DespatchAdvice | urn:fdc:peppol.eu:2017:poacc:trns:despatch_advice:3 |

If Advania returns 400 "Unable to match customization", the CustomizationID
in the XML doesn`t match their internal document-types table.
Use `DocumentExchange.Advania.GetDocumentTypes` to see all registered types.

