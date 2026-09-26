---
id: bifrost-partner-getcustomers
title: "Bifrost.Partner.GetCustomers"
sidebar_label: "Bifrost.Partner.GetCustomers"
sidebar_position: 2.2
description: "Request and response contract for the Bifrost.Partner.GetCustomers Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns per-Customer billing rows for the calling Partner.

## Request
```json
{ "period": "currentMonth" }
```

## Response
- `rows[]` — one row per Customer:
  - `customerTenantIdHash`, `companyName`, `friendlyName`
  - `billingMode`, `state`, `userMessages`, `appMessages`
  - `rateLimitTier`, `rateLimitPerDay`, `aboveFreeTier`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

