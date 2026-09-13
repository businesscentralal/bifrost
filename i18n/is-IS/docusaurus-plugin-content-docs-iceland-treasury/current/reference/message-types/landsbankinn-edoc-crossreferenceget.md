---
id: landsbankinn-edoc-crossreferenceget
title: "Landsbankinn.EDoc.CrossReferenceGet"
sidebar_label: "Landsbankinn.EDoc.CrossReferenceGet"
sidebar_position: 115
description: "Beiðni- og svarsamningur fyrir Landsbankinn.EDoc.CrossReferenceGet Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Manage electronic skjöl (rafræn skjöl) at Landsbankinn.
Base: `https://openapi.landsbankinn.is/api/BusinessSupport/ElectronicDocuments/v1`

## Message Types

| Message Gerð | Aðferð | Endapunktur |
|---|---|---|
| `Landsbankinn.EDoc.DocumentTypes` | Sækja | /DocumentTypes |
| `Landsbankinn.EDoc.CrossReferences` | Sækja | /CrossReferences |
| `Landsbankinn.EDoc.CrossReferenceGet` | Sækja | /CrossReferences/&#123;id&#125; |
| `Landsbankinn.EDoc.CrossReferenceCreate` | POST | /CrossReferences |
| `Landsbankinn.EDoc.CrossReferenceDelete` | DELETE | /CrossReferences/&#123;id&#125; |
| `Landsbankinn.EDoc.Upload` | POST | /skjöl |
| `Landsbankinn.EDoc.BatchUpload` | POST | /DocumentCreationBatches |
| `Landsbankinn.EDoc.Documents` | Sækja | /skjöl (inbox) |
| `Landsbankinn.EDoc.DocumentGet` | Sækja | /skjöl/&#123;id&#125; |
| `Landsbankinn.EDoc.DocumentContent` | Sækja | /skjöl/&#123;id&#125;/Content |

## Access Gates
- **Lbi EDoc Gate** — skjal creation, types, cross-references
- **Lbi Statement Gate** — inbox read (skjöl, DocumentGet, DocumentContent)

## skjal Types
Notaðu `Landsbankinn.EDoc.DocumentTypes` með `senderNationalId` til discover
which skjal Gerð codes eru available fyrir uploading.

## Cross-References
Link skjöl til entities (claims eða færslur) via cross-references.
`keyType` verður að be one of: `claim`, `transaction`.

## skjal Upload
Upload a stakan skjal (PDF eða XML) via `Landsbankinn.EDoc.Upload`.
Pass file content as base64 in `fileBase64`, along með metadata fields.

## Batch Upload
Upload a ZIP archive eða XML batch via `Landsbankinn.EDoc.BatchUpload`.
Skilar HTTP 202 Accepted (async processing).


