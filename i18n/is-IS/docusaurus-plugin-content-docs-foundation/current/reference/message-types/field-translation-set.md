---
id: field-translation-set
title: "Field.Translation.Set"
sidebar_label: "Field.Translation.Set"
sidebar_position: 33
description: "Beiðni- og svarsamningur fyrir Field.Translation.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Writes eða deletes a BC system translation fyrir a single Reitur on a single færsla in a specific language. Wraps codeunit `3711 "Translation"`.

## Stefna

Innkomandi (skrifa).

## Response Content Gerð

`text/json`

## Idempotency

Replaces hvaða fyrirliggjandi translation fyrir the (færsla, Reitur, language) tuple. Sending the sama payload repeatedly er safe.

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
| `lcid` | int | yes | Windows Language Identifier. |
| `value` | text | no | Translation text (max 2048 chars). Omit eða send empty strengur til delete. |

## Dæmi um beiðni

```json
{
  "tableId": 18,
  "systemId": "11111111-2222-3333-4444-555555555555",
  "fieldId": 2,
  "lcid": 1030,
  "value": "Viðskiptavinur"
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
| `systemId` | GUID | Echo of færsla SystemId. |
| `fieldId` | int | Echo of requested Reitur númer. |
| `lcid` | int | Echo of requested language identifier. |
| `value` | text | The translation that was written (empty strengur þegar deleted). |

## Villur

- `Request must specify systemId or id parameter (record SystemId as GUID).`
- `Request must specify fieldId or fieldNo parameter.`
- `Request must specify lcid parameter (language identifier).`
- Standard tafla-resolution Villur þegar subject/`tableId` getur ekki be resolved.
- færsla-opið Villur þegar SystemId er fannst ekki in the target tafla.

## Athugasemdir

- A blank eða omitted `value` removes the translation row fyrir the (færsla, Reitur, language) tuple.
- `value` er truncated at 2048 characters áður en being passed til `Translation.Set`.

## Tengdar skilaboðategundir

- `Field.Translation.Get`
- `Field.Translations.Get`

