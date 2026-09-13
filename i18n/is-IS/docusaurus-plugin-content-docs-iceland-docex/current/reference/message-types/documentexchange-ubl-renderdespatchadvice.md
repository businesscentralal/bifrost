---
id: documentexchange-ubl-renderdespatchadvice
title: "DocumentExchange.UBL.RenderDespatchAdvice"
sidebar_label: "DocumentExchange.UBL.RenderDespatchAdvice"
sidebar_position: 50
description: "Beiðni- og svarsamningur fyrir DocumentExchange.UBL.RenderDespatchAdvice Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Renders a UBL DespatchAdvice XML fyrir shipment notifications (Peppol BIS 3.0).

## documentData specifics
- `header.documentNo` → shipment/despatch note number
- `header.orderReferenceId` → original order number the shipment fulfils
- `header.actualDeliveryDate` → Þegar the shipment was dispatched
- `header.deliveryStreet/City/PostCode/CountryCode` → delivery address
- Lines: `quantity` = delivered quantity, `orderLineReferenceId` = original order line
- Parties: `role: "supplier"` = DespatchSupplierParty, `role: "customer"` = DeliveryCustomerParty

Allt other fields same as RenderBilling (staðlaða, storageTarget, etc.)

## Where til Sækja Data frá BC
| Buffer Reitur | BC Source |
|---|---|
| header.documentNo | Posted Sales Shipment (110).No. |
| header.orderReferenceId | Posted Sales Shipment.Order No. eða External skjal No. |
| header.actualDeliveryDate | Posted Sales Shipment.Posting Date |
| header.delivery* | Posted Sales Shipment: Ship-til Address/City/Post Code/Country |
| parties[supplier] | fyrirtæki Information (79): Heiti, Address, Registration No. |
| parties[viðskiptavinur] | Posted Sales Shipment: Sell-til/Ship-til fields |
| lines[].quantity | Posted Sales Shipment Line (111): Quantity |
| lines[].itemName | Posted Sales Shipment Line: Lýsing |
| lines[].unitCode | Posted Sales Shipment Line: Unit of Measure Code |

## Sending via Exchange
- **Advania**: `SubmitDocument { xml }` — receiver verður að have PEPPOL Despatch Advice 3.0 enabled
- **Unimaze**: `SubmitXml { xml, transactionGroup: "SubmitDespatchAdvice" }`
- Check receiver support: `GetDocumentSupport { endpointId }` áður en sending


