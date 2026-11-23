---
id: license-fact-box
title: "License"
---

The **License** fact box on [Bifrost Setup](/help/foundation/bifrost-setup/) shows information for the
current tenant and company to users with license administration permission (`BIFROST LicAdm ori`).
Which fields appear depends on how Foundation is installed. **License Type**, **Setup Mode** and the
End-User License Agreement appear in every installation.

## Setup Mode

**Setup Mode** shows **Active until** and the latest end time when any of your approved session
sources is in setup mode in this company, or **Not active** when none is. The line is shown for a
DEV extension, an on-premises installation and an installation from AppSource. A user with
`BIFROST Full ori` or SUPER starts or ends it with **Start Setup Mode…** on
[Bifrost Setup](/help/foundation/bifrost-setup/).

## DEV-published and on-premises installations

A DEV extension in a Business Central online sandbox uses the same license display as an on-premises
installation.

| Field | Description |
| --- | --- |
| **License Type** | **Trial** or **Subscription**. See [License types](/licensing/license-types/). |
| **Licence State** | Not activated, trial, licensed, grace period, expired or mocked. |
| **Confirmed Until** | When the last successful license check stays valid. After that, the grace period starts. |
| **Grace Until** | When the license expires if another license check does not succeed. |
| **Bifrost Users** | The Bifrost User Setup count and, when available, the number of users the license allows. |
| **Last Licence Check Error** | The reason code of the last license check that did not succeed. |
| **Trial Ends** | The date the local trial ends: 90 days after it started, or earlier when the message limit is reached. |
| **Trial Messages** | The messages used out of the 1,000 that the local trial allows, for example **37 / 1,000**. |
| **Trial Limit Reached** | Which limit ended the local trial: the 1,000 messages, the 90 days, both, or a trial counter that cannot be read. |

The tenant hash, monthly usage, unreported messages and last usage sync are hidden. The **Connection
Status** and **License Usage** actions on Bifrost Setup are hidden too. **Sync** remains available to
refresh the license.

### The local trial

**Trial Ends**, **Trial Messages** and **Trial Limit Reached** appear only on these installations, and
only after a local trial has started. They are hidden on a SaaS installation from AppSource, on a
Subscription and when no trial has started. **Trial Limit Reached** appears only once the trial has
ended.

- **When the trial ends.** A local trial allows 1,000 messages or 90 days, whichever comes first.
  Both limits are shared by every company in the environment, so messages sent in any company count
  toward the same 1,000.
- **What you see at the limit.** **Trial Limit Reached** says **Message limit reached (1,000 messages)**,
  **Time limit reached (90 days)** or **Both limits reached (1,000 messages, 90 days)**, and the license
  state shows expired. If the trial counter cannot be read, **Trial Messages** and **Trial Ends** show
  **Unknown** and **Trial Limit Reached** says **Trial counter cannot be read**.
- **What to do next.** Register with a Partner for a Subscription. Licensing is a Trial first, then a
  Subscription once you link a Partner. See [License types](/licensing/license-types/).

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
