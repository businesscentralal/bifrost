---
id: bifrost-setup
title: "Uppsetning Bifröst"
---

Síðan **Uppsetning Bifröst** er miðlæg uppsetningarsíða Bifröst. Hér velur þú útfærsluna að baki hverjum viðskiptaþætti, stillir sjálfgefið tungumál og mánaðarlegan skilaboðakvóta og sérð um leyndarmál og leyfi.

## Tilkynningar

Allar uppsetningartilkynningar Bifröst-fjölskyldunnar birtast hér og aldrei á síðu annars forrits. Eftir aðstæðum sérðu:

| Tilkynning | Aðgerð |
| --- | --- |
| _HTTP-biðlarabeiðnir eru ekki virkar fyrir: &lt;forrit&gt;_ | **Hefja uppsetningarleiðsögn** opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/) á HTTP-skrefinu. |
| _Notendaleyfissamningur Bifröst hefur ekki verið samþykktur fyrir þetta fyrirtæki_ | **Hefja uppsetningarleiðsögn**. Þar til samningurinn hefur verið samþykktur er öllum köllum fyrirtækisins hafnað. |
| _Skilaboðakvóti Bifröst er að klárast_ | Birtist þegar færri en 200 skilaboð eru eftir í potti fyrirframgreidds leyfis. |
| _Villuleitarstilling beiðna er VIRK_ | Áminning um að slökkva á **Villuleitarstilling beiðna** að villuleit lokinni. |

