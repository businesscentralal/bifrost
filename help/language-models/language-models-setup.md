---
id: language-models-setup
title: "Bifröst Language Models Setup"
sidebar_label: "Language Models Setup"
sidebar_position: 5
---

**Bifröst Language Models Setup** is the single setup page of the chat module. It is opened from the **Apps** group on the Bifröst **Setup** page and shows, at a glance, whether the three things Language Models needs are in place: language models, the MCP tool server, and the provider API keys.

The page is read-only — every value on it is maintained somewhere the page links to.

## Language Models

A language model connects Bifröst Chat to a provider — Copilot, OpenAI, Azure OpenAI, a custom LLM, Anthropic, xAI or Google Gemini — and carries the skill content injected into every chat.

| Field | Description |
| --- | --- |
| **Language Models** | How many language models are set up in this company. Drill down to open the [language model list](/help/language-models/bifrost-lang-model-list/). |
| **Default Language Model** | The model used by everyone who has no model assigned in Bifröst user setup. Shows `(none)` when no model is marked as default. |

## MCP Tool Server

Bifröst Chat exposes the Bifröst message types to the language model as Model Context Protocol tools, so the model can read and write Business Central data on the user's behalf, with that user's own permissions.

| Field | Description |
| --- | --- |
| **Available Tools** | How many Model Context Protocol tools the chat can call in this company. |

## API Keys

Bifrost Language Models keeps every provider API key in the Bifröst secret store rather than in its own tables. Each language model has a **shared** key for the whole company and a **personal** key per user.

| Field | Description |
| --- | --- |
| **Language Models Without a Key** | How many language models need an API key but have neither a shared key nor a personal key stored for you. Drill down to open the language model list. Shown in red while the count is above zero. |
| **Note** | Appears only while keys are missing, explaining that the values must be entered once. |

Business Central keeps stored secrets separate per extension, so keys entered in an earlier version of the app cannot be carried over. Open a language model and use **Set Personal API Key** or **Set Shared API Key** on the [language model card](/help/language-models/bifrost-lang-model-card/) to enter each key once. Setting or clearing the shared key requires the `BIFROST ChatSvc ori` permission set.

## Actions

| Action | Description |
| --- | --- |
| **Language Models** | Opens the [language model list](/help/language-models/bifrost-lang-model-list/). |
| **API Keys** | Opens the Bifröst App Secrets list filtered to Bifrost Language Models, showing every key this module has registered and whether a value has been entered. The value itself is never shown. |

## Outbound HTTP

OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI and Google Gemini are reached over HTTP, so the extension needs outbound HTTP client requests for them. Copilot does not need it. The Bifröst setup wizard turns outbound HTTP on for every installed Bifröst app at once. Until it is on, the **Bifröst Setup** page shows a notification with the action **Start setup wizard**, and a chat with one of those providers fails with an error saying that HTTP client requests are not enabled for the extension.

## Getting started

1.  Assign the `BIFROST Chat ori` permission set to every user who is allowed to use the chat.
2.  Open **Bifröst Setup**. If it shows the HTTP notification, choose **Start setup wizard** and complete the wizard first. Then choose **Bifrost Language Models Setup** in the **Apps** group.
3.  Choose **Language Models** and create a model with a chat provider and a skill.
4.  On the model card, set the shared or personal API key.
5.  Mark one language model as **Default**, or assign a model per user in Bifröst user setup.
6.  Open a customer, item or sales document and ask the assistant a question in the **Bifrost Chat** FactBox.
