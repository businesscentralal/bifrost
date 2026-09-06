---
id: inventory
title: "Inventory message types"
sidebar_position: 6
---

Þetta skjal lýsir skilaboðategundum tengdum birgðum í Bifröst Foundation.

## Yfirlit

Skilaboðategundir fyrir birðir bjóða upp á virkni til að vinna með vörudagbækur (stofnun lína, sannvottun, bókun), tilfærsluskjöl (stofnun, útgáfu, opnun aftur, bókun, forskoðun bókunar, tölfræði), samsetningarpantanir og vöruhús-sendingar (stofnun úr útgefnum frumskjölum, bókun með valkvæðum reikning).

## Listi yfir skilaboðategundir

| Skilaboðategund | Stefna | Tilgangur |
|----------------|--------|-----------|
| [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline) | Innlæg | Stofnar nýja vörudagbókarlínu með sjálfgefnum gildum |
| [Inventory.ItemJournal.Check](#inventoryitemjournalcheck) | Útlæg | Sannvirðir vörudagbókarrunu og skilar stöðu |
| [Inventory.ItemJournal.Post](#inventoryitemjournalpost) | Innlæg | Bókar vörudagbókarrunu og skilar tölfræði |
| [Inventory.ItemJournal.PreviewPost](#inventoryitemjournalpreviewpost) | Innlæg | Hermir bókun á vörudagbókarrunu og skilar spáðum færslum (afturkallað) |
| [Inventory.TransferOrder.Create](#inventorytransferordercreate) | Innlæg | Stofnar nýtt tilfærsluskjal (haus) |
| [Inventory.TransferOrder.Release](#inventorytransferorderrelease) | Innlæg | Gefur út tilfærsluskjal (Opið → Útgefið) |
| [Inventory.TransferOrder.Reopen](#inventorytransferorderreopen) | Innlæg | Opnar útgefið tilfærsluskjal aftur (Útgefið → Opið) |
| [Inventory.TransferOrder.Post](#inventorytransferorderpost) | Innlæg | Bókar tilfærsluskjal (sending, móttaka, eða beina tilfærslu) |
| [Inventory.TransferOrder.PreviewPost](#inventorytransferorderpreviewpost) | Innlæg | Hermir bókun og skilar spáðum færslum (afturkallað) |
| [Inventory.TransferOrder.Statistics](#inventorytransferorderstatistics) | Útlæg | Skilar magni, pökkum, þyngd og rúmmáli |
| [Inventory.AssemblyOrder.Create](#inventoryassemblyordercreate) | Innlæg | Stofnar nýjan samsetningarpöntunarhaus fyrir vörueiningu |
| [Inventory.AssemblyOrder.RefreshLines](#inventoryassemblyorderrefreshlines) | Innlæg | Endurnýjar BOM-línur á samsetningarpöntun |
| [Inventory.AssemblyOrder.Release](#inventoryassemblyorderrelease) | Innlæg | Losar samsetningarpöntun (Opin → Losuð) |
| [Inventory.AssemblyOrder.Reopen](#inventoryassemblyorderreopen) | Innlæg | Opnar aftur losaða samsetningarpöntun (Losuð → Opin) |
| [Inventory.AssemblyOrder.Post](#inventoryassemblyorderpost) | Innlæg | Bókar samsetningarpöntun, stofnar fullbúna vöru og dregur úr íhlutum |
| [Inventory.AssemblyOrder.PreviewPost](#inventoryassemblyorderpreviewpost) | Innlæg | Hermir eftir bókun og skilar væntum hreyfingum (afturkallað) |
| [Inventory.AssemblyOrder.Statistics](#inventoryassemblyorderstatistics) | Útlæg | Skilar kostnaðartölum (efni, auðlindir, álag, vænt vs. raun) |
| [Warehouse.Shipment.Create](#warehouseshipmentcreate) | Innlæg | Stofnar vöruhús-sendingu(ar) úr útgefnum frumskjölum (sölupöntun, útflutningstilfærsla) |
| [Warehouse.Shipment.Post](#warehouseshipmentpost) | Innlæg | Bókar vöruhús-sendingu (sendir, valkvætt einnig reikningar) |
| [Warehouse.Pick.Create](#warehousepickcreate) | Innlæg | Stofnar vöruhústínslu úr vöruhúss-sendingu (notar BC skýrslu 7318) |
| [Warehouse.Pick.Register](#warehousepickregister) | Innlæg | Skráir vöruhústínslu (notar BC kóðaeiningu 7307); kûar Warehouse Posting ori |
| [Warehouse.Putaway.Create](#warehouseputawaycreate) | Innlæg | Stofnar vöruhúsiðstaf (Put-away) frá bókaðri vöruhúsmóttöku (notar BC skýrslu 7305) |
| [Warehouse.Putaway.Register](#warehouseputawayregister) | Innlæg | Skráir vöruhúsiðstaf (notar BC kóðaeiningu 7307); kûar Warehouse Posting ori |
| [Warehouse.Receipt.Create](#warehousereceiptcreate) | Innlæg | Stofnar vöruhús-móttöku(r) úr útgefnum frumskjölum (innkaupapöntun, vöruskil úr sölu, innflutningstilfærsla) |
| [Warehouse.Receipt.Post](#warehousereceiptpost) | Innlæg | Bókar vöruhús-móttöku |
| [Warehouse.Receipt.Post.Preview](#warehousereceiptpostpreview) | Innlæg | Hermir eftir bókun á vöruhús-móttöku og skilar áætluðum færslum (afturkallað) |
| [Warehouse.Shipment.PreviewPost](#warehouseshipmentpreviewpost) | Innlæg | Hermir bókun á vöruhús-sendingu (Sending + Reikningur) og skilar spáðum færslum (afturkallað) |

---

## Inventory.ItemJournal.SetupNewLine

**Stefna**: Innlæg (stofnar nýja dagbókarlínu)

**Tilgangur**: Stofnar og setur inn nýja vörudagbókarlínu í tilgreindri runu, með sjálfgefnum gildum úr BC `SetUpNewLine` ferli. Þetta er sjálfgefin leið til að undirbúa vörudagbókarlínu áður en viðskiptaupplýsingar eru fylltar út með `Data.Records.Set`.

Sjálfgefin gildi sem erfast frá sniðmáti og runu eru meðal annars færslutegund (Entry Type), bókunardagsetning og sviðstýringarháð gildi. Ef númeraröð er stillt á rununa er skjalanúmerið fyllt út úr næsta númeri í röðinni. Línan fær næsta Line No. (síðasta lína + 10000, eða 10000 ef runan er tóm).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "ITEM|DEFAULT",
  "data": {}
}
```

#### Auðkenning vörudagbókarrunu

1. **Rör-aðskilið í subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId í subject**: `"subject": "guid-without-braces"`
3. **JSON-gagnafæribreytur**:
```json
{
  "data": {
    "templateName": "ITEM",
    "batchName": "DEFAULT"
  }
}
```

JSON-gagnafæribreytur hafa forgang yfir subject-reitinn.

#### Valkvæðar færibreytur

| Færibreyta | Tegund | Sjálfgefið | Lýsing |
|-----------|--------|-----------|--------|
| `fieldNumbers` | int[] | öll svið | Svið sem á að taka með í svari |
| `noOfLines` | integer | 1 | Fjöldi lína sem á að stofna (1–100) |
| `clearExistingLines` | boolean | false | Þegar `true`, eyðir öllum línum í runu fyrst |

### Snið svars

Notar sama snið og `Data.Records.Get`.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "ITEM",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": { "..." }
    }
  ]
}
```

### Dæmigert vinnuferli

1. Kalla á `Inventory.ItemJournal.SetupNewLine` til að stofna línur með sjálfgefnum gildum.
2. Nota `id` úr svarinu með `Data.Records.Set` til að fylla út vörunúmer, magn, einingarkostnað o.s.frv.
3. Kalla á `Inventory.ItemJournal.Check` til að sannvotta.
4. Kalla á `Inventory.ItemJournal.Post` til að bóka.

### Tengdar skilaboðategundir

- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck)
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)

---

## Inventory.ItemJournal.Check

**Stefna**: Útlæg (eingöngu sannvottun)

**Tilgangur**: Sannvirðir vörudagbókarrunu án þess að bóka. Skilar stöðu á tilbúningi og ítarlegum niðurstöðum.

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "ITEM|DEFAULT",
  "data": {}
}
```

Auðkenning fylgir sömu þremur aðferðum.

### Snið svars

#### Ready
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Item Batch",
  "lineCount": 2,
  "totalQuantity": 50.0,
  "totalAmount": 12500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings / NotReady

Sama snið með `validationResult` viðeigandi og útfylltum `errors` / `warnings` fylkjum.

### Sviðin í svari

| Svið | Tegund | Lýsing |
|------|--------|--------|
| `status` | string | Alltaf "Success" fyrir sannvottun |
| `validationResult` | string | "Ready", "ReadyWithWarnings" eða "NotReady" |
| `templateName` | string | Heiti sniðmáts |
| `batchName` | string | Heiti runu |
| `batchDescription` | string | Lýsing runu |
| `lineCount` | integer | Fjöldi lína í runu |
| `totalQuantity` | decimal | Samtala magns |
| `totalAmount` | decimal | Samtala upphæða |
| `errorCount` | integer | Fjöldi villna sem hindra bókun |
| `warningCount` | integer | Fjöldi viðvarana (hindra ekki bókun) |
| `errors` | array | Villuskilaboð |
| `warnings` | array | Viðvörunarskilaboð |

### Sannvottunarreglur

Notar BC "Item Jnl.-Check Line" einingu í gegnum Error Message Management ramma til að safna öllum villum í einu yfirferð.

**Sannvottun á hverri línu:**
- Nauðsynleg svið (bókunardagsetning, skjalanúmer, vörunúmer, magn ≠ 0)
- Bókunartímabil
- Vörur: Verða að vera til og ekki læstar
- Staðsetningar/úthlutunarkóðar/sviðsstýringar þar sem við á

**Viðvaranir (hindra ekki bókun):**
- Framtíðar bókunardagsetningar gefa viðvörun

### Tengdar skilaboðategundir

- [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline)
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost)

---

## Inventory.ItemJournal.Post

**Stefna**: Innlæg (breytir gögnum — bókar runu og hreinsar línur)

**Tilgangur**: Bókar sannvottaða vörudagbókarrunu og býr til vörufærslur (Item Ledger Entries).

### Snið beiðni

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "ITEM|BATCH001",
  "data": {}
}
```

Auðkenning fylgir sömu þremur aðferðum.

### Snið svars

#### Árangur
```json
{
  "status": "Success",
  "templateName": "ITEM",
  "batchName": "BATCH001",
  "batchDescription": "Default Item Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 50.0,
  "totalAmount": 12500.0,
  "itemRegisterNo": 13,
  "itemRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 201,
  "toEntryNo": 202
}
```

#### Villa
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Athugasemdir

- Notar BC "Item Jnl.-Post Batch" einingu fyrir bókun.
- Allar línur eru hreinsaðar úr runu eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu þannig að villur skila byggðu svari með `callstack`.

**Ráðlögð aðferð:** Sannvotta með `Inventory.ItemJournal.Check` áður, bóka síðan með `Inventory.ItemJournal.Post`.

### Tengdar skilaboðategundir

- [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline)
- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck)

---

## Inventory.ItemJournal.PreviewPost

**Stefna**: Innlæg (hermir bókun, engin gögn breytast)

**Tilgangur**: Hermir bókun á vörudagbókarrunu og skilar þeim færslum sem **myndu** verða til — án þss að vista neitt í gagnagrunninn. Beitir BC `Gen. Jnl.-Post Preview.SetContext + Run()` höfuðlausu flæði gegn `Item Jnl.-Post` áskrifanda. Töflur sem oftast eru fangaðar: `Item Ledger Entry`, `Value Entry` og (fyrir runur sem skila fjárhagsáhrifum) `G/L Entry` og `VAT Entry`.

### Innlögð gildi

Auðkenning runu (fyrsta samsvarandi vinnur):

| Aðferð | Subject-svið | Data-svið |
|--------|--------------|-----------|
| Lóðrétt-strik | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (án sviga) | — |
| Sniðmát + runa | — | `templateName` + `batchName` |

### Svarsnið

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting item journal batch ITEM|DEFAULT (2 lines) would create 4 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedDocumentNos": ["***"],
  "totals": { "balanced": true, "totalDebitLCY": 254500.0, "totalCreditLCY": 254500.0 },
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
          "fields": { "ItemNo_": "1896-S", "DocumentNo_": "***", "Quantity": "5", "LocationCode": "AÐAL" }
        }
      ]
    }
  ]
}
```

### Svarsvið

Sami umslag og aðrar PreviewPost-gerðir (`rollback`, `summary`, `totals`, `preview[]` með `tableCaption` + `id`/`primaryKey`/`fields` á hvert atriði). `predictedDocumentNos` getur innihaldið strenginn `"***"` þe gar BC felður tölustafarunu sem ekki hefur verið úthlutað.

### Rekstraráminningar

- **Setja línur inn með BC-viðmóti þegar hægt er** — AL `Insert(true)` og OnValidate flugu eldar fylla aðrar reita (postingargrupp, staðsetning, kostnaðarahátta) sjálfkrafa. Þegar línur eru settar inn um OData/MCP `set_records` þarf að senda öll svið sem BC þarf til að bóka; `set_records` keyrir EKKI OnValidate.
- Forskoun afturkallar færslur en endurkallað ekki sniðgjöf á lyklum (t.d. lýsing runu).

### Villur

BC sannvottunarvillur skila sér orðrétt. Algengar villur:
- `Item journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `Item journal batch {template}|{batch} not found.`
- `Item journal batch {template}|{batch} has no lines to post.`
- `Gen. Prod. Posting Group must have a value in Item Journal Line: ...` — lína vantar postingshópa. Algengt þegar `set_records` er notað (engin OnValidate).
- `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` — sjaldgæf heildarvilla.

### Tengdar skilaboðategundir

- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck) - Sannvottaðu án þss að herma bókun.
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost) - Raunveruleg bókun.
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Sama múnstur fyrir aðalfærslukókvarinn.

---

## Inventory.TransferOrder.Create

**Stefna**: Innlæg

Stofnar nýjan tilfærsluskjalshaus (Transfer Header). Línur eru bættar við sérstaklega með `Data.Records.Set` á töflu `Transfer Line`.

### Beiðnireitir

| Reitur | Tegund | Skylt | Lýsing |
|--------|--------|-------|--------|
| `transferFromCode` | Code[10] | Já | Upprunastaðsetning |
| `transferToCode` | Code[10] | Já | Áfangastaðsetning |
| `inTransitCode` | Code[10] | Ef `directTransfer` er false | Staðsetning í flutningi |
| `directTransfer` | Boolean | Nei | `true` fyrir beina tilfærslu (án í-flutningi) |
| `postingDate` | Date | Nei | Sjálfgefið WORKDATE |
| `shipmentDate` | Date | Nei | |
| `receiptDate` | Date | Nei | |
| `externalDocumentNo` | Code[35] | Nei | |

### Svar

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "systemId": "...",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "inTransitCode": "OUT. LOG.",
  "directTransfer": false,
  "statusAfter": "Open"
}
```

---

## Inventory.TransferOrder.Release

**Stefna**: Innlæg

Gefur út tilfærsluskjal (Opið → Útgefið) með einingu 5708 `Release Transfer Document`.

### Auðkenning

- `subject`: GUID → SystemId, texti → Transfer Header `No.`.
- `data` JSON lyklar (fyrsta gilt vinnur): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

### Svar

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

Þegar pöntun er þegar útgefin skilast Success með `statusBefore = statusAfter = "Released"`.

---

## Inventory.TransferOrder.Reopen

**Stefna**: Innlæg

Opnar útgefið tilfærsluskjal aftur (Útgefið → Opið). Sömu auðkenningarreglur og `Release`. Svarið endurspeglar `statusBefore = "Released"` og `statusAfter = "Open"`.

---

## Inventory.TransferOrder.Post

**Stefna**: Innlæg (aðgerð)

Bókar tilfærsluskjal með einingu 5706 `TransferOrder-Post (Yes/No)`.

- Ekki bein tilfærsla: kallandi tilgreinir `postingType` = `"Ship"` eða `"Receive"`.
- Bein tilfærsla: `postingType` hunsað. BC notar `Direct Transfer Posting` í Inventory Setup.

### Beiðnireitir

| Reitur | Tegund | Skylt | Lýsing |
|--------|--------|-------|--------|
| `postingType` | Text | Skylt nema fyrir beinar tilfærslur | `"Ship"` eða `"Receive"` (ekki hástafanæmt) |

### Svar

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "postingType": "Ship",
  "directTransfer": false,
  "postedShipmentNo": "TS-0001",
  "postedReceiptNo": "",
  "postingDate": "2026-03-07"
}
```

### Tæknileg athugasemd

`SetParameters` á einingu 5706 er `internal`. Útfærslan notar áskrifanda (`Transfer Post Subscriber ori`) á `OnBeforeGetPostingOptions` til að setja `PostShipment`, `PostReceipt`, `PostTransfer` og setja `IsHandled := true`.

---

## Inventory.TransferOrder.PreviewPost

**Stefna**: Innlæg (aðgerð, lestrarháttur)

Hermir bókun og skilar spáðum bókhaldsfærslum (Item Ledger, Value Entry, G/L Entry þar sem við á). Færslan er afturkölluð með `Gen. Jnl.-Post Preview`. Beiðnireitir samsvara `Post`.

### Svar

`preview` fylki inniheldur eitt stak á BC töflu (hvert með `rows`). `predictedNumbers` inniheldur næsta úthlutaða skjalanúmer:

- Ekki bein, Ship → `postedShipmentNo`
- Ekki bein, Receive → `postedReceiptNo`
- Bein tilfærsla → `postedDirectTransferNo`

---

## Inventory.TransferOrder.Statistics

**Stefna**: Útlæg (lestrarháttur)

Skilar haus og samanlögðum línum tilfærsluskjals. Útreikningur fylgir Síðu 5755 `Transfer Statistics`; afleiddar línur (`Derived From Line No. <> 0`) eru ekki taldar með.

### Svar

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusValue": "Open",
  "postingDate": "2026-03-07",
  "shipmentDate": "2026-03-07",
  "receiptDate": "2026-03-07",
  "totals": {
    "lineCount": 2,
    "quantity": 50,
    "parcels": 5,
    "netWeight": 250.0,
    "grossWeight": 275.0,
    "volume": 12.5
  }
}
```

---

## Inventory.AssemblyOrder.Create

**Stefna**: Innlæg

Stofnar nýjan samsetningarpöntunarhaus (Assembly Header með Document Type = Order) fyrir foreldri-vörueiningu, með möguleika á að endurnýja íhlutalínur úr BOM. Línur má einnig bæta við sérstaklega með `Data.Records.Set` á töflu `Assembly Line`.

### Reitir í beiðni

| Reitur | Tegund | Skylt | Lýsing |
|--------|--------|-------|--------|
| `itemNo` | Code[20] | Já | Númer foreldris-vörueiningar |
| `quantity` | Decimal | Já | Magn til samsetningar (> 0) |
| `variantCode` | Code[10] | Nei | Afbrigðiskóði |
| `locationCode` | Code[10] | Nei | Staðsetning úttaks |
| `binCode` | Code[20] | Nei | Hólf úttaks |
| `unitOfMeasureCode` | Code[10] | Nei | Mælieining |
| `description` | Text[100] | Nei | Lýsing (sjálfgefin frá vörueiningu) |
| `postingDate` | Date | Nei | Sjálfgefið WORKDATE |
| `dueDate` | Date | Nei | |
| `startingDate` | Date | Nei | |
| `endingDate` | Date | Nei | |
| `quantityToAssemble` | Decimal | Nei | Hlutmagn til samsetningar (sjálfgefið `quantity`) |
| `refreshLines` | Boolean | Nei | Endurnýjar BOM eftir að reitir hafa verið settir (sjálfgefið `true`) |

### Svar

Sjá ensku skjölun fyrir nákvæmt JSON-snið.

### Villur

- `itemNo` vantar eða `quantity <= 0`.
- Vörueining, staðsetning, afbrigði eða mælieining ekki gild (BC-staðfesting).

---

## Inventory.AssemblyOrder.RefreshLines

**Stefna**: Innlæg

Endurnýjar BOM-íhlutalínur á samsetningarpöntun. Notist eftir að `Item No.`, `Quantity`, `Variant Code`, `Location Code` eða `Unit of Measure Code` í haus hefur verið breytt.

### Auðkenni

- `subject` reitur: GUID → SystemId, texti → `No.`.
- JSON-lyklar (fyrsta samsvörun gildir): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

### Villur

- Auðkenni vantar.
- Pöntun er Losuð (þá þarf að opna aftur með `Reopen` áður).

### Útfærslunóta

Útfærslan kallar `AssemblyHeader.Validate("Item No.", AssemblyHeader."Item No.")` sem virkjar BOM-endurnýjun BC í gegnum `OnValidate("Item No.")` í töflunni. Þetta er Skýja-örugg samsvörun við OnPrem-eingöngu aðgerðina `RefreshBOM`.

---

## Inventory.AssemblyOrder.Release

**Stefna**: Innlæg

Losar samsetningarpöntun (Opin → Losuð) með kóðaeiningu 414 `Release Assembly Document`.

Auðkenning eins og í `RefreshLines`. Pantanir sem þegar eru losaðar skila Success með `statusBefore = statusAfter = "Released"`.

---

## Inventory.AssemblyOrder.Reopen

**Stefna**: Innlæg

Opnar aftur losaða samsetningarpöntun (Losuð → Opin) með kóðaeiningu 414 `Release Assembly Document`. Vinnan er framkvæmd í einangraðri ferli-kóðaeiningu (`Asm. Order Reopen Process ori`) þannig að BC-villur eru gripnar og skilað sem uppbyggðu villusvari frekar en að hætta vinnslu.

---

## Inventory.AssemblyOrder.Post

**Stefna**: Innlæg (aðgerð)

Bókar samsetningarpöntun með kóðaeiningu 900 `Assembly-Post`. Notar íhluti og framleiðir fullbúna foreldris-vöru.

### Reitir í beiðni

| Reitur | Tegund | Skylt | Lýsing |
|--------|--------|-------|--------|
| `postingDate` | Date | Nei | Yfirskrifar bókunardags í haus fyrir keyrslu |

### Svar

Inniheldur `documentNo`, `postedDocumentNo`, `postedSystemId`, `postedQuantity`, `assembleToOrder`, `postingDate`. `assembleToOrder` er `true` þegar samsetningin er sprottin af sölupöntun (Assemble-to-Order).

### Villur

- Ófullnægjandi birgðir af íhlutum.
- Staða ekki Losuð (háð Assembly Setup).
- Undirliggjandi BC-villuboð skila aftur með `callstack`.

---

## Inventory.AssemblyOrder.PreviewPost

**Stefna**: Innlæg (aðgerð, lestrarháttur)

Hermir eftir bókun samsetningarpöntunar og skilar væntum hreyfingum (Item Ledger, Value Entry, Capacity Ledger Entry, G/L Entry). Færslan er afturkölluð með `Gen. Jnl.-Post Preview`.

`predictedNumbers` inniheldur næsta bókaða samsetningarnúmer (`postedDocumentNo`). `totals` inniheldur `balanced`, `totalDebitLCY`, `totalCreditLCY`.

---

## Inventory.AssemblyOrder.Statistics

**Stefna**: Útlæg (lestrarháttur)

Skilar haus og kostnaðartölum samsetningarpöntunar. Útreikningur fylgir Síðu 920 `Assembly Order Statistics`. Vænt kostnaður er reiknaður úr `Cost Amount` á línum; raunkostnaður úr bókuðum Item Ledger / Capacity Ledger færslum með `CalcActualCosts`.

---

## Warehouse.Shipment.Create

**Stefna**: Innlæg (aðgerð)

Stofnar eina vöruhús-sendingu fyrir hvert tilgreint frumskjal með því að nota BC kóðaeiningu 5752 `Get Source Doc. Outbound`. Studdar tegundir frumskjala: `SalesOrder`, `TransferOrder` (útflutningshlið).

Hver uppspretta skapar sinn eigin `Warehouse Shipment Header` (BC-staðlað hegðun — BC sameinar ekki uppsprettur sjálfkrafa). Staðsetning frumskjalsins verður að hafa **Require Shipment** = true.

Enginn bókunarmiði stjórnar þessari aðgerð (stofnun sendingar er ekki bókun).

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `sourceDocuments` | Fylki | Já | Eitt eða fleiri `{ sourceType, documentNo }` færslur |
| `sourceDocuments[].sourceType` | Texti | Já | `"SalesOrder"` eða `"TransferOrder"` |
| `sourceDocuments[].documentNo` | Code[20] | Já | Númer frumskjals; verður að vera Útgefið |
| `locationCode` | Code[10] | Nei | Ef sett, verður hvert frumskjal að stemma við þessa staðsetningu |
| `assignedUserId` | Code[50] | Nei | Sett á hvern stofnaðan haus eftir stofnun |
| `postingDate` | Dagsetning | Nei | Sett á hvern stofnaðan haus eftir stofnun |

### Dæmi um beiðni

```json
{
  "sourceDocuments": [
    { "sourceType": "SalesOrder", "documentNo": "SO-0001" }
  ],
  "assignedUserId": "PICKER01"
}
```

### Svar

```json
{
  "status": "Success",
  "noOfShipments": 1,
  "shipments": [
    {
      "recordSystemId": "...",
      "no": "WS-0001",
      "locationCode": "BLUE",
      "assignedUserId": "PICKER01",
      "sourceType": "SalesOrder",
      "sourceDocumentNo": "SO-0001",
      "linesCreated": 2
    }
  ]
}
```

### Villur

- `sourceDocuments is required and must contain at least one entry.` — engin frumskjöl tilgreind.
- `Source #N is missing sourceType or documentNo (both required).`
- `Unsupported sourceType '<X>'. Expected: SalesOrder, TransferOrder.` — óstutt teund frumskjals.
- `Sales Order/Transfer Order '<no>' not found.` — frumskjal finnst ekki.
- `Sales Order/Transfer Order '<no>' is not Released.` — frumskjal er ekki Útgefið.
- Staðsetning krefst ekki sendingar (`Require Shipment` = false á staðsetningarkortinu).
- `No Warehouse Shipment was created for ...` — allar línur þegar á opinni sendingu, ekkert magn eftir tíl sendingar, eða tínsla hafin.
- Ritaðgangshömlun á `Location Code` reit þarf að vera afhölkt í `Field Access ori` þeðar `locationCode` er sent.

---

## Warehouse.Shipment.Post

**Stefna**: Innlæg (aðgerð)

Bókar `Warehouse Shipment` í gegnum BC kóðaeiningu 5763 `Whse.-Post Shipment`.

Hlið: **Warehouse Posting ori** (alltaf) og **G/L Posting ori** (þegar `invoice = true`, vegna þess að reikningsmegin skrifar í `G/L Register`).

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Warehouse Shipment Header.SystemId`; texti til `"No."`.
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `shipmentNo` / `no` — leiðir til `"No."`.

Fyrsta samsvörun vinnur. Þegar ekkert leysist skilar aðgerðin villu um vantandi auðkenni.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer sendingar eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` sendingar |
| `shipmentNo` / `no` | Code[20] | Eitt af | Númer sendingar |
| `invoice` | Boolean | Nei | Þegar satt, bókar einnig reikning fyrir frumskjöl sem styðja það (t.d. Sölupöntun). Sjálfgefið `false` |

### Svar

```json
{
  "status": "Success",
  "shipmentNo": "WS-0001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS-0001",
  "postedWhseShipmentSystemId": "...",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo": "S-INV-0001",
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001"
    }
  ]
}
```

`postedDocuments` er leitt úr töflunni `Posted Whse. Shipment Line` (afritun fjarlægð eftir `Posted Source Document` + `Posted Source No.`).

### Villur

- `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, shipmentNo).`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- `Posting denied: missing 'BIFROST GL Post ori' permission set.` (þegar `invoice = true`).
- `Warehouse Shipment <no> has no lines to post.`
- Undirliggjandi BC-villa frá `Whse.-Post Shipment` (t.d. magn til sendingar = 0, opin tínsla, ólögleg vörurakning, læst bókunardagsetning).

---

## Warehouse.Pick.Create

**Stefna**: Innlæg (aðgerð)

Stofnar vöruhústínslu (`Warehouse Activity Header.Type = Pick`) úr `Warehouse Shipment Header`. Notar BC skýrslu 7318 `Whse.-Shipment - Create Pick` (sömu aðgerð og *Create Pick* takkinn á vöruhúss-sendingsíðunni). Skýrslukallinu er einangrað í kóðaeiningu 10078140 `Whse Pick Create Process ori` þannig að skýrslu-villur birtast sem Error-svar án þess að brjóta ytri skilaboða-verkþjónustu.

Er ekki bókunaraðgerð — engin bókunarhlið. Félagsaðgerðin `Warehouse.Pick.Register` kûar `Warehouse Posting ori`.

### Forsendur

- `Location Code` sendingar verður að hafa `Require Pick = true`. Á staðsetningum með `Require Shipment = true, Require Pick = false` þarf enga tínslu — kallaðu beint á `Warehouse.Shipment.Post`.
- Vöruhúss-sendingin verður að hafa a.m.k. eina línu.
- Nægilegt birgaframboð þarf að vera til staðar svo BC geti byggt tínslulínur.

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Warehouse Shipment Header.SystemId`; texti til `"No."`.
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `whseShipmentNo` / `shipmentNo` / `no` — leiðir til `"No."`.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer vöruhúss-sendingar eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` sendingar |
| `whseShipmentNo` / `shipmentNo` / `no` | Code[20] | Eitt af | Númer sendingar |
| `assignedUserId` | Code[50] | Nei | Sett á stofnuðu tínsluna. Háð skrifaðgangstakmörkun á `Warehouse Activity Header."Assigned User ID"` |
| `sortingMethod` | Texti | Nei | Hástafanæmt nafn úr BC enum `Whse. Activity Sorting Method` — núna: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). Villuskilaboð telja upp leyfilegt sett útgáfunnar. Háð skrifaðgangstakmörkun á `Warehouse Activity Header."Sorting Method"`. Þegar reiturinn er sleppt, skilar svarið `"sortingMethod": "None"` (tómi tittill BC-enumsins er staðlaður). |
| `setBreakbulkFilter` | Boolean | Nei | **Ekki stöðuð** í þessari útgáfu API. `true` skilar villu |
| `doNotFillQtyToHandle` | Boolean | Nei | **Ekki stöðuð** í þessari útgáfu API. `true` skilar villu |

### Svar

```json
{
  "status": "Success",
  "whseShipmentNo": "WS-0001",
  "pickNo": "WPK-0001",
  "pickSystemId": "00000000-0000-0000-0000-000000000000",
  "locationCode": "WHITE",
  "assignedUserId": "PICKER01",
  "sortingMethod": "Bin Ranking",
  "totalPickLines": 4,
  "totalQtyToHandle": 12,
  "message": "Warehouse Pick WPK-0001 created from Shipment WS-0001 with 4 lines."
}
```

### Villur

- `Warehouse Shipment identifier must be specified ...`
- `Warehouse Shipment <id> does not exist.`
- `Warehouse Shipment <no> has no lines to pick.`
- `sortingMethod '<value>' is not valid. Expected one of: ...`
- `Field Assigned User ID is restricted for write on table Warehouse Activity Header.`
- `Field Sorting Method is restricted for write on table Warehouse Activity Header.`
- `setBreakbulkFilter = true is not supported by this API version.`
- `doNotFillQtyToHandle = true is not supported by this API version.`
- `No Warehouse Pick was created for Warehouse Shipment <no>.`

---

## Warehouse.Pick.Register

**Stefna**: Innlæg (aðgerð)

Skráir vöruhústínslu í gegnum BC kóðaeining 7307 `Whse.-Activity-Register`. Eftir skráningu:

- Frumræðis `Warehouse Shipment Line` fær magn (`Qty. Picked`, `Qty. to Ship`).
- Tínsluhausin færist í sögu sem `Registered Whse. Activity Hdr.`.
- Vöruhúss-sendingin verður tilbúin fá `Warehouse.Shipment.Post`.

Hlið: **Warehouse Posting ori**.

### Forsenda: Línur þarfa Qty. to Handle

BC skráir bara það sem vöruhússtarfsmaðurinn hefur staðfest. `Warehouse.Pick.Create` setur `Qty. to Handle` á hverja línu sjálfkrafa. Til að skrá **aðeins hluta**, kallaðu fyrst á `Data.Records.Set` á `Warehouse Activity Line` til að uppfæra `Qty. to Handle` per línu.

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Warehouse Activity Header.SystemId`; texti til `"No."` (Type = Pick).
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `pickNo` / `no` — leiðir til `"No."`.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer tínslu eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` tínslu |
| `pickNo` / `no` | Code[20] | Eitt af | Númer tínslu |

Aðrar beiðni-paramaterar eru ekki stöðuðir. Til að brísta `Qty. to Handle` per línu áður en þú skráir, notaðu `Data.Records.Set` á `Warehouse Activity Line`.

### Svar

```json
{
  "status": "Success",
  "pickNo": "WPK-0001",
  "linesRegistered": 4,
  "totalQtyRegistered": 12,
  "shipmentNo": "WS-0001",
  "shipmentSystemId": "...",
  "registeredPickNo": "RWPK-0001",
  "registeredPickSystemId": "...",
  "shipmentLines": [
    {
      "shipmentNo": "WS-0001",
      "lineNo": 10000,
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 2,
      "qtyPicked": 2,
      "qtyToShip": 2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK-0001 (4 lines) registered against Warehouse Shipment WS-0001."
}
```

`qtyOutstanding` endurspeglar BC reitinn `Warehouse Shipment Line."Qty. Outstanding"` (`Quantity - Qty. Shipped`). Tínsluskráning sendir ekki vörur — gildið helst jafnt línu`Quantity` þar til `Warehouse.Shipment.Post` keyrir.

### Villur

- `Warehouse Pick identifier must be specified ...`
- `Warehouse Pick <id> does not exist.`
- `Warehouse Activity <no> is not of Type Pick.`
- `Warehouse Pick <no> has no lines.`
- `Nothing to register.`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`

---

## Warehouse.Putaway.Create

**Stefna**: Innlæg (aðgerð)

Tryggir að vöruhúsiðstaf (`Warehouse Activity Header.Type = Put-away`) sé til fyrir `Posted Whse. Receipt Header` og skilar henni. Notar BC skýrslu 7305 `Whse.-Source - Create Document` (sömu aðgerð og *Create Put-away* á bókaða vöruhúsmóttökusíðunni) gegnum `SetPostedWhseReceiptLine`. Skýrslukallið er einangrað í kóðaeiningu 10078143 `Whse Putaway Create Proc. ori` svo villur frá skýrslunni birtast sem Error-svar án þess að ytra skilaboða-verkið sé afturkallað.

Er ekki bókunaraðgerð — engin bókunarhlið. Félagsaðgerðin `Warehouse.Putaway.Register` krefst `Warehouse Posting ori`.

### Sjálfvirk stofnun / endurkvæmni (lestu fyrst)

Hvort bókun móttökunnar hafi þegar stofnað iðstafið ræðst af BC kóðaeiningu 5760 `Whse.-Post Receipt`: `ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"`.

- Á staðsetningu með `Require Put-away` og **`Use Put-away Worksheet = false`** (sjálfgefið í BC — t.d. sýnistaðsetningarnar GULUR/HVÍTUR) stofnar bókunin iðstafið **sjálfkrafa**. Skýrsla 7305 hefur þá ekkert eftir og BC kastar `There is nothing to handle.` — því skilar þessi skilaboðategund **fyrirliggjandi** iðstafi sem `Success` með `"alreadyExisted": true` (í stað villu).
- Á staðsetningu með **`Use Put-away Worksheet = true`** stofnar bókunin ekki iðstafið; þá stofnar þessi skilaboðategund það (`"alreadyExisted": false`).

Skilaboðategundin er því endurkvæm: endurtekið kall á óskráð iðstaf skilar sama iðstafi. Í báðum tilvikum er `putawayNo` í svari tilbúið fyrir `Warehouse.Putaway.Register` — `alreadyExisted = true` er ekki villa.

### Forsendur

- **Bókuð** vöruhúsmóttaka þarf að vera til. Óbókuð móttaka göngur ekki — kallaðu fyrst `Warehouse.Receipt.Post`.
- `Location Code` móttekunnar þarf að hafa `Require Put-away = true`. Á staðsetningum með `Require Receive = true, Require Put-away = false`, er staðarsetning ekki núuðsynleg — bókun móttekunnar setur íherbergið í birgðir stráx.
- A.m.k. ein lina í `Posted Whse. Receipt Line` þarf að hafa `Quantity > 0` og `Status <> Completely Put Away`.

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Posted Whse. Receipt Header.SystemId`; texti til `"No."`.
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `postedWhseReceiptNo` / `receiptNo` / `no` — leiðir til `"No."`.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer bókaðrar móttekunnar eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` bókaðrar móttekunnar |
| `postedWhseReceiptNo` / `receiptNo` / `no` | Code[20] | Eitt af | Númer bókaðrar móttekunnar |
| `assignedUserId` | Code[50] | Nei | Sett á það staðfest setningar haus. Háð ritlæsingum á `Warehouse Activity Header."Assigned User ID"`. |
| `sortingMethod` | Texti | Nei | Hástafaóviðkvaemt heiti frá BC enum `Whse. Activity Sorting Method` — hinguð til: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). |
| `setBreakbulkFilter` | Bool | Nei | **Ekki stutt** í þessari API útgáfu. `true` skilar Error. |
| `doNotFillQtyToHandle` | Bool | Nei | **Ekki stutt** í þessari API útgáfu. `true` skilar Error. |

### Svar

Staðfest í rauntíma (BC 27, CRONUS IS) — staðsetning `CEPUT` með `Use Put-away Worksheet = true`, innkaupapöntun með 5 × vöru `1896-S`:

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

- `alreadyExisted` — `false` þegar þetta kall stofnaði iðstafið; `true` þegar opið iðstaf var þegar til (t.d. stofnað sjálfkrafa við bókun) og var skilað óbreyttu.
- `totalPutawayLines` — **ein** lína á hverja frumlínu á staðsetningu án hólfa (`Bin Mandatory = false`); á `Bin Mandatory` / `Directed Put-away and Pick` staðsetningum verður hver frumlína að **Take + Place pari**, svo fjöldinn um það bil tvöfaldast.

### Villur

- `Posted Whse. Receipt identifier must be specified ...`
- `Posted Whse. Receipt <id> does not exist.`
- `Posted Whse. Receipt <no> has no lines to put away.`
- `sortingMethod '<value>' is not valid. Expected one of: ...`
- `Field Assigned User ID is restricted for write on table Warehouse Activity Header.`
- `Field Sorting Method is restricted for write on table Warehouse Activity Header.`
- `setBreakbulkFilter = true is not supported by this API version.`
- `doNotFillQtyToHandle = true is not supported by this API version.`
- `No Warehouse Put-away was created for Posted Whse. Receipt <no>.` — skýrsla 7305 keyrði án villu en stofnaði engan haus OG ekkert var fyrir (staðsetning krefst ekki iðstafs, eða cross-dock nýtti línurnar).

> `There is nothing to handle.` (skýrsla 7305 þegar iðstaf er þegar til) er **ekki** skilað sem villu — því er breytt í `Success`-svar með `"alreadyExisted": true`.

---

## Warehouse.Putaway.Register

**Stefna**: Innlæg (aðgerð)

Skráir vöruhúsiðstaf (Put-away) í gegnum BC kóðaeining 7307 `Whse.-Activity-Register` (sömu kóðaeining og notuð er fyrir tinsluskráningu). Eftir skráningu:

- Frumræðis `Posted Whse. Receipt Line` reitir uppfærðir (`Qty. Put Away`, `Status` úrr `Partially Put Away` í `Completely Put Away`).
- Bin contents uppfærð — vörur færast úr mótttaka-bin í geymslu-bin.
- Staðarsetningarhausin færist í sögu sem `Registered Whse. Activity Hdr.`.

Hlið: **Warehouse Posting ori**.

### Forsenda: Línur þarfa Qty. to Handle

BC skráir bara það sem vöruhússtarfsmaðurinn hefur staðfest staðarsett. `Warehouse.Putaway.Create` setur `Qty. to Handle` á hverja línu sjálfkrafa. Til að skrá **aðeins hluta**, kallaðu fyrst `Data.Records.Set` á `Warehouse Activity Line` til að uppfæra `Qty. to Handle` per línu. Á `Bin Mandatory` / `Directed Put-away and Pick` staðsetningum koma línur í **Take + Place pörum** — uppfærðu bæði í sama gildi. Á staðsetningu án hólfa (`Bin Mandatory = false`) er ein lína á hverja frumlínu og engin pörun (staðfest í rauntíma: móttaka með 1 línu → 1 iðstafslína, `linesRegistered = 1`).

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Warehouse Activity Header.SystemId`; texti til `"No."` (Type = Put-away).
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `putawayNo` / `no` — leiðir til `"No."`.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer staðarsetningar eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` staðarsetningar |
| `putawayNo` / `no` | Code[20] | Eitt af | Númer staðarsetningar |

Aðrar beiðni-paramætrar eru ekki staðaðir. Til að brísta `Qty. to Handle` per línu áður en þú skráir, notaðu `Data.Records.Set` á `Warehouse Activity Line`.

### Svar

Staðfest í rauntíma (BC 27, CRONUS IS) — skráning `PU000025` (1 lína, 5 × vöru `1896-S`):

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

### Villur

- `Warehouse Put-away identifier must be specified ...`
- `Warehouse Put-away <id> does not exist.`
- `Warehouse Activity <no> is not of Type Put-away.`
- `Warehouse Put-away <no> has no lines.`
- `Nothing to register.`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`

---

## Warehouse.Receipt.Create

**Stefna**: Innlæg (aðgerð)

Stofnar eina vöruhús-móttöku á hvert framsent frumskjal í gegnum BC kóðaeiningu 5751 `Get Source Doc. Inbound`. Studdar frumskjalategundir: `PurchaseOrder`, `SalesReturnOrder`, `TransferOrder` (móttökuhliðin).

Hvert frumskjal myndar eigin `Warehouse Receipt Header`. Frumskjalið verður að vera **Útgefið** og móttöku-`Location Code` verður að hafa **Require Receive** = true.

Ekki bókunaraðgerð — engin bókunarhlið. Ekki sjálfvirkt útilokandi: hver kall stofnar nýjar haus-færslur úr númeraröð.

### Hvaða staðsetning er notuð fyrir hverja frumskjalategund

| Tegund frumskjals | Staðsetning |
|-------------------|-------------|
| PurchaseOrder | `Purchase Header."Location Code"` |
| SalesReturnOrder | `Sales Header."Location Code"` |
| TransferOrder | `Transfer Header."Transfer-to Code"` (móttökustaðurinn) |

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `sourceDocuments` | Fylki | Já | Eitt eða fleiri `{ sourceType, documentNo }` |
| `sourceDocuments[].sourceType` | Texti | Já | `"PurchaseOrder"`, `"SalesReturnOrder"` eða `"TransferOrder"` (hástafanæmi óvarið) |
| `sourceDocuments[].documentNo` | Code[20] | Já | Númer frumskjals; frumskjal verður að vera útgefið |
| `locationCode` | Code[10] | Nei | Ef sett verður hvert frumskjal að móttaka á þessari staðsetningu; ósamræmi gefur villu. Háð ritaðgangshömlun á `Warehouse Receipt Header."Location Code"` |
| `assignedUserId` | Code[50] | Nei | Skráð á hverja stofnaða `Warehouse Receipt Header` eftir stofnun |
| `postingDate` | Date | Nei | Snið 9 (ISO `yyyy-MM-dd`). Skráð á hverja stofnaða `Warehouse Receipt Header` eftir stofnun |

### Dæmi um beiðni

```json
{
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder", "documentNo": "PO-0001" },
    { "sourceType": "TransferOrder", "documentNo": "TO-0007" }
  ],
  "locationCode": "BLUE",
  "assignedUserId": "RECEIVER01",
  "postingDate": "2025-11-15"
}
```

### Svar

```json
{
  "status": "Success",
  "noOfReceipts": 2,
  "receipts": [
    {
      "recordSystemId": "...",
      "no": "WR-0001",
      "locationCode": "BLUE",
      "assignedUserId": "RECEIVER01",
      "sourceType": "PurchaseOrder",
      "sourceDocumentNo": "PO-0001",
      "linesCreated": 2
    }
  ]
}
```

### Villur

- `sourceDocuments is required and must contain at least one entry.`
- `Source #N is missing sourceType or documentNo (both required).`
- `Unsupported sourceType '<X>'. Expected: PurchaseOrder, SalesReturnOrder, TransferOrder.`
- `Purchase Order '<no>' not found.` / `Sales Return Order '<no>' not found.` / `Transfer Order '<no>' not found.`
- `Purchase Order '<no>' is not Released.` / `Sales Return Order '<no>' is not Released.` / `Transfer Order '<no>' is not Released.`
- `Purchase Order '<no>' uses location '<x>' which does not match the requested locationCode '<y>'.` (og samsvarandi villa fyrir hverja tegund)
- `Location '<code>' (from Purchase Order '<no>') does not require receive routing` — kveikið `Require Receive` á staðsetningarkortinu.
- `No Warehouse Receipt was created for <sourceType> '<no>' — already on an open receipt, no lines remain to receive, or put-away already started.` — sameinuð orsök: frumskjal er nú þegar á opinni móttöku, hefur þegar verið móttekið að fullu, eða hefur virka tilfærslu (put-away). Skilast einnig þegar frumskjal hefur verið móttekið að fullu á áður bókaðri móttöku.
- `Field Location Code is restricted for write on table Warehouse Receipt Header.` — `Field Access ori` lokar fyrir `locationCode` færibreytuna.

### Leit — finna staðsetningar sem krefjast móttöku

Notið `Data.Records.Get` á `Location` (tafla 14) með `tableView = "WHERE(Require Receive=CONST(true))"` til að birta gildar staðsetningar. Skoðið `RequirePutaway`, `DirectedPutawayandPick` og `BinMandatory` til að spá fyrir um tilfærslu- og bin-kröfur.

---

## Warehouse.Receipt.Post

**Stefna**: Innlæg (aðgerð)

Bókar `Warehouse Receipt` í gegnum BC kóðaeiningu 5760 `Whse.-Post Receipt`.

Hlið: **Warehouse Posting ori**. Enginn reikningsmöguleiki — vöruhús-móttökur bóka aðeins móttöku á vörum. Bókuð frumskjöl (Posted Purchase Receipt, Posted Return Receipt, Posted Transfer Receipt) eru tilgreind í svari.

Eftir vel heppnaða bókun eyðir BC `Warehouse Receipt Header`. Endurbókun á sama auðkenni skilar `The Warehouse Receipt Header does not exist.`.

### Auðkennsla í forgangsröð

1. `subject` — GUID leiðir til `Warehouse Receipt Header.SystemId`; texti til `"No."`.
2. JSON `systemId` / `recordSystemId` / `id` — leiðir til `SystemId`.
3. JSON `receiptNo` / `no` — leiðir til `"No."`.

Fyrsta samsvörun vinnur. Þegar ekkert leysist skilar aðgerðin villu um vantandi auðkenni.

### Beiðnireitir

| Reitur | Tegund | Skylda | Lýsing |
|--------|--------|--------|--------|
| `subject` | Texti/Guid | Eitt af | Númer móttöku eða `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | Eitt af | `SystemId` móttöku |
| `receiptNo` / `no` | Code[20] | Eitt af | Númer móttöku |

### Svar

```json
{
  "status": "Success",
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "AC903C2D-DF61-F111-B7A5-FCCA66B996D7",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo": "107242",
      "sourceDocument": "Purchase Order",
      "sourceNo": "106031"
    }
  ]
}
```

Númer í dæmi eru aðeins til skýringar. `postedWhseReceiptNo` kemur úr númeraröðinni `Whse. Receipt Nos.` á staðsetningunni; `postedSourceNo` úr bókunarseríu frumskjalsins. `postedSourceDocument` er eitt af `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`. `postedDocuments` er leitt úr töflunni `Posted Whse. Receipt Line` (afritun fjarlægð eftir `Posted Source Document` + `Posted Source No.`).

### Villur

- `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- `Warehouse Receipt <no> has no lines to post.`
- `The Warehouse Receipt Header does not exist.` — t.d. þegar reynt er að bóka aftur auðkenni þar sem haus var eyddur við fyrri vel heppnaða bókun.
- Undirliggjandi BC-villa frá `Whse.-Post Receipt` (t.d. magn til móttöku = 0, ólögleg vörurakning, læst bókunardagsetning, vantar Bin Code á directed put-away/pick staðsetningu).

---

## Warehouse.Receipt.Post.Preview

**Stefna**: Innlæg (aðgerð)

Hermir eftir bókun á vöruhús-móttöku og skilar föngnum fúrsslum án þess að skuldbinda. Keyrt í gegnum `Whse.-Post Receipt (Yes/No)` (kóðaeining 5761) bundið með `EventSubscriberInstance = Manual`, þar sem `OnRunPreview` áskrift kveikir á preview-ham í `Whse.-Post Receipt` (5760). Fúrsólan er svo afturkölluð í gegnum `Gen. Jnl.-Post Preview`.

Ekki hlið — engin raunbókun á sér stað og því engin bókunarhlið.

### Auðkennsla

Sama og `Warehouse.Receipt.Post` (subject GUID/texti, síðan JSON `systemId`/`recordSystemId`/`id`/`receiptNo`/`no`).

### Föng taflur

Forskoðunin í BC fangar aðeins inntök í fasta lista taflna:

| Tafla | ID | Alltaf til staðar? |
|-------|----|--------------------|
| Item Ledger Entry | 32 | Já — ein á hverja móttökulínu |
| Value Entry | 5802 | Já — ein Direct Cost færsla á hverja móttökulínu |
| G/L Entry | 17 | Aðeins ef kostnaðaraðlögun keyrir samhliða. Móttökur skila yfirleitt engum |

`Posted Whse. Receipt Header` (tafla 7320) er **ekki** í listanum. Því skilar `predictedNumbers.postedWhseReceiptNo` alltaf en gildið er **alltaf tómt** í forskoðun.

### Númer redacted

Forskoðun BC skiptir úthlutuðum númerum út fyrir `***` til að gefa til kynna að þau yrðu afturkölluð. Hefur áhrif á:

- `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` — alltaf `***` í forskoðun.
- `preview[].rows[].DocumentNo_` á Item Ledger Entry / Value Entry línum — einnig `***`.

Notið `Warehouse.Receipt.Post` til að fá raunveruleg númer.

### Svar

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 0,
    "totalCreditLCY": 0
  },
  "preview": [
    { "tableName": "Item Ledger Entry", "tableNo": 32, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] },
    { "tableName": "Value Entry",       "tableNo": 5802, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] }
  ]
}
```

Lykilmengi `predictedNumbers` breytist eftir frumskjalategund:

| Frumskjal | Lykill | Gildi í forskoðun |
|-----------|--------|--------------------|
| Innkaupapöntun | `postedPurchaseReceiptNo` | `***` |
| Vöruskil úr sölu | `postedReturnReceiptNo` | `***` |
| Innflutningstilfærsla | `postedTransferReceiptNo` | `***` |

Vöruhús-móttökur hafa engin bein áhrif á G/L — `balanced` er `true` með `0` summum.

### Villur

- `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).`
- `Warehouse Receipt <no> has no lines to post.`
- Undirliggjandi BC-villa frá `Whse.-Post Receipt` (sömu skilyrði og raunbókun).

---

## Warehouse.Shipment.PreviewPost

**Stefna**: Innlæg (hermir bókun, engin gögn breytast)

**Tilgangur**: Hermir bókun á vöruhús-sendingu (Sending + Reikningur) og skilar þeim færslum sem **myndu** verða til — án þss að vista neitt í gagnagrunninn. Beitir BC `Gen. Jnl.-Post Preview.SetContext + Run()` höfuðlausu flæði gegn `Whse.-Post Shipment (Yes/No)` áskrifanda. Töflur sem oftast eru fangaðar: `Item Ledger Entry`, `Value Entry`, `Posted Whse. Shipment Header/Line`, `Sales Shipment Header/Line`, og fyrir reikningssniðið `Sales Invoice Header/Line`, `G/L Entry`, `VAT Entry`, `Cust. Ledger Entry`.

**Mikilvægt — Reikningsflággið er fast.** BC `Whse.-Post Shipment (Yes/No)` preview áskrifandinn þyngir `Invoice = true`. Svarið `invoice` er því alltaf `true`.

### Innlögð gildi

Fyrsta samsvarandi vinnur:

| Aðferð | Subject-svið | Data-svið |
|--------|--------------|-----------|
| SystemId GUID | `<guid>` (án sviga) | — |
| Númer sendingar | `WS-0001` | — |
| SystemId í data | — | `systemId` / `recordSystemId` / `id` |
| Númer í data | — | `shipmentNo` / `no` |

### Svarsnið

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting warehouse shipment WS-0001 (2 lines, Ship + Invoice) would create 10 ledger entries across 6 tables. G/L impact is balanced.",
  "shipmentNo": "WS-0001",
  "locationCode": "WHITE",
  "invoice": true,
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedNumbers": ["INV-0012"],
  "totals": { "balanced": true, "totalDebitLCY": 250.0, "totalCreditLCY": 250.0 },
  "preview": [ ... ]
}
```

### Svarsvið

Sami umslag og aðrar PreviewPost-gerðir. Viðbætur:

| Svið | Lýsing |
|------|--------|
| `shipmentNo` / `locationCode` | Auðkennandi haus-svið. |
| `invoice` | Alltaf `true` — BC preview áskrifandi neyt slíkt. |
| `linesToPost` | Warehouse Shipment Lines sem voru gefnar til forskoun. |
| `predictedNumbers` | Sniglar `Document No.` gildi (t.d. væntanlegt sölureikningsnúmer). Getur innihaldið `"***"`. |

### Rekstraráminningar

- **WMS staðsetningar þarfnast skráðrar tínslu fyrst.** Á staðsetningu með `Require Pick = true` (t.d. CRONUS `WHITE` / `GULUR`) hefst `Warehouse Shipment Line` með `Qty. to Ship = 0`. Vöruhústínsla þarf að vera **stofnuð og skráð** áður en forskoun er keyrð — skráning tínslu er það sem skrifar `Qty. to Ship` til baka á línurnar.
- **Staðsetningar með `Require Shipment = true` og `Require Pick = false`** ha ga sér eins og venjulegt sendingarflæði: `Qty. to Ship` fyllist þe gar línan er stofnuð, og forskoun keyrir beint án tínslu.
- **Reikningsflággið er fast í `true`.** Til að sjá aðeins sendingu, notaðu forskoun frumskjals (t.d. `Sales.Document.PreviewPost`).

### Villur

BC sannvottunarvillur skila sér orðrétt. Algengar villur:
- `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, shipmentNo).`
- `Warehouse Shipment {no} has no lines to post.`
- `There is nothing to post because the document does not contain a quantity or amount.` — allar línur hafa `Qty. to Ship = 0` (á WMS staðsetningu, engin tínsla skráð).
- `Posting preview failed and no entries were captured. The shipment cannot be posted in its current state.` — sjaldgæf heildarvilla.

### Tengdar skilaboðategundir

- [Warehouse.Shipment.Create](#warehouseshipmentcreate) - Stofna sendingu úr frumskjölum.
- [Warehouse.Shipment.Post](#warehouseshipmentpost) - Raunveruleg bókun.
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Sama múnstur fyrir aðalfærslukókvarinn.

---

## Útfærsluupplýsingar

### Hlutarauðkenni

| Tegund hlutar | Auðkenni | Heiti |
|---------------|----------|-------|
| Enum-gildi | 10078085 | Inventory.ItemJournal.SetupNewLine |
| Implementation Codeunit | 10078128 | Item Jnl. SetupLine Impl ori |
| Help Codeunit | 10077973 | Item Jnl. SetupLine Help ori |
| Enum-gildi | 10078086 | Inventory.ItemJournal.Check |
| Implementation Codeunit | 10078129 | Item Journal Check Impl ori |
| Help Codeunit | 10077974 | Item Journal Check Help ori |
| Enum-gildi | 10078087 | Inventory.ItemJournal.Post |
| Implementation Codeunit | 10078130 | Item Journal Post Impl ori |
| Help Codeunit | 10077975 | Item Journal Post Help ori |
| Enum-gildi | 10078123 | Inventory.ItemJournal.PreviewPost |
| Implementation Codeunit | 10078127 | Item Jnl. Prev. Post Impl ori |
| Help Codeunit | 10077972 | Item Jnl. Prev. Post Help ori |
| Enum-gildi | 10078097 | Inventory.TransferOrder.Create |
| Implementation Codeunit | 10078132 | Transfer Order Create Impl ori |
| Help Codeunit | 10077977 | Transfer Order Create Help ori |
| Enum-gildi | 10078098 | Inventory.TransferOrder.Release |
| Implementation Codeunit | 10078134 | Transf. Order Release Impl ori |
| Help Codeunit | 10077979 | Transf. Order Release Help ori |
| Enum-gildi | 10078099 | Inventory.TransferOrder.Reopen |
| Implementation Codeunit | 10078135 | Transfer Order Reopen Impl ori |
| Help Codeunit | 10077980 | Transfer Order Reopen Help ori |
| Enum-gildi | 10078100 | Inventory.TransferOrder.Post |
| Implementation Codeunit | 10078133 | Transfer Order Post Impl ori |
| Help Codeunit | 10077978 | Transfer Order Post Help ori |
| Enum-gildi | 10078101 | Inventory.TransferOrder.PreviewPost |
| Implementation Codeunit | 10078131 | Transf Doc Prev. Post Impl ori |
| Help Codeunit | 10077976 | Transf Doc Prev. Post Help ori |
| Enum-gildi | 10078102 | Inventory.TransferOrder.Statistics |
| Implementation Codeunit | 10078137 | Transfer Order Stats Impl ori |
| Help Codeunit | 10077981 | Transfer Order Stats Help ori |
| Process Codeunit | 10078138 | Transfer Post Subscriber ori |
| Process Codeunit | 10078136 | Transf. Order Reopen Proc. ori |
| Enum-gildi | 10078106 | Inventory.AssemblyOrder.Create |
| Implementation Codeunit | 10078122 | Assembly Order Create Impl ori |
| Help Codeunit | 10077968 | Assembly Order Create Help ori |
| Enum-gildi | 10078107 | Inventory.AssemblyOrder.RefreshLines |
| Implementation Codeunit | 10078119 | Asm. Order RefreshLn Impl ori |
| Help Codeunit | 10077965 | Asm. Order RefreshLn Help ori |
| Enum-gildi | 10078108 | Inventory.AssemblyOrder.Release |
| Implementation Codeunit | 10078124 | Asm. Order Release Impl ori |
| Help Codeunit | 10077970 | Asm. Order Release Help ori |
| Enum-gildi | 10078109 | Inventory.AssemblyOrder.Reopen |
| Implementation Codeunit | 10078125 | Assembly Order Reopen Impl ori |
| Help Codeunit | 10077971 | Assembly Order Reopen Help ori |
| Enum-gildi | 10078110 | Inventory.AssemblyOrder.Post |
| Implementation Codeunit | 10078123 | Assembly Order Post Impl ori |
| Help Codeunit | 10077969 | Assembly Order Post Help ori |
| Enum-gildi | 10078111 | Inventory.AssemblyOrder.PreviewPost |
| Implementation Codeunit | 10078121 | Asm. Doc Prev. Post Impl ori |
| Help Codeunit | 10077967 | Asm. Doc Prev. Post Help ori |
| Enum-gildi | 10078112 | Inventory.AssemblyOrder.Statistics |
| Implementation Codeunit | 10078120 | Asm. Order Statistics Impl ori |
| Help Codeunit | 10077966 | Asm. Order Statistics Help ori |
| Process Codeunit | 10078126 | Asm. Order Reopen Process ori |
| Enum-gildi | 10078121 | Warehouse.Shipment.Create |
| Implementation Codeunit | 10078148 | Whse Shipment Create Impl ori |
| Help Codeunit | 10077989 | Whse Shipment Create Help ori |
| Enum-gildi | 10078122 | Warehouse.Shipment.Post |
| Implementation Codeunit | 10078149 | Whse Shipment Post Impl ori |
| Help Codeunit | 10077990 | Whse Shipment Post Help ori |
| Enum-gildi | 10078130 | Warehouse.Pick.Create |
| Implementation Codeunit | 10078139 | Whse Pick Create Impl ori |
| Process Codeunit | 10078140 | Whse Pick Create Process ori |
| Help Codeunit | 10077982 | Whse Pick Create Help ori |
| Enum-gildi | 10078131 | Warehouse.Pick.Register |
| Implementation Codeunit | 10078141 | Whse Pick Register Impl ori |
| Help Codeunit | 10077983 | Whse Pick Register Help ori |
| Enum-gildi | 10078132 | Warehouse.Putaway.Create |
| Implementation Codeunit | 10078142 | Whse Putaway Create Impl ori |
| Process Codeunit | 10078143 | Whse Putaway Create Proc. ori |
| Help Codeunit | 10077984 | Whse Putaway Create Help ori |
| Enum-gildi | 10078133 | Warehouse.Putaway.Register |
| Implementation Codeunit | 10078144 | Whse Putaway Register Impl ori |
| Help Codeunit | 10077985 | Whse Putaway Register Help ori |
| Enum-gildi | 10078127 | Warehouse.Receipt.Create |
| Implementation Codeunit | 10078145 | Whse Receipt Create Impl ori |
| Help Codeunit | 10077986 | Whse Receipt Create Help ori |
| Enum-gildi | 10078128 | Warehouse.Receipt.Post |
| Implementation Codeunit | 10078146 | Whse Receipt Post Impl ori |
| Help Codeunit | 10077987 | Whse Receipt Post Help ori |
| Enum-gildi | 10078129 | Warehouse.Receipt.Post.Preview |
| Implementation Codeunit | 10078147 | Whse Rcpt Post Prev. Impl ori |
| Help Codeunit | 10077988 | Whse Rcpt Post Prev. Help ori |
| Enum-gildi | 10078126 | Warehouse.Shipment.PreviewPost |
| Implementation Codeunit | 10078150 | Whse Ship. Prev. Post Impl ori |
| Help Codeunit | 10077991 | Whse Ship. Prev. Post Help ori |
| Tafla | 10077908 | Warehouse Posting ori |
| Heimildasafn | 10077900 | BIFROST WhsePost ori |
