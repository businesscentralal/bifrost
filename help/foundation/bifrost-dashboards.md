---
id: bifrost-dashboards
title: "Bifrost Dashboards"
---

**Bifrost Dashboards** lists the dashboards that are stored in Bifrost. A dashboard is a page of charts and tables that is filled with live Business Central data. Open one to see it in the viewer, refresh its data, or show it on the whole screen. Dashboards are created and changed outside this page; here you open, refresh and remove them.

## Fields

| Field | Description |
| --- | --- |
| **Code** | The code that identifies the dashboard. |
| **Name** | The name of the dashboard. |
| **Description** | What the dashboard shows. |
| **Enabled** | Whether the dashboard data can be refreshed. |
| **Version** | How many times the dashboard has been written. |
| **Min. Refresh Seconds** | The shortest time between two refreshes. A refresh within this time returns the stored data. |
| **Auto Refresh On Open** | Whether the dashboard refreshes its data when it is opened. |
| **Last Refresh At** | When the data was last refreshed. |
| **Last Refresh Status** | The result of the last refresh. |
| **Uploaded At** | When the dashboard was last written. |
| **Uploaded By** | The user who last wrote the dashboard. |

## Actions

| Action | Description |
| --- | --- |
| **Open Dashboard** | Shows the selected dashboard in the viewer. |
| **Refresh** | Refreshes the data of the selected dashboard using your own permissions. |
| **Remove Dashboard** | Removes the selected dashboard and its data sources. Needs the `BIFROST Dash ori` permission set. |
| **Data Sources** | Shows the data sources that fill the selected dashboard. See [Dashboard Data Sources](/help/foundation/bifrost-dashboard-data-sources/). |

## The dashboard viewer

**Open Dashboard** shows the dashboard with a **Details** group that repeats the description, the time of the last refresh and its status. The viewer toolbar offers more:

| Action | Description |
| --- | --- |
| **Refresh** | Refreshes the data using your own permissions. |
| **Full Screen** | Shows the dashboard on the whole page. The same toolbar is available there. |
| **Data Sources** | Shows the data sources that fill this dashboard. |
| **Live** | Refreshes the data at an interval. The interval is never shorter than the minimum refresh time of the dashboard, and never below 30 seconds. |
| **Copy chart** | Copies the first chart as a picture. If there is no chart, the first table is copied as text. |

Viewing a dashboard needs only the `BIFROST Read ori` permission set. A dashboard shows the data you are allowed to see.

## Chat panel

When you can use Bifrost Chat, the list shows the chat panel on the side. The chat knows which dashboard is selected, so you can ask about it directly, for example what a figure means or which data source fills a chart. The panel is shown only when you have the `BIFROST Chat ori` permission set and a chat provider is set up, the same rule as on the other Bifrost pages. See [Bifrost Chat in Business Central](/language-models/chat/).

## Common tasks

- **See a dashboard:** select it and choose **Open Dashboard**.
- **Update the figures:** choose **Refresh**. If the minimum refresh time has not passed, you get the stored data.
- **Check where the figures come from:** choose **Data Sources**.
