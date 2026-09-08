---
id: index
title: "Skills for AI agents"
sidebar_label: "Overview"
sidebar_position: 1
description: "Reference material for AI agents that drive Business Central through the Bifröst API and the Origo BC MCP server."
---

A **skill** here is what an AI agent loads before it writes code against Bifröst. It
carries the parts of the API an agent cannot infer: the shape of the message envelope,
which message type does what, how field names are normalised, how filters are written,
and which mistakes look plausible but fail.

Each skill follows the standard layout — a short `SKILL.md` holding the model, the rules
and an index, and a `references/` folder the agent reads one file from at a time. An
agent that needs to post a sales invoice loads the core skill and one reference, not a
quarter of a million characters of catalogue.

The files under `/skills/` are the authoritative copy. The pages in this section are
generated from them by `tools/render-skills.mjs`, so they cannot drift.

## Available skills

| Skill | Shape | Single file |
| --- | --- | --- |
| [Bifröst BC integration](./bifrost-bc-integration/) | 25 reference files | [SKILL.md](pathname:///skills/bifrost-bc-integration/SKILL.md) |
| [Foundation message types](./bifrost-foundation) | index only | [SKILL.md](pathname:///skills/bifrost-foundation/SKILL.md) |
| [Iceland message types](./bifrost-iceland) | index only | [SKILL.md](pathname:///skills/bifrost-iceland/SKILL.md) |
| [Iceland Treasury message types](./bifrost-iceland-treasury) | index only | [SKILL.md](pathname:///skills/bifrost-iceland-treasury/SKILL.md) |
| [Iceland DocEx message types](./bifrost-iceland-docex) | index only | [SKILL.md](pathname:///skills/bifrost-iceland-docex/SKILL.md) |
| [Bragi message types](./bifrost-bragi) | index only | [SKILL.md](pathname:///skills/bifrost-bragi/SKILL.md) |
| [Hnitbjörg message types](./bifrost-hnitbjorg) | index only | [SKILL.md](pathname:///skills/bifrost-hnitbjorg/SKILL.md) |
| [Nornir message types](./bifrost-nornir) | index only | [SKILL.md](pathname:///skills/bifrost-nornir/SKILL.md) |
| [Clockify message types](./bifrost-clockify) | index only | [SKILL.md](pathname:///skills/bifrost-clockify/SKILL.md) |
| [Subscription Billing message types](./bifrost-subscription-billing) | index only | [SKILL.md](pathname:///skills/bifrost-subscription-billing/SKILL.md) |

Load the core skill first. An app skill on its own does not explain the API — it is the
index of what that app adds to the catalogue.

## Finding this from an agent

The site publishes an [`llms.txt`](pathname:///llms.txt) at its root. It lists every
skill file, every reference file and the main documentation sections, with absolute
URLs, so an agent handed only the site address can find the rest without crawling.

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
