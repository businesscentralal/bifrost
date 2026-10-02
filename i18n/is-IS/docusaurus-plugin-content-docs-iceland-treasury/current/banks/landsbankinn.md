---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 1
description: "Hvað Bifröst fjárstýring gerir með Landsbankanum: kröfur, fyrirtækjakort, reikningar, eignasöfn, rafræn skjöl, færsluhirðing, greiðslur, gengi og innflutningur yfirlita."
---

Þessi síða er fyrir fjármálasvið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Landsbankann. Hún útskýrir hvað Landsbankatengingin í [Bifröst fjárstýringu](/iceland-treasury/)
gerir, hvað þú setur upp og hvað þú sérð í Business Central á eftir. Landsbankinn er sá banki sem
forritið nær mest yfir.

## Hvað hún gerir fyrir þig

- **Yfirlit og kortafærslur inn í afstemmingu.** Flyttu reikningsyfirlit Landsbankans, eða færslur
  fyrirtækjakorts, beint inn í **afstemmingu bankareiknings**.
- **Reikningar.** Listaðu reikningana þína, sjáðu upplýsingar og færslur eins reiknings, lestu
  dagslokastöðu og áfallna vexti, og staðfestu að reikningur sé til áður en þú greiðir inn á hann.
- **Kröfur.** Stofnaðu, lestu, breyttu og felldu niður kröfur eina í einu, eða sendu bunka
  kröfuaðgerða og fylgdu niðurstöðunni. Sjáðu greiðslur sem borist hafa, fyrir fyrirtækið eða eina
  kröfu.
- **Kröfusniðmát.** Haltu utan um innheimtusamningana sem kröfur eru stofnaðar undir, sjáðu hvaða
  aðgang kröfuhafi hefur og hvaða skilyrði hann á eftir að uppfylla.
- **Fyrirtækjakort.** Sjáðu kortin þín, færslur þeirra og kvittanir, og haltu utan um bókhaldslykla
  (lykla, flokka og undirflokka), þar á meðal að tengja bókhaldslykil og athugasemd við færslu.
- **Eignasöfn.** Eignasöfn, eignir, hagnaður og tap, og eignafærslur á borð við viðskipti og arð.
- **Rafræn skjöl.** Hladdu upp skjölum eitt í einu eða í bunka, listaðu og sæktu móttekin skjöl, og
  tengdu skjöl við færslurnar sem þau tilheyra.
- **Færsluhirðing.** Uppgjörsbunkar og færslurnar að baki þeim, ef þú tekur við kortagreiðslum gegnum
  Landsbankann.
- **Greiðslur.** Sendu bunka innlendra greiðslna og sæktu niðurstöðuna, flettu upp ógreiddum
  reikningum og greiðsluseðlum, og sendu erlendar greiðslur og fylgstu með stöðu þeirra.
- **Gengi og viðmiðunargögn.** Gengi, innláns- og útlánsvextir, verðskrá bankans og sjóðaupplýsingar
  Landsbréfa. Þetta krefst ekki eigin heimildasetts.

Þú, tímasett ferli eða gervigreindaraðstoðarmaður getið beðið um hvað sem er af þessu. Uppsettar
skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með MCP-tólunum
`list_message_types` og `describe_message_type`, eða á síðunni Bifrost Message Types.

## Hvað þú setur upp

1. **Samning við Landsbankann** um þær þjónustur sem þú notar, með B2B-notandanafni og lykilorði,
   undirritunarskilríki (`.pfx`-skrá með eigin lykilorði) og API-lykli.
2. **Línu Landsbankans á Uppsetning Bifröst Ísland Fjárstýringar**: hafðu hana virka, skráðu
   notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis**, **Skrá skírteini** og
   **Skrá API-lykil**. Sjá [hjálp uppsetningarsíðunnar](/help/iceland-treasury/treasury-setup/) og
   [Draupnir-undirritara](../reference/draupnir-signers.md).
3. **Eigin aðgang notenda, ef þeir hafa sinn eigin aðgang hjá bankanum.** Hver notandi skráir eigið
   notandanafn, lykilorð og API-lykil í **notandastillingum Bifrastar**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Innflutning yfirlita.** Á bankareikningi í Business Central skaltu velja `LBI-FEED-IN` sem
   **Innflutningssnið bankayfirlits** fyrir reikning, eða `LBI-CARD-IN` fyrir fyrirtækjakort (á
   bankareikningi með kortanúmerið sem reikningsnúmer).
5. **Kröfur.** Á hvern greiðslumáta sem notaður er til innheimtu skráirðu **kröfuauðkenni
   Landsbankans** sem bankinn úthlutaði þeim innheimtusamningi. **Síðasta kröfunúmer Landsbankans**
   heldur númeraröðinni gangandi. Kennitala kröfuhafa er lesin úr upplýsingum fyrirtækis. Sjá
   [Greiðslumátar](/help/iceland-treasury/payment-methods/).
