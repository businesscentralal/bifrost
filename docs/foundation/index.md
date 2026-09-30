---
id: index
title: "Bifröst Foundation"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "The Bifröst app every other Bifröst app needs: it lets AI assistants and other systems work in Business Central, as you and within your permissions."
---

**Bifröst Foundation is the app you always install.** It lets AI assistants and other systems do
real work in Business Central: answer questions from live data, carry out tasks and run routines,
as you and within your permissions. It already covers the standard Business Central areas; the
other Bifröst apps each add their own.

| You want to … | Go to |
|---|---|
| Understand what it does | [How Bifröst works](/documentation/how-it-works/) |
| Install it and get going | [Set it up](/setup/) |
| Try it first | [Try it out](/try-it-out/) |
| Know whether it is safe | [Where your data goes](/documentation/how-it-works/#where-your-data-goes) and [Privacy](/foundation/privacy/) |
| Know what it costs | [Cost](/cost/), and [Licensing](/foundation/licensing/) for how usage is counted |
| Know who to involve | [Set it up](/setup/): who is needed for each step |
| Know what a Foundation page in Business Central is for | [Foundation help](/help/foundation/) |

## Technical overview

*The rest of this page is for developers and partners.*

Bifröst Foundation turns Business Central business logic into a callable, self-describing API. An external system posts a CloudEvents envelope to the Bifröst API (`origo/bifrost/v1.0`), Business Central runs the matching **message type** — `Customer.CreditLimit.Get`, `Sales.Document.Post`, `Data.Records.Set` — and the result comes back through the response API, synchronously or from a background session.

Everything else in the Bifröst family is a dependent app that adds its own message types to this catalogue. Foundation owns the transport, the queue, the licensing, the secret store, the request log, the language switching and the discovery; the dependent app writes business logic and a help document.

## What it does

- **One API for every operation** — three endpoints (queue, task, response) carry every message type, so a caller learns the transport once.
- **Standard ERP message types out of the box** — data access, metadata, sales, purchase, finance, inventory, projects, resources, approvals, incoming documents, the change log, memory and user notifications.
- **Self-documenting** — `Help.MessageTypes.Get` returns the catalogue and `Help.Implementation.Get` returns one type's full request and response contract as Markdown, so an AI agent can discover and call a type it has never seen.
- **Extensible by design** — a dependent app adds an `enumextension` value and one codeunit implementing `Msg Interface ori`; nothing in Foundation changes.
- **Field-level security** — read and write access to individual fields can be restricted per user or per Entra application, on top of Business Central's own permissions.
- **Change log write guard** — `Data.Records.Set` can be restricted to fields that Business Central's change log actually covers, so every API write leaves an audit trail.
- **One secret store** — every app in the family registers its credentials with Foundation and reads them back with one call; values live in Isolated Storage and are masked out of the request log.
- **Events and webhooks** — external business events fire when a message completes or fails, so callers get told rather than having to poll.

## How it works

1. A caller posts a CloudEvents 1.0 envelope naming a message type to `.../tasks`.
2. Foundation validates the caller, resolves the type to its implementation codeunit and either runs it immediately or queues it for a background session.
3. The implementation does the work in Business Central and writes a JSON response.
4. The caller reads the result from the response endpoint, or receives a webhook when the message finishes.

## Where to go next

- [Set it up](/setup/) — from install to first call, and who is needed for each step
- [Licensing](./licensing/) — how usage is counted and licensed
- [Privacy](./privacy/) and [Terms of Use](./eula/)
- [Message type guides](./message-types/) — what each business area of the standard catalogue can do
- [API reference](./reference/api/) — endpoints, the envelope, authentication and response shapes
- [Setup reference](./reference/setup/) — the Bifrost Setup page and the implementation strategies behind it
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [In-product help](/help/foundation/) — one page per Business Central page in the app
- [Build on Bifröst](/extensibility/) — how to write a dependent app
- [Skills for AI agents](/skills/) — how an agent should drive the API

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Outgoing HTTP client requests enabled for the Bifröst apps (the setup wizard does this).
