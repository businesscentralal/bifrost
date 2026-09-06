---
id: api
title: "API reference"
sidebar_position: 2
---

## Yfirlit

Origo Bifröst-endingurinn veitir API-endapunkta til að stjórna og vinna með skilaboð í samræmi við Bifröst-staðalinn. Þetta skjal lýsir öllum tiltækum API-endapunktum og studdum skilaboðategundum.

**Nafnrými:** `Origo.Bifrost`  
**API-útgefandi:** `origo`  
**API-hópur:** `bifrost`  
**API-útgáfa:** `v1.0`

---

## API-endapunktar

### 1. Bifröst Data API — Svarsgögn {#bifrst-data-api-svarsggn}

**Tilgangur:** Skilar svarsgagnasniðið fyrir tiltekin skilaboð.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `response`
- **Einingasettaheiti:** `responses`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/responses`
- **Aðgangur:** Eingöngu lestur (engar setja-inn eða breyta-aðgerðir)

**Reitir:**

| Reitnafn | Tegund | Lýsing |
|---|---|---|
| `id` | Guid | Einkvæmt auðkenni skilaboðanna |
| `data` | Blob | Svarsgagnasniðið |

**Studdar aðgerðir:**

- **GET** (ein): Sækir svarsgögn fyrir tiltekin skilaboð eftir auðkenni
- **GET** (safn): Sækir öll svarsgagnagildi

**Dæmi um beiðni:**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

---

### 1b. Request Data API ori — Upprunalegar beiðnigögn

**Tilgangur:** Skilar upprunalegar beiðnigögn fyrir tiltekin skilaboð. Gagnlegt til að skoða eða endursenda beiðni.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `request`
- **Einingasettaheiti:** `requests`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/requests`
- **Aðgangur:** Eingöngu lestur

**Reitir:**

| Reitnafn | Tegund | Lýsing |
|---|---|---|
| `id` | Guid | Einkvæmt auðkenni skilaboðanna |
| `data` | Blob | Upprunaleg beiðnifærmibreyta (JSON, XML eða venjulegur texti) |

**Sækja gögn beint (ráðlæg leið):**

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')/data
Authorization: Bearer {token}
```

**Öryggi:** Niðurstöður eru sjálfkrafa síaðar að færslum sem voru stofnaðar af kallandi forrita (`SystemCreatedBy = UserSecurityId()`).

---

### 2. Queue API ori {#queue-api-ori}

**Tilgangur:** Stofna skilaboðabeiðnir og fá stöður fyrir í biðröð (ósamstillt) skilaboð.

**Endapunktsupplýsingar:**

- **Einingaheiti:** `queue`
- **Einingasettaheiti:** `queues`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/queues`
- **Vinnsluháttur:** Ósamstilltur (skilaboð eru tímasett fyrir bakgrunnsvinnslu)

**Reitir:**

| Reitnafn | Tegund | Lýsing | Nauðsynlegt |
|---|---|---|---|
| `specversion` | Text | Bifröst-staðal útgáfa | Já |
| `type` | Enum | Skilaboðategundarauðkenni | Já |
| `source` | Text | Lýsing forrita (t.d., "MyApp v1.2.3") | Já |
| `id` | Guid | Einkvæmt auðkenni (sjálfkrafa búið til) | Nei |
| `time` | DateTime | Viðburðartímastimpill | Nei |
| `subject` | Text | Efni viðburðar | Nei |
| `continueFromRecordId` | Guid | SystemId færslu til að halda áfram frá (t.d. CSV.Records.Get). Slepptu fyrir fyrstu beiðni. | Nei |
| `lcid` | Integer | Windows Language ID (t.d. 1033 = Enska, 1039 = Íslenska). Sjálfgefið: Default Language Code úr Bifröst Setup. | Nei |
| `datacontenttype` | Text | Efnistegund gagna (application/json, application/xml, text/plain) | Nei |
| `data` | BigText | Beiðnifæribreytur (JSON, XML eða texti) | Nei |

