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
Bifrost Iceland Treasury

## Search Result Summary (max 50 chars) {#search-result-summary-max-50-chars}
Fjárstýring á Íslandi í Business Central

## Offer Summary (max 100 chars) {#offer-summary-max-100-chars}
Fjárstýring fyrir Ísland í Business Central: greiðslur, kröfur, yfirlit og gengi.

## Search Keywords {#search-keywords}
1. Fjárstýring á Íslandi
2. Bankaafstemming
3. Kröfur

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
https://docs.bifrost.origo.is/is-is/iceland-treasury/

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

**Bifrost Iceland Treasury** styður fjárstýringu íslenskra fyrirtækja í Business Central, fyrir aðstoðina
þína, samþættingar og tímasettar keyrslur. Forritið tengir Business Central við vefþjónustur íslenskra
banka, innheimtufyrirtækja og greiðsluþjónustuveitenda og virkar eins fyrir þá alla.

### Hvað það gerir {#what-it-does}

- **Flytur yfirlit inn í bankaafstemmingu.** Hver þjónustuveitandi hefur sitt innflutningssnið fyrir
  bankayfirlit: innflutningur sækir yfirlitið, stofnar afstemmingarlínurnar og sýnir samantekt yfir
  stöðurnar. Kortafærslur eru fluttar inn á sama hátt þar sem þjónustuveitandinn býður þær.
- **Skráir greiðslubunka.** Bunkar innlendra og erlendra greiðslna, með þeim flokkunarlykli Seðlabankans
  sem hver þjónustuveitandi tekur. Þar sem þjónustuveitandinn heldur bunka til samþykktar samþykkir
  starfsmaður fyrirtækisins hann og greiðir í netbankanum.
- **Veit hvenær greiðsla er greidd.** Hvert yfirlit sem er lesið eða flutt inn er borið saman við opnar
  greiðslur reikningsins, og greiðslurnar sem það sýnir eru merktar greiddar.
- **Stofnar kröfur og fylgir þeim eftir.** Kröfur eru stofnaðar fyrir viðskiptamannafærslur, þeim breytt
  eða þær felldar niður, og greiðslurnar sem þjónustuveitandinn tilkynnir eru skráðar, svo hver krafa
  sýnir hvað er greitt og hvað er opið.
- **Fylgist með öllu í Business Central.** Greiðslubunkar, greiðslur og kostnaður, kröfur, kröfubunkar,
  greiðslur krafna og ferill allra aðgerða hjá þjónustuveitanda, á síðum sem eru aðeins til lestrar, eins
  fyrir alla þjónustuveitendur.
- **Meira frá hverjum þjónustuveitanda.** Eftir þjónustuveitanda: reikningar og staðfesting reikninga,
  gengi, seðlar og ógreiddir reikningar, kredit- og fyrirtækjakort, gjaldeyrisreikningar, eignasöfn,
  rafræn skjöl og færsluhirðing.

### Hvernig það virkar {#how-it-works}

Bifrost Iceland Treasury bætir aðgerðum við Bifrost Foundation. Hver þeirra er heilt verk hjá
þjónustuveitandanum sem útskýrir sig sjálft fyrir aðstoðinni: til hvers það er, hvað það þarf og hverju
það breytir. Aðstoðin þín (Copilot, ChatGPT, Claude eða önnur) kallar á þær í gegnum Bifrost MCP-þjóninn;
samþættingar og tímasettar keyrslur kalla á þær í gegnum Bifrost API eða biðröð Bifröst. Hvert kall keyrir
með eigin heimildum notandans í Business Central og er skráð í fyrirtækinu.

### Stjórn {#control}

- Bifrost samþykkir ekki greiðslur, og bunka sem nefndur er til beinnar greiðslu er hafnað.
- Heimildasamstæða fyrir hverja tegund verka, eins fyrir alla þjónustuveitendur: greiðslur og erlendar
  greiðslur eru alltaf veittar af ásetningi, og aðeins kerfisstjóri með heimildasamstæðu uppsetningar
  breytir uppsetningunni.
- Lykilorð, skírteini og API-lyklar eru geymd í varinni geymslu og birtast aldrei aftur. Notandi með
  eigin innskráningu hjá þjónustuveitanda skráir hana sjálfur.
- Hvert kall til þjónustuveitanda er skráð með lykilorðin falin.

### Forsendur {#requirements}

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra (Essentials eða Premium), fyrir fyrirtæki á
  Íslandi
- Bifrost Foundation (fáanlegt sér á AppSource)
- Samningur við hvern banka, innheimtufyrirtæki eða greiðsluþjónustuveitanda um vefþjónustur hans, með
  þeim aðgangsupplýsingum, og biðlaraskírteini þar sem þess er krafist, sem hann gefur út
- Hafðu samband við samstarfsaðilann þinn fyrir Business Central varðandi verð
