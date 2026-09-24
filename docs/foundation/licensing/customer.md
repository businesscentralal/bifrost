---
id: customer
title: "Being a Customer"
sidebar_position: 6
description: "How a tenant accepts a Partner's invitation, what changes on the Subscription license, monthly quotas and rate-limit tiers, and how to leave a Partner."
---

A **Customer** is a tenant that has accepted an invitation from a Bifröst Partner. A Customer is on
the **Subscription** license and is invoiced by its Partner for the messages it uses each month.

## Accepting an invitation

1. Make sure Bifröst Foundation is installed and the [Setup Wizard](/help/foundation/bifrost-setup-wizard/)
   is complete - the tenant starts on Prepaid with an approved EULA and an activated trial.
2. Give your Partner your **Microsoft Entra tenant ID** (shown as **Azure Tenant Id** on Bifröst
   Setup).
3. When the Partner has sent the invitation, open **Bifröst Setup** (run **Sync** if the notification
   does not appear yet) and choose **Register as Customer** on the notification *A Bifrost Partner has
   invited this tenant as a Customer*.
4. If more than one Partner has invited you, [Pending Customer Invites](/help/foundation/pending-customer-invites/)
   opens: select the Partner and choose **Accept**.

Only a licence administrator can accept an invitation, because it moves the tenant's billing to
the Partner.

## What changes on Subscription

- **Every company of the tenant** is on Subscription - including companies that start using Bifröst
  later.
- Your Partner invoices you for the messages you use each month. There is no purchased quota to
  run out of.
- You can cap your own usage - and your bill - with **monthly quotas**:
  - **Company Monthly Message Quota** on the Bifröst Setup page;
  - **Monthly Msg Quota** per user on Bifröst User Setup.

  `0` means no limit. When a quota is reached, calls are refused until the next calendar month.
- You can choose a higher **rate limit** with **Configure Rate Limit** on Bifröst Setup (production
  only). Ask your Partner for the price first. See [Rate limits](./rate-limits.md).

## Following your usage

- The **License** fact box on Bifröst Setup shows your license type and the messages not yet
  reported.
- [License Usage](/help/foundation/license-usage/) lists your usage entries by day, company and pool.
- `Bifrost.Subscription.GetStatus` and `Bifrost.Subscription.GetUsage` return the same information
  to an integration - see [Usage and billing](./usage-and-billing.md).

## Leaving your Partner

Choose **Request to Leave Partner** on Bifröst Setup and, optionally, give a reason. Your Partner
reviews the request:

- **Confirmed** - on your next Sync the relationship ends and the tenant returns to **Prepaid**. Your
  rate limit returns to Free, and calls use your purchased message quota again.
- **Rejected** - after your next Sync, Bifröst Setup shows the Partner's reason. You stay a Customer.

## When your Partner cancels

Your Partner can end the relationship (**Cancel Customer**), and it also ends when the Partner's own
Vendor cancels the Partner. On your next Sync, Bifröst Setup shows *Your Bifröst Partner relationship
has ended* and the tenant is back on **Prepaid**.

A former Customer can be invited again - by the same or another Partner - and accepting that
invitation moves the tenant back to Subscription.

## Related

- [License types](./license-types.md)
- [Leaving and cancelling](./leaving-and-cancelling.md)
