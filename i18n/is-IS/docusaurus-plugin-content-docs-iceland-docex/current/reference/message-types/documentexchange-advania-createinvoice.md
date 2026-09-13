---
id: documentexchange-advania-createinvoice
title: "DocumentExchange.Advania.CreateInvoice"
sidebar_label: "DocumentExchange.Advania.CreateInvoice"
sidebar_position: 4
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.CreateInvoice Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Býr til an electronic invoice frá structured buffer data. Both partners accept the
same unified Beiðni format (`invoiceData` in Peppol BIS 3.0 buffer structure).
The system transforms the buffer í the partner-specific format internally.

## Verkflæði Differences by Partner

| Partner | Verkflæði | completed | Next Step |
|---------|----------|-----------|-----------|
| Advania | Two-step: CreateInvoice builds XML → SubmitDocument sends it | `false` | Kallaðu á SubmitDocument |
| Unimaze | stakan-step: CreateInvoice builds JSON og Sendir | `true` | Notaðu StatusSync til poll |

Check the `completed` Reitur in Svarið til determine Ef submission er done.
Ef `completed: false`, Kallaðu á the action in `nextStep` til finish the Verkflæði.

## Beiðni — skjal Identifier (Gefðu upp ONE)
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| salesInvoiceNo | string | Posted sales invoice number |
| salesInvoiceRecordSystemId | string | SystemId GUID of posted sales invoice |
| salesCreditMemoNo | string | Posted sales credit memo number |
| salesCreditMemoRecordSystemId | string | SystemId GUID of posted sales credit memo |

## Beiðni — invoiceData (Advania) eða payload (Unimaze)
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| invoiceData | object | **Yes** (Advania) | Peppol BIS 3.0 buffer structure (see below) |
| payload | object | **Yes** (Unimaze) | Direct MAPI JSON body (see SubmitTransaction fyrir format) |
| includeAttachments | boolean | No | Embed Allt skjal attachments (Advania Aðeins) |
| attachmentIds | integer[] | No | Specific attachment IDs til include (Advania Aðeins) |
| storeAsAttachment | boolean | No | Store built XML as attachment (Advania Aðeins) |
| returnXml | boolean | No | Return built XML in Svar (Advania Aðeins) |

## invoiceData Buffer Structure
The `invoiceData` object uses normalized Peppol BIS 3.0 buffer tables.
Allt partners accept this identical format — the system converts internally.

```json
{
  "header": {
    "documentType": 380,
    "documentNo": "103301",
    "issueDate": "2026-01-15",
    "dueDate": "2026-02-15",
    "currencyCode": "ISK",
    "buyerReference": "PO-12345",
    "taxExclusiveAmount": 100000,
    "taxInclusiveAmount": 124000,
    "payableAmount": 124000,
    "taxAmount": 24000
  },
  "lines": [
    {
      "lineNo": 10000,
      "description": "Consulting services",
      "quantity": 10,
      "unitCode": "HUR",
      "unitPrice": 10000,
      "lineAmount": 100000,
      "taxPercent": 24,
      "taxAmount": 24000,
      "taxCategoryCode": "S"
    }
  ],
  "parties": [
    {
      "partyType": 0,
      "name": "Sender Company ehf.",
      "streetAddress": "Laugavegur 1",
      "postalCode": "101",
      "city": "Reykjavik",
      "countryCode": "IS",
      "partyId": "5012345679",
      "endpointId": "5012345679",
      "endpointSchemeId": "0196"
    },
    {
      "partyType": 1,
      "name": "Receiver Company ehf.",
      "streetAddress": "Skolavordustigur 10",
      "postalCode": "101",
      "city": "Reykjavik",
      "countryCode": "IS",
      "partyId": "6501012150",
      "endpointId": "6501012150",
      "endpointSchemeId": "0196"
    }
  ],
  "payments": [
    {
      "meansCode": "42",
      "accountId": "0133-26-012345",
      "accountName": "Main account"
    }
  ],
  "taxes": [
    {
      "categoryCode": "S",
      "percent": 24,
      "taxableAmount": 100000,
      "taxAmount": 24000
    }
  ]
}
```

