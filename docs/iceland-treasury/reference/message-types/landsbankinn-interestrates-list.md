---
id: landsbankinn-interestrates-list
title: "Landsbankinn.InterestRates.List"
sidebar_label: "Landsbankinn.InterestRates.List"
sidebar_position: 126
description: "Request and response contract for the Landsbankinn.InterestRates.List Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves current interest rates for deposits and loans.
No OAuth token required — only the API key.

## Request
```json
{}   // no parameters required
```

## Response
Returns the interest rates list as-is from the bank API, plus `count` and `logEntryNo`.

