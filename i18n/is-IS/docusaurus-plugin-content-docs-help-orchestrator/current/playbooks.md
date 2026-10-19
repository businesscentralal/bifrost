---
id: playbooks
title: "Bifröst keðjur"
sidebar_label: "Bifröst keðjur"
sidebar_position: 9
---

**Keðja** er fast ferli sem Bifröst stjórnandi keyrir skref fyrir skref. Hvert skref kallar á eina
Bifröst-aðgerð í Business Central, og svar skrefs getur fyllt út beiðni síðara skrefs, verið endurtekið
fyrir hvert stak í fylki eða ráðið hvaða skref keyrir næst. Keðja getur keyrt þegar þú velur **Keyra
núna**, eftir tímaáætlun, eða þegar aðstoðarmaður eða annað kerfi biður um það.

**Bifröst keðjur** sýnir keðjur fyrirtækisins ásamt niðurstöðu síðustu keyrslu þeirra. Listinn er opnaður
af [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/). Veldu **Nýtt**, eða opnaðu
línu, til að vinna á spjaldinu [Bifröst keðja](/help/orchestrator/playbook-card/).

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði keðjunnar. |
| **Lýsing** | Hvað keðjan gerir. |
| **Staða síðustu keyrslu** | Staða síðustu keyrslu. |
| **Síðast keyrt** | Hvenær keðjan keyrði síðast. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Keyrsluskrá** | Opnar [Keyrsluskrá keðju](/help/orchestrator/playbook-instances/) síaða á valda keðju. |
