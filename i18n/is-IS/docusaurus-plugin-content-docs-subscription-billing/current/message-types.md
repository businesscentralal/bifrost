---
id: message-types
title: "Leiðarvísir um skilaboðategundir"
sidebar_label: "Leiðarvísir um skilaboðategundir"
sidebar_position: 2
description: "Sameiginlegt viðmót beiðna og svara fyrir allar 22 skilaboðategundir Subscription Billing, hvað hver þeirra gerir, og þær takmarkanir sem vert er að þekkja."
---

Allar skilaboðategundir í þessari viðbót heita `Subscription.<Domain>.<Action>`, til dæmis `Subscription.Billing.CreateProposal`, og skiptast á tíu svið: áskriftarlínur, samninga viðskiptavina, samninga birgja, reikningsferlið, verðuppfærslur, endurnýjun, notkun, frestanir, greiningu og innflutning.

Þessi síða fjallar um viðmótið sem þær eiga allar sameiginlegt og þá hegðun sem vert er að lesa áður en kallað er. Nánari lýsing á hverri tegund — öll viðföng, unnið dæmi, form svarsins og nákvæmur villutexti — kemur frá viðbótinni sjálfri: kallaðu á `Help.MessageTypes.Get` til að fá lista yfir skráðar tegundir, og á `Help.Implementation.Get` með heiti tegundar sem viðfangsefni til að sækja hjálparskjal hennar á Markdown-formi.

## Sameiginlega viðmótið

- Meginmál beiðninnar er JSON-hlutur. Allar skilaboðategundir lesa hann með sama hjálparferlinu, svo þáttunin er samræmd: dagsetningar eru lesnar og skrifaðar á ISO-forminu `YYYY-MM-DD` óháð staðfærslu kallandans, tugabrot nota punkt, og bókgildi taka við `true`/`false`/`1`/`0` án tillits til hástafa.
- Flestar skilaboðategundir taka við lykli sínum — samningsnúmeri, áskriftarnúmeri, sniðmátskóða — annaðhvort sem nefndri JSON-eigind eða sem **viðfangsefni** (subject) Bifröst-skilaboðanna. Nefnda eigindin ræður ef bæði eru gefin.
- Vel heppnað svar er JSON-hlutur með `"status": "Success"` auk þeirra lykla sem tegundin á sjálf:

  ```json
  {
    "status": "Success",
    "contractNo": "CC000010",
    "billingLineCount": 3,
    "documents": [
      { "documentType": "Invoice", "documentNo": "SINV-000123" }
    ]
  }
  ```

