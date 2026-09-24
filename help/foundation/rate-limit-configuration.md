---
id: rate-limit-configuration
title: "Configure Rate Limit"
sidebar_label: "Configure Rate Limit"
sidebar_position: 44
---

The **Configure Rate Limit** dialog chooses how many API calls per day the Bifröst MCP server allows
for your tenant. It opens from **Configure Rate Limit** on the [Bifrost Setup](/help/foundation/bifrost-setup/)
page, which is shown only to a Customer of a Bifröst Partner (Subscription license) in a production
environment.

| Field | Description |
| --- | --- |
| **Current tier** | The tier configured for your tenant now. |
| **Current limit/day** | The API calls per day that tier allows. |
| **New tier** | The tier to apply: **Free** (1,000), **Silver** (5,000), **Gold** (10,000), **Platinum** (50,000) or **Enterprise** (100,000 calls per day). |

Choose **OK** to save. Tiers above Free can be charged by your Partner - check the price with your
Partner first. Choosing **Free** removes the custom tier.

The tier returns to Free automatically if the Partner relationship ends. Sandbox environments always
use the Free tier. See [Rate limits](/foundation/licensing/rate-limits/).
