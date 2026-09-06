---
id: setup
title: "Setup reference"
sidebar_position: 3
---

## Overview

The Bifrost Setup provides centralized configuration for selecting implementation strategies for various message types. This document explains how to configure the setup table, select implementations through enums, and understand the interface-based architecture.

**Namespace:** `Origo.Bifrost`  
**Setup Table:** `Setup ori` (Table 10077901)  
**Setup Page:** `Setup ori` (Page 10077914)

---

## Setup Architecture

The Bifrost extension uses an **interface-based architecture** where:

1. **Interfaces** define contracts that implementations must follow
2. **Enums** provide selection options that implement specific interfaces
3. **Setup Table** stores the selected enum value for each feature area
4. **Message Type Implementations** retrieve the selected interface from setup

This design allows:
- **Extensibility**: Add new implementations by extending the enum
- **Flexibility**: Switch implementations without code changes
- **Separation of Concerns**: Business logic is independent of implementation selection

---

## Configuration Fields

### 1. Customer Credit Limit Type {#customer-credit-limit-type}

**Field:** `Customer Credit Limit Type` (Field 10)  
**Type:** Enum `Customer Credit Limit Type ori` (Enum 10077887)  
**Interface:** `Customer Credit Limit ori` (Interface)  
**Related Message Type:** `Customer.CreditLimit.Get`

**Purpose:** Determines how customer credit limit calculations are performed for the `Customer.CreditLimit.Get` message type.

**Available Values:**

| Value | Caption | Implementation | Description |
|-------|---------|----------------|-------------|
| 0 | Default | Default Credit Limit Impl ori | Standard Business Central credit limit calculation |

**Extensibility:**
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

### 2. Credit Limit Tolerance % {#credit-limit-tolerance}

**Field:** `Credit Limit Tolerance %` (Field 11)  
**Type:** Decimal  
**Range:** 0 to 100  
**Decimal Places:** 0:2

**Purpose:** Defines the tolerance percentage for credit limit exceedance checks. This value adds flexibility to credit limit enforcement by allowing a percentage buffer above the strict credit limit.

**How It Works:**

When checking if a customer has exceeded their credit limit:

1. **Base Calculation:**
   - Credit Limit (LCY) = Customer's configured credit limit
   - Used Credit = Balance (LCY) + Outstanding Amount (LCY)
   - Remaining Credit = Credit Limit - Used Credit

2. **With Tolerance:**
   - Tolerance Amount = Credit Limit × (Tolerance % ÷ 100)
   - Remaining Credit with Tolerance = Remaining Credit + Tolerance Amount
   - Is Exceeded = (Remaining Credit with Tolerance &lt; 0)

**Example:**

Given:
- Customer Credit Limit: 10,000.00 LCY
- Current Balance: 5,000.00 LCY
- Outstanding Orders: 5,500.00 LCY
- Tolerance %: 10.00%

Calculation:
- Used Credit: 5,000 + 5,500 = 10,500.00 LCY
- Remaining Credit: 10,000 - 10,500 = **-500.00 LCY** (exceeded by 500)
- Tolerance Amount: 10,000 × 0.10 = 1,000.00 LCY
- Remaining Credit with Tolerance: -500 + 1,000 = **500.00 LCY** (within tolerance)
- Is Credit Limit Exceeded: **false** (because remaining with tolerance > 0)

**Use Cases:**
- Allow small temporary overages for trusted customers
- Provide buffer for timing differences between orders and payments
- Reduce manual intervention for borderline cases
- Maintain customer satisfaction while managing risk

**Related Response Fields:**

The `Customer.CreditLimit.Get` message type returns:
- `remainingCredit`: Calculated without tolerance
- `tolerancePercent`: The configured tolerance percentage
- `remainingCreditWithTolerance`: Calculated with tolerance applied
- `isCreditLimitExceeded`: Boolean based on tolerance calculation

---

### 3. Item Calc. Avail.Type {#item-calc-availtype}

**Field:** `Item Calc. Avail.Type` (Field 12)  
**Type:** Enum `Item Calc. Avail.Type ori` (Enum 10077891)  
**Interface:** `Item Calc. Availability ori` (Interface)  
**Related Message Type:** `Item.Availability.Get`

**Purpose:** Determines how item availability is calculated for the `Item.Availability.Get` message type.

**Available Values:**

| Value | Caption | Implementation | Description |
|-------|---------|----------------|-------------|
| 0 | Physical Inventory | Physical Inventory Impl ori | Returns actual physical inventory quantity by location |
| 1 | Calculated Quantity | Calculated Quantity Impl ori | Returns calculated available quantity considering supply and demand |

**Implementation Details:**

#### Physical Inventory
- Returns actual `Inventory` field value from Item Ledger Entry
- Simple query-based calculation
- Fastest performance
- Use when:
  - You need current on-hand quantities
  - Future demand/supply doesn't matter
  - Simple inventory checks are sufficient

**Response Format:**
```json
{
  "status": "Success",
  "itemNo": "1000",
  "itemDescription": "Bicycle",
  "baseUnitOfMeasure": "PCS",
  "inventory": [
    { "locationCode": "BLUE", "inventory": 50 },
    { "locationCode": "RED", "inventory": 30 }
  ]
}
```

