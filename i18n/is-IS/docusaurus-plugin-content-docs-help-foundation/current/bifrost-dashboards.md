---
id: bifrost-dashboards
title: "Mælaborð Bifröst"
---

**Mælaborð Bifröst** sýnir mælaborðin sem eru vistuð í Bifröst. Mælaborð er síða með myndritum og töflum sem er fyllt með lifandi gögnum úr Business Central. Opnaðu mælaborð til að sjá það í skoðaranum, uppfæra gögnin, eða sýna það á öllum skjánum. Mælaborð eru búin til og þeim breytt utan þessarar síðu; hér opnarðu þau, uppfærir og fjarlægir.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Kóði** | Kóðinn sem auðkennir mælaborðið. |
| **Heiti** | Heiti mælaborðsins. |
| **Lýsing** | Hvað mælaborðið sýnir. |
| **Virkt** | Hvort hægt er að uppfæra gögn mælaborðsins. |
| **Útgáfa** | Hversu oft mælaborðið hefur verið skrifað. |
| **Lágmarkstími milli uppfærslna (sek.)** | Stysti tími milli tveggja uppfærslna. Uppfærsla innan þess tíma skilar vistuðu gögnunum. |
| **Uppfæra sjálfkrafa við opnun** | Hvort mælaborðið uppfærir gögnin sín þegar það er opnað. |
| **Síðast uppfært** | Hvenær gögnin voru síðast uppfærð. |
| **Staða síðustu uppfærslu** | Niðurstaða síðustu uppfærslu. |
| **Hlaðið upp** | Hvenær mælaborðið var síðast skrifað. |
| **Hlaðið upp af** | Notandinn sem skrifaði mælaborðið síðast. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Opna mælaborð** | Sýnir valið mælaborð í skoðaranum. |
| **Uppfæra** | Uppfærir gögn valins mælaborðs með þínum eigin heimildum. |
| **Fjarlægja mælaborð** | Fjarlægir valið mælaborð og gagnagjafa þess. Krefst heimildasamstæðunnar `BIFROST Dash ori`. |
| **Gagnagjafar** | Sýnir gagnagjafana sem fylla valið mælaborð. Sjá [Gagnagjafar mælaborðs](/help/foundation/bifrost-dashboard-data-sources/). |

## Skoðari mælaborðs {#the-dashboard-viewer}

**Opna mælaborð** sýnir mælaborðið með hópnum **Nánar** sem endurtekur lýsinguna, tíma síðustu uppfærslu og stöðu hennar. Tækjastika skoðarans býður meira:

| Aðgerð | Lýsing |
| --- | --- |
| **Uppfæra** | Uppfærir gögnin með þínum eigin heimildum. |
| **Allur skjárinn** | Sýnir mælaborðið á allri síðunni. Sama tækjastika er þar. |
| **Gagnagjafar** | Sýnir gagnagjafana sem fylla þetta mælaborð. |
| **Í beinni** | Uppfærir gögnin með reglulegu millibili. Bilið er aldrei styttra en lágmarkstími mælaborðsins og aldrei undir 30 sekúndum. |
| **Afrita graf** | Afritar fyrsta myndritið sem mynd. Ef ekkert myndrit er til er fyrsta taflan afrituð sem texti. |

Til að skoða mælaborð þarf aðeins heimildasamstæðuna `BIFROST Read ori`. Mælaborð sýnir þau gögn sem þú mátt sjá.

## Spjallsvæði {#chat-panel}

Þegar þú hefur aðgang að spjalli Bifröst birtist spjallsvæðið til hliðar við listann. Spjallið veit hvaða mælaborð er valið, svo þú getur spurt beint um það, til dæmis hvað tiltekin tala þýðir eða hvaða gagnagjafi fyllir myndrit. Svæðið birtist aðeins ef þú hefur heimildasamstæðuna `BIFROST Chat ori` og spjallveita hefur verið sett upp, sama regla og á öðrum síðum Bifröst. Sjá [Spjall Bifröst í Business Central](/language-models/chat/).

## Algeng verkefni {#common-tasks}

- **Sjá mælaborð:** veldu það og veldu **Opna mælaborð**.
- **Uppfæra tölurnar:** veldu **Uppfæra**. Ef lágmarkstíminn er ekki liðinn færðu vistuðu gögnin.
- **Kanna hvaðan tölurnar koma:** veldu **Gagnagjafar**.
