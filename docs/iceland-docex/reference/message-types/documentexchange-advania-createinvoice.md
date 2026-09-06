---
id: documentexchange-advania-createinvoice
title: "DocumentExchange.Advania.CreateInvoice"
sidebar_label: "DocumentExchange.Advania.CreateInvoice"
sidebar_position: 4
description: "Request and response contract for the DocumentExchange.Advania.CreateInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Creates an electronic invoice from structured buffer data. Both partners accept the
same unified request format (`invoiceData` in Peppol BIS 3.0 buffer structure).
The system transforms the buffer into the partner-specific format internally.

## Workflow Differences by Partner

| Partner | Workflow | completed | Next Step |
|---------|----------|-----------|-----------|
| Advania | Two-step: CreateInvoice builds XML → SubmitDocument sends it | `false` | Call SubmitDocument |
| Unimaze | Single-step: CreateInvoice builds JSON AND submits | `true` | Use StatusSync to poll |

Check the `completed` field in the response to determine if submission is done.
If `completed: false`, call the action in `nextStep` to finish the workflow.

## Request — Document Identifier (provide ONE)
| Field | Type | Description |
|-------|------|-------------|
| salesInvoiceNo | string | Posted sales invoice number |
| salesInvoiceRecordSystemId | string | SystemId GUID of posted sales invoice |
| salesCreditMemoNo | string | Posted sales credit memo number |
| salesCreditMemoRecordSystemId | string | SystemId GUID of posted sales credit memo |

## Request — invoiceData (Advania) or payload (Unimaze)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| invoiceData | object | **Yes** (Advania) | Peppol BIS 3.0 buffer structure (see below) |
| payload | object | **Yes** (Unimaze) | Direct MAPI JSON body (see SubmitTransaction for format) |
| includeAttachments | boolean | No | Embed ALL document attachments (Advania only) |
| attachmentIds | integer[] | No | Specific attachment IDs to include (Advania only) |
| storeAsAttachment | boolean | No | Store built XML as attachment (Advania only) |
| returnXml | boolean | No | Return built XML in response (Advania only) |

## invoiceData Buffer Structure
The `invoiceData` object uses normalized Peppol BIS 3.0 buffer tables.
All partners accept this identical format — the system converts internally.

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| documentType | integer | **Yes** | 380=Invoice, 381=Credit Note, 383=Debit Note |
| documentNo | string | **Yes** | Invoice/credit memo number |
| issueDate | string | **Yes** | YYYY-MM-DD |
| dueDate | string | Recommended | YYYY-MM-DD |
| currencyCode | string | **Yes** | ISO 4217 (ISK, EUR, USD, etc.) |
| buyerReference | string | Recommended | Buyer's PO or reference number |
| taxExclusiveAmount | decimal | **Yes** | Total excl. tax |
| taxInclusiveAmount | decimal | **Yes** | Total incl. tax |
| payableAmount | decimal | **Yes** | Amount due |
| taxAmount | decimal | **Yes** | Total tax |
| note | string | No | Free text note |

### lines[] fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lineNo | integer | **Yes** | Line number (10000, 20000, ...) |
| description | string | **Yes** | Item/service description |
| quantity | decimal | **Yes** | Quantity (negative for credit lines) |
| unitCode | string | **Yes** | UN/ECE Rec 20 code (HUR, EA, KGM, etc.) |
| unitPrice | decimal | **Yes** | Unit price |
| lineAmount | decimal | **Yes** | Line total excl. tax (unitPrice * quantity) |
| taxPercent | decimal | **Yes** | Tax percent (24, 11, 0) |
| taxAmount | decimal | **Yes** | Tax amount for this line |
| taxCategoryCode | string | **Yes** | S=Standard, AA=Lower, Z=ZeroRated, E=Exempt, G=Export, K=EEA, AE=ReverseCharge |
| itemId | string | No | Item number |

### parties[] fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| partyType | integer | **Yes** | 0=Supplier, 1=Customer, 2=Payee, 4=Delivery |
| name | string | **Yes** | Legal name |
| streetAddress | string | **Yes** | Street address |
| postalCode | string | **Yes** | Postal code |
| city | string | Recommended | City name |
| countryCode | string | **Yes** | ISO 3166-1 alpha-2 (IS, GB, US) |
| partyId | string | Recommended | Registration/kennitala number |
| endpointId | string | **Yes** | Electronic address (usually kennitala) |
| endpointSchemeId | string | **Yes** | Scheme (0196=IS kennitala, 0007=GLN) |
| taxCompanyId | string | Recommended | VAT/tax registration number (supplier: sets vatNumber in Unimaze) |

