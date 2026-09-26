---
id: incoming-document-get
title: "Incoming.Document.Get"
sidebar_label: "Incoming.Document.Get"
sidebar_position: 74
description: "Beiðni- og svarsamningur fyrir Incoming.Document.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar header fields fyrir an `Incoming Document` together með its main attachment (ef hvaða) og hvaða additional attachments. Attachment file content er returned as Base64.

## Stefna
Útgående

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
{ "type": "Incoming.Document.Get", "subject": "1234" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "...",
  "description": "...",
  "documentDate": "2025-01-15",
  "dueDate": "2025-02-15",
  "vendorNo": "V00010",
  "vendorName": "...",
  "documentStatus": "...",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "error": [],
  "mainAttachment": { "lineNo": 10000, "fileName": "invoice.pdf", "fileContent": "..." },
  "additionalAttachments": [
    { "lineNo": 20000, "fileName": "supplement.pdf", "fileContent": "..." }
  ]
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` |
| entryNo | heiltala | Incoming skjal `Entry No.` |
| id | Text | Incoming skjal `SystemId` (GUID án braces) |
| Lýsing | Text | skjal Lýsing |
| documentDate, dueDate | Text | Culture-invariant dates |
| vendorNo, vendorName | Text | birgi info |
| documentStatus, dataExchangeType | Text | Status fields |
| processed, posted | sanngildi | Status flags |
| færsla | hlutur | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| Villa | fylki | Incoming skjal `Error Message` færslur (Sjá Villa hlutur below) |
| mainAttachment | hlutur | Present aðeins þegar a main attachment exists |
| additionalAttachments | fylki | All non-main attachments (may be empty) |

## Attachment hlutur
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| lineNo | heiltala | Attachment `Line No.` |
| fileName | Text | `Name` + `.` + `File Extension` |
| fileContent | Text (Base64) | Base64-encoded file bytes |

## Villa hlutur (færslur in `error` fylki)
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| id | Text | Villa færsla identifier |
| message | Text | Villa Lýsing |
| Gerð | Text | Villa category |
| tafla | hlutur | `{ id, name }` of the related tafla |
| Reitur | hlutur | `{ id, name }` of the related Reitur |
| context | hlutur | `{ tableNumber, fieldNumber, fieldName }` of the context færsla |
| additionalInformation | Text | Extra details ef available |

## Villur
| Scenario | Villa |
|----------|-------|
| Subject does ekki resolve | `Incoming Document {subject} not found.` |

## Tengdar skilaboðategundir
- `Incoming.Document.Create`
- `Incoming.Document.Attach`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

