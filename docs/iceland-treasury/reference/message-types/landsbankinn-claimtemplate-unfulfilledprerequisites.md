---
id: landsbankinn-claimtemplate-unfulfilledprerequisites
title: "Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites"
sidebar_label: "Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites"
sidebar_position: 109
description: "Request and response contract for the Landsbankinn.ClaimTemplate.UnfulfilledPrerequisites Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Lists unfulfilled prerequisites that prevent a claimant from creating claim templates.

## Request
```json
{ "claimantNationalId": "6306251060", "skip": 0, "take": 50 }
```
`claimantNationalId` is required. `skip`/`take` are optional, mapped to `page`/`perPage`.

