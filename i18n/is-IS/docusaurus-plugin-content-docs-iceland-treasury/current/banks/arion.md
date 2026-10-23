---
id: arion
title: "Arion banki"
sidebar_label: "Arion banki"
sidebar_position: 1
description: "Hvað Bifröst Ísland Fjárstýring gerir með Arion banka: yfirlit og kreditkortafærslur í bankaafstemmingu, reikningar, greiðsluseðlar, kreditkort, bunkar innlendra og erlendra greiðslna, kröfur, gjaldeyrisreikningar og gengi."
---

# Arion banki

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Arion banka. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með Arion
banka, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Yfirlit í bankaafstemmingu.** Lestu yfirlit reiknings í Arion banka beint inn í afstemmingu
  bankareiknings, eða lestu yfirlit hvaða reiknings sem er fyrir hvaða tímabil sem er.
  Kreditkortafærslur eru lesnar inn á sama hátt.
- **Reikningar.** Listaðu reikningana sem bankanotandinn þinn má sjá, flettu einum upp, listaðu
  reikninga í eigu kennitölu og staðfestu að kennitala eigi reikning áður en þú greiðir inn á hann.
- **Greiðsluseðlar og kreditkort.** Sjáðu greiðsluseðla sem stílaðir eru á fyrirtækið og upplýsingar
  þeirra, kreditkortin þín og kortafærslur eftir tímabili eða gjalddagamánuði.
- **Greiðslubunkar.** Skráðu bunka innlendra greiðslna (ISK) til samþykktar í bankanum og lestu
  niðurstöðu hverrar greiðslu.
- **Erlendar greiðslur.** Skráðu bunka erlendra greiðslna til samþykktar í bankanum, með tölulykli
  Seðlabankans fyrir hverja greiðslu, sjáðu bunkana þína og greiðslur þeirra, og sæktu kvittanirnar.
- **Gjaldeyrisreikningar.** Sjáðu gjaldeyrisreikningana þína með færslum þeirra og yfirlitum.
- **Kröfur.** Stofnaðu, breyttu og felldu niður kröfur í bunkum: bankinn tekur fyrst við bunkanum og
  tilkynnir svo niðurstöðu hverrar kröfu. Finndu kröfur, fylgdu kröfu í gegnum sögu hennar og sjáðu
  greiðslur sem hafa borist inn á þær.
- **Gengi.** Kaup- og sölugengi Arion banka fyrir dagsetningu.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við Arion banka** um vefþjónusturnar sem þú notar, með notandanafni, lykilorði og
   biðlaraskírteini (`.pfx`-skjali með eigin lykilorði).
2. **Línu Arion banka í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og
   **Skrá skírteini**. **Leyndarmál** sýnir **Fullskráð** þegar hvort tveggja er vistað.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin í bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð í **Bifröst notandauppsetningu**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Bankaafstemmingu.** Á bankareikningnum í Business Central skaltu setja reikningsnúmerið í Arion
   banka sem númer bankareiknings og innflutningssniðið `ARION-FEED-IN`. Fyrir kreditkort notarðu
   bankareikning þar sem númer bankareiknings er auðkenni kortsins og sniðið `ARION-CARD-FEED-IN`.
5. **Kröfur.** Skráðu kröfuauðkennið úr innheimtusamningnum og síðasta kröfunúmer á
   [greiðslumáta](/help/iceland-treasury/payment-methods/) fyrir hvern innheimtusamning.
6. **Heimildir.** Úthlutaðu [heimildasöfnunum](/iceland-treasury/#permissions) fyrir það sem hver notandi
   má gera.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- Innflutningur bankayfirlits í afstemmingu bankareiknings sækir yfirlitið til Arion banka. Tímabilið
  hefst daginn eftir síðasta bókaða yfirlit; í fyrsta sinn er spurt um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Samantekt innfærslu yfirlits](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfærðar línur og stöður, og varar við ef þær stemma ekki við bankann.
- Greiðslubunkar, kröfur, kröfubunkar og greiðslur krafna birtast á rakningarsíðunum sem opnaðar eru úr
  **Bifröst Ísland Fjárstýring - uppsetning**; sjá [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
- Upplýsingareitur viðskiptamannafærslu sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til bankans er skráð í **Annál beiðna Bifröst**, með lykilorð falin.

## Að færa þig frá eldra Arion forriti Origo {#moving-from-origos-earlier-arion-banki-app}

Settu Bifröst Ísland Fjárstýringu upp við hlið eldra forritsins. Við uppsetningu tekur hún yfir gögn
Arion banka: kröfur, bunka, kröfureitina á greiðslumátum, stillingar Arion banka og heimildaúthlutanir
notenda, sem færast yfir á samsvarandi heimildasöfn þessa forrits. Síðan geturðu fjarlægt eldra
forritið. Gögnum sem þegar eru í Bifröst Ísland Fjárstýringu er aldrei skrifað yfir.

Lykilorð og skírteini flytjast ekki. Skráðu þau einu sinni eftir skiptin.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Yfirlit Ísland Fjárstýringar](/iceland-treasury/)
