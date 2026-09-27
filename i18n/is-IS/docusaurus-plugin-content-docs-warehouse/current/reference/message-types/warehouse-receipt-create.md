---
id: warehouse-receipt-create
title: "Warehouse.Receipt.Create"
sidebar_label: "Warehouse.Receipt.Create"
sidebar_position: 5
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Receipt.Create."
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

Stofnar eina vöruhúsamóttöku fyrir hvert upprunaskjal sem sent er. Keyrir `Get Source Doc. Inbound` í BC (kóðaeining 5751) — hver vöruskilapöntun, innkaupapöntun eða millifærslupöntun á innleið býr til sinn eigin `Warehouse Receipt Header` í móttökubirgðageymslu upprunans.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Forsendur birgðageymslu

Móttökubirgðageymsla upprunaskjalsins verður að hafa `Require Receive = true`. Annars býr BC til bókuð skjöl beint úr upprunanum án þess að fara gegnum vöruhúsamóttöku.

Hvernig móttökubirgðageymslan er fundin:

| Upprunagerð | Móttökubirgðageymsla |
|---|---|
| `SalesReturnOrder` | `Sales Header.Location Code` |
| `PurchaseOrder` | `Purchase Header.Location Code` |
| `TransferOrder` | `Transfer Header."Transfer-to Code"` |

Frekari hegðun eftir uppsetningu birgðageymslunnar:

| Stillingar birgðageymslu | Áhrif á línu vöruhúsamóttöku |
|---|---|
| `Require Receive = true`, `Require Put-away = false` | `Qty. to Receive` er fyllt út úr upprunalínunni. Hægt er að keyra `Warehouse.Receipt.Post` strax. |
| `Require Receive = true`, `Require Put-away = true` | Eftir bókun móttökunnar verður vöruhúsafrágangur sjálfkrafa til. Móttakan sjálf bókast samt án vandkvæða. |
| `Directed Put-away and Pick = true` (t.d. WMS-birgðageymsla með skyldubundnum hólfum) | Bin Code verður að vera sett á línu vöruhúsamóttökunnar fyrir bókun. |

### Leit — finna birgðageymslur sem krefjast móttöku

Notaðu `Data.Records.Get` á `Location` (tafla 14) með `tableView = "WHERE(Require Receive=CONST(true))"` til að telja upp möguleikana. Skoðaðu `RequirePutaway`, `DirectedPutawayandPick` og `BinMandatory` í hverri línu til að sjá fyrir kröfur um frágang eða hólf síðar í ferlinu.

## Endurtekning og öryggi

- Ekki óháð endurtekningu: hvert kall setur inn nýja `Warehouse Receipt Header` úr viðeigandi númeraröð.
- Hvert upprunaskjal býr til sérstakan haus (hefðbundin hegðun BC).
- Upprunaskjöl sem eru þegar á opinni vöruhúsamóttöku, eiga ekkert magn eftir til móttöku eða eru með virkan frágang mistakast með `No Warehouse Receipt was created`.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `sourceDocuments` | array | **Já** | Ein eða fleiri færslur á forminu `{ sourceType, documentNo }`. |
| `sourceDocuments[].sourceType` | string | **Já** | `SalesReturnOrder`, `PurchaseOrder` eða `TransferOrder` (óháð há- og lágstöfum). |
| `sourceDocuments[].documentNo` | code[20] | **Já** | `No.` upprunaskjalsins. |
| `locationCode` | code[10] | Nei | Ef það er sent er sannreynt að allir upprunar noti sömu móttökubirgðageymslu. Háð skrifatakmörkun á `Warehouse Receipt Header."Location Code"`. |
| `assignedUserId` | code[50] | Nei | Sett á hvern haus eftir að hann er stofnaður. |
| `postingDate` | date | Nei | `YYYY-MM-DD`. Ef því er sleppt breytist bókunardagsetning haussins ekki. Ógilt gildi veldur villu. |

### Dæmi um beiðni
```json
{
  "locationCode": "GREEN",
  "assignedUserId": "ADMIN",
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder", "documentNo": "PO-1001" },
    { "sourceType": "TransferOrder", "documentNo": "T-2001" }
  ]
}
```

