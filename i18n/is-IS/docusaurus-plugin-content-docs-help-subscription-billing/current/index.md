---
id: index
title: "Bifröst Subscription Billing — Hjálp"
sidebar_label: "Bifröst Subscription Billing — Hjálp"
sidebar_position: 1
slug: /
---

**Bifröst Subscription Billing** er áskriftareining Bifrastar, viðbót við Business Central frá Origo. Hún gerir **Subscription Billing** appið frá Microsoft kallanlegt utan frá Business Central með því að birta 22 Bifröst-skilaboðategundir fyrir þær aðgerðir sem annars liggja á bak við hnapp á síðu.

## Þessi viðbót hefur engar eigin síður

Það er ekkert að opna í Business Central biðlaranum. Viðbótin bætir hvorki við síðum, síðuviðbótum, aðgerðum né reitum á fyrirliggjandi síðum — hún er alfarið keyrð gegnum skilaboðategundir Bifrastar.

Það sem hún gerir sést hins vegar á stöðluðum síðum Subscription Billing: reikningstillaga sem `Subscription.Billing.CreateProposal` byggir birtist í **Recurring Billing**, reikningur sem `Subscription.Contract.CreateInvoice` býr til birtist í **Sales Invoices**, og svo framvegis. Notaðu síður Microsoft sjálfs til að fara yfir niðurstöðurnar.

Tvennt er stillt utan þessarar viðbótar:

- **Bifrost Setup**, í Bifröst Foundation, geymir þær stillingar sem skilaboðabiðröðin keyrir á. Sjá [Bifrost Setup](/help/foundation/bifrost-setup/).
- **Uppsetning áskriftarsamninga**, númeraraðir, reikningssniðmát og bókunaruppsetning tilheyra Subscription Billing appi Microsoft og eru stillt þar.

## Skilaboðategundir

| Tegund | Lýsing |
| --- | --- |
| Subscription.Line.Create | Beitir áskriftarpakka á áskrift og býr til áskriftarlínurnar sem af því leiðir. |
| Subscription.Contract.GetLines | Tengir ótengdar áskriftarlínur við áskriftarsamning viðskiptavinar. |
| Subscription.Contract.CreateInvoice | Reikningsfærir einn áskriftarsamning viðskiptavinar á óbókfærðan sölureikning. |
| Subscription.Contract.PreviewInvoice | Sýnir hvað Subscription.Contract.CreateInvoice myndi reikningsfæra, án þess að neitt standi eftir. |
| Subscription.Contract.UpdateLineDates | Lokað: ekkert opinbert forritsskil er til fyrir að færa dagsetningar samningslína áfram. Skilar alltaf skipulagðri villu. |
| Subscription.Contract.UpdateExchangeRates | Lokað: ekkert opinbert forritsskil er til, og undirliggjandi ferli er óöruggt án mannlegrar íhlutunar. Skilar alltaf skipulagðri villu. |
| Subscription.VendorContract.GetLines | Tengir ótengdar áskriftarlínur við birgjaáskriftarsamning. |
| Subscription.VendorContract.CreateInvoice | Reikningsfærir einn birgjaáskriftarsamning á óbókfærðan innkaupareikning. Bókfærir aldrei. |
| Subscription.VendorContract.PreviewInvoice | Sýnir hvað Subscription.VendorContract.CreateInvoice myndi reikningsfæra, án þess að neitt standi eftir. |
| Subscription.Billing.CreateProposal | Býr til reikningstillögulínur fyrir reikningssniðmát og greiðsludagsetningu. |
| Subscription.Billing.CreateDocuments | Breytir ófakturuðum tillögulínum sniðmáts í sölu- eða innkaupaskjöl í hópkeyrslu. |
| Subscription.Billing.PreviewDocuments | Les fyrirliggjandi tillögulínur sniðmáts og segir hvernig þær myndu flokkast í skjöl. Les eingöngu. |
| Subscription.PriceUpdate.SetTemplateFilter | Skrifar sýnarsíu fyrir samning, áskrift eða línu á verðuppfærslusniðmát. |
| Subscription.PriceUpdate.CreateProposal | Lokað: ekkert opinbert forritsskil er til fyrir að útbúa verðuppfærslutillögu. Skilar alltaf skipulagðri villu. |
| Subscription.PriceUpdate.Perform | Lokað: ekkert opinbert forritsskil er til fyrir að framkvæma verðuppfærslutillögu. Skilar alltaf skipulagðri villu. |
| Subscription.Renewal.Extend | Framlengir áskrift yfir á áskriftarsamning viðskiptavinar og/eða birgja. |
| Subscription.Renewal.CreateQuote | Býr til endurnýjunarlínur samnings og endurnýjunarsölutilboð fyrir samning viðskiptavinar. |
| Subscription.Usage.ImportData | Flytur inn skrá með notkunargögnum, sem hreinan texta eða base64, í innfluttar notkunargagnalínur. |
| Subscription.Usage.Process | Færir innflutningsfærslu notkunargagna áfram gegnum þau vinnsluskref sem eftir standa. |
| Subscription.Deferral.Release | Losar frestaðar tekjur og kostnað fram að tilteknum degi og bókfærir losunina í fjárhagsbókhald. |
| Subscription.Analysis.Recalculate | Endurbyggir greiningarfærslur áskriftarsamninga miðað við daginn í dag. |
| Subscription.Import.CreateContracts | Býr til raunverulegar áskriftir og samninga út frá innfluttum bráðabirgðalínum. |

Kallaðu á `Help.MessageTypes.Get` til að fá skrána yfir skráðar tegundir, eða biddu einstaka skilaboðategund um hjálparskjal hennar með `Help.Implementation.Get` til að sjá nákvæmlega hvaða viðföng, svarreiti og villur hún styður.

## Hafist handa

1. Settu upp og stilltu **Subscription Billing** appið frá Microsoft, svo uppsetning áskriftarsamninga, númeraraðir og reikningssniðmát séu til.
2. Settu upp og virkjaðu **Bifröst Foundation**.
3. Settu upp **Bifröst Subscription Billing**.
4. Úthlutaðu heimildasettinu **Bifröst - áskriftir** (`BIFROST SubBil ori`) á þann notanda eða þjónustu sem kallar, til viðbótar við Bifröst Foundation heimildir hans.
5. Sendu Bifröst-skilaboð sem heita `Subscription.<Domain>.<Action>` gegnum biðröð Bifrastar.
6. Farðu yfir niðurstöðurnar á síðum Subscription Billing frá Microsoft.

## Nánar

- [Vörulýsing](/subscription-billing/) — hvað viðbótin gerir, hvernig hún virkar og hvað hún krefst
- [Leiðarvísir um skilaboðategundir](/subscription-billing/message-types) — sameiginlegt viðmót beiðna og svara, og þær takmarkanir sem vert er að þekkja áður en kallað er
- [Uppflettirit skilaboðategunda](/subscription-billing/reference/message-types/) — beiðni og svar fyrir hverja tegund
- [Bifrost Setup](/help/foundation/bifrost-setup/) — síðan í Bifröst Foundation sem geymir stillingar kerfisins