#### Calculated Quantity
- Calculates projected available quantity based on:
  - Current inventory
  - Reserved quantities (expected by requested date)
  - Gross requirements from sales orders, service orders, jobs, production, assembly (due by requested date)
  - Scheduled receipts from purchase orders, production, assembly, transfers (arriving by requested date)
  - Planned order receipts from requisition and planned production (due by requested date)
- Filters all supply and demand to the `requested-delivery-date` parameter
- More complex calculation with deeper integration
- Use when:
  - You need projected availability
  - Planning for future deliveries
  - Advanced inventory management is in place

**Response Format:**
```json
{
  "status": "Success",
  "itemNo": "1000",
  "itemDescription": "Bicycle",
  "baseUnitOfMeasure": "PCS",
  "requestedDeliveryDate": "2026-03-15",
  "availability": [
    {
      "locationCode": "BLUE",
      "inventory": 50,
      "reserved": 10,
      "grossRequirement": 20,
      "scheduledReceipt": 30,
      "plannedOrderReceipt": 15,
      "projectedAvailableBalance": 65
    }
  ]
}
```

**Extensibility:**
```al
enumextension 50101 "My Availability Type" extends "Item Calc. Avail.Type ori"
{
    value(50100; "Custom ATP")
    {
        Caption = 'Custom Available to Promise';
        Implementation = "Item Calc. Availability ori" = "My ATP Impl";
    }
}
```

---

### 4. Item Price Calc. Type {#item-price-calc-type}

**Field:** `Item Price Calc. Type` (Field 13)  
**Type:** Enum `Item Price Calc. Type ori` (Enum 10077897)  
**Interface:** `Item Price Calculation ori` (Interface)  
**Related Message Type:** `Item.Price.Get`

**Purpose:** Determines how item price information is calculated for the `Item.Price.Get` message type.

**Available Values:**

| Value | Caption | Implementation | Description |
|-------|---------|----------------|-------------|
| 0 | Default | Default Price Impl ori | Standard price list retrieval with customer-specific pricing support |

**Implementation Details:**

The Default Price Implementation provides:
- Retrieves active sales price list lines for items
- Supports customer-specific price lists and all-customers price lists
- Filters by:
  - Customer number (from request)
  - Requested delivery date (for date-effective pricing)
  - Item number
  - Variant code (optional)
  - Minimum quantity thresholds
- Returns prices in local currency (LCY)
- Includes VAT calculations (Excl. VAT and Incl. VAT)
- Supports quantity-based pricing tiers

**Price Selection Logic:**

1. **Customer-Specific Prices:**
   - If customer number is provided in the request
   - Finds price lists assigned to that specific customer
   - Filters by starting/ending dates against requested delivery date
   - Considers minimum quantity requirements

2. **All-Customers Prices:**
   - If no customer-specific prices found, or no customer specified
   - Finds price lists assigned to all customers
   - Same date and quantity filtering applies

3. **Item Card Prices:**
   - Returns Item card prices as fallback
   - Includes Unit Price and Unit Cost from Item table
   - Only if no price list lines are found

**Request Parameters:**

```json
{
  "itemNo": "1000",
  "customerNo": "C001",
  "requestedDeliveryDate": "2026-03-15",
  "quantity": 10,
  "variantCode": "BLUE"
}
```

**Response Format:**
```json
{
  "status": "Success",
  "itemNo": "1000",
  "itemDescription": "Bicycle",
  "baseUnitOfMeasure": "PCS",
  "customerNo": "C001",
  "requestedDeliveryDate": "2026-03-15",
  "priceListLines": [
    {
      "priceListCode": "RETAIL-2026",
      "priceListDescription": "Retail Price List 2026",
      "lineNo": 10000,
      "assetNo": "1000",
      "variantCode": "BLUE",
      "unitOfMeasureCode": "PCS",
      "qtyPerUnitOfMeasure": 1.0,
      "minimumQuantity": 10,
      "amountType": "Price",
      "unitPrice": 950.00,
      "unitPriceExclVAT": 950.00,
      "unitPriceInclVAT": 1178.00,
      "lineDiscountPct": 5.0,
      "allowInvoiceDisc": true,
      "allowLineDisc": true,
      "vatBusPostingGr": "DOMESTIC",
      "vatProdPostingGr": "STANDARD",
      "vatPct": 24.0,
      "priceType": "Customer",
      "status": "Active",
      "startingDate": "2026-01-01",
      "endingDate": "2026-12-31"
    }
  ]
}
```

**Extensibility:**
```al
enumextension 50102 "My Price Type" extends "Item Price Calc. Type ori"
{
    value(50100; "ERP Integration")
    {
        Caption = 'External ERP Pricing';
        Implementation = "Item Price Calculation ori" = "My ERP Price Impl";
    }
}
```

---

### 5. Default Language Code {#default-language-code}

**Field:** `Default Language Code` (Field 14)  
**Type:** Code[10]  
**Table Relation:** Language.Code  
**Related Message Types:** `Help.Tables.Get`, `Help.Fields.Get`, and all message types that return language-specific captions