- Misheppnað kall svarar með `{"status": "Error", "error": "...", "callstack": "..."}` og skrifar ekkert, nema þar sem takmörkun hér að neðan segir annað.
- Allar skilaboðategundir sem skrifa keyra vinnu sína gegnum sameiginlega einangraða færslu, svo villa á miðri leið rúllar til baka í stað þess að skilja eftir hálfskrifaðar færslur. Þrjár tegundir eru skýrar undantekningar, sjá [Ekki er allt ein heild](#ekki-er-allt-ein-heild).
- Að finna ekkert er ekki villa. Keyrsla sem finnur enga hæfa línu, enga gjaldfallna áskrift og enga fyrirliggjandi tillögu skilar áfram `"status": "Success"` með talninguna núll og `message` sem útskýrir hvor staðan það var.
- Úthlutaðu heimildasettinu **Bifröst - áskriftir** (`BIFROST SubBil ori`) til að notandi eða þjónusta geti kallað á þessar tegundir, til viðbótar við Foundation-heimildir sínar.

## Hvað hver tegund gerir

Af 22 skilaboðategundum skrifa 15, þrjár eru forskoðanir sem lesa eingöngu, og fjórar eru varanlega lokaðar.

| Skilaboðategund | Hegðun | Tilgangur |
| --- | --- | --- |
| `Subscription.Line.Create` | Skrifar | Beitir áskriftarpakka á áskrift og býr til áskriftarlínur |
| `Subscription.Contract.GetLines` | Skrifar | Tengir ótengdar áskriftarlínur við samning viðskiptavinar |
| `Subscription.Contract.CreateInvoice` | Skrifar | Reikningsfærir samning viðskiptavinar á óbókfærðan sölureikning |
| `Subscription.Contract.PreviewInvoice` | Forskoðun | Sýnir hvað `Contract.CreateInvoice` myndi reikningsfæra, án þess að neitt standi eftir |
| `Subscription.Contract.UpdateLineDates` | Lokað | Myndi færa dagsetningar samningslína áfram; ekkert opinbert forritsskil er til |
| `Subscription.Contract.UpdateExchangeRates` | Lokað | Myndi endurreikna fjárhæðir í erlendri mynt; ekkert opinbert forritsskil, og ferlið er óöruggt án mannlegrar íhlutunar |
| `Subscription.VendorContract.GetLines` | Skrifar | Tengir ótengdar áskriftarlínur við birgjaáskriftarsamning |
| `Subscription.VendorContract.CreateInvoice` | Skrifar | Reikningsfærir birgjasamning á óbókfærðan innkaupareikning, aldrei bókfærðan |
| `Subscription.VendorContract.PreviewInvoice` | Forskoðun | Sýnir hvað `VendorContract.CreateInvoice` myndi reikningsfæra, án þess að neitt standi eftir |
| `Subscription.Billing.CreateProposal` | Skrifar | Býr til reikningstillögulínur fyrir reikningssniðmát |
| `Subscription.Billing.CreateDocuments` | Skrifar | Breytir ófakturuðum tillögulínum sniðmáts í skjöl í hópkeyrslu |
| `Subscription.Billing.PreviewDocuments` | Forskoðun | Les fyrirliggjandi tillögulínur sniðmáts og segir hvernig þær myndu flokkast í skjöl |
| `Subscription.PriceUpdate.SetTemplateFilter` | Skrifar | Skrifar sýnarsíu fyrir samning, áskrift eða línu á verðuppfærslusniðmát |
| `Subscription.PriceUpdate.CreateProposal` | Lokað | Myndi útbúa verðuppfærslutillögu; ekkert opinbert forritsskil er til |
| `Subscription.PriceUpdate.Perform` | Lokað | Myndi framkvæma verðuppfærslutillögu; ekkert opinbert forritsskil er til |
| `Subscription.Renewal.Extend` | Skrifar | Framlengir áskrift yfir á samning viðskiptavinar og/eða birgja |
| `Subscription.Renewal.CreateQuote` | Skrifar | Býr til endurnýjunarlínur og sölutilboð fyrir samning viðskiptavinar |
| `Subscription.Usage.ImportData` | Skrifar | Flytur inn skrá með notkunargögnum í innfluttar notkunargagnalínur |
| `Subscription.Usage.Process` | Skrifar | Færir innflutningsfærslu notkunargagna áfram gegnum vinnsluskrefin |
| `Subscription.Deferral.Release` | Skrifar, **bókfærir í fjárhag** | Losar frestaðar tekjur og kostnað fram að degi, þvert á alla samninga |
| `Subscription.Analysis.Recalculate` | Skrifar | Endurbyggir greiningarfærslur áskriftarsamninga miðað við daginn í dag |
| `Subscription.Import.CreateContracts` | Skrifar | Býr til raunverulegar áskriftir og samninga út frá innfluttum bráðabirgðalínum |

## Þekktar takmarkanir

Þetta er sú hegðun sem kemur kallendum á óvart. Hver og ein er meðvitað val, og hver og ein er varin frekar en falin.

### Fjórar skilaboðategundir eru varanlega lokaðar

Fjórar tegundir eru skráðar og finnanlegar, svo verkfæri geti talið þær upp og lýst þeim, en hvert kall skilar skipulagðri villu og skrifar ekkert. Hver þeirra nefnir nákvæmlega það ferli Microsoft sem þyrfti fyrst að verða opinbert:

| Skilaboðategund | Ferli Microsoft sem þyrfti að verða opinbert |
| --- | --- |
| `Subscription.Contract.UpdateLineDates` | `Customer Subscription Contract.UpdateServicesDates` (ásamt `Subscription Header.UpdateServicesDates` og kóðaeiningunni 8058 "Update Sub. Lines Term. Dates") |
| `Subscription.Contract.UpdateExchangeRates` | `Customer Subscription Contract.UpdateAndRecalculateServiceCommitmentCurrencyData` |
| `Subscription.PriceUpdate.CreateProposal` | `Price Update Management.CreatePriceUpdateProposal` |
| `Subscription.PriceUpdate.Perform` | `Price Update Management.PerformPriceUpdate` |

Allar fjórar eru innri (internal) í Subscription Billing appi Microsoft í Business Central 28.4. Engin þeirra endurgerir undirliggjandi rökfræði: gildistími, reikningstaktur, námundun, mynt og bindingartímabil vinna saman á þann hátt að auðvelt er að fara lítillega rangt með, og frávik gæti verðlagt eða skemmt lifandi samninga viðskiptavina á hátt sem er bæði torfundinn og illa afturkræfur. Notaðu samsvarandi aðgerð í Business Central biðlaranum í staðinn — hjálparskjal hverrar tegundar nefnir hana.

`Subscription.Contract.UpdateExchangeRates` hefur aðra ástæðu til að vera lokuð, jafnvel þótt ferlið yrði gert opinbert. Ferli Microsoft opnar gagnvirku síðuna **Exchange Rate Selection** svo notandi geti staðfest gengið. Þegar `GuiAllowed` er false — eins og alltaf er í köllum án mannlegrar íhlutunar — skilar sú síða false í stað þess að stöðva keyrsluna, og ferlið heldur áfram með núll gengi og núllar þar með þegjandi fjárhæðir samningsins í erlendri mynt.

### Ekki er hægt að afmarka losun frestana við dagsetningu utan frá

`Subscription.Deferral.Release` keyrir skýrslu Microsoft, **Contract Deferrals Release**, en bókunardagsetning hennar og lokadagsetning liggja á beiðnisíðu skýrslunnar. `SetRequestPageParameters` er innri, og beiðnisíðu-XML sem afhent er `Report.Execute` er ekki beitt á þessa skýrslu, svo hvorug dagsetningin verður sett utan frá. Skýrslan notar vinnudagsetningu setunnar fyrir báðar: hún losar allt sem er hæft fram að vinnudagsetningunni og bókfærir það miðað við hana.

Þar sem kallið bókfærir óafturkræft í fjárhagsbókhaldið eru `postingDate` og `postUntilDate` **vörn, ekki fyrirmæli**. Kallið skoðar hvað skýrslan er í þann mund að gera og hafnar keyrslunni ef hún nær lengra en kallandinn bað um, í stað þess að bókfæra og skila svo tölu sem passar ekki við það sem gerðist. Til að losa fram að fyrri dagsetningu skal setja vinnudagsetningu setunnar áður en kallað er.

Þetta er líka eina skilaboðategundin sem er ekki afmörkuð við einn samning: hún losar allar hæfar frestanir viðskiptavina og birgja þvert á alla áskriftarsamninga. Staðfestu vinnudagsetninguna vandlega áður en kallað er í rekstrarumhverfi.

### Ekki er hægt að reikningsfæra samning aftur meðan síðasta skjal hans er óbókfært

Business Central leggur ekki til nýtt reikningstímabil fyrir áskriftarlínu þar sem fyrra reikningsskjal er enn óbókfært. Þetta er regla Microsoft, ekki eitthvað sem þessi viðbót bætir við, og hún gildir jafnt um `Subscription.Contract.CreateInvoice`, `Subscription.VendorContract.CreateInvoice` og `Subscription.Billing.CreateProposal`.

Í reynd þýðir þetta að tvær reikningsfærslur í röð á sama samning reikningsfæra einu sinni. Seinna kallið heppnast og skilar tómum `documents` fylki, talningunni núll og skilaboðum um að ekkert nýtt hafi verið hægt að reikningsfæra — það endurtekur ekki þegjandi skjal fyrra kallsins. Bókfærðu eða eyddu útistandandi skjalinu og næsta kall reikningsfærir næsta tímabil.

### CreateInvoice neitar að keyra yfir óloknar línur annars samnings

`Subscription.Contract.CreateInvoice` og `Subscription.VendorContract.CreateInvoice` reikningsfæra einn samning með því að afrita gjaldfallnar áskriftarlínur hans í reikningstillögu til bráðabirgða — reikningslínur með **auðan** reikningssniðmátskóða. Sú tillaga nær yfir allt félagið, ekki einn samning: kóðaeining Microsoft sem býr til skjölin breytir hverri einustu reikningslínu með auðu sniðmáti sem stendur í félaginu þegar hún keyrir.

Báðar útfærslurnar athuga því fyrst hvort slík lína sé þegar til fyrir **annan** samning, og neita að keyra ef svo er og nefna þann samning í villunni, frekar en að reikningsfæra þegjandi ólokna tillögu einhvers annars í leiðinni. Báðar reikningsforskoðanirnar beita sömu athugun, því þær byggja sams konar línur til bráðabirgða.

### Reikningsskjöl birgja eru aldrei bókfærð á þessari leið

`Subscription.VendorContract.CreateInvoice` og birgjaleiðin í `Subscription.Billing.CreateDocuments` búa alltaf til **óbókfærðan** innkaupareikning eða kreditreikning. Skjalagerð Business Central hunsar öll bókunarmerki fyrir birgjaskjöl á þessari leið, svo bókun er alltaf sérstakt og meðvitað skref eftir yfirferð. Ekkert viðfang á hvorugri tegundinni getur bókfært birgjaskjal beint.

### Tvær af þremur forskoðunum búa til og eyða raunverulegum tillögulínum

`Subscription.Contract.PreviewInvoice` og `Subscription.VendorContract.PreviewInvoice` eru ekki færslur sem rúllað er til baka. Reikningstillögu-kóðaeining Microsoft staðfestir (commit) innvortis á miðri eigin keyrslu, svo venjuleg villubundin afturköllun myndi ekki taka hana til baka. Hvor forskoðun skráir í staðinn síðasta færslunúmer reikningslínu, byggir raunverulegu tillögulínurnar gegnum sama inngang og skrifkallið notar, les til baka nákvæmlega þær línur sem hún bjó til, og eyðir svo nákvæmlega þeim aftur — nýjustu fyrst — bæði þegar allt gengur og ef tillögukallið sjálft brestur á miðri leið. Að eyða nýjustu fyrst lætur Business Central spóla reikningskeðjunni hreint til baka, þar með talið reitum á borð við næstu reikningsdagsetningu sem síðari lína getur fært áfram.

`Subscription.Billing.PreviewDocuments` er annars eðlis: hún býr ekkert til og eyðir engu. Hún les eingöngu reikningslínur sem eru þegar til vegna þess að kallandinn keyrði `Subscription.Billing.CreateProposal` fyrr.

Engin forskoðun býr nokkurn tímann til skjal, ekki einu sinni til bráðabirgða.

### Ekki er allt ein heild

Þrjár skilaboðategundir verða ekki teknar til baka í heild sinni, því Business Central staðfestir innan þeirra:

- `Subscription.Billing.CreateDocuments` — hvert reikningsskjal er staðfest um leið og það verður til. Villa á miðri leið skilur eftir þau skjöl sem urðu til á undan henni; villusvarið nefnir þau berum orðum undir `documents` og setur `"rolledBack": false` í stað þess að bresta í blindni.
- `Subscription.Usage.Process` — hvert umbeðið skref staðfestir þegar því lýkur. Keyrðu þau skref sem eftir standa aftur frekar en að endurtaka kallið í heild.
- `Subscription.Import.CreateContracts` — hver bráðabirgðalína er staðfest um leið og hún er unnin. Ein gölluð lína stöðvar ekki lotuna; villan er skráð á línuna og næsta lína er samt reynd.

### Fylkisviðföng verða að vera fylki

Sérhver tegund sem tekur við lista — `subscriptionLineEntryNos`, `subscriptionPackageCodes`, `steps`, `stages` — hafnar gildi sem er til staðar en er ekki JSON-fylki. Að sleppa viðfanginu, eða senda það sem null, velur áfram sjálfgefna gildið sem lýst er.

Að hunsa þegjandi gallaðan lista myndi breyta innsláttarvillu í mun stærri keyrslu en kallandinn bað um: rangt slegið `steps` myndi keyra öll vinnsluskrefin, og rangt slegið `subscriptionLineEntryNos` myndi tengja allar hæfar áskriftarlínur í stað þeirra tveggja sem nefndar voru.

## Hvert skal halda næst

- [Yfirlit](/subscription-billing/) — hvað viðbótin er og hvað hún krefst
- [Uppflettirit skilaboðategunda](/subscription-billing/reference/message-types/) — beiðni og svar fyrir hverja tegund, búið til beint úr forritinu
- [Hjálp í kerfinu](/help/subscription-billing/)
- [Notendasviðsmyndir fyrir AppSource](/subscription-billing/user-scenarios) — unnin leið gegnum viðbótina, þar á meðal sú uppsetning félagsins sem reiknings- og frestunarsviðsmyndirnar byggja á
- [Byggja á Bifröst](/extensibility/)
