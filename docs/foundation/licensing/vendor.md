---
id: vendor
title: "Working as a Vendor"
sidebar_position: 4
description: "How a Bifröst Vendor onboards, invites and manages Partners, follows their customers and usage, and invoices its Partners."
---

A **Vendor** brings Bifröst to market through Partners. The Vendor does not invoice end customers
directly: it invites Partners, each Partner invites and invoices its own customers, and the Vendor
**invoices its Partners** for the Subscription usage of those customers.

Vendors are approved by Origo; Bifröst does not offer Vendor sign-up. An approved tenant is offered
Vendor onboarding on its **Bifröst Setup** page after a **Sync**.

## Onboarding

1. Open **Bifröst Setup** and choose **Sync** (under **Licensing**; licence administrators only).
   Onboarding is never offered before a Sync. An approved tenant then sees the notification *This
   tenant is eligible to register as a Bifrost Vendor*, and the **Onboard as Vendor** action appears.
2. Choose **Register as Vendor** on the notification, or **Onboard as Vendor**. Both open the
   [Vendor Onboarding wizard](/help/foundation/vendor-onboarding-wizard/). It shows the tenant and
   the **Company Information** of the current company, which is what Partners and Origo see for the
   Vendor. Correct Company Information first if needed. The wizard cannot be opened any other way.
3. Choose **Finish**. The tenant is registered as a Vendor, and **Partner Management**,
   **Pending Partner Leave Requests** and **Deregister as Vendor** appear on Bifröst Setup.

The Vendor role belongs to the company that registered it. Other companies in the same tenant do not
get the Vendor functions.

**Customer Management is a Partner function.** A Vendor sees the customers of its Partners only
read-only, through **View Customers** on Partner Management; it cannot invite, cancel or change
anything there. To serve customers itself, the Vendor registers as its own Partner (below).

## Inviting Partners

On [Partner Management](/help/foundation/partner-management/), choose **Invite Partner** and enter
the prospective Partner's **Microsoft Entra tenant ID** (or its 64-character tenant hash) and,
optionally, a friendly name to show until the Partner registers.

- The Partner must already have installed Bifröst and approved the EULA - otherwise the invitation
  is refused with *The target tenant has not installed Bifrost yet*.
- The Partner sees the invitation as the **Register as Partner** notification after it chooses
  **Sync** on its Bifröst Setup page. When the Partner accepts it, the Partner's row changes from **Unregistered** to
  **Open** and shows the Partner's registered company details.
- **Serving customers yourself.** Enter your own tenant ID to register the Vendor as its own
  Partner. Then choose **Sync** on your own Bifröst Setup page and accept the *Register as Partner*
  notification; the row is marked **Is Self**. From then on **Customer Management** appears and you
  invite customers like any other Partner.

## Following Partners and their customers

| Where | What you see |
|---|---|
| [Partner Management](/help/foundation/partner-management/) | Every Partner you invited, its state, registered company details and when it was last updated. **View Customers** opens the Partner's customers, **View Usage** its customers' usage entries. |
| **View Customers** on Partner Management | The customers of the selected Partner, read-only: company, environment, when the relationship was approved, rate-limit tier and month-to-date User and App Registration messages. Invite and cancel are not offered. |
| [License Usage](/help/foundation/license-usage/) | The individual usage entries, filterable by company, pool and date. |
| Billing message types | `Bifrost.Vendor.GetBillingSummary`, `Bifrost.Vendor.GetPartners` and `Bifrost.Vendor.GetCustomers` return the invoicing figures - see [Usage and billing](./usage-and-billing.md). |

## Cancelling a Partner

Select the Partner on Partner Management and choose **Cancel Partner**. You can add a reason, which
the Partner sees. On the Partner's next Sync its registration is closed, and every customer of that
Partner receives a cancellation and returns to the **Prepaid** license on its own next Sync. Their
Subscription usage up to that point remains in your billing figures for the period.

## When a Partner asks to leave

A Partner can send you a leave request (**Request to Leave Vendor** on its Bifröst Setup). Bifröst
Setup then shows *Pending partner leave request(s) are waiting for review*. Open
[Pending Partner Leave Requests](/help/foundation/pending-partner-leave-requests/) and:

- **Confirm** - the Partner is cancelled exactly as if you had chosen Cancel Partner;
- **Reject** - enter a reason; the Partner sees it on its next Sync and stays a Partner.

## Deregistering as a Vendor

**Deregister as Vendor** on Bifröst Setup closes the Vendor registration and cancels **every**
Partner of the Vendor; each of their customers returns to Prepaid. This cannot be undone from the
app.

## Related

- [Working as a Partner](./partner.md)
- [Leaving and cancelling](./leaving-and-cancelling.md)
- [Usage and billing](./usage-and-billing.md)
