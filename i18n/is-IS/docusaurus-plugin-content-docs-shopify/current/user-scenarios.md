---
id: user-scenarios
title: "Shopify notkunardæmi"
sidebar_label: "Notkunardæmi"
sidebar_position: 5
description: "Sæktu Shopify verslun, stofnaðu söluskjalið og kreditnótuna og sendu verð, birgðir og sendingar."
---

# Shopify notkunardæmi

Þessi dæmi hjálpa kerfisstjóra, eða notanda í sölu og birgðum, að vinna með eina tengda Shopify verslun úr aðstoð eða samþættingu og fara yfir niðurstöðuna í Business Central. Ljúktu fyrst [forsendunum](./index.md#before-you-start). Dæmin lýsa niðurstöðunni sem beðið er um; aðstoðin les aðgerðirnar sem eru í boði í uppsettu umhverfinu.

## Sækja pantanir {#bring-orders-in}

1. Virkjaðu verslunina og staðfestu að hún sé tengd við Shopify. Í þessu dæmi skaltu setja **Return and Refund Process** á annað gildi en **Auto Create Credit Memo**.
2. Biddu aðstoðina að sækja nýjar og breyttar pantanir fyrir verslunina.
3. Opnaðu innfluttu pantanirnar í Business Central og veldu eina sem hefur ekkert söluskjal.
4. Biddu aðstoðina að stofna söluskjalið fyrir pöntunina.
5. Opnaðu sölupöntunina eða reikninginn og athugaðu viðskiptavin, línur og upphæðir. Bókaðu ekki fyrr en yfirferðinni er lokið.

**Niðurstaða:** pöntunin hefur sölupöntun eða reikning. Svarið nefnir tegund skjalsins og stöðuna Open, Released, Pending Approval eða Pending Prepayment, með þeim orðum á öllum tungumálum. Ef beðið er aftur um sömu pöntun segir svarið að söluskjalið sé þegar til. Seinni innflutningur afritar ekki pantanir sem hafa ekki breyst. Ef innflutningur stöðvast á miðri leið standa pantanir sem þegar voru vistaðar; farðu yfir þær áður en þú sækir aftur.

## Þegar verslunin stofnar kreditnótur sjálfkrafa {#credit-memos-automatic}

1. Settu **Return and Refund Process** á versluninni á **Auto Create Credit Memo**.
2. Biddu aðstoðina að stofna söluskjalið fyrir innflutta pöntun sem hefur ekkert söluskjal.

**Niðurstaða:** beiðninni er hafnað áður en nokkru er breytt, því sú keyrsla myndi einnig stofna kreditnótur fyrir endurgreiðslur sem ekki var beðið um. Ekkert söluskjal er stofnað. Stofnaðu kreditnótu endurgreiðslu sem sér beiðni, eins og lýst er hér fyrir neðan, eða notaðu stillingu verslunar sem stofnar ekki þessar kreditnótur inni í keyrslu söluskjalsins.

## Vörur, vöruskrá og verð {#products-items-prices}

1. Stilltu vörusamstillingu verslunarinnar eins og fyrirtækið vinnur. Verslun án áttar í vörusamstillingu færir engar vörur.
2. Biddu aðstoðina að samstilla vörur verslunarinnar. Farðu yfir nýjar og breyttar vörur og vörutenginguna í Business Central.
3. Fyrir eina vöru þar sem afbrigðin eru ekki vörur enn skaltu biðja aðstoðina að stofna vörurnar. Þetta hringir ekki í Shopify. Staðfestu að vörusniðmátið sem tengillinn þarf sé til.
4. Breyttu verði í Business Central og biddu aðstoðina að senda verð verslunarinnar. Farðu yfir verð afbrigðanna í Shopify.

**Niðurstaða:** vörur fylgja átt verslunarinnar. Afbrigði sem þegar er tengt, eða vara sem þegar er til fyrir vörunúmerið, er ekki stofnað aftur. Önnur verðsending með óbreyttum verðum sendir ekkert. Ef verðsending mistekst eru afbrigðin sett til baka og hægt er að senda aftur. Ef vörusamstilling stöðvast á miðri leið standa vörur sem þegar voru vistaðar.

## Viðskiptavinir {#customers}

1. Staðfestu stillingar verslunarinnar fyrir innflutning viðskiptavina frá Shopify og fyrir uppfærslu Shopify viðskiptavina úr Business Central.
2. Biddu aðstoðina að samstilla viðskiptavini verslunarinnar.
3. Farðu yfir tengda viðskiptavini í Business Central og uppfærða viðskiptavini í Shopify þegar verslunin má uppfæra þá.

**Niðurstaða:** viðskiptavinir sem þegar eru tengdir eru paraðir, ekki stofnaðir aftur. Hvað færist ræðst af stillingum verslunarinnar. Viðskiptavinur er sagður stofnaður eða uppfærður þegar sú breyting var vistuð.

## Senda pöntun og birgðir {#ship-and-stock}

1. Bókaðu sölusendingu fyrir Shopify pöntun sem hefur ekki verið afhent.
2. Biddu aðstoðina að senda bókunina til Shopify sem afhendingu. Farðu yfir afhendinguna í Shopify.
3. Biddu aðstoðina að senda birgðir verslunarinnar. Hægt er að senda birgðir án þess að flytja vörur inn fyrst og takmarka sendinguna við eitt afbrigði.
4. Farðu yfir birgðastöðuna í Shopify.

**Niðurstaða:** sendingin hefur afhendingu. Seinni beiðni fyrir sömu sendingu er hafnað. Afhendingu sem Shopify hefur samþykkt er ekki snúið til baka úr Business Central. Ef sendingin mistekst áður en Shopify samþykkir hana skaltu reyna sendinguna aftur. Birgðastaða er sú sem Business Central sendi og sama sending aftur lætur Shopify óbreytt. Ef birgðasending stöðvast á miðri leið skaltu fara yfir hvaða afbrigði voru uppfærð áður en þú keyrir aftur.

## Kreditnóta endurgreiðslu {#refund-credit-memo}

1. Settu **Return and Refund Process** á versluninni á **Auto Create Credit Memo**.
2. Notaðu endurgreiðslu sem þegar er innflutt og hefur ekki verið afgreidd.
3. Biddu aðstoðina að stofna kreditnótuna fyrir endurgreiðsluna.
4. Opnaðu kreditnótuna í Business Central og athugaðu viðskiptavin, línur og upphæðir áður en þú bókar.

**Niðurstaða:** kreditnóta úr ferli verslunarinnar fyrir endurgreiðslu. Stofnunin bókar hana ekki. Seinni beiðni segir að endurgreiðslan hafi þegar verið afgreidd. Ef verslunin er ekki stillt á að stofna kreditnótuna sjálfkrafa er beiðninni hafnað og ekkert er stofnað.

## Beiðni sem getur ekki keyrt {#request-that-cannot-run}

1. Biddu aðstoðina að sækja pantanir fyrir verslunarkóða sem er ekki til, eða fyrir verslun sem er ekki virk.
2. Biddu hana að stofna vörur þegar vörusniðmátið sem tengillinn þarf vantar.

**Niðurstaða:** beiðninni er hafnað og svarið segir hvað er að. Hún breytir ekki færslum sem tengillinn hafði ekki þegar vistað. Lagfærðu orsökina og keyrðu aftur.

