---
id: bifrost-vendor-getpartners
title: "Bifrost.Vendor.GetPartners"
sidebar_label: "Bifrost.Vendor.GetPartners"
sidebar_position: 2.7
description: "Request and response contract for the Bifrost.Vendor.GetPartners Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns per-Partner rollup rows for the calling Vendor. Each row aggregates the Subscription usage of every customer of that Partner in the billing period, including customers whose relationship ended during the period.

## Request
`period` = `currentMonth` (default) or `previousMonth`. Or explicit `startDate` + `endDate` (yyyy-MM-dd).

## Response
- `rows[]` — one row per Partner:
  - `partnerTenantIdHash`, `partnerCompanyName`, `partnerFriendlyName`
  - `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
  - `tiers[]` — per-tier rows with `name`, `limitPerDay`, `customerCount`, `capacityPerDay`

