---
id: bis30-code-map
title: "BIS30 Code Map"
sidebar_label: "BIS30 Code Map"
sidebar_position: 3
---

The **BIS30 Code Map** translates the Peppol BIS 3.0 codes in a received e-invoice into the codes your
company uses in Business Central. Use it when a received invoice cannot become a purchase document because
a code in it does not exist in Business Central, for example *The unit of measure H87 does not exist*.

When a received document is read, the unit of measure of every line is translated through this map. A
code with no entry is kept as it is, so it works only if the same code exists in Business Central.

Open the page from the **BIS30 Code Map** action on [Document Exchange Setup](/help/iceland-docex/docex-setup/).

## Fields

| Field | Description |
| --- | --- |
| **Map Type** | The kind of code: **Unit of Measure**, **Currency**, **VAT Category**, **Country/Region** or **Payment Means**. Received documents use the **Unit of Measure** entries. |
| **Source Code** | The Peppol code as it appears in the received document, for example `H87` or `C62` for a piece. |
| **Target Code** | The Business Central code it is translated into, for example your own unit of measure for a piece. |
| **Description** | A description of the entry. |
| **Blocked** | Stops the entry from being used, without deleting it. |

## Tips

- A source code can be mapped once per map type.
- Networks and senders use different codes for the same unit: a piece is often `H87` or `C62`. Add an
  entry for each code your suppliers send.
- Use **Blocked** rather than deleting an entry when it should stop applying but you want to keep it.
- The Peppol code lists themselves need no credentials: ask your assistant for the Peppol BIS 3.0 unit
  codes to find the valid source codes.