**Purpose:** Specifies the default language used when executing cloud message tasks that return language-specific text (such as captions, descriptions, and field labels). This field provides a system-wide fallback when the `lcid` (Windows Language ID) is not specified in the Bifrost message.

**How It Works:**

The Bifrost extension supports language-specific responses through a two-tier approach:

1. **Primary: Message ori-Level lcid**
   - The `lcid` field can be specified at the Bifrost message level (not in the data payload)
   - This is a Bifrost extension attribute that follows the Bifrost v1.0 specification
   - When provided, it takes precedence over the Default Language Code

2. **Fallback: Default Language Code**
   - If `lcid` is not specified in the Bifrost message, the system uses the Default Language Code
   - The `GetDefaultLanguageId()` procedure retrieves the Windows Language ID from the configured Language record
   - If Default Language Code is not configured or the Language record is not found, defaults to **1033** (English - United States)

**Validation:**

The field includes validation to ensure data integrity:

```al
trigger OnValidate()
var
    Language: Record Language;
begin
    if "Default Language Code" <> '' then begin
        Language.Get("Default Language Code");
        Language.TestField("Windows Language ID");
    end;
end;
```

This ensures:
- The specified Language Code exists in the Language table
- The Language record has a valid Windows Language ID configured
- Language-specific captions can be retrieved successfully

**GetDefaultLanguageId() Procedure:**

The setup table provides a helper procedure to retrieve the language ID:

```al
procedure GetDefaultLanguageId(): Integer
var
    Language: Record Language;
begin
    GetRecordOnce();
    if "Default Language Code" = '' then
        exit(1033);  // English - United States
    
    if not Language.Get("Default Language Code") then
        exit(1033);
    
    exit(Language."Windows Language ID");
end;
```

**Common Language Codes:**

| Language Code | Windows Language ID | Description |
|---------------|---------------------|-------------|
| ENU | 1033 | English - United States |
| ISL | 1039 | Icelandic |
| DEU | 1031 | German |
| FRA | 1036 | French |
| ESP | 1034 | Spanish |
| SVE | 1053 | Swedish |
| NOR | 1044 | Norwegian (Bokmal) |
| DAN | 1030 | Danish |

**Bifrost API Integration:**

When queuing a message through the Queue API ori, you can specify the language at the message level:

```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "/myapp/inventory",
  "id": "A234-1234-1234",
  "time": "2026-03-15T10:00:00Z",
  "datacontenttype": "application/json",
  "lcid": 1039,
  "data": {}
}
```

If `lcid` is not specified, the Default Language Code from setup is used.

**Use Cases:**

1. **Multi-Language Deployments:**
   - Set Default Language Code to match your primary business language
   - Ensures consistent language across all message responses
   - Example: Icelandic company sets ISL (1039) as default

2. **API Simplification:**
   - Client applications don't need to specify `lcid` in every request
   - Reduces payload size and client-side complexity
   - System automatically uses the configured default

3. **Testing and Development:**
   - Set to ENU (1033) during development for English captions
   - Switch to production language during deployment
   - Test language-specific responses by temporarily changing the default

4. **Help Documentation Retrieval:**
   - `Help.Tables.Get` returns table captions in the configured language
   - `Help.Fields.Get` returns field captions in the configured language
   - Supports building language-aware client applications

**Example Scenario:**

**Configuration:**
- Default Language Code: `ISL`
- Windows Language ID for ISL: `1039`

**Message Request (without lcid):**
```json
{
  "type": "Help.Tables.Get",
  "data": {}
}
```

**Result:**
- System calls `GetDefaultLanguageId()` → returns 1039
- Captions returned in Icelandic

**Message Request (with lcid):**
```json
{
  "type": "Help.Tables.Get",
  "lcid": 1033,
  "data": {}
}
```

**Result:**
- System uses `lcid` from message → 1033
- Captions returned in English (overrides default)

**Related Message Types:**

All message types that return language-specific content respect the Default Language Code:

- **Help.Tables.Get** - Returns table captions and descriptions
- **Help.Fields.Get** - Returns field captions and option captions
- **Customer.CreditLimit.Get** - Returns translated status messages
- **Item.Availability.Get** - Returns item descriptions and location names
- **Item.Price.Get** - Returns price list and item descriptions

**Notes:**

- The Default Language Code appears as a **mandatory field** in the Bifrost Setup page (indicated with asterisk)
- The field tooltip explains: "Specifies the default language code used when executing cloud message tasks if not specified in the message request"
- Changing the Default Language Code affects all subsequent message processing immediately
- No restart or configuration reload is required

---

### 6. Customer Statement Type {#customer-statement-type}

**Field:** `Customer Statement Type` (Field 15)  
**Type:** Enum `Customer Statement Type ori` (Enum 10077888)  
**Interface:** `Customer Statement ori` (Interface)  
**Related Message Type:** `Customer.Statement.Pdf`

**Purpose:** Determines which implementation is used to generate customer statement PDFs for the `Customer.Statement.Pdf` message type. This field makes statement generation pluggable — custom implementations can generate statements from alternative sources without modifying the base code.

**Available Implementations:**

| Value | Name | Implementation | Description |
|-------|------|----------------|-------------|
| 0 | Standard Statement | Standard Statement Impl ori | Uses BC Report Selections for `C.Statement` to generate the PDF |

