---
id: incoming-document-setdefault
title: "Incoming.Document.SetDefault"
sidebar_label: "Incoming.Document.SetDefault"
sidebar_position: 76
description: "Beiðni- og svarsamningur fyrir Incoming.Document.SetDefault Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Promotes an fyrirliggjandi attachment on an `Incoming Document` til become the main (Sjálfgefið) attachment. The implementation deletes all attachments og re-inserts them, placing the requested `lineNo` fyrsta (so it becomes the ný main attachment með `Line No. 10000`), then the remaining attachments in their original order. At least 2 attachments verður að exist.

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
| lineNo | data | heiltala | Yes | `Line No.` of the attachment til promote til main |

## Dæmi um beiðni
```json
{
  "type": "Incoming.Document.SetDefault",
  "subject": "1234",
  "data": { "lineNo": 20000 }
}
```

## Uppbygging svars (Tókst)
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "..."
}
```

## Uppbygging svars (Mistókst)
```json
{ "status": "Error", "error": "<message>" }
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` eða `Error` |
| entryNo | heiltala | Incoming skjal `Entry No.` (on Tókst) |
| id | Text | Incoming skjal `SystemId` GUID án braces (on Tókst) |
| Villa | Text | Villa message (on Mistókst) |

## Villur
| Scenario | Villa |
|----------|-------|
| vantar `lineNo` | `lineNo is required.` |
| Subject does ekki resolve | `Incoming Document {subject} not found.` |
| Fewer than 2 attachments | `At least 2 attachments are required to set a default.` |
| `lineNo` does ekki exist on the skjal | `Attachment with lineNo {lineNo} not found.` |

## Athugasemdir
- The operation reassigns `Line No.` values — the promoted attachment becomes `10000`, the others follow.
- The operation runs through `Codeunit.Run` so hvaða AL runtime Villa er captured í the `error` Reitur rather than rolling back the outer transaction.

## Tengdar skilaboðategundir
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.Process`

