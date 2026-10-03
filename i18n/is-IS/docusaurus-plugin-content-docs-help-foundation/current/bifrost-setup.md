---
id: bifrost-setup
title: "Uppsetning Bifröst"
---

Síðan **Uppsetning Bifröst** er miðlæg uppsetningarsíða Bifröst. Hér velur þú útfærsluna að baki hverjum viðskiptaþætti, stillir sjálfgefið tungumál og mánaðarlegan skilaboðakvóta, sérð um leyndarmál og leyfi og - fyrir söluaðila og samstarfsaðila - heldur utan um samstarfsaðila sína og viðskiptavini.

## Tilkynningar

Allar uppsetningartilkynningar Bifröst-fjölskyldunnar birtast hér og aldrei á síðu annars forrits. Eftir aðstæðum sérðu:

| Tilkynning | Aðgerð |
| --- | --- |
| _HTTP-biðlarabeiðnir eru ekki virkar fyrir: &lt;forrit&gt;_ | **Hefja uppsetningarleiðsögn** opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/) á HTTP-skrefinu. |
| _Notendaleyfissamningur Bifröst hefur ekki verið samþykktur fyrir þetta fyrirtæki_ | **Hefja uppsetningarleiðsögn**. Þar til samningurinn hefur verið samþykktur er öllum köllum fyrirtækisins hafnað. |
| _Skilaboðakvóti Bifröst er að klárast_ | Birtist þegar færri en 200 skilaboð eru eftir í potti fyrirframgreidds leyfis. |
| _Villuleitarstilling beiðna er VIRK_ | Áminning um að slökkva á **Villuleitarstilling beiðna** að villuleit lokinni. |
| _Þessi leigjandi má skrá sig sem söluaðili í Bifröst_ | **Skrá sem söluaðili** - opnar [Bifröst söluaðilaskráningu](/help/foundation/vendor-onboarding-wizard/). |
| _Bifröst söluaðili hefur boðið þessum leigjanda sem samstarfsaðila_ | **Skrá sem samstarfsaðili** - skráir leigjandann sem samstarfsaðila. |
| _Bifröst samstarfsaðili hefur boðið þessum leigjanda sem viðskiptavin_ | **Skrá sem viðskiptavinur** - færir leigjandann á [áskriftarleyfi](/licensing/license-types/#subscription). Ef fleiri en einn samstarfsaðili hafa boðið leigjandanum opnast [Óafgreidd boð viðskiptavinar](/help/foundation/pending-customer-invites/). |
| _Óafgreiddar uppsagnarbeiðnir viðskiptavina / samstarfsaðila bíða yfirferðar_ | Opnaðu [Óafgreiddar uppsagnarbeiðnir viðskiptavina](/help/foundation/pending-customer-leave-requests/) eða [Óafgreiddar uppsagnarbeiðnir samstarfsaðila](/help/foundation/pending-partner-leave-requests/). |
| _Samstarfsaðili / Söluaðili … hafnaði uppsagnarbeiðni_ | Sýnir ástæðuna sem samstarfsaðilinn eða söluaðilinn gaf. |
| _Samstarfi þessa leigjanda við Bifröst samstarfsaðila er lokið_ / _Bifröst söluaðili hefur sagt upp þessum samstarfsaðila_ | Uppsögn var virkjuð við samstillingu. Leigjandi sem hefur lokið sambandi við samstarfsaðila er aftur á fyrirframgreiddu leyfi. |

Tilkynningar samstarfsaðilakerfisins birtast aðeins notendum með leyfisstjórnunarheimild (heimildasamstæðan `BIFROST LicAdm ori`). Engin tilkynning er um vantandi auðkenni: auðkenni sem hefur ekki verið skráð gerir óvirkar þær skilaboðategundir sem þurfa á því að halda. Skráðu auðkenni með **Leyndarmál** eða í leiðsögninni.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Tegund lánamarks viðskiptavinar** | Útfærslan sem notuð er þegar Bifröst les lánamark viðskiptavinar. Sjálfgefna útfærslan notar staðlaðan lánamarksútreikning Business Central. |
| **Vikmörk lánamarks %** | Prósenta (0–100) sem bætist ofan á lánamark viðskiptavinar. Með 10 % og lánamarki upp á 10.000 SGM getur viðskiptavinurinn notað allt að 11.000 SGM áður en hann er merktur. |
| **Tegund yfirlits viðskiptavinar** | Útfærslan sem notuð er þegar Bifröst býr til yfirlit viðskiptavinar sem PDF-skrá. |
| **Tegund verðútreiknings vöru** | Útfærslan sem notuð er þegar Bifröst reiknar söluverð vöru. Sjálfgefna útfærslan les virkar línur söluverðlista, þar á meðal verðlista fyrir tiltekinn viðskiptavin og alla viðskiptavini, með VSK. |
| **Sjálfgefinn tungumálakóði** | Tungumálið sem notað er fyrir skilaboð sem senda ekki `lcid`. Ef reiturinn er auður er tungumál fyrirtækisupplýsinga notað og síðan enska (1033). |
| **Breytingaskrárvernd** | Hvaða reitum almenn skrif færslna gegnum Bifröst mega breyta, byggt á því hvort breytingaskráin nær yfir þá. **Lokað** (sjálfgefið) - aðeins reitir sem breytingaskráin nær yfir. **Opið** - engin athugun. **Með þvingunarheimild** - eins og Lokað, en kallari með heimildasamstæðuna `BIFROST Force ori` getur sent `"force": true`. Undanþágur eru skráðar á [Undanþágur breytingaskrárverndar](/help/foundation/changelog-guard-exceptions/). |
| **Tegund heitis fyrirtækis í útflutningi** | Hvaða heiti fyrirtækis CSV-útflutningur færslna eða eyddra færslna skrifar í dálkinn `$Company`: **Heiti fyrirtækis** (sjálfgefið, stöðugt) eða **Birtingarheiti fyrirtækis** (notar Heiti fyrirtækis ef birtingarheitið er autt). |
| **Sjálfgefin sviðsmynd tölvupósts** | Sviðsmynd tölvupósts sem ræður hvaða sendingarreikningur er valinn þegar beiðni tilgreinir engan. |
| **Villuleitarstilling beiðna** | Vistar óhulið innihald beiðna og svara í heild sinni í [Annál beiðna](/help/foundation/bifrost-request-log/). Notaðu aðeins við villuleit. Krefst heimildasamstæðunnar `BIFROST ReqLgAdm ori`. |
| **Mánaðarlegur skilaboðakvóti fyrirtækis** | Hámarksfjöldi gjaldskyldra skilaboða sem fyrirtækið má nota í almanaksmánuði, á hvorri leyfistegundinni sem er. `0` þýðir engin takmörk. Þegar kvótanum er náð er köllum hafnað til næsta mánaðar. Ekki framfylgt í sandkassa. Í áskrift telur hann ekki forritsskráningarskilaboð. Talið út frá Bifröst-skilaboðum mánaðarins, svo geymdu Bifröst-skilaboð í minnst 31 dag í varðveislustefnunni. Sjá [Hvernig mánaðarlegu kvótarnir eru taldir](/licensing/license-types/#how-monthly-quotas-are-counted). |

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
| | **Undanþágur breytingaskrárverndar**, **Uppsetning breytingaskrár**, **Varðveislureglur** | Undanþágur frá breytingaskrárvernd, hvaða reiti breytingaskráin nær yfir og sjálfvirk hreinsun. Geymdu Bifröst-skilaboð í minnst 31 dag ef þú notar mánaðarlegu kvótana. |
| | **Leyndarmál** | Leyndarmálin sem öll uppsett Bifröst-forrit þurfa - sjá [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/). |
| | **Uppsetningarleiðsögn** | Opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/). |
| Leyfi | **Samstilla** | Tilkynnir óskráða notkun til leyfisþjónustunnar, uppfærir stöðu leyfisins og virkjar uppsagnir og niðurstöður uppsagnarbeiðna. Hún er það eina sem býður skráningu: tilkynningarnar Skrá sem söluaðili, Skrá sem samstarfsaðili og Skrá sem viðskiptavinur og aðgerðin **Skrá söluaðila** birtast aðeins eftir samstillingu. Daglega bakgrunnsverkið tilkynnir aðeins notkun. |
| | **Afturkalla samþykki notendaleyfissamnings** | Dregur samþykki leyfissamningsins til baka fyrir þetta fyrirtæki; köllum er hafnað þar til leiðsögnin hefur verið keyrð aftur. |
| | **Leyfisnotkun** | Notkunarfærslur leigjandans - sjá [Notkunarfærslur Bifröst](/help/foundation/license-usage/). |
| | **Stilla álagsþak** | Leigjendur á áskriftarleyfi, aðeins í framleiðsluumhverfi. Hækkar álagsþakið á sandkassanotkun um opinbera Bifröst MCP-þjóninn - sjá [Stilla álagsþak](/help/foundation/rate-limit-configuration/). |
| | **Skrá söluaðila** | Eftir samstillingu, fyrir leigjanda sem hefur verið samþykktur sem söluaðili og er ekki enn skráður - sjá [Bifröst söluaðilaskráning](/help/foundation/vendor-onboarding-wizard/). |
| | **Umsjón samstarfsaðila**, **Óafgreiddar uppsagnarbeiðnir samstarfsaðila**, **Afskrá sem söluaðili** | Söluaðilar - sjá [Umsjón samstarfsaðila](/help/foundation/partner-management/) og [Óafgreiddar uppsagnarbeiðnir samstarfsaðila](/help/foundation/pending-partner-leave-requests/). **Afskrá sem söluaðili** lýkur skráningu söluaðilans. |
| | **Umsjón viðskiptavina** | Aðeins samstarfsaðilar - sjá [Umsjón viðskiptavina](/help/foundation/customer-management/). |
| | **Óafgreiddar uppsagnarbeiðnir viðskiptavina**, **Óska eftir uppsögn hjá söluaðila** | Samstarfsaðilar - sjá [Óafgreiddar uppsagnarbeiðnir viðskiptavina](/help/foundation/pending-customer-leave-requests/). **Óska eftir uppsögn hjá söluaðila** biður söluaðilann að ljúka sambandinu. |
| | **Óska eftir uppsögn hjá samstarfsaðila** | Viðskiptavinir - biður samstarfsaðilann að ljúka sambandinu. Þegar samstarfsaðilinn staðfestir fer leigjandinn aftur á fyrirframgreitt leyfi við næstu samstillingu. |
| Tengingar | **Microsoft Copilot**, **OpenAI ChatGPT** | Opna Bifröst-tenginguna í verslun hvors gervigreindarvirkis. |
| Minni | **Minni**, **Notandaminni** | Minnisfærslur fyrir fyrirtækið og fyrir notandann. |
| | **Þýðingar Bifröst**, **Samþætting Bifröst** | Þýðingar og samþættingarskráin. |
| Forrit | **Finna forrit** | Skrá yfir forrit sem byggja á Bifröst. Uppsett Bifröst-forrit bæta eigin uppsetningaraðgerð við þennan flokk. |

## Ábendingar

-   Uppsetningarfærslan er búin til sjálfkrafa þegar þú opnar síðuna í fyrsta skipti.
-   Breyting á **Sjálfgefinn tungumálakóði** tekur strax gildi fyrir öll síðari skilaboð.
-   Leyfisaðgerðirnar birtast aðeins notendum með leyfisstjórnunarheimild.
