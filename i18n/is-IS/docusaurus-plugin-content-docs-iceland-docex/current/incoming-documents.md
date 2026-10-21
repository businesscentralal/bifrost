---
id: incoming-documents
title: "Skjöl á innleið frá upphafi til enda"
sidebar_label: "Skjöl á innleið"
sidebar_position: 2
sidebar_custom_props:
  top: true
description: "Afgreiddu alla reikninga sem berast í Business Central með aðstoðinni: rafræna reikninga frá Advania og Unimaze, og reikninga í PDF, skönnun eða á ljósmynd sem breytt er í rafræna reikninga á Peppol BIS 3.0 sniði með UBL-myndun."
---

# Skjöl á innleið frá upphafi til enda

**Allir reikningar frá birgjum fara sömu leið, á hvaða formi sem þeir berast.** Ásamt
[Bifröst Foundation](/foundation/) gerir Bifröst Ísland DocEx aðstoðinni kleift að fara með skjal á
innleið frá fyrstu skrá að innkaupareikningi eða færslubókarlínum í Business Central. Rafrænn reikningur
frá Advania eða Unimaze er lesinn eins og hann er. Reikningi sem berst sem PDF-skjal, skönnun eða ljósmynd er
fyrst breytt í rafrænan reikning á Peppol BIS 3.0 sniði með **UBL-myndun**, svo Business Central lesi
hann á sama hátt.

## Hvað hvort forrit gerir {#what-each-app-does}

| Forrit | Hvað það bætir við |
|---|---|
| **Bifröst Foundation** | Stofnar skjal á innleið úr skrá, bætir fleiri skrám við það, velur hver skráin er aðalskráin, les skjalið og skrár þess, og gerir úr því innkaupareikning, kreditreikning eða færslubókarlínur. |
| **Bifröst Ísland DocEx** | Sækir rafræna reikninga frá Advania og Unimaze, myndar rafrænan UBL-reikning úr gögnum reiknings í PDF, skönnun eða á ljósmynd, finnur lánardrottin eftir kennitölu, varpar Peppol-kóðum og ákveður fjárhagsreikningana. |

## Áður en þú byrjar {#before-you-start}

