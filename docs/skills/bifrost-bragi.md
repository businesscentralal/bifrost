---
id: bifrost-bragi
title: "Bragi message types"
sidebar_label: "Bragi message types"
sidebar_position: 7
description: "Message types added to the Bifröst API by Bifrost Bragi. AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index…"
---

AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type.

---

## When to load this skill

Load it together with the core skill when:

- a step needs a language model completion inside a playbook, a scheduled task or an integration — that is `LLM.Prompt.Complete`;
- you are configuring chat providers or language models for Business Central.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- `LLM.Prompt.Complete` is a one-shot completion: no tools, no bootstrap, no conversation state. If the task needs tools or memory, it belongs in the interactive chat, not in a message type.
- API keys are held per user or per language model inside Business Central. Never put a provider key in a message payload.
- The model provider is configured in Business Central, not chosen by the caller. Do not hard-code a provider name in integration code.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../bragi/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `LLM.*` (1)

| Message type | Page |
| --- | --- |
| `LLM.Prompt.Complete` | `message-types/llm-prompt-complete/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-foundation](./bifrost-foundation.md) — Bifrost Foundation
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Hnitbjorg
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Clockify
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-bragi/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Bragi. AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Bragi adds — 1 message type across 1 family (LLM.*).

</details>
