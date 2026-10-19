---
id: scheduled-entry-subform
title: "Vinnsluraðarfærslur"
sidebar_label: "Vinnsluraðarfærslur"
sidebar_position: 18
---

Hlutinn **Vinnsluraðarfærslur** sýnir öll verk sem Bifröst stjórnandi hefur eftirlit með í þessu fyrirtæki: hvað þau keyra, hvenær þau keyra og hverjum er tilkynnt um niðurstöðuna. Hann birtist á síðunni [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/). Notaðu hann til að fá yfirsýn yfir verkin og til að keyra, endurstilla eða skoða eitt þeirra.

Listinn er óbreytanlegur. Opnaðu línu til að breyta verkinu á [spjaldi vinnsluraðarafærslu](/help/orchestrator/scheduled-entry-card/).

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Gerð hluts til keyrslu** | Hvort verkið keyrir skýrslu eða kóðaeiningu. |
| **Auðkenni hluts til keyrslu** | Auðkenni skýrslunnar eða kóðaeiningarinnar sem verkið keyrir. |
| **Heiti hluts til keyrslu** | Heiti þeirrar skýrslu eða kóðaeiningar. |
| **Lýsing** | Lýsing verksins. |
| **Fyrsti tími til keyrslu** | Fyrsta dagsetning og tími sem verkið má keyra. |
| **Kóði endurtekningarsniðmáts** | [Endurtekningarsniðmátið](/help/orchestrator/recurring-template/) sem ræður áætluninni, ef það er notað. |
| **Tímabelti** | Tímabeltið sem áætlunin miðast við. |
| **Fjöldi mínúta milli keyrslu** | Hversu oft verkið keyrir yfir daginn. Autt þýðir að verkið er ekki endurtekið innan dagsins. |
| **Flokkunarkóði vinnsluraða** | Vinnsluraðaflokkurinn sem verkið tilheyrir. |
| **Notendaauðkenni** | Notandinn sem á vinnsluraðafærsluna. Hann verður að hafa heimild til að keyra vinnsluraðafærslur; sé reiturinn auður er núverandi notandi notaður. Aðeins sýnt í staðbundinni uppsetningu. |
| **Lokað** | Stjórnandinn tímasetur ekki lokað verk. |
| **Gerð tilkynningar** | Hvernig niðurstaðan er tilkynnt: _Engin_, _Tölvupóstur_ eða _Telegram_. |
| **Viðtakandi tilkynningar** | Hver fær tilkynninguna. |
| **Senda fjarmælingar** | Sendir fjarmælingar fyrir hverja keyrslu verksins. |
| **Kóði biðlaraauðkenningar** | [Auðkenni biðlara](/help/orchestrator/credentials-list/) sem verkið notar til að tengjast ytri þjónustu. |
| **Tímasett** | Sýnir hvort verkið hafi vinnsluraðafærslu núna. |
| **Keyra á mánudögum** … **Keyra á sunnudögum** | Vikudagarnir sem verkið keyrir. |
| **Upphafstími** / **Lokatími** | Fyrsti og síðasti tími dagsins sem verkið keyrir. |
| **Formúla næsta keyrsludags** | Dagsetningarformúla fyrir næsta keyrsludag, fyrir verk sem keyra sjaldnar en daglega. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Keyra einu sinni (forgrunni)** | Keyrir, eftir staðfestingu, afrit af verkinu einu sinni strax á meðan þú bíður og segir hvort það tókst. Áætluninni er ekki breytt. |
| **Endurstilla** | Fjarlægir núverandi vinnsluraðafærslu verksins. Stjórnandinn býr til nýja út frá skilgreiningu verksins í næstu yfirferð. Ekki í boði fyrir lokað verk. |
| **Tímasetja núna** | Skiptir vinnsluraðafærslu verksins út fyrir nýja sem er tímasett til keyrslu strax. Ekki í boði fyrir lokað verk. |
| **Aðgerðakladdi** | Sýnir virknina sem skráð hefur verið fyrir verkið. |
| **Vinnsluraðafærsla** | Opnar staðlaða spjald vinnsluraðafærslu verksins. Í boði þegar verkið hefur vinnsluraðafærslu. |
| **Færa niður** | Opnar færsluna sem verkið var búið til fyrir, þegar slík færsla er tengd því. |

## Algeng verk {#common-tasks}

- **Breyta áætlun:** opnaðu línuna, breyttu áætluninni á spjaldinu og veldu síðan **Endurstilla** eða **Tímasetja núna** svo vinnsluraðafærslan fylgi nýju skilgreiningunni.
- **Prófa verk:** veldu **Keyra einu sinni (forgrunni)** til að sjá niðurstöðuna án þess að bíða eftir áætluninni.
