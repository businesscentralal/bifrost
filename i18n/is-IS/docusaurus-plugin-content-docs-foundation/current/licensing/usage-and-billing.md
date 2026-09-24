---
id: usage-and-billing
title: "Notkun og reikningsfærsla"
sidebar_position: 8
description: "Hver rukkar hvern, hvernig notkun er tilkynnt, og síðurnar og skilaboðategundirnar sem viðskiptavinir, samstarfsaðilar og söluaðilar nota til að skoða hana."
---

## Hver rukkar hvern

| Reikningur | Frá | Til | Byggir á |
|---|---|---|---|
| Áskriftarnotkun | **Samstarfsaðili** | **viðskiptavinir** hans | Notendaskilaboðunum og forritsskráningarskilaboðunum sem hver viðskiptavinur notaði í mánuðinum, auk þreps álagsþaks ofan við Frítt ef viðskiptavinurinn valdi slíkt - á því verði sem samið var um á milli þeirra. |
| Reikningsfærsla samstarfsaðila | **Söluaðili** | **samstarfsaðilar** hans | Áskriftarnotkun og þrepum allra viðskiptavina hvers samstarfsaðila. |
| Fyrirframgreiddur kvóti | Origo | leigjandi með fyrirframgreitt leyfi | Keyptum skilaboðakvóta, fyrir hvern pott. |

Notkun á fyrirframgreiddu leyfi birtist aldrei í reikningsfærslu samstarfsaðila eða söluaðila.
Viðskiptavinur sem sambandinu lauk við á tímabilinu er áfram með fyrir þá áskriftarnotkun sem hann
hafði fyrir uppsögnina.

## Hvernig notkun er tilkynnt

Hvert fyrirtæki tilkynnir gjaldskyld skilaboð sín til leyfisþjónustunnar einu sinni á dag, fyrir
hvern pott, í bakgrunnsverki sem fyrsta gjaldskylda kall dagsins ræsir. **Samstilla** á Uppsetningu
Bifröst tilkynnir öll óafgreidd skilaboð strax. Þar til skilaboð hafa verið tilkynnt eru þau talin
sem *ótilkynnt* í upplýsingareitnum Leyfi. Notkun úr sandkassaumhverfum er tilkynnt sérstaklega og
er ekki rukkuð.

## Hvar notkun er skoðuð

| Hver | Síða | Skilaboðategund |
|---|---|---|
| Allir leigjendur | [Leyfisnotkun](/help/foundation/license-usage/) - notkunarfærslur eigin fyrirtækja | [`Bifrost.Subscription.GetUsage`](/foundation/reference/message-types/bifrost-subscription-getusage/) (umfang `CurrentCompany`, `CurrentTenant`) |
| Allir leigjendur | [Upplýsingareiturinn Leyfi](/help/foundation/license-fact-box/) á Uppsetningu Bifröst | [`Bifrost.Subscription.GetStatus`](/foundation/reference/message-types/bifrost-subscription-getstatus/) |
| Samstarfsaðili | [Umsjón viðskiptavina](/help/foundation/customer-management/) - skilaboð það sem af er mánuði og þrep hvers viðskiptavinar; **Skoða notkun** fyrir færslurnar | [`Bifrost.Partner.GetBillingSummary`](/foundation/reference/message-types/bifrost-partner-getbillingsummary/), [`Bifrost.Partner.GetCustomers`](/foundation/reference/message-types/bifrost-partner-getcustomers/), `Bifrost.Subscription.GetUsage` (umfang `Partner` fyrir þig sjálfan, `CustomerTenant`) |
| Söluaðili | [Umsjón samstarfsaðila](/help/foundation/partner-management/) og Umsjón viðskiptavina | [`Bifrost.Vendor.GetBillingSummary`](/foundation/reference/message-types/bifrost-vendor-getbillingsummary/), [`Bifrost.Vendor.GetPartners`](/foundation/reference/message-types/bifrost-vendor-getpartners/), [`Bifrost.Vendor.GetCustomers`](/foundation/reference/message-types/bifrost-vendor-getcustomers/), `Bifrost.Subscription.GetUsage` (umfang `Vendor`, `Partner`, `CustomerTenant`) |

Allt þetta krefst heimildar til leyfisstjórnunar (heimildasafnið `BIFROST LicAdm ori`); yfirlit
samstarfsaðila og söluaðila krefjast auk þess hlutverks samstarfsaðila eða söluaðila.

## Reikningstímabil

Skilaboðategundir reikningsfærslunnar taka við `period` - `currentMonth` (sjálfgefið) eða
`previousMonth` - eða tilgreindum `startDate` og `endDate` (`yyyy-MM-dd`). Svör þeirra innihalda:

- **samtölur** - fjölda viðskiptavina, viðskiptavina yfir fría þrepinu, notendaskilaboð,
  forritsskráningarskilaboð og heildargetu álagsþaks á dag;
- **þrep** - fyrir hvert þrep: köll á dag, fjölda viðskiptavina á því og getu á dag;
- **línur** - ein fyrir hvern viðskiptavin (eða fyrir hvern samstarfsaðila í
  `Bifrost.Vendor.GetPartners`) með reikningsfærsluhætti, stöðu, skilaboðum og þrepi.

Rukkaðu eftir tölum lokaðs tímabils (`previousMonth`): notkun er tilkynnt daglega, svo yfirstandandi
mánuður heldur áfram að vaxa þar til honum lýkur.
