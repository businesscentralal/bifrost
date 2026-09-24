---
id: bifrost-setup
title: "Uppsetning Bifröst"
sidebar_label: "Uppsetning"
sidebar_position: 22
---

Síðan **Uppsetning Bifröst** er miðlæg uppsetningarsíða Bifröst. Hér velur þú útfærsluna að baki hverjum viðskiptaþætti, stillir sjálfgefið tungumál og mánaðarlegan skilaboðakvóta, sérð um leyndarmál og leyfi og - fyrir söluaðila og samstarfsaðila - heldur utan um samstarfsaðilakerfið.

## Tilkynningar

Allar uppsetningartilkynningar Bifröst-fjölskyldunnar birtast hér og aldrei á síðu annars forrits. Eftir aðstæðum sérðu:

| Tilkynning | Aðgerð |
| --- | --- |
| _HTTP-biðlarabeiðnir eru ekki virkar fyrir: &lt;forrit&gt;_ | **Hefja uppsetningarleiðsögn** opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/) á HTTP-skrefinu. |
| _Notendaleyfissamningur Bifröst hefur ekki verið samþykktur fyrir þetta fyrirtæki_ | **Hefja uppsetningarleiðsögn**. Þar til samningurinn hefur verið samþykktur er öllum köllum fyrirtækisins hafnað. |
| _Skilaboðakvóti Bifröst er að klárast_ | Birtist þegar færri en 1.000 skilaboð eru eftir í potti fyrirframgreidds leyfis. |
| _Villuleitarstilling beiðna er VIRK_ | Áminning um að slökkva á **Villuleitarstilling beiðna** að villuleit lokinni. |
| _Þessi leigjandi má skrá sig sem söluaðili í Bifröst_ | **Skrá sem söluaðili** - sjá [Að starfa sem söluaðili](/foundation/licensing/vendor/). |
| _Bifröst söluaðili hefur boðið þessum leigjanda sem samstarfsaðila_ | **Skrá sem samstarfsaðili** - sjá [Að starfa sem samstarfsaðili](/foundation/licensing/partner/). |
| _Bifröst samstarfsaðili hefur boðið þessum leigjanda sem viðskiptavin_ | **Skrá sem viðskiptavinur** - færir leigjandann á áskriftarleyfi. Sjá [Að vera viðskiptavinur](/foundation/licensing/customer/). |
| _Óafgreiddar uppsagnarbeiðnir viðskiptavina / samstarfsaðila bíða yfirferðar_ | Opnaðu **Óafgreiddar uppsagnarbeiðnir viðskiptavina** eða **Óafgreiddar uppsagnarbeiðnir samstarfsaðila**. |
| _Samstarfsaðili / Söluaðili … hafnaði uppsagnarbeiðni_ | Sýnir ástæðuna sem samstarfsaðilinn eða söluaðilinn gaf. |
| _Samstarfi þessa leigjanda við Bifröst samstarfsaðila er lokið_ / _Bifröst söluaðili hefur sagt upp þessum samstarfsaðila_ | Uppsögn var virkjuð við samstillingu - sjá [Úrsögn og uppsögn](/foundation/licensing/leaving-and-cancelling/). |

