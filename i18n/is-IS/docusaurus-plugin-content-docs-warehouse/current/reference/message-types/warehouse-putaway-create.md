---
id: warehouse-putaway-create
title: "Warehouse.Putaway.Create"
sidebar_label: "Warehouse.Putaway.Create"
sidebar_position: 3
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Putaway.Create."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::

:::note Krefst Bifröst Warehouse
Þessi skilaboðategund tilheyrir **Bifröst Warehouse**, sem keyrir ofan á **Bifröst Foundation**. Settu bæði upp;
án Bifröst Warehouse er tegundin ekki í skránni sem `Help.MessageTypes.Get` skilar.
:::


## Yfirlit

Tryggir að vöruhúsafrágangur sé til fyrir fyrirliggjandi bókaða vöruhúsamóttöku (Posted Whse. Receipt) og skilar honum. Keyrir BC-skýrslu 7305 `Whse.-Source - Create Document` (sömu aðgerð og *Create Put-away* á síðu bókaðrar vöruhúsamóttöku) með `SetPostedWhseReceiptLine`. Skilar `Warehouse Activity Header` (`Type = Put-away`) ásamt samtölum línanna.

Skilaboðategundin er **óháð endurtekningu þegar frágangurinn er þegar til**: ef frágangur er þegar til fyrir móttökuna (oftast vegna þess að bókunin bjó hann til sjálfkrafa — sjá hér að neðan) er fyrirliggjandi frágangi skilað með `"alreadyExisted": true` í stað villu.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Vinnublað eða sjálfvirk stofnun — lestu þetta fyrst

Hvort bókun vöruhúsamóttöku **býr sjálfkrafa til** frágang er það mikilvægasta sem þarf að skilja um þessa skilaboðategund. Kóðaeining 5760 `Whse.-Post Receipt` í grunnforritinu reiknar:

```
ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"
```

| Uppsetning birgðageymslu | Bókun móttökunnar… | `Warehouse.Putaway.Create` þá… |
|---|---|---|
| `Require Put-away = true`, `Use Put-away Worksheet = false` (sjálfgefið í BC, t.d. sýnibirgðageymslurnar GULUR / HVÍTUR) | **býr sjálfkrafa til** frágang | sér að skýrsla 7305 hefur ekkert eftir, bregst við því og skilar sjálfvirka fráganginum með `alreadyExisted = true`. |
| `Require Put-away = true`, `Use Put-away Worksheet = true` | býr **ekki** til frágang (verkið bíður á vinnublaðinu) | býr til nýjan frágang og skilar `alreadyExisted = false`. |
| `Require Put-away = false` | setur birgðirnar beint í birgðir | enginn frágangur er mögulegur — skilar `No Warehouse Put-away was created for ...`. |

Í venjulegri birgðageymslu með Require Put-away var fráganginum sem þú færð til baka því búinn til **með bókuninni**, ekki með þessu kalli. Það er eðlilegt og rétt — haltu beint áfram í `Warehouse.Putaway.Register`.

## Forsendur

- **Bókuð** vöruhúsamóttaka verður að vera til fyrir upprunann. Óbókaðar vöruhúsamóttökur duga ekki — kallaðu fyrst á `Warehouse.Receipt.Post`.
- `Location Code` móttökunnar verður að vísa á birgðageymslu með `Require Put-away = true`.
- Að minnsta kosti ein lína í bókuðu vöruhúsamóttökunni verður enn að hafa `Status <> Completely Put Away` og `Quantity > 0`. (Þegar gengið hefur verið frá öllu færðu `... has no lines to put away.`)

## Auðkenning bókuðu vöruhúsamóttökunnar

Tilgreindu bókuðu móttökuna með Bifröst-viðfanginu (GUID = SystemId, eða texti = `No.`) eða með einum af þessum lyklum í JSON-beiðninni:

