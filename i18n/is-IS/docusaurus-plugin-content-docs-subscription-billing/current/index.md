---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Áskriftarreikningagerð Microsoft gerð aðgengileg utan frá — samningar, reikningagerð, notkunargögn, frestanir og yfirfærsla."
---

# Bifröst Subscription Billing

**Keyrðu reglulega reikningagerð án þess að smella í gegnum hvern samning.** Bifröst Subscription
Billing gerir samþættingu, tímasettu ferli eða aðstoð kleift að vinna verkin sem búa á bak við
aðgerðahnappana í appi Microsoft, **Subscription Billing**.

Það kallar á eigin rökfræði Microsoft í Subscription Billing og endurútfærir ekkert af henni.
Niðurstöðurnar birtast á stöðluðu síðum Subscription Billing, svo þú ferð yfir þær þar sem þú ert
vanur.

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Sett áskriftir á samninga.** Notaðu áskriftarpakka á áskrift og tengdu línur hennar við
  samning viðskiptamanns eða lánardrottins. Eigin reglur Microsoft reikna út verð, reikningstakt og
  dagsetningar.
- **Gert reikning fyrir samning eða heila keyrslu.** Gerðu óbókaðan reikning fyrir einn samning,
  eða búðu til reikningstillögu fyrir reikningssniðmát og breyttu henni í skjöl í einni keyrslu.
- **Séð niðurstöðuna áður en reikningur er gerður.** Forskoðaðu hvað samningur eða reikningskeyrsla
  myndi búa til, með raunverulegum tölum, án þess að neitt sé geymt.
- **Gert reikninga eftir notkun.** Afhentu notkunarskrá sem gögn og færðu hana í gegnum
  vinnsluþrep Microsoft.
- **Lokað tímabilinu.** Losaðu frestaðar tekjur og kostnað í fjárhag, endurbyggðu greiningarfærslur
  samninga, framlengdu áskrift á nýjan samning eða búðu til endurnýjunartilboð.
- **Flutt áskriftir inn.** Breyttu innfluttum biðlínum í raunverulegar áskriftir og samninga.

Tímasettu mánaðarlega reikningstillögu og stofnun skjala sem keðju í
[Bifröst Orchestrator](/orchestrator/) og sinntu aðeins frávikunum.

## Sæktu appið

Settu **Bifrost Subscription Billing** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra, Essentials eða Premium, og app
Microsoft, **Subscription Billing**, uppsett og stillt.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp app Microsoft, **Subscription Billing**, og keyrðu leiðsagnaruppsetningu þess, svo Subscription Contract Setup, númeraraðir og að minnsta kosti eitt reikningssniðmát séu til. | Kerfisstjóri Business Central |
| 2 | Ljúktu bókunaruppsetningunni sem Subscription Billing þarf áður en reikningar og frestanir geta bókast: almennri bókunaruppsetningu, VSK-bókunaruppsetningu, uppsetningu upprunakóða og færslubók fyrir losun frestana. | Kerfisstjóri Business Central eða samstarfsaðili |
| 3 | Settu **Bifrost Subscription Billing** upp við hlið Bifröst Foundation. | Kerfisstjóri Business Central |
| 4 | Gefðu hverjum notanda eða þjónustu sem kallar á appið heimildasafnið **Bifrost Sub. Billing** (`BIFROST SubBil ori`), við hlið heimilda þeirra í Foundation. | Kerfisstjóri Business Central |

Appið hefur engar síður sjálft: niðurstöður þess birtast á stöðluðu síðum Subscription Billing.

## Gott að vita

- **Það vinnur sem þú.** Heimildasafnið leyfir notanda aðeins að keyra aðgerðir þessa apps. Það
  víkkar ekki aðgang að gögnum Subscription Billing; eigin heimildir notandans gilda áfram.
- **Engu er eytt.** Áskrift lýkur með lokadagsetningu eða lokunarmerki. Ef skref mistekst er
  vinnan bakfærð og skýr villa kemur til baka, nema í magnkeyrslum reikningagerðar, vinnslu
  notkunargagna og innflutnings, sem halda því sem var gert fyrir villuna og segja frá því.
- **Sumar aðgerðir eru ekki enn tiltækar.** Uppfærsla dagsetninga samningslína, uppfærsla gengis og
  tillaga og keyrsla verðuppfærslu eru skráðar en skila villu, því Microsoft hefur ekki gert
  undirliggjandi fall opinbert. Notaðu samsvarandi aðgerð í Business Central í staðinn.
- **Losun frestana bókar í fjárhag, fyrir alla samninga, fram að vinnudagsetningu.** Ekki er hægt
  að senda dagsetninguna inn utan frá. Athugaðu vinnudagsetninguna áður en þú keyrir þetta í
  raunumhverfi.
- **Reikningur er gerður einu sinni fyrir samning þar til síðasta skjal hans er bókað.**
  Innkaupareikningar eru alltaf stofnaðir óbókaðir, og engin ytri þjónusta eða auðkenni koma við
  sögu: allt keyrir inni í Business Central.

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_message_types` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**.

- [Prófunarsviðsmyndir fyrir AppSource](./user-scenarios) · [Texti AppSource-skráningar](./listing)
- Heimildasafn: **Bifrost Sub. Billing** (`BIFROST SubBil ori`), ofan á heimildir kallandans í Foundation.
