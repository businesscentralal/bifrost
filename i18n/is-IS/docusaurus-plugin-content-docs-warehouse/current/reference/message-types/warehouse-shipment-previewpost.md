---
id: warehouse-shipment-previewpost
title: "Warehouse.Shipment.PreviewPost"
sidebar_label: "Warehouse.Shipment.PreviewPost"
sidebar_position: 10
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Shipment.PreviewPost."
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

Hermir eftir bókun vöruhúsaafhendingar og skilar færslunum sem **yrðu** til — án þess að skrifa neitt í gagnagrunninn. Keyrir `Gen. Jnl.-Post Preview.SetContext + Run()` í BC án notendaviðmóts gegn `Whse.-Post Shipment (Yes/No)`-áskrifandanum, safnar færslunum úr minni með `Posting Preview Event Handler` og telur síðan upp hverja töflu sem fékk færslur úr `FillDocumentEntry`. Dæmigerðar töflur í forskoðun eru `Item Ledger Entry`, `Value Entry`, `Posted Whse. Shipment Header`, `Posted Whse. Shipment Line`, `Sales Shipment Header`, `Sales Shipment Line`, auk `Sales Invoice Header`, `Sales Invoice Line`, `G/L Entry`, `VAT Entry`, `Cust. Ledger Entry` fyrir reikningshlutann. Hver lína er rituð út gegnum `Bifrost Preview Helper` svo að notendur geti valið þá reiti sem þeir þurfa.

**Mikilvægt — reikningsflaggið er fast.** Forskoðunaráskrifandi `Whse.-Post Shipment (Yes/No)` í BC þvingar `Invoice = true` fyrir hermdu bókunina. Þessi skilaboðategund sýnir því alltaf full áhrif **afhendingar + reiknings** óháð stillingum á haus vöruhúsaafhendingarinnar. Reiturinn `invoice` í svarinu er því alltaf `true`.

Skilar `rollback: true` svo að kallendur viti að gagnagrunnurinn var ósnertur. Reiknar líka fyrir fram jafnvægið í gjaldmiðli fyrirtækisins og þau ólíku `Document No.`-gildi fjárhagsfærslna sem myndu birtast í bókunarskránni.

**Stefna**: Inn á við (les eingöngu — öllum breytingum rúllað til baka)  **Efnisgerð**: `text/markdown`

Svarinu er pakkað sem Markdown-skjali utan um afmarkaðan ```json```-kóðabálk svo það birtist beint í spjallbiðlurum; JSON-ið inni í honum er skipulega svarið hér að neðan.

## Röð auðkenningar afhendingar

Fyrsta samsvörun gildir:
1. Eigindið `subject` í umslaginu er GUID → SystemId haussins.
2. Eigindið `subject` í umslaginu er texti sem ekki er tómur → `No.` haussins.
3. `data.systemId` / `data.recordSystemId` / `data.id` → SystemId haussins.
4. `data.shipmentNo` / `data.no` → `No.` haussins.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `shipmentNo` | string | Sjá að ofan | `No.` vöruhúsaafhendingarinnar (Code[20]). |
| `no` | string | Sjá að ofan | Samheiti fyrir `shipmentNo`. |
| `systemId` / `recordSystemId` / `id` | string (GUID) | Sjá að ofan | SystemId á Warehouse Shipment Header. |

### Dæmi um beiðni
```json
{ "shipmentNo": "WS00001" }
```

## Snið svars

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting warehouse shipment WS00001 (2 lines, Ship + Invoice) would create 10 ledger entries across 6 tables. G/L impact is balanced.",
  "shipmentNo": "WS00001",
  "locationCode": "WHITE",
  "invoice": true,
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "USD",
  "predictedNumbers": ["INV00012"],
  "totals": { "balanced": true, "totalDebitLCY": 250.0, "totalCreditLCY": 250.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "-5", "LocationCode": "WHITE" }
        }
      ]
    },
    {
      "tableId": 17,
      "tableName": "G/L Entry",
      "tableCaption": "G/L Entry",
      "entryCount": 4,
      "entries": []
    }
  ]
}
```

### Svarreitir

| Reitur | Gerð | Athugasemdir |
|---|---|---|
| `rollback` | bool | Alltaf `true` fyrir þessa skilaboðategund. |
| `summary` | string | Samantekt í einni línu, læsileg fólki. |
| `shipmentNo` / `locationCode` | string | Auðkennisreitir haussins. |
| `invoice` | bool | Alltaf `true` — forskoðunaráskrifandi BC þvingar afhendingu + reikning. |
| `linesToPost` | int | Línur vöruhúsaafhendingarinnar sem fóru í forskoðunina. |
| `postingDate` | string | `Posting Date` á haus afhendingarinnar. |
| `lcyCode` | string | `GLSetup."LCY Code"`. |
| `predictedNumbers` | string[] | Ólík `Document No.`-gildi í forskoðuðu fjárhagsfærslunum (yfirleitt væntanlegt númer sölureiknings, númer bókaðrar vöruhúsaafhendingar o.s.frv.). Getur innihaldið bókstaflega `"***"` þegar forskoðunarvél BC hylur óúthlutað númer úr númeraröð. |
| `totals.balanced` | bool | `true` þegar `Round(totalDebitLCY - totalCreditLCY, 0.01) = 0`. |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Samtala úr forskoðuðu fjárhagsfærslunum. |
| `preview[]` | array | Eitt stak fyrir hverja færslu- eða bókunarskjalatöflu sem BC myndi skrifa í. |
| `preview[].tableId` / `tableName` | int / string | Auðkenni töflunnar í BC. |
| `preview[].tableCaption` | string | `RecordRef.Caption` töflunnar í BC (skjáheiti). |
| `preview[].entryCount` | int | Fjöldi færslna sem yrðu settar inn í þessa töflu. |
| `preview[].entries[]` | array | Hlutur fyrir hverja færslu með `id` (staðgengils-GUID fyrir SystemId), `primaryKey` (hlutur með heiti aðallykilsreits → gildi) og `fields` (allir útritaðir reitir). Reitaheiti fylgja sömu stöðlun og í `Data.Records.Get` (`.`/`/`/`%`/`"`/`\`/`'` → `_`, önnur tákn sem ekki eru bókstafir eða tölur fjarlægð). `DocumentNo_` í `fields` er oft `"***"` þegar BC hylur óúthlutað númer úr númeraröð. Gerstu áskrifandi að `OnGetPreviewFieldNames` til að stýra því hvaða reitir birtast, og að `OnPrecalculateFlowFields` til að reikna FlowFields fyrir útritun. |

