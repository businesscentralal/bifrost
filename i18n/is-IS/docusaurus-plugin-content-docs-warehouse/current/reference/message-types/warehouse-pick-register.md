---
id: warehouse-pick-register
title: "Warehouse.Pick.Register"
sidebar_label: "Warehouse.Pick.Register"
sidebar_position: 2
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Pick.Register."
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

Skráir vöruhúsatínslu. Keyrir BC-kóðaeiningu 7307 `Whse.-Activity-Register`. Eftir skráningu fá upprunalínurnar í `Warehouse Shipment Line` tínda magnið (`Qty. Picked` og `Qty. to Ship`), tínsluhausinn flyst í sögu (`Registered Whse. Activity Hdr.`) og vöruhúsaafhendingin sem tínslan kom frá verður tæk fyrir `Warehouse.Shipment.Post`.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Bókunarhlið

Krefst `Bifrost Posting Type::Warehouse` — þ.e. heimildasafnsins `BIFROST WhsePost ori` á notanda skilaboðaverksins. Án þess skilar beiðnin villusvari og ekkert er skráð.

## Auðkenning vöruhúsatínslunnar

Tilgreindu tínsluna með Bifröst-viðfanginu (GUID = SystemId aðgerðahaussins, eða texti = `No.`) eða með einum af þessum lyklum í JSON-beiðninni:

| Lykill | Merking |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId á `Warehouse Activity Header` (Type = Pick). |
| `pickNo` / `no` | `No.` á `Warehouse Activity Header` (Type = Pick). |

## Forsenda: línur verða að hafa Qty. to Handle

BC skráir aðeins það sem starfsmaður vöruhússins hefur staðfest að sé tínt. Sjálfgefið fyllir `Warehouse.Pick.Create` út `Qty. to Handle` á hverri línu (sjálfgefna gildið `doNotFillQtyToHandle = false` í BC-skýrslunni). Ef kallað er á `Warehouse.Pick.Register` fyrir tínslu þar sem `Qty. to Handle` er núll á öllum línum kemur BC-villan `Nothing to register.`

Til að skrá hlutatínslu skaltu fyrst kalla á `Data.Records.Set` á `Warehouse Activity Line` og uppfæra `Qty. to Handle` á hverri línu.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `pickNo` | code[20] | Eitt auðkenni áskilið | Eða notaðu `no` / `systemId` / viðfang. |

### Dæmi um beiðni
```json
{ "pickNo": "WPK000123" }
```

## Snið svars

```json
{
  "status": "Success",
  "pickNo": "WPK000123",
  "linesRegistered": 4,
  "totalQtyRegistered": 12,
  "shipmentNo": "WS001001",
  "shipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "registeredPickNo": "RWPK000123",
  "registeredPickSystemId": "00000000-0000-0000-0000-000000000000",
  "shipmentLines": [
    {
      "shipmentNo": "WS001001",
      "lineNo": 10000,
      "sourceDocument": "Sales Order",
      "sourceNo": "101028",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 2,
      "qtyPicked": 2,
      "qtyToShip": 2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK000123 (4 lines) registered against Warehouse Shipment WS001001."
}
```

`qtyOutstanding` fylgir `Warehouse Shipment Line."Qty. Outstanding"` í BC — það er `Quantity - Qty. Shipped`. Skráning tínslu afhendir **ekki**, svo `qtyOutstanding` helst jafnt `Quantity` línunnar þar til `Warehouse.Shipment.Post` keyrir.

## Reitatakmarkanir

