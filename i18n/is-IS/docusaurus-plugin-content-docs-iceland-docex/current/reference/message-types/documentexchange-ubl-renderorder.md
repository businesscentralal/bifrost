---
id: documentexchange-ubl-renderorder
title: "DocumentExchange.UBL.RenderOrder"
sidebar_label: "DocumentExchange.UBL.RenderOrder"
sidebar_position: 51
description: "Beiðni- og svarsamningur fyrir DocumentExchange.UBL.RenderOrder Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Renders a UBL Order eða OrderResponse XML. Supports two input modes:
1. **purchaseOrderNo** — reads a BC Purchase Order og builds the XML sjálfkrafa
2. **documentData** — manual buffer structure (same as other render types)

## Beiðni Fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| purchaseOrderNo | string | Option A | BC Purchase Order number — auto-reads header, lines, parties |
| documentData | object | Option B | Manual buffer structure (Ef purchaseOrderNo not provided) |
| staðlaða | string | No | `BIS30` (default), `BII1`, eða `BIS20` |
| responseCode | string | No | Ef present: builds OrderResponse (29=Accepted, 27=Rejected) |
| storageTarget | string | No | `None`, `DocumentAttachment`, `IncomingDocument` |
| storageParams | object | Conditional | nauðsynlegt Þegar storageTarget ≠ None |
| returnXml | boolean | No | Return XML in Svar (default: true) |

## Dæmi: Render frá Purchase Order
```json
{ "purchaseOrderNo": "106002", "standard": "BIS30" }
```
→ Reads PO 106002, builds UBL Order með buyer=fyrirtæki Info, seller=Vendor.

## Incoming Order → Sales Order Verkflæði
Þegar you RECEIVE an order (someone ordering frá you):
1. skjal arrives via GetDocument með `createIncomingDocument: true`
2. BC auto-detects Data Exchange Gerð as `BIIORDER`
3. Kallaðu á `Incoming.Document.Process` → Býr til Sales Order via Order Handler

## Party Roles
| role | UBL Element | Meaning |
|------|-------------|---------|
| viðskiptavinur / buyer | BuyerCustomerParty | The one placing the order |
| supplier / seller | SellerSupplierParty | The one fulfilling the order |

## documentData structure (manual mode)
Same as RenderBilling: `{ header, lines, parties, taxes }`
- Lines Notaðu staðlaða buffer: lineNo, itemName, quantity, unitCode, unitPrice
- Parties: Notaðu `role: "customer"` fyrir buyer, `role: "supplier"` fyrir seller

## Where til Sækja Data frá BC (auto-mode: purchaseOrderNo)
The `purchaseOrderNo` mode reads frá:
| Data | BC Source |
|------|-----------|
| Order ID | Purchase Header (38).No. |
| Issue Date | Purchase Header.skjal Date |
| Currency | Purchase Header.Currency Code (blank=LCY) |
| Buyer (us) | fyrirtæki Information (79): Heiti, Address, VAT Reg No |
| Seller (vendor) | Purchase Header: Buy-frá fields + VAT Registration No. |
| Lines | Purchase Line (39): Lýsing, Quantity, Direct Unit Cost, Unit of Measure Code |

## Where til Sækja Data frá BC (manual mode):
fyrir orders you build manually (e.g. frá a Sales Quote → outbound order):
| Buffer Reitur | BC Source |
|---|---|
| parties[buyer].electronicAddress | viðskiptavinur.Registration Number eða VAT Registration No. |
| parties[seller].electronicAddress | Vendor.Registration Number eða VAT Registration No. |
| lines[].quantity | Sales Line eða Purchase Line Quantity |
| lines[].unitPrice | Direct Unit Cost eða Unit Price |
| lines[].unitCode | Unit of Measure Code (mapped via BIS30 Code Map) |

## Advania CustomizationID Compatibility
Advania`s /outbox-simple auto-detects skjal Gerð frá CustomizationID.
| staðlaða | Gerð | CustomizationID accepted by Advania |
|---|---|---|
| BIS30 | Invoice | urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0 |
| BIS30 | CreditNote | same as Invoice |
| BIS30 | Order | urn:fdc:peppol.eu:2017:poacc:trns:order:3 (NOT the #compliant# variant) |
| BII1 | Invoice | urn:www.cenbii.eu:færsla:biicoretrdm010:ver1.0 (bare, no Peppol extension) |
| BII1 | Order | urn:www.cenbii.eu:færsla:biicoretrdm001:ver1.0 (bare, ProfileID=bii03) |
| BIS30 | DespatchAdvice | urn:fdc:peppol.eu:2017:poacc:trns:despatch_advice:3 |

Ef Advania Skilar 400 "Unable til match customization", the CustomizationID
in the XML doesn`t match their internal skjal-types table.
Notaðu `DocumentExchange.Advania.GetDocumentTypes` til see Allt registered types.


