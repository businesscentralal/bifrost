---
id: storage-setup
title: "Uppsetning Bifröst-geymslu"
sidebar_label: "Uppsetning Bifröst-geymslu"
sidebar_position: 4
---

Síðan **Uppsetning Bifröst-geymslu** sýnir allar uppsettar geymslutengingar. Hver lína bindur stuttan `Kóða` — gildið sem Bifröst-beiðni sendir sem `storageCode` — við ytri skráareikning í Business Central.

Sama síða er aðgengileg úr [Uppsetningu Bifröst Hnitbjargar](/help/attachments/attachments-setup/), sem er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| Kóði | Kóðinn sem Bifröst-beiðnir nota til að velja þessa geymslutengingu (til dæmis `AZURE-MAIN`). |
| Lýsing | Læsileg lýsing á geymslutengingunni. |
| Tengill | Tegund skráageymslutengilsins í BC (Azure Blob Storage, Azure File Share eða SharePoint). |
| Heiti skráareiknings | Heiti skráðs skráareiknings sem er bundinn þessari tengingu. |
| Grunnslóð | Valkvæð rótarslóð sem sett er á undan öllum skráaaðgerðum á þessari tengingu. Skildu eftir autt til að vísa á rót reikningsins. |
| Virk | Hvort þessi tenging tekur við Bifröst-beiðnum. Óvirkar tengingar skila villu. |

## Aðgerðir

Til að breyta tengingu eða prófa hana, veljið línu til að opna [geymslutengingarspjaldið](/help/attachments/storage-card/).

## Leiðsagnaruppsetning

Áður en fyrsta beiðnin nær til skýgeymslu þarf að virkja HTTP-biðlarabeiðnir fyrir viðbótina. Leiðsagnaruppsetningin **Setja upp Bifröst-geymslu** leiðir í gegnum það skref og staðfestir niðurstöðuna. Hún er skráð undir leiðsagnaruppsetningum í flokknum Viðbætur.
