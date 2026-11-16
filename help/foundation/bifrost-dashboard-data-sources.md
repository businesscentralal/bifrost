---
id: bifrost-dashboard-data-sources
title: "Dashboard Data Sources"
---

**Dashboard Data Sources** shows where the figures of a [dashboard](/help/foundation/bifrost-dashboards/) come from. Each line is one data source that is read when the dashboard refreshes. The page is read only. Data sources are written together with their dashboard and are removed when the dashboard is removed.

Open the page from **Data Sources** on the dashboard list or on the dashboard viewer. It then shows only the sources of that dashboard.

## Fields

| Field | Description |
| --- | --- |
| **Dashboard Code** | The dashboard that this data source fills. |
| **Sequence No.** | The position of the source among the sources of the dashboard. |
| **Source Key** | The key under which the dashboard finds the data of this source. |
| **Message Type** | The read operation that the refresh calls to get the data. |
| **Note** | A note about this data source. |
| **Max. Pages** | How many pages of a paged answer the refresh reads at most. |
| **Page Size** | How many rows the refresh reads per page. |
| **Request** | The request that the refresh sends to that operation. |

## Actions

The page has no actions of its own. Use the back button to return to the dashboard.

## Common tasks

- **Find out what feeds a chart:** match the chart's data to the **Source Key** and read the **Request**.
- **Understand a slow refresh:** compare **Max. Pages** and **Page Size**. Together they limit how many rows a refresh reads from a source.
