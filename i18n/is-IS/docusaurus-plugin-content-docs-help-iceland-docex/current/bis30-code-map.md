---
id: bis30-code-map
title: "BIS30 kóðavörpun"
sidebar_label: "BIS30 kóðavörpun"
sidebar_position: 3
---

**BIS30 kóðavörpun** varpar Peppol BIS 3.0 kóðunum í mótteknum rafrænum reikningi yfir í kóðana sem
fyrirtækið þitt notar í Business Central. Notaðu hana þegar ekki tekst að gera innkaupaskjal úr mótteknum
reikningi af því að kóði í honum er ekki til í Business Central, til dæmis *Mælieiningin H87 finnst
ekki*.

Þegar móttekið skjal er lesið er mælieiningu hverrar línu varpað í gegnum þessa töflu. Kóði sem hefur
enga færslu helst óbreyttur, svo hann virkar aðeins ef sami kóði er til í Business Central.

Opnaðu síðuna með aðgerðinni **BIS30 kóðavörpun** á [Uppsetning skjalaskipta](/help/iceland-docex/docex-setup/).

![BIS30 kóðavörpun með mælieiningunum C62 og H87 varpað á STYKKI](/img/iceland-docex/is-is/bis30-code-map.png)

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Tegund vörpunar** | Tegund kóðans: **Mælieining**, **Gjaldmiðill**, **VSK-flokkur**, **Land/svæði** eða **Greiðslumáti**. Mótteknu skjölin nota færslurnar af tegundinni **Mælieining**. |
| **Upprunakóði** | Peppol-kóðinn eins og hann er í mótteknu skjali, til dæmis `H87` eða `C62` fyrir stykki. |
| **Markkóði** | Kóðinn í Business Central sem honum er varpað í, til dæmis þín eigin mælieining fyrir stykki. |
| **Lýsing** | Lýsing færslunnar. |
| **Lokað** | Kemur í veg fyrir að færslan sé notuð, án þess að eyða henni. |

## Ábendingar {#tips}

- Hverjum upprunakóða má aðeins varpa einu sinni fyrir hverja tegund vörpunar.
- Net og sendendur nota mismunandi kóða fyrir sömu einingu: stykki er oft `H87` eða `C62`. Bættu við
  færslu fyrir hvern kóða sem birgjarnir þínir senda.
- Notaðu **Lokað** frekar en að eyða færslu þegar hún á ekki lengur að gilda en þú vilt halda henni.
- Peppol-kóðalistarnir sjálfir krefjast engra innskráningarupplýsinga: biddu aðstoðina um
  mælieiningakóða Peppol BIS 3.0 til að finna gilda upprunakóða.
