---
id: purchase
title: "Purchase message types"
sidebar_position: 4
---

**Yfirlitsskjal:** [API_Reference.md](/foundation/reference/api/)  
**Útfærslumappa:** `app/src/Message Type/Implementations/Purchases/`

---

## Yfirlit

Þetta skjal lýsir skilaboðategundum innkaupapantana í Bifröst API. Þessar skilaboðategundir bjóða upp á líftímasstjórnun innkaupapantana, speglandi sömu aðgerðir og í boði eru fyrir sölupantanir.

| Skilaboðategund | Stefna | Tilgangur | Tengd tafla/töflur |
|---|---|---|---|
| Purchase.Document.Release | Innlæg | Gefa út opna innkaupapöntun til að gera hana tilbúna fyrir móttöku og reikningsfærslu | Purchase Header (38) |
| Purchase.Document.Reopen | Innlæg | Opna aftur innkaupaskjal (Released eða Pending Approval) til að leyfa breytingar | Purchase Header (38) |
| Purchase.Document.Statistics | Útlæg | Sækja tölfræði innkaupapöntunar þ.m.t. upphæðir, VSK-heildir, magn, þyngd og rúmmál | Purchase Header (38) |
| Purchase.Document.Post | Innlæg | Bóka innkaupapöntun og skila númer bókaðs reiknings | Purchase Header (38), Purch. Inv. Header (122) |
| Purchase.Document.PreviewPost | Innlæg | Líkir eftir bókun innkaupaskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun | Purchase Header (38) + allar færslubókartöflur sem BC bókunarrútína fyllir (kvik; innbyggður stuðningur fyrir m.a. G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Vendor / Detailed Vendor Ledger, Cust. / Detailed Cust. Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger) |
| Vendor.Application.Post | Innlæg | Jafnar færslu lánardrottins á móti einni eða fleiri opnum færslum lánardrottins (codeunit 227) | Vendor Ledger Entry (25) |
| Vendor.Application.Reverse | Innlæg | Bakar (aftengir) bókaða jöfnun á færslu lánardrottins (codeunit 227) | Vendor Ledger Entry (25) |
| Purchase.Quote.MakeOrder | Innlæg | Breytir innkaupatilboði í innkaupapöntun með BC codeunit 96 "Purch.-Quote to Order" | Purchase Header (38) |
| Purchase.BlanketOrder.MakeOrder | Innlæg | Breytir innkaupa-rammapöntun (Blanket Order) í innkaupapöntun með BC codeunit 97 "Blanket Purch. Order to Order" | Purchase Header (38) |
| Purchase.PurchaseInvoice.Correct | Innlæg | Bakfærir bókaðan innkaupareikning og býr til nýjan drög að innkaupareikningi til leiðréttingar (BC codeunit 1313) | Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124), Purchase Header (38) |
| Purchase.PurchaseInvoice.Cancel | Innlæg | Bakfærir bókaðan innkaupareikning með því að bóka jöfnunarkreditreikning (BC codeunit 1313) | Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124) |

---

## Purchase.Document.Release

**Tilgangur:** Gefa út opna innkaupapöntun og breyta stöðu hennar úr Open í Released.

**Lýsing:** Gefur út innkaupapöntun með því að nota staðlaða BC Release Purchase Document kóðaeiningu. Útgefin innkaupapöntun er tilbúin til móttöku og reikningsfærslu.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Hægt er að tilgreina númer innkaupapöntunar í **subject**-reitnum, sem SystemId (GUID) í **subject**-reitnum, eða í **data**-reitnum:

```json
{ "subject": "PO-001" }
```

Eða:

```json
{ "data": { "orderNo": "PO-001" } }
```

Eða með SystemId:

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
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Open",
  "statusAfter": "Released",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Reitir í svari:**

- **status**: Vinnslustöðu ("Success" eða "Error")
- **documentType**: Tegund innkaupaskjals (alltaf "Order")
- **documentNo**: Númer innkaupapöntunar
- **vendorNo**: Númer lánardrottins sem keypt er af
- **vendorName**: Heiti lánardrottins sem keypt er af
- **statusBefore**: Skjalstaða fyrir útgáfu (alltaf "Open")
- **statusAfter**: Skjalstaða eftir útgáfu (alltaf "Released" við velgengni)
- **documentDate**: Pöntunardagur
- **amount**: Heildarupphæð án VSK
- **amountIncludingVAT**: Heildarupphæð með VSK

**Athugasemdir:**

- Notar staðlaða BC-kóðaeiningu `"Release Purchase Document"`
- Síutöflunr: 38 (Purchase Header)
- Stefna skilaboða: Innlæg

**Dæmi um beiðni:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Release",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Villutilvik:**

- `"Purchase Order PO-001 not found."` — pöntunarnúmer eða SystemId er ekki til
- `"Purchase Order PO-001 is already released."` — pöntun er þegar í Released stöðu
- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — ekkert auðkenni gefið

