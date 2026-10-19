---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Afritaðu þessa texta inn í Partner Center þegar skráning tilboðsins er stofnuð eða uppfærð.

---

## Offer Name {#offer-name}
Bifrost Orchestrator

## Search Result Summary (max 50 chars) {#search-result-summary-max-50-chars}
Eftirlit með vinnsluröð og Bifröst keðjur

## Offer Summary (max 100 chars) {#offer-summary-max-100-chars}
Eftirlit með vinnsluröð, keðjur og skýrslur eftir tímaáætlun, viðvaranir í tölvupósti eða Telegram.

## Search Keywords {#search-keywords}
1. Vinnsluröð
2. Sjálfvirkni ferla
3. Keðja

## Categories {#categories}
- **Primary:** IT & Admin Tools > Data Integration
- **Secondary:** Operations > Supply Chain

## Industries {#industries}
- Professional Services
- Manufacturing

---

## Lýsing {#description}

Heildartexti lýsingarinnar er [hér fyrir neðan](#full-description-text).

---

## Help Link {#help-link}
https://docs.bifrost.origo.is/is-is/orchestrator/

## Support Link {#support-link}
https://www.origo.is/

## Products your app works with {#products-your-app-works-with}
- Dynamics 365 Business Central

## Dependencies {#dependencies}
- Bifrost Foundation (Origo), nauðsynlegt, fáanlegt sérstaklega á AppSource

---

## Heildartexti lýsingar {#full-description-text}

**Bifrost Orchestrator** (Bifröst stjórnandi) heldur vinnsluröð Business Central gangandi og gerir föst
ferli að keðjum sem keyra sig sjálfar. Hann hefur eftirlit með vinnsluraðafærslum, endurræsir þær þegar
þær bregðast og lætur þig vita þegar það skiptir máli. Keðjurnar tengja saman Bifröst-aðgerðir, heil verk
í Business Central sem Bifrost Foundation og hin Bifröst-forritin bjóða, í föst ferli sem keyra eftir
beiðni eða eftir tímaáætlun. Bifröst fer með Business Central til aðstoðarmannsins sem fólkið þitt notar
nú þegar, svo aðstoðarmaður getur líka keyrt, tímasett og hjálpað til við að smíða þessi ferli.

### Fyrir hverja? {#who-is-this-for}

**Kerfisstjóra Business Central, upplýsingatækniteymi og þau sem eiga föst ferli**: alla sem keyra
tímasett bakgrunnsverk í Business Central og þurfa eftirlit, endurræsingu og upplýsingar um þau, eða
vilja að endurtekið verk sé unnið eins í hvert sinn.

**Markhópar:** Sérfræðiþjónusta, framleiðsla, dreifing, smásala: hvert það fyrirtæki sem keyrir
tímasett verk í Business Central.

### Hvað það gerir {#what-it-does}

- **Eftirlit með vinnsluröð** — Fylgist með vinnsluraðafærslum og endurræsir þær þegar þær bregðast,
  eftir endurprófunarreglum hverrar færslu (alltaf, allt að þrisvar eða aldrei). Endurnýtanleg
  endurtekningarsniðmát geyma áætlunina.
- **Tilkynningar í tölvupósti og Telegram** — Sendir viðvörun þegar verk bregst eða er endurræst.
  Telegram-skilaboð fara á spjallauðkenni hvers notanda; tölvupóstur notar tölvupóstreikninga Business
  Central sjálfs.
- **Keðjur** — Föst ferli í skrefum, hvert þeirra Bifröst-aðgerð í Business Central. Skref getur notað
  gildi úr fyrri skrefum, endurtekið sig fyrir hvert stak í lista, og farið eina leið eftir árangur og
  aðra eftir misbrest, með skilyrðum sem ráða hvort skref keyrir.
- **Tímasettar keðjur** — Keyrðu keðju eftir endurtekinni tímaáætlun í gegnum vinnsluröðina, keyrðu hana
  einu sinni í bakgrunni með eigin inntaki, eða ræstu hana frá aðstoðarmanni.
- **Skýrslur eftir þörfum** — Finndu skýrslu, keyrðu hana með tilgreindum valkostum eða vistuðum
  forsendum beiðnisíðu notandans, og vistaðu hana sem PDF, Excel, Word eða XML, með útliti sem er valið
  fyrir þá keyrslu eingöngu. Útlit skýrslna má telja upp, flytja út og flytja inn.
- **Keyrsluskrá** — Hver keyrsla keðju er geymd með skrá fyrir hvert skref: hvað skrefið sendi, hvað það
  fékk og hve langan tíma það tók.
- **Aðstoðuð uppsetning** — Leiðsögn um HTTP-beiðnir og stjórnunarvinnsluraðafærsluna. Leyndarmál á borð
  við Telegram-vélmennislykilinn eru geymd í leyndarmálageymslu Bifröst.

### Hvernig það virkar {#how-it-works}

1. Settu vinnsluraðafærslur undir Bifröst stjórnanda — hann hefur eftirlit með þeim og endurræsir þær
   þegar þær bregðast.
2. Veldu **gerð tilkynningar** (Engin, Tölvupóstur, Telegram) fyrir hverja færslu til að fá viðvörun
   þegar verk bregst eða er endurræst.
3. Smíðaðu **keðjur** úr skrefum sem kalla á Bifröst-aðgerðir í röð og flytja gildi milli skrefa.
4. Keyrðu keðjur handvirkt, eftir tímaáætlun eða frá aðstoðarmanni.

### Studdar útgáfur og lönd {#supported-editions-and-countries}

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland, Bretland, Danmörk, Noregur, Svíþjóð, Finnland, Þýskaland, Frakkland, Holland, Austurríki, Sviss, Írland, Portúgal, Spánn

### Kröfur og forsendur {#requirements-and-prerequisites}

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra
- Bifrost Foundation (fáanlegt sérstaklega á AppSource)
- Fyrir Telegram-tilkynningar: Telegram-vélmennislykill (búinn til með @BotFather) og Telegram-spjallauðkenni hvers notanda í Bifröst-notandauppsetningu hans
- Fyrir tölvupósttilkynningar: tölvupóstreikningur í Business Central

### Hjálp og skjölun {#help-and-documentation}

https://docs.bifrost.origo.is/is-is/orchestrator/ (enska útgáfan er á https://docs.bifrost.origo.is/en-us/orchestrator/).
