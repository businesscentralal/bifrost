---
id: license-fact-box
title: "License"
sidebar_label: "License fact box"
sidebar_position: 41
---

The **License** fact box on the [Bifrost Setup](/help/foundation/bifrost-setup/) page shows the licence
status of the current tenant and company. It is shown to users with licence administration permission
(the `BIFROST LicAdm ori` permission set), outside sandbox environments.

| Field | Description |
| --- | --- |
| **License type** | **Prepaid** or **Subscription**. A tenant is on Subscription while it is the Customer of a Bifröst Partner. See [License types](/foundation/licensing/license-types/). |
| **Tenant Id Hash** | The one-way hash of your Microsoft Entra tenant ID that identifies your tenant to the licensing service. |
| **User Licenses** | The remaining messages in the User pool and whether User calls are currently allowed (**Valid**). |
| **App Registration Licenses** | The remaining messages in the App Registration pool and whether calls from Microsoft Entra applications are currently allowed. |
| **Usage** | Chargeable messages processed but not yet reported to the licensing service. |
| **Last Synced** | The date of the last successful usage sync. |

A negative remaining value means the pool is using its grace of 100 messages. On Subscription the
pools are counted but not limited - your Partner invoices the usage.

Choose **Sync** on Bifröst Setup to report pending usage and refresh the values now.
