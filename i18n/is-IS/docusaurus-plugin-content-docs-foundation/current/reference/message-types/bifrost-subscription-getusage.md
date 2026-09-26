---
id: bifrost-subscription-getusage
title: "Bifrost.Subscription.GetUsage"
sidebar_label: "Bifrost.Subscription.GetUsage"
sidebar_position: 2.4
description: "Beiðni- og svarsamningur fyrir Bifrost.Subscription.GetUsage Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar notkunarfærslum sem hafa verið tilkynntar leyfisþjónustunni, í síðum. Kallarinn þarf að hafa heimildasamstæðuna License Admin.
Skilaboðin samstilla hvorki né breyta gögnum.

## Umfang
Valfrjálsi reiturinn `scope` velur fyrirspurnarhátt. Ef honum er sleppt er `CurrentCompany` notað vegna afturvirks samhæfis.

| Umfang | Tilgangur | Nauðsynlegt hlutverk | Viðbótarreitir |
|-------|---------|--------------|--------------|
| CurrentCompany | Notkun fyrirtækis í leigjanda kallarans. | License Admin | `companyId` (GUID, valfrjálst; sjálfgefið er núverandi fyrirtæki). |
| CurrentTenant | Notkun allra fyrirtækja í leigjanda kallarans. | License Admin | — |
| CustomerTenant | Notkun eins leigjanda viðskiptavinar sem kallarinn er tengdur. | License Admin + hlutverk söluaðila eða samstarfsaðila. Markið verður að vera viðskiptavinur kallarans í framleiðsluumhverfi. | `customerTenantId` (óunnið GUID Entra-leigjanda). |
| Partner | Samanlögð notkun allra viðskiptavina samstarfsaðila. | License Admin + hlutverk söluaðila (hvaða samstarfsaðili sem er). Samstarfsaðilar mega aðeins senda eigið leigjandaauðkenni. | `partnerTenantId` (óunnið GUID Entra-leigjanda). |
| Vendor | Samanlögð notkun allra viðskiptavina söluaðilaleigjandans sem kallar. | License Admin + hlutverk söluaðila. | — |

Umfangið Partner og Vendor nær yfir alla viðskiptavini í framleiðsluumhverfi sem eru tengdir viðkomandi samstarfsaðila eða söluaðila, þar á meðal viðskiptavini sem hafa slitið sambandinu, svo að notkun frá því fyrir uppsögn er áfram sýnileg.
Viðskiptavinur er tengdur þegar hann hefur samþykkt boð frá samstarfsaðila söluaðilans.

## Almennar síur
`licenseType` takmarkar niðurstöðuna við eina gjaldfærslutegund: `User`, `App Registration`, og í áskrift einnig `Internal`, `Demo` og `Support`. `startDate` og `endDate` afmarka dagsetninguna (yyyy-MM-dd); `dateBasis` velur hvaða dagsetningu: `usageDate` (sjálfgefið, daginn sem skilaboðin voru notuð) eða `reportedDate` (daginn sem notkunin var tilkynnt til leyfisþjónustunnar, sem getur verið degi eða meira seinna). Dagur getur haft nokkrar notkunarfærslur af sömu gjaldfærslutegund, eina fyrir hverja tilkynningu; leggðu saman `quantity` þeirra. `skip` / `take` veita afmarkaða síðuskiptingu. Allar síur eiga við um öll umfang, þar á meðal umfangið Partner og Vendor.

## Dæmi um beiðnir
CurrentCompany (sjálfgefið):
```json
{ "companyId": "00000000-0000-0000-0000-000000000000", "licenseType": "User", "startDate": "2026-09-01", "endDate": "2026-09-30", "skip": 0, "take": 50 }
```
CurrentTenant:
```json
{ "scope": "CurrentTenant", "skip": 0, "take": 50 }
```
CustomerTenant (söluaðili eða samstarfsaðili):
```json
{ "scope": "CustomerTenant", "customerTenantId": "00000000-0000-0000-0000-000000000000", "skip": 0, "take": 50 }
```
Partner (söluaðili):
```json
{ "scope": "Partner", "partnerTenantId": "00000000-0000-0000-0000-000000000000", "skip": 0, "take": 50 }
```
Vendor:
```json
{ "scope": "Vendor", "skip": 0, "take": 50 }
```

## Svar
```json
{ "status": "Success", "scope": "Vendor", "dateBasis": "usageDate", "totalCount": 128, "count": 50, "skip": 0, "take": 50, "items": [ /* usage documents */ ] }
```

## Heimildavillur
- `The specified customer tenant is not linked to the caller.` — beðið var um umfangið CustomerTenant fyrir leigjanda sem er ekki á meðal viðskiptavina kallarans.
- `Partners may only request usage for their own tenant.` — kallari sem er aðeins samstarfsaðili bað um umfangið Partner fyrir annað auðkenni samstarfsaðila.
- `Scope '<scope>' requires the Vendor role.` — beðið var um umfangið Vendor eða Partner án hlutverks söluaðila (nema Partner fyrir eigin leigjanda).

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

