---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 2
description: "Hvað Bifröst Ísland Fjárstýring gerir með Íslandsbanka: yfirlit í bankaafstemmingu, gengi, staðfesting reikninga, ógreiddir reikningar, bunkar innlendra og erlendra greiðslna og kröfur."
---

# Íslandsbanki

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Íslandsbanka. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með
Íslandsbanka, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Yfirlit í bankaafstemmingu.** Lestu yfirlit reiknings í Íslandsbanka beint inn í afstemmingu
  bankareiknings, eða lestu yfirlit hvaða reiknings sem er fyrir hvaða tímabil sem er.
- **Gengi.** Gengi bankans fyrir dagsetningu.
- **Athugun reikninga.** Staðfestu að reikningur sé til áður en þú greiðir inn á hann, og listaðu
  ógreidda reikninga sem stílaðir eru á kennitölu.
- **Innlendar greiðslur.** Skráðu bunka innlendra greiðslna (ISK), millifærslur og greiðslur krafna, í
  greiðsluþjónustu Íslandsbanka sjálfs. Starfsmaður fyrirtækisins samþykkir og greiðir bunkann í
  netbankanum. Fram að því geturðu villuprófað bunkann í bankanum og lesið niðurstöðu hans. Bankinn tekur
  samtölu bunkans af úttektarreikningnum í einni úttekt.
- **Erlendar greiðslur.** Skráðu bunka erlendra greiðslna til samþykktar í bankanum, með tölulykli
  Seðlabankans fyrir hverja greiðslu, fáðu tilboð bankans í bunka (gengi og kostnað) og fylgstu með stöðu
  hans. Bunki hefur einn greiðanda, fyrirtækið nema bunkinn tilgreini annan.
- **Kröfur.** Stofnaðu, breyttu og felldu niður kröfur í bunkum: bankinn tekur fyrst við bunkanum og
  tilkynnir svo niðurstöðu hverrar kröfu. Flettu kröfu upp, listaðu kröfur fyrir tímabil, sjáðu
  greiðslur sem hafa borist inn á þær og endurvektu niðurfellda kröfu.

Bifröst hvorki samþykkir né greiðir bunka. Heiti bunka má vera í mesta lagi 20 stafir og tilvísun
millifærslu í mesta lagi 7: það eru mörk bankans, og farið er yfir þau áður en kallað er á bankann. Eftir
að bunki hefur verið samþykktur leyfir bankinn vefþjónustunotandanum ekki lengur að lesa hann, svo staða
hans í Business Central verður **Óþekkt**. Yfirlit úttektarreikningsins sýnir þá hvenær greiðslurnar eru
greiddar.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við Íslandsbanka** um vefþjónusturnar sem þú notar, með notandanafni, lykilorði og
   biðlaraskírteini (`.pfx`-skjali með eigin lykilorði).
2. **Línu Íslandsbanka í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og
   **Skrá skírteini**. **Leyndarmál** sýnir **Fullskráð** þegar hvort tveggja er vistað.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin í bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð á síðunni **Uppsetning notanda Bifröst**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Bankaafstemmingu.** Á bankareikningnum í Business Central skaltu setja **Númer bankareiknings** á
   reikninginn í Íslandsbanka og **Innflutningssnið bankayfirlits** á `ISB-FEED-IN`.
5. **Kröfur.** Krafa í Íslandsbanka er stofnuð undir kóða kröfusniðmáts úr netbanka bankans. Skráðu þann
   kóða sem kröfuauðkenni, og síðasta kröfunúmer, á greiðslumáta ([Greiðsluhættir](/help/iceland-treasury/payment-methods/))
   fyrir hvern innheimtusamning. Kröfureikningurinn er útibú sniðmátsins, höfuðbókin `66` og
   kröfunúmerið.
6. **Heimildir.** Úthlutaðu [heimildasamstæðunum](/iceland-treasury/#permissions) fyrir það sem hver
   notandi má gera.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið til Íslandsbanka. Tímabilið
  hefst daginn eftir síðasta bókaða yfirlit; í fyrsta sinn er spurt um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfærðar línur og stöður, og varar við ef þær stemma ekki við bankann.
- Bunkar innlendra og erlendra greiðslna, kröfur, kröfubunkar og greiðslur krafna birtast á rakningarsíðunum sem
  opnaðar eru úr **Bifröst Ísland Fjárstýring - uppsetning**; sjá
  [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
- Upplýsingareiturinn **Upplýsingar um viðskiptamannafærslu** sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til bankans er skráð á síðunni **Annáll beiðna Bifröst**, með lykilorðin falin.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Yfirlit yfir Bifröst Ísland Fjárstýringu](/iceland-treasury/)
