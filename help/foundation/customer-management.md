---
id: customer-management
title: "Bifrost Customer Management"
sidebar_label: "Customer Management"
sidebar_position: 48
---

**Bifrost Customer Management** lists the Customers of a Partner - or, for a Vendor, the customers of
all its Partners - with their rate-limit tier and month-to-date usage. A Partner also invites and
cancels its customers here. It opens from **Customer Management** on the [Bifrost Setup](/help/foundation/bifrost-setup/)
page, or from **View Customers** on [Partner Management](/help/foundation/partner-management/), and
requires the Partner or Vendor role and licence administration permission.

The **View** field at the top shows whose customers are listed.

## Columns

| Field | Description |
| --- | --- |
| **Company Name** | The customer company. |
| **Environment Name** | The Business Central environment of the company. |
| **Approved At** / **Approved By User Id** | When and by whom the customer accepted the Partner relationship. |
| **Rate Limit Tier** / **Rate Limit Per Day** | The tier the customer chose and its API calls per day. Free is the default 1,000 calls per day. |
| **Above Free Tier** | The customer chose a tier above Free - invoice it at the tier price agreed with the customer. |
| **User Msgs MTD** / **App Msgs MTD** | User and App Registration messages used this month - invoice them at the Subscription prices agreed with the customer. |

## Actions

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the list. |
| **View Usage** | Opens the [usage entries](/help/foundation/license-usage/) of the selected customer. |
| **Invite Customer** | Partners only. Opens [Invite Customer](/help/foundation/invite-customer/). |
| **Cancel Customer** | Partners only. Ends the relationship with the selected customer, with an optional [reason](/help/foundation/cancel-reason/). On the customer's next Sync it returns to the Prepaid license; its usage up to then stays in your billing figures. |

Only active customers are listed; a cancelled customer disappears from the page but remains in the
billing message types for the period. See [Working as a Partner](/foundation/licensing/partner/).