Engin tilkynning er um vantandi auðkenni: auðkenni sem hefur ekki verið skráð gerir óvirkar þær skilaboðategundir sem þurfa á því að halda. Skráðu auðkenni með **Leyndarmál** eða í leiðsögninni.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Tegund lánamarks viðskiptavinar** | Útfærslan sem notuð er þegar Bifröst les lánamark viðskiptavinar. Sjálfgefna útfærslan notar staðlaðan lánamarksútreikning Business Central. |
| **Vikmörk lánamarks %** | Prósenta (0–100) sem bætist ofan á lánamark viðskiptavinar. Með 10 % og lánamarki upp á 10.000 SGM getur viðskiptavinurinn notað allt að 11.000 SGM áður en hann er merktur. |
| **Tegund yfirlits viðskiptavinar** | Útfærslan sem notuð er þegar Bifröst býr til yfirlit viðskiptavinar sem PDF-skrá. |
| **Tegund verðútreiknings vöru** | Útfærslan sem notuð er þegar Bifröst reiknar söluverð vöru. Sjálfgefna útfærslan les virkar línur söluverðlista, þar á meðal verðlista fyrir tiltekinn viðskiptavin og alla viðskiptavini, með VSK. |
| **Sjálfgefinn tungumálakóði** | Tungumálið sem notað er fyrir skilaboð sem senda ekki `lcid`. Ef reiturinn er auður er tungumál fyrirtækisupplýsinga notað og síðan enska (1033). |
| **Breytingaskrárvernd** | Hvaða reitum Bifröst má breyta, byggt á því hvort breytingaskráin nær yfir þá. **Lokað** (sjálfgefið) - aðeins reitir sem breytingaskráin skráir, reitir með [undanþágu](/help/foundation/changelog-guard-exceptions/) og reitir sem notandi hefur **Framhjá**-línu fyrir í [reitaaðgangi](/help/foundation/bifrost-field-accesses/). **Með þvingunarheimild** - eins og Lokað, og kallari með heimildasamstæðuna `BIFROST Force ori` getur þvingað breytinguna. **Opið** - engin athugun. Í öllum stillingum má þvinguð breyting notanda með `BIFROST Force ori` breyta [grunnstillingarreitum fyrirtækisins](/documentation/end-customers/data-access/#company-configuration-fields) (bókunardagsetningum, reikningstímabilum, númeraröðum, VSK-númeri og kennitölu fyrirtækisins) meðan fyrirtæki er sett upp. |
| **Tegund heitis fyrirtækis í útflutningi** | Hvaða heiti fyrirtækis CSV-útflutningur færslna eða eyddra færslna skrifar í dálkinn `$Company`: **Heiti fyrirtækis** (sjálfgefið, stöðugt) eða **Birtingarheiti fyrirtækis** (notar Heiti fyrirtækis ef birtingarheitið er autt). |
| **Sjálfgefin sviðsmynd tölvupósts** | Sviðsmynd tölvupósts sem ræður hvaða sendingarreikningur er valinn þegar beiðni tilgreinir engan. |
| **Villuleitarstilling beiðna** | Vistar óhulið innihald beiðna og svara í heild sinni í [Annál beiðna](/help/foundation/bifrost-request-log/). Notaðu aðeins við villuleit. Krefst heimildasamstæðunnar `BIFROST ReqLgAdm ori`. |
| **Virða næmi gagna** | Undir *Sýna meira*. Hvort reitirnir sem eru flokkaðir á [Næmi reita Bifröst](/help/foundation/bifrost-field-accesses/#field-sensitivities) eru faldir fyrir öllum notendum: **Slökkt** (sjálfgefið) felur ekkert, **Viðkvæmt** felur viðkvæmu reitina, **Viðkvæmt + Persónulegt** felur hvora tveggja. **Engin**-lína í reitaaðgangi opnar falinn reit fyrir einn notanda. |
| **Mánaðarlegur skilaboðakvóti fyrirtækis** | Hámarksfjöldi gjaldskyldra skilaboða sem fyrirtækið má nota í almanaksmánuði, á hvorri leyfistegundinni sem er. `0` þýðir engin takmörk. Þegar kvótanum er náð er köllum hafnað til næsta mánaðar. Í áskrift telur hann ekki forritsskráningarskilaboð. Talið út frá Bifröst-skilaboðum mánaðarins, svo geymdu Bifröst-skilaboð í minnst 31 dag í varðveislustefnunni. Sjá [Hvernig mánaðarlegu kvótarnir eru taldir](/licensing/license-types/#how-monthly-quotas-are-counted). Aðeins notendur með BIFROST Full ori eða SUPER geta breytt Mánaðarlegum skilaboðakvóta fyrirtækis á uppsetningarspjaldi Bifröst. Leyfisstjórnandi án þessara uppsetningarheimilda getur skoðað kvótann en ekki breytt honum, heldur ekki í breytingaham. Tilraun til að þvinga vistun er hafnað og vistaður kvóti helst óbreyttur. |

Flipinn **Umhverfi** (aðeins í skýinu) sýnir **Heiti umhverfis**, **Kenni fyrirtækis**, **Azure leigjandakenni**, **Vefslóð verkefna-API** og **Vefslóð biðraðar-API** þessa fyrirtækis ásamt **Biðja um Tengingu**, texta sem þú getur límt inn í gervigreindaraðstoðarmann til að tengja hann við þetta umhverfi.

Síðan sýnir einnig **Tiltækar skilaboðategundir** og, fyrir leyfisstjóra utan sandkassa, [upplýsingareitinn Leyfi](/help/foundation/license-fact-box/).

## Aðgerðir

| Flokkur | Aðgerð | Lýsing |
| --- | --- | --- |
| Skilaboð | **Bifröst skilaboð** | Skilaboðin í biðröðinni. |
| | **Annáll beiðna** | Útleiðar HTTP-beiðnir þínar - sjá [Annáll beiðna Bifröst](/help/foundation/bifrost-request-log/). |
| | **Eyðingaskrá** / **Uppsetning eyðingarskráningar** | Endurskoðunarskrá yfir eyddar færslur og uppsetning hennar. |
| Uppsetning | **Uppsetning notenda** | Uppsetning fyrir hvern notanda: tengdar færslur, kerfisfyrirmæli, mánaðarlegur skilaboðakvóti. |
| | **Kallarar** | Opnar listann **Bifrastarkallarar** fyrir þetta fyrirtæki: hvaða gervigreindarforrit (kallarar) mega fá samþykkt uppruna setu hér. Listinn birtist ekki í Leit; opnaðu hann með þessari aðgerð. Sjá [Samþykkja uppruna setu](/help/foundation/session-source-approval/). |
| | **Reitaaðgangur** | Opnar [yfirlit reitaaðgangs](/help/foundation/bifrost-field-accesses/): les- og skriflínur allra notenda og forrita. |
| | **Næmi reita** | Flokkun fyrirtækisins á reitum sem viðkvæmum eða persónulegum - sjá [Næmi reita Bifröst](/help/foundation/bifrost-field-accesses/#field-sensitivities). |
| | **Undanþágur breytingaskrárverndar**, **Uppsetning breytingaskrár**, **Varðveislureglur** | Undanþágur frá breytingaskrárvernd, hvaða reiti breytingaskráin nær yfir og sjálfvirk hreinsun. Geymdu Bifröst-skilaboð í minnst 31 dag ef þú notar mánaðarlegu kvótana. |
| | **Fjarlægja skráningar varðveislureglna** | Keyrðu hana í hverju fyrirtæki áður en þú fjarlægir Bifröst. Hún eyðir varðveislureglum annálstaflna Bifröst; engum Bifröst-gögnum er eytt. Krefst heimildasamstæðunnar Retention Pol. Admin eða SUPER. |
| | **Leyndarmál** | Leyndarmálin sem öll uppsett Bifröst-forrit þurfa - sjá [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/). |
| | **Uppsetningarleiðsögn** | Opnar [uppsetningarleiðsögnina](/help/foundation/bifrost-setup-wizard/). |
| Leyfi | **Samstilla** | Tilkynnir óskráða notkun til leyfisþjónustunnar og uppfærir stöðu leyfisins. Daglega bakgrunnsverkið tilkynnir aðeins notkun. |
| | **Afturkalla samþykki notendaleyfissamnings** | Dregur samþykki leyfissamningsins til baka fyrir þetta fyrirtæki; köllum er hafnað þar til leiðsögnin hefur verið keyrð aftur. |
| | **Tengingastaða** | Hvort náist í leyfisþjónustuna, hvaða tengingarleyndarmál eru aðgengileg, hvort uppurinn pottur loki á skilaboð, og keypt og skráð heildargildi leigjandans. |
| | **Leyfisnotkun** | Notkunarfærslur leigjandans - sjá [Notkunarfærslur Bifröst](/help/foundation/license-usage/). |
| Tengingar | **Anthropic Claude**, **Microsoft Copilot**, **OpenAI ChatGPT** | Opna Bifröst-tenginguna í verslun hvers aðstoðarmanns. |
| Minni | **Minni**, **Notandaminni** | Minnisfærslur fyrir fyrirtækið og fyrir notandann. |
| | **Þýðingar Bifröst**, **Samþætting Bifröst** | Þýðingar og samþættingarskráin. |
| Forrit | **Finna forrit** | Opnar listann Bifröst-forrit í Business Central, sem sýnir öll forrit sem byggja á Bifröst, hver þeirra eru uppsett, hvort nýrri útgáfa sé á AppSource og tengla á AppSource, skjölun og útgáfuupplýsingar; sjá [Bifröst-forrit](/help/foundation/bifrost-apps/). Uppsett Bifröst-forrit bæta eigin uppsetningaraðgerð við þennan flokk. |

## Kallarar

**Kallarar** opnar listann **Bifrastarkallarar** fyrir núverandi fyrirtæki. Aðeins samþykkt uppruna setu notar listann. Eftir uppsetningu eða uppfærslu eru þessi þekktu forrit bætt við einu sinni sem leyfð. Færslur sem eru þegar til staðar eru látnar í friði, svo kallari sem þú hefur slökkt á helst slökktur:

| Kóði | Lýsing |
| --- | --- |
| CLAUDE | Claude (claude.ai vefur, tölvuforrit og farsími) |
| CHATGPT | ChatGPT |
| M365COPILOT | Microsoft 365 Copilot / Teams |
| COPILOTSTUDIO | Copilot Studio (Power Platform tengill) |
| GROK | Grok |
| MISTRAL | Mistral |
| LOCAL | Staðbundinn biðlari (Claude Code, VS Code, Cursor, MCP Inspector) |

Óþekktur kallari er bættur sjálfkrafa við sem ekki leyfður, og lýsingin sett sem kóðinn.

**Leyft** ræður hvort kallarinn megi fá samþykkt setu í þessu fyrirtæki. Ef slökkt er á þessu fara allir uppruna setu sem samþykktir voru undir kallaranum í þessu fyrirtæki aftur í bið. Ef kveikt er aftur á **Leyft** eru þeir ekki samþykktir sjálfkrafa; hver notandi þarf að samþykkja aftur.

Notendur með `BIFROST SrcApAdm ori`, `BIFROST SrcApCfg ori` eða `BIFROST Full ori` geta breytt listanum og leyft kallara um leið og seta er samþykkt. Notendur með aðeins `BIFROST SrcApOwn ori` eða `BIFROST Read ori` geta séð kallarann en ekki breytt **Leyft** eða leyft kallara á samþykktarsíðunni.

Listinn stjórnar því hvaða forrit ná til Business Central í gegnum MCP. Hann er ekki öryggismörk gagnvart biðlara sem kallar beint á Cloud Events; sá biðlari þarf áfram auðkennt Entra-auðkenni, samþykkt Bifröst-forrit og samþykki uppruna setu fyrir hvern notanda.

Á meðan fyrirtækið er með einhvern kallara — þar á meðal þá sem voru settir inn við uppsetningu — er beiðni um samþykkt setu án kallarakóða hafnað. Ef þú tæmir listann er beiðni án kallarakóða tekin gild aftur.

## Ábendingar

-   Uppsetningarfærslan er búin til sjálfkrafa þegar þú opnar síðuna í fyrsta skipti.
-   Breyting á **Sjálfgefinn tungumálakóði** tekur strax gildi fyrir öll síðari skilaboð.
-   Leyfisaðgerðirnar birtast aðeins notendum með leyfisstjórnunarheimild.
