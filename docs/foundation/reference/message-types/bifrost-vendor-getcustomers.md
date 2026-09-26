---
id: bifrost-vendor-getcustomers
title: "Bifrost.Vendor.GetCustomers"
sidebar_label: "Bifrost.Vendor.GetCustomers"
sidebar_position: 2.6
description: "Request and response contract for the Bifrost.Vendor.GetCustomers Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns per-Customer billing rows for the calling Vendor. Optional `partnerTenantId` filter drills into a single Partner.

## Request
```json
{ "period": "currentMonth", "partnerTenantId": "<optional partner GUID>" }
```

## Response
- `rows[]` — one row per Customer:
  - `customerTenantIdHash`, `companyName`, `friendlyName`, `partnerTenantIdHash`
  - `billingMode`, `state`, `userMessages`, `appMessages`
  - `rateLimitTier`, `rateLimitPerDay`, `aboveFreeTier`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