**Studdar aðgerðir:**

#### POST — Stofna biðraðarskilaboð

Stofnar nýja skilaboðabeiðni sem verður unnin ósamstillt.

**Dæmi um beiðnisniðmát:**

```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1033
}
```

**Svar:** Skilar stofnuðum skilaboðum með úthlutaðri auðkenni og tímastimpli. Þegar vinnsla er lokið mun `data` reiturinn innihalda niðurhalsslóð til að sækja svarsgögnin.

#### GET — Sækja biðraðarskilaboð

```http
GET /api/origo/bifrost/v1.0/queues
```

---

### Queue API-aðgerðir

#### RetryTask

Reynir aftur vinnslu skilaboða í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.RetryTask
```

**HTTP-stöðugildi:**

| Merkingarleg staða | HTTP-stöðukóði | Lýsing |
|---|---|---|
| Created | 201 Created | Verk er þegar í gangi og ekki hægt að reyna aftur |
| Updated | 200 OK | Verk var endurræst |
| None | 204 No Content | Mistókst að stofna nýtt bakgrunnsverk |

---

#### CancelTask

Hættir við tímasett verk fyrir skilaboð í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.CancelTask
```

**HTTP-stöðugildi:**

| Merkingarleg staða | HTTP-stöðukóði | Lýsing |
|---|---|---|
| Deleted | 204 No Content | Ekkert verk var tímasett |
| Updated | 200 OK | Verki var aflýst |
| None | 204 No Content | Aflýsing verks mistókst |

---

#### GetStatus

Sækir stöðu skilaboða í Bifröst.

**Endapunktur:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Stöðugildi:**

- **Created**: Skilaboðin eru enn í vinnslu
- **Deleted**: Ekki er tímasett verk
- **Updated**: Vinnslu er lokið og niðurstöður eru tiltækar
- **None**: Staða skilaboðanna er óþekkt

---

### 3. Task API ori {#task-api-ori}

**Tilgangur:** Stofna og vinna skilaboð í Bifröst samstillt (bein vinnsla).

**Endapunktsupplýsingar:**

- **Einingaheiti:** `task`
- **Einingasettaheiti:** `tasks`
- **Grunnslóð:** `/api/origo/bifrost/v1.0/tasks`
- **Vinnsluháttur:** Samstilltur (skilaboð eru unnin samstundis við stofnun)

**Reitir:** Sömu reitir og Queue API. `lcid` er **ekki** stutt í Task API — notaðu Queue API fyrir tungumálsstillt svör.

**Studdar aðgerðir:**

#### POST — Stofna og vinna verk

Stofnar ný skilaboð og vinnur þau samstundis. Svarið mun innihalda niðurhalsslóð að svarsgögnunum í `data` reitnum.

**Dæmi um beiðnisniðmát:**

```json
{
  "specversion": "1.0",
  "type": "Help.Fields.Get",
  "source": "MyIntegrationApp v1.0",
  "subject": "Customer",
  "datacontenttype": "application/json",
  "data": "{\"tableName\":\"Customer\"}"
}
```

---

## Skilaboðategundir

Bifröst-endingurinn styður eftirfarandi skilaboðategundir. Allar innbyggðar skilaboðategundir krefjast JSON-sniðs í `data` reitnum.

**Stækkunarhæfni:** Þennan ending má framlengja með sérsniðnum útfærslum fyrir fleiri skilaboðategundir með því að útfæra `Msg Interface ori`.

### Yfirlit yfir allar skilaboðategundir

