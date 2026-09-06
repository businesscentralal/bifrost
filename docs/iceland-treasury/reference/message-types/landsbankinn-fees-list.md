---
id: landsbankinn-fees-list
title: "Landsbankinn.Fees.List"
sidebar_label: "Landsbankinn.Fees.List"
sidebar_position: 122
description: "Request and response contract for the Landsbankinn.Fees.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves current bank fees and prices from the Landsbankinn REST API.
No OAuth token required — only the API key.

## Request
```json
{}   // no parameters required
```

## Response
Returns the fee list as-is from the bank API, plus `count` and `logEntryNo`.

