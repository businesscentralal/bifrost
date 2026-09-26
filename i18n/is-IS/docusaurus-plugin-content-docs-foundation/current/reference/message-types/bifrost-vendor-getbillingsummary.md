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
`dateBasis` = `usageDate` (sjálfgefið) síar tímabilið á daginn sem skilaboðin voru notuð; `reportedDate` síar á daginn sem notkunin var tilkynnt til leyfisþjónustunnar. Notkun getur verið tilkynnt degi eða meira eftir að hún varð, svo reikningsfærsla eftir `reportedDate` breytir aldrei tímabili sem þegar er lokað. Öðrum gildum er hafnað.
```json
{ "period": "currentMonth" }
```

## Svar
- `totals` — `totalCustomers`, `customersAboveFreeTier`, `userMessages`, `appMessages`, `internalMessages`, `demoMessages`, `supportMessages`, `totalCapacityPerDay`
- `internalMessages` — notkun fólks hjá viðskiptavini sem er eigin leigjandi samstarfsaðilans; `demoMessages` — notkun hjá viðskiptavini sem samstarfsaðilinn merkti sem sýniumhverfi; `supportMessages` — notkun notenda samstarfsaðilans sem vinna hjá viðskiptavini gegnum framselda samstarfsaðilaáskrift. Hvert þeirra er tilkynnt aðskilið frá `userMessages` (venjuleg notkun viðskiptavina) og `appMessages` (forritsskráningar).
- `dateBasis` — dagsetningargrunnurinn sem tímabilið var síað á
- `tiers[]` — línur fyrir hvert þrep með `name`, `limitPerDay`, `customerCount`, `capacityPerDay`
- `billingPeriodStart` / `billingPeriodEnd`
