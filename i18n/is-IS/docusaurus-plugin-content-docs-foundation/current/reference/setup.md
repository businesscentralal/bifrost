---
id: setup
title: "Setup reference"
sidebar_position: 3
---

## Yfirlit

Bifröst uppsetningin veitir miðlæga stillingu fyrir val á útfærslustefnu fyrir ýmsar skilaboðategundir. Þetta skjal útskýrir hvernig á að stilla uppsetningartöfluna, velja útfærslur í gegnum enum-tæki og skilja viðmót-byggt skipulag.

**Nafnrými:** `Origo.Bifrost`  
**Uppsetningartafla:** `Setup ori` (Tafla 10077901)  
**Uppsetningarsíða:** `Setup ori` (Síða 10077914)

---

## Uppsetningarskipulag

Bifröst-endingurinn notar **viðmótsmiðað skipulag** þar sem:

1. **Viðmót** skilgreina samninga sem útfærslur verða að fylgja
2. **Enum-tæki** bjóða upp á valmöguleika sem útfæra tiltekin viðmót
3. **Uppsetningartafla** geymir valdar enum-gildi fyrir hvert eiginleikasvæði
4. **Skilaboðategundarútfærslur** sækja valið viðmót úr uppsetningunni

Þetta hönnunarform leyfir:
- **Stækkunarhæfni**: Bættu við nýjum útfærslum með því að framlengja enum-tækið
- **Sveigjanleika**: Skipta um útfærslur án kóðabreytinga
- **Aðskilnað áhyggna**: Viðskiptaleg rök eru óháð útfærsluvalinu

---

## Stillireitar

### 1. Lánstraustateynd viðskiptavinar {#lnstraustateynd-viskiptavinar}

**Reitur:** `Customer Credit Limit Type` (Reitur 10)  
**Tegund:** Enum `Customer Credit Limit Type ori` (Enum 10077887)  
**Viðmót:** `Customer Credit Limit ori`  
**Tengd skilaboðategund:** `Customer.CreditLimit.Get`

**Tilgangur:** Ákvarðar hvernig lánstraustaútreikningur viðskiptavinar er framkvæmdur.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Útfærsla | Lýsing |
|---|---|---|---|
| 0 | Default | Default Credit Limit Impl ori | Staðlaður BC lánstraustaútreikningur |

**Stækkunarhæfni:**
```al
enumextension 50100 "My Credit Limit Type" extends "Customer Credit Limit Type ori"
{
    value(50100; "Enhanced Credit Check")
    {
        Caption = 'Enhanced Credit Check';
        Implementation = "Customer Credit Limit ori" = "My Credit Limit Impl";
    }
}
```

---

### 2. Þolinmæðihlutfall lánstraustmarks {#olinmihlutfall-lnstraustmarks}

**Reitur:** `Credit Limit Tolerance %` (Reitur 11)  
**Tegund:** Decimal  
**Svið:** 0 til 100  

**Tilgangur:** Skilgreinir þolinmæðihlutfall við athugun á hvort lánstraustamark sé farið yfir. Þetta gildi bætir við sveigjanleika í lánstraustaframfylgni með því að leyfa hlutfallslegan búfa yfir lánstraustamarkið.

**Hvernig það virkar:**

1. **Grunnútreikningur:**
   - Notað lán = Staða (SGM) + Útistandandi upphæð (SGM)
   - Eftirstandandi lán = Lánstraustamark − Notað lán

2. **Með þolinmæði:**
   - Þolinmæðiupphæð = Lánstraustamark × (Þolinmæðihlutfall ÷ 100)
   - Eftirstandandi lán með þolinmæði = Eftirstandandi lán + Þolinmæðiupphæð
   - Er farið yfir = (Eftirstandandi með þolinmæði &lt; 0)

**Tengdir svarreitir í Customer.CreditLimit.Get:**

- `remainingCredit`: Reiknaðar án þolinmæðihlutfalls
- `tolerancePercent`: Stillt þolinmæðihlutfall
- `remainingCreditWithTolerance`: Reiknaðar með þolinmæðihlutfalli
- `isCreditLimitExceeded`: Boolean byggt á þolinmæðiútreikningi

---

