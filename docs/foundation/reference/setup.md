---
id: setup
title: "Setup reference"
sidebar_position: 3
---

## Overview

The Bifrost Setup provides centralized configuration for selecting implementation strategies for various Foundation operations. This document explains how to configure the setup table, select implementations through enums, and understand the interface-based architecture.

**Namespace:** `Origo.Bifrost`  
**Setup Table:** `Setup ori`  
**Setup Page:** `Setup ori` (**Bifrost Setup**)

---

## Setup Architecture

The Bifrost extension uses an **interface-based architecture** where:

1. **Interfaces** define contracts that implementations must follow
2. **Enums** provide selection options that implement specific interfaces
3. **Setup Table** stores the selected enum value for each feature area
4. **Foundation operations** retrieve the selected interface from setup

This design allows:
- **Extensibility**: Add new implementations by extending the enum
- **Flexibility**: Switch implementations without code changes
- **Separation of Concerns**: Business logic is independent of implementation selection

---

## Configuration Fields

### 1. Customer Credit Limit Type {#customer-credit-limit-type}

**Field:** `Customer Credit Limit Type`  
**Type:** Enum `Customer Credit Limit Type ori`  
**Interface:** `Customer Credit Limit ori` (Interface)

**Purpose:** Determines how customer credit limit calculations are performed when an assistant or integration checks a customer's credit.

**Available Values:**

| Value | Caption | Description |
|-------|---------|-------------|
| 0 | Default | Standard Business Central credit limit calculation |

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

**Field:** `Credit Limit Tolerance %`  
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

---

### 3. Item Price Calc. Type {#item-price-calc-type}

**Field:** `Item Price Calc. Type`  
**Type:** Enum `Item Price Calc. Type ori`  
**Interface:** `Item Price Calculation ori` (Interface)

**Purpose:** Determines how item price information is calculated when an assistant or integration asks for an item's price.

**Available Values:**

| Value | Caption | Description |
|-------|---------|-------------|
| 0 | Default | Standard price list retrieval with customer-specific pricing support |

**Implementation Details:**

The Default Price Implementation provides:
- Retrieves active sales price list lines for items
- Supports customer-specific price lists and all-customers price lists
- Filters by:
  - Customer number
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

### 4. Default Language Code {#default-language-code}

**Field:** `Default Language Code`  
**Type:** Code[10]  
**Table Relation:** Language.Code  
**Applies to:** all message types that return language-specific captions

**Purpose:** Specifies the default language used when executing cloud message tasks that return language-specific text (such as captions, descriptions, and field labels). This field provides a system-wide fallback when the `lcid` (Windows Language ID) is not specified in the Bifrost message.

**How It Works:**

The Bifrost extension supports language-specific responses through a two-tier approach:

1. **Primary: message-level lcid**
   - The `lcid` field can be specified at the Bifrost message level (not in the data payload)
   - This is a Bifrost extension attribute that follows the Bifrost v1.0 specification
   - When provided, it takes precedence over the Default Language Code

2. **Fallback: Default Language Code**
   - If `lcid` is not specified in the Bifrost message, the system uses the Default Language Code
   - Foundation reads the Windows Language ID from the configured Language record
   - If Default Language Code is not configured or the Language record is not found, defaults to **1033** (English - United States)

**Validation:**

The field is validated when it is set.

This ensures:
- The specified Language Code exists in the Language table
- The Language record has a valid Windows Language ID configured
- Language-specific captions can be retrieved successfully

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
  "type": "Help.MessageTypes.Get",
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
   - `Help.MessageTypes.Get` and `Help.Implementation.Get` return their descriptions in the configured language
   - Supports building language-aware client applications

**Example Scenario:**

**Configuration:**
- Default Language Code: `ISL`
- Windows Language ID for ISL: `1039`

**Message Request (without lcid):**
```json
{
  "type": "Help.MessageTypes.Get",
  "data": {}
}
```

**Result:**
- Foundation resolves the default language → 1039
- Captions returned in Icelandic

**Message Request (with lcid):**
```json
{
  "type": "Help.MessageTypes.Get",
  "lcid": 1033,
  "data": {}
}
```

**Result:**
- System uses `lcid` from message → 1033
- Captions returned in English (overrides default)

All message types that return language-specific content respect the Default Language Code.

**Notes:**

- The Default Language Code appears as a **mandatory field** in the Bifrost Setup page (indicated with asterisk)
- The field tooltip explains: "Specifies the default language code used when executing cloud message tasks if not specified in the message request"
- Changing the Default Language Code affects all subsequent message processing immediately
- No restart or configuration reload is required

---

### 5. Customer Statement Type {#customer-statement-type}

