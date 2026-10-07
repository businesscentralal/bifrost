---
id: language-models-setup
title: "Uppsetning Bifröst mállíkana"
---

**Uppsetning Bifröst mállíkana** er uppsetningarsíða Bifröst mállíkana. Hún er opnuð úr flokknum
**Forrit** á **Uppsetning Bifröst**. Hún sýnir í einu vetfangi hvort þrennt sem spjallið þarf sé til
staðar: mállíkön, verkfærin sem aðstoðarmaðurinn getur kallað á og API-lyklarnir.

Síðan sýnir aðeins stöðu. Hverju gildi er viðhaldið á síðunni sem hún vísar á.

## Mállíkön {#language-models}

Mállíkan tengir spjallið við veitu (Copilot, OpenAI, Azure OpenAI, sérsniðið LLM, Anthropic, xAI eða
Google Gemini) og ber hæfnina: leiðbeiningarnar sem eru sendar með hverju spjalli.

| Reitur | Lýsing |
| --- | --- |
| **Mállíkön** | Hversu mörg mállíkön eru sett upp í þessu fyrirtæki. Veldu töluna til að opna [lista yfir mállíkön](/help/language-models/bifrost-lang-model-list/). |
| **Sjálfgefið mállíkan** | Líkanið sem sjálfvirkt ferli notar þegar það biður um svar án þess að nefna líkan og sá sem keyrir það hefur ekkert líkan í notandauppsetningu Bifröst. Sýnir `(ekkert)` þegar ekkert líkan er sjálfgefið. Spjallið notar það ekki: hver og einn spjallar við líkanið í sinni eigin notandauppsetningu. |

## MCP verkfæraþjónn {#mcp-tool-server}

Spjallið býður mállíkaninu aðgerðir Bifröst sem verkfæri (Model Context Protocol), svo líkanið geti lesið
og breytt gögnum í Business Central fyrir þig, með þínum eigin heimildum.

| Reitur | Lýsing |
| --- | --- |
| **Tiltæk verkfæri** | Hversu mörg verkfæri spjallið getur kallað á í þessu fyrirtæki. |

## API-lyklar {#api-keys}

Allir API-lyklar veitna eru geymdir í leyndarmálageymslu Bifröst, ekki á síðum þessa forrits. Hvert
mállíkan hefur sameiginlegan lykil fyrir allt fyrirtækið og persónulegan lykil fyrir hvern notanda.

| Reitur | Lýsing |
| --- | --- |
| **Mállíkön án lykils** | Hversu mörg mállíkön þurfa API-lykil en hafa hvorki sameiginlegan lykil né persónulegan lykil þinn. Veldu töluna til að opna listann yfir mállíkön. Sýnt með rauðu meðan talan er hærri en núll. |
| **Athugasemd** | Sýnd aðeins meðan lykla vantar: ekki er hægt að flytja lykla frá annarri viðbót, svo hver lykill er skráður einu sinni á mállíkaninu. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Mállíkön** | Opnar [lista yfir mállíkön](/help/language-models/bifrost-lang-model-list/). |
| **API-lyklar** | Opnar [Leyndarmál forrita Bifröst](/help/foundation/bifrost-app-secrets/), síað á Bifröst mállíkön: alla lykla allra mállíkana og hvort gildi hafi verið skráð. Gildið sjálft er aldrei sýnt. |
| **Uppsetningarleiðsögn** | Opnar [uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/), sem leyfir öllum Bifröst-forritum að ná út á netið og fer yfir auðkenni hvers forrits. |

## Samband við veiturnar {#reaching-the-providers}

OpenAI, Azure OpenAI, sérsniðið LLM, Anthropic, xAI og Google Gemini eru sótt um netið, svo forritið
verður að mega senda HTTP-beiðnir. Copilot þarf þess ekki. Uppsetningarleiðsögn Bifröst leyfir það
fyrir öll uppsett Bifröst-forrit í einu. Þangað til sýnir **Uppsetning Bifröst** tilkynningu með
aðgerðinni **Hefja uppsetningarleiðsögn**, og spjall við einhverja þessara veitna mistekst með boðum um
að HTTP-beiðnir séu ekki leyfðar fyrir viðbótina.

## Fyrstu skref {#getting-started}

1. Á **Uppsetning Bifröst** skaltu velja **Uppsetningarleiðsögn** ef hún hefur ekki verið keyrð síðan
   forritið var sett upp.
2. Opnaðu **Uppsetning Bifröst mállíkana** og veldu **Mállíkön**. Búðu til mállíkan með spjallveitanda
   og hæfni, eða veldu **Frumstilla Copilot sjálfgildi** til að fá tilbúið Copilot-líkan.
3. Skráðu sameiginlega API-lykilinn á spjaldi líkansins, eða láttu hvern notanda skrá persónulegan lykil.
4. Gefðu hverjum sem má spjalla heimildasamstæðurnar `BIFROST Chat ori` og `BIFROST LLM Rd ori`, og
   `BIFROST LLM Chat ori` fyrir aðra veitu en Copilot.
5. Veldu **Kóða mállíkans** sem hver og einn spjallar við í
   [notandauppsetningu Bifröst](/help/foundation/bifrost-user-setup-editor/) viðkomandi.
6. Opnaðu viðskiptamann, vöru eða söluskjal og spurðu spurningar í **Spjalla með Bifröst**.
