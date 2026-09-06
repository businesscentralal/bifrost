---
id: index
title: "Bifröst Bragi"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type."
---

Bifröst Bragi is the chat module of the Bifröst platform. It builds on Bifröst Foundation and adds a conversational assistant to Business Central: a chat FactBox on standard pages, language models that hold the provider configuration, an MCP tool server that lets the assistant read and act on Business Central data under the signed-in user's own permissions, and the `LLM.Prompt.Complete` message type for one-shot completions in playbooks and scheduled tasks.

## What it does

- **Bifrost Chat** — a control add-in and FactBox on 36 standard pages, plus a focused full-page chat. The chat knows which record you are looking at.
- **Language models** — records that hold the provider configuration, the model settings and the skill text injected into every interactive conversation.
- **Seven chat providers** — Copilot, OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI (Grok) and Google (Gemini).
- **MCP tool server** — the assistant reads and updates Business Central data with the signed-in user's own permissions, so it can answer with live figures.
- **`LLM.Prompt.Complete`** — a one-shot completion with no tools, no bootstrap and no conversation state, meant as the general-purpose compute step for playbooks and scheduled tasks.
- **File input** — a completion can carry an inline base64 file, or a reference to an Incoming Document Attachment or Document Attachment record that Bragi reads and converts, for providers that accept documents and images.
- **Per-user or shared API keys** — each user can set a personal key from the chat control, or an administrator holding the separate service-key permission set can set one shared key per language model. Copilot needs no key.
- **Layered permissions** — the chat gate that lets a user actually chat is a separate permission set, assigned explicitly on top of the read or full Bragi set.

## How it works

1. Assign `BIFROST Bragi ori` (or `BIFROST Bragi Rd ori`) plus `BIFROST Chat ori` to the users who may chat.
2. Open **Bifrost Setup**, choose **Bifrost Language Models**, create a language model, pick a provider, fill in the model settings and write the skill text.
3. Set an API key: a personal key from the chat control, or a shared key set by a user holding `BIFROST ChatSvc ori`. Copilot uses Microsoft-managed resources instead and must be enabled in **Copilot & AI Capabilities**.
4. Mark one language model as **Default**, or assign a specific one per user on the User Setup Editor in the **Language Model Code** field.
5. Open a customer, item or sales document and ask the assistant a question in the **Bifrost Chat** FactBox.

## Message types

| Message type | Direction | Purpose |
| --- | --- | --- |
| `LLM.Prompt.Complete` | Outbound | One-shot language model completion — send a system prompt and a user prompt, get text back. |

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later.
- Bifröst Foundation 28.0.0.0, installed beside Bragi.
- A configured language model. Every external provider needs an API key — a personal key per user or one shared service key. Copilot needs no key but must be enabled in **Copilot & AI Capabilities**.
- HTTP client requests allowed for the extension when an external provider is used.
- The `BIFROST Chat ori` permission set, assigned per user; it is not bundled into the other Bragi permission sets.

## Where to go next

- [In-product help](/help/bragi/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [Chat message types](./message-types)
- [Extending Bragi with a chat provider](./extensibility)
- [Build on Bifröst](/extensibility/)
