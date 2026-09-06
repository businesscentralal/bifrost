---
id: storage-account-lookup
title: "Velja skráareikning"
sidebar_label: "Velja skráareikning"
sidebar_position: 2
---

**Velja skráareikning** er uppfletting sem sýnir þá Business Central skráareikninga sem eru skráðir fyrir tengilinn sem valinn er á spjaldinu [Bifröst geymslutenging](/help/hnitbjorg/storage-card/). Þegar reikningur er valinn er geymslutengingin bundin honum, þannig að allar Bifröst-beiðnir sem nota `storageCode` þessarar tengingar lesa og skrifa í gegnum þann reikning.

Opnið uppflettinguna með aðgerðinni **Velja skráareikning** á geymslutengingarspjaldinu. Listinn er tómur þar til að minnsta kosti einn skráareikningur hefur verið skráður í uppsetningu tengilsins sjálfs — til dæmis í Azure Blob Storage tenglinum eða SharePoint tenglinum. Notið staðlaða **leiðsagnarforritið fyrir skráareikninga**, aðgengilegt úr flokknum **Geymsla** á Uppsetningarsíðu Bifrastar, til að skrá einn.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Heiti | Birtingarheiti skráða skráareikningsins, eins og það var gefið upp þegar hann var stilltur í tengilsforritinu. |
| Auðkenni reiknings | Auðkenni skráareikningsins. Þetta er það sem geymslutengingin vistar; engin auðkenni eru afrituð. |

## Athugasemdir

-   Aðeins reikningar sem tilheyra tenglinum sem er valinn á spjaldinu eru sýndir. Ef tenglinum er breytt hreinsast núverandi val.
-   Auðkenni reikningsins eru áfram í tengilsforritinu. Þessi viðbót geymir aðeins auðkenni og heiti reikningsins.
-   Eftir að reikningur hefur verið valinn skal keyra **Prófa tengingu** á spjaldinu til að staðfesta að bakendinn sé aðgengilegur.
