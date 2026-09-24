---
id: bifrost-request-log
title: "Bifrost Request Log"
sidebar_label: "Request Log"
sidebar_position: 58
---

The **Bifrost Request Log** lists the outbound HTTP requests Bifröst applications made on your
behalf, newest first. Each user sees only their own entries. Open it from **Request Log** on the
[Bifrost Setup](/help/foundation/bifrost-setup/) page.

| Field | Description |
| --- | --- |
| **Entry No.** | The entry number. |
| **Sent At** | When the request was sent. |
| **Service Name** / **Log Type** | The service and the connector that made the request. |
| **Operation** | The operation that was performed. |
| **HTTP Method** / **Service Base URL** | The method and the host of the request. |
| **HTTP Status** / **Success** | The status code returned and whether the request completed without error. |
| **Elapsed** | How long the request took. |
| **User ID** | The user who initiated the request. |

| Action | Description |
| --- | --- |
| **Delete Entries Older Than 7 Days** | Removes your entries older than seven days. |
| **Delete All Entries** | Removes all your entries. |

Open an entry to see the [details](/help/foundation/bifrost-request-log-entry/). Request and response
bodies are stored with sensitive values masked; while **Request Debug Mode** is on in Bifrost Setup
they are stored in full - turn it off again after troubleshooting.
