---
id: index
title: "Bifröst Orchestrator — Help"
sidebar_label: "Bifröst Orchestrator — Help"
sidebar_position: 1
slug: /
---

**Bifröst Orchestrator** er Business Central viðbót frá Origo sem tekur að sér tímasetta vinnslu. Hún hefur eftirlit með vinnsluraðafærslum – endurskapar þær og endurræsir samkvæmt endurprófanarstefnu og tilkynnir með tölvupósti eða Telegram þegar eitthvað bregst – og hún keyrir _keðjur_: leiðbeinandi runur af Bifröst skilaboðategundum þar sem svar eins skrefs stýrir beiðni þess næsta.

Áætlanir eru skilgreindar einu sinni sem endurtekningarsniðmát og endurnýttar milli verka. Skýrslur má keyra án notanda út frá vistuðum forsendum beiðnisíðu og allur vinnsluraðarinn er aðgengilegur gegnum lítið REST-viðmót fyrir ytra eftirlit.

## Síður

| Síða | Lýsing |
| --- | --- |
| [Uppsetning Bifröst Orchestrator](/help/orchestrator/scheduler-setup-wizard/) | Aðstoðuð uppsetning: virkja útleið HTTP og ræsa stjórnunarvinnsluröð. |
| [Uppsetning Bifröst Orchestrator](/help/orchestrator/orchestrator-setup/) | Uppsetningarsíða forritsins, opnuð úr flokknum Forrit á uppsetningarsíðu Bifrastar: stjórnunarvinnsluröð, fjarmælingar, leyndarmál, tilkynning um viðbúnað og listi vinnsluraðarafærslna. |
| [Spjald vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/) | Eitt verk undir eftirliti: hvað á að keyra, hvenær, endurprófanarstefna og tilkynning. |
| [Endurtekningarsniðmát vinnsluraða](/help/orchestrator/recurring-templates/) | Listi yfir endurnýtanleg áætlunarmynstur. |
| [Endurtekningarsniðmát vinnsluraða](/help/orchestrator/recurring-template/) | Ein endurnýtanleg áætlun: vikudagar, tímagluggi, bil og tímabelti. |
| [Auðkenni biðlara](/help/orchestrator/credentials-list/) | Listi yfir auðkennispör sem notuð eru gagnvart ytri þjónustum. |
| [Spjald auðkenna biðlara](/help/orchestrator/credentials-card/) | Búa til og viðhalda einu pari af auðkenni og leyniorði biðlara. |
| [Bifröst keðjur](/help/orchestrator/playbooks/) | Listi yfir keðjur ásamt niðurstöðu síðustu keyrslu. |
| [Bifröst keðja](/help/orchestrator/playbook-card/) | Skilgreina skref, skilyrði og upphafsbeiðni keðju. |
| [Tímasetja keðju](/help/orchestrator/schedule-playbook/) | Gluggi sem gerir keðju að reglulega tímasettu verki. |
| [Keyrsluskrá keðju](/help/orchestrator/playbook-instances/) | Allar keyrslur keðja, þær nýjustu efst. |
| [Upplýsingar um keðjukeyrslu](/help/orchestrator/playbook-instance-card/) | Ein keyrsla í heild: tímar, teljarar, villa og skrá skrefanna. |
| [Forsendur skýrslu](/help/orchestrator/report-preset-card/) | Vista forsendur beiðnisíðu svo keyra megi skýrslu án notanda. |
| [Vinnsluraðafærslur](/help/orchestrator/job-queue-entries/) | Reiturinn og aðgerðin sem bætast við staðlaðan vinnsluraðalista. |
| [Spjald vinnsluraðafærslu](/help/orchestrator/job-queue-entry-card/) | Reiturinn og aðgerðin sem bætast við staðlað vinnsluraðaspjald. |

## API-síður

Eftirfarandi API-síður eru notuðar af ytri samhæfingum og eru ekki opnaðar beint af notendum:

| API-síða | Lýsing |
| --- | --- |
| [API vinnsluraðara](/help/orchestrator/scheduled-entry-api/) | Les og skrifar vinnsluraðarafærslur, vinnsluraðafærslur, kladdafærslur, stöðu og flokka undir `origo/jobQueueOrchestrator/v1.0`. |

## Fyrstu skref

1.  Keyrðu leiðsögnina **Uppsetning Bifröst Orchestrator** úr aðstoðuðum uppsetningum til að virkja útleið HTTP og ræsa stjórnunarvinnsluröðina.
2.  Opnaðu **Uppsetningu vinnsluraðara** og stilltu flokk vinnsluraða, og Telegram-lykilinn ef þú notar Telegram-tilkynningar.
3.  Settu inn **sýnishorn sniðmáta** eða búðu til þitt eigið áætlunarmynstur.
4.  Bættu þegar skráðri vinnsluraðafærslu við vinnsluraðarann eða skilgreindu nýja færslu á spjaldi vinnsluraðarafærslu.
5.  Búðu til **keðju**, keyrðu hana einu sinni af spjaldinu og tímasettu hana þegar keyrslan lítur vel út.
