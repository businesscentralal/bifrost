---
id: landsbankinn
title: "Landsbankinn"
sidebar_label: "Landsbankinn"
sidebar_position: 4
description: "Hvað Bifröst Ísland Fjárstýring gerir með Landsbankanum: yfirlit og kortafærslur í bankaafstemmingu, reikningar, bunkar innlendra og erlendra greiðslna, kröfur og kröfusniðmát, fyrirtækjakort, eignasöfn, rafræn skjöl, færsluhirðing og gengi."
---

# Landsbankinn

Þessi síða er fyrir fjármálasviðið og kerfisstjóra Business Central hjá fyrirtæki sem er í viðskiptum
við Landsbankann. Hún útskýrir hvað [Bifröst Ísland Fjárstýring](/iceland-treasury/) gerir með
Landsbankanum, hvað þú setur upp og hvað þú sérð í Business Central á eftir.

## Hvað það gerir fyrir þig {#what-it-does-for-you}

- **Yfirlit og kortafærslur í bankaafstemmingu.** Lestu yfirlit reiknings í Landsbankanum, eða færslur
  fyrirtækjakorts, beint inn í afstemmingu bankareiknings.
- **Reikningar.** Listaðu reikningana þína, skoðaðu upplýsingar og færslur reiknings, lestu
  dagslokastöðu og staðfestu reikning áður en þú greiðir inn á hann.
- **Greiðslubunkar.** Skráðu bunka innlendra greiðslna (ISK) til samþykktar í bankanum og lestu
  niðurstöðu þeirra, og flettu upp ógreiddum reikningum og greiðsluseðlum sem stílaðir eru á fyrirtækið.
- **Erlendar greiðslur.** Skráðu bunka erlendra greiðslna til samþykktar í bankanum, með þriggja stafa
  flokkunarlykli Seðlabankans fyrir hverja greiðslu, og fylgstu með stöðu þeirra.
- **Kröfur.** Stofnaðu kröfu undir einu af kröfusniðmátum þínum, lestu, breyttu og eyddu kröfum,
  listaðu þær eftir eindaga, og sjáðu greiðslur sem hafa borist, fyrir fyrirtækið eða eina kröfu.
  Kröfubunkar senda margar kröfuaðgerðir í einu og tilkynna niðurstöðuna síðar.
- **Kröfusniðmát.** Haltu utan um sniðmátin sem kröfur eru stofnaðar undir, sjáðu aðganga kröfuhafans
  og athugaðu hvað kröfuhafinn á eftir að samþykkja í bankanum áður en hægt er að stofna kröfur.
- **Fyrirtækjakort.** Kortin þín, færslur þeirra og kvittanir, og bókhaldslyklar, flokkar og
  undirflokkar korta, þar á meðal að setja bókhaldslykil og athugasemd á færslu.
- **Eignasöfn.** Eignasöfn, eignir, ávöxtun og eignafærslur eins og viðskipti og arðgreiðslur.
- **Rafræn skjöl.** Hladdu upp skjölum einu í einu eða í bunka, listaðu og sæktu skjöl sem þú hefur
  fengið, og tengdu skjöl saman.
- **Færsluhirðing.** Uppgjör og færslurnar á bak við þau, ef þú tekur við kortagreiðslum í gegnum
  Landsbankann.
- **Gengi og vextir.** Gengi, innláns- og útlánsvextir, gjaldskrá og upplýsingar um sjóði.

## Hvað þú setur upp {#what-you-set-up}

1. **Samning við Landsbankann** um vefþjónusturnar sem þú notar, með notandanafni og lykilorði,
   biðlaraskírteini (`.pfx`-skjali með eigin lykilorði) og API-lykli.
2. **Línu Landsbankans í [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)**:
   hafðu hana virka, skráðu notandanafn fyrirtækisins og notaðu svo **Skrá lykilorð fyrirtækis**, **Skrá
   skírteini** og **Skrá API-lykil**. **Leyndarmál** sýnir **Fullskráð** þegar allt er vistað.
3. **Eigin innskráningu, ef notendur þínir hafa sína eigin í bankanum.** Hver notandi skráir eigið
   notandanafn, lykilorð og API-lykil á síðunni **Uppsetning notanda Bifröst**; sjá
   [Bankaaðgangur notanda](/help/iceland-treasury/bank-user-setup/).
4. **Bankaafstemmingu.** Á bankareikningnum í Business Central skaltu setja **Númer bankareiknings** á
   reikninginn í Landsbankanum og **Innflutningssnið bankayfirlits** á `LBI-FEED-IN`. Fyrir
   fyrirtækjakort notarðu bankareikning þar sem **Númer bankareiknings** er auðkenni kortsins og sniðið
   `LBI-CARD-IN`.
5. **Kröfur.** Kröfuhafinn þarf að hafa samþykkt kröfuskilmála Landsbankans í netbankanum. Stofnaðu
   kröfusniðmát þar eða í gegnum Bifröst, og skráðu kröfuauðkennið og síðasta kröfunúmer á
   greiðslumáta ([Greiðsluhættir](/help/iceland-treasury/payment-methods/)) fyrir hvern innheimtusamning. Kennitala
   kröfuhafans er lesin af síðunni **Stofngögn**.
6. **Heimildir.** Úthlutaðu [heimildasamstæðunum](/iceland-treasury/#permissions) fyrir það sem hver
   notandi má gera.

## Hvað þú sérð í Business Central {#what-you-see-in-business-central}

- **Flytja inn bankayfirlit** í afstemmingu bankareiknings sækir yfirlitið eða kortafærslurnar.
  Tímabilið hefst daginn eftir síðasta bókaða yfirlit; í fyrsta sinn er spurt um
  [upphafsdagsetningu](/help/iceland-treasury/date-input-dialog/).
  [Innfærsla yfirlits — samantekt](/help/iceland-treasury/statement-import-summary/) sýnir síðan
  innfærðar línur og stöður, og varar við ef þær stemma ekki við bankann.
- Greiðslubunkar, kröfur og greiðslur krafna birtast á rakningarsíðunum sem opnaðar eru úr **Bifröst
  Ísland Fjárstýring - uppsetning**; sjá [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/).
- Upplýsingareiturinn **Upplýsingar um viðskiptamannafærslu** sýnir kröfuna sem innheimtir færsluna.
- Hvert kall til bankans er skráð á síðunni **Annáll beiðna Bifröst**, með lykilorð og lykla falin.

## Flutningur úr eldra forriti Origo fyrir Landsbankann {#moving-from-origos-earlier-landsbankinn-app}

Settu Bifröst Ísland Fjárstýringu upp við hlið eldra forritsins. Við uppsetningu tekur hún yfir gögn
Landsbankans: kröfur og greiðslur krafna, kröfu- og greiðslubunka, kröfureitina á greiðslumátum,
Landsbankastillingar notenda og heimildaúthlutanir þeirra, sem færast yfir á samsvarandi
heimildasamstæður þessa forrits. Síðan geturðu fjarlægt eldra forritið. Gögnum sem þegar eru í Bifröst Ísland Fjárstýringu
er aldrei skrifað yfir.

Lykilorð, skírteini og API-lyklar flytjast ekki. Skráðu þau einu sinni eftir skiptin.

## Næstu skref {#next-steps}

- [Bifröst Ísland Fjárstýring - uppsetning](/help/iceland-treasury/treasury-setup/)
- [Greiðslur og kröfur](/iceland-treasury/payments-and-claims/)
- [Yfirlit yfir Bifröst Ísland Fjárstýringu](/iceland-treasury/)
