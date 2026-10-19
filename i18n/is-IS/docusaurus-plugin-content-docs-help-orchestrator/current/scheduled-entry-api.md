---
id: scheduled-entry-api
title: "Vinnsluraðarfærslur API"
sidebar_label: "Vinnsluraðarfærslur API"
sidebar_position: 14
---

**Vinnsluraðarfærslur API** er API-síða fyrir forritara sem tengja annað kerfi við Business Central. Hún
les og skrifar vinnsluraðarfærslur: hvað hvert verk keyrir, hvenær, hvernig það tilkynnir og hvort það sé
lokað. Notendur opna hana ekki; sömu færslum er viðhaldið á
[Spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/).

Síðan er birt með API-útgefandanum `origo`, API-hópnum `jobQueueOrchestrator` og útgáfunni `v1.0`, sem
safnið `scheduledEntries`:

```text
/api/origo/jobQueueOrchestrator/v1.0/companies({companyId})/scheduledEntries
```

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| `id` | Auðkenni færslunnar, sem er líka auðkenni vinnsluraðafærslu hennar. |
| `objectTypeToRun`, `objectIDToRun` | Skýrslan eða kóðaeiningin sem verkið keyrir. |
| `description` | Lýsing færslunnar. |
| `jobQueueCategoryCode` | Vinnsluraðaflokkurinn. |
| `noOfMinutesBetweenRuns` | Lágmarksfjöldi mínútna milli keyrslna. |
| `earliestStartDateTime` | Fyrsta dagsetning og tími sem verkið má keyra. |
| `blocked` | Hvort færslan sé lokuð. |
| `notificationType`, `notificationRecipient` | Hvernig og hverjum tilkynningar eru sendar. |
| `recordIDToProcess`, `relatedRecordSystemId` | Færslan sem verkið vinnur úr, þegar það var stofnað fyrir færslu. |
| `scheduled` | Aðeins til lestrar: hvort vinnsluraðafærsla sé tímasett fyrir færsluna. |

## Bundnar aðgerðir {#bound-actions}

Hver aðgerð vinnur á einni færslu og krefst þess að færslan sé ekki lokuð.

| Aðgerð | Lýsing |
| --- | --- |
| `ScheduleJobQueueEntryUpdate` | Eyðir vinnsluraðafærslu færslunnar og skilar færslunni. Bifröst stjórnandi stofnar nýja vinnsluraðafærslu í næstu yfirferð. |
| `UpdateJobQueueEntry` | Eyðir vinnsluraðafærslu færslunnar og tímasetur strax nýja út frá núverandi skilgreiningu. |
| `RestartJobQueueEntry` | Endurræsir vinnsluraðafærslu færslunnar. |
| `SetStatusToReady` | Setur stöðu vinnsluraðafærslu færslunnar á _Tilbúin_. |

## Tengdar API-síður {#related-api-pages}

Bifröst stjórnandi birtir þessar API-síður í sama API-hópi. Hjálparsíður þeirra segja hvaða reitum má
breyta og hvaða bundnar aðgerðir þær bjóða:

| API-síða | Safn | Hjálp |
| --- | --- | --- |
| **Vinnsluraðafærslur API** | `queueEntries` | [Vinnsluraðafærslur API](/help/orchestrator/entries-api/) |
| **Kladdafærslur vinnsluraða API** | `queueLogEntries` | [Kladdafærslur vinnsluraða API](/help/orchestrator/log-entry-api/) |
| **Staða vinnsluraðara** | `status` | [Staða vinnsluraðara](/help/orchestrator/scheduler-status-api/) |
| **Flokkar vinnsluraða** | `queueCategories` | [Flokkar vinnsluraða](/help/orchestrator/categories-api/) |
