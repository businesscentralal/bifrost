---
id: inventory
title: "Inventory message types"
sidebar_position: 6
---

Þetta skjal lýsir skilaboðategundum tengdum birgðum í Bifröst Foundation.

Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](../reference/errors.md). Villusvör innihalda aldrei kallastafla.

## Yfirlit

Skilaboðategundir fyrir birgðir bjóða upp á virkni til að vinna með vörudagbækur (stofnun lína, sannvottun, bókun), tilfærsluskjöl (stofnun, útgáfu, opnun aftur, bókun, forskoðun bókunar, tölfræði) og samsetningarpantanir. Vöruhúsaafhendingar, vöruhúsamóttökur, tínsla og frágangur eru í sérstöku forriti, [Bifröst Warehouse](/warehouse/) — sjá [Skilaboðategundir fyrir vöruhús](#skilaboðategundir-fyrir-vöruhús).

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
  "code": "BusinessCentralError",
  "error": "Error message text"
}
```

### Athugasemdir

- Notar BC "Item Jnl.-Post Batch" einingu fyrir bókun.
- Allar línur eru hreinsaðar úr runu eftir vel heppnaða bókun.
- Bókun er pakkað í einangraða einingu þannig að villur skila skipulegu villusvari (kóði `BusinessCentralError`); kallastaflinn fer eingöngu í fjarmælingar.

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
- Undirliggjandi BC-villuboð skila sér í `error` (án kallastafla).

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

## Skilaboðategundir fyrir vöruhús

Skilaboðategundirnar tíu `Warehouse.*` — vöruhúsaafhendingar, vöruhúsamóttökur, tínsla og frágangur — eru ekki hluti af Bifröst Foundation. Þær fylgja sérstöku forriti, **[Bifröst Warehouse](/warehouse/)**, sem keyrir ofan á Foundation. Heiti þeirra eru óbreytt, svo að kallandi þarf aðeins að hafa Bifröst Warehouse uppsett.

| Skilaboðategund | Tilgangur |
|----------------|-----------|
| [Warehouse.Shipment.Create](/warehouse/reference/message-types/warehouse-shipment-create/) | Stofnar vöruhúsaafhendingar úr losuðum sölupöntunum og millifærslupöntunum á útleið |
| [Warehouse.Shipment.Post](/warehouse/reference/message-types/warehouse-shipment-post/) | Bókar vöruhúsaafhendingu (afhending, valfrjálst með reikningi) |
| [Warehouse.Shipment.PreviewPost](/warehouse/reference/message-types/warehouse-shipment-previewpost/) | Forskoðar bókun vöruhúsaafhendingar (afhending + reikningur); rúllað til baka |
| [Warehouse.Receipt.Create](/warehouse/reference/message-types/warehouse-receipt-create/) | Stofnar vöruhúsamóttökur úr losuðum innkaupapöntunum, vöruskilapöntunum og millifærslupöntunum á innleið |
| [Warehouse.Receipt.Post](/warehouse/reference/message-types/warehouse-receipt-post/) | Bókar vöruhúsamóttöku |
| [Warehouse.Receipt.Post.Preview](/warehouse/reference/message-types/warehouse-receipt-post-preview/) | Forskoðar bókun vöruhúsamóttöku; rúllað til baka |
| [Warehouse.Pick.Create](/warehouse/reference/message-types/warehouse-pick-create/) | Stofnar vöruhúsatínslu úr vöruhúsaafhendingu |
| [Warehouse.Pick.Register](/warehouse/reference/message-types/warehouse-pick-register/) | Skráir vöruhúsatínslu |
| [Warehouse.Putaway.Create](/warehouse/reference/message-types/warehouse-putaway-create/) | Stofnar, eða skilar fyrirliggjandi, frágangi fyrir bókaða vöruhúsamóttöku |
| [Warehouse.Putaway.Register](/warehouse/reference/message-types/warehouse-putaway-register/) | Skráir vöruhúsafrágang |

Bókunarhlið vöruhúss er áfram í Foundation: bókun og skráning krefjast enn heimildasafnsins `BIFROST WhsePost ori` (sjá [Bókunarhlið](/foundation/reference/setup/#bókunarhlið-bifröst-gl--item--fa--job--resource--warehouse-posting)).

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
| Tafla | 10077908 | Warehouse Posting ori |
| Heimildasafn | 10077900 | BIFROST WhsePost ori |
