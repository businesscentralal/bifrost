---
id: release-notes
title: "Shopify útgáfuupplýsingar"
sidebar_label: "Útgáfuupplýsingar"
sidebar_position: 90
description: "Breytingar í Bifröst Shopify sem viðskiptavinur sér."
---

# Útgáfuupplýsingar Bifröst Shopify

Þessar upplýsingar hjálpa sölu-, birgða- og kerfisstjórateymum að fara yfir hvað forritið breytir. Til að sjá uppsettu útgáfuna skaltu opna **Extension Management** í Business Central.

## 28.0.0.0 — Unreleased {#v28-0-0-0}

### Upphafleg geta {#initial-capabilities}

- Sækja nýjar og breyttar pantanir fyrir eina verslun. Seinni innflutningur afritar ekki pantanir sem hafa ekki breyst. Pantanir sem voru vistaðar áður en villa kom standa.
- Stofna sölupöntun eða reikning einnar innfluttrar pöntunar. Svarið nefnir tegund skjalsins og stöðuna Open, Released, Pending Approval eða Pending Prepayment, með þeim orðum á öllum tungumálum. Seinni beiðni segir að söluskjalið sé þegar til. Þegar **Return and Refund Process** á versluninni er **Auto Create Credit Memo** er beiðninni hafnað áður en nokkru er breytt.
- Stofna kreditnótu einnar innfluttrar endurgreiðslu þegar verslunin stofnar kreditnótur sjálfkrafa. Seinni beiðni segir að endurgreiðslan hafi þegar verið afgreidd. Kreditnótan er ekki bókuð fyrir þig.
- Samstilla vörur í þá átt sem verslunin er sett upp fyrir og stofna vörur fyrir afbrigði vöru sem þegar er í Business Central. Stofnun vara hringir ekki í Shopify. Afbrigði sem þegar er tengt, eða vara sem þegar er til fyrir vörunúmerið, er tengt í stað þess að vera stofnað aftur.
- Senda verð fyrir afbrigði þar sem verð, samanburðarverð eða kostnaðarverð breyttist. Misheppnuð sending setur afbrigðin til baka. Önnur sending með sömu verðum sendir ekkert.
- Flytja inn Shopify viðskiptavini og uppfæra Shopify viðskiptavini úr Business Central eftir stillingum verslunarinnar. Viðskiptavinir sem þegar eru tengdir eru paraðir, ekki stofnaðir aftur.
- Senda eina bókun sölusendingar til Shopify sem afhendingu. Sendingu sem þegar hefur afhendingu er hafnað. Afhending sem Shopify hefur samþykkt stendur.
- Senda birgðastöðu á hvern birgðastað fyrir eina virka verslun. Hægt er að senda birgðir án þess að flytja vörur inn fyrst og takmarka sendinguna við eitt afbrigði. Sama sending aftur lætur Shopify óbreytt.
- Enska (Bandaríkin) og íslenska (Ísland). **Bifröst Shopify allur aðgangur** (`SHOPIFY Full ori`) má breyta gögnum. **Bifröst Shopify lestur** (`SHOPIFY Read ori`) má það ekki. Microsoft Shopify heimildir þarf áfram.

### Kröfur {#requirements}

Þessi útgáfa krefst Bifröst Foundation **28.0.5.590** eða nýrri og Shopify Connector frá Microsoft **28.0.0.0** eða nýrri, á Business Central 28.

Sjá [yfirlitið](./index.md) fyrir uppsetningu og [notkunardæmin](./user-scenarios.md) fyrir verkin sem á að yfirfara áður en skjal er bókað eða afhending send.
