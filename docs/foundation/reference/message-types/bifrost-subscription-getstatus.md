---
id: bifrost-subscription-getstatus
title: "Bifrost.Subscription.GetStatus"
sidebar_label: "Bifrost.Subscription.GetStatus"
sidebar_position: 2.3
description: "Request and response contract for the Bifrost.Subscription.GetStatus Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the current customer configuration, account, license status, balance, and current-month usage from the licensing service.

## Request
```json
{ "companyId": "optional-company-guid" }
```

The company ID is a GUID. The implementation hashes it internally; callers must not send a hash.

## Response
The response contains status, configuration, account, licenseStatus, and currentMonthUsage. Display fields use company, vendor, and partner names where available.

This message is available in SaaS Production and OnPrem and is disabled in SaaS Sandbox.

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

