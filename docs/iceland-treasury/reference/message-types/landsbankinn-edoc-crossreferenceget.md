---
id: landsbankinn-edoc-crossreferenceget
title: "Landsbankinn.EDoc.CrossReferenceGet"
sidebar_label: "Landsbankinn.EDoc.CrossReferenceGet"
sidebar_position: 115
description: "Request and response contract for the Landsbankinn.EDoc.CrossReferenceGet Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Manage electronic documents (rafræn skjöl) at Landsbankinn.
Base: `https://openapi.landsbankinn.is/api/BusinessSupport/ElectronicDocuments/v1`

## Message Types

| Message Type | Method | Endpoint |
|---|---|---|
| `Landsbankinn.EDoc.DocumentTypes` | GET | /DocumentTypes |
| `Landsbankinn.EDoc.CrossReferences` | GET | /CrossReferences |
| `Landsbankinn.EDoc.CrossReferenceGet` | GET | /CrossReferences/&#123;id&#125; |
| `Landsbankinn.EDoc.CrossReferenceCreate` | POST | /CrossReferences |
| `Landsbankinn.EDoc.CrossReferenceDelete` | DELETE | /CrossReferences/&#123;id&#125; |
| `Landsbankinn.EDoc.Upload` | POST | /Documents |
| `Landsbankinn.EDoc.BatchUpload` | POST | /DocumentCreationBatches |
| `Landsbankinn.EDoc.Documents` | GET | /Documents (inbox) |
| `Landsbankinn.EDoc.DocumentGet` | GET | /Documents/&#123;id&#125; |
| `Landsbankinn.EDoc.DocumentContent` | GET | /Documents/&#123;id&#125;/Content |

## Access Gates
- **Lbi EDoc Gate** — document creation, types, cross-references
- **Lbi Statement Gate** — inbox read (Documents, DocumentGet, DocumentContent)

## Document Types
Use `Landsbankinn.EDoc.DocumentTypes` with `senderNationalId` to discover
which document type codes are available for uploading.

## Cross-References
Link documents to entities (claims or transactions) via cross-references.
`keyType` must be one of: `claim`, `transaction`.

## Document Upload
Upload a single document (PDF or XML) via `Landsbankinn.EDoc.Upload`.
Pass file content as base64 in `fileBase64`, along with metadata fields.

## Batch Upload
Upload a ZIP archive or XML batch via `Landsbankinn.EDoc.BatchUpload`.
Returns HTTP 202 Accepted (async processing).

