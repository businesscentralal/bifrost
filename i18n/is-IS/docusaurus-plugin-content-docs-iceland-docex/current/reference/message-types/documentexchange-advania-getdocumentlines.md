---
id: documentexchange-advania-getdocumentlines
title: "DocumentExchange.Advania.GetDocumentLines"
sidebar_label: "DocumentExchange.Advania.GetDocumentLines"
sidebar_position: 11
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentLines Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


> **Availability:** Advania Aðeins. On Unimaze, parse lines frá the XML returned by GetDocument.

Skilar Allt parsed invoice lines fyrir a skjal.

## Beiðni
| Reitur | Gerð | nauðsynlegt |
|-------|------|----------|
| messageId | string | **Yes** |

## Svar
Paged envelope: `{ count, hasMore, items[] }`.

### Item fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| uuid | string | Parent skjal UUID |
| line_id | integer | Line sequence number |
| item_name | string | Item/service Heiti |
| item_description | string | Extended Lýsing (nullable) |
| seller_identification | string | Seller item code |
| item_identification | string | staðlaða item ID (nullable) |
| quantity | decimal | Quantity |
| unitcode | string | UOM code (UN/ECE Rec 20, e.g. H87=piece, EA=each) |
| line_amount | decimal | Line total |
| line_currency | string | Line currency |
| price_amount | decimal | Unit price |
| tax_category | string | Tax category code (S=staðlaða, O=outside scope) |
| tax_percent | decimal | Tax percentage (nullable) |
| tax_amount | decimal | Tax amount (nullable) |
| accounting_cost | string | Cost allocation code (nullable) |
| delivery_date | string | Line delivery date (nullable) |


