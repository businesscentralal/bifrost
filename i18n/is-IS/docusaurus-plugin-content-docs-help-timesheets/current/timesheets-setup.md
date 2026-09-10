---
id: timesheets-setup
title: "Uppsetning Timesheets"
sidebar_label: "Uppsetning Timesheets"
sidebar_position: 2
---

Spjaldið **Uppsetning Timesheets** geymir allar stillingar Bifröst Timesheets tengingarinnar. Það er opnað með aðgerðinni **Timesheets** í flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar, eða með því að leita að *Uppsetning Timesheets*. Það er nákvæmlega ein uppsetningarfærsla í hverju fyrirtæki.

Ekkert sem varðar Clockify er stillt á uppsetningarspjaldi Bifröst Foundation — tengingin geymir sínar stillingar hér svo hægt sé að setja hana upp, stilla og fjarlægja án þess að snerta Foundation.

## Reitir

### Almennt

| Reitur | Lýsing |
| --- | --- |
| Clockify API útgáfa | Hvaða Clockify API útfærslu tengingin notar. Sjálfgefið er Útgáfa 1, sem er fest á almennu Clockify v1 slóðina. |
| Sjálfgefið vinnusvæði (auðkenni) | Clockify vinnusvæðið sem er notað þegar beiðni tilgreinir ekki vinnusvæði. Notaðu uppflettingu til að velja vinnusvæði eftir heiti úr [vinnusvæðalistanum](/help/timesheets/timesheets-workspace-lookup/). |
| Sjálfgefið vinnusvæði | Heiti valins vinnusvæðis, skráð þegar það er valið. Ekki breytanlegt. |
| API lykill fyrirtækis geymdur | Hvort Clockify API lykill fyrirtækis sé geymdur. Öll köll tengingarinnar auðkenna sig með þeim lykli. Ekki breytanlegt — notaðu aðgerðirnar til að skrá hann eða eyða. |

### Verkbók

| Reitur | Lýsing |
| --- | --- |
| Verkbókarlýsing | Verkbókarlýsingin sem samstilltar Clockify-tímafærslur eru skrifaðar í, bæði af samstillingartegundunum og rauntíma vefkróknum. |
| Verkbókarflokkur | Verkbókarflokkurinn sem samstilltar tímafærslur eru skrifaðar í. Hann verður að tilheyra valinni lýsingu. |
| Sjálfgefin vinnutegund | Vinnutegundin sem sett er á samstillta verkbókarlínu þegar Clockify-tímafærslan hefur engan merkimiða tengdan vinnutegund. Tengdur Clockify-merkimiði hefur forgang fram yfir þetta gildi; sé reiturinn auður er vinnutegund línunnar skilin eftir auð. |

### Vefkrókar

| Reitur | Lýsing |
| --- | --- |
| Móttökuslóð vefkróka | Slóð móttakarans sem áframsendir Clockify-atburði í Business Central, með markafyrirtækinu. Hana þarf að fylla út áður en hægt er að skrá vefkróka. |
| Vefkrókar skráðir | Hvort rauntíma vefkrókar fyrir tímafærslur séu skráðir í Clockify. Ekki breytanlegt — notaðu aðgerðirnar til að skrá þá eða fjarlægja. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| Skrá API lykil fyrirtækis | Biður um Clockify API lykilinn í [földum glugga](/help/timesheets/timesheets-set-secret-dialog/) og geymir hann í IsolatedStorage á sviði fyrirtækisins. |
| Eyða API lykli fyrirtækis | Fjarlægir geymda Clockify API lykil fyrirtækisins að fenginni staðfestingu. |
| Skrá vefkróka | Skráir rauntíma vefkróka fyrir tímafærslur í Clockify á móttökuslóðina og sýnir undirritunarlyklana sem stilla þarf á móttakaranum. |
| Fjarlægja vefkróka | Fjarlægir skráða Clockify-vefkróka fyrir tímafærslur. |
| Sýna undirritunarlykla | Sækir undirritunarlykla skráðra vefkróka aftur frá Clockify svo hægt sé að stilla þá á móttakaranum. |
| Clockify tengingar | Opnar listann [Clockify tengingar](/help/timesheets/timesheets-integration-list/) yfir tengsl BC-færslna og Clockify-hluta. |
| Skráðir vefkrókar | Opnar listann [Clockify vefkrókar](/help/timesheets/timesheets-webhooks/) yfir vefkróka sem skráðir eru frá þessu fyrirtæki. |

## Um API lykilinn

Lykillinn er hvorki skrifaður í reit í töflu né birtur í beiðnaskránni. Hann er geymdur í IsolatedStorage á sviði fyrirtækisins, svo hvert fyrirtæki í leigjandanum hefur sinn eigin lykil. **API lykill fyrirtækis geymdur** er lesinn beint úr geymslunni í hvert sinn sem spjaldið er endurnýjað, og þess vegna er ekki hægt að breyta reitnum handvirkt.

Búðu lykilinn til í Clockify undir **Profile Settings → API**. Tengingin sendir hann sem hausinn `X-Api-Key` í hverju kalli.

## Um vefkróka

Þrennt þarf að vera til staðar áður en hægt er að skrá vefkróka: geymdur API lykill, sjálfgefið vinnusvæði og móttökuslóð. Tengingin býr þá til þrjá vefkróka í Clockify — fyrir nýja tímafærslu, uppfærða tímafærslu og eydda tímafærslu — og birtir undirritunarlyklana sem Clockify bjó til fyrir þá. Stilltu þá lykla á móttakaranum svo hann geti staðfest að kall hafi raunverulega komið frá Clockify; tengingin getur ekki sótt þá aftur eftir skráningu nema með aðgerðinni **Sýna undirritunarlykla**.

Séu vefkrókar þegar skráðir skal aðeins skrá aftur eftir að þeir hafa verið fjarlægðir.
