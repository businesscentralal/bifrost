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

## Actions

| Action | Description |
| --- | --- |
| **Import Defaults** | Downloads a default skill definition from the standard URL and populates the language model with predefined instructions. |

## See Also

-   [Bifrost Language Models](/help/bragi/bifrost-lang-model-list/) – List of all available language models
-   [Bifrost Chat and User Setup](/help/bragi/bifrost-chat/) – Assign a language model to a user