**Extending Customer Statement Type:**

To add a custom implementation, create an enum extension and a codeunit implementing the `Customer Statement` interface:

```al
enumextension 50100 "My Statement Type" extends "Customer Statement Type ori"
{
    value(50100; "Custom Statement")
    {
        Caption = 'Custom Statement';
        Implementation = "Customer Statement ori" = "My Custom Statement Impl";
    }
}
```

**Default Value:** `Standard Statement` (value 0) — uses the configured Report Selection for `C.Statement`.

---

### 7. ChangeLog Write Guard {#changelog-write-guard}

**Field:** `ChangeLog Write Guard` (Field 17)  
**Type:** Enum `ChangeLog Write Guard Type ori` (Enum 10077898)  
**Interface:** `ChangeLog Write Guard ori` (Interface)  
**Related Message Type:** `Data.Records.Set`, `ChangeLog.Field.Restore`

**Purpose:** Controls which fields `Data.Records.Set` may write to. When active, the guard checks every target field against the BC Change Log Setup before the write is executed.

**Available Values:**

| Value | Caption | Behaviour |
|-------|---------|-----------|
| 0 | Open | All fields may be written — same as pre-guard behaviour. Default. |
| 1 | Blocked | Only fields covered by Change Log Modification tracking may be written. All others are rejected. |
| 2 | Via force | Same as Blocked but the restriction can be bypassed by including `"force": true` in the request **and** holding the `Force Access ori` permission set. |

**Validation:**

Changing the guard to `Blocked` or `Via force` requires that the BC Change Log feature is active:

```al
trigger OnValidate()
begin
    if Rec."ChangeLog Write Guard" in [Blocked, "Via force"] then
        if not ChangeLogSetup.Get() or not ChangeLogSetup."Change Log Activated" then
            Error(ChangeLogNotEnabledErr);
end;
```

**Using `force` bypass (Via force mode only):**

```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"force\":true,\"data\":[{\"id\":\"...\",\"fields\":{\"Name\":\"New Name\"}}]}"
}
```

The `force` key is a top-level boolean inside the `data` JSON (alongside the `data` array). Without the `Force Access ori` permission set the request is rejected even with `force: true`.

**Checking field coverage:**

Before writing, use `ChangeLog.Field.Enabled` to verify that a field is covered:

```json
{ "type": "ChangeLog.Field.Enabled", "data": "{\"tableName\":\"Customer\",\"fieldNo\":2}" }
```

If `fieldCovered` is `false` and the guard is `Blocked` or `Via force`, the write will be rejected unless `force: true` is used (Via force only).

**Extensibility:**

```al
enumextension 50103 "My Guard Type" extends "ChangeLog Write Guard Type"
{
    value(50100; "Custom Guard")
    {
        Caption = 'Custom Guard';
        Implementation = "ChangeLog Write Guard" = "My Custom Guard Impl";
    }
}
```

---

### 8. Export Company Name Type {#export-company-name-type}

**Field:** `Export Company Name Type` (Field 18)  
**Type:** Enum `Company Name Type ori` (Enum 10077886)  
**Interface:** `Company Name ori`  
**Related Message Types:** `CSV.Records.Get`, `CSV.DeletedRecords.Get`

**Purpose:** Selects which company name is written to the `$Company` column of CSV exports. The setup field controls a single, system-wide choice that both CSV exporters resolve once per request (so every row in a single export shares the same value).

**Available Values:**

| Value | Caption | Implementation | Behaviour |
|-------|---------|----------------|-----------|
| 0 | Company Name | `Default Company Name Impl ori` (10077888) | Returns `CompanyName()` (the technical `Company.Name`). Default. Stable across renames of the display name. |
| 1 | Company Display Name | `Display Company Name Impl ori` (10077889) | Returns `Company."Display Name"`. When the display name is blank, falls back to `CompanyName()` so the `$Company` column is never empty. |

**When to use each value:**

- **Company Name** — downstream systems that key on company identity (data lake partitioning, Open Mirroring landing zones, bc2adls). Display-name renames must not change the partition key.
- **Company Display Name** — CSV consumers that are human-readable (operational reports, ad-hoc analytics). Display name is friendlier and matches what users see in BC.

**Resolution:**

```al
var
    BifrostSetup: Record "Setup ori";
    ExportCompanyName: Text[250];
begin
    ExportCompanyName := BifrostSetup.GetExportCompanyName();
end;
```

Both CSV implementations call `GetExportCompanyName()` once per request and reuse the value for every row written to the `$Company` column.

**Extensibility:**

```al
enumextension 50104 "My Company Name Type" extends "Company Name Type ori"
{
    value(50100; "Legal Name")
    {
        Caption = 'Legal Name';
        Implementation = "Company Name ori" = "My Legal Name Impl";
    }
}

codeunit 50104 "My Legal Name Impl" implements "Company Name ori"
{
    procedure GetCompanyName(): Text[250]
    var
        Company: Record Company;
    begin
        Company.SetLoadFields("Legal Name");
        if Company.Get(CompanyName()) and (Company."Legal Name" <> '') then
            exit(CopyStr(Company."Legal Name", 1, 250));
        exit(CopyStr(CompanyName(), 1, 250));
    end;
}
```

