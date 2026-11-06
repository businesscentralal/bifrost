---
id: customer-management
title: "Bifrost Customer Management"
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
| **Friendly Name** | The customer's display name. If it is empty, the list uses the most recently updated non-empty name from another registration of the same tenant within your permitted customer scope, including registrations not shown in this list. An existing name is kept; without an eligible name, the field stays empty. This changes only the display. |
| **Company Name** | The customer company. |
| **Environment Name** | The Business Central environment of the company. |
| **Approved At** / **Approved By** | When and by whom the customer accepted the Partner relationship. This is separate from accepting the End User License Agreement (EULA). |
| **EULA Approved At** / **EULA Approved By** | When and by whom the company accepted the EULA. These columns do not indicate approval of the Partner relationship. Missing approval details are shown as empty values; an unreadable approval time is also empty. |
| **Rate Limit Tier** / **Rate Limit Per Day** | The tier the customer chose and the messages per 24 hours it allows for the customer's sandbox usage on the public Bifröst MCP server. Free, 1,000 messages, is the default. Production usage is not rate-limited. |
| **Above Free Tier** | The customer chose a tier above Free. |
| **User Msgs MTD** / **App Msgs MTD** | User and App Registration messages used this month. |
| **Internal Messages MTD** | Messages this month by people in this customer when it is your own tenant. Reported separately from customer usage. |
| **Demo Messages MTD** | Messages this month by people in this customer when you marked it as a demo environment. Reported separately from customer usage. |
| **Support Messages MTD** | Messages this month by your users working in this customer through a delegated partner plan. Reported separately from customer usage. |

## Actions

| Action | Description |
| --- | --- |
| **Refresh** | Reloads the list. |
| **View Usage** | Opens the [usage entries](/help/foundation/license-usage/) of the selected customer. |
| **Invite Customer** | Partners only, on their own customers. Opens [Invite Customer](/help/foundation/invite-customer/). |
| **Cancel Customer** | Partners only, on their own customers. Ends the relationship with the selected customer, with an optional [reason](/help/foundation/cancel-reason/). On the customer's next Sync it returns to the Prepaid license. |

Only active customers are listed; a cancelled customer disappears from the page, but its usage up to
the cancellation stays in the usage entries. See [Charge types on Subscription](/licensing/license-types/#charge-types).
