---
id: treasury-setup-wizard
title: "Bifröst Ísland Fjárstýring - Bankauppsetning"
---

**Bifröst Ísland Fjárstýring - Bankauppsetning** er leiðsögnin sem tengir Business Central við íslensku
bankana, einn banka í einu. Hún er fyrir kerfisstjórann sem setur forritið upp, og hann þarf
`BIFROST TAdmin ori`.

Ræstu hana af síðunni **Uppsetning með hjálp**, þar sem hún heitir **Setja upp banka Bifröst Ísland
Fjárstýringar**. Þú getur sett upp einn banka núna og komið aftur fyrir hina: það sem þú hefur skráð
helst þótt þú hættir fyrr, og þótt leiðsögnin sé keyrð aftur núllstillir hún aldrei banka sem þegar er
uppsettur.

Áður en þú byrjar skaltu leyfa HTTP-beiðnir út fyrir Bifröst-forrit í
[Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/). Ekkert berst til banka fyrr en þær
eru leyfðar.

## Skref {#steps}

**Velkomin.** Segir hvað leiðsögnin nær yfir og minnir þig á að leyfa HTTP-beiðnir út fyrst.

**Eitt skref fyrir hvern banka.** Arion banki, Íslandsbanki og Landsbankinn, hver með sömu reitum:

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn sem skrefið setur upp. |
| **Virkt** | Hafðu kveikt á banka sem þú notar; slökktu á banka sem þú notar ekki. |
| **Notandanafn** | Notandanafn fyrirtækisins í bankanum. |
| **Lykilorð fyrirtækis** | **Vistað** eða **Ekki vistað**. Notaðu **Skrá lykilorð fyrirtækis** til að skrá það. |
| **Skírteini** | **Vistað** eða **Ekki vistað**. Notaðu **Skrá skírteini** til að hlaða upp `.pfx`-skjalinu og skrá lykilorð þess. |
| **API-lykill** | Aðeins Landsbankinn. **Vistað** eða **Ekki vistað**. Notaðu **Skrá API-lykil** til að skrá hann. |

Hver aðgerð opnar hulinn glugga sem nefnir bankann og leyndarmálið. Skírteini er opnað með lykilorði sínu
áður en nokkuð er vistað, svo rangt lykilorð kemur strax í ljós.

**Ljúka.** Í skrefi síðasta bankans vistar **Ljúka** bankann sem þú varst í, merkir uppsetninguna með
hjálp lokna og lokar leiðsögninni.

## Eftir leiðsögnina {#after-the-guide}

Öllu sem leiðsögnin stillir má breyta síðar í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/), sem sýnir líka lokadag
skírteinisins og opnar rakningarsíðurnar. Ef banki sýnir **Vantar** undir **Leyndarmál** þar hefur
lykilorð, skírteini eða API-lykill sem hann þarf ekki verið skráður.
