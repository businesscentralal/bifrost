---
id: bank-claim-batches
title: "Kröfubunkar í banka"
---

**Kröfubunkar í banka** sýnir hvern kröfubunka sem Bifröst sendi til banka til að stofna, breyta eða fella
niður kröfur, með stöðunni sem bankinn gaf síðast upp. Síðan er fyrir bókarann sem fylgir eftir kröfum
sem eru sendar í bunkum.

Hjá Arion banka, Íslandsbanka og Kviku banka eru kröfur stofnaðar, þeim breytt og þær felldar niður í bunkum. Bankinn
tekur fyrst við bunkanum og tilkynnir svo niðurstöðu hverrar kröfu þegar niðurstaða bunkans er lesin.

Opnaðu hana með aðgerðinni **Kröfubunkar í banka** í
[Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/). Síðan er aðeins til
lestrar og Bifröst skrifar hana.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Banki** | Bankinn sem bunkinn var sendur til. |
| **Aðgerð** | **Stofna**, **Breyta** eða **Fella niður**. |
| **Aðgerðarauðkenni** | Auðkenni bunkans í bankanum, notað til að lesa niðurstöðu hans. |
| **Staða pakka** | **Í vinnslu**, **Lokið**, **Lokið með villum**, **Ekki staðfest**, **Hætt við** eða **Í bið**. |
| **Fjöldi krafna** | Hversu margar kröfur eru í bunkanum. |
| **Sent**, **Lokið** | Hvenær bunkinn var sendur, og hvenær bankinn lauk honum. |
| **Síðast kannað**, **Fjöldi kannana** | Hvenær og hversu oft Bifröst las niðurstöðu bunkans. |
| **Villuskilaboð** | Hvers vegna bankinn hafnaði bunkanum. |
| **Annálsfærslunúmer (sending)**, **Annálsfærslunúmer (niðurstaða)** | Köllin á síðunni **Annáll beiðna Bifröst** sem sendu bunkann og lásu niðurstöðu hans. |
| **Færslunúmer** | Númer bunkans í rakningu Bifrastar. |

## Gott að vita {#good-to-know}

- **Lokið með villum** þýðir að sumum kröfum var hafnað. **Villuskilaboð** þeirra eru á síðunni
  [Kröfur í banka](/help/iceland-treasury/bank-claims/).
- Þegar forritið [Bifröst mállíkön](/language-models/) er sett upp svarar upplýsingareiturinn **Spjalla
  með Bifröst** til hægri spurningum um valinn bunka.
