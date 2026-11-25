---
id: index
title: "Bifröst Shopify"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Shopify pantanir, vörur, viðskiptavinir, verð, birgðir og sendingar úr aðstoð eða samþættingu."
---

# Bifröst Shopify

**Tengdu Shopify verslun við aðstoðina sem þú notar nú þegar.** Bifröst Shopify lætur aðstoð, tímasett ferli eða samþættingu vinna Shopify verkin sem sitja á versluninni í Business Central: sækja pantanir, vörur og viðskiptavini, stofna söluskjalið og kreditnótuna og senda verð, birgðir og sendingar til baka í Shopify.

Það keyrir rökfræði **Shopify Connector** frá Microsoft. Niðurstöðurnar birtast á síðum tengilsins fyrir verslun, pantanir, vörur og viðskiptavini og á hefðbundnum sölu- og birgðasíðum, svo þú ferð yfir þær þar sem þú ert vanur.

*Viðbótarforrit ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á [Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert {#what-you-can-do}

- **Sækja pantanir.** Sækja nýjar og breyttar pantanir fyrir eina virka verslun. Seinni keyrsla sækir aðeins það sem breyttist.
- **Stofna söluskjalið.** Stofna sölupöntun eða reikning fyrir eina innflutta pöntun. Svarið nefnir tegund skjalsins og stöðu þess: Open, Released, Pending Approval eða Pending Prepayment, með sömu orðum á öllum tungumálum.
- **Stofna kreditnótu endurgreiðslu.** Stofna kreditnótu einnar innfluttrar endurgreiðslu eftir ferli verslunarinnar.
- **Halda vörum samstilltum.** Flytja inn vörur frá Shopify og flytja út breyttar vörur eins og verslunin er sett upp. Stofna og tengja vörur fyrir afbrigði vöru sem er þegar í Business Central. Senda verð þegar aðeins verðið á að færast.
- **Halda viðskiptavinum samstilltum.** Flytja inn Shopify viðskiptavini og uppfæra Shopify viðskiptavini úr Business Central eftir stillingum verslunarinnar.
- **Segja Shopify hvað var sent.** Senda eina bókun sölusendingar fyrir Shopify pöntun til Shopify sem afhendingu.
- **Senda birgðir.** Senda birgðastöðu hvers birgðastaðar fyrir eina virka verslun. Hægt er að senda birgðir án þess að flytja vörur inn fyrst og takmarka sendinguna við eitt afbrigði.

## Geta {#capabilities}

| Svið | Geta |
|---|---|
| **Sala** | Pantanir inn í Business Central, sölupöntun eða reikningur, innflutningur og uppfærsla viðskiptavina, kreditnóta endurgreiðslu og afhending bókunar sölusendingar |
| **Birgðir** | Innflutningur og útflutningur vara, vörur fyrir afbrigði, verð send til Shopify og birgðastaða á hvern birgðastað |

## Áður en þú byrjar {#before-you-start}

1. Fylgdu [Settu það upp](/setup/) til að undirbúa Bifröst Foundation og tengja aðstoðina eða samþættinguna.
2. Settu upp **Shopify Connector** frá Microsoft. Stofnaðu verslunina, virkjaðu hana og tengdu hana við Shopify. Stilltu vörusamstillingu, innflutning viðskiptavina og ferli skila og endurgreiðslna eins og fyrirtækið vinnur.
3. Settu upp **Bifrost Shopify** við hlið Bifröst Foundation.
4. Gefðu hverjum þeim sem má breyta Shopify gögnum heimildasamstæðuna **Bifröst Shopify allur aðgangur** (`SHOPIFY Full ori`), auk Foundation heimilda og Microsoft Shopify heimilda fyrir skjölin sem viðkomandi snertir. Notaðu **Bifröst Shopify lestur** (`SHOPIFY Read ori`) þegar ekki má breyta gögnum.

Forritið hefur engar eigin síður. Farðu yfir verslun, pantanir, vörur og viðskiptavini á síðum Shopify Connector og söluskjöl, kreditnótur og sendingar á hefðbundnum síðum Business Central. Hjálp í Business Central opnar þetta yfirlit.

## Gott að vita {#good-to-know}

- **Það vinnur sem þú.** Þessar heimildasamstæður koma ekki í stað Microsoft Shopify heimilda. Eigin heimildir notandans gilda áfram og hvert kall er skráð í Business Central fyrirtækisins.
- **Verslun sem stofnar kreditnótur sjálfkrafa getur ekki stofnað söluskjalið á þennan hátt.** Þegar **Return and Refund Process** á versluninni er **Auto Create Credit Memo** er stofnun söluskjalsins hafnað áður en nokkru er breytt, því sú keyrsla myndi einnig stofna kreditnótur fyrir endurgreiðslur sem ekki var beðið um. Stofnaðu kreditnótu hverrar endurgreiðslu sér eða notaðu verslun þar sem skilferlið stofnar ekki þessar kreditnótur inni í keyrslu söluskjalsins.
- **Sumar keyrslur halda því sem þegar var vistað.** Innflutningur pantana, vörusamstilling og sending birgða geta skilið eftir færslur sem voru vistaðar áður en seinni villa kom. Farðu yfir það sem kom og keyrðu aftur fyrir það sem enn vantar. Sending verðs er öðruvísi: misheppnuð sending setur afbrigði verslunarinnar til baka, svo næsta sending geti reynt aftur.
- **Afhending er skrif í Shopify.** Sendingu sem þegar hefur afhendingu er hafnað. Ef sendingin mistekst áður en Shopify samþykkir hana má reyna aftur. Afhending sem Shopify hefur samþykkt stendur.
- **Vörur eru stofnaðar úr gögnum sem þegar eru í Business Central.** Stofnun vara hringir ekki í Shopify og flytur vöruna ekki inn. Afbrigði sem þegar er tengt, eða vara sem þegar er til fyrir vörunúmerið, er tengt í stað þess að vera stofnað aftur. Fyrirtækið þarf vörusniðmátið sem tengillinn biður um.
- **Verð fylgir versluninni.** Afbrigði er sent þegar verð, samanburðarverð eða kostnaðarverð er annað en Shopify hefur. Önnur sending með sömu verðum sendir ekkert.
- **Viðskiptavinir fylgja stillingum verslunarinnar.** Hvað er flutt inn og hvað er uppfært ræðst af viðskiptavinastillingu verslunarinnar. Viðskiptavinir sem þegar eru tengdir eru paraðir, ekki stofnaðir aftur.
- **Kreditnóta endurgreiðslu er stofnuð einu sinni.** Seinni beiðni fyrir sömu endurgreiðslu segir að hún hafi þegar verið afgreidd. Verslunin verður að vera stillt á að stofna kreditnótuna sjálfkrafa. Kreditnótan er ekki bókuð fyrir þig.

## Sækja forritið {#get-it}

Settu upp **Bifrost Shopify** við hlið Bifröst Foundation og **Shopify Connector** frá Microsoft. Business Central samstarfsaðilinn þinn setur það upp. Það þarf Business Central Essentials eða Premium, útgáfu 28, með Shopify Connector uppsettum og verslun tengda. Varðandi verð, hafðu samband við Business Central samstarfsaðilann þinn.

Næst: fylgdu [notkunardæmunum](./user-scenarios.md) eða lestu [útgáfuupplýsingarnar](./release-notes.md).
