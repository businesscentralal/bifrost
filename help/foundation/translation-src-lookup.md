---
id: translation-src-lookup
title: "Select Translation Source"
sidebar_label: "Select Translation Source"
sidebar_position: 37
---

The **Select Translation Source** lookup page lists all source identifiers that currently have translation entries in Business Central. It is opened from the [Bifrost Translations](/help/foundation/bifrost-translations/) page when you use the lookup on the **Source** filter to choose which source's translations you want to view or edit.

The list is populated automatically each time the page opens by reading the distinct Source values from the existing translation records. If no translations have been added yet, the list will be empty.

## Columns

| Column | Description |
| --- | --- |
| **Source** | The source identifier that groups a set of translation entries. This is typically a message type name, module name, or external system identifier — for example `Customer.CreditLimit.Get` or `MyIntegration`. |

## Usage

Select the source whose translations you want to view or edit, then choose **OK**. The selected source is written back to the **Source** filter on the Bifrost Translations page and the list is updated to show only the translations for that source.

To clear the filter and view translations for all sources, clear the **Source** field directly on the Bifrost Translations page.

## Related Pages

-   [Bifrost Translations](/help/foundation/bifrost-translations/) – the list page from which this lookup is opened.
