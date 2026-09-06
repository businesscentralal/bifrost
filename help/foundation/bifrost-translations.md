---
id: bifrost-translations
title: "Bifrost Translations"
sidebar_label: "Bifrost Translations"
sidebar_position: 25
---

The **Bifrost Translations** page lets administrators maintain translation entries. External systems can use these entries to retrieve translated text for a given message source, language, and English source text.

## Columns

| Column | Description |
| --- | --- |
| **Source** | The message source that owns this translation entry (e.g. a message type, module, or external system identifier). |
| **Windows Language ID** | The numeric Windows Language ID of the target language (e.g. 1033 for English, 1039 for Icelandic). |
| **Windows Language Name** | The display name of the target language (looked up automatically from the Windows Language ID). |
| **Source Text** | The original English text that needs to be translated. |
| **Target Text** | The translated text in the target language. |

## How to Use

1.  Add a new line for each translation you need.
2.  Enter the **Source** to categorise the translation (typically the message type or module name).
3.  Set the **Windows Language ID** for the target language.
4.  Enter the original text in **Source Text** and the translation in **Target Text**.

## Tips

-   Translations are used at runtime by bifrost message processing when returning language-specific responses to external systems.
-   You can create multiple translations for the same source text in different languages.
-   This page can be reached directly from the [Bifrost Setup](/help/foundation/bifrost-setup/) page via the _Bifrost Translations_ action.