| Lykill | Merking |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId á `Posted Whse. Receipt Header`. |
| `postedWhseReceiptNo` / `receiptNo` / `no` | `No.` á `Posted Whse. Receipt Header`. |

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `postedWhseReceiptNo` | code[20] | Eitt auðkenni áskilið | Eða notaðu `receiptNo` / `no` / `systemId` / viðfang. |
| `assignedUserId` | code[50] | Nei | Sett á frágangshausinn (nýjan eða fyrirliggjandi). Háð skrifatakmörkun á `Warehouse Activity Header."Assigned User ID"`. Notandinn verður að vera `Warehouse Employee` í birgðageymslu frágangsins. |
| `sortingMethod` | string | Nei | Heiti úr BC-upptalningunni `Whse. Activity Sorting Method`, óháð há- og lágstöfum. Staðfest í keyrslu (BC 27): `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type`. Villusvarið telur upp nákvæmlega þau gildi sem gilda í þinni útgáfu. Háð skrifatakmörkun á `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | boolean | Nei (sjálfgefið false) | Ekki stutt í þessari útgáfu API-sins. Ef `true` er sent kemur villa. |
| `doNotFillQtyToHandle` | boolean | Nei (sjálfgefið false) | Ekki stutt í þessari útgáfu API-sins. Ef `true` er sent kemur villa. |

### Dæmi um beiðni
```json
{
  "postedWhseReceiptNo": "R_000030",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Snið svars

Staðfest í keyrslu (BC 27, CRONUS IS, birgðageymsla `CEPUT` með `Use Put-away Worksheet = true`, innkaupapöntun upp á 5 × vöru `1896-S`):

```json
{
  "status": "Success",
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "putawayNo": "PU000025",
  "putawaySystemId": "31cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "locationCode": "CEPUT",
  "assignedUserId": "",
  "sortingMethod": "None",
  "alreadyExisted": false,
  "totalPutawayLines": 1,
  "totalQtyToHandle": 5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

- `alreadyExisted` — `false` þegar þetta kall bjó fráganginn til; `true` þegar opinn frágangur var þegar til (t.d. búinn til sjálfkrafa við bókun) og honum var skilað óbreyttum.
- `totalPutawayLines` — í birgðageymslu **án hólfa** (`Bin Mandatory = false`) er **ein** frágangslína fyrir hverja upprunalínu (staðfest: 1 lína fyrir móttöku með einni línu). Í birgðageymslum með `Bin Mandatory` / `Directed Put-away and Pick` verður hver upprunalína að **Take + Place pari**, svo fjöldinn er um það bil tvöfaldur.
- Ef `sortingMethod` er ekki tilgreint skilar svarið `"sortingMethod": "None"` (auður skjátexti BC-upptalningarinnar er staðlaður í `None`).

## Staðfest hegðun

Hver lína var keyrð með `invoke_message_type`-tólinu í BC Bifröst MCP:

| Aðstæður | Niðurstaða |
|---|---|
| Birgðageymsla með vinnublaði, ný móttaka | `Success`, `alreadyExisted = false`, frágangur stofnaður. |
| Birgðageymsla án vinnublaðs (bókunin bjó frágang til) | `Success`, `alreadyExisted = true`, sjálfvirka fráganginum skilað. |
| Kallað aftur meðan opinn frágangur er til | `Success`, `alreadyExisted = true` (sami frágangur). |
| Kallað eftir að gengið hefur verið frá allri móttökunni | Villa `Posted Whse. Receipt {n} has no lines to put away.` |
| `sortingMethod = "NotAMethod"` | Villa `sortingMethod 'NotAMethod' is not valid. Expected one of: None, Item, ...` |
| Ekkert auðkenni | Villa `Posted Whse. Receipt identifier must be specified ...` |
| Óþekkt móttaka | Villa `Posted Whse. Receipt {id} does not exist.` |
| `setBreakbulkFilter = true` | Villa `setBreakbulkFilter = true is not supported by this API version. ...` |

## Bókunarhlið

Ekkert — stofnun frágangs skráir enga birgðahreyfingu. Fylgitegundin `Warehouse.Putaway.Register` krefst heimildasafnsins `BIFROST WhsePost ori`.

## Reitatakmarkanir

Áður en gildi frá kallanda eru sett á fráganginn kallar útfærslan á `Bifrost Field Access.IsFieldWriteRestricted` fyrir:

- `Warehouse Activity Header."Assigned User ID"` (þegar `assignedUserId` er sent)
- `Warehouse Activity Header."Sorting Method"` (þegar `sortingMethod` er sent)

Takmarkaður reitur stöðvar beiðnina með villusvari — frágangurinn er samt til í gagnagrunninum; fjarlægðu hann eða keyrðu aftur án takmörkuðu færibreytunnar.

## Villur

| Villa | Orsök |
|---|---|
| `Posted Whse. Receipt identifier must be specified ...` | Hvorki viðfang né auðkennislykill í JSON-beiðninni. |
| `Posted Whse. Receipt {id} does not exist.` | Uppgefið SystemId eða No. fannst ekki. |
| `Posted Whse. Receipt {n} has no lines to put away.` | Hausinn er til en allar línur eru `Completely Put Away` eða hafa `Quantity = 0`. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Gildið er ekki í `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` lokar á `assignedUserId` eða `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` eða `doNotFillQtyToHandle` sent sem `true`. |
| `No Warehouse Put-away was created for ...` | Skýrsla 7305 keyrði villulaust en bjó ekki til haus OG enginn var til fyrir — t.d. krefst birgðageymslan í raun ekki frágangs, eða birgðirnar fóru beint í afhendingu (cross-dock). |
| (hólfavillur, orðrétt frá BC) | Í birgðageymslum með `Bin Mandatory` / stýrðum frágangi þar sem ekkert áfangahólf finnst: t.d. `There is no Bin ...`. Skilað óbreyttum. |

> Athugið: `There is nothing to handle.` (sem skýrsla 7305 skilar þegar frágangur er þegar til) er **ekki lengur skilað sem villu** — útfærslan finnur fyrirliggjandi frágang og skilar honum með `alreadyExisted = true`. Þú sérð þennan texta aðeins ef móttakan á frágang í gagnagrunninum sem útfærslan nær einhverra hluta vegna ekki að para við (á ekki að gerast fyrir frágang sem BC býr til).

## Gildrur

- **Uppruni frágangs er BÓKUÐ móttaka, ekki óbókuð**: Vöruhúsamóttöku verður að bóka (með `Warehouse.Receipt.Post`) áður en hægt er að búa til frágang. Óbókaður `Warehouse Receipt Header` getur ekki verið uppruni frágangs.
- **Frágangurinn verður yfirleitt til við bókun, ekki við þetta kall**: Í hverri birgðageymslu með `Require Put-away` sem notar ekki vinnublað býr bókunin hann til sjálfkrafa. Þar er `alreadyExisted = true` eðlileg og heilbrigð niðurstaða — ekki viðvörun.
- **Nýjar birgðageymslur þurfa línu í Inventory Posting Setup**: Bókun móttökunnar mistekst með `The Inventory Posting Setup does not exist. ... Location Code='{loc}', Invt. Posting Group Code='{grp}'` þar til lína er til fyrir birgðageymsluna og birgðabókunarflokk hverrar vöru. Búðu hana til með `Data.Records.Set` á `Inventory Posting Setup` (afritaðu lykla frá fyrirliggjandi birgðageymslu).
- **Birgðageymslur án frágangs**: Ef `Location Code` móttökunnar hefur `Require Put-away = false` er frágangsskrefinu sleppt við bókun móttökunnar og ekki er heldur hægt að búa til frágang handvirkt — þú færð `No Warehouse Put-away was created for ...`. Birgðirnar eru þegar komnar í birgðir.
- **Birgðageymslur með skyldubundnum hólfum / WMS**: Birgðageymslur með `Bin Mandatory = true` eða `Directed Put-away and Pick = true` krefjast þess að hægt sé að ákvarða áfangahólf (sjálfgefið hólf, frágangssniðmát eða hólfastefna). Án þess kemur hólfavilla frá BC sem er skilað orðrétt. Frágangslínur koma þar í Take + Place pörum.
- **Heimild fyrir `assignedUserId`**: Notandinn verður þegar að vera skráður sem `Warehouse Employee` í `Location Code` frágangsins. Annars kemur BC-villan `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Flokkunarlistinn breytist**: Upptalningin `Whse. Activity Sorting Method` er stækkanleg. Ef `sortingMethod` er hafnað inniheldur villusvarið gildandi lista fyrir þinn leigjanda.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC-skýrsla 7305 býður aðeins upp á þessa valkosti á beiðnisíðu sinni. Útfærslan hafnar `true` svo að stillingin tapist ekki þegjandi; slepptu lyklunum (eða sendu `false`) til að fá sjálfgefna hegðun BC.

## Leiðbeiningar fyrir gervigreindarfulltrúa

Þegar fulltrúi stýrir þessari skilaboðategund:

1. **Röð auðkenna er föst**: Viðfang > `systemId` > `recordSystemId` > `id` > `postedWhseReceiptNo` > `receiptNo` > `no`. Veldu nákvæmlega eitt; ekki blanda saman.
2. **Notaðu frekar SystemId en `No.`** í endurteknum köllum — númer bókaðra vöruhúsamóttakna koma úr númeraröð og geta verið endurútgefin í prófunarleigjendum eftir endurheimt gagnagrunns.
3. **`alreadyExisted` segir hver bjó fráganginn til**, ekki hvort hann sé nothæfur. Í báðum tilvikum er `putawayNo` tilbúið fyrir `Warehouse.Putaway.Register`. Ekki líta á `alreadyExisted = true` sem villu.
4. **Endurtekning**: Óhætt að reyna aftur. Annað kall fyrir sömu móttöku skilar sama opna frágangi (`alreadyExisted = true`) í stað þess að búa til tvítak — að því gefnu að enginn frágangur hafi verið skráður á milli.
5. **Hlutafrágangur**: Breyttu `Qty. to Handle` á línum vöruhúsaaðgerðarinnar sem verða til með `Data.Records.Set` áður en kallað er á `Warehouse.Putaway.Register`. Mundu eftir Take + Place pörum í birgðageymslum með skyldubundnum hólfum.

## Endurgerð / prófun með BC Bifröst MCP

Heildarprófun gegn leigjanda í anda CRONUS (öll skrefin eru MCP-tólin `invoke_message_type` / `set_records`):

1. `set_records` á `Location` — búðu til birgðageymslu með frágangsvinnublaði: `{ RequireReceive: true, RequirePutaway: true, UsePutawayWorksheet: true, BinMandatory: false }`.
2. `set_records` á `Inventory Posting Setup` — bættu við línu fyrir nýju birgðageymsluna og birgðabókunarflokk vörunnar (afritaðu lykla frá fyrirliggjandi birgðageymslu).
3. `Purchase.Document.Create` (viðfang = No. lánardrottins, `data: { documentType: "Order" }`) → skráðu hjá þér númer innkaupapöntunarinnar.
4. `set_records` á `Purchase Line` — bættu við vörulínu með `LocationCode` = nýja birgðageymslan, `Quantity` og `DirectUnitCost`.
5. `Purchase.Document.Release` (viðfang = númer innkaupapöntunar).
6. `Warehouse.Receipt.Create` (`data: { sourceDocuments: [{ sourceType: "PurchaseOrder", documentNo: "<PO>" }] }`). Slepptu `locationCode` nema það sé sett á **haus** innkaupapöntunarinnar — sían sannreynir hausinn, ekki línuna.
7. `Warehouse.Receipt.Post` (`data: { receiptNo: "<WR>" }`) → skráðu hjá þér `postedWhseReceiptNo`.
8. `Warehouse.Putaway.Create` (viðfang = númer bókuðu móttökunnar) → `alreadyExisted = false` í birgðageymslu með vinnublaði; `true` í birgðageymslu án vinnublaðs.
9. `Warehouse.Putaway.Register` (viðfang = `putawayNo`).

## Verkflæði

1. `Sales.ReturnOrder.Release` (eða losun innkaupapöntunar)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post` — býr til **bókuðu** vöruhúsamóttökuna sem þessi skilaboðategund notar (og, í birgðageymslum án vinnublaðs, fráganginn sjálfan).
4. **`Warehouse.Putaway.Create`** — þessi skilaboðategund
5. `Warehouse.Putaway.Register`

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — býr til inntakið (bókuðu vöruhúsamóttökuna).
- `Warehouse.Putaway.Register` — skráir fráganginn eftir að starfsmaður vöruhússins hefur komið vörunum fyrir.
- `Data.Records.Get` — sækir hvaða reit sem er á `Warehouse Activity Header` / `Warehouse Activity Line` sem verður til.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
