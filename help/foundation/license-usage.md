---
id: license-usage
title: "Bifrost Usage Entries"
sidebar_label: "License Usage"
sidebar_position: 42
---

The **Bifrost Usage Entries** page lists the usage reported to the licensing service: one entry per
company, day and charge type (a day can have several entries, one per report). Open it from **License Usage** on the [Bifrost Setup](/help/foundation/bifrost-setup/)
page for your own tenant, or from **View Usage** on [Customer Management](/help/foundation/customer-management/)
or [Partner Management](/help/foundation/partner-management/) for a customer or a Partner. The page
requires licence administration permission.

## Filters

| Field | Description |
| --- | --- |
| **Company Name Filter** | Shows one company only. Type a name or use the lookup ([Companies](/help/foundation/company-name-lookup/)). Leave blank for all companies in the current view. |
| **License Type Filter** | One charge type - **User**, **App Registration**, and on Subscription **Internal**, **Demo** or **Support**. Choose **None** for every charge type. |
| **Date Basis** | Which date **Start Date** and **End Date** filter on: **Usage Date**, the day the messages were used, or **Reporting Date**, the day the usage was reported to the licensing service. Usage can be reported a day or more after it was used. |
| **Start Date** / **End Date** | Limit the entries to a date range. |
| **Records per Page** | How many entries to load at a time (25 to 1,000). |
| **Page** | The range shown and the total number of matching entries. |

## Columns

| Field | Description |
| --- | --- |
| **Company Name** | The company the usage belongs to. |
| **Date** | The day the messages were processed. |
| **License Type** | The charge type. See [Charge types on Subscription](/foundation/licensing/license-types/#charge-types). |
| **Quantity** | The number of chargeable messages. |
| **Reported At** | When the entry was reported to the licensing service. |

## Actions

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the first page with the current filters. |
| **Previous** / **Next** | Moves between pages. |

Usage is reported once a day; choose **Sync** on Bifröst Setup to report today's messages now. See
[Usage and billing](/foundation/licensing/usage-and-billing/).
