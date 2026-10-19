---
id: recurring-template
title: "Endurtekningarsniðmát vinnsluraða"
sidebar_label: "Endurtekningarsniðmát vinnsluraða"
sidebar_position: 10
---

**Endurtekningarsniðmát vinnsluraða** lýsir einni endurnýtanlegri áætlun: vikudögum, tímaglugga, bili
milli keyrslna og tímabelti. Þegar [vinnsluraðarfærsla](/help/orchestrator/scheduled-entry-card/) eða
[tímasett keðja](/help/orchestrator/schedule-playbook/) notar sniðmát fylgir hún sniðmátinu í stað eigin
endurtekningarreita.

Opnaðu spjaldið af listanum [Endurtekningarsniðmát vinnsluraða](/help/orchestrator/recurring-templates/).
Áætlunin er yfirfarin þegar þú lokar spjaldinu, svo ekki er hægt að vista ófullgerða áætlun.

## Almennt {#general}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Einstæður kóði sniðmátsins. |
| **Lýsing** | Hvenær áætlunin á við, til dæmis _Virka daga að nóttu_. |
| **Tímabelti** | Tímabeltið sem áætlunin miðast við. Notaðu aðstoðarhnappinn til að velja það. Nýtt sniðmát byrjar með tímabeltinu úr þínum eigin stillingum. |

## Áætlun {#schedule}

| Reitur | Lýsing |
| --- | --- |
| **Keyra á mánudagum** … **Keyra á sunnudagum** | Vikudagarnir sem færslur sem nota sniðmátið keyra á. |
| **Upphafstími** | Fyrsti tími dagsins sem keyrsla má hefjast. |
| **Lokatími** | Síðasti tími dagsins sem keyrsla má hefjast. |

## Endurtekning {#recurrence}

| Reitur | Lýsing |
| --- | --- |
| **Fjöldi mínúta milli keyrslu** | Lágmarksfjöldi mínútna milli tveggja keyrslna innan tímagluggans. |
| **Formúla næsta keyrsludags** | Dagsetningarformúla fyrir næsta keyrsludag, til dæmis `1D` eða `1M`. |