### header fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| documentType | integer | **Yes** | 380=Invoice, 381=Credit Note, 383=Debit Note |
| documentNo | string | **Yes** | Invoice/credit memo number |
| issueDate | string | **Yes** | YYYY-MM-DD |
| dueDate | string | Recommended | YYYY-MM-DD |
| currencyCode | string | **Yes** | ISO 4217 (ISK, EUR, USD, etc.) |
| buyerReference | string | Recommended | Buyer's PO eða reference number |
| taxExclusiveAmount | decimal | **Yes** | Total excl. tax |
| taxInclusiveAmount | decimal | **Yes** | Total incl. tax |
| payableAmount | decimal | **Yes** | Amount due |
| taxAmount | decimal | **Yes** | Total tax |
| note | string | No | Free text note |

### lines[] fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| lineNo | integer | **Yes** | Line number (10000, 20000, ...) |
| Lýsing | string | **Yes** | Item/service Lýsing |
| quantity | decimal | **Yes** | Quantity (negative fyrir credit lines) |
| unitCode | string | **Yes** | UN/ECE Rec 20 code (HUR, EA, KGM, etc.) |
| unitPrice | decimal | **Yes** | Unit price |
| lineAmount | decimal | **Yes** | Line total excl. tax (unitPrice * quantity) |
| taxPercent | decimal | **Yes** | Tax percent (24, 11, 0) |
| taxAmount | decimal | **Yes** | Tax amount fyrir this line |
| taxCategoryCode | string | **Yes** | S=staðlaða, AA=Lower, Z=ZeroRated, E=Exempt, G=Export, K=EEA, AE=ReverseCharge |
| itemId | string | No | Item number |

### parties[] fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| partyType | integer | **Yes** | 0=Supplier, 1=viðskiptavinur, 2=Payee, 4=Delivery |
| Heiti | string | **Yes** | Legal Heiti |
| streetAddress | string | **Yes** | Street address |
| postalCode | string | **Yes** | Postal code |
| city | string | Recommended | City Heiti |
| countryCode | string | **Yes** | ISO 3166-1 alpha-2 (er, GB, US) |
| partyId | string | Recommended | Registration/kennitala number |
| endpointId | string | **Yes** | Electronic address (usually kennitala) |
| endpointSchemeId | string | **Yes** | Scheme (0196=er kennitala, 0007=GLN) |
| taxCompanyId | string | Recommended | VAT/tax registration number (supplier: sets vatNumber in Unimaze) |

### greiðslur[] fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| meansCode | string | **Yes** | 42=bank transfer, 49=claim, 30=credit transfer |
| accountId | string | **Yes** | bankareikningur (BBBB-TT-NNNNNN) eða claim number |
| accountName | string | No | reikningur Lýsing |

### taxes[] fields
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| categoryCode | string | **Yes** | S, AA, Z, E, G, K, AE |
| percent | decimal | **Yes** | Tax rate (24, 11, 0) |
| taxableAmount | decimal | **Yes** | Tax base fyrir this category |
| taxAmount | decimal | **Yes** | Tax amount (0 fyrir exempt/zero-rated) |

### valfrjálst arrays: references[], charges[], attachments[]
Omit Ef not needed. See skjal codeunit (72890) fyrir fulla schema.

## Svar (Unified Format)
Both partners return the same Svar structure:

```json
{
  "documentNo": "103301",
  "completed": false,
  "workflow": "created",
  "originalIdentifier": "81303ED7...",
  "documentExchangeIdentifier": "",
  "documentExchangeStatus": "",
  "nextStep": "SubmitDocument",
  "nextStepParams": "{\"salesInvoiceNo\":\"103301\"}"
}
```

### Svar Þegar completed=true (Unimaze)
```json
{
  "documentNo": "103301",
  "completed": true,
  "workflow": "submitted",
  "originalIdentifier": "a1b2c3d4-...",
  "documentExchangeIdentifier": "ref-e5f6g7h8-...",
  "documentExchangeStatus": "Sent to Document Exchange Service",
  "validationStatus": "approved",
  "referenceId": "ref-e5f6g7h8-..."
}
```

