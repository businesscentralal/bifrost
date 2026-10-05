---
id: bifrost-lang-model-list
title: "Bifrost Language Models"
---

The **Bifrost Language Models** page lists the language models of this company. Each one connects the
chat to a provider and carries a skill, the instructions sent with every chat. Open one to change it on
the [language model card](/help/language-models/bifrost-lang-model-card/).

## Fields

| Field | Description |
| --- | --- |
| **Code** | The unique code of the language model. |
| **Description** | What the language model is for. |
| **Default** | Whether this is the model a routine uses when it does not name one. The chat does not use it. |
| **Chat Provider** | Who answers: Copilot, OpenAI, Azure OpenAI, Custom LLM, Anthropic, xAI (Grok) or Google (Gemini). |
| **Has Skill** | Whether a skill has been written for the model. |

## Actions

| Action | Description |
| --- | --- |
| **Init Copilot Defaults** | Registers **Bifrost Copilot** on **Copilot & AI Capabilities**, billed by Microsoft, creates a language model called `COPILOT` if there is none, and fills it with the default skill. Asks first. |

## Common tasks

- **Create a language model:** choose **New**, enter a code, a description and a provider, then write the
  skill or use **Import Defaults** on the card.
- **Start with Copilot:** choose **Init Copilot Defaults**, and check that **Bifrost Copilot** is active on
  **Copilot & AI Capabilities**.
- **Assign a model to a user:** on the user's [Bifröst user setup](/help/foundation/bifrost-user-setup-editor/),
  choose it in **Language Model Code**.

## See also

- [Bifrost Language Model](/help/language-models/bifrost-lang-model-card/): one language model, its key and skill
- [Chat via Bifrost](/help/language-models/bifrost-chat/): using the chat
