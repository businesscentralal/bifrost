---
id: schedule-playbook
title: "Tímasetja keðju"
sidebar_label: "Tímasetja keðju"
sidebar_position: 13
---

**Tímasetja keðju** gerir keðju að tímasettu verki. Opnaðu gluggann með **Tímasetja** á spjaldinu
[Bifröst keðja](/help/orchestrator/playbook-card/). Þegar þú velur **Í lagi** stofnar hann
[vinnsluraðarfærslu](/help/orchestrator/scheduled-entry-card/) sem keyrir keðjuna eftir áætlun
sniðmátsins sem þú velur. Færslan er tilbúin til keyrslu; hún er ekki lokuð.

## Áætlun {#schedule}

| Reitur | Lýsing |
| --- | --- |
| **Endurtekningarsniðmát** | [Endurtekningarsniðmátið](/help/orchestrator/recurring-templates/) sem gefur áætlunina. Skyldureitur: ekki er hægt að staðfesta gluggann án þess. |

## Tilkynning {#notification}

| Reitur | Lýsing |
| --- | --- |
| **Gerð tilkynningar** | Hvernig þér er sagt frá verkinu: _Engin_, _Tölvupóstur_ eða _Telegram_. Ef henni er breytt hreinsast **Viðtakandi tilkynningar**. |
| **Viðtakandi tilkynningar** | Netfangið eða Telegram-spjallauðkennið sem tilkynningin fer á. Skyldureitur þegar **Gerð tilkynningar** er ekki _Engin_. |

## Ítarlegt {#advanced}

| Reitur | Lýsing |
| --- | --- |
| **Flokkunarkóði vinnsluraða** | Valfrjáls vinnsluraðaflokkur fyrir færsluna. |
| **Endurprófunarreglur** | Hvernig villur eru endurprófaðar: _Alltaf_, _Þrisvar sinnum_ eða _Aldrei_. Glugginn opnast með _Alltaf_. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu færslunnar. |

## Ábendingar {#tips}

- Keðju er aðeins hægt að tímasetja einu sinni. Til að breyta áætluninni síðar velur þú
  **Vinnsluraðarstjórafærsla** á keðjuspjaldinu; þar getur þú líka lokað verkinu eða keyrt það einu sinni.
- Ef ekkert sniðmát hentar skaltu fyrst stofna það á
  [Endurtekningarsniðmát vinnsluraða](/help/orchestrator/recurring-templates/).
- Þú þarft heimild til að tímasetja keðjur. Notandi sem má aðeins skoða keðjur getur ekki opnað þennan
  glugga.