### Svar fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| documentNo | string | The posted skjal number |
| completed | boolean | `true` = invoice submitted, `false` = needs SubmitDocument |
| Verkflæði | string | `"created"` eða `"submitted"` |
| originalIdentifier | string | Reitur 712 value (færsla/message ID) |
| documentExchangeIdentifier | string | Reitur 710 value (empty until submitted) |
| documentExchangeStatus | string | Reitur 711 value (empty until submitted) |
| nextStep | string/null | Action til Kallaðu á next (`"SubmitDocument"` eða absent) |
| nextStepParams | string | JSON með skjal identifier fyrir the next Kallaðu á |
| validationStatus | string | Unimaze Aðeins: validation result frá exchange |
| referenceId | string | Unimaze Aðeins: exchange reference ID |
| transactionId | string | Advania Aðeins: xDoc færsla ID |
| attachmentsIncluded | integer | Advania Aðeins: count of embedded attachments |

## Fields Updated on the Posted skjal
| Reitur | Advania | Unimaze |
|-------|---------|---------|
| 712 (Doc. Exch. Original Identifier) | xDoc TransactionId | Generated messageId |
| 710 (skjal Exchange Identifier) | — (set by SubmitDocument) | Exchange referenceId |
| 711 (skjal Exchange Status) | — (set by SubmitDocument) | "Sent til skjal Exchange Service" |

## Decision Logic fyrir Callers
```
response = call CreateInvoice(...)
if response.completed:
    # Done — invoice is submitted (Unimaze)
    # Use StatusSync to poll delivery status
else:
    # Not done — call nextStep (Advania)
    call SubmitDocument(response.nextStepParams)
```

## Gathering Data frá BC fyrir invoiceData

The `invoiceData` buffer verður að be populated frá BC tables áður en calling CreateInvoice.
Below er the mapping frá BC fields til buffer fields.

### Step 1: header — frá Sales Invoice Header (table 112)
```
get_records table="Sales Invoice Header" filter="No.=CONST(103301)"
  fields=[No. (3), Posting Date (20), Due Date (23), Currency Code (32),
          Amount (60), Amount Including VAT (62), Your Reference (35),
          Sell-to Customer No. (2)]
```

| BC Reitur | Buffer Reitur | Notes |
|----------|--------------|-------|
| No. (3) | `documentNo` | |
| Posting Date (20) | `issueDate` | Format YYYY-MM-DD |
| Due Date (23) | `dueDate` | Format YYYY-MM-DD |
| Currency Code (32) | `currencyCode` | Blank = "ISK" |
| Amount (60) | `taxExclusiveAmount` | |
| Amount þar á meðal VAT (62) | `taxInclusiveAmount`, `payableAmount` | Same value fyrir both |
| (Amount Incl. VAT - Amount) | `taxAmount` | Calculated |
| Your Reference (35) | `buyerReference` | eða External skjal No. (36) |
| — | `documentType` | 380 fyrir invoice, 381 fyrir credit note |

### Step 2: lines[] — frá Sales Invoice Line (table 113)
```
get_records table="Sales Invoice Line"
  filter="Document No.=CONST(103301),Type=FILTER(Item|G/L Account|Resource|Charge (Item))"
  fields=[Line No. (4), Description (11), Quantity (15),
          Unit of Measure Code (14), Unit Price (22), Amount (60),
          Amount Including VAT (61), VAT % (53), No. (6)]
```

| BC Reitur | Buffer Reitur | Notes |
|----------|--------------|-------|
| Line No. (4) | `lineNo` | |
| Lýsing (11) | `description` | |
| Quantity (15) | `quantity` | |
| Unit of Measure Code (14) | `unitCode` | Map til UN/ECE Rec 20 (see below) |
| Unit Price (22) | `unitPrice` | |
| Amount (60) | `lineAmount` | Line total excl. VAT |
| Amount þar á meðal VAT (61) - Amount (60) | `taxAmount` | Line VAT amount |
| VAT % (53) | `taxPercent` | e.g. 24, 11, 0 |
| VAT % → category | `taxCategoryCode` | 24%→"S", 11%→"AA", 0%→"Z" eða "E" |
| No. (6) | `itemId` | valfrjálst seller's item ID |

**Unit code mapping** (BC Unit of Measure → UN/ECE Rec 20):
| BC UOM | Buffer unitCode | Meaning |
|--------|-----------------|---------|
| STK / STYKKI | EA | Each/piece |
| TIMI / KLST | HUR | Hour |
| KG | KGM | Kilogram |
| L / LITRI | LTR | Litre |
| M / METRI | MTR | Metre |
| DAG | DAY | Day |
| MAN | MON | Month |
| KASSI | BX | Box |
| (unknown) | C62 | Unit (generic fallback) |