### 3. Vörubirgðaútreikningartegund {#vrubirgatreikningartegund}

**Reitur:** `Item Calc. Avail.Type` (Reitur 12)  
**Tegund:** Enum `Item Calc. Avail.Type ori` (Enum 10077891)  
**Viðmót:** `Item Calc. Availability ori`  
**Tengd skilaboðategund:** `Item.Availability.Get`

**Tilgangur:** Ákvarðar hvernig vörugæðar eru reiknaðar.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Útfærsla | Lýsing |
|---|---|---|---|
| 0 | Physical Inventory | Physical Inventory Impl ori | Skilar raunverulegt birgðamagn eftir staðsetningu |
| 1 | Calculated Quantity | Calculated Quantity Impl ori | Skilar reiknað tiltækt magn m.h.t. framboð og eftirspurn |

**Raunbirgðir (Physical Inventory):**
- Skilar raunverulegt `Inventory` reitargildi úr vörufjárhagsfærslum
- Einfaldur uppfræðslubyggður útreikningur
- Bestu nota þegar þú þarft núverandi á-hendi magn

**Snið svars:**
```json
{
  "itemNo": "1000",
  "inventory": [
    { "locationCode": "BLUE", "inventory": 50 },
    { "locationCode": "RED", "inventory": 30 }
  ]
}
```

**Reiknað magn (Calculated Quantity):**
- Reiknar áætlað tiltækt magn byggt á:
  - Núverandi birgðum
  - Frátengdum magni (til og mið `requested-delivery-date`)
  - Heildareftirspurn úr sölupöntunum, þjónustupöntunum, verkum, framleiðslu, samsetningum
  - Áætlaðar móttökur úr innkaupapöntunum, framleiðslu, samsetningum, flutningum
  - Áætlaðar pantanir úr beiðniskilagjörðum og áætlaðri framleiðslu

**Snið svars:**
```json
{
  "itemNo": "1000",
  "availability": [
    {
      "locationCode": "BLUE",
      "inventory": 50,
      "qtyReserved": 10,
      "grossRequirement": 20,
      "scheduledReceipt": 30,
      "plannedOrderReceipt": 15,
      "availableQuantity": 65
    }
  ]
}
```

---

### 4. Vöruverðútreikningartegund {#vruvertreikningartegund}

**Reitur:** `Item Price Calc. Type` (Reitur 13)  
**Tegund:** Enum `Item Price Calc. Type ori` (Enum 10077897)  
**Viðmót:** `Item Price Calculation ori`  
**Tengd skilaboðategund:** `Item.Price.Get`

**Tilgangur:** Ákvarðar hvernig verðupplýsingar vöru eru sóttar.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Útfærsla | Lýsing |
|---|---|---|---|
| 0 | Default | Default Price Impl ori | Staðlað verðlistasæki með stuðningi við viðskiptavin-sértækt verð |

**Verðvalrök (Priority order):**

1. Viðskiptavin-sértækt verð (ef `customerNo` er gefið)
2. Almennt verð (allir viðskiptavinir)
3. Verð af birgðarspjaldi (ef engar verðlistalínur finnast)

---

### 5. Sjálfgefinn tungumálakóði {#sjlfgefinn-tungumlaki}

**Reitur:** `Default Language Code` (Reitur 14)  
**Tegund:** Code[10]  
**Tengdar skilaboðategundir:** `Help.Tables.Get`, `Help.Fields.Get` og allar sem skila tungumálstengdum birtiheitum

**Tilgangur:** Tilgreinir sjálfgefið tungumál þegar `lcid` er ekki tilgreint í Bifröst skilaboðum.

**Tvær-stigsaðferð:**

1. **Aðalleiðin: lcid í Bifröst skilaboðum**
   - `lcid` reiturinn er tilgreindur á skilaboðastigi (ekki í data)
   - Þegar gefið, hefur forgang yfir Default Language Code

2. **Varamöguleiki: Default Language Code**
   - Notaður þegar `lcid` er ekki tilgreint í skilaboðum
   - Ef ekki stilltur eða Language-færsla finnst ekki, er sjálfgefið **1033** (Enska — Bandaríkin)

**Algengir tungumálakóðar:**

