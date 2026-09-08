---
id: hnitbjorg-setup
title: "Uppsetning Bifröst Hnitbjargar"
sidebar_label: "Uppsetning Hnitbjargar"
sidebar_position: 5
---

**Uppsetning Bifröst Hnitbjargar** er eina uppsetningarsíða geymslueiningarinnar. Allt sem viðbótin þarf að láta kerfisstjóra stilla er aðgengilegt héðan, og síðan er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar.

## Geymslutengingar

Síðan sýnir uppsettar geymslutengingar. Hver lína bindur stuttan `Kóða` — gildið sem Bifröst-beiðni sendir sem `storageCode` — við skráðan skráareikning í Business Central. Veljið línu til að opna [geymslutengingarspjaldið](/help/hnitbjorg/storage-card/) og breyta eða prófa þá tengingu.

Auðkenni eru áfram í tengilsviðbótum Business Central. Þessi viðbót geymir aðeins tilvísun í skráareikning, aldrei lykil eða teikn.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Leiðsagnarforrit geymsluuppsetningar** | Keyrir staðlaða leiðsagnarforritið fyrir skráareikninga til að skrá nýjan skráargeymslureikning (Azure Blob Storage, Azure File Share, SharePoint). |
| **Uppsetning geymslu** | Opnar staðlaða listann yfir skráareikninga þar sem skráðum reikningum er viðhaldið. |
| **Uppsetning Bifröst geymslu** | Opnar heildarlistann [Uppsetning Bifröst-geymslu](/help/hnitbjorg/storage-setup/) yfir geymslutengingar. |
| **Hreinsa upphleðslulotur** | Eyðir yfirgefnum bútuðum upphleðslulotum og bitum þeirra. Lotur sem aldrei voru staðfestar eða hætt við skilja eftir gögn; þessi aðgerð fjarlægir þau. |

## Tilkynning við uppsetningu

Allar geymslur eru sóttar um HTTP. Þegar **Leyfa HttpClient-beiðnir** er ekki virkt fyrir viðbótina birtir síðan tilkynningu með tveimur aðgerðum: **Keyra leiðsagnarforrit**, sem opnar leiðsagnaruppsetninguna, og **Opna stillingar viðbótar**, sem fer beint í stillinguna.

## Fyrstu skref

1.  Setjið upp tengilsviðbót fyrir skráageymslu í Business Central og stillið skráareikning í henni.
2.  Opnið **Uppsetningu Bifrastar** og veljið **Uppsetning Bifröst Hnitbjargar** í flokknum **Forrit**.
3.  Hreinsið HTTP-tilkynninguna ef hún birtist.
4.  Bætið við geymslutengingu sem bindur stuttan kóða við skráareikninginn.
5.  Prófið tenginguna á [geymslutengingarspjaldinu](/help/hnitbjorg/storage-card/).
6.  Sendið Bifröst-skilaboð með `"storageCode": "ÞINN-KÓÐI"` í beiðninni.
