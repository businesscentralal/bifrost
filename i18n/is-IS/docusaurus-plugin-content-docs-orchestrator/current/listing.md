---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Afritaðu þessa texta inn í Partner Center þegar skráning tilboðsins er búin til eða uppfærð.

---

## Offer Name
Bifrost Orchestrator

## Search Result Summary (max 50 chars)
Tímasetning vinnsluraðar og keðjur Bifrost

## Offer Summary (max 100 chars)
Stjórnun vinnsluraðar með keðjum, skýrslum, Telegram- og tölvupóstviðvörunum og tímasetningu.

## Search Keywords
1. Vinnsluröð
2. Sjálfvirkni ferla
3. Keðja

## Categories
- **Primary:** IT & Admin Tools > Data Integration
- **Secondary:** Operations > Supply Chain

## Industries
- Professional Services
- Manufacturing

---

## Lýsing

Heildartexti lýsingarinnar er [hér fyrir neðan](#full-description-text).

---

## Help Link
https://businesscentralal.github.io/bifrost/en-us/orchestrator/

## Support Link
https://www.origo.is/

## Products your app works with
- Dynamics 365 Business Central

## Dependencies
- Bifrost Foundation (Origo) — nauðsynlegt, fáanlegt sérstaklega á AppSource

---

## Heildartexti lýsingar {#full-description-text}

**Bifrost Orchestrator** bætir tímasetningu, vöktun, endurræsingu og villumeðhöndlun vinnsluraðar við Business Central í gegnum Bifrost, skilaboðabyggt samþættingarlag sem veitir ytri kerfum, gervigreindarþjónum og sjálfvirkniverkfærum skipulegan aðgang að gögnum og ferlum Business Central. Það inniheldur keyrsluvél fyrir keðjur sem keyrir runur af aðgerðum með gagnaflæði, ítrun yfir lista, skilyrtum greiningum, keyrslu í síðum og afhendingu með tölvupósti eða Telegram.

### Fyrir hverja?

**Upplýsingatækniteymi, samþættingarforritara og kerfisstjóra Business Central** sem þurfa áreiðanlega, sjálfvirka stjórnun vinnsluraðar og samhæfingu ferla í mörgum skrefum. Hentar fyrirtækjum sem keyra tímasettar samþættingar, reglulega samstillingu gagna eða sjálfvirka skjalavinnslu þar sem vöktun, endurræsingarreglur og tilkynningar um villur skipta sköpum.

**Markhópar:** Sérfræðiþjónusta, framleiðsla, dreifing, smásala — hvert það fyrirtæki sem keyrir tímasett bakgrunnsverk í Business Central.

### Hvað það gerir

- **Tímasetning og eftirlit með vinnsluröð** — Vaktar, endurræsir og stýrir færslum vinnsluraðar. Stillanlegar endurtekningarreglur, endurtekin sniðmát, tímasetning og sjálfvirk endurræsing við villu
- **Tilkynningar í Telegram og tölvupósti** — Sendir viðvaranir þegar verk bregðast eða eru endurræst. Telegram-skilaboð fara á spjallauðkenni notandans; tölvupóstur notar innbyggt tölvupóstkerfi BC
- **Keðjur** — Ferli í mörgum skrefum þar sem hvert skref er ein aðgerð og gögn flæða um sameiginlegt vinnusvæði með `@path`-tilvísunum
- **Ítrun** — Skref í keðju getur farið í gegnum lista úr fyrri skrefum og unnið hvert stak með sinni eigin aðgerð
- **Skilyrtar greiningar** — Mismunandi næstu skref eftir árangri eða villu, sleppa ef fyrra skref mistókst, og upphafsskilyrði fyrir hvert skref
- **Keyrsla í síðum** — Skref í keðju geta farið sjálfkrafa í gegnum stór gagnasöfn í síðum
- **Tímasettar keðjur** — Keyra keðjur eftir endurtekinni tímaáætlun í gegnum vinnsluröðina, eða setja þær í röð til keyrslu einu sinni með eigin færibreytum
- **Skýrslur eftir þörfum** — Skrá, skoða, birta (PDF, Excel, Word, XML) og keyra vinnsluskýrslur, með endurnýtanlegum forstillingum beiðna
- **Keyrsluskrá** — Hver keyrsla keðju er skráð sem tilvik með skrá fyrir hvert skref sem geymir beiðnina, svarið og mynd af vinnusvæðinu
- **Leiðsagnarforrit** — Leiðsögn um uppsetningu HTTP-beiðna, vinnsluraðar og bot-teiknis Telegram

### Hvernig það virkar

1. Skráðu færslur vinnsluraðar sem **tímasettar færslur** — Bifrost Orchestrator vaktar þær og endurræsir sjálfkrafa
2. Stilltu **tegund tilkynningar** (Engin, Tölvupóstur, Telegram) fyrir hverja færslu til að fá viðvaranir við villu
3. Smíðaðu **keðjur** úr skrefum sem keyra aðgerðir í röð, með beiðnasniðmátum sem nota `@`-tilvísanir í vinnusvæðið til að flytja gögn milli skrefa
4. Keyrðu keðjur handvirkt, eftir tímaáætlun, eða settu þær í röð til síðari keyrslu

### Studdar útgáfur og lönd

- **Útgáfur:** Business Central Essentials og Premium
- **Lönd:** Ísland, Bretland, Danmörk, Noregur, Svíþjóð, Finnland, Þýskaland, Frakkland, Holland, Austurríki, Sviss, Írland, Portúgal, Spánn

### Kröfur og forsendur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra
- Bifrost Foundation-viðbótin (fáanleg sérstaklega á AppSource)
- Fyrir Telegram-tilkynningar: bot-teikn frá Telegram (búið til með @BotFather) og spjallauðkenni notenda skráð í Bifrost User Setup
- Fyrir tölvupósttilkynningar: tölvupóstreikningur í BC, stilltur með tölvupóstsviðsmynd

### Hjálp og skjölun

https://businesscentralal.github.io/bifrost/is-is/orchestrator/ (enska útgáfan er á https://businesscentralal.github.io/bifrost/en-us/orchestrator/).