Engar — þessi skilaboðategund tekur ekki við neinum reitagildum frá kallanda.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Pick identifier must be specified ...` | Hvorki viðfang né auðkennislykill í JSON-beiðninni. |
| `Warehouse Pick {id} does not exist.` | Uppgefið SystemId eða No. fannst ekki, eða aðgerðin er ekki af gerðinni Pick. |
| `Warehouse Activity {n} is not of Type Pick.` | Aðgerðin er til en er frágangur, hreyfing eða birgðatínsla (Put-away / Movement / Invt. Pick). |
| `Warehouse Pick {n} has no lines.` | Hausinn er til en hefur engar línur (á ekki að gerast fyrir tínslur sem BC býr til). |
| `Nothing to register.` | Allar línur hafa `Qty. to Handle = 0`. |
| `Posting type {x} is not allowed for this user.` | Bókunarhliðið (BIFROST WhsePost ori) hafnaði beiðninni. |

## Gildrur

- **Tínsluhausinn hverfur eftir skráningu**: Við `Success` er færslunni í `Warehouse Activity Header` eytt og færsla birtist í `Registered Whse. Activity Hdr.`. Annað kall á `Warehouse.Pick.Register` með sama `pickNo` skilar því `Warehouse Pick {n} does not exist.` — það er merki um árangur, ekki villa. Lestu söguna með `Data.Records.Get` á `Registered Whse. Activity Hdr.` (síað á `Whse. Activity No.`).
- **Sía á gerð aðgerðar**: `Warehouse Activity Header` geymir tínslur, frágang, hreyfingar og birgðatínslur. Útfærslan athugar `Type = Pick` og hafnar öðru — en gakktu úr skugga um að `pickNo` / SystemId sem þú sendir sé raunverulega tínsla.
- **Hlutatínsla krefst `Data.Records.Set` fyrst**: BC fyllir `Qty. to Handle` sjálfkrafa út þegar tínslan er stofnuð. Ef starfsmaðurinn tíndi minna skaltu uppfæra `Qty. to Handle` á hverri línu með `Data.Records.Set` á `Warehouse Activity Line` (primaryKey = `Activity Type`, `No.`, `Line No.`) áður en kallað er á Register. Núll í `Qty. to Handle` á öllum línum gefur `Nothing to register.`
- **Bæði Take- og Place-línur**: Tínslulínur í BC koma í pörum — ein með `Action Type = Take` og ein með `Action Type = Place` fyrir hverja upprunalínu. Þegar `Qty. to Handle` er uppfært skaltu setja **báðar** línurnar á sama gildi, annars hafnar BC skráningunni með `Qty. to Handle (Base) in the line must be equal to ...`.
- **Upprunaafhendingin verður enn að vera losuð**: Ef `Warehouse Shipment` sem tínslan kom frá var eytt eða opnuð aftur eftir að tínslan var stofnuð mistekst skráningin. Útfærslan skilar villutexta BC orðrétt með `GetLastErrorText`.
- **Bókunarhlið**: Notandi skilaboðaverksins verður að hafa `BIFROST WhsePost ori` þótt skráningin búi ekki til birgðafærslur — BC lítur samt á hana sem bókunaraðgerð í vöruhúsi.
- **Afhendir ekki**: Skráningin uppfærir aðeins `Qty. Picked` og `Qty. to Ship` á línu vöruhúsaafhendingarinnar — `Qty. Outstanding` breytist ekki fyrr en `Warehouse.Shipment.Post` keyrir.

## Leiðbeiningar fyrir gervigreindarfulltrúa

Þegar fulltrúi stýrir þessari skilaboðategund:

1. **Röð auðkenna er föst**: Viðfang > `systemId` > `recordSystemId` > `id` > `pickNo` > `no`. Veldu nákvæmlega eitt.
2. **Geymdu `registeredPickSystemId` úr svarinu** ef þú þarft að komast í söguna á eftir — til að finna það út frá `pickNo` eftir skráningu þarf að fletta upp í `Registered Whse. Activity Hdr.` eftir `Whse. Activity No.`.
3. **Líttu á `Warehouse Pick {n} does not exist.` fyrir þekkta tínslu sem vísbendingu um að hún hafi þegar verið skráð** (aðgerðahausinn fluttist í sögu). Staðfestu með því að lesa `Registered Whse. Activity Hdr.` áður en þú reynir aftur.
4. **Endurtekning**: Þessi skilaboðategund er **ekki** óháð endurtekningu — annað heppnað kall fyrir sama `pickNo` er ómögulegt því hausinn er horfinn. Notaðu `Registered Whse. Activity Hdr.` til að athuga hvort skráningin hafi þegar farið fram.
5. **Framhald verkflæðis**: Við `Success` er vöruhúsaafhendingin tilbúin fyrir `Warehouse.Shipment.Post`. Svarið inniheldur `shipmentNo` og `shipmentSystemId` fyrir það kall.

## Verkflæði

1. `Sales.Document.Release` (eða losun millifærslupöntunar)
2. `Warehouse.Shipment.Create`
3. `Warehouse.Pick.Create`
4. **`Warehouse.Pick.Register`** — þessi skilaboðategund
5. `Warehouse.Shipment.Post`

## Tengdar skilaboðategundir

- `Warehouse.Pick.Create` — býr til inntakið.
- `Warehouse.Shipment.Post` — kallaðu á hana eftir skráningu til að afhenda vöruhúsaafhendinguna.
- `Data.Records.Set` á `Warehouse Activity Line` — til að breyta `Qty. to Handle` áður en hlutatínsla er skráð.
- `Data.Records.Get` — sækir hvaða reit sem er á `Registered Whse. Activity Hdr.` / `Registered Whse. Activity Line` sem verður til.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
