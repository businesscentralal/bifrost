---
id: license-types
title: "License types"
sidebar_position: 2
description: "Prepaid and Subscription licensing, the trial, the two message pools, grace, blocking and monthly quotas, and how sandboxes and on-premises installations are licensed."
---

## What is counted

A call counts as **one message** when both of the following are true:

- the message type is chargeable - `Help.*` and `Webhook.*` types are always free and never blocked by quota;
- the call succeeded - a JSON response whose `status` is not `Success` is not counted (a non-JSON
  response such as a PDF or a CSV file counts as successful).

Every chargeable call costs exactly one message, whatever the message type.

### Two pools

Messages are counted in two pools, according to who made the call:

| Pool | Consumed by |
|---|---|
| **User** | Calls made under a normal user - interactive or web service. |
| **App Registration** | Calls made by a Microsoft Entra application (service principal). |

## Before the first call

Every company must approve the **End-User License Agreement (EULA)** in the
[Setup Wizard](/help/foundation/bifrost-setup-wizard/) before Bifröst processes any call for it.
Until then every call - including `Help.*` - is answered with an `EULA_REQUIRED` error that points
to the wizard. An administrator can withdraw the approval with **Revoke EULA Approval** on the
Bifröst Setup page; calls are then refused again until the wizard is completed.

Outbound HTTP must also be allowed for Bifröst Foundation (the wizard does this): the licence
checks talk to the licensing service.

## Prepaid

Prepaid is the license type of every new installation and of every tenant that is not the Customer
of a Partner.

- **Trial.** A trial of **1,000 User + 1,000 App Registration messages** is activated once per
  Microsoft Entra tenant, when the Setup Wizard finishes in a SaaS production environment (or from
  the *Activate your trial* notification). Until it is activated, chargeable calls are answered with
  a *trial has not been started* error.
- **Purchased quota.** After the trial you buy more messages per pool from Origo. Bifröst Setup
  shows a notification when either pool drops below 1,000 messages.
- **Grace.** When a pool reaches zero, a grace of **100 messages** still runs; the responses carry a
  warning. When the grace is used up, the pool is exhausted.
- **Blocking.** An exhausted pool refuses calls with the quota-exhausted error - unless the
  licensing agreement for the tenant says the pool should keep running, in which case calls
  continue, are still counted, and keep returning the warning. The effective setting is reported as
  `blockOnMissingQuota` in the licence status.
- **Rate limit.** Always the Free tier, 1,000 calls per day. See [Rate limits](./rate-limits.md).

## Subscription

A tenant is on Subscription while it is the **Customer of a Bifröst Partner** - from the moment it
accepts the Partner's invitation until the relationship ends. The license type is per tenant: every
company of the tenant is on Subscription, including companies that start using Bifröst later.

- **Invoicing.** The Partner invoices the Customer for the messages it used each month. There is no
  purchased quota: the pools are counted, not limited. The [monthly quotas](#monthly-quotas) are the
  Customer's way to cap its bill.
- **Rate limit.** The Free tier by default; the Customer can choose a higher tier in production.
  See [Rate limits](./rate-limits.md).

When the Partner relationship ends - the Partner cancels the Customer, the Vendor cancels the
Partner, or the Partner confirms the Customer's leave request - the tenant returns to **Prepaid**
and its rate limit returns to the Free tier. See [Leaving and cancelling](./leaving-and-cancelling.md).

## Monthly quotas

Both license types can cap their own monthly usage:

- **Company Monthly Message Quota** on the Bifröst Setup page - all chargeable messages of the company
  in the calendar month;
- **Monthly Msg Quota** on each user's Bifröst User Setup - that user's chargeable messages in the
  calendar month.

`0` (the default) means no limit. When a quota is reached, calls are refused with a
monthly-quota-exhausted error until the next calendar month; the response names which quota (`user`
or `company`) stopped the call. The user quota is checked before the company quota, and both before
a Prepaid tenant's purchased pools. When a monthly quota has 100 or fewer messages left, successful
responses carry a warning. Monthly quotas are not enforced in a sandbox.

### How the monthly quotas are counted {#how-monthly-quotas-are-counted}

Business Central counts the monthly quotas itself, from the **Bifrost Messages** of the company: the
chargeable messages of the current calendar month that are still marked as chargeable there. Two
things lower that count, so the quotas cap less than a full month in practice:

- **The daily usage sync.** Once a day's messages have been reported to the licensing service they
  are no longer marked as chargeable, and no longer count towards the monthly quotas. In effect the
  quotas limit the messages since the last successful sync - usually the current day. What you are
  invoiced for is the reported usage, which is not affected.
- **Retention.** A retention policy on **Bifrost Messages** that deletes messages from the current
  month removes them from the count. Keep at least 31 days of Bifrost Messages if you use the monthly
  quotas.

## Sandbox environments

In a Business Central online **sandbox**:

- Bifröst does not block on quota: pools and monthly quotas are not enforced, and no trial is needed.
- Usage is still recorded and reported, separately from production.
- The rate limit is always the Free tier, 1,000 calls per day, whatever the production tenant has chosen.

For unlimited testing against your own sandbox, run the local MCP server from
[businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

## On-premises installations

On-premises installations are **Prepaid only**. There is no trial; Origo supplies the connection to
the licensing service together with the on-premises licence, and the purchased quota works as
described under [Prepaid](#prepaid).

## Checking the licence

- The **License** fact box on the Bifröst Setup page shows the license type, the remaining quota and
  validity of each pool, the messages not yet reported, and the date of the last sync. See
  [License fact box](/help/foundation/license-fact-box/).
- `Help.Bifrost.Get` returns the same status as `licenseStatus`, and
  [`Bifrost.Subscription.GetStatus`](/foundation/reference/message-types/bifrost-subscription-getstatus/)
  returns the tenant's configuration and current-month usage.
- The error and warning shapes callers see are in the [Licensing reference](/foundation/reference/licensing/).
