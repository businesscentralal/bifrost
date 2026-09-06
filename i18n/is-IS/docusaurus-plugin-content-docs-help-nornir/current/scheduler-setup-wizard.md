---
id: scheduler-setup-wizard
title: "Uppsetning Bifröst Nornir"
sidebar_label: "Uppsetning Bifröst Nornir"
sidebar_position: 16
---

Leiðsögnin **Uppsetning Bifröst Nornir** er aðstoðuð uppsetning fyrir viðbótina. Hún tekur þig í gegnum fjögur skref: stutta kynningu, virkjun á útleið HTTP, ræsingu stjórnunarvinnsluraðar sem vinnsluraðarinn byggir á, og staðfestingu á að uppsetningu sé lokið.

Leiðsögnin er aðgengileg úr lista yfir aðstoðaðar uppsetningar og úr tilkynningunni sem birtist á [Bifröst uppsetningu](/help/nornir/setup-jq/) þegar HTTP er lokað eða stjórnunarvinnsluröðin er ekki í gangi.

## Skref

| Skref | Hvað gerist |
| --- | --- |
| **1\. Velkomin** | Útskýrir hvað viðbótin gerir: sjálfvirka tímasetningu vinnsluraðar, eftirlit, endurræsingu og villumeðhöndlun, auk leiðbeinandi keðjukeyrslu sem keyrir runur af Bifröst skilaboðategundum. Þar kemur einnig fram að stjórnunarvinnsluraðafærsla verður að vera í gangi til að eftirlit og endurræsing virki. |
| **2\. Virkja HTTP-biðlarabeiðnir** | Viðbótin þarf útleið HTTP til að senda tilkynningar og eiga samskipti við ytri þjónustur. Reiturinn **HTTP-biðlarabeiðnir** sýnir _Virkt_ eða _Ekki virkt_. Ekki er hægt að halda áfram í skref 3 fyrr en þetta er virkt. |
| **3\. Vinnsluraðari** | Reiturinn **Staða vinnsluraðara** sýnir hvort stjórnunarvinnsluraðafærslan sé í gangi. Hægt er að ræsa hana hér eða opna uppsetningarsíðuna fyrir ítarlegri stillingar. |
| **4\. Uppsetningu lokið** | Staðfestir að uppsetningu sé lokið. Öllum stillingum má breyta síðar á síðunni [Uppsetning vinnsluraðara](/help/nornir/scheduler-setup/) sem er aðgengileg úr Bifröst uppsetningu. |

## Aðgerðir

| Aðgerð | Lýsing |
| --- | --- |
| **Til baka / Áfram** | Færir þig milli skrefa. **Áfram** er óvirkt í skrefi 2 þar til HTTP-biðlarabeiðnir hafa verið virkjaðar. |
| **Virkja HTTP-biðlarabeiðnir** | Stillir _Leyfa HttpClient-beiðnir_ fyrir þessa viðbót. Birtist í skrefi 2 þegar HTTP er ekki virkt og þú hefur heimild til að breyta stillingum viðbóta. |
| **Opna stillingar viðbótar** | Opnar stillingasíðu viðbóta svo kerfisstjóri geti leyft HTTP-biðlarabeiðnir. Birtist í stað hnappsins hér að ofan þegar það vantar skrifréttindi. |
| **Staðfesta** | Les stöðuna upp á nýtt í skrefi 2 og skrefi 3. |
| **Ræsa vinnsluröð** | Býr til og ræsir stjórnunarvinnsluraðafærsluna. Birtist í skrefi 3 þegar röðin er ekki í gangi. |
| **Opna uppsetningu stjórnanda** | Opnar síðuna [Uppsetning vinnsluraðara](/help/nornir/scheduler-setup/) fyrir ítarlegri stillingar. |
| **Ljúka** | Merkir aðstoðuðu uppsetninguna sem lokið og lokar leiðsögninni. |
