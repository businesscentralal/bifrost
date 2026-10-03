---
id: rate-limit-configuration
title: "Configure Rate Limit"
---

The **Configure Rate Limit** dialog chooses the rate-limit tier of your tenant: how many messages per
24 hours your **sandbox** environments can send through the public Bifröst MCP server. Production usage
is never rate-limited, and Bifröst itself has no message limit. It opens from **Configure Rate Limit**
on the [Bifrost Setup](/help/foundation/bifrost-setup/) page, which is shown only to a Customer of a
Bifröst Partner (Subscription license) in a production environment. The tier is chosen in production and
applies to the tenant's sandbox usage.

| Field | Description |
| --- | --- |
| **Current tier** | The tier configured for your tenant now. |
| **Current limit/day** | The sandbox messages per 24 hours that tier allows. |
| **New tier** | The tier to apply: **Free** (1,000), **Silver** (5,000), **Gold** (10,000), **Platinum** (50,000) or **Enterprise** (100,000 messages per 24 hours). |

Choose **OK** to save. Your Partner prices the tiers above Free - check your Partner for rate-limit
pricing first. Choosing **Free** removes the custom tier.

The tier returns to Free automatically if the Partner relationship ends. For unlimited sandbox usage,
use the Local MCP server instead of the public one. See [Rate limits](/licensing/rate-limits/).
