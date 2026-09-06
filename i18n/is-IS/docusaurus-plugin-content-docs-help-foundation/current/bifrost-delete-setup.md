---
id: bifrost-delete-setup
title: "Uppsetning eyðingarskráningar"
sidebar_label: "Uppsetning eyðingarskráningar"
sidebar_position: 5
---

Síðan **Uppsetning eyðingarskráningar** stýrir því hvaða töflur í Business Central skrá eyddar færslur í [Bifröst eyðingaskrá](/help/foundation/bifrost-delete-log/). Hver lína tengir töflu við eyðingarskráningu og getur valfrjálst vistað fulla JSON-mynd af færslunni þegar henni er eytt.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Tafla nr.** | Auðkenni töflunnar sem á að skrá eyðingar fyrir. Þessi reitur er nauðsynlegur. |
| **Töfluheiti** | Heiti töflunnar (lesskráð, dregið af taflanúmeri). |
| **Vista færslu** | Þegar virkt er vistuð full JSON-mynd af færslunni í eyðingarskrá þegar henni er eytt. Gagnlegt til eftirlits en eykur geymslunotkun. |

## Ábendingar

-   Bættu aðeins við töflum sem þú þarft virkilega að rekja eyðingar á. Hvert rakin tafla eykur álag á eyðingaraðgerðir.
-   Virkjaðu **Vista færslu** þegar þú þarft að vita hvaða gögn færslan innihélt, ekki aðeins að henni var eytt.
-   Hægt er að flytja JSON-gögn úr [eyðingaskránni](/help/foundation/bifrost-delete-log/) með **Flytja út JSON** aðgerðinni.
