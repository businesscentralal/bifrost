---
id: license-fact-box
title: "License"
---

The **License** fact box on [Bifrost Setup](/help/foundation/bifrost-setup/) shows information for the
current tenant and company to users with licence administration permission (`BIFROST LicAdm ori`).
The installation's licensing mode determines which fields appear. The licence type and End-User
License Agreement appear in both modes.

## DEV-published and on-premises installations

DEV-published Foundation in a SaaS sandbox uses the same licence display as on-premises installations.

| Field | Description |
| --- | --- |
| **License Type** | Trial or Subscription. |
| **Licence State** | Not activated, trial, licensed, grace period, expired or mocked. Mocked is used by the test app. |
| **Confirmed Until** | When the last successful licence check stops being valid. |
| **Grace Until** | When the licence expires if another licence check does not succeed. |
| **Bifrost Users** | The Bifrost User Setup count and, when available, the number of users allowed by the licence. |
| **Last Licence Check Error** | The reason code of the last unsuccessful licence check. |

The tenant hash, monthly usage, unreported messages and last usage sync are hidden. The **Connection
Status** and **License Usage** actions on Bifrost Setup are hidden too. **Sync** remains available to
refresh the licence.

## SaaS installations from AppSource

The licence-state fields above are hidden. SaaS keeps the tenant hash, **This Month** and **Last
Month** usage groups, **Unreported Messages**, and **Last Synced**. The User and App Registration
rows always appear in each monthly group; Internal, Demo and Support appear only for nonzero usage.
If the licensing service cannot be reached, monthly values show **Unknown**. Usage figures open the
usage entries filtered to the company, month and charge type.

The existing User Licenses and App Registration Licenses pool groups appear for Trial, and are
hidden for Subscription. **Connection Status** and **License Usage** remain available to licence
administrators. A negative remaining value means the pool is using its grace of 100 messages. On
Subscription the pools are counted but not limited; your Partner invoices the usage. Choose **Sync**
to report pending usage and refresh the values.

## End-User License Agreement

Both modes show whether the agreement is approved, who approved it and when. An older approval that
did not record the approver says **approver not recorded**. An exempt evaluation company shows that
approval is not required.

The mode follows the licensing runtime: on-premises and containers are non-SaaS; DEV publication in
a real SaaS sandbox is non-SaaS. PTE/Global publication on SaaS, and DEV publication in SaaS production,
keep the SaaS display. Application names do not determine the mode.
