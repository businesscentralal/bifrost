---
id: field-translations-get
title: "Field.Translations.Get"
sidebar_label: "Field.Translations.Get"
sidebar_position: 34
description: "Beiðni- og svarsamningur fyrir Field.Translations.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar all stored BC system translations fyrir a færsla. Optionally filtered til a single Reitur og/eða a single language. Wraps codeunit `3711 "Translation".GetTranslations`.

## Stefna

Útgående (lesa-aðeins).

## Response Content Gerð

`text/json`

## Identifier Resolution

- tafla: resolved via standard subject/`tableId`/`tableName` resolution.
- færsla: resolved með SystemId (GUID) supplied as `systemId` eða `id`.
- Reitur (valfrjálst): `fieldId` eða `fieldNo`; omit eða pass `0` fyrir all fields.
- Language (valfrjálst): `lcid` Windows Language Identifier; omit fyrir all languages.

## Beiðnibreytur

| Reitur | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `tableId` / `tableName` | int / text | yes | Target tafla (einnig accepted via subject). |
| `systemId` / `id` | GUID | yes | færsla SystemId. |
| `fieldId` / `fieldNo` | int | no | Restrict til a single Reitur. `0` eða absent Skilar all fields. |
| `lcid` | int | no | Restrict til a single language. Absent Skilar all languages. |

## Dæmi um beiðni

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555"
}
```

## Uppbygging svars (Tókst)

```json
{
  "status": "Success",
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030,
  "translationCount": 2,
  "translations": [
    { "fieldId": 2, "languageId": 1030, "value": "Viðskiptavinur" },
    { "fieldId": 3, "languageId": 1030, "value": "Nafn 2" }
  ]
}
```

## Result Fields

| Reitur | Gerð | Lýsing |
|---|---|---|
| `status` | text | `Success` eða `Error`. |
| `tableId` | int | Echo of resolved tafla id. |
| `systemId` | GUID | Echo of færsla SystemId. |
| `fieldId` | int | Echoed aðeins þegar Beiðnin filtered með Reitur. |
| `lcid` | int | Echoed aðeins þegar Beiðnin filtered með language. |
| `translationCount` | int | númer of færslur in `translations`. |
| `translations[]` | fylki | One færsla per stored translation. |
| `translations[].fieldId` | int | Reitur númer. |
| `translations[].languageId` | int | Windows Language Identifier. |
| `translations[].value` | text | Translation text. |

## Villur

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- Standard tafla-resolution Villur þegar subject/`tableId` getur ekki be resolved.
- færsla-opið Villur þegar SystemId er fannst ekki in the target tafla.

## Athugasemdir

- `translations` er empty þegar no translation rows exist fyrir the færsla under the virkt filters.
- nota `Field.Translation.Get` fyrir a single (Reitur, language) lookup eða `Field.Translation.Set` til skrifa.

## Tengdar skilaboðategundir

- `Field.Translation.Get`
- `Field.Translation.Set`

