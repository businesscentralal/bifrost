---
id: documentexchange-ubl-renderdespatchadvice
title: "DocumentExchange.UBL.RenderDespatchAdvice"
sidebar_label: "DocumentExchange.UBL.RenderDespatchAdvice"
sidebar_position: 50
description: "Request and response contract for the DocumentExchange.UBL.RenderDespatchAdvice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Renders a UBL DespatchAdvice XML for shipment notifications (Peppol BIS 3.0).

## documentData specifics
- `header.documentNo` → shipment/despatch note number
- `header.orderReferenceId` → original order number the shipment fulfils
- `header.actualDeliveryDate` → when the shipment was dispatched
- `header.deliveryStreet/City/PostCode/CountryCode` → delivery address
- Lines: `quantity` = delivered quantity, `orderLineReferenceId` = original order line
- Parties: `role: "supplier"` = DespatchSupplierParty, `role: "customer"` = DeliveryCustomerParty

All other fields same as RenderBilling (standard, storageTarget, etc.)

## Where to Get Data from BC
| Buffer field | BC Source |
|---|---|
| header.documentNo | Posted Sales Shipment (110).No. |
| header.orderReferenceId | Posted Sales Shipment.Order No. or External Document No. |
| header.actualDeliveryDate | Posted Sales Shipment.Posting Date |
| header.delivery* | Posted Sales Shipment: Ship-to Address/City/Post Code/Country |
| parties[supplier] | Company Information (79): Name, Address, Registration No. |
| parties[customer] | Posted Sales Shipment: Sell-to/Ship-to fields |
| lines[].quantity | Posted Sales Shipment Line (111): Quantity |
| lines[].itemName | Posted Sales Shipment Line: Description |
| lines[].unitCode | Posted Sales Shipment Line: Unit of Measure Code |

## Sending via Exchange
- **Advania**: `SubmitDocument { xml }` — receiver must have PEPPOL Despatch Advice 3.0 enabled
- **Unimaze**: `SubmitXml { xml, transactionGroup: "SubmitDespatchAdvice" }`
- Check receiver support: `GetDocumentSupport { endpointId }` before sending