**Field:** `Customer Statement Type`  
**Type:** Enum `Customer Statement Type ori`  
**Interface:** `Customer Statement ori` (Interface)

**Purpose:** Determines which implementation is used to generate customer statement PDFs when an assistant or integration asks for a customer statement. This field makes statement generation pluggable — custom implementations can generate statements from alternative sources without modifying the base code.

**Available Implementations:**

| Value | Name | Description |
|-------|------|-------------|
| 0 | Standard Statement | Uses BC Report Selections for `C.Statement` to generate the PDF |

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

### 6. ChangeLog Write Guard {#changelog-write-guard}

**Field:** `ChangeLog Write Guard`  
**Type:** Enum `ChangeLog Write Guard Type ori`  
**Interface:** `ChangeLog Write Guard ori` (Interface)  
**Applies to:** Bifröst's general record write and the restore of a field value from the change log

**Purpose:** Controls which fields the general record write may write to. When active, the guard checks every target field against the BC Change Log Setup before the write is executed.

**Available Values:**

| Value | Caption | Behaviour |
|-------|---------|-----------|
| 0 | Open | All fields may be written — same as pre-guard behaviour. |
| 1 | Blocked | Only fields covered by Change Log Modification tracking may be written. All others are rejected. Default. |
| 2 | Via force | Same as Blocked but the restriction can be bypassed by sending `"force": true` with the write **and** holding the `BIFROST Force ori` permission set. |

**Validation:**

Changing the guard to `Blocked` or `Via force` requires that the BC Change Log feature is active.

**Using the `force` bypass (Via force mode only):** the caller sends `"force": true` with the
write. Without the `BIFROST Force ori` permission set the write is rejected even with
`force: true`.

**Checking field coverage:** an assistant can check beforehand whether a field is covered by the
change log. If it is not covered and the guard is `Blocked` or `Via force`, the write will be
rejected unless `force: true` is used (Via force only).

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

### 7. Export Company Name Type {#export-company-name-type}

**Field:** `Export Company Name Type`  
**Type:** Enum `Company Name Type ori`  
**Interface:** `Company Name ori`  
**Applies to:** CSV exports of records and of deleted records

**Purpose:** Selects which company name is written to the `$Company` column of CSV exports. The setup field controls a single, system-wide choice that both CSV exporters resolve once per request (so every row in a single export shares the same value).

**Available Values:**

| Value | Caption | Behaviour |
|-------|---------|-----------|
| 0 | Company Name | Returns `CompanyName()` (the technical `Company.Name`). Default. Stable across renames of the display name. |
| 1 | Company Display Name | Returns `Company."Display Name"`. When the display name is blank, falls back to `CompanyName()` so the `$Company` column is never empty. |

**When to use each value:**

- **Company Name** — downstream systems that key on company identity (data lake partitioning, Open Mirroring landing zones, bc2adls). Display-name renames must not change the partition key.
- **Company Display Name** — CSV consumers that are human-readable (operational reports, ad-hoc analytics). Display name is friendlier and matches what users see in BC.

**Resolution:** a CSV export resolves the company name once per request and reuses the value for
every row written to the `$Company` column.

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

**Table:** `Integration ori`  
**Page:** **Bifrost Integration**  
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

Records in this table can be read and written through Bifröst's general record read and write,
and exported as a CSV file for Open Mirroring.

### Retention Policy

The Bifrost Integration table is registered with Business Central's retention policy framework. Administrators can configure automatic cleanup of old integration records via **Administration → Data Management → Retention Policy**.

---

## Delete Log

### Delete Setup

**Table:** `Delete Setup ori`  
**Page:** **Bifrost Delete Setup**  
**Access:** Search → Bifrost Delete Setup

The Delete Setup table controls which Business Central tables have their deletions captured to the delete log. Each row registers one table. When a record in that table is deleted, the extension logs the deletion automatically.

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `Table Id` | Integer | The table to monitor. Required (NotBlank). |
| `Table Name` | Text[250] | Resolved table caption (FlowField, read-only). |
| `Store Record` | Boolean | When enabled, a full JSON snapshot of the record is saved at deletion time. |

#### Caching Behaviour

Delete Setup records are cached for performance. Any insert, modify, or delete on the setup table automatically resets the cache.

### Delete Log

**Table:** `Delete Log ori`  
**Page:** **Bifrost Delete Log**  
**Access:** Search → Bifrost Delete Log

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

Delete Log records can be read through Bifröst's general record read and exported as CSV.

---

## User Setup

**Table:** `User Setup ori`  
**Page:** **Bifrost User Setup**  
**Card Page:** **User Setup Editor**  
**Access:** Search → Bifrost User Setup (Usage Category: Administration)

