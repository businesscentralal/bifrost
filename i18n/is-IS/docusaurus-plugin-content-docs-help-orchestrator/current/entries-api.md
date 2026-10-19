---
id: entries-api
title: "Vinnsluraðafærslur API"
sidebar_label: "Vinnsluraðafærslur API"
sidebar_position: 19
---

**Vinnsluraðafærslur API** veitir samþættingum óbreytanlega sýn á staðlaðar vinnsluraðafærslur fyrirtækisins, svo ytra eftirlitstól geti séð hvað er tímasett, hvað er í keyrslu og hvað hefur mistekist. Það hefur enga síðu í Business Central og notendur opna það ekki.

Það er eitt af [API vinnsluraðara](/help/orchestrator/scheduled-entry-api/) og er birt á `/api/origo/jobQueueOrchestrator/v1.0/queueEntries`.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| `id` | Auðkenni vinnsluraðafærslunnar. |
| `objectTypeToRun`, `objectIDToRun`, `objectCaptionToRun` | Skýrslan eða kóðaeiningin sem færslan keyrir. |
| `description` | Lýsing færslunnar. |
| `status` | Staða færslunnar, til dæmis Tilbúin, Í vinnslu, Villa eða Í bið. |
| `scheduled` | Hvort færslan sé tímasett til keyrslu. |
| `orchestratorEnabled` | Hvort Bifröst stjórnandi hafi eftirlit með færslunni. |
| `jobQueueCategoryCode` | Vinnsluraðaflokkur færslunnar. |
| `runOnMondays` … `runOnSundays` | Vikudagarnir sem færslan keyrir. |
| `startingTime`, `endingTime` | Fyrsti og síðasti tími dagsins sem færslan keyrir. |
| `earliestStartDateTime` | Fyrsta dagsetning og tími sem færslan má keyra. |
| `userID` | Notandinn sem færslan keyrir sem. |
| `errorMessage` | Síðustu villuboð færslunnar. |

## Bundin aðgerð {#bound-action}

| Aðgerð | Lýsing |
| --- | --- |
| **AddToJobQueueOrchestrator** | Setur vinnsluraðafærsluna undir eftirlit stjórnandans. Hún býr til vinnsluraðarfærslu út frá vinnsluraðafærslunni, eða skiptir út þeirri sem fyrir er, og skilar henni frá endapunkti vinnsluraðarfærslna. Ekki er hægt að bæta við stjórnunarfærslu stjórnandans sjálfs. |