### payments[] fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| meansCode | string | **Yes** | 42=bank transfer, 49=claim, 30=credit transfer |
| accountId | string | **Yes** | Bank account (BBBB-TT-NNNNNN) or claim number |
| accountName | string | No | Account description |

### taxes[] fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| categoryCode | string | **Yes** | S, AA, Z, E, G, K, AE |
| percent | decimal | **Yes** | Tax rate (24, 11, 0) |
| taxableAmount | decimal | **Yes** | Tax base for this category |
| taxAmount | decimal | **Yes** | Tax amount (0 for exempt/zero-rated) |

### Optional arrays: references[], charges[], attachments[]
Omit if not needed. See Document codeunit (72890) for full schema.

## Response (Unified Format)
Both partners return the same response structure:

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

### Response when completed=true (Unimaze)
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

### Response fields
| Field | Type | Description |
|-------|------|-------------|
| documentNo | string | The posted document number |
| completed | boolean | `true` = invoice submitted, `false` = needs SubmitDocument |
| workflow | string | `"created"` or `"submitted"` |
| originalIdentifier | string | Field 712 value (transaction/message ID) |
| documentExchangeIdentifier | string | Field 710 value (empty until submitted) |
| documentExchangeStatus | string | Field 711 value (empty until submitted) |
| nextStep | string/null | Action to call next (`"SubmitDocument"` or absent) |
| nextStepParams | string | JSON with document identifier for the next call |
| validationStatus | string | Unimaze only: validation result from exchange |
| referenceId | string | Unimaze only: exchange reference ID |
| transactionId | string | Advania only: xDoc transaction ID |
| attachmentsIncluded | integer | Advania only: count of embedded attachments |

## Fields Updated on the Posted Document
| Field | Advania | Unimaze |
|-------|---------|---------|
| 712 (Doc. Exch. Original Identifier) | xDoc TransactionId | Generated messageId |
| 710 (Document Exchange Identifier) | — (set by SubmitDocument) | Exchange referenceId |
| 711 (Document Exchange Status) | — (set by SubmitDocument) | "Sent to Document Exchange Service" |

## Decision Logic for Callers
```
response = call CreateInvoice(...)
if response.completed:
    # Done — invoice is submitted (Unimaze)
    # Use StatusSync to poll delivery status
else:
    # Not done — call nextStep (Advania)
    call SubmitDocument(response.nextStepParams)
```

## Gathering Data from BC for invoiceData

The `invoiceData` buffer must be populated from BC tables before calling CreateInvoice.
Below is the mapping from BC fields to buffer fields.

### Step 1: header — from Sales Invoice Header (table 112)
```
get_records table="Sales Invoice Header" filter="No.=CONST(103301)"
  fields=[No. (3), Posting Date (20), Due Date (23), Currency Code (32),
          Amount (60), Amount Including VAT (62), Your Reference (35),
          Sell-to Customer No. (2)]
```

| BC Field | Buffer Field | Notes |
|----------|--------------|-------|
| No. (3) | `documentNo` | |
| Posting Date (20) | `issueDate` | Format YYYY-MM-DD |
| Due Date (23) | `dueDate` | Format YYYY-MM-DD |
| Currency Code (32) | `currencyCode` | Blank = "ISK" |
| Amount (60) | `taxExclusiveAmount` | |
| Amount Including VAT (62) | `taxInclusiveAmount`, `payableAmount` | Same value for both |
| (Amount Incl. VAT - Amount) | `taxAmount` | Calculated |
| Your Reference (35) | `buyerReference` | Or External Document No. (36) |
| — | `documentType` | 380 for invoice, 381 for credit note |

### Step 2: lines[] — from Sales Invoice Line (table 113)
```
get_records table="Sales Invoice Line"
  filter="Document No.=CONST(103301),Type=FILTER(Item|G/L Account|Resource|Charge (Item))"
  fields=[Line No. (4), Description (11), Quantity (15),
          Unit of Measure Code (14), Unit Price (22), Amount (60),
          Amount Including VAT (61), VAT % (53), No. (6)]
```

