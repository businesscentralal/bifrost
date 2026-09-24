---
id: usage-and-billing
title: "Usage and billing"
sidebar_position: 8
description: "Who invoices whom, how usage is reported, and the pages and message types Customers, Partners and Vendors use to see it."
---

## Who invoices whom

| Invoice | From | To | Based on |
|---|---|---|---|
| Subscription usage | **Partner** | its **Customers** | The User and App Registration messages each customer used in the month, plus a rate-limit tier above Free when the customer chose one - at the prices agreed between them. |
| Partner billing | **Vendor** | its **Partners** | The Subscription usage and tiers of all customers of each Partner. |
| Prepaid quota | Origo | a Prepaid tenant | Purchased message quota, per pool. |

Prepaid usage never appears in Partner or Vendor billing. A customer whose relationship ended during
the period is still included for the Subscription usage it had before the cancellation.

## How usage is reported

Every company reports its chargeable messages to the licensing service once a day, per pool, in a
background task started by the first chargeable call of the day. **Sync** on Bifröst Setup reports
all pending messages immediately. Until a message is reported, it is counted as *unreported* in the
License fact box. Usage from sandbox environments is reported separately and is not billed.

## Where to see usage

| Who | Page | Message type |
|---|---|---|
| Every tenant | [License Usage](/help/foundation/license-usage/) - usage entries of your own companies | [`Bifrost.Subscription.GetUsage`](/foundation/reference/message-types/bifrost-subscription-getusage/) (scopes `CurrentCompany`, `CurrentTenant`) |
| Every tenant | [License fact box](/help/foundation/license-fact-box/) on Bifröst Setup | [`Bifrost.Subscription.GetStatus`](/foundation/reference/message-types/bifrost-subscription-getstatus/) |
| Partner | [Customer Management](/help/foundation/customer-management/) - month-to-date messages and tier per customer; **View Usage** for the entries | [`Bifrost.Partner.GetBillingSummary`](/foundation/reference/message-types/bifrost-partner-getbillingsummary/), [`Bifrost.Partner.GetCustomers`](/foundation/reference/message-types/bifrost-partner-getcustomers/), `Bifrost.Subscription.GetUsage` (scope `Partner` for yourself, `CustomerTenant`) |
| Vendor | [Partner Management](/help/foundation/partner-management/) and Customer Management | [`Bifrost.Vendor.GetBillingSummary`](/foundation/reference/message-types/bifrost-vendor-getbillingsummary/), [`Bifrost.Vendor.GetPartners`](/foundation/reference/message-types/bifrost-vendor-getpartners/), [`Bifrost.Vendor.GetCustomers`](/foundation/reference/message-types/bifrost-vendor-getcustomers/), `Bifrost.Subscription.GetUsage` (scopes `Vendor`, `Partner`, `CustomerTenant`) |

All of these require licence administration permission (the `BIFROST LicAdm ori` permission set);
the Partner and Vendor views also require the Partner or Vendor role.

## Billing periods

The billing message types take a `period` - `currentMonth` (the default) or `previousMonth` - or an
explicit `startDate` and `endDate` (`yyyy-MM-dd`). Their responses include:

- **totals** - customers, customers above the Free tier, User messages, App Registration messages
  and total rate-limit capacity per day;
- **tiers** - per tier: calls per day, number of customers on it, capacity per day;
- **rows** - one per customer (or per Partner for `Bifrost.Vendor.GetPartners`) with billing mode,
  state, messages and tier.

Invoice from the figures of a closed period (`previousMonth`): usage is reported daily, so the
current month keeps growing until it ends.
