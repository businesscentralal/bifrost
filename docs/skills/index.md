---
id: index
title: "Skills for AI agents"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Reference material for AI agents that drive Business Central through the Bifröst API and the Origo BC MCP server."
---

A **skill** here is a single document an AI agent loads before it writes code against
Bifröst. It carries the parts of the API that an agent cannot infer: the shape of the
message envelope, which message type does what, how field names are normalised, how
filters are written, and which mistakes look plausible but fail.

Each skill is published in two forms:

- **as pages** in this section, so a person can read and search it;
- **as one file**, so an agent can fetch the whole thing in a single request.

The file is the authoritative form. The pages are generated from it, so they cannot
drift.

## Available skills

| Skill | What it covers | Single file |
| --- | --- | --- |
| [Bifröst BC integration](./bifrost-bc-integration/) | The Bifröst API on Business Central: the three endpoints, the request envelope, response patterns, the full message-type catalogue, pagination, `tableView` filter syntax, field selection, enum handling, translations, webhooks and schema discovery. | [SKILL.md](pathname:///skills/bifrost-bc-integration/SKILL.md) |

## Finding this from an agent

The site publishes an [`llms.txt`](pathname:///llms.txt) at its root. It lists every
skill file and the main reference sections, with absolute URLs, so an agent that is
handed only the site address can find the rest without crawling.

## What an agent still needs

A skill describes the API, not your tenant. Before an agent can call anything it also
needs:

1. the base URL for the environment, including the company id;
2. an access token — Bifröst authenticates with OAuth 2.0 through Microsoft Entra ID;
3. the set of message types actually installed, which `Help.MessageTypes.Get` returns
   for the environment it is asked.

Every Bifröst app documents its own message types under its section — see
[Nornir](/nornir/), [Hnitbjörg](/hnitbjorg/), [Bragi](/bragi/) and
[Iceland DocEx](/iceland-docex/). Building an app of your own is covered under
[Extensibility](/extensibility/).
