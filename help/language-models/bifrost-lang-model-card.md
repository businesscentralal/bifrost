---
id: bifrost-lang-model-card
title: "Bifrost Language Model"
---

The **Bifrost Language Model** card sets up one language model: the provider the chat talks to, the
model and its limits, the API key, and the skill, the instructions sent with every chat. People chat with
the model chosen on their Bifröst user setup.

## General

| Field | Description |
| --- | --- |
| **Code** | A unique code for the language model, for example `SALES` or `FINANCE`. It is what you choose in **Language Model Code** on a user's Bifröst user setup. |
| **Description** | What the language model is for. |
| **Default** | The model a routine uses when it asks for an answer without naming a model, and the person who runs it has no model on their user setup. Only one language model can be the default. The chat does not use it. |
| **Chat Provider** | Who answers: **Copilot**, **OpenAI**, **Azure OpenAI**, **Custom LLM** (a model you host, with an OpenAI-compatible interface), **Anthropic**, **xAI (Grok)** or **Google (Gemini)**. With **None** the model cannot answer. When you choose a provider, the empty fields below are filled with its defaults. |

## Provider Configuration

Copilot runs on resources Microsoft manages, so these fields are not used for it.

| Field | Description |
| --- | --- |
| **Base URL** | The address of the provider's API. Filled in for providers with a fixed address; for Azure OpenAI and Custom LLM, enter your own. |
| **Timeout Seconds** | How long to wait for an answer, in seconds. `0` uses the provider's default. |
| **Max Tokens** | The longest answer the model may give, in tokens. `0` uses the provider's default. |
| **Context Tokens** | How much conversation the model can take in at once, its context window, in tokens. Bifröst uses it to decide how much of the earlier conversation it sends with each question; the current question is always sent. Blank (`0`) uses the provider's default: 32,000 tokens for Custom LLM, 128,000 for OpenAI, Azure OpenAI, xAI and Google Gemini, and 200,000 for Anthropic. Set it to the model's context window when you use a model with a smaller or larger window than that, for example a model you run yourself. |
| **Chat Path** | The path of the chat endpoint, for providers that need one (Azure OpenAI and Custom LLM). Leave it empty for `/v1/chat/completions`. |
| **Models Path** | The path that lists the provider's models, for providers that need one. Leave it empty for `/v1/models`. |
| **Model** | The provider's model to use. Leave it empty for the provider's default. For providers that can list their models, the lookup opens **Available Models**, the models the provider offers; choose one to fill in the field. |

The Base URL, Chat Path and Models Path decide where requests, and the API key, are sent. They can be
changed only here, on the card, or by someone working in Business Central. An AI agent working through
Bifröst cannot change them.

## Authentication

Shown for providers that need an API key, that is every provider except Copilot. The key is never a field
on this page: it is kept in Bifröst's secret store, and the card shows only whether a value has been
entered.

| Field | Description |
| --- | --- |
| **Personal Key Stored** | Whether you have a personal key for this model. A personal key takes priority over the shared key. It applies only to you, in this company. |
| **Shared Key Stored** | Whether a shared key is stored for the whole company. Everyone without a personal key uses it. |
| **Note** | Shown only while no key is stored. Keys cannot be moved from another extension, so each key is entered once. |

You can also see and enter both keys of every language model on [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/).

## Skill

The skill, written in Markdown in the editor at the bottom of the card, is sent to the model with every
chat when this language model is used. Use it to say what the assistant is for and how it should answer.
It comes on top of what Bifröst always tells the model, and each user can add their own instructions in
the system prompt of their [Bifröst user setup](/help/foundation/bifrost-user-setup-editor/).

## Actions

| Action | Description |
| --- | --- |
| **Import Defaults** | Fills the skill with the provider's default skill, after asking before it overwrites a skill you have. Available for providers that have one. |
| **Test Connection** | Calls the provider with the key that applies to you and tells you whether the model answers. |
| **Try It** | Opens a chat with this language model, so you can check it before you assign it to anyone. |
| **Get API Key** | Opens the provider's page where you get an API key. |
| **Set Personal API Key** | Enter your own key for this model, in a masked dialog. |
| **Clear Personal API Key** | Removes your own key. The shared key, if there is one, applies again. |
| **Set Shared API Key** | Enter the key for the whole company. Requires the `BIFROST ChatSvc ori` permission set. |
| **Clear Shared API Key** | Removes the company's key; everyone without a personal key loses access. Requires the `BIFROST ChatSvc ori` permission set. |

Renaming a language model keeps its keys. Deleting it removes both of its keys.

## Common tasks

- **Set up a model you host yourself:** choose **Custom LLM**, enter its **Base URL**, **Chat Path** and
  **Model**, set **Context Tokens** to the model's context window, enter the key, then **Test Connection**.
- **Give a team its own assistant:** create a model with a skill for that team's work, then choose it in
  **Language Model Code** on each team member's Bifröst user setup.

## See also

- [Bifrost Language Models](/help/language-models/bifrost-lang-model-list/): all language models
- [Chat via Bifrost](/help/language-models/bifrost-chat/): using the chat
