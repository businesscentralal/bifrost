---
id: docex-setup
title: "Uppsetning skjalaskipta"
sidebar_label: "Uppsetning skjalaskipta"
sidebar_position: 2
---

Á **Uppsetning skjalaskipta** tengir þú Business Central við skjalaskiptanet Bifröst Ísland DocEx. Fyrir
hvert net velur þú umhverfi, geymir innskráningarupplýsingar og prófar tenginguna. Eftir það getur
aðstoðin, samþættingin eða tímasetta keyrslan þín sent og tekið á móti rafrænum reikningum.

Opnaðu síðuna úr **Uppsetning Bifröst**: veldu **Uppsetning skjalaskipta** í flokknum **Forrit**. Ein
uppsetning er til fyrir hvert fyrirtæki; hún verður til þegar síðan er opnuð í fyrsta sinn.

## Skjalaskiptanet {#networks}

![Uppsetning skjalaskipta með flokkunum Advania og Unimaze, þar sem umhverfið er Prófun og innskráningarupplýsingar eru geymdar](/img/iceland-docex/is-is/docex-setup.png)

Hvert net hefur eigin flokk með reit fyrir umhverfi og stöðunni **Innskráningarupplýsingar**, sem ekki er
hægt að breyta.

| Flokkur | Reitir |
| --- | --- |
| **Advania** | **Advania umhverfi** (Raun eða Prófun), **Advania notandanafn fyrir vefviðmót**, **Innskráningarupplýsingar** |
| **Unimaze** | **Unimaze umhverfi** (Raun eða Prófun), **Innskráningarupplýsingar** |

- **Umhverfi** ræður hvaða þjónusta er kölluð. Innskráningarupplýsingar eru geymdar fyrir hvert net
  **og** hvert umhverfi, svo prófunarupplýsingar eru aldrei notaðar í raunkall. Þegar þú skiptir um
  umhverfi sýnir staðan **Innskráningarupplýsingar** hvort það umhverfi hafi sín gildi.
- **Advania notandanafn fyrir vefviðmót** er aðeins notað af **Opna Advania vefviðmót**, til að opna
  vefviðmót Advania með einni innskráningu. Það eru ekki innskráningarupplýsingar.
- **Innskráningarupplýsingar** sýnir aðeins hvort gildin séu geymd (**Geymdar** eða **Ekki skráðar**),
  aldrei gildin sjálf.

## Innskráningarupplýsingar {#credentials}

Innskráningarupplýsingar eru ekki reitir á þessari síðu. Þú slærð hvert gildi inn einu sinni í földum
glugga; það er geymt í leyndarmálageymslu Bifröst og birtist aldrei aftur.

| Net | Gildi |
| --- | --- |
| Advania | Notandanafn og lykilorð vefþjónustunotandans hjá Advania. |
| Unimaze | Notandanafn og lykilorð. Til að skrá þig inn með API lykli í staðinn skilur þú notandanafnið eftir autt og geymir lykilinn með **Skrá lykilorð eða API lykil**. |

Innskráningarupplýsingar eru ekki afritaðar úr eldra forriti eða við uppfærslu. Sláðu þær aftur inn
eftir uppsetningu.

## Aðgerðir {#actions}

![Uppsetning skjalaskipta með aðgerðir Unimaze opnar: Skrá notandanafn, Skrá lykilorð eða API lykil og Hreinsa innskráningarupplýsingar, og Prófa Unimaze tengingu á aðgerðastikunni](/img/iceland-docex/is-is/docex-setup-actions.png)

