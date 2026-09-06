---
id: islandsbanki-file-send
title: "Islandsbanki.File.Send"
sidebar_label: "Islandsbanki.File.Send"
sidebar_position: 45
description: "Request and response contract for the Islandsbanki.File.Send Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Uploads a Base64-encoded file into the Islandsbanki presentment system (SendaSkra).

**Direction:** Outbound  
**Content-Type:** text/json

## Request
```json
{
  "fileName": "krofur.xml",            // (required) the name determines the file TYPE — must be correct
  "contentBase64": "PD94bWwg...",      // (required) Base64-encoded file content
  "kennitala": "1234567890"            // (optional) file owner (customer)
}
```

## Response
```json
{ "status": "Success", "logEntryNo": 80 }
```

