---
id: iceland-language-get
title: "Iceland.Language.Get"
sidebar_label: "Iceland.Language.Get"
sidebar_position: 36
description: "Beiðni- og svarsamningur fyrir Iceland.Language.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Searches eða lists ISO 639-1 world languages frá the **haliaeetus/iso-639** GitHub dataset.
Skilar ISO 639-1 og 639-2 codes, native names, language families, og Wikipedia links.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Authentication:** None — public dataset, no API key nauðsynlegt.

## Notað þegar
- You need ISO 639-1 eða 639-2 language codes fyrir BC master data enrichment.
- You want til look up a language by Heiti, native Heiti, ISO code, eða language family.
- You need til validate eða resolve language codes fyrir localisation (i18n) workflows.

## Beiðni
```json
{
  "q": "icelandic"   // (optional) filter term
}
```

The `q` parameter er matched **case-insensitively** against:

| Reitur | Dæmi |
|---|---|
| `639-1` | `is` |
| `639-2` | `isl` |
| `name` | `Icelandic` |
| `nativeName` | `Íslenska` |
| `family` | `Indo-European` |

Omit `q` eða pass `{}` til return Allt ~184 ISO 639-1 languages.

## Svar
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

## Leiðbeiningar fyrir gervigreind/umboð
1. Notaðu `q` með a language Heiti eða ISO code fyrir targeted lookups; omit fyrir the fulla Listi.
2. Prefer `639-1` (two-letter) fyrir HTML `lang` attributes og BC locale settings.
3. Notaðu `639-2` (three-letter) fyrir integrations that require ISO 639-2 codes.
4. Fyrirspurn `family` til group related languages (e.g. `q=turkic` Skilar Allt Turkic languages).
5. This Endapunktur er read-Aðeins og does not interact með any BC tables.

## Errors
- `Language dataset request failed: ...` — dataset unreachable eða returned a non-success HTTP status.
- Ef the outbound Kallaðu á er blocked, enable **Allow HttpClient Requests** fyrir the extension in Extension Management.


