---
id: bifrost-vendor-getpartners
title: "Bifrost.Vendor.GetPartners"
sidebar_label: "Bifrost.Vendor.GetPartners"
sidebar_position: 2.7
description: "Beiðni- og svarsamningur fyrir Bifrost.Vendor.GetPartners Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar samantektarlínum fyrir hvern samstarfsaðila söluaðilans sem kallar. Hver lína leggur saman áskriftarnotkun allra viðskiptavina viðkomandi samstarfsaðila á reikningstímabilinu, þar á meðal viðskiptavina sem slitu sambandinu á tímabilinu.

## Beiðni
`period` = `currentMonth` (sjálfgefið) eða `previousMonth`. Eða tilgreind `startDate` + `endDate` (yyyy-MM-dd).

## Svar
- `rows[]` — ein lína fyrir hvern samstarfsaðila:
  - `partnerTenantIdHash`, `partnerCompanyName`, `partnerFriendlyName`
  - `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
  - `tiers[]` — línur fyrir hvert þrep með `name`, `limitPerDay`, `customerCount`, `capacityPerDay`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

