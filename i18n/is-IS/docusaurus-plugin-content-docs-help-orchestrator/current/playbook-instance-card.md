---
id: playbook-instance-card
title: "Upplýsingar um keðjukeyrslu"
sidebar_label: "Upplýsingar um keðjukeyrslu"
sidebar_position: 7
---

**Upplýsingar um keðjukeyrslu** sýnir eina keyrslu keðju í heild: hvenær hún keyrði, hve mörg skref og
hluti hún vann, villu ef einhver var, og skrá yfir hvert skref. Notaðu spjaldið til að finna út hvers
vegna keyrsla mistókst eða hvað skref sendi og fékk. Spjaldinu er ekki hægt að breyta. Opnaðu það úr
[Keyrsluskrá keðju](/help/orchestrator/playbook-instances/).

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Kóði keðju** | Keðjan sem keyrði. |
| **Staða** | Staða keyrslunnar: _Í keyrslu_, _Lokið_, _Mistókst_ eða _Hætt við_. |
| **Byrjaði** | Hvenær keyrslan hófst. |
| **Lauk** | Hvenær keyrslunni lauk. |
| **Heildartími** | Hve langan tíma keyrslan tók. |

## Teljarar {#counters}

| Reitur | Lýsing |
| --- | --- |
| **Skref keyrð** | Fjöldi skrefa sem keyrðu. |
| **Skref mistókst** | Fjöldi skrefa sem mistókust. |
| **Hlutir unnir** | Fjöldi hluta sem skref unnu þegar þau endurtóku sig yfir fylki. |

## Villa {#error}

Flokkurinn **Villa** birtist aðeins þegar keyrslunni lauk með villu. **Villuboð** geymir villuboðin.

## Atburðaskrá skrefa {#step-log}

Hlutinn **Atburðaskrá skrefa** sýnir hvert skref sem keyrslan keyrði, með einni línu fyrir hvern hlut
þegar skref endurtekur sig yfir fylki. Sjá [Atburðaskrá skrefa](/help/orchestrator/playbook-step-logs/).

## Valið skref {#selected-step}

Upplýsingareiturinn **Valið skref** sýnir línuna sem er valin í **Atburðaskrá skrefa**: beiðnina sem
skrefið sendi, svarið sem það fékk og tímasetningu þess. Sjá
[Valið skref](/help/orchestrator/playbook-step-log-detail-fact-box/).
