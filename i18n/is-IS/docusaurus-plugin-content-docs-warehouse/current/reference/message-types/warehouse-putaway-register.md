---
id: warehouse-putaway-register
title: "Warehouse.Putaway.Register"
sidebar_label: "Warehouse.Putaway.Register"
sidebar_position: 4
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Putaway.Register."
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

Skráir vöruhúsafrágang. Keyrir BC-kóðaeiningu 7307 `Whse.-Activity-Register` (sömu kóðaeiningu og notuð er við skráningu tínslu). Eftir skráningu er hólfainnihald uppfært (birgðir færast úr móttökuhólfi í geymsluhólf), frágangshausnum er eytt og færsla birtist í `Registered Whse. Activity Hdr.`, og `Qty. Put Away` á upprunalínu bókuðu vöruhúsamóttökunnar hækkar.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Bókunarhlið

Krefst `Bifrost Posting Type::Warehouse` — þ.e. heimildasafnsins `BIFROST WhsePost ori` á notanda skilaboðaverksins. Án þess skilar beiðnin villusvari og ekkert er skráð.

## Auðkenning vöruhúsafrágangsins

Tilgreindu fráganginn með Bifröst-viðfanginu (GUID = SystemId aðgerðahaussins, eða texti = `No.`) eða með einum af þessum lyklum í JSON-beiðninni:

| Lykill | Merking |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId á `Warehouse Activity Header` (Type = Put-away). |
| `putawayNo` / `no` | `No.` á `Warehouse Activity Header` (Type = Put-away). |

## Forsenda: línur verða að hafa Qty. to Handle

BC skráir aðeins það sem starfsmaður vöruhússins hefur staðfest að gengið hafi verið frá. Sjálfgefið fyllir `Warehouse.Putaway.Create` út `Qty. to Handle` á hverri línu (sjálfgefna gildið `doNotFillQtyToHandle = false` í BC-skýrslunni). Ef kallað er á `Warehouse.Putaway.Register` fyrir frágang þar sem `Qty. to Handle` er núll á öllum línum kemur BC-villan `Nothing to register.`

Til að skrá hlutafrágang skaltu fyrst kalla á `Data.Records.Set` á `Warehouse Activity Line` og uppfæra `Qty. to Handle` á hverri línu. Í birgðageymslum með `Bin Mandatory` / `Directed Put-away and Pick` koma frágangslínur í **Take + Place pörum** — settu báðar línurnar á sama gildi. Í birgðageymslu **án hólfa** (`Bin Mandatory = false`) er ein lína fyrir hverja upprunalínu og engin pörun (staðfest í keyrslu: móttaka með einni línu gaf eina frágangslínu).

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `putawayNo` | code[20] | Eitt auðkenni áskilið | Eða notaðu `no` / `systemId` / viðfang. |

### Dæmi um beiðni
```json
{ "putawayNo": "WPA000456" }
```

## Snið svars

Staðfest í keyrslu (BC 27, CRONUS IS) — skráning frágangs `PU000025` (1 lína, 5 × vara `1896-S`) sem búinn var til úr bókaðri vöruhúsamóttöku `R_000030`:

```json
{
  "status": "Success",
  "putawayNo": "PU000025",
  "linesRegistered": 1,
  "totalQtyRegistered": 5,
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "registeredPutawayNo": "PU_000007",
  "registeredPutawaySystemId": "244cf98f-ff61-f111-b7a5-fb5809e04ea8",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "R_000030",
      "lineNo": 10000,
      "sourceDocument": "Purchase Order",
      "sourceNo": "106032",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 5,
      "qtyPutAway": 5,
      "qtyOutstanding": 0,
      "status": "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away PU000025 (1 lines) registered against Posted Whse. Receipt R_000030."
}
```

`qtyPutAway` og `status` á hverri móttökulínu sýna stöðuna eftir skráningu: við fulla skráningu fer línan í `Completely Put Away`; við hlutaskráningu stendur línan í `Partially Put Away` (`Qty. Outstanding > 0`).

## Reitatakmarkanir

Engar — þessi skilaboðategund tekur ekki við neinum reitagildum frá kallanda.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Put-away identifier must be specified ...` | Hvorki viðfang né auðkennislykill í JSON-beiðninni. |
| `Warehouse Put-away {id} does not exist.` | Uppgefið SystemId eða No. fannst ekki, eða aðgerðin er ekki af gerðinni Put-away. |
| `Warehouse Activity {n} is not of Type Put-away.` | Aðgerðin er til en er tínsla, hreyfing eða birgðafrágangur (Pick / Movement / Invt. Put-away). |
| `Warehouse Put-away {n} has no lines.` | Hausinn er til en hefur engar línur (á ekki að gerast fyrir frágang sem BC býr til). |
| `Nothing to register.` | Allar línur hafa `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Bókunarhliðið (BIFROST WhsePost ori) hafnaði beiðninni. |

## Gildrur