| Tungumálakóði | Windows Language ID | Lýsing |
|---|---|---|
| ENU | 1033 | Enska — Bandaríkin |
| ISL | 1039 | Íslenska |
| DEU | 1031 | Þýska |
| FRA | 1036 | Franska |
| ESP | 1034 | Spænska |
| SVE | 1053 | Sænska |
| NOR | 1044 | Norska |
| DAN | 1030 | Danska |

**Dæmi um notkun:**

*Beiðni án lcid → Default Language Code notað:*
```json
{ "type": "Help.Tables.Get", "data": {} }
```

*Beiðni með lcid → Þetta þriggur yfir Default Language Code:*
```json
{ "type": "Help.Tables.Get", "lcid": 1033, "data": {} }
```

---

### 6. Reikningstegundarúlfur viðskiptavinar {#reikningstegundarlfur-viskiptavinar}

**Reitur:** `Customer Statement Type` (Reitur 15)  
**Tegund:** Enum `Customer Statement Type ori` (Enum 10077888)  
**Viðmót:** `Customer Statement ori`  
**Tengd skilaboðategund:** `Customer.Statement.Pdf`

**Tilgangur:** Ákvarðar hvaða útfærsla er notuð til að búa til PDF-reikninga viðskiptavinar.

**Tiltæk útfærslur:**

| Gildi | Heiti | Útfærsla | Lýsing |
|---|---|---|---|
| 0 | Standard Statement | Standard Statement Impl ori | Notar BC skýrsluval fyrir C.Statement |

**Sjálfgefið gildi:** `Standard Statement` (gildi 0).

---

### 7. ChangeLog-skrifjörn {#changelog-skrifjrn}

**Reitur:** `ChangeLog Write Guard` (Reitur 17)  
**Tegund:** Enum `ChangeLog Write Guard Type ori` (Enum 10077898)  
**Viðmót:** `ChangeLog Write Guard ori`  
**Tengdar skilaboðategundir:** `Data.Records.Set`, `ChangeLog.Field.Restore`

**Tilgangur:** Stýrir hvaða reiti `Data.Records.Set` má skrifa í. Þegar virk, kannast verndin hvert markreit á móti BC Change Log uppsetningunni áður en skrif er framkvæmt.

**Tiltæk gildi:**

| Gildi | Birtiheiti | Hegðun |
|---|---|---|
| 0 | Open | Allir reitir mega skrifaðir — sama og hegðun án verndar. Sjálfgefið. |
| 1 | Blocked | Aðeins reitir með Change Log Modification-rakningu mega skrifaðir. Allir aðrir hafnaðir. |
| 2 | Via force | Sama og Blocked nema hægt er að fara framhjá með `"force": true` í beiðninni **og** með `Force Access ori` heimildarsetti. |

**Nota `force` sniðgang (aðeins Via force stillingu):**

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "subject": "Customer",
  "data": "{\"force\":true,\"data\":[{\"id\":\"...\",\"fields\":{\"Name\":\"Nýtt nafn\"}}]}"
}
```

**Athugasemdir:**

- Breyting á verndinni í `Blocked` eða `Via force` krefst þess að BC Change Log eiginleikinn sé virkur
- Notaðu `ChangeLog.Field.Enabled` til að athuga reitarþekju áður en skrift er reynd
- Án `Force Access ori` heimildarsetts er beiðninni hafnað jafnvel með `force: true`

---
### 8. Tegund útflutnings á heiti fyrirtækis {#tegund-tflutnings-heiti-fyrirtkis}

**Reitur:** `Export Company Name Type` (Reitur 18)  
**Tegund:** Enum `Company Name Type ori` (Enum 10077886)  
**Viðmót:** `Company Name ori`  
**Tengdar skilaboðategundir:** `CSV.Records.Get`, `CSV.DeletedRecords.Get`

**Tilgangur:** Velur hvaða heiti fyrirtækis er skrifað í `$Company` dálkinn í CSV-útflutningum. Reiturinn stýrir einum, kerfisúkekkilegum vali sem báðir CSV-útflutningar leysa einu sinni á beiðni (svo allar línur í sama útflutningi nota sama gildi).

**Tiltæk gildi:**

| Gildi | Birtiheiti | Útfærsla | Hegðun |
|---|---|---|---|
| 0 | Heiti fyrirtækis | `Default Company Name Impl ori` (10077888) | Skilar `CompanyName()` (tæknilegt `Company.Name`). Sjálfgefið. Stöðugt þótt birtingarheitið sé endurnefnt. |
| 1 | Birtingarheiti fyrirtækis | `Display Company Name Impl ori` (10077889) | Skilar `Company."Display Name"`. Þegar birtingarheitið er autt fellur það til baka á `CompanyName()` svo `$Company` dálkurinn er aldrei autður. |

**Hvenær á að nota hvert gildi:**

- **Heiti fyrirtækis** — móttökukerfi sem nota heitið sem auðkenni (skipting í gagnavatni, Open Mirroring lendingarsvæði, bc2adls). Endurnefningar á birtingarheiti mega ekki breyta skiptingarlykli.
- **Birtingarheiti fyrirtækis** — CSV-notendur sem eru manneskjur (rekstrarskýrslur, könnun). Birtingarheiti er notendavænna og samsvarar því sem sjást í BC.

**Lausn:**

```al
var
    BifrostSetup: Record "Setup ori";
    ExportCompanyName: Text[250];
