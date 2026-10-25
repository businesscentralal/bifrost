---
id: bank-tracking-log
title: "Ferilskrá bankaaðgerða"
---

**Ferilskrá bankaaðgerða** sýnir hverja aðgerð sem Bifröst framkvæmdi í banka á greiðslu, erlendri
greiðslu eða kröfu, með stöðunni eftir hana. Hún er fyrir fjármálasviðið og kerfisstjórann sem vilja vita
hvað varð um bunka eða kröfu, og hvenær.

Opnaðu hana með aðgerðinni **Ferilskrá bankaaðgerða** í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/).
Skráin er aðeins til lestrar og Bifröst skrifar hana. Kall sem bankinn hafnaði er ekki í henni; það er á
síðunni **Annáll beiðna Bifröst**.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Skráð** | Hvenær aðgerðin keyrði. |
| **Banki** | Bankinn eða innheimtufyrirtækið. |
| **Svið** | **Greiðsla**, **Erlend greiðsla** eða **Krafa**. |
| **Aðgerð** | Hvað var gert, til dæmis **Skrá**, **Niðurstaða**, **Stofna**, **Breyta**, **Fella niður**, **Sækja greiðslur**, **Endurvekja** eða **Pörun við yfirlit**. |
| **Staða greiðslubunka** | Staða greiðslubunkans eftir aðgerðina. Auð fyrir kröfur. |
| **Staða kröfu** | Staða kröfunnar eftir aðgerðina. Auð fyrir greiðslur og fyrir aðgerðir sem varða ekki eina kröfu. |
| **Ekki rakið** | Aðgerðin varðaði bunka eða kröfu sem Bifröst rekur ekki, til dæmis bunka sem var stofnaður í netbankanum. |
| **Tilvísun banka** | Auðkenni bankans fyrir bunkann, kröfuna eða aðgerðina. |
| **Nánar** | Stutt lýsing á niðurstöðunni. |
| **Skeytagerð** | Aðgerðin sem gerði þetta. |
| **Notandi** | Hver kallaði á hana. |
| **Færsla í beiðnaskrá** | Kallið á síðunni **Annáll beiðna Bifröst**. |

## Algeng verk {#common-tasks}

**Fylgja einum bunka eða kröfu.** Síaðu **Tilvísun banka** á auðkenni hans eða hennar í bankanum.

**Sjá hvað var greitt í dag.** Síaðu **Aðgerð** á **Pörun við yfirlit** og **Skráð** á daginn í dag.

## Gott að vita {#good-to-know}

- Núverandi staða hvers bunka og kröfu er á síðunum [Greiðslubunkar í banka](/help/iceland-treasury/bank-payment-batches/)
  og [Kröfur í banka](/help/iceland-treasury/bank-claims/); skráin geymir söguna.
- Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn **Spjalla
  með Bifröst** til hægri spurningum um valda færslu.
