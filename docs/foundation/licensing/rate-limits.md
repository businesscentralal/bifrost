---
id: rate-limits
title: "Rate limits"
sidebar_position: 3
description: "The Bifröst rate-limit tiers, where they are enforced, and who can choose a higher tier."
---

A rate limit caps how many API calls a tenant can make through the Bifröst MCP server per day. It
is separate from message quota: quota decides what a tenant pays for, the rate limit protects the
service.

The rate limit is **enforced by the MCP server**. Business Central stores the tenant's chosen tier;
calls made directly to the Bifröst API in Business Central are governed by the licence quota only.

## Tiers

| Tier | API calls per day |
|---|---|
| **Free** | 1,000 |
| **Silver** | 5,000 |
| **Gold** | 10,000 |
| **Platinum** | 50,000 |
| **Enterprise** | 100,000 |

## Who gets which tier

| Tenant | Tier |
|---|---|
| Prepaid | Always **Free**. The tier cannot be changed. |
| Subscription (a Customer of a Partner), production | **Free** by default. The Customer can choose any tier; the Partner can charge for tiers above Free. |
| Any sandbox environment | Always **Free**, even when the production tenant has chosen a higher tier. |

## Choosing a tier

A Customer on the Subscription license chooses its tier from **Configure Rate Limit** on the
Bifröst Setup page (production environments only - see
[Configure Rate Limit](/help/foundation/rate-limit-configuration/)). Check the price with your
Partner before you choose a tier above Free. Choosing **Free** removes the custom tier.

A tier can only be set while the tenant is linked to a Partner. When the Partner relationship ends
and the tenant returns to Prepaid, its tier is reset to **Free** automatically.

## What the Partner and the Vendor see

Partners and Vendors see each customer's tier, its calls per day and whether it is **above the Free
tier** on [Customer Management](/help/foundation/customer-management/), and per-tier totals in the
billing message types - see [Usage and billing](./usage-and-billing.md).
