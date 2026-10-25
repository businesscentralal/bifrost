---
id: bank-user-setup
title: "Bankaaðgangur notanda"
---

Bifröst Ísland Fjárstýring bætir flokki fyrir hvern banka við síðuna
[Ritill notandauppsetningar](/help/foundation/bifrost-user-setup-editor/) í **Uppsetning notanda Bifröst**.
Þessi síða er fyrir notanda sem hefur eigin innskráningu í banka, og fyrir kerfisstjórann sem aðstoðar
hann.

Sjálfgefið notar hvert kall til banka notandanafn og lykilorð fyrirtækisins úr
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/). Þegar bankinn hefur
látið þig fá eigin innskráningu skráir þú hana hér og köllin þín nota hana í staðinn.

Opnaðu **Uppsetning notanda Bifröst** og svo þinn eigin notanda.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **... notandanafn** | Þitt eigið notandanafn í bankanum, til dæmis **Arion banki notandanafn**. Hafðu það autt til að nota notandanafn fyrirtækisins. |
| **Persónulegt lykilorð geymt** | Hvort þitt eigið lykilorð sé vistað. Gildið er aldrei sýnt. |
| **Persónulegur API-lykill geymdur** | Aðeins Landsbankinn. Hvort þinn eigin API-lykill sé vistaður. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá ... lykilorðið mitt** | Opnar hulinn glugga og vistar þitt eigið lykilorð í þeim banka. |
| **Eyða ... lykilorðinu mínu** | Fjarlægir vistað lykilorð þitt í þeim banka. |
| **Skrá Landsbankinn API-lykilinn minn** | Vistar þinn eigin API-lykil í Landsbankanum. |
| **Eyða Landsbankinn leyndarmálunum mínum** | Fjarlægir bæði lykilorð þitt og API-lykil þinn í Landsbankanum. |

## Hvernig kall velur innskráningu {#how-a-call-chooses-the-login}

- **Notandanafnið þitt er útfyllt:** kallið notar notandanafnið þitt með þínu eigin lykilorði. Ef ekkert
  lykilorð frá þér er vistað stöðvast kallið og biður þig að skrá það. Lykilorð fyrirtækisins er aldrei
  sent með notandanafninu þínu.
- **Notandanafnið þitt er autt:** kallið notar notandanafn og lykilorð fyrirtækisins.
- **API-lykill Landsbankans:** þinn eigin lykill er notaður þegar hann er vistaður, annars lykill
  fyrirtækisins.

## Gott að vita {#good-to-know}

- Lykilorð þitt og API-lykill eru geymd fyrir þig eingöngu, í þessu fyrirtæki, í varinni geymslu. Enginn
  annar sér þau og þú þarft ekki `BIFROST TAdmin ori` til að skrá þau.
- Hvað þú mátt gera í bankanum ræðst áfram af heimildasamstæðum þínum í Business Central og réttindum
  þínum í bankanum.
