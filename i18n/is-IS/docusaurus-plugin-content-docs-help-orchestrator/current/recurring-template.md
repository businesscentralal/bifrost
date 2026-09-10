---
id: recurring-template
title: "Endurtekningarsniðmát vinnsluraða"
sidebar_label: "Endurtekningarsniðmát vinnsluraða"
sidebar_position: 10
---

**Endurtekningarsniðmát vinnsluraða** lýsir einni endurnýtanlegri áætlun. Þegar [vinnsluraðarafærsla](/help/orchestrator/scheduled-entry-card/) eða [tímasett keðja](/help/orchestrator/schedule-playbook/) vísar í sniðmát fylgir færslan sniðmátinu í stað eigin endurtekningarreita.

Áætlunin er sannreynd þegar spjaldinu er lokað, svo ófullgert mynstur vistast ekki.

## Almennt

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði sniðmátsins. |
| **Lýsing** | Lýsing sem útskýrir hvenær mynstrið á við, til dæmis _Alla virka daga að nóttu_. |
| **Tímabelti** | Tímabeltið sem áætlunin miðast við. Notaðu aðstoðarhnappinn til að velja það; ný sniðmát taka mið af tímabelti þínu í notandastillingum. |

## Áætlun

| Reitur | Lýsing |
| --- | --- |
| **Keyra á mánudegi … Keyra á sunnudegi** | Vikudagarnir sem færslur með þessu sniðmáti keyra á. |
| **Upphafstími** | Fyrsti tími dagsins sem keyrsla má hefjast. |
| **Lokatími** | Síðasti tími dagsins sem keyrsla má hefjast. |

## Endurtekning

| Reitur | Lýsing |
| --- | --- |
| **Fjöldi mínútna milli keyrslu** | Lágmarksfjöldi mínútna milli tveggja keyrslna innan tímagluggans. |
| **Dagsetningarformúla næstu keyrslu** | Formúla sem reiknar næsta keyrsludag, til dæmis `1D` eða `1M`. |