## Snið svars

```json
{
  "status": "Success",
  "noOfReceipts": 2,
  "receipts": [
    {
      "recordSystemId": "00000000-0000-0000-0000-000000000000",
      "no": "WR001001",
      "locationCode": "GREEN",
      "assignedUserId": "ADMIN",
      "sourceType": "PurchaseOrder",
      "sourceDocumentNo": "PO-1001",
      "linesCreated": 3
    }
  ]
}
```

## Bókunarhlið

Ekkert — stofnun bókar ekki. Fylgitegundin `Warehouse.Receipt.Post` krefst heimildasafnsins `BIFROST WhsePost ori`.

## Reitatakmarkanir

- `Warehouse Receipt Header."Location Code"` — ef `locationCode` er sent meðan skrifað er takmarkað á þennan reit er beiðninni hafnað.

## Villur

Orðalagið hér að neðan er nákvæmlega sá texti sem útfærslan skilar (staðfest í keyrslu).

| Villa | Orsök |
|---|---|
| `sourceDocuments is required and must contain at least one entry.` | Fylkið vantar í beiðnina eða það er tómt. |
| `Source #{n} is missing sourceType or documentNo (both required).` | Gildi vantar í eina færsluna. |
| `Unsupported sourceType '{value}'. Expected: SalesReturnOrder, PurchaseOrder, TransferOrder.` | Upprunagerðin er óþekkt. |
| `Sales Return / Purchase / Transfer Order '{no}' not found.` | Skjalið er ekki til. |
| `Purchase Order '{no}' is not Released. Release it before creating a Warehouse Receipt.` | Upprunann verður að losa fyrst. (Afbrigðin fyrir `Sales Return Order` / `Transfer Order` eru eins orðuð.) |
| `... uses/receives at location '{x}' which does not match the requested locationCode '{y}'.` | Þegar `locationCode` er sent sem sía. |
| `Location '{x}' (from/Transfer-to on ...) does not require receipt routing` | Birgðageymslan hefur `Require Receive = false`. |
| `No Warehouse Receipt was created for {sourceType} '{no}' — already on an open receipt, no lines remain to receive, or put-away already started.` | Samsett orsök: upprunaskjalið er á opinni vöruhúsamóttöku, hefur verið að fullu móttekið eða er með virkan frágang. (Kemur líka þegar innkaupapöntunin hefur áður verið að fullu móttekin gegnum bókaða vöruhúsamóttöku.) |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` lokar á `locationCode`. |

## Verkflæði frá upphafi til enda

Dæmigerð röð til að taka á móti innkaupapöntun gegnum vöruhúsið:

1. **Stofna innkaupapöntunina** — `Purchase.Document.Create` (eða `Data.Records.Set` á `Purchase Header`).
2. **Bæta við innkaupalínum í birgðageymslu sem krefst móttöku** — `Data.Records.Set` á töflu `39` (`Purchase Line`).
3. **Losa innkaupapöntunina** — `Purchase.Document.Release`.
4. **Stofna vöruhúsamóttökuna** — `Warehouse.Receipt.Create` (þessi skilaboðategund).
5. (Valfrjálst) Breyta `Qty. to Receive` á línum vöruhúsamóttökunnar með `Data.Records.Set` ef ætlunin er að taka við hluta.
6. **Bóka vöruhúsamóttökuna** — `Warehouse.Receipt.Post`. Þetta býr til færslur í Posted Whse. Receipt og Posted Purchase Receipt og eykur birgðir.
7. (Valfrjálst) Notaðu `Warehouse.Receipt.Post.Preview` milli skrefa 5 og 6 til að sjá áætlaðar færslur án þess að neitt sé vistað.

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — bókar vöruhúsamóttökuna sem var stofnuð.
- `Warehouse.Receipt.Post.Preview` — hermir eftir bókuninni og sýnir færslurnar sem yrðu til.
- `Warehouse.Shipment.Create` / `Warehouse.Shipment.Post` — hliðstæðurnar á útleið.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
