---
id: bank-user-setup
title: "Bankaaðgangur notanda"
sidebar_label: "Bankaaðgangur minn"
sidebar_position: 5
---

Sérhver bankatenging í Bifröst Ísland Fjárstýringu auðkennir sig með B2B-notandanafni og lykilorði sem bankinn gaf út. Sjálfgefið deilir allt fyrirtækið einu safni, skráðu á [uppsetningarsíðu fjárstýringar](./treasury-setup.md). Á **notandastillingum Bifrastar** getur hver notandi skráð sinn eigin aðgang í staðinn.

Það á við þegar starfsfólk sama fyrirtækis hefur aðskilda aðganga hjá bankanum — til dæmis þegar bankinn gefur út einn B2B-notanda á hvern bókara og skráir umsvif eftir notanda.

Opnaðu síðuna með því að leita að **notandastillingum Bifrastar** og velja notandann þinn.

## Einn flokkur fyrir hvern banka

Síðan fær flokk fyrir hverja bankatengingu sem forritið setur upp: Landsbankinn, Arion banka, Íslandsbanka, Kvika banka og Sparisjóð. Allir fimm virka eins.

| Reitur | Lýsing |
|---|---|
| **Notandanafn** | Persónulegt B2B-notandanafn þitt hjá bankanum. Skildu eftir autt til að nota sjálfgefið nafn fyrirtækisins. |
| **Persónulegt lykilorð geymt** | Aðeins til aflestrar. Sýnir hvort persónulegt lykilorð sé geymt fyrir þig. Notaðu aðgerðirnar til að skrá það eða eyða — gildið sjálft er aldrei sýnt aftur. |
| **Persónulegur API-lykill geymdur** | Aðeins Landsbankinn. Sýnir hvort persónulegur REST API-lykill sé geymdur fyrir þig. |

## Aðgerðir

| Aðgerð | Hvað hún gerir |
|---|---|
| **Skrá … lykilorðið mitt** | Biður um persónulegt lykilorð þitt hjá bankanum og geymir það í dulritaðri geymslu. |
| **Eyða … lykilorðinu mínu** | Fjarlægir geymt persónulegt lykilorð þitt. |
| **Skrá Landsbankinn API-lykilinn minn** | Aðeins Landsbankinn. Geymir persónulegan REST API-lykil þinn. |
| **Eyða Landsbankinn leyndarmálunum mínum** | Aðeins Landsbankinn. Fjarlægir bæði geymt lykilorð og geymdan API-lykil. |

## Hvernig aðgangur er valinn

Fyrir hvert kall finnur tengingin notandanafnið og lykilorðið hvort í sínu lagi:

1. Eigir þú persónulegt notandanafn hjá bankanum er það notað. Annars er sjálfgefið nafn fyrirtækisins notað.
2. Eigir þú persónulegt lykilorð hjá bankanum er það notað. Annars er sjálfgefið lykilorð fyrirtækisins notað.

Þetta sjálfstæði er viljandi — það gerir þér kleift að hafa persónulegt notandanafn en nota áfram sameiginlega lykilorðið, sem er einmitt það sem þarf þegar bankinn gefur út mörg notandanöfn á einn aðgang.

:::caution
Skráir þú persónulegt notandanafn fyrir **annan** bankaaðgang en sjálfgefinn aðgang fyrirtækisins verður þú einnig að skrá persónulegt lykilorð. Persónulegt notandanafn með lykilorði fyrirtækisins er ósamstætt par og bankinn hafnar kallinu.
:::

## Hvar gildin eru geymd

Persónuleg lykilorð og API-lyklar fara í dulritaða geymslu forritsins, bundin þínum notanda í þessu fyrirtæki. Þau eru aldrei skrifuð í töflu, birtast aldrei í fjarmælingum og eru aldrei sýnd aftur. Síðan segir aðeins til um hvort gildi sé til staðar.

## Tengt efni

- [Uppsetning fjárstýringar](./treasury-setup.md) — notandanafn og leyndarmál fyrirtækisins
- [Leyndarmál banka](./treasury-secrets.md) — hvaða leyndarmál hver banki notar
