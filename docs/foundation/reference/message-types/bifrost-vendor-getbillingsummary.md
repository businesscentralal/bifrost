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
`dateBasis` = `usageDate` (default) filters the period on the day the messages were used; `reportedDate` filters on the day the usage was reported to the licensing service. Usage can be reported a day or more after it was used, so billing by `reportedDate` never changes a period that is already closed. Any other value is refused.
```json
{ "period": "currentMonth" }
```

## Response
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `internalMessages`, `demoMessages`, `supportMessages`, `totalCapacityPerDay`
- `internalMessages` — usage by people in a Customer that is the Partner's own tenant; `demoMessages` — usage in a Customer the Partner marked as a demo environment; `supportMessages` — usage by the Partner's users working in a Customer through a delegated partner plan. Each is reported separately from `userMessages` (regular customer usage) and `appMessages` (application registrations).
- `dateBasis` — the date basis the period was filtered on
- `tiers[]` — per-tier rows with `name`, `limitPerDay`, `customerCount`, `capacityPerDay`
- `billingPeriodStart` / `billingPeriodEnd`

