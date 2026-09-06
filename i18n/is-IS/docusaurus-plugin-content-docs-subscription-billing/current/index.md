---
id: index
title: "Bifröst Subscription Billing"
sidebar_label: "Yfirlit"
sidebar_position: 1
slug: /
description: "Subscription Billing frá Microsoft gert kallanlegt — 22 skilaboðategundir Bifrastar fyrir samninga, reikningsferlið, notkunargögn, frestanir og innflutning."
---

Bifröst Subscription Billing gerir **Subscription Billing** appið frá Microsoft kallanlegt utan frá Business Central. Hún byggir á Bifröst Foundation og bætir við 22 skilaboðategundum sem ná yfir þær aðgerðir sem annars liggja á bak við hnapp á síðu — að beita áskriftarpakka, tengja línur við samning, keyra reikningstillögu, losa frestanir — svo samþætting, sjálfvirkniverk eða MCP-biðlari geti keyrt endurtekna reikningsgerð frá upphafi til enda án þess að nokkur smelli sig í gegnum biðlarann.

Subscription Billing heldur vel utan um endurteknar tekjur, en almennt færsluviðmót les og skrifar áskriftarfærslur og stöðvast svo við fyrsta hnappinn. Þessi viðbót birtir eina skilaboðategund fyrir hverja aðgerð sem raunverulega þarf meira en færsluskrif: kóðaeiningu frá Microsoft, færslusamhengi við innsetningu, vistaða sýnarsíu eða forskoðunarkeyrslu sem er svo tekin til baka. Það sem venjulegur lestur eða venjuleg innsetning ræður þegar við er vísvitandi skilið eftir hjá `Data.Records.Get` og `Data.Records.Set` í Foundation.

## Hvað hún gerir

- **Áskriftarlínur** — beittu áskriftarpakka á áskrift og láttu afleiðslurökfræði Microsoft sjálfs reikna verð, reikningstakt og dagsetningar fyrir hverja nýja línu.
- **Samningar viðskiptavina og birgja** — tengdu ótengdar áskriftarlínur við samning og reikningsfærðu einn samning á óbókfærðan sölu- eða innkaupareikning.
- **Reikningsferlið** — búðu til reikningstillögulínur fyrir reikningssniðmát og tímabil, og breyttu svo tillögunni í skjöl í einni hópkeyrslu, flokkuð eftir samningi eða eftir viðskiptavini.
- **Forskoðun án skrifa** — sjáðu nákvæmlega hvað keyrsla fyrir viðskiptavin, birgi eða hóp myndi framleiða. Vinnan er unnin á raunverulegum gögnum svo tölurnar séu réttar, og allt sem forskoðunin bjó til er svo fjarlægt aftur.
- **Reikningsgerð eftir notkun** — afhentu notkunarskrá sem gögn í stað þess að fara um skráargluggann, og keyrðu hana áfram gegnum vinnsluskref Microsoft sjálfs.
- **Frestanir, greining og innflutningur** — losaðu frestaðar tekjur og kostnað í fjárhagsbókhaldið, endurbyggðu greiningarfærslur samninga, og breyttu innfluttum bráðabirgðalínum í raunverulegar áskriftir og samninga.
- **Engu er nokkurn tímann eytt** — það eru engar `*.Delete` skilaboðategundir. Áskrift lýkur með lokadagsetningu eða lokunarmerki, ekki með eyðingu.
- **Sjálflýsandi viðmót** — hver skilaboðategund svarar eigin hjálparskjali á Markdown-formi með viðföngum sínum, unnu dæmi, formi svarsins, þeim villum sem hún gefur og því sem óhætt er að gera.

## Hvernig hún virkar