---

## Setup Procedures

### GetRecordOnce()

**Purpose:** Ensures the setup record is loaded only once per transaction.

**Behavior:**
- Checks if record has already been read in this session
- If not read, attempts to retrieve the record
- If record doesn't exist, creates it with default values
- Sets the `RecordHasBeenRead` flag to prevent repeated reads

**Usage:**
```al
BifrostSetup.GetRecordOnce();
```

---

### InsertIfNotExists()

**Purpose:** Creates the setup record if it doesn't exist.

**Behavior:**
- Checks if the record exists
- If not, initializes and inserts a new record with default values
- Does not set the `RecordHasBeenRead` flag

**Usage:**
```al
BifrostSetup.InsertIfNotExists();
```

**Note:** This is typically called during installation.

---

### GetCustomerCreditLimitInterface()

**Purpose:** Retrieves the selected Customer Credit Limit implementation.

**Returns:** Interface `Customer Credit Limit ori`

**Behavior:**
1. Loads only the `Customer Credit Limit Type ori` field (optimized)
2. Calls `GetRecordOnce()` to ensure record exists
3. Returns the enum value as an interface

**Usage:**
```al
var
    CreditLimitInterface: Interface "Customer Credit Limit ori";
    BifrostSetup: Record "Setup ori";
begin
    CreditLimitInterface := BifrostSetup.GetCustomerCreditLimitInterface();
    CreditLimitInterface.CheckCreditLimit(Argument);
end;
```

**Implementation in Message Type:**
```al
internal procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
var
    BifrostSetup: Record "Setup ori";
    CreditLimitInterface: Interface "Customer Credit Limit ori";
begin
    // Get the configured interface implementation
    CreditLimitInterface := BifrostSetup.GetCustomerCreditLimitInterface();
    
    // Execute using the selected implementation
    CreditLimitInterface.CheckCreditLimit(Argument);
end;
```

---

### GetItemCalculateAvailabilityInterface()

**Purpose:** Retrieves the selected Item Calculate Availability implementation.

**Returns:** Interface `Item Calc. Availability ori`

**Behavior:**
1. Loads only the `Item Calc. Avail.Type ori` field (optimized)
2. Calls `GetRecordOnce()` to ensure record exists
3. Returns the enum value as an interface

**Usage:**
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

**Purpose:** Retrieves the selected Item Price Calculation ori implementation.

**Returns:** Interface `Item Price Calculation ori`

**Behavior:**
1. Loads only the `Item Price Calc. Type ori` field (optimized)
2. Calls `GetRecordOnce()` to ensure record exists
3. Returns the enum value as an interface

**Usage:**
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

**Purpose:** Retrieves the selected Customer Statement implementation.

**Returns:** Interface `Customer Statement`

**Behavior:**
1. Loads only the `Customer Statement Type` field (optimized)
2. Calls `GetRecordOnce()` to ensure record exists
3. Returns the enum value as an interface

**Usage:**
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

**Purpose:** Retrieves the selected Company Name ori implementation.

**Returns:** Interface `Company Name ori`

**Behavior:**
1. Loads only the `Export Company Name Type` field (optimized)
2. Calls `GetRecordOnce()` to ensure the setup record exists
3. Returns the enum value as an interface

**Usage:**
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

**Purpose:** Convenience wrapper that resolves the configured implementation and returns the company name for the `$Company` column.

**Returns:** `Text[250]`

**Behavior:**
1. Calls `GetCompanyNameInterface()` to obtain the configured implementation
2. Invokes `GetCompanyName()` on it
3. Returns the resulting text (never blank — the Display Name implementation falls back to `CompanyName()`)

**Usage:**
```al
var
    BifrostSetup: Record "Setup ori";
    ExportCompanyName: Text[250];
begin
    ExportCompanyName := BifrostSetup.GetExportCompanyName();
end;
```

Callers should resolve this **once per request** and reuse the value for every row in a single export.

---

## Interface Architecture

### Interface Definition Pattern

Each feature area defines an interface that all implementations must follow:

**Example: Item Calc. Availability ori Interface**
```al
interface "Item Calc. Availability ori"
{
    /// <summary>
    /// Calculates item availability based on the implementation strategy.
    /// </summary>
    /// <param name="Argument">Message argument containing request/response data</param>
    procedure CalculateAvailability(var Argument: Record "Message Argument ori")
}
```

### Enum Implementation Pattern

Enums implement the interface and specify which codeunit provides the implementation:

