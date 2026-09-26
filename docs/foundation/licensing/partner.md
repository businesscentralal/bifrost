---
id: partner
title: "Working as a Partner"
sidebar_position: 5
description: "How a Bifröst Partner registers, invites customers to the Subscription license, follows their usage and rate-limit tier, and invoices them."
---

A **Partner** serves Business Central customers with Bifröst. A customer the Partner has invited
and that has accepted is on the **Subscription** license: the **Partner invoices the customer** for
the messages it uses each month (and for a rate-limit tier above Free, if the customer chooses one),
and the Partner's Vendor invoices the Partner.

## Becoming a Partner

A tenant becomes a Partner when a Vendor invites it.

1. Install Bifröst Foundation and complete the [Setup Wizard](/help/foundation/bifrost-setup-wizard/)
   - the Vendor cannot invite a tenant that has not approved the EULA.
2. Give the Vendor your **Microsoft Entra tenant ID**.
3. After the Vendor has sent the invitation, open **Bifröst Setup** and choose **Sync** - the
   invitation is only picked up by a Sync. Choose **Register as Partner** on the notification *A
   Bifrost Vendor has introduced this tenant as a Partner*.

The registration uses the **Company Information** of the current company, which is what the Vendor
and your customers see. **Customer Management**, **Pending Customer Leave Requests** and **Request
to Leave Vendor** then appear on Bifröst Setup. The Partner role belongs to the company that
registered; other companies of the tenant do not get the Partner functions.

## Inviting customers

On [Customer Management](/help/foundation/customer-management/), choose **Invite Customer** and
enter the customer's **Microsoft Entra tenant ID** (or its 64-character tenant hash) and, optionally,
a friendly name. Select **Demo environment** when the tenant is one you use for demonstrations:
its usage is then reported to you and your Vendor as **Demo**, separately from regular customer
usage. The customer sees the invitation on its Bifröst Setup page and accepts it there - see
[Being a Customer](./customer.md). From that moment:

- the customer is on **Subscription**, in every company of its tenant;
- its usage appears in your Customer Management, usage and billing figures;
- the customer can set monthly quotas and choose a rate-limit tier.

A customer that has invitations from more than one Partner chooses which one to accept.

To use Bifröst yourself on Subscription, invite **your own tenant** as a customer. Your people's
usage there is reported as **Internal**, separately from your customers' usage. See
[Charge types on Subscription](./license-types.md#charge-types).

## Following your customers

| Where | What you see |
|---|---|
| [Customer Management](/help/foundation/customer-management/) | Each customer company: environment, when and by whom the relationship was approved, the rate-limit tier and calls per day, whether the tier is **above Free**, and the messages used so far this month per charge type (User, App Registration, Internal, Demo, Support). **View Usage** opens the customer's usage entries. |
| [License Usage](/help/foundation/license-usage/) | The individual usage entries, filterable by company, charge type and date (usage date or reporting date). |
| Billing message types | `Bifrost.Partner.GetBillingSummary` and `Bifrost.Partner.GetCustomers` return the invoicing figures for a period - see [Usage and billing](./usage-and-billing.md). |

## Invoicing

Invoice each customer for:

- the messages it used in the period, at the Subscription prices you agreed with it. The billing
  figures give **User**, **App Registration**, **Internal**, **Demo** and **Support** messages
  separately, so you choose which of them to invoice;
- its **rate-limit tier**, when it is above Free, at the tier price you agreed with it.

A customer whose relationship ended during the period is still included in the billing figures for
the Subscription usage it had before the cancellation.

## Cancelling a customer

Select the customer on Customer Management and choose **Cancel Customer**, optionally with a reason
the customer will see. On the customer's next Sync the relationship ends and the customer returns
to the **Prepaid** license; its rate limit returns to Free. The customer no longer appears on
Customer Management, but its usage up to the cancellation stays in your billing figures.

## When a customer asks to leave

A customer can send you a leave request (**Request to Leave Partner**). Bifröst Setup then shows
*Pending customer leave request(s) are waiting for review*. Open
[Pending Customer Leave Requests](/help/foundation/pending-customer-leave-requests/) and:

- **Confirm** - the customer is cancelled exactly as with Cancel Customer and returns to Prepaid;
- **Reject** - enter a reason; the customer sees it on its next Sync and stays your customer.

## Leaving your Vendor

**Request to Leave Vendor** on Bifröst Setup asks the Vendor to end your Partner registration. If the
Vendor confirms, your registration is closed and **every one of your customers returns to Prepaid**.
If the Vendor rejects the request, you see the reason on Bifröst Setup after your next Sync.

The same happens without a request when the Vendor cancels you: Bifröst Setup then shows *A Bifrost
Vendor has cancelled this Partner*, and your customers receive their cancellations.

## Related

- [Working as a Vendor](./vendor.md)
- [Being a Customer](./customer.md)
- [Leaving and cancelling](./leaving-and-cancelling.md)
- [Usage and billing](./usage-and-billing.md)
