---
id: language-models-setup
title: "Bifrost Language Models Setup"
---

**Bifrost Language Models Setup** is the setup page of Bifrost Language Models. Open it from the **Apps**
group on **Bifrost Setup**. It shows at a glance whether the three things the chat needs are in place:
language models, the tools the assistant can call, and the API keys.

The page only shows status. Each value is maintained on the page it links to.

## Language Models

A language model connects the chat to a provider (Copilot, OpenAI, Azure OpenAI, a custom LLM, Anthropic,
xAI or Google Gemini) and carries the skill: the instructions sent with every chat.

| Field | Description |
| --- | --- |
| **Language Models** | How many language models are set up in this company. Choose the number to open the [language model list](/help/language-models/bifrost-lang-model-list/). |
| **Default Language Model** | The model a routine uses when it asks for an answer without naming a model, and the person who runs it has no model on their Bifröst user setup. Shows `(none)` when no model is the default. The chat does not use it: each person chats with the model on their own user setup. |

## MCP Tool Server

The chat offers Bifröst's operations to the language model as tools (Model Context Protocol), so the model
can read and change Business Central data for you, with your own permissions.

| Field | Description |
| --- | --- |
| **Available Tools** | How many tools the chat can call in this company. |

## API Keys

Every provider API key is kept in Bifröst's secret store, not on this app's pages. Each language model has
a shared key for the whole company and a personal key for each user.

| Field | Description |
| --- | --- |
| **Language Models Without a Key** | How many language models need an API key but have neither a shared key nor a personal key of yours. Choose the number to open the language model list. Shown in red while it is above zero. |
| **Note** | Shown only while keys are missing: keys cannot be moved from another extension, so each key is entered once on the language model. |

## Actions

| Action | Description |
| --- | --- |
| **Language Models** | Opens the [language model list](/help/language-models/bifrost-lang-model-list/). |
| **API Keys** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/) filtered to Bifrost Language Models: every key of every language model and whether a value has been entered. The value itself is never shown. |
| **Setup Wizard** | Opens the [Bifrost setup wizard](/help/foundation/bifrost-setup-wizard/), which allows every Bifröst app to reach the internet and walks through the credentials of every app. |

## Reaching the providers

OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI and Google Gemini are reached over the internet, so the
app must be allowed to make HTTP requests. Copilot does not need it. The Bifrost setup wizard allows it
for every installed Bifröst app at once. Until then, **Bifrost Setup** shows a notification with the
action **Start setup wizard**, and a chat with one of those providers fails with a message that HTTP
requests are not allowed for the extension.

## Getting started

1. On **Bifrost Setup**, choose **Setup Wizard** if you have not run it since installing the app.
2. Open **Bifrost Language Models Setup** and choose **Language Models**. Create a language model with a
   chat provider and a skill, or choose **Init Copilot Defaults** for a ready Copilot model.
3. On the model card, enter the shared API key, or let each user enter a personal key.
4. Give each person who may chat the `BIFROST Chat ori` and `BIFROST LLM Rd ori` permission sets, and
   `BIFROST LLM Chat ori` for any provider other than Copilot.
5. On each person's [Bifröst user setup](/help/foundation/bifrost-user-setup-editor/), choose the
   **Language Model Code** they chat with.
6. Open a customer, item or sales document and ask a question in **Chat via Bifrost**.
