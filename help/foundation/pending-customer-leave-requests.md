---
id: pending-customer-leave-requests
title: "Pending Customer Leave Requests"
sidebar_label: "Pending Customer Leave Requests"
sidebar_position: 51
---

**Pending Customer Leave Requests** lists the requests your customers sent with **Request to Leave
Partner**. It opens from the Bifröst Setup action of the same name, or from the notification *Pending
customer leave request(s) are waiting for review*, and requires the Partner role and licence
administration permission.

| Field | Description |
| --- | --- |
| **Requester Tenant Hash** | The customer tenant that sent the request. |
| **Reason** | The reason the customer gave. |
| **Issued At** | When the request was sent (UTC). |
| **State** | **Pending** until you confirm or reject it. |

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the pending requests. |
| **Confirm** | Accepts the request. The customer is cancelled and returns to the Prepaid license on its next Sync. |
| **Reject** | Declines the request with a [reason](/help/foundation/cancel-reason/). The customer sees it after its next Sync and stays your customer. |

See [Leaving and cancelling](/foundation/licensing/leaving-and-cancelling/).
