---
id: sparisjodir
title: "Sparisjóðir"
sidebar_label: "Sparisjóðir"
sidebar_position: 5
description: "Hvað Bifröst Ísland Fjárstýring gerir með sparisjóðunum: yfirlit í bankaafstemmingu, gengi, staðfesting reikninga, bunkar innlendra greiðslna og kröfur."
---

# Sparisjóðir

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við sparisjóð. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með
sparisjóðunum, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

Bifröst tengist þessum sparisjóðum:

| Sparisjóður | Bankanúmer |
|---|---|
| Sparisjóður Austurlands | 1106 |
| Sparisjóður Suður-Þingeyinga | 1110 |
| Sparisjóður Strandamanna | 1161 |
| Sparisjóður Höfðhverfinga | 1187 |

Þeir deila einni línu, **Sparisjóðir**, í uppsetningunni. Bifröst velur sparisjóðinn út frá fyrstu fjórum
tölustöfum reikningsins í hverri beiðni: reikningsins sem yfirlitið er fyrir, reikningsins sem bunki er
greiddur af, eða kröfureikningsins.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Yfirlit í bankaafstemmingu.** Lestu yfirlit reiknings í sparisjóði beint inn í afstemmingu
  bankareiknings, eða lestu yfirlit hvaða reiknings sem er fyrir hvaða tímabil sem er.
- **Gengi.** Gengi sparisjóðsins fyrir dagsetningu.
- **Staðfesting reikninga.** Staðfestu að reikningur sé til áður en þú greiðir inn á hann, og að hann
  tilheyri tiltekinni kennitölu.
- **Bunkar innlendra greiðslna.** Skráðu bunka innlendra greiðslna (ISK) í sparisjóðnum og lestu
  niðurstöðu hvers bunka. Hvort bunki bíður þess að einhver samþykki hann í netbankanum fer eftir
  heimildunum sem sparisjóðurinn veitir vefþjónustunotandanum þínum: fáðu það staðfest hjá sparisjóðnum
  áður en þú skráir raunverulegar greiðslur.
- **Kröfur.** Stofnaðu, breyttu og felldu niður kröfur í bunkum: sparisjóðurinn tekur fyrst við bunkanum
  og tilkynnir svo niðurstöðu hverrar kröfu. Flettu kröfu upp, listaðu kröfur fyrir tímabil og sjáðu
  greiðslur sem hafa borist inn á þær. Sparisjóðurinn þarf að veita vefþjónustunotandanum þínum
  kröfuheimildir fyrir kennitölu kröfuhafans.

Bifröst skráir ekki bunka erlendra greiðslna í sparisjóðunum.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við sparisjóðinn þinn** um vefþjónusturnar sem þú notar, með notandanafni, lykilorði og
   biðlaraskírteini (`.pfx`-skjali með eigin lykilorði).
2. **Línuna Sparisjóðir í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis** og
   **Skrá skírteini**. **Leyndarmál** sýnir **Fullskráð** þegar hvort tveggja er vistað. Hafðu
   **SOAP-undirritari** auðan: sparisjóðirnir undirrita með WSE3. Veldu **WSE2** aðeins ef sparisjóðurinn
   biður um það.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin í sparisjóðnum.** Hver notandi skráir eigið
   notandanafn og lykilorð á síðunni **Uppsetning notanda Bifröst**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Bankaafstemmingu.** Á bankareikningnum í Business Central skaltu setja **Númer bankareiknings** á
   reikninginn í sparisjóðnum og **Innflutningssnið bankayfirlits** á `SPAR-FEED-IN`. Sama sniðið gildir
   fyrir alla fjóra sparisjóðina.
5. **Kröfur.** Krafa í sparisjóði er stofnuð undir kóða kröfusniðmáts frá sparisjóðnum. Skráðu þann kóða
   sem kröfuauðkenni, og síðasta kröfunúmer, á greiðslumáta
   ([Greiðsluhættir](/help/iceland-treasury/payment-methods/)) fyrir hvern innheimtusamning.
   Kröfureikningurinn er reikningur kröfuhafans í sparisjóðnum: bankanúmerið, höfuðbókin `66` og
   kröfunúmerið.
6. **Heimildir.** Úthlutaðu [heimildasamstæðunum](/iceland-treasury/#permissions) fyrir það sem hver
   notandi má gera. Til að skrá greiðslubunka þarf `BIFROST TPay ori`.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið til sparisjóðsins. Tímabilið
  hefst daginn eftir síðasta bókaða yfirlit; í fyrsta sinn er spurt um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfærðar línur og stöður, og varar við ef þær stemma ekki við bankann.
- Greiðslubunkar, kröfur, kröfubunkar og greiðslur krafna birtast á rakningarsíðunum sem opnaðar eru úr
  **Bifröst Ísland Fjárstýring - uppsetning**, með **Sparisjóðir** sem banka; sjá
  [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/). Yfirlit sem sýnir greiðslu merkir hana
  greidda.
- Upplýsingareiturinn **Upplýsingar um viðskiptamannafærslu** sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til sparisjóðsins er skráð á síðunni **Annáll beiðna Bifröst**, með lykilorðin falin.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Yfirlit yfir Bifröst Ísland Fjárstýringu](/iceland-treasury/)
