---
id: incoming-document-attach
title: "Incoming.Document.Attach"
sidebar_label: "Incoming.Document.Attach"
sidebar_position: 72
description: "Beiðni- og svarsamningur fyrir Incoming.Document.Attach Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Adds a supplemental file attachment til an fyrirliggjandi `Incoming Document`. The file er appended as a ný `Incoming Document Attachment` line; whether it becomes the main attachment er governed með standard BC `AddAttachmentFromStream` behavior (an additional attachment þegar a main attachment already exists).

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
| fileName | data | Text | Yes | File Heiti þar á meðal extension (e.g. `invoice.pdf`) |
| fileContent | data | Text (Base64) | Yes | Base64-encoded file bytes |

## Dæmi um beiðni
```json
{
  "type": "Incoming.Document.Attach",
  "subject": "1234",
  "data": {
    "fileName": "supplement.pdf",
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
  "lineNo": 20000,
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
  "error": []
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` |
| entryNo | heiltala | Incoming skjal `Entry No.` |
| id | Text | Incoming skjal `SystemId` (GUID án braces) |
| lineNo | heiltala | `Line No.` of the newly added attachment |
| Lýsing | Text | skjal Lýsing |
| documentDate | Text | Culture-invariant dagsetning |
| dueDate | Text | Culture-invariant dagsetning |
| vendorNo | Text | birgi No. on the skjal |
| vendorName | Text | birgi Heiti |
| documentStatus | Text | skjal status |
| dataExchangeType | Text | Data Exchange Gerð |
| processed | sanngildi | Re-lesa eftir attachment add |
| posted | sanngildi | True ef a posted skjal exists |
| færsla | hlutur | `{ tableNo, tableName, tableCaption, recordSystemId }` |
| Villa | fylki | Incoming skjal `Error Message` færslur (typically empty on Tókst) |

## Villur
| Scenario | Villa |
|----------|-------|
| vantar `fileName` | `fileName is required.` |
| vantar `fileContent` | `fileContent is required.` |
| Subject does ekki resolve | `Incoming Document {subject} not found.` |

## Tengdar skilaboðategundir
- `Incoming.Document.Create`
- `Incoming.Document.Get`
- `Incoming.Document.SetDefault`
- `Incoming.Document.Process`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

