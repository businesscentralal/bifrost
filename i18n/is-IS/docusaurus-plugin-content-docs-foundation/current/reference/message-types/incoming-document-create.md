---
id: incoming-document-create
title: "Incoming.Document.Create"
sidebar_label: "Incoming.Document.Create"
sidebar_position: 73
description: "Beiðni- og svarsamningur fyrir Incoming.Document.Create Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til a ný `Incoming Document` úr a file. The file er attached as the main attachment via the standard `Incoming Document.CreateIncomingDocument` + `AddAttachmentFromStream` flow.

## Stefna
Innkomandi (skrifa)

## Response Content Gerð
`text/json`

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| fileName | Text | Yes | File Heiti þar á meðal extension (notað til derive Lýsing og extension) |
| fileContent | Text (Base64) | Yes | Base64-encoded file bytes |

No `subject` er lesa. Other fields in `data` eru ignored — populate birgi/dagsetning/etc. via subsequent `Data.Records.Set` eða `Incoming.Document.Process`.

## Dæmi um beiðni
```json
{
  "type": "Incoming.Document.Create",
  "data": {
    "fileName": "invoice.pdf",
    "fileContent": "JVBERi0xLjQK..."
  }
}
```

## Uppbygging svars
```json
{
  "status": "Success",
  "entryNo": 1234,
  "id": "...",
  "lineNo": 10000,
  "description": "invoice",
  "documentDate": "0001-01-01",
  "dueDate": "0001-01-01",
  "vendorNo": "",
  "vendorName": "",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": { "tableNo": 130, "tableName": "Incoming Document", "tableCaption": "...", "recordSystemId": "..." },
  "error": []
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` |
| entryNo | heiltala | ný Incoming skjal `Entry No.` (always positive) |
| id | Text | ný Incoming skjal `SystemId` (GUID án braces) |
| lineNo | heiltala | `Line No.` of the created main attachment |
| Lýsing | Text | Derived úr file Heiti án extension |
| documentDate, dueDate | Text | Initially blank (`0001-01-01`) |
| vendorNo, vendorName | Text | Initially blank |
| documentStatus | Text | Initial status |
| dataExchangeType | Text | Initially blank |
| processed, posted | sanngildi | Initially `false` |
| færsla | hlutur | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| Villa | fylki | Initial Villa message færslur (typically empty) |

## Villur
| Scenario | Villa |
|----------|-------|
| vantar `fileName` | `fileName is required.` |
| vantar `fileContent` | `fileContent is required.` |

## Tengdar skilaboðategundir
- `Incoming.Document.Attach`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

