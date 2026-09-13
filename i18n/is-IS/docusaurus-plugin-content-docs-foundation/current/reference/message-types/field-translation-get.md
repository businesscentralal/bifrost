---
id: field-translation-get
title: "Field.Translation.Get"
sidebar_label: "Field.Translation.Get"
sidebar_position: 32
description: "Beiðni- og svarsamningur fyrir Field.Translation.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar the stored BC system translation fyrir a single Reitur on a single færsla in a specific language. Wraps codeunit `3711 "Translation"`.

## Stefna

Útgående (lesa-aðeins).

## Response Content Gerð

`text/json`

## Identifier Resolution

- tafla: resolved via standard subject/`tableId`/`tableName` resolution.
- færsla: resolved með SystemId (GUID) supplied as `systemId` eða `id`.
- Reitur: resolved með `fieldId` eða `fieldNo`.
- Language: resolved með `lcid` (Windows Language Identifier heiltala).

## Beiðnibreytur

| Reitur | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `tableId` / `tableName` | int / text | yes | Target tafla (einnig accepted via subject). |
| `systemId` / `id` | GUID | yes | færsla SystemId. |
| `fieldId` / `fieldNo` | int | yes | Reitur númer. |
| `lcid` | int | yes | Windows Language Identifier (e.g. `1030` er-er, `1033` en-US). |

## Dæmi um beiðni

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030
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
  "value": "Viðskiptavinur"
}
```

## Result Fields

| Reitur | Gerð | Lýsing |
|---|---|---|
| `status` | text | `Success` eða `Error`. |
| `tableId` | int | Echo of resolved tafla id. |
| `systemId` | GUID | Echo of færsla SystemId (format án braces). |
| `fieldId` | int | Echo of requested Reitur númer. |
| `lcid` | int | Echo of requested language identifier. |
| `value` | text | The translation, eða empty strengur þegar no translation er stored. |

## Villur

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- `Request must specify fieldId or fieldNo parameter.`
- `Request must specify lcid parameter (language identifier).`
- Standard tafla-resolution Villur þegar subject/`tableId` getur ekki be resolved.
- færsla-opið Villur þegar SystemId er fannst ekki in the target tafla.

## Athugasemdir

- An empty `value` means no translation row exists fyrir the (færsla, Reitur, language) tuple; the Uppruni-language caption er unaffected.
- nota `Field.Translation.Set` til skrifa a translation, eða `Field.Translations.Get` til retrieve multiple in one call.

## Tengdar skilaboðategundir

- `Field.Translation.Set`
- `Field.Translations.Get`

