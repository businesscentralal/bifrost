---
id: sales
title: "Sales, customer and item message types"
sidebar_position: 3
---

**Yfirskjal:** [API_Reference.md](/foundation/reference/api/)  
**Útfærslumappa:** `app/src/Message Type/Implementations/Sales/`

---

## Yfirlit

Þetta skjal lýsir Sölu-, Viðskiptavina- og Vöru-skilaboðategundunum í Bifröst API. Þessar skilaboðategundir bjóða upp á viðskiptaaðgerðir fyrir lánstraust viðskiptavina, vörugæðar, verðlag, verkferla sölupantana og PDF skjalasækingu.

| Skilaboðategund | Stefna | Tilgangur | Tengdar töflur |
|---|---|---|---|
| Customer.CreditLimit.Get | Útlæg | Sækir lánstraustaupplýsingar viðskiptavinar | Customer (18) |
| Customer.SalesHistory.Get | Útlæg | Sækir söluferil eftir vöru | Customer (18), Item Ledger Entry (32) |
| Customer.Statement.Pdf | Útlæg | Sækir reikning viðskiptavinar sem PDF | Customer (18) |
| Item.Availability.Get | Útlæg | Sækir gæðaupplýsingar vöru | Item (27) |
| Item.Price.Get | Útlæg | Sækir verðlýsigögn vöru úr verðlistum | Item (27), Price List Line |
| Sales.Document.Release | Innlæg | Gefur út opna sölupöntun | Sales Header (36) |
| Sales.Document.Reopen | Innlæg | Opnar aftur söluskjal (Released eða Pending Approval) til breytinga | Sales Header (36) |
| Sales.Document.Statistics | Útlæg | Sækir tölfræðilegar upplýsingar sölupöntunar | Sales Header (36) |
| Sales.Document.Post | Innlæg | Bókar sölupöntun og skilar bókuðum reikningsnúmeri | Sales Header (36), Sales Invoice Header (112) |
| Sales.Document.PreviewPost | Innlæg | Líkir eftir bókun söluskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun | Sales Header (36) + allar færslubókartöflur sem BC bókunarrútína fyllir (kvik; innbyggður stuðningur fyrir m.a. G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Cust. / Detailed Cust. Ledger, Vendor / Detailed Vendor Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger) |
| Sales.SalesInvoice.Pdf | Útlæg | Sækir bókaðan sölureikning sem PDF | Sales Invoice Header (112) |
| Sales.SalesShipment.Pdf | Útlæg | Sækir bókað sölushipping sem PDF | Sales Shipment Header (110) |
| Sales.SalesCreditMemo.Pdf | Útlæg | Sækir bókað kreditreikningsskjal sem PDF | Sales Cr.Memo Header (114) |
| Sales.ReturnReceipt.Pdf | Útlæg | Sækir bókað skilakvittun sem PDF | Return Receipt Header (6660) |
| Sales.SalesInvoice.Correct | Innlæg | Bakfærir bókaðan sölureikning og býr til nýjan drög að sölureikningi til leiðréttingar (BC codeunit 1303) | Sales Invoice Header (112), Sales Cr.Memo Header (114), Sales Header (36) |
| Sales.SalesInvoice.Cancel | Innlæg | Bakfærir bókaðan sölureikning með því að bóka jöfnunarkreditreikning (BC codeunit 1303) | Sales Invoice Header (112), Sales Cr.Memo Header (114) |
| Sales.SalesInvoice.Send | Innlæg | Sendir bókaðan sölureikning gegnum BC `Sales Invoice Header.SendProfile` með Document Sending Profile sem leyst er fram | Sales Invoice Header (112), Document Sending Profile (60), Customer (18) |
| Sales.SalesCreditMemo.Send | Innlæg | Sendir bókaðan kreditreikning gegnum BC `Sales Cr.Memo Header.SendProfile` með Document Sending Profile sem leyst er fram | Sales Cr.Memo Header (114), Document Sending Profile (60), Customer (18) |
| Customer.Application.Post | Innlæg | Jafnar færslu viðskiptavinar á móti einni eða fleiri opnum færslum viðskiptavinar (codeunit 226) | Cust. Ledger Entry (21) |
| Customer.Application.Reverse | Innlæg | Bakar (aftengir) bókaða jöfnun á færslu viðskiptavinar (codeunit 226) | Cust. Ledger Entry (21) |
| Sales.Quote.MakeOrder | Innlæg | Breytir sölutilboði í sölupöntun með BC codeunit 86 "Sales-Quote to Order" | Sales Header (36) |
| Sales.BlanketOrder.MakeOrder | Innlæg | Breytir rammapöntun (Blanket Order) í sölupöntun með BC codeunit 87 "Blanket Sales Order to Order" | Sales Header (36) |

**Athugið:** Allar PDF-skilaboðategundir styðja uppflettingu bæði með skjalanúmeri og SystemId (GUID).

---

## Customer.CreditLimit.Get

**Tilgangur:** Sækja lánstraustaupplýsingar viðskiptavinar þ.m.t. stöðu, útistandandi upphæðir og lánstraustaástand.

**Lýsing:** Sækir lánstraustaupplýsingar þ.m.t. stöðu, útistandandi upphæðir, eftirstandandi lán (með og án þolinmæðihlutfalls) og lánstígandavísar.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

Viðskiptavinarnúmer má tilgreina annað hvort í **subject** reitnum eða í **data** færibreytum:

**Möguleiki 1: Nota subject reit**
```json
{ "subject": "10000" }
```

**Möguleiki 2: Nota JSON gagnafæribreytur**
```json
{ "data": { "customerNo": "10000" } }
```

**Möguleiki 3: Nota SystemId viðskiptavinar**
```json
{ "data": { "customerId": "{12345678-1234-1234-1234-123456789012}" } }
```

**Snið svars:**

```json
{
  "status": "Success",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "balanceLCY": 1234.56,
  "outstandingBalanceDueLCY": 500.00,
  "creditLimitLCY": 10000.00,
  "outstandingAmountLCY": 2000.00,
  "remainingCredit": 6765.44,
  "tolerancePercent": 10.00,
  "remainingCreditWithTolerance": 7765.44,
  "hasOverdueBalance": true,
  "isCreditLimitExceeded": false
}
```

**Svarreitir:**

- **status**: Vinnslustöðu ("Success" eða "Error")
- **customerNo**: Viðskiptavinarnúmer
- **customerName**: Nafn viðskiptavinar
- **balanceLCY**: Núverandi staða í SGM (Customer."Balance (LCY)")
- **outstandingBalanceDueLCY**: Útistandandi staða sem er gjaldfallin í SGM
- **creditLimitLCY**: Lánstraustamark í SGM
- **outstandingAmountLCY**: Útistandandi upphæð af sölupöntunum
- **remainingCredit**: Eftirstandandi lán án þolinmæðihlutfalls
- **tolerancePercent**: Þolinmæðihlutfall frá Bifröst Setup
- **remainingCreditWithTolerance**: Eftirstandandi lán með þolinmæðihlutfalli
- **hasOverdueBalance**: Boolean — hvort gjaldfallin staða sé til
- **isCreditLimitExceeded**: Boolean — hvort lánstraustamark sé farið yfir (tekur tillit til þolinmæðihlutfalls)

**Dæmi um útreikning:**

Gefið:
- Lánstraustamark: 10.000,00 SGM  
- Núverandi staða: 5.000,00 SGM  
- Útistandandi pantanir: 5.500,00 SGM  
- Þolinmæðihlutfall: 10,00%

Útreikningur:
- Notað lán: 5.000 + 5.500 = 10.500,00 SGM  
- Eftirstandandi lán: 10.000 − 10.500 = **−500,00 SGM**  
- Þolinmæðiupphæð: 10.000 × 0,10 = 1.000,00 SGM  
- Eftirstandandi m. þolinmæði: −500 + 1.000 = **500,00 SGM**  
- Er farið yfir: **false** (eftirstandandi með þolinmæði > 0)

