---
id: log-entry-api
title: "Kladdafærslur vinnsluraða API"
sidebar_label: "Kladdafærslur vinnsluraða API"
sidebar_position: 21
---

**Kladdafærslur vinnsluraða API** veitir samþættingum óbreytanlega sýn á kladda vinnsluraða í fyrirtækinu, svo ytra tól geti kannað hvernig fyrri keyrslur enduðu og hvers vegna verk mistókst. Það hefur enga síðu í Business Central og notendur opna það ekki.

Það er eitt af [API vinnsluraðara](/help/orchestrator/scheduled-entry-api/) og er birt á `/api/origo/jobQueueOrchestrator/v1.0/queueLogEntries`.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| `id` | Auðkenni vinnsluraðafærslunnar sem keyrði. Notaðu það til að para kladdafærslur við [Vinnsluraðafærslur API](/help/orchestrator/entries-api/). |
| `entryNo` | Númer kladdafærslunnar. |
| `startDateTime`, `endDateTime` | Hvenær keyrslan hófst og hvenær henni lauk. |
| `userID` | Notandinn sem keyrslan fór fram sem. |
| `status` | Hvernig keyrslan endaði, til dæmis Tókst eða Villa. |
| `errorMessage` | Villan sem keyrslan skilaði, ef einhver. |
| `errorMessageRegisterId` | Auðkenni villuboðaskrár keyrslunnar, þegar Business Central geymdi ítarlegar villur. |
