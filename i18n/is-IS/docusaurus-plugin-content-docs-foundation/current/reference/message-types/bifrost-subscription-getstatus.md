---
id: bifrost-subscription-getstatus
title: "Bifrost.Subscription.GetStatus"
sidebar_label: "Bifrost.Subscription.GetStatus"
sidebar_position: 2.3
description: "Beiðni- og svarsamningur fyrir Bifrost.Subscription.GetStatus Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar núverandi stillingum viðskiptavinar, aðgangi, leyfisstöðu, inneign og notkun yfirstandandi mánaðar frá leyfisþjónustunni.

## Beiðni
```json
{ "companyId": "optional-company-guid" }
```

Auðkenni fyrirtækisins er GUID. Útfærslan reiknar tætigildi (hash) úr því sjálf; kallarar mega ekki senda tætigildi.

## Svar
Svarið inniheldur status, configuration, account, licenseStatus og currentMonthUsage. Birtingarreitir nota heiti fyrirtækis, söluaðila og samstarfsaðila þar sem þau liggja fyrir.

Þessi skilaboð eru í boði í SaaS-framleiðsluumhverfi (Production) og í uppsetningu á staðnum (OnPrem) en eru óvirk í SaaS-prófunarumhverfi (Sandbox).
