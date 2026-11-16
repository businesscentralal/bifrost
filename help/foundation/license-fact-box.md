---
id: license-fact-box
title: "License"
---

The **License** fact box on [Bifrost Setup](/help/foundation/bifrost-setup/) shows information for the
current tenant and company to users with license administration permission (`BIFROST LicAdm ori`).
Which fields appear depends on how Foundation is installed. **License Type** and the End-User
License Agreement appear in both cases.

## DEV-published and on-premises installations

A DEV extension in a Business Central online sandbox uses the same license display as an on-premises
installation.

| Field | Description |
| --- | --- |
| **License Type** | **Trial** or **Subscription**. Trial on this field is the Prepaid license. See [License types](/licensing/license-types/). |
| **Licence State** | Not activated, trial, licensed, grace period, expired or mocked. |
| **Confirmed Until** | When the last successful license check stays valid. After that, the grace period starts. |
| **Grace Until** | When the license expires if another license check does not succeed. |
| **Bifrost Users** | The Bifrost User Setup count and, when available, the number of users the license allows. |
| **Last Licence Check Error** | The reason code of the last license check that did not succeed. |

The tenant hash, monthly usage, unreported messages and last usage sync are hidden. The **Connection
Status** and **License Usage** actions on Bifrost Setup are hidden too. **Sync** remains available to
refresh the license.

## SaaS installations from AppSource

The license-state fields above are hidden. An installation from AppSource keeps the tenant hash,
**This Month** and **Last Month** usage groups, **Unreported Messages**, and **Last Synced**. The
User and App Registration rows always appear in each monthly group; Internal, Demo and Support appear
only for nonzero usage. If the licensing service cannot be reached, monthly values show **Unknown**.
Choosing a usage figure opens the usage entries filtered to the company, month and charge type.

**User Licenses** and **App Registration Licenses** appear for Trial and are hidden for Subscription.
**Connection Status** and **License Usage** remain available to license administrators. A negative
remaining value means the pool is using its grace of 100 messages. On Subscription the pools are
counted but not limited; your Partner invoices the usage. Choose **Sync** to report pending usage and
refresh the values.

## End-User License Agreement

Both installations show whether the agreement is approved, who approved it and when. An older approval
that did not record the approver says **approver not recorded**. An exempt evaluation company shows
that approval is not required.

An on-premises installation, and a DEV extension in a Business Central online sandbox, use the first
display. Foundation installed from AppSource on Business Central online uses the second display. A DEV
extension published into an online production environment uses that AppSource display too.
