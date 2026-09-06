---
id: landsbankinn-claim-update
title: "Landsbankinn.Claim.Update"
sidebar_label: "Landsbankinn.Claim.Update"
sidebar_position: 97
description: "Request and response contract for the Landsbankinn.Claim.Update Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Updates a claim via PUT /Claims/&#123;id&#125;.
Replaces SOAP `Landsbankinn.Claim.AlterBatch`.

## Date mapping
| This message type | Bank API field | Meaning |
|---|---|---|
| `dueDate` | `finalDueDate` | Final due date / eindagi |

## Request (required fields)
```json
{
  "claimId": "<30-char claim ID>",        // required
  "templateCode": "<3-char code>",        // required by bank
  "dueDate": "<final due date>",          // required (maps to bank finalDueDate)
  "autoCancellation": "<auto-cancel date>", // required
  "principalAmount": 500,                 // optional — include to change
  "description": "Updated description"    // optional
}
```

The bank requires a full PUT (not partial). `claimId`, `templateCode`, `dueDate`, and `autoCancellation` are always required.
Other fields are optional — only include what you want to change.

## Response
Returns the bank response (HTTP 202 on success), plus `logEntryNo`.

