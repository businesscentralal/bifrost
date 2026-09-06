---
id: documentexchange-advania-getdocumentlines
title: "DocumentExchange.Advania.GetDocumentLines"
sidebar_label: "DocumentExchange.Advania.GetDocumentLines"
sidebar_position: 11
description: "Request and response contract for the DocumentExchange.Advania.GetDocumentLines Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only. On Unimaze, parse lines from the XML returned by GetDocument.

Returns all parsed invoice lines for a document.

## Request
| Field | Type | Required |
|-------|------|----------|
| messageId | string | **Yes** |

## Response
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Field | Type | Description |
|-------|------|-------------|
| uuid | string | Parent document UUID |
| line_id | integer | Line sequence number |
| item_name | string | Item/service name |
| item_description | string | Extended description (nullable) |
| seller_identification | string | Seller item code |
| item_identification | string | Standard item ID (nullable) |
| quantity | decimal | Quantity |
| unitcode | string | UOM code (UN/ECE Rec 20, e.g. H87=piece, EA=each) |
| line_amount | decimal | Line total |
| line_currency | string | Line currency |
| price_amount | decimal | Unit price |
| tax_category | string | Tax category code (S=standard, O=outside scope) |
| tax_percent | decimal | Tax percentage (nullable) |
| tax_amount | decimal | Tax amount (nullable) |
| accounting_cost | string | Cost allocation code (nullable) |
| delivery_date | string | Line delivery date (nullable) |

