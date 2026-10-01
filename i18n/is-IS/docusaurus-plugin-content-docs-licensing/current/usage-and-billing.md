---
id: usage-and-billing
title: "Notkun og reikningsfærsla"
sidebar_position: 8
description: "Hver rukkar hvern, hvernig notkun er tilkynnt, og síðurnar og skilaboðategundirnar sem viðskiptavinir, samstarfsaðilar og söluaðilar nota til að skoða hana."
---

## Hver rukkar hvern

| Reikningur | Frá | Til | Byggir á |
|---|---|---|---|
| Áskriftarnotkun | **Samstarfsaðili** | **viðskiptavinir** hans | Skilaboðunum sem hver viðskiptavinur notaði í mánuðinum, eftir [gjaldfærslutegund](./license-types.md#charge-types), auk þreps álagsþaks ofan við Frítt ef viðskiptavinurinn valdi slíkt - á því verði sem samið var um á milli þeirra. |
| Reikningsfærsla samstarfsaðila | **Söluaðili** | **samstarfsaðilar** hans | Áskriftarnotkun og þrepum allra viðskiptavina hvers samstarfsaðila. |
| Fyrirframgreiddur kvóti | Origo | leigjandi með fyrirframgreitt leyfi | Keyptum skilaboðakvóta, fyrir hvern pott. |

Notkun á fyrirframgreiddu leyfi birtist aldrei í reikningsfærslu samstarfsaðila eða söluaðila.
Viðskiptavinur sem sambandinu lauk við á tímabilinu er áfram með fyrir þá áskriftarnotkun sem hann
hafði fyrir uppsögnina.

## Hvernig notkun er tilkynnt

Hvert fyrirtæki tilkynnir gjaldskyld skilaboð sín til leyfisþjónustunnar einu sinni á dag, fyrir
hvern dag og hverja gjaldfærslutegund, í bakgrunnsverki sem fyrsta gjaldskylda kall dagsins ræsir.
**Samstilla** á Uppsetningu Bifröst tilkynnir öll óafgreidd skilaboð strax (nema skilaboð síðustu
fimm mínútna). Þar til skilaboð hafa verið tilkynnt eru þau talin sem *ótilkynnt* í upplýsingareitnum
Leyfi. Notkun úr sandkassaumhverfum er tilkynnt sérstaklega og er ekki rukkuð.

Hver tilkynning bætir við nýjum notkunarfærslum; færslu er aldrei breytt eftir á. Dagur getur því
haft nokkrar færslur af sömu gjaldfærslutegund - eina fyrir hverja tilkynningu - og notkun dagsins er
summa magns þeirra. Hvert skilaboð er tilkynnt nákvæmlega einu sinni, líka þegar tilkynning rofnar
og er reynd aftur.

Notkun er tilkynnt degi eða meira eftir að hún varð þegar fyrirtæki kallar ekkert daginn eftir eða
tilkynningin mistekst. Hver notkunarfærsla ber því tvær dagsetningar: **notkunardag** (daginn sem
skilaboðin voru notuð) og **skráningardag** (daginn sem færslan var tilkynnt).

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
`previousMonth` - eða tilgreindum `startDate` og `endDate` (`yyyy-MM-dd`), og `dateBasis`:
`usageDate` (sjálfgefið) síar tímabilið á notkunardag, `reportedDate` á skráningardag. Svör þeirra
innihalda:

- **samtölur** - fjölda viðskiptavina, viðskiptavina yfir fría þrepinu, skilaboð eftir
  gjaldfærslutegund (`userMessages`, `appMessages`, `internalMessages`, `demoMessages`,
  `supportMessages`) og heildargetu álagsþaks á dag;
- **þrep** - fyrir hvert þrep: köll á dag, fjölda viðskiptavina á því og getu á dag;
- **línur** - ein fyrir hvern viðskiptavin (eða fyrir hvern samstarfsaðila í
  `Bifrost.Vendor.GetPartners`) með reikningsfærsluhætti, stöðu, skilaboðum og þrepi.

Rukkaðu eftir tölum lokaðs tímabils (`previousMonth`): notkun er tilkynnt daglega, svo yfirstandandi
mánuður heldur áfram að vaxa þar til honum lýkur. Með `dateBasis` = `reportedDate` breytist lokað
tímabil aldrei eftir á - notkun síðustu daga mánaðar sem er tilkynnt í næsta mánuði er rukkuð með
næsta mánuði.

Notkun af tegundinni Innri, Sýniumhverfi og Þjónustuaðili er tilkynnt aðskilin frá venjulegri
notendanotkun, svo samstarfsaðili geti ákveðið hvernig hann rukkar hana - til dæmis að rukka alls
ekki eigin innri notkun og sýninotkun.
