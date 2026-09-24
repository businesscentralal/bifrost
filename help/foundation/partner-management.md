---
id: partner-management
title: "Bifrost Partner Management"
sidebar_label: "Partner Management"
sidebar_position: 46
---

On **Bifrost Partner Management** a Vendor invites and manages its Partners. It opens from **Partner
Management** on the [Bifrost Setup](/help/foundation/bifrost-setup/) page and requires the Vendor role
and licence administration permission.

## Columns

| Field | Description |
| --- | --- |
| **Friendly Name** | The name you gave when you invited the Partner, shown until it registers. |
| **Company Name** | The company the Partner registered with. |
| **State** | **Unregistered** - invited, not registered yet; **Open** - registered; **Closed** - cancelled. |
| **Is Self** | The Vendor registered as its own Partner. |
| **City**, **Country Region Code**, **Phone No.**, **E-Mail** | The Partner's registered contact details. |
| **Updated At** | When the Partner registration was last updated (UTC). |

## Actions

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the list. |
| **Invite Partner** | Opens [Invite Partner](/help/foundation/invite-partner/). Enter your own tenant ID to register as your own Partner. |
| **View Customers** | Opens [Customer Management](/help/foundation/customer-management/) for the selected Partner's customers. |
| **View Usage** | Opens the [usage entries](/help/foundation/license-usage/) of the selected Partner's customers. |
| **Cancel Partner** | Cancels the selected **Open** Partner, with an optional [reason](/help/foundation/cancel-reason/). On the Partner's next Sync its registration is closed, and every customer of that Partner returns to the Prepaid license on its own next Sync. |

See [Working as a Vendor](/foundation/licensing/vendor/).