1. Settu upp **Subscription Billing** appið frá Microsoft og keyrðu leiðsagnaruppsetningu þess, svo uppsetning áskriftarsamninga, númeraraðir og að minnsta kosti eitt reikningssniðmát séu til.
2. Settu upp **Bifröst Foundation** og virkjaðu hana.
3. Settu upp **Bifröst Subscription Billing** og úthlutaðu heimildasettinu **Bifröst - áskriftir** (`BIFROST SubBil ori`) samhliða Foundation-heimildum kallandans.
4. Ytri kerfi senda Bifröst-skilaboð sem heita `Subscription.<Domain>.<Action>` gegnum sama biðraðar-, verk- og gagnamynstur og aðrar einingar Bifrastar nota.
5. Öll skrif keyra innan sameiginlegrar einangraðrar færslu, svo villa á miðri leið rúllar hreint til baka og skilar skipulagðri villu í stað þess að skilja eftir hálfskrifaðar færslur — með þeim undantekningum sem taldar eru í [leiðarvísi um skilaboðategundir](./message-types).

## Skilaboðategundir

| Svið | Skilaboðategundir |
| --- | --- |
| Áskriftarlínur | `Subscription.Line.Create` |
| Samningar viðskiptavina | `Subscription.Contract.GetLines`, `Subscription.Contract.CreateInvoice`, `Subscription.Contract.PreviewInvoice`, `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates` |
| Samningar birgja | `Subscription.VendorContract.GetLines`, `Subscription.VendorContract.CreateInvoice`, `Subscription.VendorContract.PreviewInvoice` |
| Reikningsferlið | `Subscription.Billing.CreateProposal`, `Subscription.Billing.CreateDocuments`, `Subscription.Billing.PreviewDocuments` |
| Verðuppfærslur | `Subscription.PriceUpdate.SetTemplateFilter`, `Subscription.PriceUpdate.CreateProposal`, `Subscription.PriceUpdate.Perform` |
| Endurnýjun | `Subscription.Renewal.Extend`, `Subscription.Renewal.CreateQuote` |
| Notkun | `Subscription.Usage.ImportData`, `Subscription.Usage.Process` |
| Frestanir | `Subscription.Deferral.Release` |
| Greining | `Subscription.Analysis.Recalculate` |
| Innflutningur | `Subscription.Import.CreateContracts` |

Fjórar þeirra — `Subscription.Contract.UpdateLineDates`, `Subscription.Contract.UpdateExchangeRates`, `Subscription.PriceUpdate.CreateProposal` og `Subscription.PriceUpdate.Perform` — eru skráðar og finnanlegar en skila skipulagðri villu í stað þess að keyra, því Microsoft hefur ekki gert opinbert forritsskil aðgengilegt fyrir undirliggjandi aðgerð. Hver þeirra nefnir það ferli sem þyrfti að verða opinbert og vísar á þá aðgerð í biðlaranum sem vinnur verkið í dag. Sjá [leiðarvísi um skilaboðategundir](./message-types).

## Kröfur

- Microsoft Dynamics 365 Business Central 28.0 eða nýrri, Essentials eða Premium.
- **Subscription Billing** appið frá Microsoft uppsett og stillt. Þessi viðbót kallar á kóðaeiningar og skýrslur Microsoft sjálfs; hún endurgerir enga af rökfræði þeirra.
- **Bifröst Foundation**, fáanleg sér á AppSource.
- Heimildasettið **Bifröst - áskriftir** (`BIFROST SubBil ori`) ofan á Foundation-heimildir kallandans. Það veitir eingöngu keyrsluréttindi á hluti þessarar viðbótar; það víkkar ekki aðgang að töflum Subscription Billing.

## Hvert skal halda næst

- [Leiðarvísir um skilaboðategundir](./message-types) — sameiginlegt viðmót beiðna og svara, hvað hver tegund gerir, og þær takmarkanir sem vert er að þekkja áður en kallað er
- [Uppflettirit skilaboðategunda](./reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Hjálp í kerfinu](/help/subscription-billing/)
- [Notendasviðsmyndir fyrir AppSource](./user-scenarios)
- [Skráning í Partner Center](./listing)
- [Byggja á Bifröst](/extensibility/)
