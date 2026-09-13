---
id: index
title: "Bifröst Language Models"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type."
---

Bifröst Language Models er the chat module of the Bifröst platform. It builds on Bifröst Foundation og adds a conversational assistant to Business Central: a chat FactBox on standard pages, language models that hold the provider configuration, an MCP tool server that lets the assistant read og act on Business Central data under the signed-in notandi's own permissions, og the `LLM.Prompt.Complete` message tegund fyrir one-shot completions in playbooks og scheduled verkþættir.

## What it does

- **Bifrost Chat** — a control add-in og FactBox on 36 standard pages, plus a focused full-page chat. The chat knows which færsla you eru looking at.
- **Language models** — færslur that hold the provider configuration, the model settings og the skill text injected í every interactive conversation.
- **Seven chat providers** — Copilot, OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI (Grok) og Google (Gemini).
- **MCP tool server** — the assistant reads og updagsetnings Business Central data með the signed-in notandi's own permissions, so it getur answer með live figures.
- **`LLM.Prompt.Complete`** — a one-shot completion með no tools, no bootstrap og no conversation state, meant as the general-purpose compute step fyrir playbooks og scheduled verkþættir.
- **File input** — a completion getur carry an inlína base64 skrá, eða a reference to an Incoming Document Attachment eða Document Attachment færsla that Bragi reads og converts, fyrir providers that accept skjöl og images.
- **Per-notandi eða shared API keys** — hver notandi getur set a personal key úr the chat control, eða an administrator holding the separate service-key permission set getur set one shared key per language model. Copilot needs no key.
- **Layered permissions** — the chat gate that lets a notandi actually chat er a separate permission set, assigned explicitly on top of the read eða full Bragi set.

## How it works

1. Assign `BIFROST Bragi ori` (or `BIFROST Bragi Rd ori`) plus `BIFROST Chat ori` to the notendur who may chat.
2. Open **Bifrost Stilltuup**, choose **Bifrost Language Models**, create a language model, pick a provider, fill in the model settings og write the skill text.
3. Stilltu an API key: a personal key úr the chat control, eða a shared key set by a notandi holding `BIFROST ChatSvc ori`. Copilot uses Microsoft-managed resources instead og verður að vera enabled in **Copilot & AI Capabilities**.
4. Mark one language model as **Default**, eða assign a specific one per notandi on the Notaður Stilltuup Editor in the **Language Model Code** field.
5. Open a viðskiptavinur, vara eða sales skjal og ask the assistant a question in the **Bifrost Chat** FactBox.

## Skilaboð tegunds

| Skilaboð tegund | Direction | Purpose |
| --- | --- | --- |
| `LLM.Prompt.Complete` | Út á við | One-shot language model completion — send a system prompt og a notandi prompt, get text back. |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 eða later.
- Bifröst Foundation 28.0.0.0, installed beside Bragi.
- A stillt language model. Every external provider needs an API key — a personal key per notandi eða one shared service key. Copilot needs no key but verður að vera enabled in **Copilot & AI Capabilities**.
- HTTP client requests allowed fyrir the extension þegar an external provider er used.
- The `BIFROST Chat ori` permission set, assigned per notandi; it er not bundled í the other Bragi permission sets.

## Where to go next

- [In-product help](/help/language-models/)
- [Skilaboð tegund reference](./reference/message-types/) — the request og response samningur fyrir every tegund, generated úr the app itself
- [Chat message tegunds](./message-types)
- [Extending Bragi með a chat provider](./extensibility)
- [Build on Bifröst](/extensibility/)
