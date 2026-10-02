---
id: index
title: "Bifröst Foundation"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "The Bifröst app every other Bifröst app needs: it lets AI assistants and other systems work in Business Central, as you and within your permissions."
---

# Bifröst Foundation

**The app you always install.** Foundation lets AI assistants and other systems do real work in
Business Central: answer from live data, carry out tasks and run routines, as you and within your
permissions. It does not replace Business Central or the extensions you have; it makes their data
and business logic available to the AI you already use.

## What you can do with it

Foundation brings the standard Business Central
[capabilities](/documentation/how-it-works/#capabilities-and-message-types), for example:

- **Sales:** quotes, orders and invoices, from creating them to posting, and what a customer owes.
- **Purchasing:** purchase documents and vendors, and posting a purchase invoice.
- **Finance:** journals, posting, and bank reconciliation.
- **Inventory:** what you have, what you can promise, and item journals.
- **Projects and resources:** project journals, invoicing from a project, and resources.
- **Approvals, incoming documents and the change log:** approve or reject, register incoming
  invoices, see who changed what.
- **Reading data:** most tables in Business Central, within your permissions.

The installed message types and their contracts are read from Business Central itself: the MCP
tools `list_message_types` and `describe_message_type`, or the Bifrost Message Types page.

**Where it stops.** Foundation can read most of your data, but it can only carry out tasks that have
a message type. For banks, document exchange, storage, schedules and more, add an
[additional app](/apps/); see [What it covers](/documentation/how-it-works/#what-it-covers-and-how-it-grows).

## Get it and set it up

Install **Bifrost Foundation** from AppSource or through your Business Central partner. It needs
Business Central 28.0 or later, Essentials or Premium. Then follow [Set it up](/setup/): five steps,
each saying who is needed.

## Good to know

- **It acts as you.** An assistant can do at most what you can do in Business Central; see
  [Permissions](/documentation/end-customers/administrators/#permissions).
- **Every call is logged** in your own Business Central, on **Bifrost Messages**.
- **Your data:** [Where your data goes](/documentation/how-it-works/#where-your-data-goes) and
  [Privacy](/licensing/privacy/).
- **Price and licensing:** [Price](/price/) and [Licensing](/licensing/).
- **A page in Business Central:** each Foundation page has its own help page.

## For developers and partners

- [API reference](./reference/api/): endpoints, the message envelope and response shapes
- [Errors](./reference/errors/), [Events and webhooks](./reference/events-and-webhooks/),
  [Field access](./reference/field-access-restrictions/), [Secrets](./reference/secrets/)
- [Setup reference](./reference/setup/): the Bifrost Setup page and the settings behind it
- [Build on Bifröst](/extensibility/)
