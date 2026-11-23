---
id: projects
title: "Uppsetning verkefna"
sidebar_position: 1
---

**Uppsetning verkefna** geymir fyrirtækjastillingar Bifröst verkefna: hvort aðstoðarmenn og samþættingar
megi vinna með verkefni í þessu fyrirtæki, og hvernig vettvangsheimsóknir skrá tíma, ferðir og akstur.
Síðan er fyrir kerfisstjórann sem setur forritið upp.

Opnaðu síðuna úr lista uppsettra forrita á [Uppsetning Bifröst](/help/foundation/bifrost-setup/), eða
leitaðu að **Uppsetning verkefna** í Business Central. Business Central er líka með staðlaða síðu fyrir
eigin verkefnastillingar sem getur borið sama heiti; þessi síða hefur flokkana **Almennt** og
**Vettvangsþjónusta** sem lýst er hér fyrir neðan. Ein uppsetningarfærsla er til fyrir hvert fyrirtæki.
Hún verður til þegar forritið er sett upp, eða í fyrsta sinn sem síðan er opnuð.

<!-- screenshot: Projects Setup 1033 -->
<!-- screenshot: Projects Setup 1039 -->

## Almennt {#general}

| Reitur | Hvað hann gerir |
| --- | --- |
| **Virkt** | Þegar kveikt er á reitnum geta aðstoðarmenn og samþættingar notað verkefnaaðgerðirnar í þessu fyrirtæki: verkefni, verkhluta og áætlunarlínur, stöðu, afrit, vistaðar útgáfur, tilboð, notkun, VÍV, tölfræði, skýrslur, ráðstöfun forða og eftirfylgnibeiðnir. Þegar slökkt er á honum eru þessar aðgerðir ekki í boði, og kall á einhverja þeirra fær villu sem segir að slökkt sé á verkefnum og að kveikt sé á þeim hér. Kveikt er á reitnum þegar uppsetningarfærslan verður til. |

## Vettvangsþjónusta {#field-service}

Þessir reitir eru notaðir þegar tæknimaður skráir heimsókn í gegnum aðstoðarmann: hefur og lýkur vinnu
eða ferð á verkhluta, og lokar heimsókninni.

| Reitur | Hvað hann gerir |
| --- | --- |
| **Hækkun verkþáttanúmers við eftirfylgni** | Bilið í númeraröðinni þegar nýr verkhluti er stofnaður úr eftirfylgnibeiðni. Nýi verkhlutinn fær númer á eftir verkhlutanum sem beiðnin kom frá og helst innan hóps hans. Núll þýðir einn. Frá 0 upp í 10.000. |
| **Vinnutegund ferðar** | Vinnutegundin sem ferðatími er skráður með á tímaskýrsluna. Ekki er hægt að skrá ferðir fyrr en hér er valin vinnutegund sem er til. |
| **Akstursforði** | Forðinn sem eknir kílómetrar eru skráðir á þegar heimsókn er lokað. Forðinn má ekki vera lokaður og verður að hafa grunnmælieiningu. Ekki er hægt að skrá kílómetra fyrr en hann er valinn. |
| **Námundun í mínútum** | Hvernig lengd heimsóknar er námunduð áður en stundunum er bætt á tímaskýrsluna: að næsta margfeldi af þessum mínútufjölda. Með 15 er 52 mínútna heimsókn skráð sem 45 mínútur og 53 mínútna heimsókn sem 1 klukkustund. Núll eða einn þýðir ein mínúta. |
| **Vikmörk biðlaratíma (klst.)** | Hversu margar klukkustundir aftur í tímann aðstoðarmaður tæknimanns má gefa upp þegar heimsókn hófst eða stöðvaðist, til dæmis þegar heimsókn er skráð eftir á. Eldri tíma er hafnað. Núll þýðir 24 klukkustundir. |
| **Leyfa óáætlaða verkþætti** | Þegar kveikt er á reitnum getur tæknimaður hafið heimsókn á verkhluta sem hefur enga áætlunarlínu fyrir forða hans. Þegar slökkt er á honum er aðeins hægt að hefja heimsókn á verkhluta sem tæknimaðurinn er áætlaður á. Slökkt er á reitnum þegar uppsetningarfærslan verður til. |

## Gott að vita {#good-to-know}

- **Virkt hefur ekki áhrif á tímaskýrslur.** Stofnun, innsending, samþykkt, bókun og safnvistun
  tímaskýrslna, notkunarlínur og vettvangsheimsóknir eru óháðar þessum reit. Þær ráðast af heimildum
  notandans til tímaskýrslna og af heimildasöfnum forritsins.
- **Að kveikja á reitnum veitir engar heimildir.** Notendur þurfa áfram eigin heimildir í Business Central
  til verkefna og `BIFROST Read ori` eða `BIFROST Full ori` frá Bifröst. Aðgerð sem notandinn hefur ekki
  heimild til er ekki boðin aðstoðarmanninum.
- **Hver getur breytt henni.** Með `BIFROST Full ori` getur notandi opnað síðuna og breytt henni.
  `BIFROST Read ori` leyfir forritinu að lesa stillingarnar en ekki breyta þeim.
- **Breyttu henni hér.** Aðstoðarmaður getur ekki breytt stillingum þessarar síðu með almennum
  gagnaaðgerðum Bifröst.
- **Stundir eru í mælieiningu forðans.** Stundum heimsóknar er bætt á tímaskýrsluna sem magni af forða
  tæknimannsins, svo forðar tæknimanna ættu að hafa klukkustundir sem mælieiningu.

Meira um forritið: [Bifröst verkefni](/projects/). Bílar tæknimanna eru settir upp á
[Uppsetning tæknimanna](/help/projects/technician-setup/).
