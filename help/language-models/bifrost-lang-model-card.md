---
id: bifrost-lang-model-card
title: "Bifrost Language Model Card"
sidebar_label: "Language Model Card"
sidebar_position: 3
---

The **Bifrost Language Model Card** page lets you define and edit an AI language model. Each role contains skill instructions (in Markdown format) that are injected into the AI conversation to customize its behavior and expertise.

## Fields

| Field | Description |
| --- | --- |
| **Code** | A unique identifier for the language model (e.g., `SALES`, `INVENTORY`). |
| **Description** | A short description of the language model's purpose and behavior. |
| **Model** | Optional AI model override (e.g., `claude-sonnet-4-6`). If empty, the default model is used. |
| **Skill** | Markdown instructions that define the AI's expertise and behavior when this language model is active. Edited in an embedded text editor. |

## Authentication

Providers other than Copilot need an API key. The key is never a field on this page — it lives in the Bifröst secret store, and the card shows only whether a value has been entered.

| Field | Description |
| --- | --- |
| **Personal Key Stored** | Whether *you* have stored a personal key for this model. A personal key overrides the shared key. |
| **Shared Key Stored** | Whether a company-wide key has been stored for this model. Everyone without a personal key uses it. |
| **Note** | Appears only while no usable key exists, explaining that the value must be entered once. |

| Secret code | Scope |
| --- | --- |
| `LANGMODEL-<Code>-API-KEY` | Company — the shared key |
| `LANGMODEL-<Code>-USER-API-KEY` | Company and user — the personal key |

Business Central keeps stored secrets separate per extension, so a key entered in an earlier version of the app cannot be carried over. Enter each key once.

## Actions

| Action | Description |
| --- | --- |
| **Import Defaults** | Downloads a default skill definition from the standard URL and populates the language model with predefined instructions. |
| **Test Connection** | Calls the provider with the key that applies to you and reports whether the model answers. |
| **Set Personal API Key** | Opens the shared masked dialog and stores your own key for this model. |
| **Clear Personal API Key** | Removes your own stored key. The shared key, if any, applies again. |
| **Set Shared API Key** | Stores the company-wide key. Requires the `BIFROST ChatSvc ori` permission set. |
| **Clear Shared API Key** | Removes the company-wide key. Requires the `BIFROST ChatSvc ori` permission set. |
| **Try It** | Opens a chat against this language model so the configuration can be checked before it is rolled out. |

Deleting a language model clears both of its keys from the secret store.

## See Also

-   [Bifrost Language Models](/help/language-models/bifrost-lang-model-list/) – List of all available language models
-   [Bifrost Chat and User Setup](/help/language-models/bifrost-chat/) – Assign a language model to a user
