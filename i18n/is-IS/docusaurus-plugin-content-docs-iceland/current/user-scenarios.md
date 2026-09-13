---
id: user-scenarios
title: "Notendasviðsmyndir fyrir AppSource"
sidebar_label: "Notendasviðsmyndir"
sidebar_position: 8
description: "Sviðsmyndir sem staðfestingarteymi Microsoft keyrir til að votta viðbótina fyrir AppSource."
---

**Útgefandi:** Origo
**Útgáfa:** 28.0.0.0
**Prófunarumhverfi:** Íslenskt BC-sandbox með IS Core-staðfæringu.

## Prófunarskilríki

Opinberar þjónustur Seðlabankans og island.is þurfa engin skilríki. RSK, Skilagrein og SMS krefjast prófunarskilríkja sem taka við gervigögnum án raunverulegra skattalegra afleiðinga.

## Sviðsmynd 1: Uppsetning og virkjun

Settu upp Bifröst Foundation og Bifröst Iceland í hreinu íslensku sandboxi. Opnaðu Bifröst Iceland Setup og staðfestu að fastflipar fyrir Umsjá, SMS, Skattinn, Skilagrein og Já Gagnatorg birtist. Leitaðu að `Help.Iceland.Get` og staðfestu að skilaboðategundin sé skráð.

## Sviðsmynd 2: Yfirlit hjálpar

Sendu `Help.Iceland.Get` í gegnum Queue API með `sendContent: {}`, keyrðu verkið og sæktu svarið í Data API. Svarið skal vera Markdown-skjal með öllum íslensku skilaboðategundunum, flokkað eftir sviði, með lýsingu og dæmi fyrir hverja tegund.

## Sviðsmynd 3: Íslenskir frídagar

Sendu `Iceland.Holidays.Get` með `{"year": 2026}` og `Iceland.Holidays.IsHoliday` með `{"date": "2026-12-25"}`. Fyrra svarið skal innihalda frídaga ársins og það síðara `"isHoliday": true`.

## Sviðsmynd 4: Póstnúmeraskrá

Sendu `Iceland.PostCode.Get` með tómum gögnum. Svarið skal innihalda póstnúmer, staðarheiti og sveitarfélag, þar á meðal 101 fyrir Reykjavík.

## Sviðsmynd 5: ISO-gjaldmiðlar

Sendu `Iceland.Currency.Get`. JSON-svarið skal innihalda ISK, EUR, USD og aðra ISO 4217-gjaldmiðla ásamt kóða, heiti og tölukóða.

## Sviðsmynd 6: Gengi Seðlabanka

Sendu `Iceland.CurrencyRates.Get` fyrir eina dagsetningu og tímabil. Niðurstaðan skal innihalda daglegt gengi gjaldmiðla gagnvart ISK.

## Sviðsmynd 7: Samstilling gjaldmiðla við BC

Sendu `Iceland.Currency.Sync` fyrir dagsetningu og staðfestu síðan að Currency Exchange Rates í Business Central hafi verið uppfært.

## Sviðsmynd 8: Vextir og vísitala neysluverðs

Keyrðu `Iceland.InterestRates.Get`, `Iceland.ConsumerPriceIndex.Get` og `Iceland.PenaltyInterest.Get` með `{"latest": true}`. Svarið skal innihalda stýrivexti, VNV og dráttarvexti.

## Sviðsmynd 9: Kennitölusannprófun

Prófaðu `Iceland.Kennitala.Validate` með gildri og ógildri kennitölu. Gild kennitala skal skila tegund og afleiddum fæðingardegi; ógild kennitala skal skila skýrri villulýsingu.

## Sviðsmynd 10: Uppfletting ökutækis

Sendu `Iceland.Vehicle.Get` með `{"plateNumber": "AA001"}`. Svarið skal innihalda upplýsingar um ökutækið eða skýrt „fannst ekki“-svar án óvæntrar villu.

## Sviðsmynd 11: Staðfesting VSK-skýrslu

Stilltu prófunarkenni og RSK-lykilorð. Keyrðu `Iceland.VAT.GetNumbers`, `Iceland.VAT.GetPeriodEntries` og `Iceland.VAT.Validate`. Staðfestu virðisaukaskattsnúmer, tímabilsupplýsingar og sundurliðaða staðfestingu.

## Sviðsmynd 12: Innsending VSK og kvittun

Keyrðu `Iceland.VAT.Submit` með gildu prófunargögnum og sæktu kvittun með `Iceland.VAT.Receipt`. Prófaðu einnig `Iceland.VAT.DeleteInTest` í prófunarumhverfi.

## Sviðsmynd 13: Staðgreiðsla

Notaðu `Iceland.Payroll.GetAllPeriods` og `Iceland.Payroll.Validate` með prófunargögnum. Staðfestu að tímabil og villuboð komi rétt til baka.

## Sviðsmynd 14: Fjármagnstekjuskattur

Notaðu `Iceland.CapitalTax.GetPeriods` og `Iceland.CapitalTax.GetTypes` og staðfestu tímabil, tegundir og undanþágur.

## Sviðsmynd 15: SMS

Sendu skilaboð með `Iceland.SMS.Send` og flettu stöðunni upp með `Iceland.SMS.Status`. Staðfestu að móttökunúmer, texti og afhendingarstaða séu í svarinu.

## Sviðsmynd 16: Lífeyrissjóður og stéttarfélag

Prófaðu `Iceland.PensionFund.Get`, `Iceland.Union.Get` og `Iceland.Collector.Get`. Svörin skulu innihalda gildar upplýsingar um sjóði, félög og innheimtuaðila.

## Sviðsmynd 17: Ógild RSK-skilríki

Settu viljandi inn röng skilríki og keyrðu RSK-aðgerð. Hún skal skila skipulagðri villu án þess að lykilorð eða leyndarmál birtist í Request Log.

## Sviðsmynd 18: Þjónusta óaðgengileg

Láttu ytri þjónustu svara ekki og keyrðu beiðni. Staðfestu að Bifröst skili rekjanlegri villu með stöðluðu sniði.

## Sviðsmynd 19: Lágmarksheimildir

Úthlutaðu aðeins viðeigandi les- eða sviðsheimildum og staðfestu að heimilar aðgerðir virki en aðgerðir utan heimildasets séu hafnaðar.

## Sviðsmynd 20: Engar heimildir

Keyrðu skilaboð án viðeigandi heimilda. Biðlarinn skal fá heimildavillu og engin ytri beiðni skal send.

## Sviðsmynd 21: Fjarlæging viðbótar

Fjarlægðu viðbótina úr prófunarfyrirtækinu og staðfestu að uppsetning og gögn séu meðhöndluð samkvæmt uppfærslu- og fjarlægingarferli.

## Hreinsun

Hreinsaðu prófunarfærslur og prófunarskilríki að lokinni keyrslu.