### Purpose

Per-user configuration for the Bifrost extension. Each record stores a system prompt and optional linked-record overrides that are included in the user profile an assistant reads about the caller. The system prompt enables external AI systems to customise their behaviour per user. The optional link fields (resource, salesperson, employee, G/L account, customer, vendor, contact) override the default lookup logic so administrators can explicitly control which records appear in a user's profile.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `User Security ID` | Guid | Primary key. Links to the `User` table. |
| `User Name` | Code[50] | Display name (FlowField from `User`). |
| `System Prompt` | Blob | The prompt text stored as UTF-8. |
| `G/L Account No.` | Code[20] | Optional. Links to a G/L Account for the `dueFromToOwner` section of the user profile. |
| `Employee No.` | Code[20] | Optional. Overrides the `employee` and `manager` sections of the user profile (skips Resource→Employee chain lookup). |
| `Customer No.` | Code[20] | Optional. Links to a Customer for the `customer` section of the user profile. |
| `Vendor No.` | Code[20] | Optional. Links to a Vendor for the `vendor` section of the user profile. |
| `Resource No.` | Code[20] | Optional. Overrides the `resource` section of the user profile (skips Time Sheet Owner lookup). |
| `Salesperson Code` | Code[20] | Optional. Overrides the `salesperson` section of the user profile (skips User Setup lookup). |
| `Contact No.` | Code[20] | Optional. Links to a Contact for the `contact` section of the user profile. |
| `Location Code` | Code[10] | Optional. Reserved for future use. |

### Security Model

The page uses a layered security approach:

1. **Auto-provisioning:** On page open, a record is created for the current user if one does not exist.
2. **Self-service editing:** Users without full table permissions can only see and edit their own prompt.
3. **Admin editing:** Users with full table data permissions (RMID) can see and edit all users' prompts.

### Editor Behaviour

The User Setup Editor page provides a multi-line rich content field. On save, `<div>` tags are stripped before the prompt is stored.

---

## Permission Sets

The Bifrost extension ships several permission sets that gate access to specific features.

### BIFROST ApprAdm ori

**Name:** `BIFROST ApprAdm ori`  
**Assignable:** Yes

**Purpose:** Controls which users may send documents for approval through Bifröst. A user who does not hold this permission set receives an error response when an assistant or integration tries to send a document for approval.

**Error when missing:**

```
User <UserSecurityId> does not have permissions to send documents to approval via Bifrost.
```

**Assignment:** Assign via the standard BC **Permission Sets** page or via user group.

### BIFROST Force ori

**Purpose:** Required to bypass the ChangeLog Write Guard when using `"force": true` in general record writes with the guard set to **Via force**. See [ChangeLog Write Guard](#changelog-write-guard) for details.

### Posting Gates (Bifrost G/L / Item / FA / Job / Resource / Warehouse Posting)

Every message type that posts or reverses ledger entries is gated by a per-domain permission set. A user who does not hold the matching set receives an error response without any side effects:

```
Posting denied: missing '<permission set name>' permission set (BIFROST GL Post ori, BIFROST ItemPost ori, BIFROST FA Post ori, BIFROST Job Post ori, BIFROST Res Post ori or BIFROST WhsePost ori).
```

The six permission sets are independent and **not bundled into `BIFROST Read ori` or `BIFROST Full ori`** — they must be granted explicitly.

| Permission Set | What it allows |
|---|---|
| `BIFROST GL Post ori` | Posting general journals and reversing registers and transactions, posting bank reconciliations and VAT settlements, posting and reversing customer and vendor applications, posting sales and purchase documents |
| `BIFROST ItemPost ori` | Posting item journals, transfer orders and assembly orders |
| `BIFROST FA Post ori` | Posting fixed asset journals |
| `BIFROST Job Post ori` | Posting project journals |
| `BIFROST Res Post ori` | Posting resource journals |
| `BIFROST WhsePost ori` | Posting warehouse shipments (posting with invoicing also requires `BIFROST GL Post ori`), registering warehouse picks and put-aways |

**Note:** Posting sales and purchase documents is gated to **G/L only** even though it may produce item and other ledger entries downstream. The gate represents the user's intent to trigger posting, not the entries that BC ultimately writes. Posting a warehouse shipment with invoicing is the only operation that requires two permission sets simultaneously.

---

## Related Documentation

- **[API Reference](/foundation/reference/api/)**: API endpoints, the message envelope and response shapes
- **Msg Interface ori**: Main interface for message type implementations
- **Setup ori Page**: User interface for configuration

---

## Support

For questions regarding setup configuration or implementation development, please contact Origo support.