Tilkynningar samstarfsaðilakerfisins birtast aðeins notendum með leyfisstjórnunarheimild (heimildasamstæðan `BIFROST LicAdm ori`). Engin tilkynning er um vantandi auðkenni: auðkenni sem hefur ekki verið skráð gerir óvirkar þær skilaboðategundir sem þurfa á því að halda. Skráðu auðkenni með **Leyndarmál** eða í leiðsögninni.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Tegund lánamarks viðskiptavinar** | Útfærslan sem `Customer.CreditLimit.Get` notar. Sjálfgefna útfærslan notar staðlaðan lánamarksútreikning Business Central. Önnur forrit geta bætt við útfærslum með því að víkka upptalninguna. |
| **Vikmörk lánamarks %** | Prósenta (0–100) sem bætist ofan á lánamark viðskiptavinar. Með 10 % og lánamarki upp á 10.000 SGM getur viðskiptavinurinn notað allt að 11.000 SGM áður en hann er merktur. |
| **Tegund yfirlits viðskiptavinar** | Útfærslan sem `Customer.Statement.PDF` notar. |
| **Tegund verðútreiknings vöru** | Útfærslan sem `Item.Price.Get` notar. Sjálfgefna útfærslan les virkar línur söluverðlista, þar á meðal verðlista fyrir tiltekinn viðskiptavin og alla viðskiptavini, með VSK. |
| **Sjálfgefinn tungumálakóði** | Tungumálið sem notað er fyrir skilaboð sem senda ekki `lcid`. Ef reiturinn er auður er tungumál fyrirtækisupplýsinga notað og síðan enska (1033). |
| **Breytingaskrárvernd** | Hvaða reiti `Data.Records.Set` má skrifa, byggt á því hvort breytingaskráin nær yfir þá. **Opið** (sjálfgefið) - engin athugun. **Lokað** - aðeins reitir sem breytingaskráin nær yfir. **Með þvingunarheimild** - eins og Lokað, en kallari með heimildasamstæðuna `BIFROST Force ori` getur sent `"force": true`. Undanþágur eru skráðar á [Undanþágur breytingaskrárverndar](/help/foundation/changelog-guard-exceptions/). |
| **Tegund heitis fyrirtækis í útflutningi** | Hvaða heiti fyrirtækis `CSV.Records.Get` og `CSV.DeletedRecords.Get` skrifa í dálkinn `$Company`: **Heiti fyrirtækis** (sjálfgefið, stöðugt) eða **Birtingarheiti fyrirtækis** (notar Heiti fyrirtækis ef birtingarheitið er autt). |
| **Sjálfgefin sviðsmynd tölvupósts** | Sviðsmynd tölvupósts sem ræður hvaða sendingarreikningur er valinn þegar beiðni tilgreinir engan. |
| **Villuleitarstilling beiðna** | Vistar óhulið innihald beiðna og svara í heild sinni í [Annál beiðna](/help/foundation/bifrost-request-log/). Notaðu aðeins við villuleit. Krefst heimildasamstæðunnar `BIFROST ReqLgAdm ori`. |
| **Mánaðarlegur skilaboðakvóti fyrirtækis** | Hámarksfjöldi gjaldskyldra skilaboða sem fyrirtækið má nota í almanaksmánuði, á hvorri leyfistegundinni sem er. `0` þýðir engin takmörk. Þegar kvótanum er náð er köllum hafnað til næsta mánaðar. Ekki framfylgt í sandkassa. Sjá [Mánaðarlegir kvótar](/foundation/licensing/license-types/#monthly-quotas). |

Flipinn **Umhverfi** (aðeins í skýinu) sýnir **Heiti umhverfis**, **Kenni fyrirtækis**, **Azure leigjandakenni**, **Vefslóð verkefna-API** og **Vefslóð biðraðar-API** þessa fyrirtækis ásamt **Biðja um Tengingu**, texta sem þú getur límt inn í gervigreindaraðstoðarmann til að tengja hann við þetta umhverfi.

Síðan sýnir einnig **Tiltækar skilaboðategundir** og, fyrir leyfisstjóra utan sandkassa, [upplýsingareitinn Leyfi](/help/foundation/license-fact-box/).

## Aðgerðir

| Flokkur | Aðgerð | Lýsing |
| --- | --- | --- |
| Skilaboð | **Bifröst skilaboð** | Skilaboðin í biðröðinni. |
| | **Annáll beiðna** | Útleiðar HTTP-beiðnir þínar - sjá [Annáll beiðna Bifröst](/help/foundation/bifrost-request-log/). |
| | **Eyðingaskrá** / **Uppsetning eyðingarskráningar** | Endurskoðunarskrá yfir eyddar færslur og uppsetning hennar. |
| Uppsetning | **Uppsetning notenda** | Uppsetning fyrir hvern notanda: tengdar færslur, kerfisfyrirmæli, mánaðarlegur skilaboðakvóti. |
| | **Svæðisaðgangur** | Lestrar- og skrifheimildir á reitastigi - sjá [Svæðisaðgangar Bifröst](/help/foundation/bifrost-field-accesses/). |
| | **Undanþágur breytingaskrárverndar**, **Uppsetning breytingaskrár**, **Varðveislureglur** | Undanþágur frá breytingaskrárvernd, hvaða reiti breytingaskráin nær yfir og sjálfvirk hreinsun. |
| | **Leyndarmál** | Leyndarmálin sem öll uppsett Bifröst-forrit þurfa - sjá [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/). |
| | **Uppsetningarleiðsögn** | Opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/). |
| Leyfi | **Samstilla** | Tilkynnir óskráða notkun til leyfisþjónustunnar, uppfærir stöðu leyfisins og virkjar boð, uppsagnir og niðurstöður uppsagnarbeiðna. Keyrir einnig einu sinni á dag í bakgrunni. |
| | **Afturkalla samþykki notendaleyfissamnings** | Dregur samþykki leyfissamningsins til baka fyrir þetta fyrirtæki; köllum er hafnað þar til leiðsögnin hefur verið keyrð aftur. |
| | **Leyfisnotkun** | Notkunarfærslur leigjandans - sjá [Notkunarfærslur Bifröst](/help/foundation/license-usage/). |
| | **Stilla álagsþak** | Leigjendur á áskriftarleyfi, aðeins í framleiðsluumhverfi - sjá [Stilla álagsþak](/help/foundation/rate-limit-configuration/). |
| | **Skrá söluaðila** | Leigjendur sem hafa verið samþykktir sem söluaðilar - sjá [Bifröst söluaðilaskráning](/help/foundation/vendor-onboarding-wizard/). |
| | **Umsjón samstarfsaðila**, **Óafgreiddar uppsagnarbeiðnir samstarfsaðila**, **Afskrá sem söluaðili** | Söluaðilar - sjá [Að starfa sem söluaðili](/foundation/licensing/vendor/). |
| | **Umsjón viðskiptavina** | Samstarfsaðilar og söluaðilar - sjá [Umsjón viðskiptavina](/help/foundation/customer-management/). |
| | **Óafgreiddar uppsagnarbeiðnir viðskiptavina**, **Óska eftir uppsögn hjá söluaðila** | Samstarfsaðilar - sjá [Að starfa sem samstarfsaðili](/foundation/licensing/partner/). |
| | **Óska eftir uppsögn hjá samstarfsaðila** | Viðskiptavinir - sjá [Að vera viðskiptavinur](/foundation/licensing/customer/). |
| Tengingar | **Microsoft Copilot**, **OpenAI ChatGPT** | Opna Bifröst-tenginguna í verslun hvors gervigreindarvirkis. |
| Minni | **Minni**, **Notandaminni** | Minnisfærslur fyrir fyrirtækið og fyrir notandann. |
| | **Þýðingar Bifröst**, **Samþætting Bifröst** | Þýðingar og samþættingarskráin. |
| Forrit | **Finna forrit** | Skrá yfir forrit sem byggja á Bifröst. Uppsett Bifröst-forrit bæta eigin uppsetningaraðgerð við þennan flokk. |

## Ábendingar

-   Uppsetningarfærslan er búin til sjálfkrafa þegar þú opnar síðuna í fyrsta skipti.
-   Breyting á **Sjálfgefinn tungumálakóði** tekur strax gildi fyrir öll síðari skilaboð.
-   Leyfisaðgerðirnar birtast aðeins notendum með leyfisstjórnunarheimild.
