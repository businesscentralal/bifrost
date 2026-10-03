---
id: rate-limits
title: "Rate limits"
sidebar_position: 3
description: "What the Bifröst rate limit applies to, the tiers, and how a Customer raises it."
---

This page is for administrators who connect AI agents to Business Central through the public Bifröst
MCP server. It explains which usage has a rate limit, how high it is, and how to raise it or avoid it.

## What is limited

A rate limit applies **only to sandbox usage on the public Bifröst MCP server**. By default, the
sandbox usage of a Microsoft Entra tenant there is limited to **1,000 messages per 24 hours** (the
**Free** tier).

What is not limited:

- **Production.** Production usage of the MCP server is never rate-limited.
- **Bifröst itself.** Bifröst has no message limit of its own. The rate limit is a limit of the public
  MCP server, not of the app.
- **The Local MCP server.** For unlimited sandbox usage, use the Local MCP server. The Bifrost Setup
  wizard links to it as **origo-bc-mcp (Local MCP server)**; it is published at
  [businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

The rate limit is separate from [message quotas](./license-types.md#monthly-quotas): a quota counts the messages a
tenant pays for, the rate limit only caps sandbox traffic through the public MCP server.

## Tiers

| Tier | Sandbox messages per 24 hours |
|---|---|
| **Free** | 1,000 |
| **Silver** | 5,000 |
| **Gold** | 10,000 |
| **Platinum** | 50,000 |
| **Enterprise** | 100,000 |

## Who gets which tier

| Tenant | Sandbox usage on the public MCP server | Production usage |
|---|---|---|
| Prepaid | Always **Free** (1,000 messages per 24 hours). The tier cannot be changed. | Not rate-limited |
| Subscription (a Customer of a Partner) | **Free** by default. The Customer can choose a higher tier; the Partner prices tiers above Free. | Not rate-limited |

## Raising the limit

A Customer on the Subscription license raises its sandbox limit by choosing a tier with
**Configure Rate Limit** on the Bifrost Setup page (see
[Configure Rate Limit](/help/foundation/rate-limit-configuration/)):

- The tier is chosen **from the Production environment**. It is refused in a sandbox, but it applies
  to the tenant's sandbox usage.
- It can be chosen only on the Subscription license, while the tenant is linked to a Partner.
- Check your Partner for rate-limit pricing before you choose a tier above Free.
- Choosing **Free** removes the custom tier.

When the Partner relationship ends and the tenant returns to Prepaid, its tier is reset to **Free**
automatically.

If you need more sandbox traffic without a tier, use the Local MCP server instead of the public one.
