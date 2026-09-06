---
id: landsbankinn-funds-list
title: "Landsbankinn.Funds.List"
sidebar_label: "Landsbankinn.Funds.List"
sidebar_position: 125
description: "Request and response contract for the Landsbankinn.Funds.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves market data for Landsbréf funds from the REST API.
Returns both ETFs and Mutual Funds in a single response.
No OAuth token required — only the API key.

## Request
```json
{}   // no parameters required
```

## Response
```json
{
  "etfs": [...],
  "mutualFunds": [...],
  "etfCount": 5,
  "mutualFundCount": 12,
  "logEntryNo": 123
}
```

