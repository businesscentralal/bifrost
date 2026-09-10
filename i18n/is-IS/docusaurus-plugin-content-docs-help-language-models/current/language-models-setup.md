---
id: language-models-setup
title: "Uppsetning Bifröst Language Models"
sidebar_label: "Uppsetning Language Models"
sidebar_position: 5
---

**Uppsetning Bifröst Language Models** er eina uppsetningarsíða spjalleiningarinnar. Hún er opnuð úr flokknum **Forrit** á **Uppsetningarsíðu** Bifrastar og sýnir í einu vetfangi hvort þrennt sem Bragi þarf sé til staðar: mállíkön, MCP verkfæraþjónninn og API-lyklar veitenda.

Síðan er aðeins til lestrar — hvert gildi á henni er viðhaldið á síðu sem hún tengir í.

## Mállíkön

Mállíkan tengir Spjalla við Bifröst við veitanda — Copilot, OpenAI, Azure OpenAI, sérsniðið LLM, Anthropic, xAI eða Google Gemini — og ber hæfniefnið sem er sett inn í hvert spjall.

| Reitur | Lýsing |
| --- | --- |
| **Mállíkön** | Hversu mörg mállíkön eru sett upp í þessu fyrirtæki. Kafið niður til að opna [lista yfir mállíkön](/help/language-models/bifrost-lang-model-list/). |
| **Sjálfgefið mállíkan** | Líkanið sem allir nota sem hafa ekkert líkan í notandauppsetningu Bifrastar. Sýnir `(ekkert)` þegar ekkert líkan er merkt sjálfgefið. |

## MCP verkfæraþjónn

Spjalla við Bifröst birtir mállíkaninu skilaboðategundir Bifrastar sem Model Context Protocol verkfæri, svo líkanið geti lesið og skrifað gögn í Business Central fyrir hönd notandans, með hans eigin heimildum.

| Reitur | Lýsing |
| --- | --- |
| **Tiltæk verkfæri** | Hversu mörg Model Context Protocol verkfæri spjallið getur kallað á í þessu fyrirtæki. |

## API-lyklar

Bragi geymir alla API-lykla veitenda í leyndarmálageymslu Bifrastar í stað eigin taflna. Hvert mállíkan hefur **sameiginlegan** lykil fyrir allt fyrirtækið og **persónulegan** lykil fyrir hvern notanda.

| Reitur | Lýsing |
| --- | --- |
| **Mállíkön án lykils** | Hversu mörg mállíkön þurfa API-lykil en hafa hvorki sameiginlegan lykil né persónulegan lykil geymdan fyrir þig. Kafið niður til að opna listann yfir mállíkön. Sýnt með rauðu meðan talan er hærri en núll. |
| **Athugasemd** | Birtist aðeins meðan lykla vantar og útskýrir að skrá þurfi gildin einu sinni. |

| Kóði leyndarmáls | Umfang | Notað fyrir |
| --- | --- | --- |
| `LANGMODEL-<Kóði>-API-KEY` | Fyrirtæki | Sameiginlegur lykill veitanda fyrir eitt mállíkan, notaður af öllum notendum sem hafa engan persónulegan lykil. |
| `LANGMODEL-<Kóði>-USER-API-KEY` | Fyrirtæki og notandi | Persónulegur lykill eins notanda fyrir það mállíkan. |

Business Central heldur geymdum leyndarmálum aðskildum eftir viðbótum, svo lyklar sem voru skráðir í eldri útgáfu forritsins flytjast ekki með. Opnið mállíkan og notið **Skrá persónulegan API-lykil** eða **Skrá sameiginlegan API-lykil** á [spjaldi mállíkans](/help/language-models/bifrost-lang-model-card/) til að slá hvern lykil inn einu sinni. Til að skrá eða hreinsa sameiginlega lykilinn þarf heimildasettið `BIFROST ChatSvc ori`.

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Mállíkön** | Opnar [lista yfir mállíkön](/help/language-models/bifrost-lang-model-list/). |
| **API-lyklar** | Opnar lista Bifrastar yfir leyndarmál forrita, síaðan á Bifröst Braga, sem sýnir alla lykla einingarinnar og hvort gildi hafi verið skráð. Gildið sjálft er aldrei sýnt. |

## Tilkynning við uppsetningu

Allir ytri veitendur eru sóttir um HTTP. Þegar **Leyfa HttpClient-beiðnir** er ekki virkt fyrir viðbótina birtir síðan tilkynningu með aðgerðinni **Opna stillingar viðbótar**. Copilot verður ekki fyrir áhrifum; tilkynningin á við OpenAI, Azure OpenAI, sérsniðið LLM, Anthropic, xAI og Google Gemini.

## Fyrstu skref

1.  Úthlutið heimildasettinu `BIFROST Chat ori` á hvern notanda sem má nota spjallið.
2.  Opnið **Uppsetningu Bifrastar**, veljið **Uppsetning Bifröst Language Models** í flokknum **Forrit** og hreinsið HTTP-tilkynninguna ef hún birtist.
3.  Veljið **Mállíkön** og búið til líkan með spjallveitanda og hæfni.
4.  Skráið sameiginlega eða persónulega API-lykilinn á spjaldi líkansins.
5.  Merkið eitt mállíkan sem **Sjálfgefið**, eða úthlutið líkani á hvern notanda í notandauppsetningu Bifrastar.
6.  Opnið viðskiptavin, vöru eða sölupöntun og spyrjið aðstoðarmanninn spurningar í **Spjalla við Bifröst** upplýsingareitnum.
