---
id: vend-vat-gl-map
title: "VSK fjárhagsreikn.vörpun lánardrottins"
sidebar_label: "VSK fjárhagsreikn.vörpun lánardrottins"
sidebar_position: 4
---

**VSK fjárhagsreikn.vörpun lánardrottins** ræður á hvaða fjárhagsreikning lína í mótteknum rafrænum
reikningi bókast, eftir lánardrottni og VSK-prósentu, svo hver lína lendi á reikningi með réttum VSK.

Þegar móttekið skjal verður að innkaupareikningi eða færslubókarlínum fær hver lína sem er ekki vara
fjárhagsreikning sinn fyrst hér: færsluna fyrir lánardrottininn og VSK-prósentu línunnar, eða annars
færslu lánardrottinsins fyrir 0 %. Aðeins þegar lánardrottinn hefur enga samsvarandi færslu ræður
**Vörpun texta á reikning** í Business Central.

Opnaðu síðuna með aðgerðinni **VSK fjárhagsreikn.vörpun** á [Uppsetning skjalaskipta](/help/iceland-docex/docex-setup/),
eða af lánardrottnaspjaldinu, lánardrottnalistanum og skjölum á innleið, þar sem hún opnast síuð á
lánardrottininn.

## Reitir {#fields}

| Reitur | Lýsing |
| --- | --- |
| **Nr. lánardrottins** | Lánardrottinninn sem færslan á við um. |
| **Nr. fjárhagsreiknings** | Fjárhagsreikningurinn fyrir línur með þessari VSK-prósentu. Reikningurinn þarf að hafa **Almenna bókunartegund** Innkaup og **Beina bókun** á, og má ekki vera lokaður. |
| **VSK %** | Ekki hægt að breyta. Reiknað út frá **VSK viðsk.bókunarflokki** lánardrottins og **VSK vörubókunarflokki** fjárhagsreikningsins. |
| **Lýsing** | Valfrjáls lýsing. |

## Ábendingar {#tips}

- VSK-prósentan fylgir reikningnum sem þú velur, svo bættu við einni færslu á hvern reikning: annar
  fjárhagsreikningur gefur aðra VSK-prósentu.
- Ef lánardrottinn sendir línur með mismunandi VSK-prósentum bætir þú við færslu fyrir reikning með hverja
  prósentu.
- Fyrir lánardrottna án færslna hér varpar þú línum eftir texta þeirra með **Vörpun texta á reikning** í
  Business Central. Veldu reikning þar sem VSK stemmir við VSK-prósentu línunnar, annars hafnar Business
  Central skjalinu.
- Hvort skjöl lánardrottins verða að innkaupareikningi eða færslubókarlínum er stillt í **Bókunaraðferð
  skjala á innleið** á lánardrottnaspjaldinu.

![Flipinn Reikningsfærsla á lánardrottnaspjaldi, þar sem Bókunaraðferð skjala á innleið er Innkaupaskjal](/img/iceland-docex/is-is/vendor-posting-mode.png)
