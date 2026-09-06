---
id: schedule-playbook
title: "Tímasetja keðju"
sidebar_label: "Tímasetja keðju"
sidebar_position: 13
---

**Tímasetja keðju** er glugginn sem gerir keðju að tímasettu verki. Hann er opnaður með aðgerðinni **Tímasetja** á spjaldinu [Bifröst keðja](/help/nornir/playbook-card/) og býr til [vinnsluraðarafærslu](/help/nornir/scheduled-entry-card/) sem keyrir keðjuna samkvæmt völdu sniðmáti þegar staðfest er.

## Reitir

| Reitur | Lýsing |
| --- | --- |
| **Endurtekningarsniðmát** | [Endurtekningarsniðmátið](/help/nornir/recurring-templates/) sem gefur áætlunina. Skyldureitur – ekki er hægt að staðfesta gluggann án þess. |
| **Gerð tilkynningar** | Hvernig villur eru tilkynntar: _Engin_, _Tölvupóstur_ eða _Telegram_. Við breytingu á gerðinni hreinsast viðtakandinn. |
| **Viðtakandi tilkynningar** | Heimilisfangið sem tilkynningin er send á. Merkt sem skyldureitur þegar valin er önnur tilkynningagerð en Engin. |
| **Flokkunarkóði vinnsluraða** | Valfrjáls flokkur vinnsluraða fyrir færsluna sem búin er til. |
| **Endurprófanarstefna** | Hvernig villur eru endurprófaðar. Glugginn opnast með _Alltaf_ valið. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu færslunnar sem búin er til. |

## Ábendingar

-   Eftir tímasetningu má nota **Vinnsluraðarafærsla** á keðjuspjaldinu til að breyta áætlun, loka verkinu eða keyra það einu sinni í forgrunni.
-   Ef ekkert sniðmát hentar skaltu fyrst búa það til á [Endurtekningarsniðmát vinnsluraða](/help/nornir/recurring-templates/).
