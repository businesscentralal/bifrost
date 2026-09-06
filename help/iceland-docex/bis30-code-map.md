---
id: bis30-code-map
title: "BIS30 Code Map"
sidebar_label: "BIS30 Code Map"
sidebar_position: 3
---

The **BIS30 Code Map** page translates the Peppol BIS 3.0 codes that arrive in an incoming XML document into the Business Central codes used in this company. Without a mapping entry an incoming document keeps the raw Peppol code, which usually fails validation when the document is converted into a purchase document.

Open the page from the **BIS30 Code Map** action on [Bifröst DocEx Setup](/help/iceland-docex/docex-setup/).

## Fields

| Field | Description |
| --- | --- |
| Map Type | The kind of code being mapped — unit of measure, currency, VAT category and so on. |
| Source Code | The BIS30/Peppol code as it appears in the incoming XML document. |
| Target Code | The Business Central code the source code is translated into. |
| Description | A free-text description of the mapping entry. |
| Blocked | Blocks the entry without deleting it. A blocked entry is skipped during conversion. |

## Tips

-   One source code may only be mapped once per map type. Use **Blocked** rather than deleting when a mapping should stop applying but the history matters.
-   The Peppol reference lists themselves are available without credentials through the `DocumentExchange.BIS30.*` message types — use them to look up the valid source codes.