---

## Customer.SalesHistory.Get

**Tilgangur:** Sækja söluferil eftir vöru fyrir tiltekinn viðskiptavin á tímabili.

**Lýsing:** Sækir söluferilsupplýsingar um hvaða vörur viðskiptavinur hefur keypt, þ.m.t. fjölda pantana og mælieiningar. Byggt á vörufjárhagsfærslum viðskiptavinar á tímabili.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{
  "subject": "10000",
  "data": {
    "fromDate": "2025-01-01",
    "toDate": "2025-12-31"
  }
}
```

| Færibreyta | Tegund | Nauðsynleg | Lýsing |
|---|---|---|---|
| customerNo | Code[20] | Já | Viðskiptavinarnúmer (í subject eða data) |
| fromDate | Date | Já | Upphafsdagsetning (ÁÁÁÁ-MM-DD) |
| toDate | Date | Nei | Lokadagsetning (ÁÁÁÁ-MM-DD). Sjálfgefið: í dag |

**Snið svars:**

```json
{
  "status": "Success",
  "noOfRecords": 5,
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31",
  "salesHistory": [
    {
      "itemNo": "1000",
      "variantCode": "",
      "description": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "baseUOMDescription": "Piece",
      "noOfOrders": 3
    }
  ]
}
```

**Athugasemdir:**

- Söluferill byggist á vörufjárhagsfærslum með Entry Type = Sale
- `noOfOrders` telur fjölda vörufjárhagsfærslna á tímabilinu á hverja vöru
- Niðurstöður raðaðar eftir vörunúmeri í hækkandi röð

---

## Customer.Statement.Pdf

**Tilgangur:** Sækja reikning viðskiptavinar sem PDF-skjal.

**Lýsing:** Sækir reikning viðskiptavinar sem PDF-skjal, með valfrjálsu dagsetningartímabili. Sjálfgefið er síðustu 30 dagar.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

Viðskiptavinarnúmer eða SystemId verður að vera í **subject** reitnum:

```json
{
  "specversion": "1.0",
  "type": "Customer.Statement.Pdf",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-03-20\"}"
}
```

**Snið svars:**

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Kallaðu á `downloadUrl` til að sækja PDF skjalið.

**Athugasemdir:**

- Útfærslan er stýranleg með **Customer Statement Type** í Bifröst Setup
- Sjálfgefin útfærsla notar skýrsluval fyrir C.Statement

---

## Item.Availability.Get

**Tilgangur:** Sækja gæðaupplýsingar vöru þ.m.t. birgðamagn og framboðsstöðu.

**Lýsing:** Sækir gæðaupplýsingar vöru byggt á stilltri útreikningartegund (Raunbirgðir eða Reiknað magn). Styður einnar-vöru og fjölvöru-fyrirspurnir. Skilar upplýsingum í `items` fylki þar sem hver vara inniheldur sitt eigið birgða-/framboðsupplýsingafylki.

**Stefna skilaboða:** Útlæg

**Uppfletting vöru:**

Vöruuppfletting fer eftir eftirfarandi forgangi:

1. **subject** — GUID leysist sem SystemId; texti leysist sem vörunúmer
2. **data.itemNo** — Vörunúmer (hefur forgang yfir subject)
3. **data.itemId** — SystemId vöru (GUID)
4. **data.id** / **data.systemId** / **data.recordSystemId** — SystemId vöru (GUID)
5. **data.tableView** — BC AL töflusíustrengur fyrir fjölvöru-fyrirspurnir
6. Ef ekkert er tilgreint skilar gæðum allra ólokaðra vara

**Möguleiki 1: Ein vara eftir númer (subject)**
```json
{
  "subject": "1000",
  "data": {
    "requested-delivery-date": "2026-03-15",
    "locationFilter": "BLUE|RED"
  }
}
```

**Möguleiki 2: Ein vara eftir JSON gagnafæribreytu**
```json
{
  "data": {
    "itemNo": "1000",
    "locationFilter": "BLUE"
  }
}
```

**Möguleiki 3: Ein vara eftir SystemId**
```json
{
  "data": {
    "itemId": "{12345678-1234-1234-1234-123456789012}",
    "locationFilter": "BLUE"
  }
}
```

**Möguleiki 4: Margar vörur með tableView síu**
```json
{
  "data": {
    "tableView": "WHERE(Item Category Code=CONST(FURNITURE))",
    "locationFilter": "BLUE"
  }
}
```

**Inntaksfæribreytur:**

- **subject** (valfrjálst): Vörunúmer eða SystemId (GUID). Má tilgreina hér eða í gagnafæribreytum.
- **itemNo** (valfrjálst): Vörunúmer í data reit. Hefur forgang yfir subject.
- **itemId** (valfrjálst): SystemId vöru (GUID) í data reit. Notað ef itemNo er ekki gefið.
- **id** / **systemId** / **recordSystemId** (valfrjálst): SystemId vöru (GUID) valkostir.
- **tableView** (valfrjálst): BC AL töflusíustrengur til að velja margar vörur. Notar staðlaða BC setningafræði.
- **requested-delivery-date** (valfrjálst): Dagsetning til að reikna framboð miðað við (ISO 8601 snið).
- **locationFilter** (valfrjálst): Einn eða fleiri staðsetningarkóðar, aðskildir með `|`.

**Snið svars — Raunbirgðir:**

```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "inventory": [
        { "locationCode": "BLUE", "inventory": 50 },
        { "locationCode": "RED", "inventory": 30 }
      ]
    }
  ]
}
```

**Snið svars — Reiknað magn:**

```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "requestedDeliveryDate": "2026-03-15",
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
  ]
}
```

**Snið svars — Margar vörur (Raunbirgðir):**

```json
{
  "status": "Success",
  "items": [
    {
      "itemNo": "1000",
      "itemDescription": "Bicycle",
      "baseUnitOfMeasure": "PCS",
      "inventory": [
        { "locationCode": "BLUE", "inventory": 50 }
      ]
    },
    {
      "itemNo": "1001",
      "itemDescription": "Touring Bicycle",
      "baseUnitOfMeasure": "PCS",
      "inventory": [
        { "locationCode": "BLUE", "inventory": 25 }
      ]
    }
  ]
}
```

**Gæðategundir:**

| Tegund | Lýsing |
|---|---|
| **Raunbirgðir** | Skilar raunverulegt birgðamagn. Einfaldur og fljótlegur. |
| **Reiknað magn** | Skilar reiknað tiltækt magn með tilliti til framboðs og eftirspurnar miðað við `requested-delivery-date`. |

**Villutilvik:**

- `"No items found matching the specified criteria."` — engin vara samræmist tilgreindri síu/auðkenni

**Uppsetning:** Stýrð með **Item Calc. Avail.Type** í Bifröst Setup.

---

## Item.Price.Get

**Tilgangur:** Sækja verðlýsigögn vöru úr verðlistum.

**Lýsing:** Sækir verðupplýsingar vöru úr verðlistum byggt á viðskiptavini, umbeðinni afhendingardagsetningu, magni og afbrigðissíum. Styður einnar-vöru og fjölvöru-fyrirspurnir. Skilar verðlistalínum í `priceListLines` fylki þar sem hver lína inniheldur `itemNo` reit til auðkenningar.

**Stefna skilaboða:** Útlæg

**Uppfletting vöru:**

Sama uppfletting og [Item.Availability.Get](#itemavailabilityget):

1. **subject** — GUID leysist sem SystemId; texti leysist sem vörunúmer
2. **data.itemNo** — Vörunúmer (hefur forgang yfir subject)
3. **data.itemId** — SystemId vöru (GUID)
4. **data.id** / **data.systemId** / **data.recordSystemId** — SystemId vöru (GUID)
5. **data.tableView** — BC AL töflusíustrengur fyrir fjölvöru-fyrirspurnir
6. Ef ekkert er tilgreint skilar verðum allra ólokaðra vara

**Forgangur uppflettingar viðskiptavinar:**

1. **data.customerNo** — Viðskiptavinarnúmer (Code)
2. **data.customerId** — SystemId viðskiptavinar (GUID)
3. **data.customerRecordId** — SystemId viðskiptavinar (GUID)
4. **data.customerSystemId** — SystemId viðskiptavinar (GUID)
5. Ef ekkert er tilgreint skilar aðeins almennu verði

**Inntaksfæribreytur:**

- **subject** (valfrjálst): Vörunúmer eða SystemId (GUID). Má tilgreina hér eða í gagnafæribreytum.
- **itemNo** (valfrjálst): Vörunúmer í data reit. Hefur forgang yfir subject.
- **itemId** (valfrjálst): SystemId vöru (GUID) í data reit.
- **id** / **systemId** / **recordSystemId** (valfrjálst): SystemId vöru (GUID) valkostir.
- **tableView** (valfrjálst): BC AL töflusíustrengur til að velja margar vörur.
- **customerNo** (valfrjálst): Viðskiptavinarnúmer (Code) fyrir sértækt verðlag.
- **customerId** (valfrjálst): SystemId viðskiptavinar (GUID) fyrir sértækt verðlag.
- **customerRecordId** (valfrjálst): SystemId viðskiptavinar (GUID) valkostur.
- **customerSystemId** (valfrjálst): SystemId viðskiptavinar (GUID) valkostur.
- **requestedDeliveryDate** (valfrjálst): Dagsetning til að sía verðlista eftir upphafs-/lokadagsetningu (ISO 8601 snið).
- **quantity** (valfrjálst): Magn til sía eftir lágmarksmagni.
- **variantCode** (valfrjálst): Afbrigðiskóði vöru.

**Staðfesting viðskiptavinar:**

Þegar viðskiptavinur er auðkenndur (`customerNo`, `customerId`, `customerRecordId` eða `customerSystemId`) er viðskiptavinurinn sannreyndur áður en verðútreikningur fer fram. Eftirfarandi verður að vera stillt á viðskiptavininn:

- **VSK-viðskiptabókunarflokkur** — nauðsynlegur fyrir VSK-útreikning
- **Alm. viðskiptabókunarflokkur** — nauðsynlegur fyrir almenna bókun
- **Bókunarflokkur viðskiptavinar** — nauðsynlegur fyrir bókun viðskiptavinar

Ef eitthvað vantar er villusvar skilað (t.d. `"Customer C001 must have a VAT Bus. Posting Group."`).

**Snið svars:**

```json
{
  "status": "Success",
  "priceListLines": [
    {
      "priceListCode": "RETAIL-2026",
      "priceListDescription": "Retail Price List 2026",
      "lineNo": 10000,
      "itemNo": "1000",
      "variantCode": "BLUE",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1.0,
      "minimumQuantity": 10,
      "amountType": "Price",
      "unitPrice": 950.00,
      "unitPriceExclVAT": 950.00,
      "unitPriceInclVAT": 1178.00,
      "lineDiscountPct": 5.0,
      "vatPct": 24.0,
      "itemName": "Bicycle",
      "itemDescription": "Touring Model",
      "baseUnitOfMeasure": "PCS",
      "eanCode": "5701234560013",
      "unspscCode": "87111501",
      "netWeight": 12.5,
      "itemSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "priceType": "Customer",
      "status": "Active",
      "startingDate": "2026-01-01",
      "endingDate": "2026-12-31"
    }
  ]
}
```

**Forgangur verðvals:**

1. **Viðskiptavin-sértækt verð** — ef `customerNo` er gefið
2. **Almennt verð (allir viðskiptavinir)** — ef ekkert sértækt verð finnst
3. **Verð af birgðarspjaldi** — ef engar verðlistalínur finnast, skilar Unit Price og Unit Cost

**Villutilvik:**

- `"No items found matching the specified criteria."` — engin vara samræmist tilgreindri síu/auðkenni
- `"Customer {no} not found."` — ógilt viðskiptavinarnúmer eða SystemId
- `"Customer {no} must have a VAT Bus. Posting Group."` — vantar bókunarflokk
- `"Customer {no} must have a Gen. Bus. Posting Group."` — vantar bókunarflokk
- `"Customer {no} must have a Customer Posting Group."` — vantar bókunarflokk

---

## Sales.Document.Release

**Tilgangur:** Gefa út opna sölupöntun til að gera hana tilbúna til vinnslu og bókunar.

**Lýsing:** Gefur út sölupöntun með því að breyta stöðu hennar úr Opið í Gefin út. Þetta sannprófar pöntunina, læsir hana fyrir breytingum og gerir hana tiltæka til frekari vinnslu.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

```json
{ "subject": "SO-1001" }
```

eða:

```json
{ "data": { "orderNo": "SO-1001" } }
```

**Uppfletting skjals:**

- Texti í **subject** flettir sjálfgefið upp skjalagerð = Order
- Notaðu sérstaka data JSON lykla fyrir aðrar tegundir: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- GUID (SystemId) í **subject** eða data (`systemId`, `id`, `recordSystemId`) finnur skjalið óháð tegund

**Snið svars:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-1001",
  "customerNo": "C001",
  "customerName": "Contoso Ltd.",
  "statusBefore": "Open",
  "statusAfter": "Released",
  "documentDate": "2025-05-15",
  "amount": 1100.00,
  "amountIncludingVAT": 1364.00
}
```

