---
id: bifrost-partner-getcustomers
title: "Bifrost.Partner.GetCustomers"
sidebar_label: "Bifrost.Partner.GetCustomers"
sidebar_position: 2.2
description: "Beiðni- og svarsamningur fyrir Bifrost.Partner.GetCustomers Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar reikningslínum fyrir hvern viðskiptavin samstarfsaðilans sem kallar.

## Beiðni
```json
{ "period": "currentMonth" }
```

## Svar
- `rows[]` — ein lína fyrir hvern viðskiptavin:
  - `customerTenantIdHash`, `companyName`, `friendlyName`
  - `billingMode`, `state`, `userMessages`, `appMessages`
  - `rateLimitTier`, `rateLimitPerDay`, `aboveFreeTier`
