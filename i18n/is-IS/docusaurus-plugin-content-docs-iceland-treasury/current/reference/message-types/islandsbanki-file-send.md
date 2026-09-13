---
id: islandsbanki-file-send
title: "Islandsbanki.File.Send"
sidebar_label: "Islandsbanki.File.Send"
sidebar_position: 45
description: "Beiðni- og svarsamningur fyrir Islandsbanki.File.Send Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Uploads a Base64-encoded file í the Islandsbanki presentment system (SendaSkra).

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
```json
{
  "fileName": "krofur.xml",            // (required) the name determines the file TYPE — must be correct
  "contentBase64": "PD94bWwg...",      // (required) Base64-encoded file content
  "kennitala": "1234567890"            // (optional) file owner (customer)
}
```

## Svar
```json
{ "status": "Success", "logEntryNo": 80 }
```