| Flokkur | Aðgerð | Hvað hún gerir |
| --- | --- | --- |
| **Advania** | **Skrá notandanafn** / **Skrá lykilorð** | Geymir gildið fyrir valið umhverfi. |
| | **Hreinsa innskráningarupplýsingar** | Fjarlægir bæði gildin fyrir valið umhverfi, eftir að þú staðfestir. |
| | **Prófa Advania tengingu** | Skráir sig inn hjá Advania og sýnir viðskiptafélagana sem notandinn má skiptast á skjölum við, með réttindum til að senda, sækja og skoða, eða segir hvers vegna tengingin mistókst og hvað á að athuga. |
| | **Opna Advania vefviðmót** | Opnar vefviðmót Advania í vafranum með einni innskráningu. |
| **Unimaze** | **Skrá notandanafn** / **Skrá lykilorð eða API lykil** | Geymir gildið fyrir valið umhverfi. |
| | **Hreinsa innskráningarupplýsingar** | Fjarlægir bæði gildin fyrir valið umhverfi, eftir að þú staðfestir. |
| | **Prófa Unimaze tengingu** | Skráir sig inn hjá Unimaze og sýnir aðila fyrirtækisins á netinu, sem finnst eftir **Kennitala** í **Fyrirtækjaupplýsingum**, og hve mörg skeyti eru í innhólfinu og ósótt, eða segir hvers vegna tengingin mistókst og hvað á að athuga. |
| **Almennt** | **Leyndarmál forrits** | Opnar lista yfir leyndarmál forritsins: hver eru geymd, hvenær og af hverjum. |
| | **Uppsetningarleiðsögn** | Opnar Uppsetningarleiðsögn Bifröst, sem leyfir HTTP-beiðnir fyrir Bifröst-forritin. |
| | **Uppfæra BII gagnaskiptaskilgreiningar** | Býr til að nýju gagnaskiptaskilgreiningarnar sem lesa móttekna rafræna reikninga og kreditreikninga. Keyrðu hana áður en þú tekur á móti skjölum, og eftir uppfærslu ef þú ert beðinn um það. |
| | **BIS30 kóðavörpun** | Opnar [BIS30 kóðavörpun](/help/iceland-docex/bis30-code-map/). |
| | **VSK fjárhagsreikn.vörpun** | Opnar [VSK fjárhagsreikn.vörpun lánardrottins](/help/iceland-docex/vend-vat-gl-map/). |

## Útsendar HTTP-beiðnir {#outgoing-http-requests}

Öll net eru sótt um HTTP. Þar til HTTP-beiðnir eru leyfðar fyrir Bifröst-forritin tekst ekkert kall til
skjalaskiptanets og **Uppsetning Bifröst** sýnir tilkynningu með **Hefja uppsetningarleiðsögn**. Veldu
hana, eða **Uppsetningarleiðsögn** á þessari síðu, og leyfðu beiðnirnar.

## Fyrstu skrefin {#get-started}

1. Á **Uppsetning Bifröst** velur þú **Uppsetning skjalaskipta**. Ef HTTP-beiðnir hafa ekki verið leyfðar
   velur þú fyrst **Uppsetningarleiðsögn**.
2. Gakktu úr skugga um að **Kennitala** í **Fyrirtækjaupplýsingum** sé kennitala fyrirtækisins.
3. Veldu **Prófun** sem umhverfi hvers nets sem þú notar.
4. Sláðu inn innskráningarupplýsingarnar með **Skrá notandanafn** og **Skrá lykilorð** (eða **Skrá
   lykilorð eða API lykil**).
5. Veldu **Prófa Advania tengingu** eða **Prófa Unimaze tengingu** og lestu niðurstöðuna.
6. Ef þú tekur á móti reikningum velur þú **Uppfæra BII gagnaskiptaskilgreiningar** og fyllir út
   [BIS30 kóðavörpun](/help/iceland-docex/bis30-code-map/) og
   [VSK fjárhagsreikn.vörpun lánardrottins](/help/iceland-docex/vend-vat-gl-map/).
7. Sendu prófunarreikning frá upphafi til enda, skiptu síðan umhverfinu í **Raun** og sláðu inn
   innskráningarupplýsingarnar fyrir Raun.
