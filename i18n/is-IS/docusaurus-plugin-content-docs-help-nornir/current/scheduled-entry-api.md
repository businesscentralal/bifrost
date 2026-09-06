---
id: scheduled-entry-api
title: "API vinnsluraðara"
sidebar_label: "API vinnsluraðara"
sidebar_position: 14
---

Bifröst Nornir birtir fáeinar API-síður undir útgefandanum `origo`, API-hópnum `jobQueueOrchestrator` og útgáfu `v1.0`. Þær eru notuðar af ytri samhæfingum og eru ekki opnaðar af notendum.

## Endapunktar

| API-síða | Endapunktur | Lýsing |
| --- | --- | --- |
| **Vinnsluraðarafærslur API** | `/api/origo/jobQueueOrchestrator/v1.0/scheduledEntries` | Les og skrifar vinnsluraðarafærslur: hlut til keyrslu, áætlun, tilkynningastillingar og lokaða stöðu. Bundnar aðgerðir geta enduráætlað, endurræst eða sett tengda vinnsluraðafærslu í stöðuna Tilbúið. |
| **Vinnsluraðafærslur API** | `/api/origo/jobQueueOrchestrator/v1.0/queueEntries` | Óbreytanleg sýn á staðlaðar vinnsluraðafærslur, þar á meðal stöðu, áætlun og síðustu villuboð. |
| **Kladdafærslur vinnsluraða API** | `/api/origo/jobQueueOrchestrator/v1.0/queueLogEntries` | Óbreytanleg sýn á kladdafærslur vinnsluraða, til að kanna niðurstöður fyrri keyrslna. |
| **Staða vinnsluraðara** | `/api/origo/jobQueueOrchestrator/v1.0/status` | Óbreytanleg staða vinnsluraðarans sjálfs, fyrir ytra eftirlit. |
| **Flokkar vinnsluraða** | `/api/origo/jobQueueOrchestrator/v1.0/queueCategories` | Óbreytanlegur listi yfir flokka vinnsluraða í fyrirtækinu. |

## Bundnar aðgerðir

Endapunktur vinnsluraðarafærslna býður upp á fjórar bundnar aðgerðir. Á þeim öllum þarf færslan að vera ólokuð.

| Aðgerð | Lýsing |
| --- | --- |
| **ScheduleJobQueueEntryUpdate** | Eyðir tengdu vinnsluraðafærslunni og skilar uppfærðri vinnsluraðarafærslu. Vinnsluraðarinn endurskapar verkið í næstu yfirferð. |
| **UpdateJobQueueEntry** | Eyðir tengdu vinnsluraðafærslunni og tímasetur strax nýja út frá núverandi skilgreiningu. |
| **RestartJobQueueEntry** | Endurræsir tengdu vinnsluraðafærsluna. |
| **SetStatusToReady** | Setur stöðu tengdrar vinnsluraðafærslu í Tilbúið. |