begin
    ExportCompanyName := BifrostSetup.GetExportCompanyName();
end;
```

Báðar CSV-útfærslurnar kalla á `GetExportCompanyName()` einu sinni á beiðni og endurnota gildið fyrir hverja línu í `$Company` dálknum.

**Stækkanleiki:**

```al
enumextension 50104 "My Company Name Type" extends "Company Name Type ori"
{
    value(50100; "Legal Name")
    {
        Caption = 'Legal Name';
        Implementation = "Company Name ori" = "My Legal Name Impl";
    }
}
```

---
## Uppsetningaraðgerðir

### GetRecordOnce()

**Tilgangur:** Tryggir að uppsetningarfærslan sé aðeins hlaðin einu sinni á hverja færslu.

**Hegðun:**
- Kannar hvort færslan hafi þegar verið lesin í þessari keyrslu
- Ef ekki, reynir að sækja færsluna
- Ef færsla er ekki til, stofnar hana með sjálfgefnum gildum
- Stillir `RecordHasBeenRead` fána til að koma í veg fyrir endurteknar lesningar

**Notkun:**
```al
BifrostSetup.GetRecordOnce();
```

---

### InsertIfNotExists()

**Tilgangur:** Stofnar uppsetningarfærslu ef hún er ekki til.

**Notkun:**
```al
BifrostSetup.InsertIfNotExists();
```

---

### GetCustomerCreditLimitInterface()

**Tilgangur:** Sækir valda lánstraustautfærslu viðskiptavinar.

**Skilar:** Viðmót `Customer Credit Limit ori`

**Notkun:**
```al
var
    CreditLimitInterface: Interface "Customer Credit Limit ori";
    BifrostSetup: Record "Setup ori";
begin
    CreditLimitInterface := BifrostSetup.GetCustomerCreditLimitInterface();
    CreditLimitInterface.CheckCreditLimit(Argument);
end;
```

---

### GetItemCalculateAvailabilityInterface()

**Tilgangur:** Sækir valda vörubirgðaútreikningsutfærslu.

**Skilar:** Viðmót `Item Calc. Availability ori`

**Notkun:**
```al
var
    AvailabilityInterface: Interface "Item Calc. Availability ori";
    BifrostSetup: Record "Setup ori";
begin
    AvailabilityInterface := BifrostSetup.GetItemCalculateAvailabilityInterface();
    AvailabilityInterface.CalculateAvailability(Argument);
end;
```

---

### GetItemPriceCalculationInterface()

**Tilgangur:** Sækir valda vöruverðreikningsutfærslu.

**Skilar:** Viðmót `Item Price Calculation ori`

**Notkun:**
```al
var
    PriceInterface: Interface "Item Price Calculation ori";
    BifrostSetup: Record "Setup ori";
begin
    PriceInterface := BifrostSetup.GetItemPriceCalculationInterface();
    PriceInterface.CalculateItemPrice(Argument);
