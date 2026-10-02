---
id: attachments-setup
title: "Uppsetning Bifröst Attachments"
sidebar_label: "Uppsetning Attachments"
sidebar_position: 5
---

**Uppsetning Bifröst Attachments** er eina uppsetningarsíða geymslueiningarinnar. Allt sem viðbótin þarf að láta kerfisstjóra stilla er aðgengilegt héðan, og síðan er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar.

## Geymslutengingar

Síðan sýnir uppsettar geymslutengingar. Hver lína bindur stuttan `Kóða`, sem beiðnir nota til að velja tenginguna, við skráðan skráareikning í Business Central. Veljið línu til að opna [geymslutengingarspjaldið](/help/attachments/storage-card/) og breyta eða prófa þá tengingu.

Auðkenni eru áfram í tengilsviðbótum Business Central. Þessi viðbót geymir aðeins tilvísun í skráareikning, aldrei lykil eða teikn.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Leiðsagnarforrit geymsluuppsetningar** | Keyrir staðlaða leiðsagnarforritið fyrir skráareikninga til að skrá nýjan skráargeymslureikning (Azure Blob Storage, Azure File Share, SharePoint). |
| **Uppsetning geymslu** | Opnar staðlaða listann yfir skráareikninga þar sem skráðum reikningum er viðhaldið. |
| **Uppsetning Bifröst geymslu** | Opnar heildarlistann [Uppsetning Bifröst-geymslu](/help/attachments/storage-setup/) yfir geymslutengingar. |
| **Hreinsa upphleðslulotur** | Eyðir yfirgefnum bútuðum upphleðslulotum og bitum þeirra. Lotur sem aldrei voru staðfestar eða hætt við skilja eftir gögn; þessi aðgerð fjarlægir þau. |

## HTTP á útleið

Allar geymslur eru sóttar um HTTP, svo viðbótin þarf að mega senda HTTP-biðlarabeiðnir. Uppsetningarleiðsögn Bifrastar kveikir á þeim fyrir öll uppsett Bifröst-forrit í einu. Þangað til birtir síðan **Uppsetning Bifrastar** tilkynningu með aðgerðinni **Hefja uppsetningarleiðsögn**, og hver beiðni sem les eða skrifar skrár um geymslutengingu mistekst með villu um að HTTP-biðlarabeiðnir séu ekki virkar fyrir viðbótina.

## Fyrstu skref

1.  Setjið upp tengilsviðbót fyrir skráageymslu í Business Central og stillið skráareikning í henni.
2.  Opnið **Uppsetningu Bifrastar**. Ef hún sýnir HTTP-tilkynninguna, veljið þá fyrst **Hefja uppsetningarleiðsögn** og ljúkið leiðsögninni.
3.  Veljið **Uppsetning Bifröst Attachments** í flokknum **Forrit**.
4.  Bætið við geymslutengingu sem bindur stuttan kóða við skráareikninginn.
5.  Prófið tenginguna á [geymslutengingarspjaldinu](/help/attachments/storage-card/).
6.  Vísið á tenginguna með kóða hennar í beiðnum sem lesa eða skrifa skrár.
