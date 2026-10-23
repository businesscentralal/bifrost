---
id: treasury-secrets
title: "Leyndarmál banka"
---

**Slá inn leyndarmál banka** er hulinn gluggi sem vistar lykilorð eða API-lykil fyrir banka. Þessi síða
er fyrir kerfisstjórann sem skráir leyndarmál fyrirtækisins í bönkum og fyrir notendur sem skrá sín eigin.
Hún útskýrir líka hvaða leyndarmál hver banki notar og hvar þau eru geymd.

Glugginn opnast úr **Skrá lykilorð fyrirtækis** og **Skrá API-lykil** í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/) og í
[uppsetningarleiðsögninni](/help/iceland-treasury/treasury-setup-wizard/), og úr aðgerðunum sem skrá þitt
eigið lykilorð eða API-lykil í **Bifröst notandauppsetningu**.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Leyndarmál** | Bankinn og leyndarmálið sem gildið er vistað fyrir, til dæmis lykilorð fyrirtækis í Landsbankanum. |
| **Gildi** | Gildið sem á að vista. Það er hulið meðan þú slærð það inn og birtist aldrei aftur. |

Sláðu inn eða límdu gildið og veldu **Í lagi**. **Hætta við** vistar ekkert.

## Leyndarmál hvers banka {#the-secrets-of-each-bank}

| Leyndarmál | Geymt fyrir | Notað af |
| --- | --- | --- |
| **Lykilorð fyrirtækis** | Fyrirtækið | Öllum bönkum |
| **Lykilorð notanda** | Einn notanda | Öllum bönkum, þegar notandinn hefur eigin innskráningu |
| **Skírteini** og **Lykilorð skírteinis** | Fyrirtækið | Öllum bönkum, til að undirrita beiðnir |
| **API-lykill** | Fyrirtækið | Landsbankanum |
| **API-lykill notanda** | Einn notanda | Landsbankanum, í stað API-lykils fyrirtækisins |

Skírteinið er `.pfx`-skjal. **Skrá skírteini** hleður því upp og biður um lykilorð þess; skírteinið er
opnað með lykilorðinu áður en hvorugt er vistað.

## Hvar þau eru geymd {#where-they-are-kept}

Leyndarmál eru geymd í varinni geymslu Bifröst Ísland Fjárstýringar sjálfrar. Þau eru aldrei skrifuð í
töflu, annál eða villuboð og birtast aldrei aftur; síðurnar segja aðeins hvort gildi sé vistað. Hvert
kall til banka er skráð í **Annál beiðna Bifröst** með lykilorðin falin.

Þar sem geymslan tilheyrir þessu forriti flytjast leyndarmál ekki úr öðru forriti, þar á meðal eldri
forritum Origo fyrir Arion banka og Landsbankann: skráðu þau einu sinni eftir uppsetningu.

## Innskráning fyrirtækis og eigin innskráning {#company-and-personal-logins}

Notandanafn fyrirtækisins fylgir lykilorði fyrirtækisins, og eigið notandanafn notanda fylgir lykilorði
þess notanda. Þeim er aldrei blandað saman, svo lykilorð sem skráð er fyrir eina innskráningu er aldrei
sent með annarri. Ef notandi hefur skráð eigið notandanafn en ekkert lykilorð stöðvast kallið og segir það.

## Algeng verk {#common-tasks}

**Breyta leyndarmáli.** Skráðu það aftur; nýja gildið kemur í stað þess gamla.

**Fjarlægja leyndarmál fyrirtækisins fyrir banka.** Veldu **Hreinsa leyndarmál fyrirtækis** í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/). Bankinn er áfram virkur;
köll til hans stöðvast þar til ný leyndarmál eru skráð.

**Athuga hvað er vistað.** **Leyndarmál** í Bifröst Ísland Fjárstýring - uppsetning sýnir **Fullskráð**
eða **Vantar** fyrir hvern banka. Aðeins handhafi `BIFROST TAdmin ori` getur skráð eða hreinsað leyndarmál
fyrirtækisins; hver notandi skráir og hreinsar sín eigin í **Bifröst notandauppsetningu**.