**Tax category mapping** (BC VAT % → UNCL5305):
| VAT % | taxCategoryCode | Meaning |
|-------|-----------------|---------|
| 24 | S | staðlaða rated |
| 11 | AA | Reduced/lower rated |
| 0 (taxable) | Z | Zero-rated (goods/services eru taxable but rate er 0) |
| 0 (exempt) | E | Exempt frá VAT (services not subject til VAT) |
| 0 (export) | G | Free export (tax not charged on goods leaving er) |
| 0 (EEA) | K | Exempt fyrir EEA intra-community supply |
| 0 (reverse) | AE | Reverse charged (buyer accounts fyrir VAT) |

### Step 3: parties[] — frá fyrirtæki Information + viðskiptavinur

**Supplier (partyType=0)** — frá fyrirtæki Information (table 79):
```
get_records table="Company Information" take=1
  fields=[Name (2), Address (4), Post Code (30), City (5),
          Registration No. (150), VAT Registration No. (86), Country/Region Code (14)]
```

| BC Reitur | Buffer Reitur | Notes |
|----------|--------------|-------|
| Heiti (2) | `name` | |
| Address (4) | `streetAddress` | |
| Post Code (30) | `postalCode` | |
| City (5) | `city` | |
| Country/Region Code (14) | `countryCode` | Default "er" Ef blank |
| Registration No. (150) | `endpointId`, `partyId` | Kennitala (no dash) |
| Registration No. (150) | `taxCompanyId` | Same kennitala (sets Unimaze vatNumber) |
| — | `endpointSchemeId` | "0196" fyrir er kennitala |
| — | `partyType` | 0 (Supplier) |

> **Important (Unimaze):** The supplier `endpointId` verður að match the fyrirtæki
> registered með the Unimaze API key. A mismatch causes HTTP 422.

**viðskiptavinur (partyType=1)** — frá viðskiptavinur (table 18):
```
get_records table="Customer" filter="No.=CONST(CUST01)"
  fields=[Name (2), Address (5), Post Code (91), City (7),
          Registration No. (47), VAT Registration No. (86), Country/Region Code (35)]
```

| BC Reitur | Buffer Reitur | Notes |
|----------|--------------|-------|
| Heiti (2) | `name` | |
| Address (5) | `streetAddress` | |
| Post Code (91) | `postalCode` | |
| City (7) | `city` | |
| Country/Region Code (35) | `countryCode` | Default "er" Ef blank |
| Registration No. (47) | `endpointId`, `partyId` | Kennitala (no dash) |
| — | `endpointSchemeId` | "0196" fyrir er kennitala |
| — | `partyType` | 1 (viðskiptavinur) |

### Step 4: greiðslur[] — frá greiðsla Aðferð + fyrirtæki Bank

Resolve frá Sales Invoice Header."greiðsla Aðferð Code" (81):
```
get_records table="Payment Method" filter="Code=CONST(MILLIFAERSLA)"
  fields=[Code (1), Description (2)]
```

bankareikningur frá fyrirtæki Information eða specific bank:
```
get_records table="Company Information" take=1
  fields=[Bank Branch No. (40), Bank Account No. (43)]
```

| Source | Buffer Reitur | Notes |
|--------|--------------|-------|
| greiðsla Aðferð Gerð | `meansCode` | "42"=bank transfer, "49"=direct debit/claim |
| Branch + reikningur | `accountId` | Format: "BBBB-TT-NNNNNN" (bank-ledger-reikningur) |
| — | `accountName` | valfrjálst Lýsing |

**Icelandic bankareikningur format**: `BBBB-TT-NNNNNN` where:
- BBBB = 4-digit bank number (e.g. 0133)
- TT = 2-digit reikningur Gerð (höfuðbók, e.g. 26)
- NNNNNN = 6-digit reikningur number

### Step 5: taxes[] — aggregate frá lines

Group invoice lines by VAT % og sum:

| Buffer Reitur | How til calculate |
|--------------|------------------|
| `categoryCode` | frá taxCategoryCode mapping above (S, AA, Z, E) |
| `percent` | The VAT % fyrir this group |
| `taxableAmount` | Sum of lineAmount fyrir Allt lines in this group |
| `taxAmount` | Sum of per-line taxAmount fyrir this group |