**Example: Item Calc. Avail.Type ori Enum**
```al
enum 10077891 "Item Calc. Avail.Type ori" implements "Item Calc. Availability ori"
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

### Implementation Codeunit Pattern

Implementation codeunits implement the interface:

**Example: Physical Inventory Implementation**
```al
codeunit 10077900 "Physical Inventory Impl ori" implements "Item Calc. Availability ori"
{
    procedure CalculateAvailability(var Argument: Record "Message Argument ori")
    var
        Item: Record Item;
        RequestJson: JsonObject;
        ItemNo: Code[20];
    begin
        // Parse request
        RequestJson := Argument.GetRequestJson();
        ItemNo := GetItemNoFromRequest(RequestJson, Argument);
        
        // Execute business logic
        Item.Get(ItemNo);
        Item.CalcFields(Inventory);
        
        // Build response
        BuildInventoryResponse(Item, Argument);
    end;
}
```

---

## Message Type Integration

Message type implementations use the setup to retrieve the correct interface:

### Pattern: Message Type Implementation

```al
codeunit 10077908 "Item Availability Get Impl ori" implements "Msg Interface ori"
{
    internal procedure ExecuteBifrostTask(var Argument: Record "Message Argument ori")
    var
        BifrostSetup: Record "Setup ori";
        AvailabilityInterface: Interface "Item Calc. Availability ori";
    begin
        // Validate specification version
        if Argument."Message Version ori" <> Argument."Message Version ori"::"1.0" then
            Error(UnsupportedVersionErr, Argument."Message Version ori");

        // Get the selected implementation from setup
        AvailabilityInterface := BifrostSetup.GetItemCalculateAvailabilityInterface();

        // Execute using the selected implementation
        AvailabilityInterface.CalculateAvailability(Argument);
    end;
}
```

This pattern ensures:
- Message type implementations are independent of concrete implementations
- Switching implementations only requires changing the setup
- New implementations can be added without modifying message types

---

## Extending the Setup

### Adding a New Implementation

To add a new implementation:

1. **Create the Interface (if new feature area):**
```al
interface "My Custom Feature"
{
    procedure ProcessRequest(var Argument: Record "Message Argument ori")
}
```

2. **Create the Enum:**
```al
enum 50100 "My Custom Feature Type" implements "My Custom Feature"
{
    Extensible = true;
    
    value(0; "Default")
    {
        Caption = 'Default';
        Implementation = "My Custom Feature" = "My Default Impl";
    }
}
```

3. **Create the Implementation:**
```al
codeunit 50100 "My Default Impl" implements "My Custom Feature"
{
    procedure ProcessRequest(var Argument: Record "Message Argument ori")
    begin
        // Implementation logic
    end;
}
```

4. **Extend the Setup Table:**
```al
tableextension 50100 "My Setup Extension" extends "Setup ori"
{
    fields
    {
        field(50100; "My Custom Feature Type"; Enum "My Custom Feature Type")
        {
            Caption = 'My Custom Feature Type';
            DataClassification = CustomerContent;
        }
    }
}
```

5. **Add Setup Procedure:**
```al
tableextension 50100 "My Setup Extension" extends "Setup ori"
{
    procedure GetMyCustomFeatureInterface(): Interface "My Custom Feature"
    begin
        Rec.SetLoadFields("My Custom Feature Type");
        Rec.GetRecordOnce();
        exit("My Custom Feature Type");
    end;
}
```

### Extending an Existing Enum

To add a new implementation to an existing feature:

```al
enumextension 50101 "My Price Extension" extends "Item Price Calc. Type ori"
{
    value(50100; "External API")
    {
        Caption = 'External API Pricing';
        Implementation = "Item Price Calculation ori" = "My API Price Impl";
    }
}

