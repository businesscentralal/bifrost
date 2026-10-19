---
id: scheduler-setup-wizard
title: "Uppsetning Bifröst stjórnanda"
sidebar_label: "Uppsetningarleiðsögn Bifröst stjórnanda"
sidebar_position: 16
---

Aðstoðaða uppsetningin **Uppsetning Bifröst stjórnanda** gerir Bifröst stjórnanda tilbúinn til að hafa
eftirlit með verkum. Hún er í fjórum skrefum: stutt kynning, að leyfa HTTP-beiðnir fyrir forritið, að ræsa
stjórnunarvinnsluraðafærsluna sem Bifröst stjórnandi byggir á, og staðfesting.

Ræstu hana af listanum **Aðstoðuð uppsetning**. Þegar henni hefur verið lokið opnast hún á síðasta
skrefinu. Ef [Uppsetningarleiðsögn Bifröst](/help/foundation/bifrost-setup-wizard/) hefur þegar leyft
HTTP-beiðnir fyrir Bifröst-forritin sýnir skref 2 þær sem virkar.

## Skref {#steps}

| Skref | Hvað gerist |
| --- | --- |
| **1. Velkomin í Bifröst stjórnanda** | Segir hvað forritið gerir: tímasetur, fylgist með og endurræsir vinnsluraðafærslur, með villumeðhöndlun, og keyrir keðjur af Bifröst-aðgerðum. Stjórnunarvinnsluraðafærsla þarf að vera í gangi til að eftirlit og endurræsingar virki. |
| **2. Virkja HTTP-biðlarabeiðnir** | Bifröst stjórnandi þarf að senda HTTP-beiðnir til að senda tilkynningar og ná í ytri þjónustur. **HTTP-biðlarabeiðnir** sýnir hvort þær séu leyfðar. Þú getur ekki haldið áfram í skref 3 fyrr en þær eru það. |
| **3. Vinnsluraðari** | **Staða vinnsluraðara** sýnir hvort stjórnunarvinnsluraðafærslan sé í gangi. Ræstu hana hér, eða opnaðu uppsetningarsíðuna fyrir allar stillingar. |
| **4. Uppsetningu lokið** | Uppsetningu er lokið. Öllum stillingum má breyta síðar á [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/), sem þú opnar af Uppsetning Bifröst. |

## Aðgerðir {#actions}

| Aðgerð | Lýsing |
| --- | --- |
| **Til baka** / **Áfram** | Færa þig milli skrefa. **Áfram** er ekki í boði í skrefi 2 fyrr en HTTP-beiðnir eru leyfðar. |
| **Virkja HTTP-biðlarabeiðnir** | Leyfir HTTP-beiðnir fyrir Bifröst stjórnanda. Sýnt í skrefi 2 þegar þær eru ekki leyfðar og þú mátt breyta stillingum viðbóta. |
| **Opna stillingar viðbótar** | Opnar **Stillingar viðbótar**, þar sem kerfisstjóri getur leyft HTTP-beiðnir. Sýnt í skrefi 2 í stað aðgerðarinnar hér að ofan þegar þú mátt ekki breyta stillingum viðbóta. |
| **Staðfesta** | Athugar stöðuna aftur, í skrefi 2 og skrefi 3. |
| **Ræsa vinnsluröð** | Stofnar og ræsir stjórnunarvinnsluraðafærsluna. Sýnt í skrefi 3 þegar hún er ekki í gangi. |
| **Opna uppsetningu vinnsluraðara** | Opnar [Uppsetning Bifröst stjórnanda](/help/orchestrator/orchestrator-setup/). |
| **Ljúka** | Merkir aðstoðuðu uppsetninguna sem lokið og lokar henni. |
