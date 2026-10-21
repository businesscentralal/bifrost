---
id: iceland-setup
title: "Uppsetning Bifröst Ísland"
sidebar_position: 1
---

**Uppsetning Bifröst Ísland** er síðan þar sem kerfisstjórinn velur hvaða umhverfi hver íslensk þjónusta
notar og slær inn innskráningarupplýsingarnar sem þjónusturnar þurfa. Allt fyrir Umsjá, Símann, Skattinn
og Skilagrein er á þessari einu síðu.

Opnaðu hana úr lista uppsettra forrita á [Uppsetning Bifröst](/help/foundation/bifrost-setup/), eða
leitaðu að **Uppsetning Bifröst Ísland**. Ein uppsetningarfærsla er til fyrir hvert fyrirtæki.
Leiðsögnin **Uppsetning tenginga Bifröst Ísland**, sem ræst er úr **Aðstoð við uppsetningu**, sýnir
valkosti þessarar síðu skref fyrir skref (gerðir biðlara, Umsjár-leyfið og sendandanúmerið), svo þessi
síða lýsir henni líka. Leiðsögnin tekur ekki við lykilorðum: sláðu þau inn hér eða í Uppsetningarleiðsögn
Bifröst.

Innskráningarupplýsingar birtast aldrei. Hver **Skrá**-aðgerð opnar faldan glugga, gildið fer beint í
verndaða geymslu og síðan segir aðeins hvort gildi er **Geymt** eða **Ekki geymt**. Útsendar
HTTP-beiðnir forritsins, og innskráningarupplýsingar allra Bifröst forrita, eru einnig stjórnað í
[Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/). Ekkert fer til utanaðkomandi
þjónustu fyrr en HTTP-beiðnir eru leyfðar þar.

## Umsjá {#umsja}

Umsjá er þjónustan sem afhendir þjóðskrá (Þjóðskrá Íslands). Hún krefst leyfis.

| Reitur | Lýsing |
| --- | --- |
| **Tegund biðlara Umsjár** | Hvaða tengingu við Umsjá aðgerðir þjóðskrár nota. |
| **Leyfisnúmer** | Leyfisnúmer Umsjár. Það er sent með hverri innskráningu. |
| **Innskráningarupplýsingar** | Hvort notandanafn og lykilorð Umsjár eru geymd. |

## SMS {#sms}

| Reitur | Lýsing |
| --- | --- |
| **Tegund SMS biðlara** | Gáttin sem notuð er til að senda SMS. Síminn er gátt þessarar útgáfu. |
| **Sjálfgefið sendandanúmer Símans** | Sendandinn sem birtist á smáskilaboðunum þegar beiðnin tilgreinir engan, að hámarki 11 stafir. |
| **Innskráningarupplýsingar** | Hvort notandanafn og lykilorð Símans magnSMS eru geymd. |

## Skatturinn {#skatturinn}

Skatturinn (Ríkisskattstjóri, RSK) tekur við skilum á virðisaukaskatti, staðgreiðslu og
fjármagnstekjuskatti.

| Reitur | Lýsing |
| --- | --- |
| **Tegund biðlara Skattsins** | **Raun** kallar á framleiðsluþjónustu Skattsins. **Prófun** kallar á prófunarumhverfi Skattsins. Raun- og prófunarumhverfið hafa hvort sitt lykilorð. Byrjaðu á **Prófun**. |
| **VSK lykilorð** | Hvort lykilorð vefþjónustu virðisaukaskatts er geymt. Kennitalan er lesin úr **Kennitala** í **Fyrirtækjaupplýsingum**, ekki af þessari síðu. |
| **Staðgreiðslu lykilorð** | Hvort lykilorð vefþjónustu staðgreiðslu er geymt. |
| **Lykilorð fjármagnstekjuskatts** | Hvort lykilorð fjármagnstekjuskatts er geymt. Sé það ekki geymt er staðgreiðslu lykilorðið notað í staðinn. |

## Skilagrein {#skilagrein}

| Reitur | Lýsing |
| --- | --- |
| **Tegund biðlara Skilagreinar** | Hvaða tengingu skilagreinar nota. |

Hver innheimtuaðili hefur sitt eigið lykilorð fyrir vefþjónustu. Opnaðu **Innheimtuaðilar** og notaðu
**Skrá lykilorð vefþjónustu** á innheimtuaðilanum; sjá
[Innheimtuaðilar skilagreinar](/help/iceland/iceland-skilagrein/).

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá notandanafn**, **Skrá lykilorð**, **Hreinsa innskráningarupplýsingar** | Sláðu inn eða fjarlægðu notandanafn og lykilorð Umsjár. |
| **Skrá notandanafn Símans**, **Skrá lykilorð Símans**, **Hreinsa innskráningarupplýsingar Símans** | Sláðu inn eða fjarlægðu notandanafn og lykilorð Símans magnSMS. |
| **Skrá VSK lykilorð**, **Skrá staðgreiðslu lykilorð**, **Skrá lykilorð fjármagnstekjuskatts** | Sláðu inn lykilorð viðkomandi þjónustu Skattsins fyrir umhverfið sem valið er í **Tegund biðlara Skattsins**. |
| **Hreinsa lykilorð Skattsins** | Fjarlægir geymd lykilorð virðisaukaskatts, staðgreiðslu og fjármagnstekjuskatts valda umhverfisins. |
| **Leyndarmál forrits** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/) síuð á þetta forrit, til að sjá hvaða innskráningarupplýsingar eru geymdar, hvenær þær voru færðar inn og af hverjum. |
| **Uppsetningarleiðsögn** | Opnar Uppsetningarleiðsögn Bifröst. |
| **Innheimtuaðilar** | Opnar lista innheimtuaðila. |
| **Einingar þjóðskrár** | Opnar staðbundið afrit af þjóðskrá; sjá [Einingar þjóðskrár](/help/iceland/iceland-umsja-registry/). |

## Gott að vita {#good-to-know}

- Innskráningarupplýsingar flytjast ekki við uppfærslu úr eldri útgáfu eða þegar forritið er sett upp
  við hlið forvera þess. Sláðu öll lykilorð og leyfi inn aftur á þessari síðu.
- Þegar **Tegund biðlara Skattsins** breytist breytast geymdu lykilorðin sem eru notuð. Lykilorð sem
  var fært inn fyrir **Prófun** virkar ekki fyrir **Raun**.
- Hverjir mega senda skil, hlaða þjóðskrá eða senda SMS ræðst af heimildasöfnum; sjá
  [Heimildir](/iceland/#permissions).
- Annáll beiðna felur efni kalla á Umsjá, Skattinn og Skilagrein. Með því að kveikja á
  **Villuleitarstilling beiðna** í Uppsetningu Bifröst er efnið geymt í heild meðan þú leitar að villu;
  slökktu á stillingunni aftur þegar því er lokið.