| BC Field | Buffer Field | Notes |
|----------|--------------|-------|
| Line No. (4) | `lineNo` | |
| Description (11) | `description` | |
| Quantity (15) | `quantity` | |
| Unit of Measure Code (14) | `unitCode` | Map to UN/ECE Rec 20 (see below) |
| Unit Price (22) | `unitPrice` | |
| Amount (60) | `lineAmount` | Line total excl. VAT |
| Amount Including VAT (61) - Amount (60) | `taxAmount` | Line VAT amount |
| VAT % (53) | `taxPercent` | e.g. 24, 11, 0 |
| VAT % → category | `taxCategoryCode` | 24%→"S", 11%→"AA", 0%→"Z" or "E" |
| No. (6) | `itemId` | Optional seller's item ID |

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
| 24 | S | Standard rated |
| 11 | AA | Reduced/lower rated |
| 0 (taxable) | Z | Zero-rated (goods/services are taxable but rate is 0) |
| 0 (exempt) | E | Exempt from VAT (services not subject to VAT) |
| 0 (export) | G | Free export (tax not charged on goods leaving IS) |
| 0 (EEA) | K | Exempt for EEA intra-community supply |
| 0 (reverse) | AE | Reverse charged (buyer accounts for VAT) |

### Step 3: parties[] — from Company Information + Customer

**Supplier (partyType=0)** — from Company Information (table 79):
```
get_records table="Company Information" take=1
  fields=[Name (2), Address (4), Post Code (30), City (5),
          Registration No. (150), VAT Registration No. (86), Country/Region Code (14)]
```

| BC Field | Buffer Field | Notes |
|----------|--------------|-------|
| Name (2) | `name` | |
| Address (4) | `streetAddress` | |
| Post Code (30) | `postalCode` | |
| City (5) | `city` | |
| Country/Region Code (14) | `countryCode` | Default "IS" if blank |
| Registration No. (150) | `endpointId`, `partyId` | Kennitala (no dash) |
| Registration No. (150) | `taxCompanyId` | Same kennitala (sets Unimaze vatNumber) |
| — | `endpointSchemeId` | "0196" for IS kennitala |
| — | `partyType` | 0 (Supplier) |

> **Important (Unimaze):** The supplier `endpointId` must match the company
> registered with the Unimaze API key. A mismatch causes HTTP 422.

**Customer (partyType=1)** — from Customer (table 18):
```
get_records table="Customer" filter="No.=CONST(CUST01)"
  fields=[Name (2), Address (5), Post Code (91), City (7),
          Registration No. (47), VAT Registration No. (86), Country/Region Code (35)]
```

| BC Field | Buffer Field | Notes |
|----------|--------------|-------|
| Name (2) | `name` | |
| Address (5) | `streetAddress` | |
| Post Code (91) | `postalCode` | |
| City (7) | `city` | |
| Country/Region Code (35) | `countryCode` | Default "IS" if blank |
| Registration No. (47) | `endpointId`, `partyId` | Kennitala (no dash) |
| — | `endpointSchemeId` | "0196" for IS kennitala |
| — | `partyType` | 1 (Customer) |

### Step 4: payments[] — from Payment Method + Company Bank

Resolve from Sales Invoice Header."Payment Method Code" (81):
```
get_records table="Payment Method" filter="Code=CONST(MILLIFAERSLA)"
  fields=[Code (1), Description (2)]
```

Bank account from Company Information or specific bank:
```
get_records table="Company Information" take=1
  fields=[Bank Branch No. (40), Bank Account No. (43)]
```

| Source | Buffer Field | Notes |
|--------|--------------|-------|
| Payment method type | `meansCode` | "42"=bank transfer, "49"=direct debit/claim |
| Branch + Account | `accountId` | Format: "BBBB-TT-NNNNNN" (bank-ledger-account) |
| — | `accountName` | Optional description |

**Icelandic bank account format**: `BBBB-TT-NNNNNN` where:
- BBBB = 4-digit bank number (e.g. 0133)
- TT = 2-digit account type (höfuðbók, e.g. 26)
- NNNNNN = 6-digit account number

### Step 5: taxes[] — aggregate from lines

Group invoice lines by VAT % and sum:

