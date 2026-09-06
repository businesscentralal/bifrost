---
id: iceland-language-get
title: "Iceland.Language.Get"
sidebar_label: "Iceland.Language.Get"
sidebar_position: 36
description: "Request and response contract for the Iceland.Language.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Searches or lists ISO 639-1 world languages from the **haliaeetus/iso-639** GitHub dataset.
Returns ISO 639-1 and 639-2 codes, native names, language families, and Wikipedia links.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public dataset, no API key required.

## Use when
- You need ISO 639-1 or 639-2 language codes for BC master data enrichment.
- You want to look up a language by name, native name, ISO code, or language family.
- You need to validate or resolve language codes for localisation (i18n) workflows.

## Request
```json
{
  "q": "icelandic"   // (optional) filter term
}
```

The `q` parameter is matched **case-insensitively** against:

| Field | Example |
|---|---|
| `639-1` | `is` |
| `639-2` | `isl` |
| `name` | `Icelandic` |
| `nativeName` | `Íslenska` |
| `family` | `Indo-European` |

Omit `q` or pass `{}` to return all ~184 ISO 639-1 languages.

## Response
```json
{
  "data": {
    "languages": [
      {
        "639-1": "is",
        "639-2": "isl",
        "name": "Icelandic",
        "nativeName": "Íslenska",
        "family": "Indo-European",
        "wikiUrl": "https://en.wikipedia.org/wiki/Icelandic_language"
      }
    ],
    "meta": { "count": 1, "query": "icelandic" }
  }
}
```

## AI/Agent playbook
1. Use `q` with a language name or ISO code for targeted lookups; omit for the full list.
2. Prefer `639-1` (two-letter) for HTML `lang` attributes and BC locale settings.
3. Use `639-2` (three-letter) for integrations that require ISO 639-2 codes.
4. Query `family` to group related languages (e.g. `q=turkic` returns all Turkic languages).
5. This endpoint is read-only and does not interact with any BC tables.

## Errors
- `Language dataset request failed: ...` — dataset unreachable or returned a non-success HTTP status.
- If the outbound call is blocked, enable **Allow HttpClient Requests** for the extension in Extension Management.

