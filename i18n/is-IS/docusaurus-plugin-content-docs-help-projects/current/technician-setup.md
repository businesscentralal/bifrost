---
id: technician-setup
title: "Uppsetning tæknimanna"
sidebar_position: 3
---

**Uppsetning tæknimanna** tengir hvern vettvangstæknimann við bílinn sem hann vinnur úr. Síðan er fyrir
kerfisstjórann sem setur upp vettvangsþjónustu. Þegar bíll er skráður getur aðstoðarmaður tæknimannsins
séð hvað er í bílnum og skráð vörurnar sem voru notaðar í heimsókn, teknar af birgðum bílsins.

Leitaðu að **Uppsetning tæknimanna** í Business Central til að opna síðuna. Bættu við einni línu fyrir
hvern tæknimann.

<!-- screenshot: Technician Setup 1033 -->
<!-- screenshot: Technician Setup 1039 -->

## Reitir {#fields}

| Reitur | Hvað hann gerir |
| --- | --- |
| **Aðfangsnr. starfsmanns** | Forði tæknimannsins. Ein lína fyrir hvern forða. |
| **Staðsetningarkóði bíls** | Staðsetningin sem geymir birgðirnar í bíl tæknimannsins. Settu hvern bíl upp sem staðsetningu í Business Central. |
| **Sjálfgefinn hólfkóði** | Hólfið sem vörur eru teknar úr þegar tæknimaðurinn segir ekki hvaða hólf. Aðeins er hægt að velja hólf á staðsetningu bílsins. Hafðu reitinn auðan ef staðsetning bílsins notar ekki hólf. |

## Til hvers hún er notuð {#what-it-is-used-for}

- **Vörur notaðar í heimsókn.** Þegar tæknimaður segir aðstoðarmanninum hvaða vörur voru notaðar er hver
  vara fundin eftir vörunúmeri, vörutilvísun eða lýsingu og skráð sem opin notkunarlína á staðsetningu
  bílsins og sjálfgefna hólfinu. Ef vara passar við fleiri en eina vöru er ekkert skráð, svo
  tæknimaðurinn geti sagt hvaða vöru hann átti við. Vara sem vantar í bílinn er skráð með viðvörun.
- **Birgðir í bíl.** Aðstoðarmaðurinn getur sýnt hvað er í bílnum, að frádregnum vörum sem eru skráðar en
  ekki bókaðar, og hvaða vörur eru undir endurpöntunarmarki (birgðahaldseiningar fyrir staðsetningu
  bílsins, annars vörunnar).
- **Notkunarlínur** sem eru skráðar svona fara í gegnum sama samþykktarferli og önnur notkun á
  tímaskýrslum; sjá [Notkunarlínur tímaskýrslna](/help/projects/ts-usage-lines/). Áfylling bílsins er
  venjuleg birgðavinna í Business Central, til dæmis með flutningspöntun.

## Gott að vita {#good-to-know}

- **Hver getur breytt henni.** Notendur með `PROJ TS ADMIN ori` geta opnað síðuna og breytt henni.
  Tæknimenn með `PROJ FIELD TECH ori` nota uppsetninguna en geta ekki breytt henni.
- **Án línu hér** getur tæknimaður samt skráð heimsóknir og tíma, en ekki vörur úr bíl: aðstoðarmaðurinn
  svarar að kerfisstjóri þurfi að skrá staðsetningu bílsins hér.

Meira um forritið: [Bifröst verkefni](/projects/).