- Ljúktu uppsetningunni á [síðu forritsins](/iceland-docex/#set-it-up): **Uppfæra BII
  gagnaskiptaskilgreiningar**, kennitala hvers lánardrottins í **Kennitala**,
  [BIS30 kóðavörpun](/help/iceland-docex/bis30-code-map/),
  [VSK fjárhagsreikn.vörpun lánardrottins](/help/iceland-docex/vend-vat-gl-map/) og
  **Bókunaraðferð skjala á innleið** hjá hverjum lánardrottni.
- Sá eða sú þjónusta sem vinnur verkið þarf `BIFROST Full ori`.
- Til að breyta reikningum í PDF, skönnun eða á ljósmynd í rafræna reikninga þarftu aðstoð sem getur lesið
  PDF-skrár og myndir. UBL-myndunin sjálf þarf hvorki samning við skjalaskiptanet né
  innskráningarupplýsingar.

## Verkferillinn {#the-workflow}

| Skref | Hvað gerist | Rafrænn reikningur frá neti | PDF, skönnun eða ljósmynd |
|---|---|---|---|
| 1 | **Sæktu skjalið inn.** Skjal á innleið er stofnað með skránni í viðhengi. | Rafræni reikningurinn er sóttur með XML-skránni og PDF-skjalinu. Skjal er aðeins sótt einu sinni. | Skráin er sett inn sem nýtt skjal á innleið, til dæmis úr tölvupósti eða skönnun. |
| 2 | **Gerðu rafrænan reikning úr því.** | Þarf ekki: XML-skráin er rafræni reikningurinn. | Aðstoðin les reikninginn og myndar hann sem rafrænan reikning á Peppol BIS 3.0 sniði. XML-skránni er bætt við sama skjal á innleið og hún verður aðalskrá þess; upprunalega skráin er áfram í viðhengi. |
| 3 | **Yfirfarðu það.** Lánardrottinn finnst eftir kennitölu, kóðum er varpað í gegnum BIS30 kóðavörpun, og upphæðin verður að stemma við þá upphæð sem birgirinn biður um að fá greidda. | | Berðu rafræna reikninginn saman við frumritið: lánardrottin, dagsetningar, línur, VSK og upphæð. |
| 4 | **Gerðu innkaupaskjalið.** | Innkaupareikningur eða kreditreikningur, eða færslubókarlínur þegar **Bókunaraðferð skjala á innleið** hjá lánardrottninum segir svo. Línur sem eru ekki vörur fá fjárhagsreikning úr VSK fjárhagsreikn.vörpun lánardrottins, annars úr **Vörpun texta á reikning**. | Það sama. |
| 5 | **Yfirfarðu og bókaðu** innkaupaskjalið eða færslubókarlínurnar í Business Central eins og venjulega. | | |
| 6 | **Ljúktu málinu gagnvart birgjanum.** | Staðfestu móttökuna við skjalaskiptanetið. Í gegnum Unimaze getur þú líka látið birgjann vita að reikningurinn sé greiddur, eða hafnað honum með ástæðu. | Þarf ekki. |

## Hvað þú getur beðið aðstoðina um {#what-to-ask-your-assistant}

- *„Hvaða reikningar bíða okkar hjá Unimaze? Sæktu þá inn sem skjöl á innleið.“*
- *„Skjal á innleið 1042 er reikningur á PDF-sniði. Gerðu rafrænan Peppol-reikning úr honum og bættu
  honum við skjalið.“*
- *„Sýndu mér rafræna reikninginn sem þú gerðir við hlið PDF-skjalsins: lánardrottin, línur, VSK og
  upphæð.“*
- *„Gerðu innkaupareikninginn fyrir skjal á innleið 1042.“*
- *„Láttu birgjann vita í gegnum Unimaze að reikningur 2026-118 hafi verið greiddur.“*

## UBL-myndun {#ubl-rendering}

UBL-myndun skrifar viðskiptaskjal sem UBL XML á Peppol BIS 3.0 sniði, úr gögnum sem þú eða aðstoðin
leggið til. Hún myndar reikninga og kreditreikninga, pantanir og pöntunarsvör, afhendingarseðla, og
yfirlit og greiðslutilkynningar. Innkaupapöntun er hægt að mynda beint úr Business Central.

- **Hún keyrir í Business Central og sendir ekkert.** Að senda myndaðan reikning á skjalaskiptanet er
  sérstakt skref sem þú biður um.
- **Gögnin eru yfirfarin áður en XML-skráin er skrifuð:** aðilar, línur og Peppol-kóðar. XML-skrána er
  hægt að geyma sem viðhengi á skjali í Business Central eða sem skjal á innleið.
- **Hún er aðeins jafn rétt og gögnin sem hún fær.** Þegar gögnin koma úr PDF-skjali, skönnun eða ljósmynd skaltu bera
  rafræna reikninginn saman við frumritið áður en þú gerir innkaupaskjalið.

## Gott að vita {#good-to-know}

- Business Central hafnar skjali þar sem upphæðin stemmir ekki við upphæðina sem á að greiða, eða þar sem
  línur lenda á reikningi með annan VSK. Lagaðu vörpunina eða rafræna reikninginn og vinndu skjalið
  aftur.
- Skjal á innleið heldur öllum skrám sínum. Upprunalega PDF-skjalið, skönnunin eða ljósmyndin er áfram á því eftir að
  rafræna reikningnum er bætt við, svo þú sérð alltaf hvað birgirinn sendi.
- Allt keyrir með eigin heimildum notandans í Business Central, og hvert kall er skráð á
  **Bifrost Messages**.
