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
Bifrost Iceland DocEx

## Search Result Summary (max 50 chars) {#search-result-summary-max-50-chars}
Rafrænir reikningar um Advania og Unimaze

## Offer Summary (max 100 chars) {#offer-summary-max-100-chars}
Sendu og taktu á móti rafrænum Peppol-reikningum í Business Central um Advania og Unimaze.

## Search Keywords {#search-keywords}
1. Rafrænn reikningur
2. Peppol
3. Skjalaskipti

## Categories {#categories}
- **Primary:** Finance > Accounting
- **Secondary:** IT & Admin Tools > Data Integration

## Industries {#industries}
- Professional Services
- Distribution
- Retail and Consumer Goods
- Manufacturing

## Supported Countries {#supported-countries}
- Ísland

## Supported Languages {#supported-languages}
- Enska (en-US)
- Íslenska (is-IS)

---

## Description {#description}

Lýsingin í heild er [hér fyrir neðan](#full-description-text).

---

## Help Link {#help-link}
https://docs.bifrost.origo.is/is-is/iceland-docex/

## Support Link {#support-link}
https://www.origo.is/

## Privacy Policy {#privacy-policy}
https://docs.bifrost.origo.is/is-is/licensing/privacy/

## Terms of Use {#terms-of-use}
https://docs.bifrost.origo.is/is-is/licensing/eula/

## Products your app works with {#products-your-app-works-with}
- Dynamics 365 Business Central

## Dependencies {#dependencies}
- Bifrost Foundation (Origo), nauðsynlegt, fáanlegt sér á AppSource

---

## Full description text {#full-description-text}

**Bifrost Iceland DocEx** gerir aðstoðinni þinni, samþættingum og tímasettum keyrslum kleift að senda og
taka á móti rafrænum reikningum í Business Central. Forritið tengir Business Central við skjalaskiptanet
Advania og Unimaze á Íslandi, á Peppol BIS 3.0 sniði.

### Hvað það gerir {#what-it-does}

- **Sendir bókaða reikninga og kreditreikninga.** Sendu bókaðan sölureikning eða kreditreikning sem
  rafrænan reikning á Peppol BIS 3.0 sniði, með PDF-skjali. Bókaða skjalið er merkt sent, og skjal sem
  þegar hefur verið sent er ekki sent aftur fyrir mistök.
- **Fylgist með því sem þú sendir.** Sæktu afhendingarstöðu sendra skjala inn í Business Central, lestu
  sögu þeirra og niðurstöður prófana, og opnaðu þau eins og viðtakandinn sér þau.
- **Tekur á móti reikningum.** Sæktu móttekna reikninga og kreditreikninga inn í Business Central sem
  skjöl á innleið, með PDF-skjölum og öðrum viðhengjum, hvert þeirra aðeins einu sinni.
- **Gerir úr þeim innkaupaskjöl eða færslubókarlínur.** Lánardrottinn finnst eftir kennitölu,
  Peppol-kóðum er varpað yfir í þína kóða, línur eru bókaðar á þá reikninga sem þú ákveður eftir
  lánardrottni og VSK-prósentu, og upphæðin stemmir við þá upphæð sem birgirinn biður um að fá greidda.
- **Svarar birgjanum.** Láttu birgi vita í gegnum Unimaze að reikningur hafi verið greiddur, eða hafnaðu
  honum með ástæðu.
- **Athugar viðtakanda áður en þú sendir**, og flettir upp í kóðalistum Peppol BIS 3.0.

### Hvernig það virkar {#how-it-works}

Bifrost Iceland DocEx bætir aðgerðum við Bifrost Foundation. Hver þeirra er heilt verk í Business Central
sem útskýrir sig sjálft fyrir aðstoðinni: til hvers það er, hvað það þarf og hverju það breytir. Aðstoðin
þín (Copilot, ChatGPT, Claude eða önnur) kallar á þær í gegnum Bifrost MCP-þjóninn; samþættingar og
tímasettar keyrslur kalla á þær í gegnum Bifrost API eða biðröð Bifröst. Hvert kall keyrir með eigin
heimildum notandans í Business Central og er skráð í fyrirtækinu.

### Stjórn {#control}

- Innskráningarupplýsingar eru geymdar í varinni geymslu, fyrir hvert net og hvert umhverfi, og birtast
  aldrei aftur.
- Hvert kall til skjalaskiptanets er skráð með innskráningarupplýsingarnar faldar.
- Prófunarumhverfi fyrir hvert net, svo þú getir sent skjal frá upphafi til enda áður en þú ferð í raun.

### Kröfur {#requirements}

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra (Essentials eða Premium), fyrir fyrirtæki á
  Íslandi
- Bifrost Foundation (fáanlegt sér á AppSource)
- Samningur við Advania eða Unimaze um skjalaskipti
- Hafðu samband við Business Central samstarfsaðilann þinn varðandi verð
