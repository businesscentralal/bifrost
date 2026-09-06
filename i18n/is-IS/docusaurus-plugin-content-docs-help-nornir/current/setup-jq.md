---
id: setup-jq
title: "Bifröst uppsetning – Nornir"
sidebar_label: "Bifröst uppsetning – Nornir"
sidebar_position: 18
---

Bifröst Nornir bætir aðgerðahópnum **Stjórnandi** við síðuna Bifröst uppsetning, svo allt sem þessi viðbót stillir sé aðgengilegt á sama stað og önnur uppsetning Bifröst.

Síðan sýnir einnig tilkynningu þegar viðbótin er ekki tilbúin til keyrslu, með aðgerðinni **Keyra uppsetningarleiðsögn** sem opnar [aðstoðuðu uppsetninguna](/help/nornir/scheduler-setup-wizard/).

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Uppsetning vinnsluraðara** | Opnar [Uppsetningu vinnsluraðara](/help/nornir/scheduler-setup/) til að stilla tímasetningu, eftirlit og endurræsingarstefnur. |
| **Bifröst keðjur** | Opnar [Bifröst keðjur](/help/nornir/playbooks/) til að skoða og stilla keðjur skilaþoða. |
| **Auðkenni biðlara** | Opnar [Auðkenni biðlara](/help/nornir/credentials-list/) til að stjórna auðkenningu gagnvart ytri þjónustum. |
| **Keyrsluskrá keðju** | Opnar [Keyrsluskrá keðju](/help/nornir/playbook-instances/) yfir keyrslur keðja. |

## Uppsetningartilkynning

Þegar Bifröst uppsetning er opnuð athugar viðbótin tvennt og sýnir tilkynningu ef annað hvort vantar:

| Aðstæður | Skilaboð |
| --- | --- |
| **HTTP lokað og röðin ekki í gangi** | HTTP-biðlarabeiðnir eru lokaðar og vinnsluröð stjórnanda er ekki í gangi. |
| **Aðeins HTTP lokað** | HTTP-biðlarabeiðnir eru ekki virkar fyrir þessa viðbót. |
| **Aðeins röðin ekki í gangi** | Vinnsluröð stjórnanda er ekki í gangi. |

Hver tilkynning ber aðgerðina **Keyra uppsetningarleiðsögn** sem opnar leiðsögnina á því skrefi sem leysir vandann.
