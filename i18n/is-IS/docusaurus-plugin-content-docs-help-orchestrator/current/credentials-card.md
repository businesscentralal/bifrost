---
id: credentials-card
title: "Spjald auðkenna biðlara"
sidebar_label: "Spjald auðkenna biðlara"
sidebar_position: 2
---

**Spjald auðkenna biðlara** er þar sem eitt auðkennispar er búið til og viðhaldið. Auðkenni og leyniorð biðlara eru ekki reitir á spjaldinu — þau eru í leyndarmálageymslu Bifrastar og því er ekki hægt að lesa þau aftur. Spjaldið sýnir aðeins hvort gildin hafi verið skráð.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði auðkennisparsins. Skyldureitur. |
| **Lýsing** | Lýsing á því í hvað auðkennin eru notuð. |
| **Auðkenni biðlara** | Staða, ekki breytanleg: hvort auðkenni biðlara hafi verið geymt. |
| **Leyniorð biðlara** | Staða, ekki breytanleg: hvort leyniorð biðlara hafi verið geymt. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Skrá auðkenni biðlara** | Opnar sameiginlega hulda innsláttargluggann og geymir auðkennið sem ytri þjónustan gaf út. |
| **Skrá leyniorð biðlara** | Geymir leyniorðið sem ytri þjónustan gaf út. |
| **Hreinsa leyndarmál** | Fjarlægir bæði geymdu gildin. Skráningarnar haldast, svo spjaldið sýnir áfram að gildis sé vænst. |

## Leyndarmál

Bæði gildin eru geymd á öruggan hátt í Business Central, aðeins fyrir þetta fyrirtæki, og eru aldrei sýnd aftur. Þegar færslunni er eytt eru bæði gildin hreinsuð.

## Ábendingar

-   Business Central heldur geymdum leyndarmálum aðskildum eftir viðbótum, svo gildi úr útgefna Origo Cloud Events vinnsluraðaranum flytjast ekki með. Skráið þau einu sinni.
-   Vísað er í auðkennisparið úr vinnsluraðarafærslu gegnum reitinn **Kóði auðkenna biðlara** á [spjaldi færslunnar](/help/orchestrator/scheduled-entry-card/).
