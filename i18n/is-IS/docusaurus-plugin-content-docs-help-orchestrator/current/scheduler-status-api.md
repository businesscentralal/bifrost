---
id: scheduler-status-api
title: "Staða vinnsluraðara"
sidebar_label: "Staða vinnsluraðara"
sidebar_position: 20
---

API-ið **Staða vinnsluraðara** gerir ytra eftirlitstóli kleift að kanna hvort Bifröst stjórnandi sjálfur sé í gangi og ræsa hann aftur ef hann er það ekki. Það hefur enga síðu í Business Central og notendur opna það ekki.

Það er eitt af [API vinnsluraðara](/help/orchestrator/scheduled-entry-api/) og er birt á `/api/origo/jobQueueOrchestrator/v1.0/status`. Það skilar uppsetningu stjórnandans fyrir fyrirtækið, sömu færslu og á síðunni [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/).

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| `systemId` | Auðkenni uppsetningarfærslunnar. |
| `jobQueueCategoryCode` | Vinnsluraðaflokkur stjórnunarfærslu stjórnandans. Má breyta. |
| `logJobQueueActivity` | Hvort virkni vinnsluraða sé skráð. Má breyta. |
| `status` | Óbreytanlegt. Texti sem lýsir stjórnunarfærslunni: í gangi, útrunnin, mistókst eða ekki uppsett. |
| `readyToStart` | Óbreytanlegt. `true` þegar stjórnunarfærslan er tilbúin og ekki komin fram yfir tíma, það er þegar stjórnandinn er í gangi. |

## Bundnar aðgerðir {#bound-actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Restart** | Tímasetur stjórnunarfærsluna upp á nýtt, hver sem staða hennar er. Skilar stjórnunarfærslunni frá [Vinnsluraðafærslur API](/help/orchestrator/entries-api/). |
| **RestartIfNeeded** | Tímasetur stjórnunarfærsluna upp á nýtt aðeins þegar `readyToStart` er `false`. Hentar eftirlitstóli sem keyrir reglulega. |