| Skilaboðategund | Lýsing | Stefna | Skjöl |
|---|---|---|---|
| **Gagnaðgerðir** | | | |
| Data.Records.Get | Sækir fullkláraðar færslugögn sem JSON | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#datarecordsget) |
| Data.Records.Set | Setur inn eða uppfærir færslugögn sem JSON | Innlæg | [Data_Message_Types.md](/foundation/message-types/data/#datarecordsset) |
| Data.RecordIds.Get | Sækir færsluauðkenni og breytingartímastimpla | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#datarecordidsget) |
| CSV.Records.Get | Flytur allar samsvarandi færslur sem CSV á Open Mirroring sniði | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#csvrecordsget) |
| Data.Totals.Get | Leggur saman Decimal SumIndexFields yfir allar samsvarandi færslur | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#datatotalsget) |
| Deleted.Records.Get | Sækir fullkláraðar reitastigsþykkvandi eyðdar færslur | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#deletedrecordsget) |
| Deleted.RecordIds.Get | Sækir SystemId og eyðingartímastimpil | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#deletedrecordidsget) |
| CSV.DeletedRecords.Get | Flytur endurskoðunarkladda yfir eyðdar færslur sem CSV | Útlæg | [Data_Message_Types.md](/foundation/message-types/data/#csvdeletedrecordsget) |
| **Lýsigagnaðgerðir** | | | |
| Help.Tables.Get | Skilar lista yfir allar tiltækar töflur | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helptablesget) |
| Help.Fields.Get | Sækir reitarlýsigögn þ.m.t. reitanúmer, heiti, tegund og aðallyklastöðu | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpfieldsget) |
| Help.MessageTypes.Get | Skilar lista yfir allar tiltækar skilaboðategundir | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpmessagetypesget) |
| Help.Implementation.Get | Skilar hjálparskjölun fyrir tilgreinda skilaboðategund | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpimplementationget) |
| Help.Permissions.Get | Sækir les-/skrifaheimildir notanda á töflu | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helppermissionsget) |
| Help.NextLineNo.Get | Skilar næsta línunúmeri þar sem síðasti aðallyklireitur er Integer | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpnextlinenoget) |
| Help.PageUrl.Get | Skilar Business Central vefslóð fyrir spjaldsíðu tiltekinnar færslu. Efnisgerð svars: text/json | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helppageurlget) |
| Help.TableRelations.Get | Skilar ytri lyklasambönd töflu | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/) |
| Field.Translation.Get | Sækir BC-kerfisþýðingu fyrir reit á færslu | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationget) |
| Field.Translation.Set | Skrifar eða eyðir BC-kerfisþýðingu | Innlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationset) |
| Field.Translations.Get | Sækir allar BC-kerfisþýðingar á færslu | Útlæg | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationsget) |
| **Sölu-, viðskiptavina- og vöruðgerðir** | | | |
| Customer.CreditLimit.Get | Sækir lánstraustaupplýsingar viðskiptavinar | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#customercreditlimitget) |
| Customer.SalesHistory.Get | Sækir söluferil eftir vöru | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#customersaleshistoryget) |
| Customer.Statement.Pdf | Sækir reikning viðskiptavinar sem PDF | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#customerstatementpdf) |
| Item.Availability.Get | Sækir vörugæðar (raunbirgðir eða reiknað magn) | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#itemavailabilityget) |
| Item.Price.Get | Sækir verðlýsigögn vöru úr verðlistum | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#itempriceget) |
| Sales.Document.Post | Bókar sölupöntun | Innlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentpost) |
| Sales.Document.Release | Gefur út opna sölupöntun | Innlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentrelease) |
| Sales.Document.Reopen | Opnar aftur söluskjal (Released eða Pending Approval) | Innlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentreopen) |
| Sales.Document.Statistics | Sækir tölfræðilegar upplýsingar sölupöntunar | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentstatistics) |
| Sales.Document.PreviewPost | Líkir eftir bókun söluskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun | Innlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentpreviewpost) |
| Sales.SalesInvoice.Pdf | Sækir bókaðan sölureikning sem PDF | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalesinvoicepdf) |
| Sales.SalesShipment.Pdf | Sækir bókað almennutslipp sem PDF | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalesshipmentpdf) |
| Sales.SalesCreditMemo.Pdf | Sækir bókað kreditreikningsskjal sem PDF | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalescreditmemopdf) |
| Sales.ReturnReceipt.Pdf | Sækir bókað skilakvittunaskjal sem PDF | Útlæg | [Sales_Message_Types.md](/foundation/message-types/sales/#salesreturnreceiptpdf) |
| **Innkaupaðgerðir** | | | |
| Purchase.Document.Release | Gefur út opna innkaupapöntun | Innlæg | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentrelease) |
| Purchase.Document.Reopen | Opnar aftur innkaupaskjal (Released eða Pending Approval) | Innlæg | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentreopen) |
| Purchase.Document.Statistics | Sækir tölfræðilegar upplýsingar innkaupapöntunar | Útlæg | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentstatistics) |
| Purchase.Document.Post | Bókar innkaupapöntun | Innlæg | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentpost) |
| Purchase.Document.PreviewPost | Líkir eftir bókun innkaupaskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun | Innlæg | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentpreviewpost) |
| **Fjárhagsðgerðir** | | | |
| Finance.GeneralJournal.Check | Sannprófar bókhaldslotubók og skilar nákvæmri stöðuupplýsingu | Útlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financegeneraljournalcheck) |
| Finance.GeneralJournal.Post | Bókar bókhaldslotubók og skilar bókunartölfræðum | Innlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financegeneraljournalpost) |
| Finance.FAJournal.SetupNewLine | Stofnar nýja fastafjármunadagbókarlínu með sjálfgefnum gildum | Innlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalsetupnewline) |
| Finance.FAJournal.Check | Sannvirðir fastafjármunadagbókarrunu án bókunar; núll-upphæðir gefa viðvörun | Útlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalcheck) |
| Finance.FAJournal.Post | Bókar fastafjármunadagbókarrunu og skilar bókunartölfræðum | Innlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalpost) |
| Finance.FAJournal.PreviewPost | Hermir bókun á fastafjármunadagbókarrunu og skilar spáðum færslum (afturkallað). Ekki gagnabreytandi. | Innlæg | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalpreviewpost) |
| Inventory.ItemJournal.SetupNewLine | Stofnar nýja vörudagbókarlínu með sjálfgefnum gildum | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalsetupnewline) |
| Inventory.ItemJournal.Check | Sannvirðir vörudagbókarrunu án bókunar | Útlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalcheck) |
| Inventory.ItemJournal.Post | Bókar vörudagbókarrunu og skilar bókunartölfræðum | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalpost) |
| Inventory.ItemJournal.PreviewPost | Hermir bókun á vörudagbókarrunu og skilar spáðum færslum (afturkallað). Ekki gagnabreytandi. | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalpreviewpost) |
| **Vöruhúsaðgerðir** | | | |
| Warehouse.Shipment.Create | Stofnar eina vöruhús-sendingu fyrir hvert tilgreint frumskjal (Sölupöntun, Útflutningstilfærsla) í gegnum BC kóðaeiningu 5752 `Get Source Doc. Outbound`. Hver uppspretta býr til sinn eigin haus | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentcreate) |
| Warehouse.Shipment.Post | Bókar vöruhús-sendingu í gegnum BC kóðaeiningu 5763 `Whse.-Post Shipment`. Með `invoice=true` eru frumskjölin einnig reikningar. Hlið: `Warehouse Posting ori` (alltaf) og `G/L Posting ori` (þe gar `invoice=true`) | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentpost) |
| Warehouse.Pick.Create | Stofnar vöruhústínslu úr vöruhús-sendingu í gegnum BC skýrslu 7318 `Whse.-Shipment - Create Pick`. Valfrjálst `assignedUserId` og `sortingMethod` eru sett eftir stofnun (háð skrifaðgangstakmörkunum á `Warehouse Activity Header`). | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehousepickcreate) |
| Warehouse.Pick.Register | Skráir vöruhústínslu í gegnum BC kóðaeiningu 7307 `Whse.-Activity-Register`. Færir tínsluna í sögu og skrifar `Qty. Picked` / `Qty. to Ship` á vöruhús-sendings línur. Hlið: `Warehouse Posting ori`. | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehousepickregister) |
| Warehouse.Putaway.Create | Stofnar vöruhúsið-staf (Put-away) frá bókaðri vöruhúsmóttöku gegnum BC skýrslu 7305 `Whse.-Source - Create Document`. Aðgangsleyfi `assignedUserId` og `sortingMethod` sett eftir stofnun (háð ritlæsingum á `Warehouse Activity Header`). | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseputawaycreate) |
| Warehouse.Putaway.Register | Skráir vöruhús-staðsetningu (Put-away) gegnum BC kóðaeiningu 7307 `Whse.-Activity-Register`. Færir vörur úr móttökubin í geymslubin og skrifar `Qty. Put Away` á bókaðar móttöku-línur. Hlið: `Warehouse Posting ori`. | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseputawayregister) |
| Warehouse.Shipment.PreviewPost | Hermir bókun á vöruhús-sendingu (Sending + Reikningur — reikningsflágg fast í `true`) og skilar spáðum færslum (afturkallað). Ekki gagnabreytandi. | Innlæg | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentpreviewpost) |
| Projects.ProjectJournal.SetupNewLine | Stofnar nýja verkefnadagbókarlínu með sjálfgefnum gildum | Innlæg | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalsetupnewline) |
| Projects.ProjectJournal.Check | Sannvirðir verkefnadagbókarrunu án bókunar | Útlæg | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalcheck) |
| Projects.ProjectJournal.Post | Bókar verkefnadagbókarrunu og skilar bókunartölfræðum | Innlæg | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalpost) |
| Projects.ProjectJournal.PreviewPost | Hermir bókun á verkefnadagbókarrunu og skilar spáðum færslum (afturkallað). Ekki gagnabreytandi. | Innlæg | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalpreviewpost) |
| Resources.ResourceJournal.SetupNewLine | Stofnar nýja aðfangadagbókarlínu með sjálfgefnum gildum | Innlæg | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalsetupnewline) |
| Resources.ResourceJournal.Check | Sannvirðir aðfangadagbókarrunu án bókunar | Útlæg | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalcheck) |
| Resources.ResourceJournal.Post | Bókar aðfangadagbókarrunu; skráningarsvið eru skilyrt | Innlæg | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalpost) |
| **Aðgerðir fyrir innkomandi skjöl** | | | |
| Incoming.Document.Create | Stofnar nýtt innkomandi skjal með aðalviðhengi | Innlæg | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentcreate) |
| Incoming.Document.Attach | Bætir viðbótarviðhengi við innkomandi skjal | Innlæg | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentattach) |
| Incoming.Document.Process | Afgreiðir innkomandi skjal og stofnar kaupnótu eða dagbókarlínu | Innlæg | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentprocess) |
| Incoming.Document.Get | Sækir innkomandi skjal með hausupplýsingum og öllum viðhengjum sem Base64 | Útlæg | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentget) |
| **Samþykktaraðgerðir** | | | |
| Document.Approval.Get | Sækir samþykktarfærslur með tengdum virkum og bókuðum samþykktarfærslum, með heimildasíu á hverja færslu | Útlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalget) |
| Document.Approval.Send | Stofnar samþykktarfærslur fyrir skjal með samþykktaraðilaúthlutunum úr stilltum samþykktarferlum | Innlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalsend) |
| Document.Approval.Approve | Samþykkir eina eða fleiri opnar samþykktarfærslur með BC staðlaðri Approvals Mgmt. heimild | Innlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalapprove) |
| Document.Approval.Reject | Hafnar einni eða fleiri opnum samþykktarfærslum með valfrjálsri athugasemd | Innlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalreject) |
| Document.Approval.Me | Sækir samþykktarfærslur úthlutaðar á kallandi notanda með tengingu við upprunaskjöl | Útlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalme) |
| Document.Approval.Delegate | Framselur eina eða fleiri opnar samþykktarfærslur á annan notanda | Innlæg | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovaldelegate) |
| **Minnisaðgerðir** | | | |
| Memory.Company.Get | Sækir minnisfærslur á fyrirtækjasvæði með valfrjálsri síðuvísun og síu | Útlæg | [Memory_Message_Types.md](/foundation/message-types/memory/#memorycompanyget) |
| Memory.Company.Set | Setur inn eða uppfærir minnisfærslur á fyrirtækjasvæði úr JSON-gögnum | Innlæg | [Memory_Message_Types.md](/foundation/message-types/memory/#memorycompanyset) |
| Memory.User.Get | Sækir minnisfærslur á notandasvæði, sía á innskráðan notanda | Útlæg | [Memory_Message_Types.md](/foundation/message-types/memory/#memoryuserget) |
| Memory.User.Set | Setur inn eða uppfærir minnisfærslur á notandasvæði fyrir innskráðan notanda | Innlæg | [Memory_Message_Types.md](/foundation/message-types/memory/#memoryuserset) |

---

## Viðburðir og vefkrókar

Bifröst-endingurinn veitir **ytri viðskiptaviðburði** sem gera ytri kerfum kleift að fá vefkrókstilkynningar þegar skilaboð líkja eða mistakast við vinnslu. Þetta eyðir þörfina fyrir samfellda könnun og gerir kleift að nota sanna viðburðsdrifna skipan.

### Vefkrókstilkynningar

**Viðburðamynstur:** Lágmarks-tilkynning + API-sæki

1. Ytri kerfi sendir skilaboð í Queue API eða Task API
2. Business Central vinnur skilaboðin ósamstillt (Queue API) eða samstillt (Task API)
3. Þegar vinnslu er lokið eða mistakast, heldur BC uppi ytri viðskiptaviðburðinum
4. Áskrifaðir endapunktar fá lágmarkstilkynningu (MessageId, MessageType, Timestamp)
5. Ytri kerfi kallar á Data API með MessageId til að sækja fullt svar

### Tiltækir viðburðir

| Viðburðarheiti | Þegar haldið uppi | Vefkróksgreiðsla | Notkunartilvik |
|---|---|---|---|
| **BifrostMessageCompleted** | Vinnsla skilaboða tekst | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Tilkynna ytri kerfum um farsæla lok |
| **BifrostMessageFailed** | Vinnsla skilaboða mistekst | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Viðvara um vinnslubilun |

### Uppsetning

Stilltu vefkrókáskriftir í gegnum **Event Subscriptions** síðu í Business Central:

1. Farðu í **Event Subscriptions**
2. Stofnaðu nýja áskrift
3. Veldu viðburð: `BifrostMessageCompleted` eða `BifrostMessageFailed`
4. Stilltu **Event Category**: "Origo Bifröst"
5. Stilltu endapunktsslóð og auðkenningu
6. Virkjaðu áskrift

Nákvæm skjöl um vefkrók stillingar, öryggissjónarmiðir og kóðadæmi er að finna í: **[Events_and_Webhooks.md](/foundation/reference/events-and-webhooks/)**

---

## Auðkenning

Allir API-endapunktar krefjast auðkenningar með OAuth 2.0 eða Basic Authentication eins og stillt er í Business Central.

**Nauðsynlegar heimildir:**

- Notendur verða að hafa viðeigandi heimildir skilgreindar í `BIFROST Full ori` heimildarsetti.

### Gagnaeinangrun — Entra-forritamarkur

Allir Bifröst-endapunktar (`/tasks`, `/queues`, `/responses`, `/requests`) framfylgja **strangri gagnaeinangrun á Entra-forritastigi**.

Hvert svar er sjálfkrafa síað á þjóni að færslum þar sem `SystemCreatedBy = UserSecurityId()`. `UserSecurityId()` í Business Central leysist í Object ID **Entra-forritsins (Client ID)** sem auðkenndi beiðnina.

**Afleiðingar:**

| Atvik | Niðurstaða |
|---|---|
| Forrit A sækir `/queues` | Skilar aðeins skilaboðum sem Forrit A sendi |
| Forrit A biður um `/responses({id})` stofnað af Forriti B | Skilar tómt — engin gagnaleki |
| Forrit A biður um `/requests({id})` stofnað af Forriti B | Skilar tómt — engin gagnaleki |
| Tvö forrit deila sama fyrirtæki + umhverfi | Sérhvert sér aðeins eigin skilaboðaferil |

Þessi einangrun er **skilyrðislaus** — hana er ekki hægt að sniðganga með OData síum, admin-skilríkjum eða öðrum meðulum.

---

## Notkunardæmi

### Dæmi 1: Sækja lista yfir töflur (samstillt)

**Beiðni:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Svar:**

```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-19T10:30:00Z",
  "datacontenttype": "text/json",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

---

### Dæmi 2: Sækja reitarlýsigögn töflu (ósamstillt)

**Skref 1: Setja í biðröð**

```http
POST /api/origo/bifrost/v1.0/queues
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.Fields.Get",
  "subject": "Customer",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{\"tableName\":\"Customer\"}"
}
```

**Skref 2a: Valinn — Kanna stöðu (könnun)**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Skref 2b: Ráðlægt — Vefkrókstilkynning**

Gerast áskrifandi að `BifrostMessageCompleted` viðburðinum og fáðu sjálfvirka tilkynningu:

```json
{
  "MessageId": "{message-id}",
  "MessageType": "Help.Fields.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses({message-id})/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

**Skref 3: Sækja niðurstöður**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')/data
Authorization: Bearer {token}
```

---

## Tengd skjöl

- **[Data_Message_Types.md](/foundation/message-types/data/)**: Gagnaðgerðir til að sækja og uppfæra færslur
- **[Metadata_Message_Types.md](/foundation/message-types/metadata/)**: Uppbyggingaruppgötvun og API-lýsigögn
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Viðskiptaaðgerðir fyrir sölu, viðskiptavini og vörur
- **[Purchase_Message_Types.md](/foundation/message-types/purchase/)**: Viðskiptaaðgerðir fyrir innkaupapantanir
- **[Finance_Message_Types.md](/foundation/message-types/finance/)**: Fjárhagsðgerðir fyrir bókhaldslotubækur og fastafjármunadagbækur
- **[Inventory_Message_Types.md](/foundation/message-types/inventory/)**: Vörudagbókargerðir (uppsetning, sannvörðun, bókun)
- **[Projects_Message_Types.md](/foundation/message-types/projects/)**: Verkefnadagbókargerðir (uppsetning, sannvörðun, bókun)
- **[Resources_Message_Types.md](/foundation/message-types/resources/)**: Aðfangadagbókargerðir (uppsetning, sannvörðun, bókun)
- **[IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/)**: Aðgerðir fyrir innkomandi skjöl
- **[Memory_Message_Types.md](/foundation/message-types/memory/)**: Minnisaðgerðir á fyrirtækja- og notandasvæði
- **[Events_and_Webhooks.md](/foundation/reference/events-and-webhooks/)**: Vefkrókar og ytri viðskiptaviðburðir
- **[Setup_Reference.md](/foundation/reference/setup/)**: Uppsetningarhandbók og útfærsluval
- **[Field_Access_Restrictions.md](/foundation/reference/field-access-restrictions/)**: Reitarsniðangursheimildir og uppsetning
- **[Secrets.md](/foundation/reference/secrets/)**: Sameiginleg leyndarmálageymsla forrita
- **[Extending_Bifrost_Setup.md](/extensibility/setup-and-secrets/)**: Útvíkkunarpunkturinn Apps á uppsetningarsíðu Bifrastar
