---
id: bifrost-partner-getbillingsummary
title: "Bifrost.Partner.GetBillingSummary"
sidebar_label: "Bifrost.Partner.GetBillingSummary"
sidebar_position: 2.1
description: "Request and response contract for the Bifrost.Partner.GetBillingSummary Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns one-row billing totals for the calling Partner across every Subscription customer.
Only Subscription usage is billed: a Customer is counted while it is linked to the Partner, and a Customer whose relationship ended during the billing period (it is back on Prepaid) is still counted for the Subscription usage it had before the cancellation. Customers that were never linked, and Prepaid usage, are excluded.

## Request
`period` = `currentMonth` (default) or `previousMonth`. Or explicit `startDate` + `endDate` (yyyy-MM-dd).

## Response
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
- `tiers[]` — per-tier rows with `name`, `limitPerDay`, `customerCount`, `capacityPerDay`

## Errors and warnings
Errors and warnings follow the shared shape - see [Errors and warnings](/foundation/reference/errors/).