**Villutilvik:**

- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — Ekkert skjalaauðkenni tilgreint
- `"Sales document not found."` — Skjal fannst ekki
- `"Sales Order {No} is already released. Current Status: {Status}"` — Þegar gefin út

---

## Sales.Document.Reopen

**Tilgangur:** Opna aftur söluskjal til að leyfa breytingar.

**Lýsing:** Opnar aftur söluskjal með stöðu Released eða Pending Approval og breytir stöðu þess aftur í Open. Fyrir skjöl í Pending Approval án samþykktarfærslna er staðan stillt beint á Open. Þetta gerir kleift að gera breytingar á skjali sem var áður gefið út eða beið samþykktar.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

```json
{ "subject": "SO-1001" }
```

**Uppfletting skjals:**

- Texti í **subject** flettir sjálfgefið upp skjalagerð = Order
- Notaðu sérstaka data JSON lykla fyrir aðrar tegundir: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- GUID (SystemId) í **subject** eða data (`systemId`, `id`, `recordSystemId`) finnur skjalið óháð tegund

**Snið svars:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-1001",
  "customerNo": "C001",
  "customerName": "Contoso Ltd.",
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2025-05-15",
  "amount": 1100.00,
  "amountIncludingVAT": 1364.00
}
```

---

## Sales.Document.Statistics

**Tilgangur:** Sækja tölfræðilegar upplýsingar sölupöntunar þ.m.t. upphæðir, VSK-heildir, magn, þyngd og rúmmál.

**Lýsing:** Sækir ítarlegar tölfræðilegar upplýsingar sölupöntunar. Þetta er lesaðgerð eingöngu sem veitir sömu upplýsingar og sjást á síðu 402 "Sales Document Statistics" í Business Central.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{ "subject": "SO-1001" }
```

eða með SystemId:

```json
{ "subject": "{12345678-1234-1234-1234-123456789012}" }
```

**Uppfletting skjals:**

- Texti í **subject** flettir sjálfgefið upp skjalagerð = Order
- Notaðu sérstaka data JSON lykla fyrir aðrar tegundir: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- GUID (SystemId) í **subject** eða data (`systemId`, `id`, `recordSystemId`) finnur skjalið óháð tegund

