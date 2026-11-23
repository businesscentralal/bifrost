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
   **SOAP-undirritari** auðan nema sparisjóðurinn biðji þig um að nota WSE2 eða WSE3. Auður reitur notar
   WSE3. Aðeins er hægt að breyta reitnum fyrir Íslandsbanka, Kviku banka og sparisjóðina; á öðrum
   línum er hann aðeins til lestrar.
