---
id: bifrost-vendor-getbillingsummary
title: "Bifrost.Vendor.GetBillingSummary"
sidebar_label: "Bifrost.Vendor.GetBillingSummary"
sidebar_position: 2.5
description: "Beiðni- og svarsamningur fyrir Bifrost.Vendor.GetBillingSummary Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar heildartölum reikningsfærslu í einni línu fyrir söluaðilann sem kallar, yfir alla áskriftarviðskiptavini allra samstarfsaðila hans.
Aðeins áskriftarnotkun er reikningsfærð: viðskiptavinur er talinn með á meðan hann er tengdur samstarfsaðilanum, og viðskiptavinur sem hætti í sambandinu á reikningstímabilinu (er aftur kominn í fyrirframgreitt) er áfram talinn með fyrir þá áskriftarnotkun sem hann hafði fyrir uppsögnina. Viðskiptavinir sem voru aldrei tengdir, og fyrirframgreidd notkun, eru undanskilin.

## Beiðni
`period` = `currentMonth` (sjálfgefið) eða `previousMonth`. Eða tilgreindu `startDate` og `endDate` (yyyy-MM-dd).
```json
{ "period": "currentMonth" }
```

## Svar
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
- `tiers[]` — línur fyrir hvert þrep með `name`, `limitPerDay`, `customerCount`, `capacityPerDay`
- `billingPeriodStart` / `billingPeriodEnd`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

