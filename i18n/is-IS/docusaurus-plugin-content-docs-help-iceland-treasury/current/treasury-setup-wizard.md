---
id: treasury-setup-wizard
title: "Uppsetningarleiðsögn fjárstýringar"
sidebar_label: "Uppsetningarleiðsögn"
sidebar_position: 3
---

Leiðsögnin **Setja upp Bifröst Ísland Fjárstýring** fer með þig í gegnum það að tengja Business Central við íslensku bankana. Hún birtist í listanum **Leiðsögn við uppsetningu** og þú getur einnig ræst hana með aðgerðinni **Uppsetningarleiðsögn** á síðunni [Uppsetning Bifröst Ísland Fjárstýringar](./treasury-setup.md).

Ein leiðsögn nær yfir alla bankana fimm. Þú getur stillt einn banka núna og komið aftur síðar fyrir hina — ekkert sem þú skráir tapast þótt þú hættir snemma, og endurkeyrsla leiðsagnarinnar núllstillir aldrei banka sem þú hefur þegar sett upp.

## Skref

### 1. Velkomin

Útskýrir hvað leiðsögnin nær yfir. Veldu **Áfram**.

### 2. Leyfa útleið HTTP

Bankatengingarnar hringja í bankana yfir HTTPS og Business Central lokar á útleið frá viðbót þar til kerfisstjóri leyfir hana.

Skrefið sýnir hvort beiðnir séu **Leyfðar** eða **Ekki leyfðar**. Ef þær eru ekki leyfðar:

- Hafir þú heimild til að breyta stillingum viðbóta, veldu **Leyfa HTTP-beiðnir** og skrefið uppfærist sjálft.
- Hafir þú ekki þá heimild, veldu **Opna stillingar viðbótar** og biddu kerfisstjóra um að haka við **Leyfa HttpClient-beiðnir** fyrir Bifröst Ísland Fjárstýringu.

Ekkert kemst til banka fyrr en þetta er gert, svo það borgar sig að staðfesta að staðan sé **Leyft** áður en haldið er áfram.

### 3.–7. Eitt skref fyrir hvern banka

Landsbankinn, síðan Arion banki, Íslandsbanki, Kvika banki og Sparisjóðir. Hvert skref sýnir sömu fjögur atriðin:

| Reitur | Hvað á að gera |
|---|---|
| **Banki** | Aðeins til lestrar — bankinn sem skrefið stillir. |
| **Virkt** | Hafðu kveikt fyrir banka sem þú notar; slökktu fyrir banka sem þú notar ekki. |
| **Notandanafn** | Sjálfgefna B2B-notandanafnið sem bankinn gaf þér. |
| **Lykilorð fyrirtækis** / **Skírteini** / **API-lykill** | Aðeins staða — **Vistað** eða **Ekki vistað**. Notaðu aðgerðirnar til að skrá gildin. |

Línurnar **Skírteini** og **API-lykill** birtast aðeins fyrir þá banka sem nota þau, svo skref Íslandsbanka sýnir hvorugt og aðeins Landsbankinn sýnir API-lykil.

Notaðu **Skrá lykilorð fyrirtækis**, **Skrá skírteini** og **Skrá API-lykil** til að skrá gildin. Hver aðgerð opnar hulinn glugga sem nefnir bankann og leyndarmálið, svo ljóst sé um hvað er beðið. Skírteini er staðfest gegn lykilorðinu sem þú slærð inn áður en hvorugt er vistað.

### 8. Ljúka

**Ljúka** vistar síðasta bankann sem þú varst að breyta, merkir leiðsögnina sem lokna og lokar henni. Listinn **Leiðsögn við uppsetningu** sýnir þá Bifröst Ísland Fjárstýringu sem frágengna.

## Eftir leiðsögnina

Öllu sem leiðsögnin stillir má breyta síðar á síðunni [Uppsetning Bifröst Ísland Fjárstýringar](./treasury-setup.md), sem sýnir einnig upplýsingar um skírteinið og leyfir þér að hreinsa leyndarmál.

Sýni banki enn **Vantar** undir **Leyndarmál** á þeirri síðu var eitthvað sem tengingin þarf ekki skráð — oftast skírteini biðlara, sem ekki er hægt að sleppa hjá bönkunum fjórum sem undirrita beiðnir sínar.
