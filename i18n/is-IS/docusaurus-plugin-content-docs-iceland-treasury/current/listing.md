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
Íslensku bankarnir í Business Central, úr aðstoð

## Offer Summary (max 100 chars) {#offer-summary-max-100-chars}
Yfirlit, greiðslur og kröfur hjá Arion banka, Íslandsbanka og Landsbankanum, úr hvaða aðstoð sem er.

## Search Keywords {#search-keywords}
1. Íslenskir bankar
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

**Bifrost Iceland Treasury** gerir aðstoðinni þinni, samþættingum og tímasettum keyrslum kleift að vinna
með íslensku bönkunum þínum í Business Central. Forritið tengir Business Central við vefþjónustur Arion
banka, Íslandsbanka og Landsbankans og virkar eins fyrir þá alla.

### Hvað það gerir {#what-it-does}

- **Les yfirlit inn í bankaafstemmingu.** Hver banki hefur sitt innflutningssnið fyrir bankayfirlit:
  innflutningur sækir yfirlitið til bankans, stofnar afstemmingarlínurnar og sýnir samantekt yfir
  stöðurnar. Kortafærslur hjá Arion banka og Landsbankanum eru lesnar inn á sama hátt.
- **Skráir greiðslubunka til samþykktar.** Bunkar innlendra greiðslna (ISK) hjá Arion banka og
  Landsbankanum, og bunkar erlendra greiðslna hjá öllum bönkunum, með þeim flokkunarlykli
  Seðlabankans sem hver banki tekur. Starfsmaður fyrirtækisins samþykkir og greiðir hvern bunka í
  bankanum.
- **Veit hvenær greiðsla er greidd.** Hvert yfirlit sem er lesið eða flutt inn er borið saman við opnar
  greiðslur reikningsins, og greiðslurnar sem það sýnir eru merktar greiddar.
- **Stofnar kröfur og fylgir þeim eftir.** Stofnaðu kröfur fyrir viðskiptamannafærslur, breyttu þeim eða
  felldu niður, og skráðu greiðslurnar sem bankinn tilkynnir, svo hver krafa sýnir hvað er greitt og hvað
  er opið.
- **Fylgist með öllu í Business Central.** Greiðslubunkar, greiðslur og kostnaður, kröfur, kröfubunkar,
  greiðslur krafna og ferill allra aðgerða í banka, á síðum sem eru aðeins til lestrar, eins fyrir alla
  banka.
- **Meira frá hverjum banka.** Reikningar og staðfesting reikninga, gengi, greiðsluseðlar og ógreiddir
  reikningar, kredit- og fyrirtækjakort, gjaldeyrisreikningar, og hjá Landsbankanum eignasöfn, rafræn
  skjöl og færsluhirðing.

### Hvernig það virkar {#how-it-works}

Bifrost Iceland Treasury bætir aðgerðum við Bifrost Foundation. Hver þeirra er heilt verk í bankanum
sem útskýrir sig sjálft fyrir aðstoðinni: til hvers það er, hvað það þarf og hverju það breytir.
Aðstoðin þín (Copilot, ChatGPT, Claude eða önnur) kallar á þær í gegnum Bifrost MCP-þjóninn; samþættingar
og tímasettar keyrslur kalla á þær í gegnum Bifrost API eða biðröð Bifröst. Hvert kall keyrir með eigin
heimildum notandans í Business Central og er skráð í fyrirtækinu.

### Stjórn {#control}

- Bifrost samþykkir aldrei eða greiðir greiðslu: bunki bíður í bankanum eftir því að starfsmaður samþykki
  hann, og bunka sem nefndur er til beinnar greiðslu er hafnað.
- Heimildasafn fyrir hverja tegund verka, eins fyrir alla banka: greiðslur og erlendar greiðslur eru
  alltaf veittar af ásetningi, og aðeins kerfisstjóri með heimildasafn uppsetningar breytir uppsetningu
  bankanna.
- Lykilorð, skírteini og API-lyklar eru geymd í varinni geymslu og birtast aldrei aftur. Notandi með
  eigin innskráningu í bankann skráir hana sjálfur.
- Hvert kall til banka er skráð með lykilorðin falin.

### Forsendur {#requirements}

- Microsoft Dynamics 365 Business Central 28.0 eða nýrra (Essentials eða Premium), fyrir fyrirtæki á
  Íslandi
- Bifrost Foundation (fáanlegt sér á AppSource)
- Samningur við hvern banka um vefþjónustur hans, með notandanafni, lykilorði og biðlaraskírteini sem
  bankinn gefur út (og API-lykli hjá Landsbankanum)
- Hafðu samband við Business Central samstarfsaðilann þinn varðandi verð
