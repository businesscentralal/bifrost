---
id: bifrost-vendor-getcustomers
title: "Bifrost.Vendor.GetCustomers"
sidebar_label: "Bifrost.Vendor.GetCustomers"
sidebar_position: 2.6
description: "Beiðni- og svarsamningur fyrir Bifrost.Vendor.GetCustomers Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar reikningslínum fyrir hvern viðskiptavin söluaðilans sem kallar. Valfrjálsa sían `partnerTenantId` þrengir niðurstöðuna að einum samstarfsaðila.

## Beiðni
```json
{ "period": "currentMonth", "partnerTenantId": "<optional partner GUID>" }
```

## Svar
- `rows[]` — ein lína fyrir hvern viðskiptavin:
  - `customerTenantIdHash`, `companyName`, `friendlyName`, `partnerTenantIdHash`
  - `billingMode`, `state`, `userMessages`, `appMessages`
  - `rateLimitTier`, `rateLimitPerDay`, `aboveFreeTier`