end;
```

---

### GetCustomerStatementInterface()

**Tilgangur:** Sækir valda reikningsútfærslu viðskiptavinar.

**Skilar:** Viðmót `Customer Statement`

**Notkun:**
```al
var
    StatementInterface: Interface "Customer Statement";
    BifrostSetup: Record "Setup ori";
begin
    StatementInterface := BifrostSetup.GetCustomerStatementInterface();
    StatementInterface.GetCustomerStatement(Argument);
end;
```

---
### GetCompanyNameInterface()

**Tilgangur:** Sækir valda útfærslu Company Name ori.

**Skilar:** Viðmót `Company Name ori`

**Hegðun:**
1. Hleður aðeins `Export Company Name Type` reitnum (snöggt)
2. Kallar á `GetRecordOnce()` til að tryggja að uppsetningarfærslan sé til
3. Skilar enum-gildinu sem viðmóti

**Notkun:**
```al
var
    CompanyNameInterface: Interface "Company Name ori";
    BifrostSetup: Record "Setup ori";
begin
    CompanyNameInterface := BifrostSetup.GetCompanyNameInterface();
end;
```

---

### GetExportCompanyName()

**Tilgangur:** Þegægileg vafning sem leysir valið útfærslu og skilar heiti fyrirtækis fyrir `$Company` dálkinn.

**Skilar:** `Text[250]`

**Hegðun:**
1. Kallar á `GetCompanyNameInterface()` til að fá valið útfærslu
2. Kallar á `GetCompanyName()` á þeirri útfærslu
3. Skilar textanum (aldrei autt — Display Name útfærslan fellur til baka á `CompanyName()`)

**Notkun:**
```al
var
    BifrostSetup: Record "Setup ori";
    ExportCompanyName: Text[250];
begin
    ExportCompanyName := BifrostSetup.GetExportCompanyName();
end;
```

Kallarar eiga að leysa þetta **einu sinni á beiðni** og endurnota gildið fyrir hverja línu í sömu útflutningi.

---
## Viðmótsarkitektúr

### Mynstur viðmótsskilgreiningar

Hvert eiginleikasvæði skilgreinir viðmót sem allar útfærslur verða að fylgja:

```al
interface "Item Calc. Availability ori"
{
    procedure CalculateAvailability(var Argument: Record "Message Argument ori")
}
```

### Mynstur enum-útfærslu

Enum-tæki útfæra viðmótið og tilgreina hvaða kóðaeining veitir útfærsluna:

```al
enum 10077889 "Item Calc. Avail.Type ori" implements "Item Calc. Availability ori"
{
    Extensible = true;
    DefaultImplementation = "Item Calc. Availability ori" = "Physical Inventory Impl ori";

