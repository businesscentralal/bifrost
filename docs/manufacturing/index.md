---
id: index
title: "Bifröst Manufacturing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Production orders, production BOMs, routings, the production journal and corrections in Business Central, from an assistant or integration."
---

# Bifröst Manufacturing

**Run production in Business Central without clicking through every order.** Bifröst Manufacturing lets
an integration, a scheduled routine or an assistant do the work that sits behind the actions of
Microsoft's manufacturing pages: create and refresh production orders, certify production BOMs and
routings, post output and consumption, finish orders and correct what was posted.

It runs Business Central's own manufacturing logic. The results appear in the standard pages, such as
**Production Orders**, **Production BOMs** and **Routings**, so you review them where you always do.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Create and refresh production orders.** Create an order for an item, or create orders from the
  demand of a released sales order, one per sales line or one for the whole sales order. Refresh an
  order to calculate its lines, components and routing.
- **Certify bills of material and routings.** Move a production BOM or a routing version to
  Certified, Under Development or Closed. The answer explains in your language why a version cannot
  be certified.
- **Copy and exchange.** Copy a production BOM or a routing into a new version, and exchange one
  component for another across production BOMs, with new versions created for you.
- **Find where an item is used.** See every production BOM that uses an item, with levels and
  required quantities for a date.
- **See what is missing.** Check component availability and the cost and quantity statistics of a
  production order before you release it.
- **Move an order through its statuses.** Change the status, check whether an order can be finished,
  finish it, or reopen a finished order once.
- **Post output and consumption.** Look at the production journal an order would produce, preview
  the posting without keeping anything, and post it.
- **Correct a posting.** Reverse a posted output or consumption entry as a whole.

Schedule the routine steps from your own automation and deal only with the exceptions.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Manufacturing** | Production orders and their statuses, production BOMs and routings with their versions, where-used, component availability and statistics, the production journal, and corrections of posted output and consumption |

## Get it

Install **Bifrost Manufacturing** next to Bifröst Foundation, from AppSource or through your
Business Central partner. It needs Business Central Premium, because manufacturing is part of
Premium. For the price, contact your Business Central partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Set up manufacturing in Business Central as you do today: items with a production BOM or routing, work and machine centers, and the production order number series. | Business Central administrator |
| 2 | Install **Bifrost Manufacturing** next to Bifröst Foundation. | Business Central administrator |
| 3 | Give each user or service that calls it the **Bifrost Manufacturing** (`BIFROST Mfg ori`) permission set, next to their Foundation permissions. Add **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`) only for those who may change the status of orders, finish them or post to the ledgers. | Business Central administrator |

The app has no pages of its own: its results appear in the standard manufacturing pages.

## Good to know

- **It acts as you.** The permission sets let a user run this app's operations only. They do not
  widen access to manufacturing data; the user's own permissions still apply.
- **Posting is a separate permission.** Changing the status of an order, finishing it, posting the
  production journal and reversing a posting need `BIFROST MfgPost ori` on top of the main permission
  set, so planning and posting can be given to different people.
- **Anything that posts asks for a count first.** The operation tells you how many records it
  would affect and does nothing until the count is confirmed.
- **Reopening is allowed once.** A finished order can be reopened once, and only when no output or
  valuation date blocks it.
- **If a step fails,** the work is rolled back and a clear error comes back, in English or
  Icelandic. Everything runs inside Business Central; no external service or credential is involved.

## Reference

The installed operations and their contracts are read from Business Central itself: the MCP
tools `list_domains`, `describe_domains` and `describe_message_type`, or the **Bifrost Message Types** page.

- Permission sets: **Bifrost Manufacturing** (`BIFROST Mfg ori`) and **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`), on top of the caller's Foundation permissions.
