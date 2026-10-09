---
id: license-types
title: "Tegundir leyfa"
sidebar_position: 2
description: "Fyrirframgreitt leyfi og áskriftarleyfi, prufuleyfið, skilaboðapottarnir tveir, vikmörk, lokun og mánaðarlegur kvóti, og hvernig leyfismálum sandkassa og uppsetninga á staðnum er háttað."
---

## Hvað er talið {#what-is-counted}

Kall telst sem **ein skilaboð** þegar hvort tveggja á við:

- kallið er gjaldskylt - sjá [Gjaldfrjáls köll](#free-calls);
- kallið tókst - JSON-svar þar sem `status` er ekki `Success` er ekki talið (svar sem er ekki JSON,
  t.d. PDF- eða CSV-skrá, telst hafa tekist).

Hvert gjaldskylt kall kostar nákvæmlega ein skilaboð, óháð því hvað það gerir.

### Gjaldfrjáls köll {#free-calls}

Þessi köll eru aldrei talin og þeim er aldrei hafnað vegna kvóta:

- uppgötvun og sjálfslýsing - listinn yfir skilaboðategundir, samningur tegundar, hver er ég;
- lestur og skrif minnisfærslna;
- meðhöndlun setu, t.d. samþykkt á uppruna setu;
- innkomin vefkrókaköll;
- lestur breytingasögu og endurheimt gilda í reitum.

Þau eru aðeins gjaldfrjáls þegar þau tilheyra Bifröst-forriti frá Origo. Skilaboðategund sem annar
útgefandi bætir við er gjaldskyld hvað sem hún gerir. Gjaldfrjáls köll krefjast samt samþykkts
notendaleyfissamnings - sjá [Fyrir fyrsta kallið](#before-the-first-call).

### Tveir pottar {#two-pools}

Skilaboð eru talin í tveimur pottum, eftir því hver framkvæmdi kallið:

| Pottur | Notaður af |
|---|---|
| **Notandi** (User) | Köllum sem venjulegur notandi framkvæmir - gagnvirkt eða gegnum vefþjónustu. |
| **Forritsskráning** (App Registration) | Köllum sem Microsoft Entra forrit (þjónustuaðili) framkvæmir. |

### Gjaldfærslutegundir í áskrift {#charge-types}

Í áskrift er hvert skilaboð einnig skráð með **gjaldfærslutegund**, svo greina megi venjulega
notkun þína frá vinnu samstarfsaðilans. Gjaldfærslutegund
hvers notanda birtist í dálkinum **Gjaldfærslutegund** á síðunni
[Uppsetning notanda Bifröst](/help/foundation/bifrost-user-setup-list/). Fyrsta reglan sem á við
gildir:

| Gjaldfærslutegund | Notandinn er |
|---|---|
| **Þjónustuaðili** (Support) | notandi samstarfsaðila sem vinnur í leigjandanum þínum gegnum framselda samstarfsaðilaáskrift (hvaða sem er, t.d. Delegated Admin eða Delegated Helpdesk) |
| **Forritsskráning** (App Registration) | Microsoft Entra forrit (þjónustuaðili) |
| **Innri** (Internal) | manneskja í leigjanda sem eigin samstarfsaðili bauð sem viðskiptavini - samstarfsaðilinn að nota Bifröst sjálfur |
| **Sýniumhverfi** (Demo) | manneskja í leigjanda sem samstarfsaðilinn merkti sem **sýniumhverfi** þegar hann bauð honum |
| **Notandi** (User) | allir aðrir - venjuleg notkun viðskiptavinar |

Innri og Sýniumhverfi eiga aðeins við um fólk sem annars væri **Notandi**; forritsskráning eða
framseldur notandi samstarfsaðila heldur Forritsskráningu eða Þjónustuaðila. Í **fyrirframgreiddu
leyfi** eru aðeins Notandi og Forritsskráning notuð.

Gjaldfærslutegundin er ákvörðuð þegar notandi byrjar að nota Bifröst í fyrirtæki og endurmetin fyrir
alla notendur fyrirtækisins með **daglegu notkunarsamstillingunni** (sem fyrsta gjaldskylda kall
dagsins ræsir) og með **Samstilla** á síðunni Uppsetning Bifröst. Eftir breytingu á leyfi eða
samstarfsaðila - nýtt samband við samstarfsaðila, uppsagt samband, notandi sem fær eða missir
framselda áskrift - gilda nýju gjaldfærslutegundirnar frá næstu daglegu samstillingu; veldu
**Samstilla** til að virkja þær strax.

## Fyrir fyrsta kallið {#before-the-first-call}

Hvert fyrirtæki verður að samþykkja **notendaleyfissamninginn** (EULA) í
[Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/) áður en Bifröst vinnur úr
nokkru kalli fyrir það. Fram að því er öllum köllum - líka uppgötvunarköllum - svarað með villunni
`EULA_REQUIRED`, sem vísar á leiðsögnina. Kerfisstjóri getur dregið samþykkið til baka með
**Afturkalla samþykki notendaleyfissamnings** á síðunni Uppsetning Bifröst; köllum er þá aftur
hafnað þar til leiðsögninni hefur verið lokið.

Einnig þarf að leyfa útleið HTTP-beiðnir fyrir Bifröst Foundation (leiðsögnin sér um það), því
leyfisathuganirnar eiga samskipti við leyfisþjónustuna.

## Fyrirframgreitt leyfi {#prepaid}

Fyrirframgreitt leyfi er tegund leyfis allra nýrra uppsetninga og allra leigjenda sem eru ekki
viðskiptavinir samstarfsaðila.

- **Prufuleyfi.** Prufuleyfi upp á **1.000 notendaskilaboð + 1.000 forritsskráningarskilaboð** er
  virkjað einu sinni fyrir hvern Microsoft Entra leigjanda, þegar uppsetningarleiðsögninni lýkur í
  SaaS-framleiðsluumhverfi (eða úr tilkynningunni um að virkja prufuleyfið). Þar til það hefur
  verið virkjað er gjaldskyldum köllum svarað með villu um að *prufuleyfið hafi ekki verið virkjað*.
- **Keyptur kvóti.** Að prufuleyfinu loknu kaupir þú fleiri skilaboð í hvorn pott: hafðu samband við Business Central samstarfsaðilann þinn.
  Uppsetning Bifröst sýnir tilkynningu þegar annar hvor potturinn fer undir 200 skilaboð.
- **Vikmörk.** Þegar pottur nær núlli er enn hægt að nota **100 skilaboð** í vikmörk; svörin bera þá
  viðvörun. Þegar vikmörkin eru líka uppurin er potturinn tæmdur.
- **Lokun.** Tæmdur pottur hafnar köllum með villunni um uppurinn kvóta - nema leyfissamningur
  leigjandans kveði á um að potturinn skuli halda áfram. Þá halda köllin áfram, eru áfram talin og
  skila áfram viðvöruninni. Gildandi stilling birtist sem `blockOnMissingQuota` í leyfisstöðunni.
- **Álagsþak.** Notkun í framleiðsluumhverfi ber ekkert álagsþak. Sandkassanotkun á opinbera Bifröst
  MCP-þjóninum er alltaf á fría þrepinu, 1.000 skilaboð á 24 klukkustundum. Sjá [Álagsþak](./rate-limits.md).

## Áskrift {#subscription}

Leigjandi er á áskriftarleyfi á meðan hann er **viðskiptavinur samstarfsaðila Bifröst** - frá því
að hann þiggur boð samstarfsaðilans þar til sambandinu lýkur. Tegund leyfis á við um allan
leigjandann: öll fyrirtæki hans eru á áskrift, líka fyrirtæki sem byrja að nota Bifröst síðar.

- **Reikningsfærsla.** Samstarfsaðilinn rukkar viðskiptavininn fyrir skilaboðin sem hann notaði í
  hverjum mánuði. Enginn kvóti er keyptur: pottarnir eru taldir en ekki takmarkaðir.
  [Mánaðarlegu kvótarnir](#monthly-quotas) eru leið viðskiptavinarins til að setja þak á reikninginn.
- **Álagsþak.** Notkun í framleiðsluumhverfi ber ekkert álagsþak. Sandkassanotkun á opinbera Bifröst
  MCP-þjóninum er sjálfgefið á fría þrepinu (1.000 skilaboð á 24 klukkustundum); viðskiptavinurinn getur
  hækkað það með því að velja hærra þrep úr framleiðsluumhverfinu, á verði samstarfsaðilans. Sjá
  [Álagsþak](./rate-limits.md).

Þegar sambandinu við samstarfsaðilann lýkur fer leigjandinn aftur á **fyrirframgreitt leyfi** og
sandkassaþak hans aftur á fría þrepið. Breytingin tekur gildi þegar leyfisstjóri velur **Samstilla** á
síðunni Uppsetning Bifröst.

## Mánaðarlegir kvótar {#monthly-quotas}

Báðar tegundir leyfa geta sett þak á eigin mánaðarlega notkun:

- **Mánaðarlegur skilaboðakvóti fyrirtækis** á síðunni Uppsetning Bifröst - gjaldskyld skilaboð
  fyrirtækisins í almanaksmánuðinum. Í áskrift telur hann allar gjaldfærslutegundir nema
  **Forritsskráningu**, svo köll milli þjónusta stöðva aldrei notendurna þína; í fyrirframgreiddu
  leyfi telur hann báða pottana;
- **Mánaðarlegur skilaboðakvóti notanda** í Uppsetningu notanda Bifröst fyrir hvern notanda -
  gjaldskyld skilaboð þess notanda í almanaksmánuðinum, hver sem gjaldfærslutegund þeirra er.

`0` (sjálfgefið) þýðir engin takmörk. Þegar kvóta er náð er köllum hafnað með villu um uppurinn
mánaðarlegan kvóta fram að næsta almanaksmánuði; svarið tilgreinir hvaða kvóti (`user` eða
`company`) stöðvaði kallið. Kvóti notanda er athugaður á undan kvóta fyrirtækis, og báðir á undan
keyptum pottum leigjanda með fyrirframgreitt leyfi. Þegar 100 eða færri skilaboð eru eftir af
mánaðarlegum kvóta bera árangursrík svör viðvörun. Mánaðarlegum kvóta er ekki framfylgt í sandkassa.

### Hvernig mánaðarlegu kvótarnir eru taldir {#how-monthly-quotas-are-counted}

Business Central telur mánaðarlegu kvótana sjálft, út frá **Bifröst-skilaboðum** fyrirtækisins:
gjaldskyldum skilaboðum yfirstandandi almanaksmánaðar. Skil á notkun til leyfisþjónustunnar breyta
ekki þeirri tölu - skilaboð sem dagleg notkunarsamstilling hefur skilað teljast áfram með þar til
mánuðinum lýkur.

Geymdu Bifröst-skilaboð í minnst 31 dag ef þú
notar mánaðarlegu kvótana.

## Sandkassaumhverfi {#sandbox-environments}

Í **sandkassa** Business Central online:

- Bifröst hafnar ekki köllum vegna kvóta: pottum og mánaðarlegum kvóta er ekki framfylgt og ekkert
  prufuleyfi þarf.
- Notkun er samt skráð og tilkynnt, aðskilin frá framleiðsluumhverfi.
- Á opinbera Bifröst MCP-þjóninum ber sandkassanotkun álagsþak: 1.000 skilaboð á 24 klukkustundum á
  hvern Microsoft Entra leigjanda (fría þrepið), nema viðskiptavinur á áskrift hafi valið hærra þrep.
  Bifröst sjálft hefur engin skilaboðatakmörk.

Fyrir ótakmarkaða sandkassanotkun skaltu keyra staðbundna MCP-þjóninn úr
[businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

## Uppsetningar á staðnum {#on-premises-installations}

Uppsetningar á staðnum (í eigin umhverfi) eru **eingöngu með fyrirframgreitt leyfi**. Þar er ekkert
prufuleyfi; Origo afhendir tenginguna við leyfisþjónustuna ásamt leyfinu fyrir uppsetningu á
staðnum, og keypti kvótinn virkar eins og lýst er undir [Fyrirframgreitt leyfi](#prepaid).

## Staða leyfisins skoðuð {#checking-the-licence}

- Upplýsingareiturinn **Leyfi** á síðunni Uppsetning Bifröst sýnir tegund leyfis, eftirstöðvar
  kvóta og gildi hvors potts, skilaboð sem enn hafa ekki verið tilkynnt og dagsetningu síðustu
  samstillingar. Sjá [Upplýsingareitinn Leyfi](/help/foundation/license-fact-box/).
- Gervigreindaraðstoðarmaður getur lesið sömu stöðu, og notkun leigjandans í yfirstandandi
  mánuði, í gegnum Bifröst. Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business
  Central sjálfu: með MCP-tólunum `describe_domains` og `describe_message_type` eða á síðunni
  Bifrost Message Types.
