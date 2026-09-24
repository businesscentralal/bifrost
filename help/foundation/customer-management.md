---
id: customer-management
title: "Bifrost Customer Management"
sidebar_label: "Customer Management"
sidebar_position: 48
---

**Bifrost Customer Management** lists the Customers of a Partner with their rate-limit tier and
month-to-date usage, and is where the Partner invites and cancels its customers. It opens from
**Customer Management** on the [Bifrost Setup](/help/foundation/bifrost-setup/) page and requires the
Partner role and licence administration permission.

A Vendor opens it only from **View Customers** on [Partner Management](/help/foundation/partner-management/),
for the customers of the selected Partner. That view is read-only: **Invite Customer** and
**Cancel Customer** are not offered. A Vendor that is not also a Partner does not see **Customer
Management** on Bifröst Setup.

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
| **Invite Customer** | Partners only, on their own customers. Opens [Invite Customer](/help/foundation/invite-customer/). |
| **Cancel Customer** | Partners only, on their own customers. Ends the relationship with the selected customer, with an optional [reason](/help/foundation/cancel-reason/). On the customer's next Sync it returns to the Prepaid license; its usage up to then stays in your billing figures. |

Only active customers are listed; a cancelled customer disappears from the page but remains in the
billing message types for the period. See [Working as a Partner](/foundation/licensing/partner/).
