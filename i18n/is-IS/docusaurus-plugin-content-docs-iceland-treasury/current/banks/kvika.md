---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 3
description: "Hvað Bifröst Ísland Fjárstýring gerir með Kviku banka: yfirlit í bankaafstemmingu, gengi, bunkar innlendra greiðslna og kröfur."
---

# Kvika banki

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Kviku banka. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með Kviku
banka, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Yfirlit í bankaafstemmingu.** Lestu yfirlit reiknings í Kviku banka beint inn í afstemmingu
  bankareiknings, eða lestu yfirlit hvaða reiknings sem er fyrir hvaða tímabil sem er.
- **Gengi.** Gengi bankans fyrir dagsetningu.
- **Bunkar innlendra greiðslna.** Skráðu bunka innlendra greiðslna (ISK) í Kviku banka og lestu
  niðurstöðu hvers bunka. Hvort bunki bíður þess að einhver samþykki hann í netbankanum fer eftir
  heimildunum sem Kvika banki veitir vefþjónustunotandanum þínum: fáðu það staðfest hjá bankanum áður en
  þú skráir raunverulegar greiðslur.
- **Kröfur.** Stofnaðu, breyttu og felldu niður kröfur í bunkum: bankinn tekur fyrst við bunkanum og
  tilkynnir svo niðurstöðu hverrar kröfu. Flettu kröfu upp, listaðu kröfur fyrir tímabil og sjáðu
  greiðslur sem hafa borist inn á þær. Kvika banki þarf að veita vefþjónustunotandanum þínum
  kröfuheimildir fyrir kennitölu kröfuhafans.

Bifröst skráir ekki bunka erlendra greiðslna í Kviku banka.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við Kviku banka** um vefþjónusturnar sem þú notar, með notandanafni, lykilorði og
   biðlaraskírteini (`.pfx`-skjali með eigin lykilorði).
2. **Línu Kviku banka í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og
   **Skrá skírteini**. **Leyndarmál** sýnir **Fullskráð** þegar hvort tveggja er vistað. Hafðu
   **SOAP-undirritari** auðan nema bankinn biðji um annað snið.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin í bankanum.** Hver notandi skráir eigið
   notandanafn og lykilorð á síðunni **Uppsetning notanda Bifröst**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Bankaafstemmingu.** Á bankareikningnum í Business Central skaltu setja **Númer bankareiknings** á
   reikninginn í Kviku banka og **Innflutningssnið bankayfirlits** á `KVIKA-FEED-IN`.
5. **Kröfur.** Krafa í Kviku banka er stofnuð undir kóða kröfusniðmáts frá bankanum. Skráðu þann kóða sem
   kröfuauðkenni, og síðasta kröfunúmer, á greiðslumáta ([Greiðsluhættir](/help/iceland-treasury/payment-methods/))
   fyrir hvern innheimtusamning.
6. **Heimildir.** Úthlutaðu [heimildasamstæðunum](/iceland-treasury/#permissions) fyrir það sem hver
   notandi má gera. Til að skrá greiðslubunka þarf `BIFROST TPay ori`.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið til Kviku banka. Tímabilið
  hefst daginn eftir síðasta bókaða yfirlit; í fyrsta sinn er spurt um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfærðar línur og stöður, og varar við ef þær stemma ekki við bankann.
- Greiðslubunkar, kröfur, kröfubunkar og greiðslur krafna birtast á rakningarsíðunum sem opnaðar eru úr
  **Bifröst Ísland Fjárstýring - uppsetning**; sjá [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
  Yfirlit sem sýnir greiðslu merkir hana greidda.
- Upplýsingareiturinn **Upplýsingar um viðskiptamannafærslu** sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til bankans er skráð á síðunni **Annáll beiðna Bifröst**, með lykilorðin falin.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Yfirlit yfir Bifröst Ísland Fjárstýringu](/iceland-treasury/)