codeunit 50101 "My API Price Impl" implements "Item Price Calculation ori"
{
    procedure CalculateItemPrice(var Argument: Record "Message Argument ori")
    begin
        // Call external API for pricing
        // Build response in standard format
    end;
}
```

---

## Best Practices

### 1. Interface Design {#interface-design}
- Keep interfaces simple and focused on a single responsibility
- Use the `Message Argument ori` table for all data exchange
- Document expected request and response formats

### 2. Implementation Development {#implementation-development}
- Always implement all interface procedures
- Handle errors gracefully and return meaningful error messages
- Use the `SetResponseJson()` or `SetResponseText()` methods for responses
- Follow the standard response format with `status` field

### 3. Enum Configuration {#enum-configuration}
- Set a sensible `DefaultImplementation` for new enums
- Use descriptive captions for enum values
- Mark enums as `Extensible = true` to allow partners to add implementations

### 4. Setup Field Additions {#setup-field-additions}
- Use appropriate field numbers (starting from partner range if applicable)
- Set proper `DataClassification` (typically `CustomerContent`)
- Add tooltips and captions in multiple languages
- Create corresponding setup procedures following the existing pattern

### 5. Performance Optimization {#performance-optimization}
- Use `SetLoadFields()` to load only needed fields
- Call `GetRecordOnce()` to avoid repeated database reads
- Cache interface instances when calling multiple times

### 6. Testing {#testing}
- Test with both default and custom implementations
- Verify interface switching works correctly
- Test extensibility by adding custom enum values
- Validate error handling and edge cases

---

## Bifrost Integration Log

**Table:** `Integration ori` (Table 10077891)  
**Page:** `Integration ori` (Page 10077895)  
**Access:** Bifrost Setup → Messages → Bifrost Integration

### Purpose

The Bifrost Integration log is an operational event log. Each record identifies:
- **Source**: The external system or application that originated the bifrost
- **Table Id**: The Business Central table involved in the integration event
- **Table Name**: Resolved table name (FlowField lookup from AllObj)
- **Date & Time**: The exact date and time of the event
- **Reversed**: Whether the record was created by mistake and subsequently reversed

The table uses a composite primary key of `Source + Table Id + Date & Time`, ensuring uniqueness per source-table-timestamp combination.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `Source` | Text[250] | External system or application identifier. Required (NotBlank). |
| `Table Id` | Integer | ID of the Business Central table involved. |
| `Table Name` | Text[30] | Computed name of the table (FlowField). Read-only. |
| `Date & Time` | DateTime | Timestamp of the integration event. Required (NotBlank). |
| `Reversed` | Boolean | Marks a record as reversed (created by mistake). |

### API Access

Records in this table are read and written via the standard data message types:

- **Data.Records.Get** — retrieve integration log entries:
  ```json
  { "tableName": "Integration ori" }
  ```
- **Data.Records.Set** — insert or update integration log entries
- **CSV.Records.Get** — export the full log as a CSV file for Open Mirroring

### Retention Policy

The Bifrost Integration table is registered with Business Central's retention policy framework. Administrators can configure automatic cleanup of old integration records via **Administration → Data Management → Retention Policy**.

---

## Delete Log ori

### Delete Setup

**Table:** `Delete Setup ori` (Table 10077887)
**Page:** `Delete Setup ori` (Page 10077886)
**Access:** Search → Delete Setup ori

The Delete Setup table controls which Business Central tables have their deletions captured to the delete log. Each row registers one table. When a record in that table is deleted, the extension logs the deletion automatically.

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `Table Id` | Integer | The table to monitor. Required (NotBlank). |
| `Table Name` | Text[250] | Resolved table caption (FlowField, read-only). |
| `Store Record` | Boolean | When enabled, a full JSON snapshot of the record is saved at deletion time. |

#### Caching Behaviour

Delete Setup records are cached in a SingleInstance codeunit (`Delete Log Mgt ori`, 10077892) for performance. Any insert, modify, or delete on the setup table automatically resets the cache.

### Delete Log

**Table:** `Delete Log ori` (Table 10077886)
**Page:** `Delete Log ori` (Page 10077885)
**Access:** Search → Delete Log ori

The Delete Log is a read-only audit trail. One entry is created per deleted record from any monitored table.

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `Entry No.` | Integer | Auto-increment primary key. |
| `Table Id` | Integer | ID of the table the deleted record belonged to. |
| `Table Name` | Text[250] | Resolved table caption (FlowField, read-only). |
| `Record System Id` | Guid | The SystemId of the deleted record. |
| `Json Data` | Blob | Full JSON snapshot (only populated when Delete Setup has `Store Record` enabled). |
| `Deleted At` | DateTime | Timestamp of the deletion. |
| `User ID` | Code[50] | The user who triggered the deletion. |

#### Page Actions

- **Export JSON** — Downloads the stored JSON snapshot as `{TableName}-{SystemId}.json`. Only enabled when `Json Data` has a value.

#### Retention Policy

The Delete Log table is registered with Business Central's retention policy framework. Administrators can configure automatic cleanup via **Administration → Data Management → Retention Policy**, using the `Deleted At` field as the date reference.

#### API Access

Delete Log records can be retrieved via the standard data message types:

- **Data.Records.Get** — `{ "tableName": "Delete Log ori" }`
- **CSV.Records.Get** — export the full log as CSV

---

## User Setup ori

**Table:** `User Setup ori` (Table 10077909)
**Page:** `User Setup List ori` (Page 10077920)
**Card Page:** `User Setup Editor ori` (Page 10077918)
**Management Codeunit:** `User Setup Mgt ori` (Codeunit 10078245)
**Access:** Search → User Setup ori (Usage Category: Administration)

### Purpose

Per-user configuration for the Bifrost extension. Each record stores a system prompt and optional linked-record overrides that are included in the `Help.WhoAmI.Get` response. The system prompt enables external AI systems to customise their behaviour per user. The optional link fields (resource, salesperson, employee, G/L account, customer, vendor, contact) override the default lookup logic so administrators can explicitly control which records appear in a user's profile.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `User Security ID` | Guid | Primary key. Links to the `User` table. |
| `User Name` | Code[50] | Display name (FlowField from `User`). |
| `System Prompt` | Blob | The prompt text stored as UTF-8. |
| `G/L Account No.` | Code[20] | Optional. Links to a G/L Account for the `dueFromToOwner` section in `Help.WhoAmI.Get`. |
| `Employee No.` | Code[20] | Optional. Overrides the `employee` and `manager` sections in `Help.WhoAmI.Get` (skips Resource→Employee chain lookup). |
| `Customer No.` | Code[20] | Optional. Links to a Customer for the `customer` section in `Help.WhoAmI.Get`. |
| `Vendor No.` | Code[20] | Optional. Links to a Vendor for the `vendor` section in `Help.WhoAmI.Get`. |
| `Resource No.` | Code[20] | Optional. Overrides the `resource` section in `Help.WhoAmI.Get` (skips Time Sheet Owner lookup). |
| `Salesperson Code` | Code[20] | Optional. Overrides the `salesperson` section in `Help.WhoAmI.Get` (skips User Setup lookup). |
| `Contact No.` | Code[20] | Optional. Links to a Contact for the `contact` section in `Help.WhoAmI.Get`. |
| `Location Code` | Code[10] | Optional. Reserved for future use. |

### Security Model

The page uses a layered security approach:

1. **Auto-provisioning:** On page open, `EnsureCurrentUserExists()` creates a record for the current user if one does not exist (uses InherentPermissions for RI access).
2. **Self-service editing:** Users without full table permissions can only see and edit their own prompt (FilterGroup(2) applied). The `UpdateOwnPrompt()` procedure uses InherentPermissions for RM access.
3. **Admin editing:** Users with full table data permissions (RMID) can see and edit all users' prompts.

### Editor Behaviour

The User Setup Editor page provides a multi-line rich content field. On save, `<div>` tags are stripped via Regex before persisting to the blob.

### Programmatic Access

```al
var
    BifrostUserSetupMgt: Codeunit "User Setup Mgt ori";