    value(0; "Physical Inventory")
    {
        Caption = 'Physical Inventory';
        Implementation = "Item Calc. Availability ori" = "Physical Inventory Impl ori";
    }
    value(1; "Calculated Quantity")
    {
        Caption = 'Calculated Quantity';
        Implementation = "Item Calc. Availability ori" = "Calculated Quantity Impl ori";
    }
}
```

---

## Heimildarsett

Bifröst viðbótin inniheldur nokkur heimildarsett sem stýra aðgangi að ákveðnum eiginleikum.

### BIFROST ApprAdm ori

**Auðkenni heimildarsetts:** 10077889  
**Heiti:** `BIFROST ApprAdm ori`  
**Úthlutanlegt:** Já

**Tilgangur:** Stýrir hvaða notendur mega senda skjöl til samþykktar í gegnum `Document.Approval.Send` skilaboðategundina. Notandi sem er ekki með þetta heimildarsett fær villusvar þegar kallað er á `Document.Approval.Send`.

**Villa þegar vantar:**

```
User <UserSecurityId> does not have permissions to send documents to approval via Bifrost.
```

**Hvernig það virkar:** Heimildarsettið veitir skrifheimild á gátatöflu `Approval Access ori` (10077895). Útfærslan kannar `WritePermission()` á þeirri töflu áður en beiðni er unnin — engar færslur eru geymdar í töflunni.

**Úthlutun:** Úthlutið í gegnum venjulega BC **Heimildarsett** síðu eða í gegnum notendaflokk.

### Force Access ori

**Tilgangur:** Nauðsynlegt til að fara framhjá ChangeLog Write Guard þegar `"force": true` er notað í `Data.Records.Set` beiðnum þar sem verndin er stillt á **Via force**. Sjá [ChangeLog Write Guard](#changelog-skrifjrn) fyrir nánari upplýsingar.

### Bókunarhlið (Bifröst G/L / Item / FA / Job / Resource / Warehouse Posting)

Allar `*.Post` og `*.Reverse` skilaboðategundir sem skrifa færslur í höfuðbækur eru með hlið per bókunarsviði. Notandi sem ekki hefur viðeigandi heimildarsett fær villuskil án nokkurra hliðaráhrifa:

```
Posting denied: missing '<permission set name>' permission set (BIFROST GL Post ori, BIFROST ItemPost ori, BIFROST FA Post ori, BIFROST Job Post ori, BIFROST Res Post ori or BIFROST WhsePost ori).
```

Heimildarsettin sex eru sjálfstæð og **eru ekki innifalin í `BIFROST Read ori` eða `BIFROST Full ori`** — þeim verður að úthluta sérstaklega. Hvert veitir RIMD á tóma stoðtöflu (10077903–10077908) sem öryggiskjarni BC notar fyrir `WritePermission()` athugun; engar færslur eru geymdar.

| Heimildarsett | Auðkenni | Gátatafla | Skilaboðategundir með hliði |
|---|---|---|---|
| `BIFROST GL Post ori` | 10077895 | `G/L Posting ori` (10077904) | `Finance.GeneralJournal.Post`, `Finance.GeneralJournal.ReverseRegister`, `Finance.GeneralJournal.ReverseTransaction`, `Finance.BankReconciliation.Post`, `Finance.VAT.CalcAndPostSettlement`, `Customer.Application.Post`, `Customer.Application.Reverse`, `Vendor.Application.Post`, `Vendor.Application.Reverse`, `Sales.Document.Post`, `Purchase.Document.Post` |
| `BIFROST ItemPost ori` | 10077896 | `Item Posting ori` (10077905) | `Inventory.ItemJournal.Post`, `Inventory.TransferOrder.Post`, `Inventory.AssemblyOrder.Post` |
| `BIFROST FA Post ori` | 10077892 | `FA Posting ori` (10077903) | `FixedAssets.FAJournal.Post` |
| `BIFROST Job Post ori` | 10077897 | `Job Posting ori` (10077906) | `Projects.ProjectJournal.Post` |
| `BIFROST Res Post ori` | 10077899 | `Resource Posting ori` (10077907) | `Resources.ResourceJournal.Post` |
| `BIFROST WhsePost ori` | 10077900 | `Warehouse Posting ori` (10077908) | `Warehouse.Shipment.Post` (alltaf; krefst einnig `BIFROST GL Post ori` þegar `invoice = true`); `Warehouse.Pick.Register` (alltaf); `Warehouse.Putaway.Register` (alltaf) |

**Athugið:** `Sales.Document.Post` og `Purchase.Document.Post` eru gættar af **G/L eingöngu** þrátt fyrir að þær geti búið til vöru- og aðrar færslur í framhaldinu. Hliðið endurspeglar áform notandans um að ræsa bókun, ekki færslurnar sem BC skrifar að lokum. `Warehouse.Shipment.Post` með `invoice = true` er eina aðgerðin sem krefst tveggja heimildarsetta samtímis.

Athugunin liggur í codeunit `Posting Gate ori` (10078243). Til að bæta við sviði bætið gildi í enum `Posting Type ori` (10077899) ásamt samsvarandi gátatöflu og heimildarsetti.

---

## Tengd skjöl

- **[API_Reference.md](/foundation/reference/api/)**: API-endapunktar og auðkenning
- **[Sales_Message_Types.md](/foundation/message-types/sales/)**: Sölu- og viðskiptalegar skilaboðategundir (notar uppsetningarviðmót)
- **[ChangeLog_Message_Types.md](/foundation/message-types/change-log/)**: ChangeLog.Field.Restore og ChangeLog.Field.Enabled
