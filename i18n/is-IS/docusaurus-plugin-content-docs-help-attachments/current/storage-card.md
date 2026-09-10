---
id: storage-card
title: "Bifröst geymslutenging"
sidebar_label: "Bifröst geymslutenging"
sidebar_position: 3
---

Spjaldið **Bifröst geymslutenging** stillir eina geymslutengingu. Það bindur `storageCode` við ákveðinn Business Central skráareikning og tengil, með valkvæðri grunnslóð fyrir allar aðgerðir.

## Almennt

| Reitur | Lýsing |
| --- | --- |
| Kóði | Einstakur kóði sem Bifrost beiðnir nota til að vísa í þessa tengingu. |
| Lýsing | Læsileg lýsing á geymslutengingunni. |
| Virkt | Hvort þessi tenging er virk. Óvirkar tengingar hafna öllum beiðnum. |

## Bakendi

| Reitur | Lýsing |
| --- | --- |
| Geymslutegund | Hvernig geymsluaðgerðir eru framkvæmdar. Sjálfgefið leiðir í gegnum BC ytri skráageymslu. |
| Tengill | Tegund BC skráageymslutengilsins (Azure Blob Storage, Azure File Share eða SharePoint). |
| Heiti skráareiknings | Skráður skráareikningur til að nota. Veljið **Velja skráareikning** til að velja úr tiltækum reikningum. |
| Grunnslóð | Valkvæð rótarslóð sem er sett á undan öllum skráa- og möppuslóðum í Bifrost beiðnum. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| Velja skráareikning | Opnar uppflettingu á skráareikningum sem skráðir eru fyrir valda tengilinn. |
| Prófa tengingu | Staðfestir að hægt sé að ná í uppsetta geymslubakendann. Sýnir árangur eða villuskilaboð. |