| Buffer Field | How to calculate |
|--------------|------------------|
| `categoryCode` | From taxCategoryCode mapping above (S, AA, Z, E) |
| `percent` | The VAT % for this group |
| `taxableAmount` | Sum of lineAmount for all lines in this group |
| `taxAmount` | Sum of per-line taxAmount for this group |

Example: If lines 1-3 have VAT%=24 and line 4 has VAT%=0:
```json
"taxes": [
  { "categoryCode": "S", "percent": 24, "taxableAmount": 300000, "taxAmount": 72000 },
  { "categoryCode": "Z", "percent": 0, "taxableAmount": 50000, "taxAmount": 0 }
]
```

### Credit Memos
Same mapping but use different tables:
| Invoice Table | Credit Memo Table |
|---------------|-------------------|
| 112 — Sales Invoice Header | 114 — Sales Cr.Memo Header |
| 113 — Sales Invoice Line | 115 — Sales Cr.Memo Line |

Set `documentType: 381` in header. Quantities are positive (system handles credit semantics).
Use `salesCreditMemoNo` instead of `salesInvoiceNo` in the request.

## BIS30 Validation — Verify Values Before Sending

The exchange rejects invoices with invalid codes. Use these message types
to validate values BEFORE calling CreateInvoice:

| Buffer Field | Validate With | What It Returns |
|--------------|---------------|-----------------|
| `currencyCode` | `DocumentExchange.BIS30.Currencies` | All valid ISO 4217 codes (ISK, EUR, USD, GBP, ...) |
| `unitCode` | `DocumentExchange.BIS30.UnitCodes` | All valid UN/ECE Rec 20 codes (EA, HUR, KGM, ...) |
| `taxCategoryCode` | `DocumentExchange.BIS30.VatCodes` | Valid UNCL5305 codes (S, AA, Z, E, AE, O, ...) |
| `countryCode` | `DocumentExchange.BIS30.CountryCodes` | ISO 3166-1 alpha-2 (IS, GB, US, DE, ...) |
| `documentType` | `DocumentExchange.BIS30.DocTypeCodes` | UNCL1001 codes (380=Invoice, 381=Credit Note, ...) |
| `endpointSchemeId` | `DocumentExchange.BIS30.ElectronicAddresses` | Endpoint schemes (0196=IS, 0007=GLN, 9908=NO, ...) |
| attachment MIME types | `DocumentExchange.BIS30.MimeCodes` | Allowed MIME types for embedded attachments |

### Common Validation Errors and Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| "tax amount zero needs ZeroRated or Exempt" | Line has taxAmount=0 but taxCategoryCode="S" | Use "Z" (zero-rated) or "E" (exempt) when tax is 0 |
| "buyer reference or order reference required" | No `buyerReference` in header | Add buyerReference (from "Your Reference" field) |
| "invalid unit code" | BC UOM not mapped to UN/ECE Rec 20 | Use mapping table above, fallback to "C62" |
| "invalid endpoint scheme" | Wrong `endpointSchemeId` | Use "0196" for Icelandic kennitala |
| "supplier endpoint required" | Missing supplier `endpointId` | Ensure Company Information."Registration No." is set |

### Tax Category Rules (BIS 3.0 BR-rules)
| Scenario | taxCategoryCode | taxPercent | taxAmount |
|----------|-----------------|------------|-----------|
| Standard 24% | S | 24 | Must be > 0 |
| Reduced 11% | AA | 11 | Must be > 0 |
| Zero-rated (taxable, rate=0) | Z | 0 | Must be 0 |
| Exempt (not subject to VAT) | E | 0 | Must be 0 |
| Reverse charge | AE | 0 | Must be 0 |
| Outside scope | O | 0 | Must be 0 |

**Critical rule:** If taxAmount=0 on a line, taxCategoryCode MUST be Z, E, AE, or O.
Using "S" or "AA" with zero tax triggers a 422 rejection.

### Validating a Specific Code
```
# Check if "HUR" is a valid unit code:
call DocumentExchange.BIS30.UnitCodes → search response for "HUR"

# Check if "0196" is a valid endpoint scheme:
call DocumentExchange.BIS30.ElectronicAddresses → search for "0196"
```

## Next Step
- If `completed: true` → use **StatusSync** to poll delivery status
- If `completed: false` → call **SubmitDocument** (params provided in `nextStepParams`)

