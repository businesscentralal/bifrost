---
id: bifrost-partner-getbillingsummary
title: "Bifrost.Partner.GetBillingSummary"
sidebar_label: "Bifrost.Partner.GetBillingSummary"
sidebar_position: 2.1
description: "Beiðni- og svarsamningur fyrir Bifrost.Partner.GetBillingSummary Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar heildartölum reikningsfærslu í einni línu fyrir samstarfsaðilann sem kallar, yfir alla áskriftarviðskiptavini hans.
Aðeins áskriftarnotkun er reikningsfærð: viðskiptavinur er talinn með á meðan hann er tengdur samstarfsaðilanum, og viðskiptavinur sem hætti í sambandinu á reikningstímabilinu (er aftur kominn í fyrirframgreitt) er áfram talinn með fyrir þá áskriftarnotkun sem hann hafði fyrir uppsögnina. Viðskiptavinir sem voru aldrei tengdir, og fyrirframgreidd notkun, eru undanskilin.

## Beiðni
`period` = `currentMonth` (sjálfgefið) eða `previousMonth`. Eða tilgreind `startDate` + `endDate` (yyyy-MM-dd).

## Svar
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `totalCapacityPerDay`
- `tiers[]` — línur fyrir hvert þrep með `name`, `limitPerDay`, `customerCount`, `capacityPerDay`