- **Frágangshausinn hverfur eftir skráningu**: Við `Success` er færslunni í `Warehouse Activity Header` eytt og færsla birtist í `Registered Whse. Activity Hdr.`. Annað kall á `Warehouse.Putaway.Register` með sama `putawayNo` skilar því `Warehouse Put-away {n} does not exist.` — það er merki um árangur, ekki villa. Lestu söguna með `Data.Records.Get` á `Registered Whse. Activity Hdr.` (síað á `Whse. Activity No.`).
- **Sía á gerð aðgerðar**: `Warehouse Activity Header` geymir tínslur, frágang, hreyfingar og birgðafrágang. Útfærslan athugar `Type = Put-away` og hafnar öðru — en gakktu úr skugga um að `putawayNo` / SystemId sem þú sendir sé raunverulega frágangur.
- **Hlutafrágangur krefst `Data.Records.Set` fyrst**: BC fyllir `Qty. to Handle` sjálfkrafa út þegar frágangurinn er stofnaður. Ef starfsmaðurinn kom minna fyrir skaltu uppfæra `Qty. to Handle` á hverri línu með `Data.Records.Set` á `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) áður en kallað er á Register. Núll í `Qty. to Handle` á öllum línum gefur `Nothing to register.`
- **Take- og Place-línur (aðeins í birgðageymslum með hólfum)**: Í birgðageymslum með `Bin Mandatory` / `Directed Put-away and Pick` koma frágangslínur BC í pörum — ein með `Action Type = Take` (úr móttökuhólfinu) og ein með `Action Type = Place` (í geymsluhólfið) fyrir hverja upprunalínu. Þegar `Qty. to Handle` er uppfært skaltu setja **báðar** línurnar á sama gildi, annars hafnar BC skráningunni með `Qty. to Handle (Base) in the line must be equal to ...`. Birgðageymslur án hólfa hafa eina línu fyrir hverja upprunalínu og enga Take/Place-skiptingu.
- **Hólfainnihald uppfærist**: Skráningin bætir í geymsluhólfið og dregur úr móttökuhólfinu gegnum `Whse. Item Tracking` og `Bin Content`. Síðari tínslur á sömu vöru taka úr nýja geymsluhólfinu.
- **Bókunarhlið**: Notandi skilaboðaverksins verður að hafa `BIFROST WhsePost ori` þótt skráning frágangs búi ekki til birgðafærslur — BC lítur samt á hana sem bókunaraðgerð í vöruhúsi.
- **Staða bókuðu upprunamóttökunnar**: Hlutaskráður frágangur skilur línu bókuðu vöruhúsamóttökunnar eftir í `Partially Put Away`. Annað kall á `Warehouse.Putaway.Create` fyrir sömu bókuðu móttöku býr þá til nýjan frágang fyrir útistandandi magn.

## Leiðbeiningar fyrir gervigreindarfulltrúa

Þegar fulltrúi stýrir þessari skilaboðategund:

1. **Röð auðkenna er föst**: Viðfang > `systemId` > `recordSystemId` > `id` > `putawayNo` > `no`. Veldu nákvæmlega eitt.
2. **Geymdu `registeredPutawaySystemId` úr svarinu** ef þú þarft að komast í söguna á eftir — til að finna það út frá `putawayNo` eftir skráningu þarf að fletta upp í `Registered Whse. Activity Hdr.` eftir `Whse. Activity No.`.
3. **Líttu á `Warehouse Put-away {n} does not exist.` fyrir þekktan frágang sem vísbendingu um að hann hafi þegar verið skráður** (aðgerðahausinn fluttist í sögu). Staðfestu með því að lesa `Registered Whse. Activity Hdr.` áður en þú reynir aftur.
4. **Endurtekning**: Þessi skilaboðategund er **ekki** óháð endurtekningu — annað heppnað kall fyrir sama `putawayNo` er ómögulegt því hausinn er horfinn. Notaðu `Registered Whse. Activity Hdr.` til að athuga hvort skráningin hafi þegar farið fram.
5. **Verkflæðinu lýkur**: Við `Success` á síðustu útistandandi línu bókaðrar vöruhúsamóttöku fer línan í `Completely Put Away` og innflæðinu er lokið. Svarið inniheldur `postedWhseReceiptNo` og `postedWhseReceiptSystemId` fyrir síðari fyrirspurnir.

## Verkflæði

1. `Sales.ReturnOrder.Release` (eða losun innkaupapöntunar)
2. `Warehouse.Receipt.Create`
3. `Warehouse.Receipt.Post`
4. `Warehouse.Putaway.Create`
5. **`Warehouse.Putaway.Register`** — þessi skilaboðategund

## Tengdar skilaboðategundir

- `Warehouse.Putaway.Create` — býr til inntakið.
- `Data.Records.Set` á `Warehouse Activity Line` — til að breyta `Qty. to Handle` áður en hlutafrágangur er skráður.
- `Data.Records.Get` — sækir hvaða reit sem er á `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line` sem verður til, eða á upprunalínu í `Posted Whse. Receipt Line`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