## Dæmi (úr einingaprófunum)

Úr `Whse Ship. Prev. Post Tests` (kóðaeining 95439):
- `PreviewPost_PostableShipment_ReturnsSuccessAndRollback` — staðfestir `status: "Success"`, `rollback: true` og að línur afhendingarinnar séu enn til eftir forskoðunina (ekkert vistað).
- `PreviewPost_PostableShipment_DoesNotPostShipment` — staðfestir að engin færsla í `Posted Whse. Shipment Header` sé í raun vistuð.
- `PreviewPost_PostableShipment_ReturnsContextAndPreviewArray` — staðfestir samhengisreiti afhendingarinnar og að `preview[]` innihaldi að minnsta kosti eina töflu með færslum.

## Villur

**Sannprófunarvillur BC berast orðréttar** til kallanda. Almenna villan neðst er aðeins notuð þegar forskoðunaráskrifandinn keyrir villulaust en safnar engum færslum.

| Villa | Orsök |
|---|---|
| `Warehouse Shipment Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, shipmentNo, no.` (`MissingParameter`) | Ekkert auðkenni í `subject` eða í JSON-beiðninni. |
| `Warehouse Shipment Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Auðkenni var gefið en passar ekki við neina færslu; `parameter` og `received` tilgreina það. Öll auðkenni sem eru gefin eru prófuð. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Tvö auðkenni voru gefin sem vísa á ólíkar færslur. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | SystemId eða færslunúmer sem ekki er hægt að lesa. |
| `Warehouse Shipment {no} has no lines to post.` | Hausinn er til en hefur engar línur. |
| `There is nothing to post because the document does not contain a quantity or amount.` | Allar línur hafa `Qty. to Ship = 0`. Í WMS-birgðageymslum (`Require Pick = true`) gerist þetta þegar engin vöruhúsatínsla hefur enn verið skráð — það er skráning tínslunnar sem fyllir út `Qty. to Ship`. Sjá Athugasemdir um rekstur. |
| `Posting preview failed and no entries were captured. The shipment cannot be posted in its current state.` | Sjaldgæf almenn villa — kemur aðeins þegar BC-áskrifandinn lýkur án villu en skrifar engar færslur. |

## Athugasemdir um rekstur

- **WMS-birgðageymslur krefjast skráðrar tínslu fyrst.** Í birgðageymslu með `Require Pick = true` (t.d. CRONUS `WHITE` / `GULUR`) byrja línur vöruhúsaafhendingarinnar með `Qty. to Ship = 0`. Vöruhúsatínsluna verður að stofna **og skrá** fyrir forskoðun — það er skráning tínslunnar sem skrifar `Qty. to Ship` aftur á línur afhendingarinnar.
- **Birgðageymslur með `Require Shipment = true` og `Require Pick = false`** haga sér eins og einfalt afhendingarferli: `Qty. to Ship` er fyllt út þegar lína afhendingarinnar er stofnuð, svo forskoðunin keyrir beint án tínsluskrefs.
- **Reikningsflaggið er fast á `true`.** Áhrif afhendingar + reiknings eru alltaf sýnd, óháð því hvernig þú myndir bóka í raun. Til að forskoða eingöngu afhendingu skaltu nota bókunarforskoðun upprunaskjalsins sjálfs (t.d. `Sales.Order.PreviewPost` þegar hún er komin), eða bóka afhendinguna með `Warehouse.Shipment.Post` eftir að tínslur hafa verið skráðar.

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — stofnar vöruhúsaafhendingu úr upprunaskjali.
- `Warehouse.Shipment.Post` — bókar í raun (með eða án reiknings).
- `Finance.GeneralJournal.PreviewPost` — sama mynstur fyrir færslubók fjárhags.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
