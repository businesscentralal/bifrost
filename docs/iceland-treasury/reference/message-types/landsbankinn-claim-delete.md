---
id: landsbankinn-claim-delete
title: "Landsbankinn.Claim.Delete"
sidebar_label: "Landsbankinn.Claim.Delete"
sidebar_position: 94
description: "Request and response contract for the Landsbankinn.Claim.Delete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Cancels a claim via DELETE /Claims/&#123;id&#125;.

## Request
```json
{ "claimId": "013366000001630625106020260801" }
```

## Response
Returns the bank response (typically empty on success with HTTP 200/204).

