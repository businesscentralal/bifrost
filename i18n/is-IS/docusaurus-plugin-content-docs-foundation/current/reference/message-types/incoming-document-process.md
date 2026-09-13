---
id: incoming-document-process
title: "Incoming.Document.Process"
sidebar_label: "Incoming.Document.Process"
sidebar_position: 75
description: "Beiðni- og svarsamningur fyrir Incoming.Document.Process Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Processes an `Incoming Document` með invoking its standard BC processing — creating a linked purchase reikningur, credit memo, eða dagbók line according til the skjal's Data Exchange Gerð og configuration. Work runs inside `Codeunit.Run` so AL Villur eru captured og returned as a JSON `error` Reitur rather than rolling back the outer transaction.

## Stefna
Innkomandi (skrifa)

## Response Content Gerð
`text/json`

## Identifier Resolution
The `subject` identifies the target `Incoming Document`:
1. ef `subject` er a gilt GUID — interpreted as `SystemId`
2. Otherwise — interpreted as `Entry No.` (heiltala)

## Beiðnibreytur
| Reitur | Location | Gerð | áskilið | Lýsing |
|-------|----------|------|----------|-------------|
| subject | Bifrost | Text | Yes | Incoming skjal `Entry No.` eða `SystemId` GUID |

Request body er ekki lesa.

## Dæmi um beiðni
```json
{ "type": "Incoming.Document.Process", "subject": "1234" }
```

## Uppbygging svars (Tókst)
```json
{
  "status": "Success",
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "entryNo": 1234,
  "id": "..."
}
```

## Uppbygging svars (BC processing produced Villur)
```json
{
  "status": "Error",
  "error": [ { "id": "...", "message": "...", "type": "...", "table": { "id": 0, "name": "" }, "field": { "id": 0, "name": "" }, "context": { }, "additionalInformation": "" } ],
  "entryNo": 1234,
  "id": "..."
}
```

## Uppbygging svars (AL runtime Villa caught með `Codeunit.Run`)
```json
{ "status": "Error", "error": "<message>" }
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` eða `Error` |
| færsla | hlutur | Present on Tókst — `{ tableNo, tableName, tableCaption, recordSystemId }` |
| Villa | fylki eða Text | fylki of BC `Error Message` færslur þegar standard processing fails; a single Text þegar `Codeunit.Run` traps an AL runtime Villa |
| entryNo | heiltala | Incoming skjal `Entry No.` (always set þegar the skjal was fannst) |
| id | Text | Incoming skjal `SystemId` (always set þegar the skjal was fannst) |

## Villur
| Scenario | Surface | Message |
|----------|---------|---------|
| Subject does ekki resolve | AL Villa → `error` Reitur | `Incoming Document {subject} not found.` |
| skjal has no main attachment | AL Villa → `error` Reitur | `Incoming Document {entryNo} has no main attachment.` |
| skjal already posted | AL Villa → `error` Reitur | `Incoming Document {entryNo} has already been posted.` |

## Tengdar skilaboðategundir
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`

