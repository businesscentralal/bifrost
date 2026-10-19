---
id: categories-api
title: "Flokkar vinnsluraða"
sidebar_label: "Flokkar vinnsluraða"
sidebar_position: 22
---

API-ið **Flokkar vinnsluraða** veitir samþættingum aðgang að vinnsluraðaflokkum fyrirtækisins. Flokkur hópar saman vinnsluraðafærslur og Business Central keyrir aðeins eina færslu hvers flokks í einu. Samþætting notar API-ið til að lesa flokkana, til dæmis til að velja flokk fyrir nýtt verk, og getur líka stofnað þá eða breytt þeim. Það hefur enga síðu í Business Central og notendur opna það ekki.

Það er eitt af [API vinnsluraðara](/help/orchestrator/scheduled-entry-api/) og er birt á `/api/origo/jobQueueOrchestrator/v1.0/queueCategories`.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| `code` | Kóði flokksins, mest 10 stafir. |
| `description` | Lýsing flokksins, mest 30 stafir. |
