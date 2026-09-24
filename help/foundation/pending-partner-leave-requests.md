---
id: pending-partner-leave-requests
title: "Pending Partner Leave Requests"
sidebar_label: "Pending Partner Leave Requests"
sidebar_position: 52
---

**Pending Partner Leave Requests** lists the requests your Partners sent with **Request to Leave
Vendor**. It opens from the Bifröst Setup action of the same name, or from the notification *Pending
partner leave request(s) are waiting for review*, and requires the Vendor role and licence
administration permission.

| Field | Description |
| --- | --- |
| **Requester Tenant Hash** | The Partner tenant that sent the request. |
| **Reason** | The reason the Partner gave. |
| **Issued At** | When the request was sent (UTC). |
| **State** | **Pending** until you confirm or reject it. |

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the pending requests. |
| **Confirm** | Accepts the request. The Partner is cancelled on its next Sync, and each of its customers returns to the Prepaid license on their next Sync. |
| **Reject** | Declines the request with a [reason](/help/foundation/cancel-reason/). The Partner sees it after its next Sync and stays a Partner. |

See [Leaving and cancelling](/foundation/licensing/leaving-and-cancelling/).
