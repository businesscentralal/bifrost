---
id: warehouse-shipment-create
title: "Warehouse.Shipment.Create"
sidebar_label: "Warehouse.Shipment.Create"
sidebar_position: 8
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Shipment.Create."
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

Stofnar eina vöruhúsaafhendingu fyrir hvert upprunaskjal sem sent er. Keyrir `Get Source Doc. Outbound` í BC (kóðaeining 5752) — hver sölupöntun eða millifærslupöntun á útleið býr til sinn eigin `Warehouse Shipment Header` í birgðageymslu upprunans.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Forsendur birgðageymslu

`Location Code` upprunaskjalsins verður að vísa á birgðageymslu þar sem `Require Shipment = true`. Annars býr BC til skjölin beint úr sölupöntuninni / millifærslupöntuninni án þess að fara gegnum vöruhúsaafhendingu.

Frekari hegðun eftir uppsetningu birgðageymslunnar:

| Stillingar birgðageymslu | Áhrif á línu vöruhúsaafhendingar |
|---|---|
| `Require Shipment = true`, `Require Pick = false` | `Qty. to Ship` er fyllt út úr upprunalínunni. Hægt er að keyra `Warehouse.Shipment.Post` strax. |
| `Require Shipment = true`, `Require Pick = true` | `Qty. to Ship` byrjar í 0. Stofnaðu og skráðu vöruhúsatínslu með `Warehouse.Pick.Create` og síðan `Warehouse.Pick.Register` áður en `Warehouse.Shipment.Post` samþykkir skjalið. BC hindrar að `Qty. to Ship` sé sett handvirkt (`Qty. to Ship must not be greater than 0 units ...`). |
| `Directed Put-away and Pick = true` (t.d. WMS-birgðageymsla með skyldubundnum hólfum) | Eins og Require Pick — notaðu `Warehouse.Pick.Create` og síðan `Warehouse.Pick.Register` fyrir bókun. |

### Leit — finna birgðageymslur sem krefjast afhendingar

Notaðu `Data.Records.Get` á `Location` (tafla 14) með `tableView` `WHERE(Require Shipment=CONST(true))` til að telja upp möguleikana. Skoðaðu reitina `RequirePick` og `DirectedPutawayandPick` til að sjá fyrir hvort bókun krefjist skráðrar tínslu.

## Endurtekning og öryggi

- Ekki óháð endurtekningu: hvert kall setur inn nýja `Warehouse Shipment Header` úr viðeigandi númeraröð.
- Hvert upprunaskjal býr til sérstakan haus (hefðbundin hegðun BC).
- Upprunaskjöl sem eru þegar á opinni vöruhúsaafhendingu, eiga ekkert magn eftir til afhendingar eða eru með virka tínslu mistakast með `No Warehouse Shipment was created`.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `sourceDocuments` | array | **Já** | Ein eða fleiri færslur á forminu `{ sourceType, documentNo }`. |
| `sourceDocuments[].sourceType` | string | **Já** | `SalesOrder` eða `TransferOrder` (óháð há- og lágstöfum). |
| `sourceDocuments[].documentNo` | code[20] | **Já** | `No.` upprunaskjalsins. |
| `locationCode` | code[10] | Nei | Ef það er sent er sannreynt að allir upprunar noti sömu birgðageymslu. Háð skrifatakmörkun á `Warehouse Shipment Header."Location Code"`. |
| `assignedUserId` | code[50] | Nei | Sett á hvern haus eftir að hann er stofnaður. |
| `postingDate` | date | Nei | `YYYY-MM-DD`. Ef því er sleppt breytist bókunardagsetning haussins ekki. Ógilt gildi veldur villu. |

### Dæmi um beiðni
```json
{
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "SalesOrder", "documentNo": "1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Snið svars

```json
{
  "status": "Success",
  "noOfShipments": 2,
  "shipments": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WS001001",
      "locationCode": "WHITE",
      "assignedUserId": "ADMIN",
      "sourceType": "SalesOrder",
      "sourceDocumentNo": "1001",
      "linesCreated": 3
    }
  ]
}
```

## Bókunarhlið

Ekkert — stofnun bókar ekki. Fylgitegundin `Warehouse.Shipment.Post` krefst heimildasafnsins `BIFROST WhsePost ori`.

## Reitatakmarkanir

- `Warehouse Shipment Header."Location Code"` — ef `locationCode` er sent meðan skrifað er takmarkað á þennan reit er beiðninni hafnað.

## Villur

| Villa | Orsök |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Fylkið vantar í beiðnina eða það er tómt. |
| `Source #{n} is missing sourceType or documentNo (both required).` | Gildi vantar í eina færsluna. |
| `Unsupported sourceType '{value}'. Expected: SalesOrder, TransferOrder.` | Upprunagerðin er óþekkt. |
| `Sales Order/Transfer Order '{no}' not found.` | Skjalið er ekki til. |
| `... is not Released.` | Upprunann verður að losa áður en vöruhúsaafhending er stofnuð. |
| `... uses location '{x}' which does not match the requested locationCode '{y}'.` | Þegar `locationCode` er sent sem sía. |
| `Location '{x}' (from ...) does not require shipment routing` | Birgðageymslan hefur `Require Shipment = false`. |
| `No Warehouse Shipment was created for ...` | Upprunaskjalið er þegar á afhendingu, ekkert magn er eftir eða tínsla er virk. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` lokar á `locationCode`. |

## Verkflæði frá upphafi til enda

Nákvæm röð frá viðskiptamanni að bókaðri afhendingu (gildi úr sýnigögnum í anda CRONUS).

1. **Stofna sölupöntunina** — `Sales.Document.Create`
```json
{ "documentType": "Order", "no": "10000" }
```
Geymdu `result[0].primaryKey.No_` (t.d. `"101028"`).

2. **Bæta við sölulínu í birgðageymslu sem krefst afhendingar** — `Data.Records.Set` á töflu `37` (`Sales Line`).
```json
{
  "tableName": "Sales Line",
  "data": [{
    "primaryKey": { "DocumentType": "Order", "DocumentNo_": "101028", "LineNo_": 10000 },
    "fields": { "Type": "Item", "No_": "1896-S", "LocationCode": "GULUR", "Quantity": 2 }
  }]
}
```

3. **Losa pöntunina** — `Sales.Document.Release`
```json
{ "orderNo": "101028" }
```

4. **Stofna vöruhúsaafhendinguna** — `Warehouse.Shipment.Create`
```json
{ "sourceDocuments": [ { "sourceType": "SalesOrder", "documentNo": "101028" } ] }
```
Geymdu `shipments[0].no` (t.d. `"SH000004"`).

5. **Ef birgðageymslan krefst tínslu** — kallaðu á `Warehouse.Pick.Create` fyrir `SH000004`, breyttu eftir þörfum `Qty. to Handle` á línum með `Data.Records.Set` á `Warehouse Activity Line`, og kallaðu svo á `Warehouse.Pick.Register`. Báðum skilaboðategundunum er lýst sérstaklega.

6. **Bóka afhendinguna** — `Warehouse.Shipment.Post`
```json
{ "shipmentNo": "SH000004", "invoice": false }
```

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Post` — bókar vöruhúsaafhendinguna sem var stofnuð.
- `Data.Records.Get` — sækir hvaða reit sem er á `Warehouse Shipment Header` / `Warehouse Shipment Line` sem verður til.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