**Tengdar skilaboðategundir:**

- [Purchase.Document.Reopen](#purchasedocumentreopen): Opna útgefna pöntun til að gera breytingar
- [Purchase.Document.Statistics](#purchasedocumentstatistics): Skoða heildir pöntunar
- [Purchase.Document.Post](#purchasedocumentpost): Bóka útgefna pöntun

---

## Purchase.Document.Reopen

**Tilgangur:** Opna aftur innkaupaskjal og breyta stöðu þess úr Released eða Pending Approval til baka í Open.

**Lýsing:** Enduropnar innkaupaskjal með staðlaðri BC `"Purch. Manual Reopen"` kóðaeiningu fyrir útgefin skjöl, eða stillir stöðu beint á Open fyrir skjöl í Pending Approval ef engar samþykktarfærslur eru til staðar. Þetta leyfir breytingar áður en aftur er gefið út og bókað.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Hægt er að tilgreina númer innkaupapöntunar í **subject**-reitnum, sem SystemId (GUID), eða í **data**-reitnum:

```json
{ "subject": "PO-001" }
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
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "statusBefore": "Released",
  "statusAfter": "Open",
  "documentDate": "2026-03-07",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Reitir í svari:**

- **status**: Vinnslustöðu ("Success" eða "Error")
- **documentType**: Tegund innkaupaskjals (alltaf "Order")
- **documentNo**: Númer innkaupapöntunar
- **vendorNo**: Númer lánardrottins sem keypt er af
- **vendorName**: Heiti lánardrottins sem keypt er af
- **statusBefore**: Skjalstaða fyrir enduropnun (t.d. "Released" eða "Pending Approval")
- **statusAfter**: Skjalstaða eftir enduropnun ("Open" við velgengni)
- **documentDate**: Pöntunardagur
- **amount**: Heildarupphæð án VSK
- **amountIncludingVAT**: Heildarupphæð með VSK

**Athugasemdir:**

- Notar staðlaða BC-kóðaeiningu `"Purch. Manual Reopen"` fyrir útgefin skjöl
- Fyrir skjöl í Pending Approval án samþykktarfærslna, stillir stöðu beint á Open
- Síutöflunr: 38 (Purchase Header)
- Stefna skilaboða: Innlæg

**Dæmi um beiðni:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Reopen",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Villutilvik:**

- `"Purchase Order PO-001 not found."` — pöntunarnúmer eða SystemId er ekki til
- `"Purchase Order PO-001 is already open."` — pöntun er þegar í Open stöðu
- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` — ekkert auðkenni gefið

**Tengdar skilaboðategundir:**

- [Purchase.Document.Release](#purchasedocumentrelease): Gefa aftur út eftir breytingar
- [Purchase.Document.Post](#purchasedocumentpost): Bóka pöntunina

---

## Purchase.Document.Statistics

**Tilgangur:** Sækja ítarlegar tölfræðiupplýsingar innkaupapöntunar þ.m.t. upphæðir, VSK-heildir, magn, þyngd og rúmmál.

**Lýsing:** Skilar sömu upplýsingum og sjást á síðunni Tölfræði innkaupapöntunar í Business Central, reiknuðum í rauntíma út frá núverandi stöðu pöntunarinnar.

**Stefna skilaboða:** Útlæg

**Inntaksfæribreytur:**

Hægt er að tilgreina númer innkaupapöntunar í **subject**-reitnum, sem SystemId (GUID), eða í **data**-reitnum:

```json
{ "subject": "PO-001" }
```

Eða:

```json
{
  "data": { "orderNo": "PO-001" }
}
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
  "documentNo": "PO-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
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
      "lineAmount": 4750.00,
      "vatBase": 4750.00,
      "vatAmount": 1187.50,
      "amountInclVAT": 5937.50
    }
  ]
}
```

**Reitir í svari:**

Efsta stig:
- **status**: Vinnslustöðu ("Success" eða "Error")
- **documentType**: Tegund innkaupaskjals (alltaf "Order")
- **documentNo**: Númer innkaupapöntunar
- **vendorNo**: Númer lánardrottins sem keypt er af
- **vendorName**: Heiti lánardrottins sem keypt er af
- **currencyCode**: Gjaldmiðilskóði (autt = SGM)
- **documentDate**: Pöntunardagur

`order` hópur:
- **amount**: Heildar línuupphæð án VSK (frá Purchase Header)
- **lineDiscountAmount**: Summa allra línuafsláttar
- **invoiceDiscountAmount**: Heildar reikningsafsláttarupphæð
- **totalExclVAT**: Heildarupphæð án VSK (eftir alla afslætti)
- **vatAmount**: Heildar VSK-upphæð
- **totalInclVAT**: Heildarupphæð með VSK
- **quantity**: Heildarmagn allra lína
- **totalWeight**: Heildar brúttóþyngd (magn × brúttóþyngd á vöru)
- **totalVolume**: Heildar rúmmál (magn × einingavolume á vöru)
- **noOfVATLines**: Fjöldi mismunandi VSK-hlutfalla í pöntuninni

`vat_totals` fylki (ein færsla á VSK-hlutfall):
- **vatIdentifier**: VSK-auðkennishópskóði
- **vatPct**: VSK-hlutfallið
- **lineAmount**: Heildar línuupphæð fyrir þetta VSK-hlutfall
- **vatBase**: Upphæð sem þessu VSK-hlutfalli er beitt á (án VSK)
- **vatAmount**: VSK-upphæð fyrir þetta hlutfall
- **amountInclVAT**: Heildarupphæð með VSK fyrir þetta hlutfall

**Athugasemdir:**

- Allar upphæðir eru sléttaðar með gjaldmiðilsnákvæmni pöntunarinnar
- Tölfræði er reiknuð í rauntíma út frá núverandi pöntunarsþætti
- VSK-útreikningar nota `PurchaseLine.CalcVATAmountLines(QtyType::General, ...)`
- Síutöflunr: 38 (Purchase Header)
- Stefna skilaboða: Útlæg

**Dæmisbeiðnir:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Statistics",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Tengdar skilaboðategundir:**

- [Purchase.Document.Release](#purchasedocumentrelease): Gefa út pöntunina
- [Purchase.Document.Post](#purchasedocumentpost): Bóka pöntunina

---

## Purchase.Document.Post

**Tilgangur:** Bóka innkaupapöntun og skila númer bókaðs reiknings.

**Lýsing:** Bókar innkaupapöntun með staðlaðri BC `"Purch.-Post"` kóðaeiningu. Pöntunin verður að hafa a.m.k. eina línu. Eftir vel heppnaða bókun er upprunaleg innkaupapöntun eytt og bókaður innkaupareikningur búinn til.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Hægt er að tilgreina númer innkaupapöntunar í **subject**-reitnum, sem SystemId (GUID), eða í **data**-reitnum:

```json
{ "subject": "PO-001" }
```

Eða:

```json
{ "data": { "orderNo": "PO-001" } }
```

**Uppfletting skjals:**

- Texti í **subject** flettir sjálfgefið upp skjalagerð = Order
- Notaðu sérstaka data JSON lykla fyrir aðrar tegundir: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- GUID (SystemId) í **subject** eða data (`systemId`, `id`, `recordSystemId`) finnur skjalið óháð tegund

**Snið svars:**

```json
{
  "status": "Success",
  "documentNo": "PO-001",
  "postedInvoiceNo": "PI-001",
  "vendorNo": "10000",
  "vendorName": "Fabrikam Supplies",
  "documentDate": "2026-03-10",
  "postingDate": "2026-03-16",
  "amount": 5000.00,
  "amountIncludingVAT": 6200.00
}
```

**Reitir í svari:**

- **status**: Vinnslustöðu ("Success" eða "Error")
- **documentNo**: Upprunalegt innkaupapöntunarnúmer sem var bókað
- **postedInvoiceNo**: Númer bókaðs innkaupareiknings sem varð til
- **vendorNo**: Númer lánardrottins sem keypt er af
- **vendorName**: Heiti lánardrottins sem keypt er af
- **documentDate**: Pöntunardagur upprunalegrar innkaupapöntunar
- **postingDate**: Bókunardagsetning bókaðs reiknings
- **amount**: Heildarupphæð án VSK frá bókuðum reikningi
- **amountIncludingVAT**: Heildarupphæð með VSK frá bókuðum reikningi

**Athugasemdir:**

- Notar staðlaða BC `"Purch.-Post"` kóðaeiningu
- Pöntunin verður að vera í Released stöðu til að bókun takist
- Upprunaleg innkaupapöntun er eytt eftir vel heppnaða bókun
- Síutöflunr: 38 (Purchase Header)
- Stefna skilaboða: Innlæg

**Dæmi um beiðni:**

```json
{
  "specversion": "1.0",
  "type": "Purchase.Document.Post",
  "source": "MyApp v1.0",
  "subject": "PO-001"
}
```

**Tengdar skilaboðategundir:**

- [Purchase.Document.Release](#purchasedocumentrelease): Gefa út pöntun áður en bókað er
- [Purchase.Document.Statistics](#purchasedocumentstatistics): Skoða heildir áður en bókað er

---

## Purchase.Document.PreviewPost

**Tilgangur:** Líkir eftir bókun innkaupaskjals og skilar öllum færslubókum sem yrðu stofnaðar án þess að framkvæma bókun (transaction er rollback-ð í lokin).

**Lýsing:** Keyrir alla staðlaða BC bókunarrútínu (`Codeunit "Purch.-Post (Yes/No)"`) gegnum `Codeunit "Gen. Jnl.-Post Preview"`. Allar færslur sem *yrðu* stofnaðar eru gripnar í tímabundnar töflur og síðan er transaction rollback-að. Engin gögn eru vistuð; upprunalegt innkaupaskjal er óbreytt eftir kallið. Notist til að sannreyna hvort hægt sé að bóka skjal, sýna AI-umboðsmanni nákvæmar fjárhagslegar afleiðingar eða birta fyrirsjáanleg skjalanúmer og heildir fyrir bókun.

**Stefna skilaboða:** Innlæg

**Inntaksfæribreytur:**

Sömu uppflettingarreglur og `Purchase.Document.Post`. Stúðningur við Order, Invoice, Credit Memo og Return Order.

**Bifröst færibreytur:**

- **source** (áskilið): Lýsing á forritinu sem kallar.
- **subject** (áskilið/valkvætt): Skjalanúmer innkaupaskjals eða SystemId (GUID). Einnig hagt að senda í `data`.
- **data** (valkvætt): JSON-hlutur með auðkenni skjals. **Fyrsti lykill sem passar vinnur**:
  - `systemId` / `recordSystemId` / `id`: SystemId færslunnar (GUID).
  - `orderNo`: Númer innkaupapöntunar (Document Type = Order).
  - `invoiceNo`: Númer innkaupareiknings.
  - `creditMemoNo`: Númer kreditreiknings.
  - `returnOrderNo`: Númer skilapöntunar.

**Aðferðir til að velja skjal:** Hvaða eitt sem er af eftirfarandi auðkennir skjalið:

1. `subject` sem texti — flettið upp sem `No.` á öllum fjórum skjalategundum.
2. `subject` sem GUID — flettið upp sem `SystemId` á Purchase Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId uppfletting.
4. `data.orderNo` / `data.invoiceNo` / `data.creditMemoNo` / `data.returnOrderNo` — `No.` uppfletting takmörkuð við rétta Document Type.

```json
{ "specversion": "1.0", "type": "Purchase.Document.PreviewPost", "source": "MyApp", "subject": "PO-001" }
```

**Snið svars:**

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order PO-001 for vendor V01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "PO-001",
  "vendorNo": "V01",
  "vendorName": "Acme Supplies",
  "lcyCode": "ISK",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 145.0,
  "predictedNumbers": { "postedInvoiceNo": "PI-00045", "postedReceiptNo": "PR-00045" },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 145000.00, "totalCreditLCY": 145000.00,
    "totalDebitFCY": 1000.00, "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "entryCount": 3, "entries": [ /* full row JSON per entry */ ] },
    { "tableId": 254, "tableName": "VAT Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 5802, "tableName": "Value Entry", "entryCount": 1, "entries": [ ... ] },
    { "tableId": 25, "tableName": "Vendor Ledger Entry", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 145000.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 379, "tableName": "Detailed Vendor Ledg. Entry", "entryCount": 1, "entries": [ ... ] }
    /* Aðrar færslubókartöflur sem snertast (t.d. Job Ledger Entry, FA Ledger Entry, Bank Account Ledger Entry) birtast hér þegar skjalið hefur áhrif á þær */
  ]
}
```

**Reitir í svari:**

- **status**: `"Success"` eða `"Error"`.
- **rollback**: Alltaf `true` við vel heppnað preview — upprunalegt skjal er óbreytt.
- **summary**: Stutt mannlesanleg lýsing.
- **documentType**: `"Order"`, `"Invoice"`, `"Credit Memo"` eða `"Return Order"`.
- **documentNo**: Númer upprunalegrar pöntunar.
- **vendorNo / vendorName**: Lánardrottinn skjalsins.
- **lcyCode**: Staðbundinn gjaldmiðill (LCY) úr G/L Setup.
- **documentCurrencyCode**: Tómt þegar skjalið er í LCY.
- **documentExchangeRate**: FCY→LCY gengi. **Alltaf `1` þegar `documentCurrencyCode` er tómt.**
- **predictedNumbers**: Skjalanúmer sem No. Series *myndi* úthluta á þessu augnabliki. Aðeins til upplýsingar — ekki frátekið.
- **totals.balanced**: `true` þegar LCY debet jafnt og LCY kredit (námundað í 0,01).
- **totals.totalDebit\* / totalCredit\***: Heildir G/L Entry debet/kredit í LCY og FCY.
- **preview[]**: Eitt stak fyrir hverja færslubókartöflu sem BC bókunarrútína fyllir. Töflur eru fundnar kvikt í gegnum `Codeunit "Posting Preview Event Handler".FillDocumentEntry()`. Innbyggður stuðningur er fyrir 17 BC færslubókartöflur og framlengingar geta bætt við töflum í gegnum `OnGetPreviewFieldNames` atburð á `Codeunit "Preview Helper ori"`.
- **preview[].entries[]**: Full JSON-röð fyrir hverja gripna færslu. Reitanöfn nota vélræna umbreytingu (`No.` → `No_`, `Amount (LCY)` → `AmountLCY` o.s.frv.). Reitir sem eru takmarkaðir í `Field Access ori` eru ekki birtir.

**Gjaldmiðilsregla:**

`documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`

Þegar skjalið er í LCY speglar FCY dálkurinn LCY dálkinn og gengið er `1`.

**Fyrirsjáanleg vs raunveruleg númer:** Milli preview og raunverulegrar bókunar getur önnur transaction nýtt fyrirsjáanleg No. Series númer, þannig að raunveruleg bókuð númer geta verið önnur. Notið `predictedNumbers` aðeins til upplýsinga.

**Athugasemdir:**

- Notar BC `Codeunit "Gen. Jnl.-Post Preview"` til að keyra `Codeunit "Purch.-Post (Yes/No)"` í preview-ham.
- Sameiginleg `Codeunit "Preview Helper ori"` raðskýrir hverja töflu og veitir `OnGetPreviewFieldNames` og `OnPrecalculateFlowFields` framlengingaratburði.
- Síutöflunr: 38 (Purchase Header).
- Stefna skilaboða: Innlæg.

**Villuaðstæður:**

- Innkaupaskjal finnst ekki → `{"status":"Error","error":"..."}`.
- Skjal hefur engar línur → villa með skilaboðum um "no lines".
- Hvers konar bókunarvillu BC → undirliggjandi villutexti er skilað.

**Tengdar skilaboðategundir:**

- [Purchase.Document.Post](#purchasedocumentpost): Framkvæmir raunverulega bókun (engin rollback).
- [Purchase.Document.Statistics](#purchasedocumentstatistics): Heildir haus/lína án þess að líkja eftir bókun.


---

## Vendor.Application.Post

**Tilgangur:** Jafnar færslu lánardrottins (*jöfnunarfærsluna*) á móti einni eða fleiri opnum færslum lánardrottins og bókar jöfnunina í gegnum Microsoft codeunit 227 `"VendEntry-Apply Posted Entries"`.

**Lýsing:** Endurspeglar hegðun síðunnar Apply Vendor Entries. Allar færslur verða að tilheyra sama lánardrottni.

**Stefna skilaboða:** Innlæg

**Studdar töflur:** Vendor Ledger Entry (25)

### Snið beiðni

**Bifröst færibreytur:**

| Færibreyta | Krafist | Lýsing |
|---|---|---|
| subject | Já* | SystemId (GUID) eða Entry No. (heiltala) jöfnunarfærslu |
| type | Já | `Vendor.Application.Post` |

*Jöfnunarfærsluna má einnig auðkenna með `systemId`, `recordSystemId`, `id`, `entryNo` eða `entryNumber` í beiðnar-JSON.

**Beiðnar-JSON:**

| Reitur | Tegund | Krafist | Lýsing |
|---|---|---|---|
| appliesToEntries | Array | Já | Listi með a.m.k. einni markfærslu. Hvert element getur verið heiltala (Entry No.), GUID-strengur (SystemId), eða hlutur með `entryNo` / `entryNumber` / `systemId` / `recordSystemId` / `id`. |
| postingDate | Dags. | Nei | Bókunardagur jöfnunar. Sjálfgefið er bókunardagur jöfnunarfærslu. |
| documentNo | Code[20] | Nei | Document No. fyrir jöfnun. Sjálfgefið er document no. jöfnunarfærslu. |
| amountToApply | Decimal | Nei | Upphæð sem jafna á úr jöfnunarfærslu. Sjálfgefið er `Remaining Amount`. |

### Svar

Toppreitir: `status`, `applyingEntryNo`, `applyingRecordSystemId`, `vendorNo`, `documentNo`, `postingDate`, `amountToApply`, `totalApplied`, `remainingAmount`, `open`, `applications[]`.

### Villuástand

- Auðkenni vantar.
- Jöfnunarfærsla fannst ekki eða er ekki opin.
- `appliesToEntries` vantar eða er tómur.
- Markfærsla tilheyrir öðrum lánardrottni eða er lokuð.
- Codeunit 227 hafnaði jöfnun.

### Tengdar skilaboðategundir

- [Vendor.Application.Reverse](#vendorapplicationreverse) - Bakar bókaðri jöfnun.

---

## Vendor.Application.Reverse

**Tilgangur:** Bakar (aftengir) bókaða jöfnun á færslu lánardrottins í gegnum Microsoft codeunit 227 `"VendEntry-Apply Posted Entries.PostUnApplyVendor"`.

**Lýsing:** Sjálfgefið er nýjasta jöfnun bókuð. Tiltekna jöfnun má auðkenna með `detailedEntryNo`.

**Stefna skilaboða:** Innlæg

**Studdar töflur:** Vendor Ledger Entry (25)

### Snið beiðni

| Færibreyta | Krafist | Lýsing |
|---|---|---|
| subject | Já* | SystemId (GUID) eða Entry No. (heiltala) færslu lánardrottins |
| type | Já | `Vendor.Application.Reverse` |

**Beiðnar-JSON:**

| Reitur | Tegund | Krafist | Lýsing |
|---|---|---|---|
| detailedEntryNo | Integer | Nei | Detailed Vendor Ledg. Entry No. fyrir jöfnun sem á að baka. Sjálfgefið síðasta jöfnun. |
| postingDate | Dags. | Nei | Bókunardagur bókunar. |
| documentNo | Code[20] | Nei | Document No. fyrir bókun. |

### Svar

Toppreitir: `status`, `entryNo`, `recordSystemId`, `vendorNo`, `reversedDetailedEntryNo`, `reversedAmount`, `postingDate`, `documentNo`, `remainingAmount`, `open`.

### Villuástand

- Auðkenni vantar.
- Færsla fannst ekki.
- Engin bókuð jöfnun til að baka.
- `detailedEntryNo` er ekki til eða ekki Application færsla.
- Codeunit 227 hafnaði afbókun.

### Tengdar skilaboðategundir

- [Vendor.Application.Post](#vendorapplicationpost) - Jafnar færslur lánardrottins.

---

## Purchase.Quote.MakeOrder

**Tilgangur:** Breytir innkaupatilboði (Purchase Quote) í innkaupapöntun (Purchase Order).

**Stefna:** Innlæg (aðgerðarbeiðni)

**Síutafla:** Purchase Header (38)

**Lýsing:** Kallar á staðlað BC `Codeunit "Purch.-Quote to Order"` (codeunit 96) til að breyta innkaupatilboði í innkaupapöntun. Upprunalega tilboðinu er eytt og ný innkaupapöntun stofnuð með sama lánardrottin, línur og víddir. Skilar nýja pöntunarnúmerinu ásamt lykilreitum hauss.

### Beiðnasniðmát

| Færibreyta | Krafa | Lýsing |
|---|---|---|
| source | Já | Auðkenni kallandi forrits |
| subject | Já | Tilboðsnúmer eða SystemId (GUID) Purchase Header |

### Auðkennisröð fyrir subject

Gildi subject er flett upp gegnum `FindPurchaseHeader`:
1. Ef subject er gilt GUID → `GetBySystemId`
2. Annars → `Get` eftir skjalanúmeri yfir allar innkaupa-skjalategundir

Skjalið sem fannst **verður** að hafa `Document Type = Quote`, annars skilar villu.

### Dæmi um beiðni

```json
{
  "specversion": "1.0",
  "type": "Purchase.Quote.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "PQ-001"
}
```

### Svarsniðmát (Success)

```json
{
  "status": "Success",
  "quoteNo": "PQ-001",
  "orderNo": "PO-005",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Svarsreitir

| Reitur | Gerð | Lýsing |
|---|---|---|
| status | Text | `Success` við velheppnun, `Error` við villu |
| quoteNo | Code[20] | Númer upprunalega tilboðsins |
| orderNo | Code[20] | Númer nýju innkaupapöntunarinnar |
| orderSystemId | Guid | SystemId (GUID) nýja innkaupahaussins |
| vendorNo | Code[20] | Númer Buy-from lánardrottins |
| vendorName | Text | Heiti Buy-from lánardrottins |
| documentDate | Date | ISO dags (yyyy-MM-dd) — skjaldagsetning nýrrar pöntunar |
| orderDate | Date | ISO dags (yyyy-MM-dd) — pöntunardagur nýrrar pöntunar |

### Villusvör

| Villa | Orsök |
|---|---|
| `Subject parameter is required.` | Subject var tómt |
| `Purchase header {No} not found.` | Enginn innkaupahaus passar við subject |
| `Purchase document {No} is not a Quote (actual type: {Type}).` | Subject vísaði á annað skjal en Quote |
| Villutexti frá BC | Staðlaða `Purch.-Quote to Order` codeunit kastaði villu (kallabók fylgir sem `callstack` reitur) |

### Tengdar skilaboðategundir

- [Purchase.Document.Release](#purchasedocumentrelease): Gefa út pöntunina sem verður til
- [Purchase.Document.Post](#purchasedocumentpost): Bóka pöntunina sem verður til

---

## Purchase.BlanketOrder.MakeOrder

**Tilgangur:** Breytir innkaupa-rammapöntun (Purchase Blanket Order) í innkaupapöntun.

**Stefna:** Innlæg (aðgerðarbeiðni)

**Síutafla:** Purchase Header (38)

**Lýsing:** Kallar á staðlað BC `Codeunit "Blanket Purch. Order to Order"` (codeunit 97) til að stofna nýja innkaupapöntun út frá rammapöntun. Línur með `Qty. to Receive > 0` færast yfir á nýju pöntunina; rammapöntunin lifir áfram og útistandandi magn lækkar samkvæmt því.

### Beiðnasniðmát

| Færibreyta | Krafa | Lýsing |
|---|---|---|
| source | Já | Auðkenni kallandi forrits |
| subject | Já | Rammapöntunarnúmer eða SystemId (GUID) Purchase Header |

### Auðkennisröð fyrir subject

1. Ef subject er gilt GUID → `GetBySystemId`
2. Annars → `Get` eftir skjalanúmeri yfir allar innkaupa-skjalategundir

Skjalið sem fannst **verður** að hafa `Document Type = Blanket Order`, annars skilar villu.

### Forsendur

Hver lína rammapöntunar sem á að færast yfir verður að hafa `Qty. to Receive > 0` (notið Data.Records.Set áður til að stilla gildin). Línur með núll `Qty. to Receive` eru ekki færðar.

### Dæmi um beiðni

```json
{
  "specversion": "1.0",
  "type": "Purchase.BlanketOrder.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "PB-001"
}
```

### Svarsniðmát (Success)

```json
{
  "status": "Success",
  "blanketOrderNo": "PB-001",
  "orderNo": "PO-006",
  "orderSystemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vendorNo": "10000",
  "vendorName": "Fabrikam, Inc.",
  "documentDate": "2026-03-07",
  "orderDate": "2026-03-07"
}
```

### Svarsreitir

| Reitur | Gerð | Lýsing |
|---|---|---|
| status | Text | `Success` við velheppnun, `Error` við villu |
| blanketOrderNo | Code[20] | Númer upprunalegu rammapöntunarinnar |
| orderNo | Code[20] | Númer nýju innkaupapöntunarinnar |
| orderSystemId | Guid | SystemId (GUID) nýja innkaupahaussins |
| vendorNo | Code[20] | Númer Buy-from lánardrottins |
| vendorName | Text | Heiti Buy-from lánardrottins |
| documentDate | Date | ISO dags (yyyy-MM-dd) — skjaldagsetning nýrrar pöntunar |
| orderDate | Date | ISO dags (yyyy-MM-dd) — pöntunardagur nýrrar pöntunar |

### Villusvör

| Villa | Orsök |
|---|---|
| `Subject parameter is required.` | Subject var tómt |
| `Purchase header {No} not found.` | Enginn innkaupahaus passar við subject |
| `Purchase document {No} is not a Blanket Order (actual type: {Type}).` | Subject vísaði á annað skjal en Blanket Order |
| Villutexti frá BC | Staðlaða `Blanket Purch. Order to Order` codeunit kastaði villu (t.d. engar línur með `Qty. to Receive > 0`); kallabók fylgir sem `callstack` reitur |

### Tengdar skilaboðategundir

- [Purchase.Document.Release](#purchasedocumentrelease): Gefa út pöntunina sem verður til
- [Purchase.Quote.MakeOrder](#purchasequotemakeorder): Systuraðgerð fyrir innkaupatilboð

---

## Purchase.PurchaseInvoice.Correct

**Tilgangur:** Bakfærir bókaðan innkaupareikning og býr til nýjan drög að innkaupareikningi til leiðréttingar.

**Lýsing:** Vefur BC codeunit 1313 `Correct Posted Purch. Invoice` aðferðina `CancelPostedInvoiceStartNewInvoice`. Bókar jöfnunarkreditreikning á móti upprunalegum reikningi og býr til nýjan drög að `Purchase Header` (Document Type = Invoice).

**Stefna skilaboða:** Innlæg (Inbound)

**Bókunarstýring:** `G/L`.

**Röð auðkennisleitar:** GUID í gegnum Subject (SystemId) → Subject sem `No.` (Get) → JSON-lyklar (`systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`).

**Inntaksbreytur:**

```json
{
  "type": "Purchase.PurchaseInvoice.Correct",
  "subject": "PINV-000123"
}
```

**Svarsnið:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "PINV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "vendorNo": "V00010",
  "vendorName": "Vendor Ltd.",
  "cancellingCreditMemo": { "no": "PCM-000456", "id": "1a2b3c4d-..." },
  "newDraftInvoice": { "no": "PI-000789", "id": "9f8e7d6c-...", "documentType": "Invoice" }
}
```

**Villuaðstæður:**
- Vantar auðkenni → `Error`.
- Reikningur fannst ekki → `Error`.
- Ekki hægt að leiðrétta reikning → `Error` með villutexta frá BC og `callstack` reit.

**Ferli:**
1. Auðkenni er leyst úr `subject` eða úr request JSON.
2. `G/L` bókunarstýring er staðfest.
3. BC `CancelPostedInvoiceStartNewInvoice` keyrt í einangruðu `Codeunit.Run`; villur skila sér sem JSON með callstack.
4. BC bókar jöfnunarkreditreikning, parar hann að fullu við upprunalega reikninginn, og býr til nýjan drög að `Purchase Header` (Document Type = Invoice) afritaðan úr upprunalega reikningnum.
5. Jöfnunarkreditreikningurinn er sóttur í gegnum `Cancelled Document` (Source ID = 122, Cancelled Doc. No. = upprunalegur reikningur).
6. Upprunalegi reikningurinn, jöfnunarkreditreikningur og nýju drögin eru skilað í einu JSON svari.

**Skjöl sem verða til:**

| Hlutverk | BC tafla | Auðkenni í svari |
|---|---|---|
| Upprunalegi reikningurinn (nú merktur Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Jöfnunarkreditreikningur (bókaður, að fullu paraður) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `.no` |
| Nýr breytanlegur drög að reikningi | `Purchase Header` (Document Type = Invoice) | `newDraftInvoice.id` / `.no` |

**Tengingar milli skjala:**
- Upprunalegi reikningurinn: `Cancelled = true`, `Canceled By Cr. Memo No.` = númer kreditreiknings.
- Kreditreikningur: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = upprunalegi reikningurinn.
- `Cancelled Document` röð: `Source ID` = 122, `Cancelled Doc. No.` = upprunalegur, `Cancelled By Doc. No.` = kreditreikningur.
- Nýju drögin hafa ekkert reitatengsl við upprunalega; tengingin er aðeins í gegnum þetta svar.

**Sækja skjölin með Data.Records.Get:**

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purchase Header", "tableView": "WHERE(SystemId=CONST(<newDraftInvoice.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Hdr.", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purchase Line", "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(<newDraftInvoice.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Tengdar tegundir skilaboða:**
- [Purchase.PurchaseInvoice.Cancel](#purchasepurchaseinvoicecancel) - Bakfærir án nýrra draga.
- [Purchase.Document.Post](#purchasedocumentpost) - Bóka nýja drög að reikningi.

---

## Purchase.PurchaseInvoice.Cancel

**Tilgangur:** Bakfærir bókaðan innkaupareikning með því að bóka jöfnunarkreditreikning.

**Lýsing:** Vefur BC codeunit 1313 `Correct Posted Purch. Invoice` aðferðina `CancelPostedInvoice`. Ólíkt `Correct` er enginn nýr drög að reikningi búinn til.

**Stefna skilaboða:** Innlæg (Inbound)

**Bókunarstýring:** `G/L`.

**Inntaksbreytur:**

```json
{
  "type": "Purchase.PurchaseInvoice.Cancel",
  "subject": "PINV-000123"
}
```

**Svarsnið:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "PINV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "vendorNo": "V00010",
  "vendorName": "Vendor Ltd.",
  "cancellingCreditMemo": { "no": "PCM-000456", "id": "1a2b3c4d-..." }
}
```

`newDraftInvoice` hluturinn er viljandi sleppt.

**Ferli:**
1. Auðkenni er leyst úr `subject` eða úr request JSON.
2. `G/L` bókunarstýring er staðfest.
3. BC `CancelPostedInvoice` keyrt í einangruðu `Codeunit.Run`; villur skila sér sem JSON með callstack.
4. BC bókar jöfnunarkreditreikning og parar hann að fullu við upprunalega reikninginn. Engin drög eru búin til.
5. Jöfnunarkreditreikningurinn er sóttur í gegnum `Cancelled Document` (Source ID = 122, Cancelled Doc. No. = upprunalegur reikningur).
6. Upprunalegi reikningurinn og jöfnunarkreditreikningurinn skilað í einu JSON svari.

**Skjöl sem verða til:**

| Hlutverk | BC tafla | Auðkenni í svari |
|---|---|---|
| Upprunalegi reikningurinn (nú merktur Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Jöfnunarkreditreikningur (bókaður, að fullu paraður) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `.no` |

**Tengingar milli skjala:**
- Upprunalegi reikningurinn: `Cancelled = true`, `Canceled By Cr. Memo No.` = númer kreditreiknings.
- Kreditreikningur: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = upprunalegi reikningurinn.
- `Cancelled Document` röð: `Source ID` = 122, `Cancelled Doc. No.` = upprunalegur, `Cancelled By Doc. No.` = kreditreikningur.

**Sækja skjölin með Data.Records.Get:**

```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Hdr.", "tableView": "WHERE(SystemId=CONST(<cancellingCreditMemo.id>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Cr. Memo Line", "tableView": "WHERE(Document No.=CONST(<cancellingCreditMemo.no>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Purch. Inv. Header", "tableView": "WHERE(No.=CONST(<originalInvoiceNo>))" } }
```
```json
{ "type": "Data.Records.Get", "data": { "tableName": "Cancelled Document", "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(<originalInvoiceNo>))" } }
```

**Villuaðstæður:** Sama og `Purchase.PurchaseInvoice.Correct`.

**Tengdar tegundir skilaboða:**
- [Purchase.PurchaseInvoice.Correct](#purchasepurchaseinvoicecorrect) - Bakfærir og býr til nýja drög til leiðréttingar.
