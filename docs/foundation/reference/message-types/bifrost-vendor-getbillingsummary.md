---
id: bifrost-vendor-getbillingsummary
title: "Bifrost.Vendor.GetBillingSummary"
sidebar_label: "Bifrost.Vendor.GetBillingSummary"
sidebar_position: 2.5
description: "Request and response contract for the Bifrost.Vendor.GetBillingSummary Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns one-row billing totals for the calling Vendor across every Subscription customer of every Partner.
Only Subscription usage is billed: a Customer is counted while it is linked to the Partner, and a Customer whose relationship ended during the billing period (it is back on Prepaid) is still counted for the Subscription usage it had before the cancellation. Customers that were never linked, and Prepaid usage, are excluded.

## Request
`period` = `currentMonth` (default) or `previousMonth`. Or supply explicit `startDate` and `endDate` (yyyy-MM-dd).
```json
{ "period": "currentMonth" }
```

## Response
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
- `tiers[]` — per-tier rows with `name`, `limitPerDay`, `customerCount`, `capacityPerDay`
- `billingPeriodStart` / `billingPeriodEnd`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