Dæmi: Ef lines 1-3 have VAT%=24 og line 4 has VAT%=0:
```json
"taxes": [
  { "categoryCode": "S", "percent": 24, "taxableAmount": 300000, "taxAmount": 72000 },
  { "categoryCode": "Z", "percent": 0, "taxableAmount": 50000, "taxAmount": 0 }
]
```

### Credit Memos
Same mapping but Notaðu different tables:
| Invoice Table | Credit Memo Table |
|---------------|-------------------|
| 112 — Sales Invoice Header | 114 — Sales Cr.Memo Header |
| 113 — Sales Invoice Line | 115 — Sales Cr.Memo Line |

Set `documentType: 381` in header. Quantities eru positive (system handles credit semantics).
Notaðu `salesCreditMemoNo` instead of `salesInvoiceNo` in Beiðnin.

## BIS30 Validation — Verify Values áður en Sending

The exchange rejects invoices með invalid codes. Notaðu these message types
til validate values áður en calling CreateInvoice:

| Buffer Reitur | Validate með | What It Skilar |
|--------------|---------------|-----------------|
| `currencyCode` | `DocumentExchange.BIS30.Currencies` | Allt valid ISO 4217 codes (ISK, EUR, USD, GBP, ...) |
| `unitCode` | `DocumentExchange.BIS30.UnitCodes` | Allt valid UN/ECE Rec 20 codes (EA, HUR, KGM, ...) |
| `taxCategoryCode` | `DocumentExchange.BIS30.VatCodes` | Valid UNCL5305 codes (S, AA, Z, E, AE, O, ...) |
| `countryCode` | `DocumentExchange.BIS30.CountryCodes` | ISO 3166-1 alpha-2 (er, GB, US, DE, ...) |
| `documentType` | `DocumentExchange.BIS30.DocTypeCodes` | UNCL1001 codes (380=Invoice, 381=Credit Note, ...) |
| `endpointSchemeId` | `DocumentExchange.BIS30.ElectronicAddresses` | Endapunktur schemes (0196=er, 0007=GLN, 9908=NO, ...) |
| attachment MIME types | `DocumentExchange.BIS30.MimeCodes` | Allowed MIME types fyrir embedded attachments |

### Common Validation Errors og Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| "tax amount zero needs ZeroRated eða Exempt" | Line has taxAmount=0 but taxCategoryCode="S" | Notaðu "Z" (zero-rated) eða "E" (exempt) Þegar tax er 0 |
| "buyer reference eða order reference nauðsynlegt" | No `buyerReference` in header | Add buyerReference (frá "Your Reference" Reitur) |
| "invalid unit code" | BC UOM not mapped til UN/ECE Rec 20 | Notaðu mapping table above, fallback til "C62" |
| "invalid Endapunktur scheme" | Wrong `endpointSchemeId` | Notaðu "0196" fyrir Icelandic kennitala |
| "supplier Endapunktur nauðsynlegt" | Missing supplier `endpointId` | Ensure fyrirtæki Information."Registration No." er set |

### Tax Category Rules (BIS 3.0 BR-rules)
| Scenario | taxCategoryCode | taxPercent | taxAmount |
|----------|-----------------|------------|-----------|
| staðlaða 24% | S | 24 | verður að be > 0 |
| Reduced 11% | AA | 11 | verður að be > 0 |
| Zero-rated (taxable, rate=0) | Z | 0 | verður að be 0 |
| Exempt (not subject til VAT) | E | 0 | verður að be 0 |
| Reverse charge | AE | 0 | verður að be 0 |
| Outside scope | O | 0 | verður að be 0 |

**Critical rule:** Ef taxAmount=0 on a line, taxCategoryCode verður að be Z, E, AE, eða O.
Using "S" eða "AA" með zero tax triggers a 422 rejection.

### Validating a Specific Code
```
# Check if "HUR" is a valid unit code:
call DocumentExchange.BIS30.UnitCodes → search response for "HUR"

# Check if "0196" is a valid endpoint scheme:
call DocumentExchange.BIS30.ElectronicAddresses → search for "0196"
```

## Next Step
- Ef `completed: true` → Notaðu **StatusSync** til poll delivery status
- Ef `completed: false` → Kallaðu á **SubmitDocument** (params provided in `nextStepParams`)