**Snið svars:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-1001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "currencyCode": "",
  "documentDate": "2026-03-07",
  "order": {
    "amount": 5000.00,
    "lineDiscountAmount": 150.00,
    "invoiceDiscountAmount": 250.00,
    "totalExclVAT": 4750.00,
    "vatAmount": 1187.50,
    "totalInclVAT": 5937.50,
    "quantity": 100,
    "totalWeight": 125.50,
    "totalVolume": 2.35,
    "noOfVATLines": 1
  },
  "vat_totals": [
    {
      "vatIdentifier": "STANDARD",
      "vatPct": 25.00,
      "lineAmount": 5000.00,
      "vatBase": 4750.00,
      "vatAmount": 1187.50,
      "amountInclVAT": 5937.50
    }
  ]
}
```

**Pöntunarsvarreitir:**

- **amount**: Heildarlínuupphæð án VSK
- **lineDiscountAmount**: Summa allra línuafsláttar
- **invoiceDiscountAmount**: Heildar reikningsafsláttur
- **totalExclVAT**: Heildarupphæð án VSK (eftir alla afslætti)
- **vatAmount**: Heildar VSK-upphæð
- **totalInclVAT**: Heildarupphæð með VSK
- **quantity**: Heildarmagn allra lína
- **totalWeight**: Heildarþyngd (summa magns × brúttóþyngd)
- **totalVolume**: Heildatrúmmál (summa magns × einingunarrúmmál)
- **noOfVATLines**: Fjöldi mismunandi VSK-hlutfalla

**VSK-heildir fylki:**

Inniheldur eina færslu á hvert VSK-hlutfall:

- **vatIdentifier**: VSK-flokkur
- **vatPct**: VSK-hlutfallið
- **lineAmount**: Heildarlínuupphæð þessa VSK-hlutfalls
- **vatBase**: Upphæð sem VSK er reiknaður á
- **vatAmount**: VSK-upphæð
- **amountInclVAT**: Heildarupphæð með VSK

---

## Sales.Document.Post

**Tilgangur:** Bóka sölupöntun og skila bókuðu reikningsnúmeri.

**Lýsing:** Bókar sölupöntun með BC staðlaðri Sales-Post kóðaeiningu. Pöntunin verður að hafa a.m.k. eina línu. Eftir vel heppnaða bókun er upprunaleg sölupöntun eytt, bókaður sölureikningur stofnaður og svarið inniheldur bæði upprunaleg pöntunarnúmer og nýtt bókað reikningsnúmer.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

```json
{ "subject": "SO-1001" }
```

**Uppfletting skjals:**

- Texti í **subject** flettir sjálfgefið upp skjalagerð = Order
- Notaðu sérstaka data JSON lykla fyrir aðrar tegundir: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- GUID (SystemId) í **subject** eða data (`systemId`, `id`, `recordSystemId`) finnur skjalið óháð tegund

**Snið svars:**

```json
{
  "status": "Success",
  "documentNo": "SO-1001",
  "postedInvoiceNo": "PI-1001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "documentDate": "2026-03-10",
  "postingDate": "2026-03-16",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Villutilvik:**

| Villa | Skilaboð |
|---|---|
| Pöntun finnst ekki | `"Sales Order SO-1001 not found."` |
| Engar línur | `"Sales Order SO-1001 has no lines to post."` |
| Vantar skjalaauðkenni | `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` |

---

## Sales.SalesInvoice.Pdf

**Tilgangur:** Sækja bókaðan sölureikning sem PDF-skjal.

**Lýsing:** Sækir bókaðan sölureikning sem PDF-skjal með stilltri skýrsluval. Hægt er að tilgreina reikningsnúmer eða SystemId.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

```json
{ "subject": "103001" }
```

eða:

```json
{ "data": { "invoiceNo": "103001" } }
```

**Snið svars:**

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

---

## Sales.SalesShipment.Pdf

**Tilgangur:** Sækja bókað almennutslipp sem PDF-skjal.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:** `subject` með shipping-númeri eða SystemId, eða `data.shipmentNo`.

**Snið svars:** Sama og SalesInvoice.Pdf — `downloadUrl` og `contentType: "application/pdf"`.

---

## Sales.SalesCreditMemo.Pdf

**Tilgangur:** Sækja bókað kreditreikningsskjal sem PDF-skjal.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:** `subject` með kreditreikningsnúmeri eða SystemId, eða `data.creditMemoNo`.

**Snið svars:** Sama og SalesInvoice.Pdf — `downloadUrl` og `contentType: "application/pdf"`.

---

## Sales.ReturnReceipt.Pdf

**Tilgangur:** Sækja bókað skilakvittunaskjal sem PDF-skjal.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:** `subject` með skilakvittunarnúmeri eða SystemId.

**Snið svars:** Sama og SalesInvoice.Pdf — `downloadUrl` og `contentType: "application/pdf"`.

---

## Sales.Document.PreviewPost

**Tilgangur:** Líkir eftir bókun söluskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun (transaction er rollback-ð í lokin).

**Lýsing:** Keyrir alla staðlaða BC bókunarrútínu (`Codeunit "Sales-Post (Yes/No)"`) gegnum `Codeunit "Gen. Jnl.-Post Preview"`. Allar færslur sem *yrðu* stofnaðar eru gripnar í tímabundnar töflur og síðan er transaction rollback-að. Engin gögn eru vistuð; upprunalegt söluskjal er óbreytt eftir kallið. Notist til að sannreyna hvort hægt sé að bóka skjal, sýna AI-umboðsmanni nákvæmar fjárhagslegar afleiðingar eða birta fyrirsjáanleg skjalanúmer og heildir fyrir bókun.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Sömu uppflettingarreglur og `Sales.Document.Post`. Stúðningur við Order, Invoice, Credit Memo og Return Order.

**Bifröst færibreytur:**

- **source** (áskilið): Lýsing á forritinu sem kallar.
- **subject** (áskilið/valkvætt): Skjalanúmer söluskjals eða SystemId (GUID). Einnig hagt að senda í `data`.
- **data** (valkvætt): JSON-hlutur með auðkenni skjals. **Fyrsti lykill sem passar vinnur**:
  - `systemId` / `recordSystemId` / `id`: SystemId færslunnar (GUID).
  - `orderNo`: Númer sölupöntunar (Document Type = Order).
  - `invoiceNo`: Númer sölureiknings.
  - `creditMemoNo`: Númer sölukreditreiknings.
  - `returnOrderNo`: Númer söluskilapöntunar.

**Aðferðir til að velja skjal:** Hvaða eitt sem er af eftirfarandi auðkennir skjalið:

1. `subject` sem texti — flettið upp sem `No.` á öllum fjórum skjalategundum.
2. `subject` sem GUID — flettið upp sem `SystemId` á Sales Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId uppfletting.
4. `data.orderNo` / `data.invoiceNo` / `data.creditMemoNo` / `data.returnOrderNo` — `No.` uppfletting takmörkuð við rétta Document Type.

```json
{ "specversion": "1.0", "type": "Sales.Document.PreviewPost", "source": "MyApp", "subject": "SO-001" }
```

**Snið svars:**

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order SO-001 for customer C01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "C01",
  "customerName": "Acme Customer",
  "lcyCode": "ISK",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 145.0,
  "predictedNumbers": { "postedInvoiceNo": "SI-00045", "postedShipmentNo": "SS-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 145000.00, "totalCreditLCY": 145000.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "entryCount": 3, "entries": [ /* full row JSON per entry */ ] },
    { "tableId": 254, "tableName": "VAT Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 5802, "tableName": "Value Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 21, "tableName": "Cust. Ledger Entry", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 145000.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 380, "tableName": "Detailed Cust. Ledg. Entry", "entryCount": 1, "entries": [ ] }
    /* Aðrar færslubókartöflur sem snertast (t.d. Job Ledger Entry, FA Ledger Entry, Bank Account Ledger Entry) birtast hér þegar skjalið hefur áhrif á þær */
  ]
}
```

**Reitir í svari:**

- **status**: `"Success"` eða `"Error"`.
- **rollback**: Alltaf `true` við vel heppnað preview — upprunalegt skjal er óbreytt.
- **summary**: Stutt mannlesanleg lýsing.
- **documentType**: `"Order"`, `"Invoice"`, `"Credit Memo"` eða `"Return Order"`.
- **documentNo**: Númer upprunalegs söluskjals.
- **customerNo / customerName**: Viðskiptavinur skjalsins.
- **lcyCode**: Staðbundinn gjaldmiðill (LCY) úr G/L Setup.
- **documentCurrencyCode**: Tómt þegar skjalið er í LCY.
- **documentExchangeRate**: FCY→LCY gengi. **Alltaf `1` þegar `documentCurrencyCode` er tómt.**
- **predictedNumbers**: Skjalanúmer sem No. Series *myndi* úthluta á þessu augnabliki. Fyrir Order: `postedInvoiceNo` + `postedShipmentNo`; fyrir Invoice: `postedInvoiceNo`; fyrir Credit Memo: `postedCreditMemoNo`; fyrir Return Order: `postedCreditMemoNo` + `postedReturnReceiptNo`. Aðeins til upplýsinga — ekki frátekið.
- **totals.balanced**: `true` þegar LCY debet jafnt og LCY kredit (námundað í 0,01).
- **totals.totalDebit\* / totalCredit\***: Heildir G/L Entry debet/kredit í LCY og FCY.
- **preview[]**: Eitt stak fyrir hverja færslubókartöflu sem BC bókunarrútína fyllir. Töflur eru fundnar kvikt í gegnum `Codeunit "Posting Preview Event Handler".FillDocumentEntry()`. Innbyggður stuðningur er fyrir 17 BC færslubókartöflur og framlengingar geta bætt við töflum í gegnum `OnGetPreviewFieldNames` atburð á `Codeunit "Preview Helper ori"`.
- **preview[].entries[]**: Full JSON-röð fyrir hverja gripna færslu. Reitanöfn nota vélræna umbreytingu (`No.` → `No_`, `Amount (LCY)` → `AmountLCY` o.s.frv.). Reitir sem eru takmarkaðir í `Field Access ori` eru ekki birtir.

**Gjaldmiðilsregla:**

`documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`

Þegar skjalið er í LCY speglar FCY dálkurinn LCY dálkinn og gengið er `1`.

**Fyrirsjáanleg vs raunveruleg númer:** Milli preview og raunverulegrar bókunar getur önnur transaction nýtt fyrirsjáanleg No. Series númer, þannig að raunveruleg bókuð númer geta verið önnur. Notið `predictedNumbers` aðeins til upplýsinga.

**Athugasemdir:**

- Notar BC `Codeunit "Gen. Jnl.-Post Preview"` til að keyra `Codeunit "Sales-Post (Yes/No)"` í preview-ham.
- Sameiginleg `Codeunit "Preview Helper ori"` raðskýrir hverja töflu og veitir `OnGetPreviewFieldNames` og `OnPrecalculateFlowFields` framlengingaratburði.
- Síutöflunr: 36 (Sales Header).
- Stefna skilaboða: Innlæg.

**Villuaðstæður:**

- Söluskjal finnst ekki → `{"status":"Error","error":"..."}`.
- Skjal hefur engar línur → villa með skilaboðum um "no lines".
- Hvers konar bókunarvillu BC → undirliggjandi villutexti er skilað.

**Tengdar skilaboðategundir:**

- [Sales.Document.Post](#salesdocumentpost): Framkvæmir raunverulega bókun (engin rollback).
- [Sales.Document.Statistics](#salesdocumentstatistics): Heildir haus/lína án þess að líkja eftir bókun.

---

## Tengd skjöl

- **[API_Reference.md](/foundation/reference/api/)**: API-endapunktar og auðkenning
- **[Setup_Reference.md](/foundation/reference/setup/)**: Uppsetningarhandbók — útfærsluval
- **[Data_Message_Types.md](/foundation/message-types/data/)**: Gagna-skilaboðategundir
- **[Purchase_Message_Types.md](/foundation/message-types/purchase/)**: Innkaupa-skilaboðategundir


---

## Customer.Application.Post

**Tilgangur:** Jafnar færslu viðskiptavinar (*jöfnunarfærsluna*) á móti einni eða fleiri opnum færslum viðskiptavinar og bókar jöfnunina í gegnum Microsoft codeunit 226 `"CustEntry-Apply Posted Entries"`.

**Lýsing:** Endurspeglar hegðun síðunnar Apply Customer Entries. Reitirnir `"Applies-to ID"` og `"Amount to Apply"` eru settir á jöfnunarfærsluna, hver markfærsla fær sama `Applies-to ID`, og `CustEntry-Apply Posted Entries.Apply` bókar jöfnunina. Allar færslur verða að tilheyra sama viðskiptavini.

**Stefna skilaboða:** Innlæg

**Studdar töflur:** Cust. Ledger Entry (21)

### Snið beiðni

**Bifröst færibreytur:**

| Færibreyta | Krafist | Lýsing |
|---|---|---|
| subject | Já* | SystemId (GUID) eða Entry No. (heiltala) jöfnunarfærslu |
| type | Já | `Customer.Application.Post` |

*Jöfnunarfærsluna má einnig auðkenna með `systemId`, `recordSystemId`, `id`, `entryNo` eða `entryNumber` í beiðnar-JSON.

**Beiðnar-JSON:**

| Reitur | Tegund | Krafist | Lýsing |
|---|---|---|---|
| appliesToEntries | Array | Já | Listi með a.m.k. einni markfærslu. Hvert element getur verið heiltala (Entry No.), GUID-strengur (SystemId), eða hlutur með `entryNo` / `entryNumber` / `systemId` / `recordSystemId` / `id`. |
| postingDate | Dags. | Nei | Bókunardagur jöfnunar. Sjálfgefið er bókunardagur jöfnunarfærslu. |
| documentNo | Code[20] | Nei | Document No. fyrir jöfnun. Sjálfgefið er document no. jöfnunarfærslu. |
| amountToApply | Decimal | Nei | Upphæð sem jafna á úr jöfnunarfærslu. Sjálfgefið er `Remaining Amount`. |

### Svar

Sjá enska útgáfu fyrir nákvæmt JSON-snið og reitalýsingar. Toppreitir: `status`, `applyingEntryNo`, `applyingRecordSystemId`, `customerNo`, `documentNo`, `postingDate`, `amountToApply`, `totalApplied`, `remainingAmount`, `open`, `applications[]`.

### Villuástand

- Auðkenni vantar í subject og beiðni.
- Jöfnunarfærsla fannst ekki.
- Jöfnunarfærsla er ekki opin.
- `appliesToEntries` vantar eða er tómur.
- Markfærsla tilheyrir öðrum viðskiptavini.
- Markfærsla er lokuð.
- Codeunit 226 hafnaði jöfnun (svar er JSON með villuboðum og callstack).

### Tengdar skilaboðategundir

- [Customer.Application.Reverse](#customerapplicationreverse) - Bakar bókaðri jöfnun.
- Customer.CreditLimit.Get - Lánstraustaupplýsingar viðskiptavinar.

---

## Customer.Application.Reverse

**Tilgangur:** Bakar (aftengir) bókaða jöfnun á færslu viðskiptavinar í gegnum Microsoft codeunit 226 `"CustEntry-Apply Posted Entries.PostUnApplyCustomer"`.

**Lýsing:** Sjálfgefið er nýjasta jöfnun bókuð. Tiltekna jöfnun má auðkenna með `detailedEntryNo`. Codeunit 226 framfylgir afbókunarreglum (t.d. engar síðari færslur sem byggja á þessari jöfnun).

**Stefna skilaboða:** Innlæg

**Studdar töflur:** Cust. Ledger Entry (21)

### Snið beiðni

**Bifröst færibreytur:**

| Færibreyta | Krafist | Lýsing |
|---|---|---|
| subject | Já* | SystemId (GUID) eða Entry No. (heiltala) færslu viðskiptavinar |
| type | Já | `Customer.Application.Reverse` |

*Færsluna má einnig auðkenna með `systemId`, `recordSystemId`, `id`, `entryNo` eða `entryNumber` í beiðnar-JSON.

**Beiðnar-JSON:**

| Reitur | Tegund | Krafist | Lýsing |
|---|---|---|---|
| detailedEntryNo | Integer | Nei | Detailed Cust. Ledg. Entry No. fyrir jöfnun sem á að baka. Sjálfgefið síðasta jöfnun. |
| postingDate | Dags. | Nei | Bókunardagur bókunarinnar. Sjálfgefið er bókunardagur jöfnunarinnar. |
| documentNo | Code[20] | Nei | Document No. fyrir bókun. Sjálfgefið document no. jöfnunarinnar. |

### Svar

Toppreitir: `status`, `entryNo`, `recordSystemId`, `customerNo`, `reversedDetailedEntryNo`, `reversedAmount`, `postingDate`, `documentNo`, `remainingAmount`, `open`.

### Villuástand

- Auðkenni vantar.
- Færsla fannst ekki.
- Engin bókuð jöfnun til að baka.
- `detailedEntryNo` er ekki til eða ekki Application færsla.
- Codeunit 226 hafnaði afbókun.

### Tengdar skilaboðategundir

- [Customer.Application.Post](#customerapplicationpost) - Jafnar færslur viðskiptavinar.

---

## Sales.Quote.MakeOrder

**Tilgangur:** Breytir sölutilboði (Sales Quote) í sölupöntun (Sales Order).

**Stefna:** Innlæg (aðgerðarbeiðni)

**Síutafla:** Sales Header (36)

**Lýsing:** Kallar á staðlað BC `Codeunit "Sales-Quote to Order"` (codeunit 86) til að breyta sölutilboði í sölupöntun. Upprunalega tilboðinu er eytt og ný sölupöntun stofnuð með sama viðskiptavin, línur og víddir. Skilar nýja pöntunarnúmerinu ásamt lykilreitum hauss.

### Beiðnasniðmát

| Færibreyta | Krafa | Lýsing |
|---|---|---|
| source | Já | Auðkenni kallandi forrits |
| subject | Já | Tilboðsnúmer eða SystemId (GUID) Sales Header |

### Auðkennisröð fyrir subject

Gildi subject er flett upp gegnum `FindSalesHeader`:
1. Ef subject er gilt GUID → `GetBySystemId`
2. Annars → `Get` eftir skjalanúmeri yfir allar sölu-skjalategundir

Skjalið sem fannst **verður** að hafa `Document Type = Quote`, annars skilar villu.

### Dæmi um beiðni

```json
{
  "specversion": "1.0",
  "type": "Sales.Quote.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "SQ-001"
}
```

### Svarsniðmát (Success)

```json
{
  "status": "Success",
  "quoteNo": "SQ-001",
  "orderNo": "SO-005",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Svarsreitir

| Reitur | Gerð | Lýsing |
|---|---|---|
| status | Text | `Success` við velheppnun, `Error` við villu |
| quoteNo | Code[20] | Númer upprunalega tilboðsins |
| orderNo | Code[20] | Númer nýju sölupöntunarinnar |
| orderSystemId | Guid | SystemId (GUID) nýja söluhaussins |
| customerNo | Code[20] | Númer Sell-to viðskiptavinar |
| customerName | Text | Heiti Sell-to viðskiptavinar |
| documentDate | Date | ISO dags (yyyy-MM-dd) — skjaldagsetning nýrrar pöntunar |
| orderDate | Date | ISO dags (yyyy-MM-dd) — pöntunardagur nýrrar pöntunar |

### Villusvör

| Villa | Orsök |
|---|---|
| `Subject parameter is required.` | Subject var tómt |
| `Sales header {No} not found.` | Enginn söluhaus passar við subject |
| `Sales document {No} is not a Quote (actual type: {Type}).` | Subject vísaði á annað skjal en Quote |
| Villutexti frá BC | Staðlaða `Sales-Quote to Order` codeunit kastaði villu (kallabók fylgir sem `callstack` reitur) |

### Tengdar skilaboðategundir

- [Sales.Document.Create](/foundation/reference/message-types/sales-document-create/): Stofna tilboð frá grunni
- [Sales.Document.Release](#salesdocumentrelease): Gefa út pöntunina sem verður til
- [Sales.Document.Post](#salesdocumentpost): Bóka pöntunina sem verður til

---

## Sales.BlanketOrder.MakeOrder

**Tilgangur:** Breytir rammapöntun (Sales Blanket Order) í sölupöntun.

**Stefna:** Innlæg (aðgerðarbeiðni)

**Síutafla:** Sales Header (36)

**Lýsing:** Kallar á staðlað BC `Codeunit "Blanket Sales Order to Order"` (codeunit 87) til að stofna nýja sölupöntun út frá rammapöntun. Línur með `Qty. to Ship > 0` færast yfir á nýju pöntunina; rammapöntunin lifir áfram og útistandandi magn lækkar samkvæmt því.

### Beiðnasniðmát

| Færibreyta | Krafa | Lýsing |
|---|---|---|
| source | Já | Auðkenni kallandi forrits |
| subject | Já | Rammapöntunarnúmer eða SystemId (GUID) Sales Header |

### Auðkennisröð fyrir subject

1. Ef subject er gilt GUID → `GetBySystemId`
2. Annars → `Get` eftir skjalanúmeri yfir allar sölu-skjalategundir

Skjalið sem fannst **verður** að hafa `Document Type = Blanket Order`, annars skilar villu.

### Forsendur

Hver lína rammapöntunar sem á að færast yfir verður að hafa `Qty. to Ship > 0` (notið Data.Records.Set áður til að stilla gildin). Línur með núll `Qty. to Ship` eru ekki færðar.

### Dæmi um beiðni

```json
{
  "specversion": "1.0",
  "type": "Sales.BlanketOrder.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "SB-001"
}
```

### Svarsniðmát (Success)

```json
{
  "status": "Success",
  "blanketOrderNo": "SB-001",
  "orderNo": "SO-006",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Svarsreitir

| Reitur | Gerð | Lýsing |
|---|---|---|
| status | Text | `Success` við velheppnun, `Error` við villu |
| blanketOrderNo | Code[20] | Númer upprunalegu rammapöntunarinnar |
| orderNo | Code[20] | Númer nýju sölupöntunarinnar |
| orderSystemId | Guid | SystemId (GUID) nýja söluhaussins |
| customerNo | Code[20] | Númer Sell-to viðskiptavinar |
| customerName | Text | Heiti Sell-to viðskiptavinar |
| documentDate | Date | ISO dags (yyyy-MM-dd) — skjaldagsetning nýrrar pöntunar |
| orderDate | Date | ISO dags (yyyy-MM-dd) — pöntunardagur nýrrar pöntunar |

### Villusvör

| Villa | Orsök |
|---|---|
| `Subject parameter is required.` | Subject var tómt |
| `Sales header {No} not found.` | Enginn söluhaus passar við subject |
| `Sales document {No} is not a Blanket Order (actual type: {Type}).` | Subject vísaði á annað skjal en Blanket Order |
| Villutexti frá BC | Staðlaða `Blanket Sales Order to Order` codeunit kastaði villu (t.d. engar línur með `Qty. to Ship > 0`); kallabók fylgir sem `callstack` reitur |

### Tengdar skilaboðategundir

- [Sales.Document.Create](/foundation/reference/message-types/sales-document-create/): Stofna rammapöntun frá grunni
- [Sales.Document.Release](#salesdocumentrelease): Gefa út pöntunina sem verður til
- [Sales.Quote.MakeOrder](#salesquotemakeorder): Systuraðgerð fyrir sölutilboð

---

## Sales.SalesInvoice.Correct

**Tilgangur:** Bakfærir bókaðan sölureikning og býr til nýjan drög að sölureikningi til leiðréttingar.

**Lýsing:** Vefur BC codeunit 1303 `Correct Posted Sales Invoice` aðferðina `CancelPostedInvoiceCreateNewInvoice`. Bókar jöfnunarkreditreikning á móti upprunalegum reikningi og býr til nýjan drög að `Sales Header` (Document Type = Invoice) með gildi frá upprunalega reikningnum.

**Stefna skilaboða:** Innlæg (Inbound)

**Bókunarstýring:** `G/L`. Beiðninni er hafnað ef G/L bókun er ekki virk í Bifröst uppsetningu.

**Röð auðkennisleitar:** GUID í gegnum Subject (SystemId) → Subject sem `No.` (Get) → JSON-lyklar (`systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`).

**Inntaksbreytur:**

```json
{
  "type": "Sales.SalesInvoice.Correct",
  "subject": "POST-INV-000123"
}
```

**Svarsnið:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "POST-INV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "cancellingCreditMemo": { "no": "PCM-000456", "id": "1a2b3c4d-..." },
  "newDraftInvoice": { "no": "SI-000789", "id": "9f8e7d6c-...", "documentType": "Invoice" }
}
```

**Villuaðstæður:**
- Vantar auðkenni → `Error` með `Message subject or request data must contain a record identifier`.
- Reikningur fannst ekki → `Error`.
- Ekki hægt að leiðrétta reikning (þegar bakfærður, greiðslur jafnaðar, tímabil lokað o.s.frv.) → `Error` með villutexta frá BC og `callstack` reit.

**Ferli:**
1. Auðkenni er leyst úr `subject` eða úr request JSON.
2. `G/L` bókunarstýring er staðfest.
3. BC `CancelPostedInvoiceCreateNewInvoice` keyrt í einangruðu `Codeunit.Run`; villur skila sér sem JSON með callstack.
4. BC bókar jöfnunarkreditreikning, parar hann að fullu við upprunalega reikninginn, og býr til nýjan drög að `Sales Header` (Document Type = Invoice) afritaðan úr upprunalega reikningnum.
5. Jöfnunarkreditreikningurinn er sóttur í gegnum `Cancelled Document` (Source ID = 112, Cancelled Doc. No. = upprunalegur reikningur).
6. Upprunalegi reikningurinn, jöfnunarkreditreikningur og nýju drögin eru skilað í einu JSON svari.

**Skjöl sem verða til:**

| Hlutverk | BC tafla | Auðkenni í svari |
|---|---|---|
| Upprunalegi reikningurinn (nú merktur Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Jöfnunarkreditreikningur (bókaður, að fullu paraður) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `.no` |
| Nýr breytanlegur drög að reikningi | `Sales Header` (Document Type = Invoice) | `newDraftInvoice.id` / `.no` |

**Tengingar milli skjala:**
- Upprunalegi reikningurinn: `Cancelled = true`, `Canceled By Cr. Memo No.` = númer kreditreiknings.
- Kreditreikningur: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = upprunalegi reikningurinn.
- `Cancelled Document` röð: `Source ID` = 112, `Cancelled Doc. No.` = upprunalegur, `Cancelled By Doc. No.` = kreditreikningur.
- Nýju drögin hafa ekkert reitatengsl við upprunalega; tengingin er aðeins í gegnum þetta svar.

**Sækja skjölin með Data.Records.Get:**

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Header", "tableView": "WHERE(SystemId=CONST(<newDraftInvoice.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Cr.Memo Header", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Line", "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(<newDraftInvoice.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Cr.Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(112),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Tengdar tegundir skilaboða:**
- [Sales.SalesInvoice.Cancel](#salessalesinvoicecancel) - Bakfærir án nýrra draga.
- [Sales.Document.Post](#salesdocumentpost) - Bóka nýja drög að reikningi.

---

## Sales.SalesInvoice.Cancel

**Tilgangur:** Bakfærir bókaðan sölureikning með því að bóka jöfnunarkreditreikning.

**Lýsing:** Vefur BC codeunit 1303 `Correct Posted Sales Invoice` aðferðina `CancelPostedInvoice`. Bókar jöfnunarkreditreikning á móti upprunalegum reikningi. Ólíkt `Correct` er enginn nýr drög að reikningi búinn til.

**Stefna skilaboða:** Innlæg (Inbound)

**Bókunarstýring:** `G/L`.

**Röð auðkennisleitar:** Sama og `Sales.SalesInvoice.Correct`.

**Inntaksbreytur:**

```json
{
  "type": "Sales.SalesInvoice.Cancel",
  "subject": "POST-INV-000123"
}
```

**Svarsnið:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "POST-INV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "cancellingCreditMemo": { "no": "PCM-000456", "id": "1a2b3c4d-..." }
}
```

`newDraftInvoice` hluturinn er viljandi sleppt.

**Ferli:**
1. Auðkenni er leyst úr `subject` eða úr request JSON.
2. `G/L` bókunarstýring er staðfest.
3. BC `CancelPostedInvoice` keyrt í einangruðu `Codeunit.Run`; villur skila sér sem JSON með callstack.
4. BC bókar jöfnunarkreditreikning og parar hann að fullu við upprunalega reikninginn. Engin drög eru búin til.
5. Jöfnunarkreditreikningurinn er sóttur í gegnum `Cancelled Document` (Source ID = 112, Cancelled Doc. No. = upprunalegur reikningur).
6. Upprunalegi reikningurinn og jöfnunarkreditreikningurinn skilað í einu JSON svari.

**Skjöl sem verða til:**

| Hlutverk | BC tafla | Auðkenni í svari |
|---|---|---|
| Upprunalegi reikningurinn (nú merktur Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Jöfnunarkreditreikningur (bókaður, að fullu paraður) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `.no` |

**Tengingar milli skjala:**
- Upprunalegi reikningurinn: `Cancelled = true`, `Canceled By Cr. Memo No.` = númer kreditreiknings.
- Kreditreikningur: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = upprunalegi reikningurinn.
- `Cancelled Document` röð: `Source ID` = 112, `Cancelled Doc. No.` = upprunalegur, `Cancelled By Doc. No.` = kreditreikningur.

**Sækja skjölin með Data.Records.Get:**

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Cr.Memo Header", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Cr.Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Sales Invoice Header", "tableView": "WHERE(No.=CONST(<originalInvoiceNo>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(112),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Villuaðstæður:** Sama og `Sales.SalesInvoice.Correct`.

**Tengdar tegundir skilaboða:**
- [Sales.SalesInvoice.Correct](#salessalesinvoicecorrect) - Bakfærir og býr til nýja drög til leiðréttingar.

---

## Sales.SalesInvoice.Send

**Tilgangur:** Sendir bókaðan sölureikning gegnum staðlaðan BC sendingarferil með Document Sending Profile sem leyst er fram.

**Lýsing:** Vefur utan um BC staðlaða aðferð `Sales Invoice Header.SendProfile(var "Document Sending Profile")`. Sendingarsniðið er ákveðið með þriggja þrepa keðju (beiðni-yfirskrift → snið viðskiptavinar → sjálfgefið kerfissnið). Sendingaraðgerðin sjálf nýtir staðlaðan BC dispatcher og virðir alla valkosti (Tölvupóstur, Diskur, Prentari, Rafrænt skjal) sem stilltir eru á sniðið.

**Stefna:** Innlæg.

**Bókunarhlið:** Engin. Sending skjals býr ekki til bókhaldsfærslur.

**Röð uppflettingar á sniði:**

1. **Beiðni-yfirskrift** — ef beiðnin inniheldur `documentSendingProfile` kóða er hann sóttur og notaður. Ef kóðinn er ekki til skilar beiðnin villu: `Document Sending Profile {kóði} not found.`. Svarsvæði `documentSendingProfileSource` = `Request`.
2. **Snið viðskiptavinar** — ef `Document Sending Profile` svæði viðskiptavinarins er sett er það sótt og notað. Ef viðskiptavinurinn vísar í kóða sem er ekki lengur til skilar beiðnin villu: `Customer {nr} references Document Sending Profile {kóði} which no longer exists.`. Svarsvæði `documentSendingProfileSource` = `Customer`.
3. **Sjálfgefið kerfissnið** — fyrsta `Document Sending Profile` með `Default = true` er notað. Svarsvæði `documentSendingProfileSource` = `Default`.
4. **Engin samsvörun** — ef ekkert af ofangreindu leysist skilar beiðnin villu: `No Document Sending Profile resolved for customer {nr} and no system default exists.`.

**Röð uppflettingar á skjali:**

1. `data.invoiceNo`
2. `data.invoiceId` (SystemId)
3. `subject` (annaðhvort reikningsnúmer eða SystemId GUID; GUID greint sjálfkrafa)

**Inntaksbreytur:**

```json
{
  "type": "Sales.SalesInvoice.Send",
  "subject": "POST-INV-000123",
  "data": {
    "documentSendingProfile": "EMAIL"
  }
}
```

| Breyta | Tegund | Skylda | Athugasemdir |
|---|---|---|---|
| `subject` | Text | Eitt af subject / `invoiceNo` / `invoiceId` krafist | Reikningsnúmer eða SystemId GUID |
| `data.invoiceNo` | Code[20] | Valkvætt | Hefur forgang yfir `subject` og `invoiceId` |
| `data.invoiceId` | GUID | Valkvætt | Notað ef `invoiceNo` er ekki sent |
| `data.documentSendingProfile` | Code[20] | Valkvætt | Yfirskrifar viðskiptavinar- og sjálfgefið-keðjuna |

**Svar við árangri:**

```json
{
  "status": "Success",
  "documentType": "PostedSalesInvoice",
  "documentNo": "POST-INV-000123",
  "documentId": "5f0d3b6e-1234-5678-90ab-cdef12345678",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "documentSendingProfileCode": "EMAIL",
  "documentSendingProfileSource": "Request",
  "message": "Document sent successfully."
}
```

**Svar við villu:**

```json
{
  "status": "Error",
  "error": "Document Sending Profile NOSUCH not found.",
  "callstack": "..."
}
```

**Svarsvæði:**

| Svæði | Tegund | Lýsing |
|---|---|---|
| `status` | Text | `Success` eða `Error` |
| `documentType` | Text | Alltaf `PostedSalesInvoice` fyrir þessa skilaboðategund |
| `documentNo` | Code[20] | Númer bókaðs reiknings |
| `documentId` | GUID | SystemId bókaðs reiknings |
| `customerNo` | Code[20] | Númer viðskiptavinar (Sell-to) |
| `customerName` | Text | Nafn viðskiptavinar |
| `documentSendingProfileCode` | Code[20] | Sniðið sem var notað við sendingu |
| `documentSendingProfileSource` | Text | `Request`, `Customer` eða `Default` — hvert þrep keðjunnar passaði |
| `message` | Text | Skýrandi texti fyrir notendur |
| `error` | Text | Aðeins við `Error` — undirliggjandi villuskilaboð |
| `callstack` | Text | Aðeins við `Error` — fullur BC callstack til greiningar |

**Villuaðstæður:**

| Villa | Orsök |
|---|---|
| `Subject parameter is required. Provide the invoice number or SystemId.` | Ekkert auðkenni í `subject`, `invoiceNo` eða `invoiceId` |
| `Sales Invoice {nr} not found.` | Auðkenni gefið en engin samsvarandi `Sales Invoice Header` röð |
| `Document Sending Profile {kóði} not found.` | Yfirskriftarkóði í beiðni er ekki til |
| `Customer {nr} references Document Sending Profile {kóði} which no longer exists.` | Snið viðskiptavinar vísar í kóða sem er ekki til |
| `No Document Sending Profile resolved for customer {nr} and no system default exists.` | Engin yfirskrift, engin sniðsetning á viðskiptavin, ekkert sjálfgefið snið |
| (BC SendProfile villur) | Skilað óbreyttum gegnum `error` + `callstack` (t.d. tölvupóstreikning vantar, rafrænt skjalasvæði ekki sett upp) |

**Athugasemdir:**

- Sendiverkið sjálft er framkvæmt af `SendProfile` BC sem er keyrt í einangraðri `Codeunit.Run`. Allar BC villur eru skilaðar sem JSON án þess að bakka ytri skilaboðafærslu.
- Svarið inniheldur alltaf `documentSendingProfileSource` svo kallarar geti rakið hvaða leið var farin.
- Sending breytir ekki bókaða reikningnum í BC.

**Tengdar tegundir skilaboða:**
- [Sales.SalesCreditMemo.Send](#salessalescreditmemosend) — sama mynstur fyrir bókaða kreditreikninga.
- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf) — sækja reikning sem PDF í stað þess að senda hann gegnum sendingarferilinn.

---

## Sales.SalesCreditMemo.Send

**Tilgangur:** Sendir bókaðan sölu-kreditreikning gegnum staðlaðan BC sendingarferil með Document Sending Profile sem leyst er fram.

**Lýsing:** Vefur utan um BC staðlaða aðferð `Sales Cr.Memo Header.SendProfile(var "Document Sending Profile")`. Uppfletting á sniði er sú sama og í `Sales.SalesInvoice.Send`.

**Stefna:** Innlæg.

**Bókunarhlið:** Engin.

**Röð uppflettingar á sniði:** Sú sama og í [Sales.SalesInvoice.Send](#salessalesinvoicesend).

**Röð uppflettingar á skjali:**

1. `data.creditMemoNo`
2. `data.creditMemoId` (SystemId)
3. `subject`

**Inntaksbreytur:**

```json
{
  "type": "Sales.SalesCreditMemo.Send",
  "subject": "POST-CRM-000456",
  "data": {
    "documentSendingProfile": "EMAIL"
  }
}
```

| Breyta | Tegund | Skylda | Athugasemdir |
|---|---|---|---|
| `subject` | Text | Eitt af subject / `creditMemoNo` / `creditMemoId` krafist | Kreditreikningsnúmer eða SystemId GUID |
| `data.creditMemoNo` | Code[20] | Valkvætt | Hefur forgang yfir `subject` og `creditMemoId` |
| `data.creditMemoId` | GUID | Valkvætt | Notað ef `creditMemoNo` er ekki sent |
| `data.documentSendingProfile` | Code[20] | Valkvætt | Yfirskrifar viðskiptavinar- og sjálfgefið-keðjuna |

**Svar við árangri:**

```json
{
  "status": "Success",
  "documentType": "PostedSalesCreditMemo",
  "documentNo": "POST-CRM-000456",
  "documentId": "1a2b3c4d-5678-90ab-cdef-1234567890ab",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "documentSendingProfileCode": "EMAIL",
  "documentSendingProfileSource": "Customer",
  "message": "Document sent successfully."
}
```

**Svar við villu:**

```json
{
  "status": "Error",
  "error": "Sales Credit Memo POST-CRM-999999 not found.",
  "callstack": "..."
}
```

**Svarsvæði:** Sú sama og `Sales.SalesInvoice.Send` nema `documentType` = `PostedSalesCreditMemo`.

**Villuaðstæður:** Sú sama og `Sales.SalesInvoice.Send` nema villan við ófundið skjal er `Sales Credit Memo {nr} not found.`.

**Tengdar tegundir skilaboða:**
- [Sales.SalesInvoice.Send](#salessalesinvoicesend) — sama mynstur fyrir bókaða reikninga.
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf) — sækja kreditreikning sem PDF í stað þess að senda hann gegnum sendingarferilinn.
