---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Áskriftarreikningagerð Microsoft gerð aðgengileg utan frá — samningar, reikningskeyrsla, notkunargögn, frestanir og yfirfærsla."
---

# Bifröst Subscription Billing

**Keyrðu reglulega reikningagerð án þess að smella í gegnum hvern samning.** Bifröst Subscription
Billing gerir samþættingu, tímasettu ferli eða aðstoð kleift að vinna verkin sem búa á bak við
aðgerðahnappana í forriti Microsoft, **Subscription Billing**.

Það keyrir eigin rökfræði Microsoft í Subscription Billing. Þar sem Microsoft býður skref aðeins á
bak við síðu fylgir forritinu kóði Microsoft fyrir það skref. Niðurstöðurnar birtast á stöðluðu
síðum Subscription Billing, svo þú ferð yfir þær þar sem þú ert vanur.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert {#what-you-can-do}

- **Sett áskriftir á samninga.** Notaðu áskriftarpakka á áskrift og tengdu línur hennar við
  samning viðskiptamanns eða lánardrottins. Eigin reglur Microsoft reikna út verð, reikningstakt og
  dagsetningar.
- **Gert reikning fyrir samning eða heila keyrslu.** Gerðu reikning fyrir einn samning, eða búðu til
  reikningstillögu fyrir reikningssniðmát og breyttu henni í skjöl í einni keyrslu. Bókaðu skjölin
  sem keyrslan stofnaði, eða afturkallaðu keyrslu sem er ekki bókuð: hreinsaðu tillöguna og eyddu
  skjölum hennar.
- **Séð niðurstöðuna áður en reikningur er gerður.** Forskoðaðu hvað samningur eða reikningskeyrsla
  myndi búa til, með raunverulegum tölum, án þess að neitt sé geymt.
- **Gert reikninga eftir notkun.** Afhentu notkunarskrá sem gögn, tengdu hana við áskriftirnar sem
  hún tilheyrir og færðu hana í gegnum vinnsluþrep Microsoft.
- **Haldið samningum réttum.** Lokaðu línum sem eru útrunnar, sameinaðu samningslínur, fjarlægðu
  línu, uppfærðu gengi á samningum í erlendri mynt og uppfærðu verð.
- **Lokað tímabilinu.** Losaðu frestaðar tekjur og kostnað í fjárhag, endurbyggðu greiningarfærslur
  samninga, framlengdu áskrift á nýjan samning eða búðu til endurnýjunartilboð.
- **Flutt áskriftir inn.** Breyttu innfluttum biðlínum í raunverulegar áskriftir og samninga.

Tímasettu mánaðarlega reikningstillögu, stofnun skjala og bókun í þínu eigin ferli eða sjálfvirkni
og sinntu aðeins frávikunum.

## Svið {#capabilities}

| Lén | Svið |
|---|---|
| **Subscription** | Samningar og línur þeirra, reikningskeyrslan frá tillögu til bókunar, reikningagerð eftir notkun, verðuppfærslur, endurnýjanir, frestanir, greining samninga og yfirfærsla áskrifta |

## Sæktu forritið {#get-it}

Settu **Bifrost Subscription Billing** upp við hlið Bifröst Foundation, af [AppSource](https://marketplace.microsoft.com/en-US/product/dynamics-365-business-central/PUBID.origo%7CAID.origo_bifrost_subscription_billing%7CPAPPID.dd7b8bd8-f93e-4ac4-a251-1a132a14ef3d) eða í gegnum
Business Central samstarfsaðila þinn. Það þarf Business Central 28.3 eða nýrra, Essentials eða
Premium, og forrit Microsoft, **Subscription Billing**, uppsett og stillt. Hafðu samband við Business
Central samstarfsaðilann þinn varðandi verð.

## Uppsetning {#set-it-up}

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp forrit Microsoft, **Subscription Billing**, og keyrðu leiðsagnaruppsetningu þess, svo Subscription Contract Setup, númeraraðir og að minnsta kosti eitt reikningssniðmát séu til. | Kerfisstjóri Business Central |
| 2 | Ljúktu bókunaruppsetningunni sem Subscription Billing þarf áður en reikningar og frestanir geta bókast: almennri bókunaruppsetningu, VSK-bókunaruppsetningu, uppsetningu upprunakóða og færslubók fyrir losun frestana. | Kerfisstjóri Business Central eða samstarfsaðili |
| 3 | Settu **Bifrost Subscription Billing** upp við hlið Bifröst Foundation. | Kerfisstjóri Business Central |
| 4 | Gefðu hverjum notanda eða þjónustu sem kallar á forritið heimildasafnið **Bifrost Sub. Billing** (`BIFROST SubBil ori`), við hlið heimilda þeirra í Foundation. Bættu **Bókun áskriftareikninga** (`BIFROST SubPost ori`) aðeins við hjá þeim sem mega bóka reikningsskjöl. | Kerfisstjóri Business Central |

Forritið hefur engar síður sjálft: niðurstöður þess birtast á stöðluðu síðum Subscription Billing.

## Gott að vita {#good-to-know}

- **Það vinnur sem þú.** Heimildasöfnin leyfa notanda aðeins að keyra aðgerðir þessa forrits. Þau
  víkka ekki aðgang að gögnum Subscription Billing; eigin heimildir notandans gilda áfram.
- **Bókun er sérstök heimild.** Til að bóka reikningsskjöl þarf `BIFROST SubPost ori` ofan á
  heimildasafn reikningagerðar, svo hægt sé að fela mismunandi fólki að stofna skjöl og bóka þau.
  Innkaupareikningur er aðeins bókaður með reikningsnúmeri lánardrottins sjálfs.
- **Afturköllun aðeins fyrir bókun.** Fjarlægja má tillögu og skjöl reikningskeyrslu á meðan ekkert
  er bókað. Bókaður reikningur er felldur niður eða leiðréttur með stöðluðum aðgerðum Business
  Central.
- **Gjaldmiðli samnings er breytt á samningnum.** Aðstoð getur ekki breytt gjaldmiðli
  áskriftarsamnings með almennu gagnaaðgerðunum; hún uppfærir í staðinn gengi á línum samningsins.
- **Losun frestana bókar í fjárhag, fyrir alla samninga, fram að vinnudagsetningu.** Ekki er hægt
  að senda dagsetninguna inn utan frá. Athugaðu vinnudagsetninguna áður en þú keyrir þetta í
  raunumhverfi.
- **Ef skref mistekst** er vinnan bakfærð og skýr villa kemur til baka, nema í magnkeyrslum
  reikningagerðar, vinnslu notkunargagna og innflutnings, sem halda því sem var gert fyrir villuna og
  segja frá því. Allt keyrir inni í Business Central; engin ytri þjónusta eða auðkenni koma við sögu.

## Tilvísun {#reference}

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_domains`, `describe_domains` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**.

- Heimildasöfn: **Bifrost Sub. Billing** (`BIFROST SubBil ori`) og **Bókun áskriftareikninga** (`BIFROST SubPost ori`), ofan á heimildir kallandans í Foundation.