begin
    BifrostUserSetupMgt.EnsureCurrentUserExists();
    BifrostUserSetupMgt.UpdateOwnPrompt('You are a helpful assistant.');
end;
```

---

## Permission Sets

The Bifrost extension ships several permission sets that gate access to specific features.

### BIFROST ApprAdm ori

**Permission Set ID:** 10077889  
**Name:** `BIFROST ApprAdm ori`  
**Assignable:** Yes

**Purpose:** Controls which users may send documents to approval via the `Document.Approval.Send` message type. A user who does not hold this permission set receives an error response when calling `Document.Approval.Send`.

**Error when missing:**

```
User <UserSecurityId> does not have permissions to send documents to approval via Bifrost.
```

**How it works:** The permission set grants write access to the gate table `Approval Access ori` (10077895). The implementation checks `WritePermission()` on that table before processing the request — no records are stored in the table.

**Assignment:** Assign via the standard BC **Permission Sets** page or via user group.

### Force Access ori

**Purpose:** Required to bypass the ChangeLog Write Guard when using `"force": true` in `Data.Records.Set` requests with the guard set to **Via force**. See [ChangeLog Write Guard](#changelog-write-guard) for details.

### Posting Gates (Bifrost G/L / Item / FA / Job / Resource / Warehouse Posting)

Every `*.Post` and `*.Reverse` message type that writes ledger entries is gated by a per-domain permission set. A user who does not hold the matching set receives an error response without any side effects:

```
Posting denied: missing '<permission set name>' permission set (BIFROST GL Post ori, BIFROST ItemPost ori, BIFROST FA Post ori, BIFROST Job Post ori, BIFROST Res Post ori or BIFROST WhsePost ori).
```

The six permission sets are independent and **not bundled into `BIFROST Read ori` or `BIFROST Full ori`** — they must be granted explicitly. Each grants RIMD on an empty stub table (10077903–10077908) that BC's security kernel uses for the `WritePermission()` check; no records are ever stored.

| Permission Set | ID | Gate Table | Gated message types |
|---|---|---|---|
| `BIFROST GL Post ori` | 10077895 | `G/L Posting ori` (10077904) | `Finance.GeneralJournal.Post`, `Finance.GeneralJournal.ReverseRegister`, `Finance.GeneralJournal.ReverseTransaction`, `Finance.BankReconciliation.Post`, `Finance.VAT.CalcAndPostSettlement`, `Customer.Application.Post`, `Customer.Application.Reverse`, `Vendor.Application.Post`, `Vendor.Application.Reverse`, `Sales.Document.Post`, `Purchase.Document.Post` |
| `BIFROST ItemPost ori` | 10077896 | `Item Posting ori` (10077905) | `Inventory.ItemJournal.Post`, `Inventory.TransferOrder.Post`, `Inventory.AssemblyOrder.Post` |
| `BIFROST FA Post ori` | 10077892 | `FA Posting ori` (10077903) | `FixedAssets.FAJournal.Post` |
| `BIFROST Job Post ori` | 10077897 | `Job Posting ori` (10077906) | `Projects.ProjectJournal.Post` |
| `BIFROST Res Post ori` | 10077899 | `Resource Posting ori` (10077907) | `Resources.ResourceJournal.Post` |
| `BIFROST WhsePost ori` | 10077900 | `Warehouse Posting ori` (10077908) | `Warehouse.Shipment.Post` (always; additionally requires `BIFROST GL Post ori` when `invoice = true`); `Warehouse.Pick.Register` (always); `Warehouse.Putaway.Register` (always) |

**Note:** `Sales.Document.Post` and `Purchase.Document.Post` are gated to **G/L only** even though they may produce item and other ledger entries downstream. The gate represents the user's intent to trigger posting, not the entries that BC ultimately writes. `Warehouse.Shipment.Post` with `invoice = true` is the only operation that requires two permission sets simultaneously.

The check lives in codeunit `Posting Gate ori` (10078243). To extend the model, add a new value to enum `Posting Type ori` (10077899) and a matching gate table + permission set.

---

## Related Documentation

- **API_Reference.md**: Complete API endpoint documentation and message types
- **Data_Message_Types.md**: Data.Records.Get, Data.Records.Set, CSV.Records.Get
- **Approval_Message_Types.md**: Document approval workflows and permission requirements
- **Msg Interface ori**: Main interface for message type implementations
- **Setup ori Page**: User interface for configuration

---

## Support

For questions regarding setup configuration or implementation development, please contact Origo support.