6. **Heimildir.** Úthlutaðu heimildasettunum hér að neðan.

| Aðgangsupplýsingar | Geymdar fyrir | Athugasemdir |
| --- | --- | --- |
| Lykilorð fyrirtækis | Fyrirtækið | Sjálfgefið B2B-lykilorð fyrirtækisins. |
| Lykilorð notanda | Hvern notanda | Notað með eigin notandanafni hans. |
| Undirritunarskilríki og lykilorð þess | Fyrirtækið | Undirritar beiðnir sem þurfa undirritun. Lokadagsetning þess sést á uppsetningarsíðunni. |
| API-lykill | Fyrirtækið | Notaður af nýrri þjónustum Landsbankans. |
| API-lykill notanda | Hvern notanda | Kemur í stað API-lykils fyrirtækisins fyrir þann notanda. |

Öll gildi eru slegin inn í huldum gluggum og aldrei sýnd aftur; sjá
[Leyndarmál banka](/help/iceland-treasury/treasury-secrets/).

## Hvað þú sérð í Business Central

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið eða kortafærslurnar til
  Landsbankans. Tímabilið hefst á yfirlitsdegi afstemmingarinnar eða deginum eftir síðasta bókaða
  yfirlit; sé ekkert slíkt biður það um [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfluttar línur og upphafs- og lokastöðu, og varar við ef þær stemma ekki við bankann.
- **Greiðslumátar** sýna kröfuauðkenni Landsbankans og síðasta kröfunúmer.
- **Upplýsingagluggi viðskiptamannafærslna** sýnir kröfureikning og kröfudagsetningu hjá
  Landsbankanum, fyrir notendur sem mega lesa kröfur. Sjá
  [Viðskiptamannafærslur — kröfuupplýsingar](/help/iceland-treasury/customer-ledger-factbox/).
- Hvert kall til bankans er skráð í **beiðnaskrá Bifrastar**, með aðgangsupplýsingarnar huldar.

## Heimildasett

Svið sem hreyfa fé eða breyta einhverju hjá bankanum hafa sitt eigið heimildasett, svo notandi getur
fengið að lesa kortafærslur án þess að geta greitt.

| Heimildasett | Veitir |
| --- | --- |
| `BIFROST LBStmt ori` | Reikninga, færslur og dagslokastöðu; lestur móttekinna rafrænna skjala |
| `BIFROST LBCards ori` | Fyrirtækjakort, þar á meðal bókhaldslykla, flokka og undirflokka |
| `BIFROST LBAssets ori` | Eignasöfn, eignir, ávöxtun og eignafærslur |
| `BIFROST LBClmPmt ori` | Greiðslur krafna |
| `BIFROST LBClmCrt ori` | Kröfubunka og niðurstöður þeirra |
| `BIFROST LBPaymt ori` | Innlendar greiðslur, niðurstöður greiðslna og ógreidda reikninga |
| `BIFROST LBFrgPay ori` | Erlendar greiðslur og stöðu þeirra |
| `BIFROST LBEDoc ori` | Upphleðslu rafrænna skjala, skjalategundir og tengingar |

`BIFROST LBFull ori` víkkar `BIFROST Full ori` í Foundation, svo allir með fullan Bifrastaraðgang ná
til alls Landsbankans. `BIFROST LBRdClm ori` víkkar `BIFROST Read ori` með lesaðgangi að kröfum og
greiðslum krafna. Stakar kröfur, kröfusniðmát, færsluhirðing, gengi, staðfesting reikninga og
greiðsluseðlar þurfa aðeins almennan Bifrastaraðgang.

## Að færa sig frá Origo Cloud Events Landsbankinn

Settu Bifröst fjárstýringu upp við hlið gamla forritsins. Við fyrstu uppsetningu tekur hún yfir gögn
Landsbankans (kröfur og greiðslur krafna, kröfu- og greiðslubunka, kröfureitina á greiðslumátum,
Landsbankastillingar notenda og úthlutanir heimildasetta) og síðan má fjarlægja gamla forritið. Gögnum
sem þegar eru í nýja forritinu er aldrei skrifað yfir.

**Lykilorð, skilríki og API-lyklar flytjast ekki.** Skráðu þau einu sinni eftir skiptin. Skráðu líka
aðgang Arion banka aftur: gömlu forritin gátu ruglað saman geymdum gildum bankanna tveggja, svo
hvorugt er flutt.

## Hvert næst

- [Yfirlit fjárstýringar](/iceland-treasury/)
- [Draupnir-undirritarar](../reference/draupnir-signers.md): undirritunarskilríkið
- [Uppsetning Bifröst Ísland Fjárstýringar](/help/iceland-treasury/treasury-setup/)
