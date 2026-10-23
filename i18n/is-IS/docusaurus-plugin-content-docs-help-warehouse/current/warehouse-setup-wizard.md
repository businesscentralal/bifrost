---
id: warehouse-setup-wizard
title: "Setja upp Bifröst vöruhús"
sidebar_position: 1
---

**Setja upp Bifröst vöruhús** er leiðsögnin um uppsetningu Bifröst vöruhúss. Hún er fyrir kerfisstjórann
sem setur forritið upp: hún sýnir hvað Vöruhús bætir við Bifröst, athugar að HTTP út á við sé leyft í
gegnum grunnkerfið og útskýrir hvaða heimildasamstæður notendur þurfa.

Opnaðu **Aðstoðuð uppsetning** og veldu **Setja upp Bifröst vöruhús** undir **Viðbætur**. Þú getur
keyrt leiðsögnina aftur hvenær sem er.

## Skref {#steps}

**Velkomin í Bifröst vöruhús.** Lýsir vöruhúsaaðgerðunum: hólfainnihaldi og opnum vöruhúsaaðgerðum,
móttökum og afhendingum frá stofnun, í gegnum forskoðun, til bókunar, og tínslum og frágangi frá stofnun
til skráningar. Gervigreindaraðstoð og önnur kerfi nálgast þessar aðgerðir í gegnum Bifröst í nafni
innskráðs notanda og innan heimilda hans. **Sýna aðgerðir** opnar
[Tiltækar skilaboðategundir](/help/foundation/bifrost-message-type-list/), þar sem uppsettar aðgerðir eru
skráðar. **Skjölun** opnar [skjölun Vöruhúss](/warehouse/).

**HTTP í gegnum Bifröst uppsetningu.** Bifröst þarf HTTP út á við fyrir leyfisveitingu.

| Reitur | Lýsing |
| --- | --- |
| **HTTP virkt** | Sýnir hvort **Leyfa HttpClient-beiðnir** sé virkt fyrir Bifröst vöruhús. Leiðsögnin les stillinguna aðeins. |

Ef HTTP er ekki virkt opnar **Virkja HTTP í Bifröst uppsetningu**
[Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/); grunnkerfið gerir breytinguna.
Komdu aftur og veldu **Staðfesta** til að lesa stillinguna aftur. Ef þú hefur ekki heimild til að breyta
stillingum viðbóta kemur það fram í skrefinu: biddu þá kerfisstjóra sem hefur **SUPER**
heimildasamstæðuna um að leyfa beiðnirnar.

**Aðgangur notenda.** Útskýrir heimildasamstæður Vöruhúss:

| Heimildasamstæða | Heimilar |
| --- | --- |
| `BIFROST WhsePost ori` | Bókun vöruhúss og skráningu vöruhúsaaðgerða. |
| `BIFROST WhseInv ori` | Einnig reikningsfærslu þegar vöruhúsaafhending er bókuð. |

Notendur þurfa einnig Bifröst-heimildasamstæður grunnkerfisins. Úthlutaðu samstæðunum beint til notenda
eða í gegnum Microsoft Entra öryggishóp; **Opna notendur** og **Opna heimildasamstæður** opna staðlaðar
síður. Leiðsögnin úthlutar aldrei heimildum.

**Tilbúið til að ljúka.** Tekur saman **Vöruhúsaaðgerðir**, **HTTP** (**Lokið** eða **Þarf stjórnanda**)
og **Leiðbeiningar um aðgang**. **Ljúka** merkir leiðsögnina sem lokið, einnig þegar HTTP þarfnast enn
stjórnanda. Að loka leiðsögninni fyrr breytir ekki fyrri lokastöðu.

Notaðu **Til baka** og **Áfram** til að fara milli skrefa.

## Ábyrgð {#responsibility}

Leiðsögnin breytir hvorki HTTP-stillingum, skráir samþykki né úthlutar heimildum. HTTP er virkjað í
gegnum ferli kerfisstjóra í grunnkerfinu, og heimildasamstæðurnar sem þú úthlutar ráða því hver má bóka
og reikningsfæra.
