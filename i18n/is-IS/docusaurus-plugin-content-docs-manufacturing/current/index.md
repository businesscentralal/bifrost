---
id: index
title: "Bifröst framleiðsla"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Framleiðslupantanir, framleiðsluefnislistar, vinnsluleiðir, framleiðslubók og leiðréttingar í Business Central úr aðstoð eða samþættingu."
---

# Bifröst framleiðsla

**Stýrðu framleiðslunni í Business Central án þess að smella þig í gegnum hverja pöntun.** Bifröst
framleiðsla gerir samþættingu, tímasettri keyrslu eða aðstoð kleift að vinna verkin sem liggja á bak við
aðgerðir framleiðslusíðna Microsoft: stofna og endurnýja framleiðslupantanir, votta framleiðsluefnislista
og vinnsluleiðir, bóka afköst og notkun, ljúka pöntunum og leiðrétta það sem var bókað.

Hún keyrir eigin framleiðslurökfræði Business Central. Niðurstöðurnar birtast á stöðluðum síðum, til
dæmis **Framleiðslupantanir**, **Framleiðsluefnislistar** og **Vinnsluleiðir**, svo þú yfirfer þær þar sem þú
gerir alltaf.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Stofnað og endurnýjað framleiðslupantanir.** Stofnaðu pöntun fyrir vöru, eða stofnaðu pantanir út frá
  eftirspurn útgefinnar sölupöntunar, eina fyrir hverja sölulínu eða eina fyrir alla sölupöntunina. Endurnýjaðu
  pöntun til að reikna línur hennar, íhluti og vinnsluleið.
- **Vottað efnislista og vinnsluleiðir.** Færðu útgáfu framleiðsluefnislista eða vinnsluleiðar í stöðuna
  Vottað, Í vinnslu eða Lokað. Svarið útskýrir á þínu tungumáli hvers vegna ekki er hægt að votta útgáfu.
- **Afritað og skipt út.** Afritaðu framleiðsluefnislista eða vinnsluleið í nýja útgáfu og skiptu einum íhlut út
  fyrir annan í framleiðsluefnislistum, með nýjum útgáfum sem eru búnar til fyrir þig.
- **Fundið hvar vara er notuð.** Sjáðu alla framleiðsluefnislista sem nota vöru, með stigum og
  nauðsynlegu magni á tiltekinni dagsetningu.
- **Séð hvað vantar.** Athugaðu framboð íhluta og kostnaðar- og magntölfræði framleiðslupöntunar áður en þú gefur hana út.
- **Fært pöntun milli staða.** Breyttu stöðu, athugaðu hvort hægt er að ljúka pöntun, ljúktu henni eða
  opnaðu lokið pöntun aftur einu sinni.
- **Bókað afköst og notkun.** Skoðaðu framleiðslubókina sem pöntun myndi skila, forskoðaðu bókunina án þess að
  halda neinu eftir og bókaðu hana.
- **Leiðrétt bókun.** Bakfærðu bókaða afkasta- eða notkunarfærslu í heild.

Tímasettu föstu skrefin úr eigin sjálfvirkni og sinntu aðeins undantekningunum.

## Getu

| Svið | Geta |
|---|---|
| **Framleiðsla** | Framleiðslupantanir og stöður þeirra, framleiðsluefnislistar og vinnsluleiðir með útgáfum, hvar vara er notuð, framboð íhluta og tölfræði, framleiðslubókin og leiðréttingar á bókuðum afköstum og notkun |

## Fáðu það

Settu upp **Bifrost Manufacturing** ásamt Bifröst Foundation, úr AppSource eða í gegnum Business Central
samstarfsaðilann þinn. Það krefst Business Central Premium, því framleiðsla er hluti af Premium. Hafðu samband við
Business Central samstarfsaðilann þinn varðandi verð.

## Settu það upp

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp framleiðslu í Business Central eins og þú gerir í dag: vörur með framleiðsluefnislista eða vinnsluleið, vinnu- og vélamiðstöðvar og númeraröð framleiðslupantana. | Kerfisstjóri Business Central |
| 2 | Settu upp **Bifrost Manufacturing** ásamt Bifröst Foundation. | Kerfisstjóri Business Central |
| 3 | Gefðu hverjum notanda eða þjónustu sem kallar á það heimildarsafnið **Bifröst - framleiðsla** (`BIFROST Mfg ori`), ásamt Foundation-heimildum þeirra. Bættu **Bifröst - framleiðslubókun** (`BIFROST MfgPost ori`) aðeins við hjá þeim sem mega breyta stöðu pantana, ljúka þeim eða bóka í færslubækur. | Kerfisstjóri Business Central |

Forritið hefur engar eigin síður: niðurstöðurnar birtast á stöðluðum framleiðslusíðum.

## Gott að vita

- **Það vinnur sem þú.** Heimildarsöfnin leyfa notanda aðeins að keyra aðgerðir þessa forrits. Þau auka ekki
  aðgang að framleiðslugögnum; eigin heimildir notandans gilda áfram.
- **Bókun er sérstök heimild.** Að breyta stöðu pöntunar, ljúka henni, bóka framleiðslubókina og bakfæra bókun
  krefst `BIFROST MfgPost ori` ofan á aðalheimildarsafnið, svo hægt er að veita skipulagningu og bókun ólíku fólki.
- **Allt sem bókar biður fyrst um fjölda.** Aðgerðin segir hversu margar færslur hún myndi hafa áhrif á og gerir
  ekkert fyrr en fjöldinn er staðfestur.
- **Opna aftur má einu sinni.** Lokna pöntun má opna aftur einu sinni, og aðeins þegar engin afköst eða
  verðmatsdagsetning hindra það.
- **Ef skref mistekst** er vinnan dregin til baka og skýr villa kemur til baka, á ensku eða íslensku. Allt
  keyrir innan Business Central; engin ytri þjónusta eða aðgangsupplýsingar koma við sögu.

## Tilvísun

Uppsettar aðgerðir og samningar þeirra eru lesnar úr Business Central sjálfu: MCP-verkfærin `list_domains`,
`describe_domains` og `describe_message_type`, eða síðan **Bifrost Message Types**.

- Heimildarsöfn: **Bifröst - framleiðsla** (`BIFROST Mfg ori`) og **Bifröst - framleiðslubókun** (`BIFROST MfgPost ori`), ofan á Foundation-heimildir notandans.
