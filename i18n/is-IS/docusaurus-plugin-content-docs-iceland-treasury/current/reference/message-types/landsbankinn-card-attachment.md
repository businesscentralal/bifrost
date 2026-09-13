---
id: landsbankinn-card-attachment
title: "Landsbankinn.Card.Attachment"
sidebar_label: "Landsbankinn.Card.Attachment"
sidebar_position: 78
description: "Beiðni- og svarsamningur fyrir Landsbankinn.Card.Attachment Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Downloads a færsla attachment (receipt) by its ID.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "attachmentId": "abc-123-def",         // (required)
  "createIncomingDocument": false         // (optional, default false)
}
```

## Svar (createIncomingDocument: false)
```json
{
  "attachmentId": "abc-123-def",
  "contentType": "application/pdf",
  "content": "<base64-encoded>"
}
```

## Svar (createIncomingDocument: true)
```json
{
  "status": "Success",
  "entryNo": 42,
  "id": "{guid}",
  "fileName": "receipt.pdf",
  "contentType": "application/pdf"
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu createIncomingDocument=true Þegar you want BC til store og process the receipt. Notaðu false Þegar you just need the raw binary (e.g. fyrir display eða forwarding).


