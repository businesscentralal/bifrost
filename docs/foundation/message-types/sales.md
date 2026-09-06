---
id: sales
title: "Sales, customer and item message types"
sidebar_position: 3
---

**Parent Document:** [API_Reference.md](/foundation/reference/api/)  
**Implementation Folder:** `app/src/Message Type/Implementations/Sales/`

---

## Overview

This document describes the Sales, Customer, and Item message types in the Bifrost API. These message types provide business operations for customer credit management, item availability checking, pricing information, sales order lifecycle management, and PDF document retrieval.

| Message Type | Direction | Purpose | Related Table(s) |
|--------------|-----------|---------|------------------|
| Customer.CreditLimit.Get | Outbound | Retrieve customer credit limit information including balance, outstanding amounts, and credit status | Customer (18) |
| Customer.SalesHistory.Get | Outbound | Retrieve sales history by item for a specific customer within a date range | Customer (18), Item Ledger Entry (32) |
| Customer.Statement.Pdf | Outbound | Retrieve customer statement as a PDF document with optional date range | Customer (18) |
| Item.Availability.Get | Outbound | Retrieve item availability information with physical inventory or calculated quantities | Item (27) |
| Item.Price.Get | Outbound | Retrieve item price information from price lists based on customer and date filters | Item (27), Price List Line |
| Sales.Document.Release | Inbound | Release an open sales document to make it ready for processing and posting | Sales Header (36) |
| Sales.Document.Reopen | Inbound | Reopen a released or pending approval sales document to allow modifications | Sales Header (36) |
| Sales.Document.Statistics | Outbound | Retrieve sales document statistics including amounts, VAT totals, quantities, weight and volume | Sales Header (36) |
| Sales.Document.Post | Inbound | Post a sales document and return all resulting posted documents | Sales Header (36) |
| Sales.Document.Create | Inbound | Create a new sales document header for a specified customer and document type | Sales Header (36) |
| Sales.Document.PreviewPost | Inbound | Simulate posting a sales document and return every captured ledger entry without committing | Sales Header (36) + every ledger table populated by the BC posting routine (dynamic; native support for G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Cust. / Detailed Cust. Ledger, Vendor / Detailed Vendor Ledger, Bank Account Ledger, FA Ledger, Maintenance Ledger, Job Ledger, Res. Ledger, Service Ledger, Warranty Ledger, Employee / Detailed Employee Ledger) |
| Sales.SalesInvoice.Pdf | Outbound | Retrieve posted sales invoice as a PDF document | Sales Invoice Header (112) |
| Sales.SalesShipment.Pdf | Outbound | Retrieve posted sales shipment as a PDF document | Sales Shipment Header (110) |
| Sales.SalesCreditMemo.Pdf | Outbound | Retrieve posted sales credit memo as a PDF document | Sales Cr.Memo Header (114) |
| Sales.ReturnReceipt.Pdf | Outbound | Retrieve posted return receipt as a PDF document | Return Receipt Header (6660) |
| Sales.SalesInvoice.Correct | Inbound | Cancel a posted sales invoice and create a new draft sales invoice for correction via BC codeunit 1303 | Sales Invoice Header (112), Sales Cr.Memo Header (114), Sales Header (36) |
| Sales.SalesInvoice.Cancel | Inbound | Cancel a posted sales invoice by posting a corrective credit memo via BC codeunit 1303 | Sales Invoice Header (112), Sales Cr.Memo Header (114) |
| Sales.SalesInvoice.Send | Inbound | Send a posted sales invoice via the resolved Document Sending Profile using `Sales Invoice Header.SendProfile` | Sales Invoice Header (112), Document Sending Profile (60), Customer (18) |
| Sales.SalesCreditMemo.Send | Inbound | Send a posted sales credit memo via the resolved Document Sending Profile using `Sales Cr.Memo Header.SendProfile` | Sales Cr.Memo Header (114), Document Sending Profile (60), Customer (18) |
| Customer.Application.Post | Inbound | Apply one customer ledger entry against one or more open customer ledger entries via codeunit 226 | Cust. Ledger Entry (21) |
| Customer.Application.Reverse | Inbound | Reverse (unapply) a posted application on a customer ledger entry via codeunit 226 | Cust. Ledger Entry (21) |
| Sales.Quote.MakeOrder | Inbound | Convert a sales quote into a sales order via BC codeunit 86 "Sales-Quote to Order" | Sales Header (36) |
| Sales.BlanketOrder.MakeOrder | Inbound | Convert a sales blanket order into a sales order via BC codeunit 87 "Blanket Sales Order to Order" | Sales Header (36) |

**Note:** All PDF message types support both document number and SystemId (GUID) lookup.

---

## Customer.CreditLimit.Get

**Purpose:** Retrieve customer credit limit information including balance, outstanding amounts, and credit limit status.

**Description:** Retrieves customer credit limit information including balance, outstanding amounts, remaining credit (with and without tolerance), and credit limit status indicators.

**Message Direction:** Outbound

**Input Parameters:**

The customer number can be specified either in the **subject** field or in the **data** parameters:

**Option 1: Using subject field**
```json
{
  "subject": "10000"
}
```

**Option 2: Using JSON data parameters**
```json
{
  "data": {
    "customerNo": "10000"
  }
}
```

**Option 3: Using customer SystemId**
```json
{
  "data": {
    "customerId": "{12345678-1234-1234-1234-123456789012}"
  }
}
```

**Request Parameters:**

- **subject** (optional): Customer number. Can be provided here or in data.customerNo/customerId.
- **customerNo** (optional): Customer number in data field. Takes precedence over subject.
- **customerId** (optional): Customer SystemId (GUID) in data field. Used if customerNo not provided.

**Response Format:**

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

**Response Fields:**

- **status**: Processing status ("Success" or "Error")
- **customerNo**: Customer number
- **customerName**: Customer name
- **balanceLCY**: Current balance in LCY (from Customer."Balance (LCY)")
- **outstandingBalanceDueLCY**: Outstanding balance that is due in LCY (from Customer."Balance Due (LCY)")
- **creditLimitLCY**: Credit limit amount in LCY (from Customer."Credit Limit (LCY)")
- **outstandingAmountLCY**: Outstanding amount from sales orders in LCY (includes "Outstanding Amount (LCY)" + "Shipped Not Invoiced (LCY)")
- **remainingCredit**: Remaining credit without tolerance = `creditLimitLCY - balanceLCY - outstandingAmountLCY`
- **tolerancePercent**: Credit limit tolerance percentage from Bifrost Setup
- **remainingCreditWithTolerance**: Remaining credit including tolerance = `remainingCredit + (creditLimitLCY × tolerancePercent / 100)`
- **hasOverdueBalance**: Boolean indicating if there is an overdue balance (`outstandingBalanceDueLCY > 0`)
- **isCreditLimitExceeded**: Boolean indicating if credit limit is exceeded (considers tolerance: `remainingCreditWithTolerance < 0`)

**Credit Limit Calculation Example:**

Given:
- Credit Limit: 10,000.00 LCY
- Current Balance: 5,000.00 LCY
- Outstanding Orders: 5,500.00 LCY
- Tolerance %: 10.00%

Calculation:
- Used Credit: 5,000 + 5,500 = 10,500.00 LCY
- Remaining Credit: 10,000 - 10,500 = **-500.00 LCY**
- Tolerance Amount: 10,000 × 0.10 = 1,000.00 LCY
- Remaining with Tolerance: -500 + 1,000 = **500.00 LCY**
- Is Exceeded: **false** (remaining with tolerance > 0)

**Configuration:**

- **Implementation Type**: Configured in Bifrost Setup → Customer Credit Limit Type
- **Tolerance %**: Configured in Bifrost Setup → Credit Limit Tolerance %
- See [Setup_Reference.md](/foundation/reference/setup/) for detailed configuration information

**Notes:**

- The credit limit type implementation is configured in Bifrost Setup
- Tolerance percentage (0-100) is configured in Bifrost Setup
- If credit limit is 0, `isCreditLimitExceeded` will always be false
- The implementation can be extended via the Customer Credit Limit Type ori enum
- Message Direction: Outbound
- Filter Table No: 18 (Customer)

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Customer.CreditLimit.Get",
  "source": "MyApp v1.0",
  "subject": "10000"
}
```

**Use Cases:**

- **Order Entry Validation**: Check if customer can place new orders
- **Credit Risk Management**: Monitor customer credit status
- **Automated Workflows**: Trigger approvals when tolerance is exceeded
- **Customer Portal**: Display remaining credit to customers

**Related Message Types:**

- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full customer record data
- [Help.Fields.Get](/foundation/message-types/metadata/#helpfieldsget): Get field metadata for Customer table

---

## Customer.SalesHistory.Get

**Purpose:** Retrieve sales history by item for a specific customer within a date range.

**Description:** Retrieves sales history information showing which items a customer has purchased, including number of orders and unit of measure details. Based on Item Ledger Entries for the customer within the specified date range.

**Message Direction:** Outbound

**Input Parameters:**

The customer number can be specified in either the **subject** field or in the **data** parameters. Additional date range parameters are required in the **data** field:

```json
{
  "subject": "10000",
  "data": {
    "fromDate": "2025-01-01",
    "toDate": "2025-12-31"
  }
}
```

Or alternatively:

```json
{
  "data": {
    "customerNo": "10000",
    "fromDate": "2025-01-01",
    "toDate": "2025-12-31"
  }
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| customerNo | Code[20] | Yes | Customer number (can be in subject or data) |
| fromDate | Date | Yes | Start date for sales history query (YYYY-MM-DD format) |
| toDate | Date | No | End date for sales history query (YYYY-MM-DD format). Defaults to today if not provided |

**Response Format:**

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
    },
    {
      "itemNo": "1001",
      "variantCode": "RED",
      "description": "Touring Bike Red",
      "baseUnitOfMeasure": "PCS",
      "baseUOMDescription": "Piece",
      "noOfOrders": 2
    }
  ]
}
```

**Response Fields:**

Root level:
- **status** (Text): Processing status ("Success" or "Error")
- **noOfRecords** (Integer): Number of items in the sales history
- **customerNo** (Code[20]): Customer number
- **customerName** (Text): Customer name
- **fromDate** (Date): Start date of the query period (YYYY-MM-DD)
- **toDate** (Date): End date of the query period (YYYY-MM-DD)
- **salesHistory** (Array): Array of sales history items

Sales history item:
- **itemNo** (Code[20]): Item number
- **variantCode** (Code[10]): Item variant code
- **description** (Text[100]): Item description from the item card
- **baseUnitOfMeasure** (Code[10]): Base unit of measure from the item card
- **baseUOMDescription** (Text[50]): Description of the base unit of measure
- **noOfOrders** (Integer): Number of Item Ledger Entries for the item within the date range (equates to number of invoiced sales lines)

**Configuration:** No configuration required. Data is retrieved directly from Item Ledger Entries.

**Notes:**

- Sales history is based on Item Ledger Entries with Entry Type = Sale, Source Type = Customer, and Invoiced Quantity &lt; 0
- Only entries linked to existing items are included (inner join to Item table)
- `noOfOrders` counts the number of Item Ledger Entries per item in the date range, which equates to the number of invoiced sales document lines
- Date filter is applied to the Posting Date of the Item Ledger Entry
- Customer number can be provided either in the subject field or in the data parameters
- Results are ordered by Item No. ascending
- Message Direction: Outbound
- Filter Table No: 18 (Customer)

**Example Request:**

```json
{
  "specversion": "1.0",
  "type": "Customer.SalesHistory.Get",
  "source": "Webstore v1.0",
  "subject": "10000",
  "datacontenttype": "application/json",
  "data": {
    "fromDate": "2025-01-01",
    "toDate": "2025-12-31"
  }
}
```

**Use Cases:**

- **Customer Portals**: Display customer's purchase history
- **Reorder Suggestions**: Show previously ordered items for quick reordering
- **Sales Analytics**: Analyze customer buying patterns
- **Cross-sell/Upsell**: Recommend related products based on purchase history

**Related Message Types:**

- [Customer.CreditLimit.Get](#customercreditlimitget): Retrieve customer credit limit information
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full customer record data
- [Item.Availability.Get](#itemavailabilityget): Get current item availability
- [Item.Price.Get](#itempriceget): Get current item pricing

---

## Customer.Statement.Pdf

**Purpose:** Retrieve a customer statement as a PDF document with an optional date range.

**Description:** Retrieves a customer statement as a PDF document using the configured report selection. The statement can show all transactions within a specified date range, defaulting to the last 30 days if no dates are provided.

**Message Direction:** Outbound

**Request Parameters:**

The customer number or SystemId must be specified in the **subject** field. Optional date range parameters can be provided in the **data** field.

**Using customer number (default 30-day period):**
```json
{
  "specversion": "1.0",
  "type": "Customer.Statement.Pdf",
  "source": "MyApp v1.0",
  "subject": "10000"
}
```

**Using customer number with date range:**
```json
{
  "specversion": "1.0",
  "type": "Customer.Statement.Pdf",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": "{\"startDate\":\"2026-01-01\",\"endDate\":\"2026-03-20\"}"
}
```

**Request Parameters:**

- **subject** (required): Customer number or SystemId (GUID) to retrieve statement for
  - Example (number): "10000"
  - Example (SystemId): "&#123;12345678-1234-1234-1234-123456789012&#125;"
- **data** (optional): JSON string with date range parameters
  - **startDate** (optional): ISO 8601 date string (e.g., "2026-01-01"). Defaults to Today - 30 days.
  - **endDate** (optional): ISO 8601 date string (e.g., "2026-03-20"). Defaults to Today.

**Response Format:**

The initial response is a JSON object containing a download URL and the content type of the downloadable file:

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Call the `downloadUrl` to retrieve the PDF binary. The downloaded content has content type `application/pdf`. The PDF is generated using the configured report selection for Customer Statement (C.Statement).

**Default Behavior:**

If no date parameters are provided, the statement covers the last 30 days (Today - 30 days through Today).

**Error Messages:**

- `"Subject parameter is required. Provide the customer number or SystemId."` - No subject provided
- `"Customer {subject} not found."` - Customer doesn't exist
- `"Invalid date range: start date {start} must be before or equal to end date {end}."` - Start date is after end date
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid version

**Notes:**

- The statement implementation is pluggable via **Customer Statement Type** in Bifrost Setup (extensible enum 10077888). The default implementation (`Standard Statement`, codeunit 10077891) uses the report selection configured in Report Selections for Customer Statement (`C.Statement`)
- The system uses customer-specific reports if configured, otherwise the default report
- Subject can be either the customer number (e.g., "10000") or the SystemId GUID
- Date parameters are optional; omitting them defaults to a 30-day period
- The PDF format and content depend on the configured report layout
- Requires read permission on Customer and Report Selections tables
- Filter Table No: 18 (Customer)
- Message Direction: Outbound

**Use Cases:**

- **Customer Portals**: Allow customers to download their account statements
- **Collections**: Generate statements for accounts receivable follow-up
- **Customer Service**: Provide statements in response to customer inquiries
- **Accounting**: Generate statements for reconciliation and audit purposes
- **Automated Reporting**: Schedule statement generation and distribution

**Related Message Types:**

- [Customer.CreditLimit.Get](#customercreditlimitget): Retrieve customer credit limit information
- [Customer.SalesHistory.Get](#customersaleshistoryget): Retrieve customer sales history
- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve sales invoice PDF
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full customer record data in JSON format

---

## Item.Availability.Get

**Purpose:** Retrieve item availability information including inventory quantities and availability status.

**Description:** Retrieves item availability information based on the configured calculation type (Physical Inventory or Calculated Quantity). Supports single-item and multi-item queries, location filtering, and requested delivery date for future availability calculations.

**Message Direction:** Outbound

**Item Resolution:**

The item(s) to query can be specified using several methods, checked in order:

1. **subject** — GUID resolves via SystemId; plain text resolves via Item No.
2. **data.itemNo** — Item number (overrides subject)
3. **data.itemId** — Item SystemId (GUID)
4. **data.id** / **data.systemId** / **data.recordSystemId** — Item SystemId (GUID)
5. **data.tableView** — BC AL table view filter (e.g., `WHERE(Item Category Code=CONST(FURNITURE))`) — returns multiple items
6. If none specified, returns all non-blocked items

**Option 1: Single item by number (subject)**
```json
{
  "subject": "1000",
  "data": {
    "requestedDeliveryDate": "2026-03-15",
    "locationFilter": "BLUE|RED"
  }
}
```

**Option 2: Single item by JSON data parameter**
```json
{
  "data": {
    "itemNo": "1000",
    "requestedDeliveryDate": "2026-03-15",
    "locationFilter": "BLUE|RED"
  }
}
```

**Option 3: Single item by SystemId**
```json
{
  "data": {
    "itemId": "{12345678-1234-1234-1234-123456789012}",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**Option 4: Multiple items by tableView filter**
```json
{
  "data": {
    "tableView": "WHERE(Item Category Code=CONST(FURNITURE))",
    "locationFilter": "BLUE"
  }
}
```

**Request Parameters:**

- **subject** (optional): Item number or SystemId (GUID). Can be provided here or in data parameters.
- **itemNo** (optional): Item number in data field. Overrides subject.
- **itemId** (optional): Item SystemId (GUID) in data field. Used if itemNo not provided.
- **id** / **systemId** / **recordSystemId** (optional): Item SystemId (GUID) alternatives.
- **tableView** (optional): BC AL table view filter string to select multiple items. Uses standard BC syntax (see [tableView filter syntax](/foundation/reference/message-types/help-bifrost-get/#5-tableview-filter-syntax--const-vs-filter)).
- **requestedDeliveryDate** (optional): Date to calculate availability for (ISO 8601 format). If not specified, uses the current work date. Filters all supply and demand to this date when using Calculated Quantity type.
- **locationFilter** (optional): Location code filter. Supports standard BC filter syntax (e.g., "BLUE", "BLUE|RED", "BLUE..RED"). If not provided, all locations (including blank) are returned.
- **variantCode** (optional): Item variant code to filter availability.

**Response Format:**

Results are always returned in an `items` array, even for single-item queries. The array structure depends on the **Item Calc. Avail.Type** configured in Bifrost Setup.

**Response Format - Physical Inventory:**

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
        { "locationCode": "RED", "inventory": 30 },
        { "locationCode": "", "inventory": 10 }
      ]
    }
  ]
}
```

**Response Format - Calculated Quantity:**

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

**Multi-item response example (Physical Inventory):**

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

**Availability Types:**

The response format depends on the **Item Calc. Avail.Type** configured in Bifrost Setup:

#### Physical Inventory
- Returns actual physical inventory quantity by location
- Uses the Item."Inventory" field value from Item Ledger Entries
- Simple and fast query-based calculation
- Best for current on-hand quantity checks

**Fields (per item):**
- **itemNo**: Item number
- **itemDescription**: Item description
- **baseUnitOfMeasure**: Base unit of measure code
- **inventory**: Array of location inventory objects, each with:
  - **locationCode**: Location code (empty string for blank location)
  - **inventory**: Current physical inventory quantity at location

#### Calculated Quantity
- Returns calculated available quantity considering supply and demand
- Filters all supply/demand to the **requestedDeliveryDate**
- Provides detailed breakdown of quantities

**Fields (per item):**
- **itemNo**: Item number
- **itemDescription**: Item description
- **baseUnitOfMeasure**: Base unit of measure code
- **requestedDeliveryDate**: The delivery date used for calculation
- **availability**: Array of location availability objects, each with:
  - **locationCode**: Location code
  - **inventory**: Current physical inventory
  - **qtyReserved**: Reserved quantities (expected by requested date)
  - **grossRequirement**: Total requirements from sales orders, service orders, jobs, production, assembly (due by requested date)
  - **scheduledReceipt**: Scheduled receipts from purchase orders, production, assembly, transfers (arriving by requested date)
  - **plannedOrderReceipt**: Planned order receipts from requisition and planned production (due by requested date)
  - **availableQuantity**: Calculated available quantity = `inventory - qtyReserved - grossRequirement + scheduledReceipt + plannedOrderReceipt`

**Configuration:**

- **Implementation Type**: Configured in Bifrost Setup → Item Calc. Avail.Type
  - `Physical Inventory`: Returns actual inventory quantities
  - `Calculated Quantity`: Returns projected availability with supply/demand
- See [Setup_Reference.md](/foundation/reference/setup/) for detailed configuration information

**Notes:**

- The availability type implementation is configured in Bifrost Setup
- Results are always wrapped in an `items` array, even for single-item queries
- When using Calculated Quantity type, the **requestedDeliveryDate** filters all supply and demand to that date
- If no **requestedDeliveryDate** is provided, the current work date is used
- The **locationFilter** parameter supports standard Business Central filter syntax
- If no **locationFilter** is provided, all locations (including blank) are returned
- The **tableView** parameter enables multi-item queries using BC AL table view syntax
- If no item identifier or tableView is provided, all non-blocked items are returned
- The implementation can be extended via the Item Calc. Avail.Type ori enum
- Message Direction: Outbound
- Filter Table No: 27 (Item)

**Example Requests:**

**1. Get current inventory for a single item:**
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp v1.0",
  "subject": "1000"
}
```

**2. Get availability for specific delivery date:**
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp v1.0",
  "subject": "1000",
  "data": {
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**3. Get availability with location filter:**
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp v1.0",
  "subject": "1000",
  "data": {
    "requestedDeliveryDate": "2026-03-15",
    "locationFilter": "BLUE|RED"
  }
}
```

**4. Multi-item query using tableView:**
```json
{
  "specversion": "1.0",
  "type": "Item.Availability.Get",
  "source": "MyApp v1.0",
  "data": {
    "tableView": "WHERE(Item Category Code=CONST(FURNITURE))",
    "locationFilter": "BLUE"
  }
}
```

**Error Responses:**

- `"No items found matching the specified criteria."` — when no items match the provided filter/identifier

**Use Cases:**

- **Order Entry**: Check if sufficient quantity is available for requested delivery date
- **Inventory Dashboard**: Display current inventory across locations
- **Bulk Inventory Check**: Query availability for an entire item category using tableView
- **Promise Date Calculation**: Determine earliest delivery date with availability
- **Supply Planning**: Analyze future availability considering all supply/demand

**Related Message Types:**

- [Item.Price.Get](#itempriceget): Retrieve item price information
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full item record data
- [Help.Fields.Get](/foundation/message-types/metadata/#helpfieldsget): Get field metadata for Item table

---

## Item.Price.Get

**Purpose:** Retrieve item price information based on configured price calculation rules.

**Description:** Retrieves item price information from price lists based on customer, requested delivery date, quantity, and variant filters. Supports single-item and multi-item queries. Returns prices from customer-specific price lists, all-customers price lists, and item card prices as fallback.

**Message Direction:** Outbound

**Item Resolution:**

Same resolution as [Item.Availability.Get](#itemavailabilityget):

1. **subject** — GUID resolves via SystemId; plain text resolves via Item No.
2. **data.itemNo** — Item number (overrides subject)
3. **data.itemId** — Item SystemId (GUID)
4. **data.id** / **data.systemId** / **data.recordSystemId** — Item SystemId (GUID)
5. **data.tableView** — BC AL table view filter for multi-item queries
6. If none specified, returns prices for all non-blocked items

**Customer Resolution Priority:**

1. **data.customerNo** — Customer number (Code)
2. **data.customerId** — Customer SystemId (GUID)
3. **data.customerRecordId** — Customer SystemId (GUID)
4. **data.customerSystemId** — Customer SystemId (GUID)
5. If none specified, returns all-customers prices only

**Option 1: Single item by number (subject)**
```json
{
  "subject": "1000",
  "data": {
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**Option 2: Single item by JSON data parameter**
```json
{
  "data": {
    "itemNo": "1000",
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**Option 3: Single item by SystemId**
```json
{
  "data": {
    "itemId": "{12345678-1234-1234-1234-123456789012}",
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**Option 4: Multiple items by tableView filter**
```json
{
  "data": {
    "tableView": "WHERE(Item Category Code=CONST(FURNITURE))",
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**Request Parameters:**

- **subject** (optional): Item number or SystemId (GUID). Can be provided here or in data parameters.
- **itemNo** (optional): Item number in data field. Overrides subject.
- **itemId** (optional): Item SystemId (GUID) in data field. Used if itemNo not provided.
- **id** / **systemId** / **recordSystemId** (optional): Item SystemId (GUID) alternatives.
- **tableView** (optional): BC AL table view filter string to select multiple items. Uses standard BC syntax.
- **customerNo** (optional): Customer number (Code) for customer-specific pricing.
- **customerId** (optional): Customer SystemId (GUID) for customer-specific pricing.
- **customerRecordId** (optional): Customer SystemId (GUID) alternative.
- **customerSystemId** (optional): Customer SystemId (GUID) alternative.
- **requestedDeliveryDate** (optional): Date to filter price lists by starting/ending dates (ISO 8601 format). Price lists must be active on this date.
- **quantity** (optional): Quantity for minimum quantity threshold filtering. Only returns price list lines where minimum quantity &lt;= specified quantity.
- **variantCode** (optional): Item variant code to filter price list lines.

**Customer Validation:**

When a customer identifier (`customerNo`, `customerId`, `customerRecordId`, or `customerSystemId`) is provided, the customer record is validated before price calculation. All of the following must be configured on the customer:

- **VAT Bus. Posting Group** — required for VAT calculation
- **Gen. Bus. Posting Group** — required for general posting
- **Customer Posting Group** — required for customer posting

If any of these are missing, an error response is returned (e.g., `"Customer C001 must have a VAT Bus. Posting Group."`).

**Response Format:**

Price list lines from all matched items are returned in a single `priceListLines` array. Each line includes an `itemNo` field to identify which item it belongs to.

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
      "allowInvoiceDisc": true,
      "allowLineDisc": true,
      "vatBusPostingGr": "DOMESTIC",
      "vatProdPostingGr": "STANDARD",
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

**Response Fields:**

Each price list line contains:

- **priceListCode**: Price list code
- **priceListDescription**: Price list description
- **lineNo**: Line number within the price list
- **itemNo**: Item number (identifies which item the price belongs to)
- **variantCode**: Item variant code (if applicable)
- **unitOfMeasureCode**: Unit of measure code
- **qtyPerUnitOfMeasure**: Quantity per unit of measure
- **minimumQuantity**: Minimum quantity required for this price
- **amountType**: Amount type (e.g., "Price", "Discount")
- **unitPrice**: Original unit price from price list
- **unitPriceExclVAT**: Unit price excluding VAT
- **unitPriceInclVAT**: Unit price including VAT
- **lineDiscountPct**: Line discount percentage
- **allowInvoiceDisc**: Allow invoice discount (boolean)
- **allowLineDisc**: Allow line discount (boolean)
- **vatBusPostingGr**: VAT business posting group
- **vatProdPostingGr**: VAT product posting group
- **vatPct**: VAT percentage
- **itemName**: Item description (from Item table)
- **itemDescription**: Item description 2 (from Item table)
- **baseUnitOfMeasure**: Base unit of measure code (from Item table)
- **eanCode**: GTIN / EAN code (from Item table)
- **unspscCode**: Tariff number (from Item table)
- **netWeight**: Net weight (from Item table)
- **itemSystemId**: Item SystemId (GUID, formatted without braces)
- **priceType**: Price type ("Customer" for customer-specific, "All Customers" for general, "Item Card" for item card prices)
- **status**: Price list status ("Active", "Inactive", "Draft")
- **startingDate**: Price list starting date
- **endingDate**: Price list ending date (0001-01-01 means no end date)

**Price Selection Logic:**

The default implementation retrieves prices in the following priority (per item):

1. **Customer-Specific Prices:**
   - If `customerNo` is provided in the request
   - Finds price lists assigned to that specific customer
   - Filters by:
     - Active status
     - Starting date &lt;= requested delivery date &lt;= ending date (or no end date)
     - Item number matches
     - Variant code matches (if specified)
     - Minimum quantity &lt;= requested quantity (if specified)

2. **All-Customers Prices:**
   - If no customer-specific prices found, or no customer specified
   - Finds price lists assigned to all customers
   - Same filtering logic applies

3. **Item Card Prices:**
   - If no price list lines are found
   - Returns prices from Item table:
     - Unit Price (from Item."Unit Price")
     - Unit Cost (from Item."Unit Cost")
   - Marks with `priceType: "Item Card"`

**Configuration:**

- **Implementation Type**: Configured in Bifrost Setup → Item Price Calc. Type
- Default implementation provides standard Business Central price list retrieval
- The implementation can be extended via the Item Price Calc. Type ori enum
- See [Setup_Reference.md](/foundation/reference/setup/) for detailed configuration information

**Error Responses:**

- `"No items found matching the specified criteria."` — when no items match the provided filter/identifier
- `"VAT Bus. Posting Gr. (Price) must have a value in Sales & Receivables Setup."` — missing setup
- `"Customer {no} not found."` — invalid customer number or SystemId
- `"Customer {no} must have a VAT Bus. Posting Group."` — missing customer posting group
- `"Customer {no} must have a Gen. Bus. Posting Group."` — missing customer posting group
- `"Customer {no} must have a Customer Posting Group."` — missing customer posting group

**Notes:**

- Returns all matching price lists in local currency (LCY)
- Price list lines from all matched items are combined in a single `priceListLines` array
- Each price list line includes `itemNo` to identify which item it belongs to
- VAT calculations include both Excl. VAT and Incl. VAT amounts
- Supports quantity-based pricing tiers via minimum quantity
- Price lists must be active and within the date range
- The **tableView** parameter enables multi-item queries using BC AL table view syntax
- The implementation can be extended for custom pricing logic (e.g., external API, custom calculations)
- Message Direction: Outbound
- Filter Table No: 27 (Item)

**Example Requests:**

**1. Get prices for item (all customers):**
```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp v1.0",
  "subject": "1000"
}
```

**2. Get customer-specific prices:**
```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp v1.0",
  "subject": "1000",
  "data": {
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15"
  }
}
```

**3. Get prices with quantity and variant:**
```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp v1.0",
  "subject": "1000",
  "data": {
    "customerNo": "C001",
    "requestedDeliveryDate": "2026-03-15",
    "quantity": 25,
    "variantCode": "BLUE"
  }
}
```

**4. Multi-item pricing using tableView:**
```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp v1.0",
  "data": {
    "tableView": "WHERE(Item Category Code=CONST(FURNITURE))",
    "customerNo": "C001"
  }
}
```

**5. Customer-specific pricing by SystemId:**
```json
{
  "specversion": "1.0",
  "type": "Item.Price.Get",
  "source": "MyApp v1.0",
  "subject": "1000",
  "data": {
    "customerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Use Cases:**

- **E-commerce Integration**: Display customer-specific prices on web store
- **Order Entry**: Show available prices for item/customer/quantity combinations
- **Bulk Price Check**: Get prices for all items in a category using tableView
- **Price Comparison**: Compare prices across multiple price lists
- **Quote Generation**: Retrieve current pricing for quote preparation
- **Pricing Analytics**: Analyze price structures and discounts

**Related Message Types:**

- [Item.Availability.Get](#itemavailabilityget): Retrieve item availability information
- [Customer.CreditLimit.Get](#customercreditlimitget): Check customer credit status before pricing
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full item or price list record data
- [Help.Fields.Get](/foundation/message-types/metadata/#helpfieldsget): Get field metadata for Item or Price List tables

---

## Sales.Document.Release

**Purpose:** Release an open sales document to make it ready for processing and posting.

**Description:** Releases a sales document by changing its status from Open to Released. This action validates the document, locks it for editing, and makes it available for further processing such as picking, shipping, and invoicing. Supports all sales document types: Order, Invoice, Credit Memo, and Return Order. The operation uses the standard Business Central release functionality and provides comprehensive status information before and after the release operation.

**Message Direction:** Inbound

**Request Parameters:**

The document can be identified using the **subject** field or a key in the **data** JSON object:

**Option 1: Using subject (document number)**
```json
{
  "specversion": "1.0",
  "subject": "SO-1001"
}
```

**Option 2: Using subject (SystemId GUID)**
```json
{
  "specversion": "1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using data field**
```json
{
  "specversion": "1.0",
  "data": {
    "orderNo": "SO-1001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Document number (plain text defaults to Document Type = Order) or SystemId (GUID finds any document type)
- **data** (optional): JSON object with a document identifier key. First matched key wins:
  - **systemId** / **recordSystemId** / **id**: Record SystemId (GUID) — finds any document type
  - **orderNo**: Order number (Document Type = Order)
  - **quoteNo**: Quote number (Document Type = Quote)
  - **invoiceNo**: Invoice number (Document Type = Invoice)
  - **creditMemoNo**: Credit memo number (Document Type = Credit Memo)
  - **blanketOrderNo**: Blanket order number (Document Type = Blanket Order)
  - **returnOrderNo**: Return order number (Document Type = Return Order)
- **specversion** (required): Bifrost specification version (must be "1.0")

**Note:** Either `subject` or a `data` key must be provided. The `subject` field is checked first; if empty, data keys are checked in the order listed above.

**Response Format:**

**Success Response:**
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

**Error Response:**
```json
{
  "status": "Error",
  "message": "Sales Order SO-1001 not found."
}
```

**Response Fields:**

- **status**: "Success" or "Error"
- **documentType**: Actual document type of the found record (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Sales document number that was processed
- **customerNo**: Customer number from the sales document
- **customerName**: Customer name from the sales document
- **statusBefore**: Status before the release operation (typically "Open")
- **statusAfter**: Status after the release operation (typically "Released")
- **documentDate**: Order date from the sales header
- **amount**: Total amount excluding VAT
- **amountIncludingVAT**: Total amount including VAT
- **message**: Error message (only present when status is "Error")

**Validation Rules:**

1. **Document Identifier Required**: Either subject or a data key must be specified
2. **Document Must Exist**: The specified sales document must exist in the system
3. **Status Validation**: The document must have status "Open" (documents already released will return an error)
4. **Standard Validations**: All standard Business Central validation rules for releasing sales documents apply (e.g., mandatory fields, line quantities, etc.)

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Error Messages:**

- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` - No document identifier provided in request
- `"Sales document not found."` - The specified document number or SystemId does not exist
- `"Sales Order {No} is already released. Current Status: {Status}"` - The document is already released or has another non-Open status
- Standard Business Central validation errors may also be returned if the release operation fails

**Complete Workflow Example:**

This example demonstrates the complete workflow of creating a sales document, adding lines, verifying status, releasing, and confirming the release:

**Step 1: Create Sales Order**
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "OrderManagement v1.0",
  "subject": "Sales Header",
  "data": {
    "data": [
      {
        "primaryKey": {
          "DocumentType": "Order",
          "No_": "SO-1001"
        },
        "fields": {
          "SelltoCustomerNo": "C001",
          "OrderDate": "2025-05-15"
        }
      }
    ]
  }
}
```

**Step 2: Add Sales Lines**
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Set",
  "source": "OrderManagement v1.0",
  "subject": "Sales Line",
  "data": {
    "data": [
      {
        "primaryKey": {
          "DocumentType": "Order",
          "DocumentNo": "SO-1001",
          "LineNo": 10000
        },
        "fields": {
          "Type": "Item",
          "No": "1000",
          "Quantity": 5,
          "UnitPrice": 100.00
        }
      },
      {
        "primaryKey": {
          "DocumentType": "Order",
          "DocumentNo": "SO-1001",
          "LineNo": 20000
        },
        "fields": {
          "Type": "Item",
          "No": "1001",
          "Quantity": 3,
          "UnitPrice": 200.00
        }
      }
    ]
  }
}
```

**Step 3: Verify Order Status is Open**
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "OrderManagement v1.0",
  "data": {
    "tableName": "Sales Header",
    "fieldNumbers": [3],
    "tableView": "WHERE(Document Type=CONST(Order),No.=CONST(SO-1001))"
  }
}
```

**Response (Status is Open):**
```json
{
  "status": "Success",
  "result": [
    {
      "id": "12345678-...",
      "primaryKey": {
        "DocumentType": "Order",
        "No_": "SO-1001"
      },
      "fields": {
        "Status": "Open"
      }
    }
  ]
}
```

**Step 4: Release the Sales Order**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Release",
  "source": "OrderManagement v1.0",
  "subject": "SO-1001"
}
```

**Response (Release Successful):**
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

**Step 5: Verify Order Status is Released**
```json
{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "OrderManagement v1.0",
  "data": {
    "tableName": "Sales Header",
    "fieldNumbers": [3],
    "tableView": "WHERE(Document Type=CONST(Order),No.=CONST(SO-1001))"
  }
}
```

**Response (Status is Released):**
```json
{
  "status": "Success",
  "result": [
    {
      "id": "12345678-...",
      "primaryKey": {
        "DocumentType": "Order",
        "No_": "SO-1001"
      },
      "fields": {
        "Status": "Released"
      }
    }
  ]
}
```

**Use Cases:**

- **Order Management Integration**: Automatically release orders from external systems after validation
- **Workflow Automation**: Integrate order release into approval workflows
- **Batch Processing**: Release multiple orders as part of a scheduled process
- **Status Management**: Programmatically control order lifecycle from creation through release
- **Order Verification**: Get comprehensive order information including amounts and customer details after release

**Related Message Types:**

- [Data.Records.Set](/foundation/message-types/data/#datarecordsset): Create sales orders and sales lines
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve sales order details and status
- [Customer.CreditLimit.Get](#customercreditlimitget): Check customer credit before releasing orders
- [Item.Availability.Get](#itemavailabilityget): Verify item availability before releasing orders
- [Item.Price.Get](#itempriceget): Get current pricing information for order lines

**Notes:**

- This operation uses the standard Business Central "Release Sales Document" functionality
- Once released, the order cannot be modified without reopening it first
- Released orders can be processed for picking, shipping, and invoicing
- The operation validates all standard Business Central requirements (customer, items, quantities, etc.)
- Filter Table No: 36 (Sales Header)
- Message Direction: Inbound

---

## Sales.Document.Statistics

**Purpose:** Retrieve sales document statistics including amounts, VAT totals, quantities, weight and volume.

**Description:** Retrieves comprehensive statistics for a sales document including amounts, line and invoice discounts, VAT breakdown, total quantities, weight and volume. This is a read-only operation that provides the same information displayed on the Sales Statistics page in Business Central. Supports all sales document types: Order, Invoice, Credit Memo, and Return Order. The document can be identified by either the document number or SystemId (GUID).

**Message Direction:** Outbound

**Request Parameters:**

The document can be identified using the **subject** field or a key in the **data** JSON object:

**Option 1: Using subject field (document number)**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Statistics",
  "source": "MyApp v1.0",
  "subject": "SO-1001"
}
```

**Option 2: Using subject field (SystemId)**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Statistics",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using data field**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Statistics",
  "source": "MyApp v1.0",
  "data": {
    "orderNo": "SO-1001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Document number (plain text defaults to Document Type = Order) or SystemId (GUID finds any document type)
- **data** (optional): JSON object with a document identifier key. First matched key wins:
  - **systemId** / **recordSystemId** / **id**: Record SystemId (GUID) — finds any document type
  - **orderNo**: Order number (Document Type = Order)
  - **quoteNo**: Quote number (Document Type = Quote)
  - **invoiceNo**: Invoice number (Document Type = Invoice)
  - **creditMemoNo**: Credit memo number (Document Type = Credit Memo)
  - **blanketOrderNo**: Blanket order number (Document Type = Blanket Order)
  - **returnOrderNo**: Return order number (Document Type = Return Order)
- **specversion** (required): Bifrost specification version (must be "1.0")

**Note:** Either `subject` or a `data` key must be provided. The `subject` field is checked first; if empty, data keys are checked in the order listed above.

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

**Success Response:**
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

**Error Response:**
```json
{
  "status": "Error",
  "error": "Sales Order SO-1001 not found."
}
```

**Response Fields:**

### Top Level Fields

- **status**: "Success" or "Error"
- **documentType**: Actual document type of the found record (e.g. "Order", "Invoice", "Credit Memo", "Return Order")
- **documentNo**: Sales document number
- **customerNo**: Customer number from the sales document
- **customerName**: Customer name from the sales document
- **currencyCode**: Currency code from the sales document (blank = LCY)
- **documentDate**: Order date from the sales header
- **error**: Error message (only present when status is "Error")

### Order Group Fields

- **amount**: Total line amount excluding VAT (from Sales Header.Amount)
- **lineDiscountAmount**: Sum of all line discounts from sales lines
- **invoiceDiscountAmount**: Total invoice discount amount
- **totalExclVAT**: Total amount excluding VAT (after all discounts)
- **vatAmount**: Total VAT amount
- **totalInclVAT**: Total amount including VAT
- **quantity**: Total quantity of all lines (sum of Quantity field)
- **totalWeight**: Total gross weight (sum of line Quantity × Gross Weight)
- **totalVolume**: Total volume (sum of line Quantity × Unit Volume)
- **noOfVATLines**: Number of different VAT rates in the document

### VAT Totals Array

Contains one entry per VAT rate used in the document:

- **vatIdentifier**: VAT identifier grouping code
- **vatPct**: VAT percentage rate
- **lineAmount**: Total line amount for this VAT rate (before discounts)
- **vatBase**: Amount subject to VAT for this rate (after invoice discounts)
- **vatAmount**: VAT amount for this rate
- **amountInclVAT**: Total amount including VAT for this rate

**Validation Rules:**

1. **Document Identifier Required**: Either subject or a data key must be specified
2. **Document Must Exist**: The specified sales document must exist in the system
3. **Specification Version**: Must be version 1.0

**Error Messages:**

- `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` - No document identifier provided in request
- `"Sales document not found."` - The specified document number or SystemId does not exist
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid specification version

**Currency and Rounding:**

All amounts are rounded using the currency precision defined in the order's currency code:
- If the order has a currency code specified, that currency's rounding precision is used
- If no currency is specified, the LCY (local currency) rounding precision is used
- This ensures consistency with Business Central's standard amount calculations

**Calculation Details:**

1. **Line Discount Amount**: Calculated by summing the "Line Discount Amount" field from all sales lines
2. **Weight and Volume**: Calculated by multiplying each line's quantity by its Gross Weight and Unit Volume fields
3. **VAT Amounts**: Calculated using Business Central's standard VAT calculation logic (CalcVATAmountLines)
4. **Invoice Discount**: Retrieved from the VAT Amount Line calculations
5. **Totals**: Retrieved using the GetTotalVATAmount method from VAT Amount Line

**Use Cases:**

- **Order Review**: Display comprehensive order statistics in external applications
- **Approval Workflows**: Provide detailed order amounts for approval decisions
- **Financial Analysis**: Extract order totals and VAT breakdowns for reporting
- **Integration**: Synchronize order statistics with external systems (ERP, reporting tools)
- **Customer Portal**: Display order totals to customers
- **Quotation Systems**: Show VAT breakdowns before order confirmation

**Related Message Types:**

- [Sales.Document.Release](#salesdocumentrelease): Release the sales document
- [Sales.Document.Reopen](/foundation/reference/message-types/sales-document-reopen/): Reopen the sales document for modifications
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full sales header or line data
- [Customer.CreditLimit.Get](#customercreditlimitget): Check customer credit status
- [Item.Availability.Get](#itemavailabilityget): Verify item availability

**Notes:**

- This is a read-only operation and does not modify the sales document
- Statistics are calculated in real-time based on the current state of the document
- The VAT breakdown provides the same detail as the Sales Statistics page in Business Central
- Documents can be in any status (Open, Released, etc.)
- Weight and volume are only calculated for lines where these fields have values
- SystemId lookup is supported for integration scenarios where the GUID is preferred
- Filter Table No: 36 (Sales Header)
- Message Direction: Outbound

---

## Sales.Document.Post

**Purpose:** Post a sales document and return all resulting posted documents.

**Description:** Posts a sales document using the standard Business Central Sales-Post codeunit. Supports all four sales document types: Order, Invoice, Credit Memo, and Return Order. The document must have at least one line. After successful posting the original document is consumed and one or more posted documents are created. The response contains details of each posted document in a `postedDocuments` array.

| Document Type | Posted Documents Created |
|---------------|-------------------------|
| Order | Posted Sales Invoice + Posted Sales Shipment |
| Invoice | Posted Sales Invoice |
| Credit Memo | Posted Sales Credit Memo |
| Return Order | Posted Sales Credit Memo + Posted Return Receipt |

**Message Direction:** Inbound

**Request Parameters:**

The document can be identified using the **subject** field or a key in the **data** JSON object:

**Option 1: Using subject field (document number)**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Post",
  "source": "MyApp v1.0",
  "subject": "SO-1001"
}
```

**Option 2: Using data field**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Post",
  "source": "MyApp v1.0",
  "data": "{\"orderNo\": \"SO-1001\"}"
}
```

**Option 3: Using SystemId (GUID)**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Post",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Request Parameters:**

- **subject** (optional): Document number (plain text defaults to Document Type = Order) or SystemId (GUID finds any document type)
- **data** (optional): JSON object with a document identifier key. First matched key wins:
  - **systemId** / **recordSystemId** / **id**: Record SystemId (GUID) — finds any document type
  - **orderNo**: Order number (Document Type = Order)
  - **quoteNo**: Quote number (Document Type = Quote)
  - **invoiceNo**: Invoice number (Document Type = Invoice)
  - **creditMemoNo**: Credit memo number (Document Type = Credit Memo)
  - **blanketOrderNo**: Blanket order number (Document Type = Blanket Order)
  - **returnOrderNo**: Return order number (Document Type = Return Order)
- **specversion** (required): Bifrost specification version (must be "1.0")

**Note:** Either `subject` or a `data` key must be provided. The `subject` field is checked first; if empty, data keys are checked in the order listed above.

**Document Lookup:**

- A plain-text **subject** defaults to looking up Document Type = Order
- Use specific data JSON keys for other types: `invoiceNo`, `creditMemoNo`, `returnOrderNo`, `quoteNo`, `blanketOrderNo`
- A GUID (SystemId) in **subject** or data (`systemId`, `id`, `recordSystemId`) finds the document regardless of type

**Response Format:**

```json
{
  "status": "Success",
  "documentType": "Order",
  "documentNo": "SO-1001",
  "customerNo": "10000",
  "customerName": "Adatum Corporation",
  "postedDocuments": [
    {
      "type": "Posted Sales Invoice",
      "recordSystemId": "12345678-1234-1234-1234-123456789012",
      "no": "PI-1001",
      "postingDate": "2026-03-16",
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00,
      "custLedgerEntryNo": 1001
    },
    {
      "type": "Posted Sales Shipment",
      "recordSystemId": "87654321-4321-4321-4321-210987654321",
      "no": "S-1001",
      "postingDate": "2026-03-16"
    }
  ]
}
```

**Response Fields:**

### Top Level

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"Success"` or `"Error"` |
| `documentType` | string | Type of the original document: `"Order"`, `"Invoice"`, `"Credit Memo"`, or `"Return Order"` |
| `documentNo` | string | Original document number that was posted |
| `customerNo` | string | Sell-to customer number |
| `customerName` | string | Sell-to customer name |

### postedDocuments Array

Each entry represents one posted document created by the posting:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Posted document type (`"Posted Sales Invoice"`, `"Posted Sales Shipment"`, `"Posted Sales Credit Memo"`, or `"Posted Return Receipt"`) |
| `recordSystemId` | string | SystemId (GUID) of the posted document record |
| `no` | string | Document number of the posted document |
| `postingDate` | date | Posting date of the posted document |
| `amount` | decimal | Total amount excluding VAT (present on invoices and credit memos only) |
| `amountIncludingVAT` | decimal | Total amount including VAT (present on invoices and credit memos only) |
| `custLedgerEntryNo` | integer | Customer ledger entry number (present on invoices and credit memos only) |

**Error Scenarios:**

| Error | Message |
|-------|---------|
| Document not found | `"Sales document not found."` |
| No lines | `"Sales document SO-1001 has no lines to post."` |
| No document specified | `"Document identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, orderNo, quoteNo, invoiceNo, creditMemoNo, blanketOrderNo, returnOrderNo)."` |
| Posting failure | Business Central posting validation message (e.g., missing posting setup, blocked customer) |

**Notes:**

- Supports all four sales document types: Order, Invoice, Credit Memo, and Return Order
- The document is posted using the standard Business Central `Sales-Post` codeunit
- The original document is deleted after successful posting (for orders and return orders)
- The response includes a `postedDocuments` array listing all documents created by the posting
- Shipment and return receipt entries include only type, SystemId, number, and posting date (no amounts)
- Invoice and credit memo entries include full financial details including customer ledger entry number
- The document does not need to be manually released first; Business Central handles the release internally during posting if needed
- Filter Table No: 36 (Sales Header)
- Message Direction: Inbound

---

## Sales.SalesInvoice.Pdf

**Purpose:** Retrieve a posted sales invoice as a PDF document.

**Description:** Retrieves a posted sales invoice as a PDF document using the configured report selection. The invoice can be identified by either the document number or SystemId (GUID).

**Message Direction:** Outbound

**Request Parameters:**

The invoice number or SystemId can be specified either in the **subject** field or in the **data** parameters:

**Option 1: Using subject field with invoice number**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp v1.0",
  "subject": "103001"
}
```

**Option 2: Using subject field with SystemId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using JSON data parameters with invoiceNo**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "invoiceNo": "103001"
  }
}
```

**Option 4: Using JSON data parameters with invoiceId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "invoiceId": "{12345678-1234-1234-1234-123456789012}"
  }
}
```

**Option 5: Using generic documentNo parameter**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesInvoice.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "documentNo": "103001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Sales invoice number or SystemId (GUID). Can be provided here or in data parameters.
  - Example (number): "103001"
  - Example (SystemId): "&#123;12345678-1234-1234-1234-123456789012&#125;"
- **invoiceNo** (optional): Sales invoice number in data field. Takes precedence over subject.
- **invoiceId** (optional): Sales invoice SystemId (GUID) in data field. Used if invoiceNo not provided.
- **documentNo** (optional): Generic document number alias. Used if invoice-specific parameters not provided.
- **documentId** (optional): Generic document SystemId alias. Used if other parameters not provided.

**Response Format:**

The initial response is a JSON object containing a download URL and the content type of the downloadable file:

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Call the `downloadUrl` to retrieve the PDF binary. The downloaded content has content type `application/pdf`. The PDF is generated using the configured report selection for Sales Invoice (S.Invoice).

**Error Messages:**

- `"Subject parameter is required. Provide the invoice number or SystemId."` - No subject provided
- `"Sales Invoice {subject} not found."` - Invoice doesn't exist
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid version

**Notes:**

- The PDF is generated using the report selection configured in Report Selections for Sales Invoice
- The system uses customer-specific reports if configured, otherwise the default report
- Subject can be either the invoice number (e.g., "103001") or the SystemId GUID
- The PDF format and content depend on the configured report layout
- Requires read permission on Sales Invoice Header and Report Selections tables
- Filter Table No: 112 (Sales Invoice Header)
- Message Direction: Outbound

**Related Message Types:**

- [Sales.SalesShipment.Pdf](#salessalesshipmentpdf): Retrieve sales shipment PDF
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf): Retrieve sales credit memo PDF
- [Sales.ReturnReceipt.Pdf](#salesreturnreceiptpdf): Retrieve return receipt PDF
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full invoice record data in JSON format

---

## Sales.SalesShipment.Pdf

**Purpose:** Retrieve a posted sales shipment as a PDF document.

**Description:** Retrieves a posted sales shipment as a PDF document using the configured report selection. The shipment can be identified by either the document number or SystemId (GUID).

**Message Direction:** Outbound

**Request Parameters:**

The shipment number or SystemId can be specified either in the **subject** field or in the **data** parameters:

**Option 1: Using subject field with shipment number**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesShipment.Pdf",
  "source": "MyApp v1.0",
  "subject": "102001"
}
```

**Option 2: Using subject field with SystemId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesShipment.Pdf",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using JSON data parameters with shipmentNo**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesShipment.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "shipmentNo": "102001"
  }
}
```

**Option 4: Using JSON data parameters with shipmentId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesShipment.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "shipmentId": "{12345678-1234-1234-1234-123456789012}"
  }
}
```

**Option 5: Using generic documentNo parameter**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesShipment.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "documentNo": "102001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Sales shipment number or SystemId (GUID). Can be provided here or in data parameters.
  - Example (number): "102001"
  - Example (SystemId): "&#123;12345678-1234-1234-1234-123456789012&#125;"
- **shipmentNo** (optional): Shipment number in data field. Takes precedence over subject.
- **shipmentId** (optional): Shipment SystemId (GUID) in data field. Used if shipmentNo not provided.
- **documentNo** (optional): Generic document number alias. Used if shipment-specific parameters not provided.
- **documentId** (optional): Generic document SystemId alias. Used if other parameters not provided.

**Response Format:**

The initial response is a JSON object containing a download URL and the content type of the downloadable file:

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Call the `downloadUrl` to retrieve the PDF binary. The downloaded content has content type `application/pdf`. The PDF is generated using the configured report selection for Sales Shipment (S.Shipment).

**Error Messages:**

- `"Subject parameter is required. Provide the shipment number or SystemId."` - No subject provided
- `"Sales Shipment {subject} not found."` - Shipment doesn't exist
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid version

**Notes:**

- The PDF is generated using the report selection configured in Report Selections for Sales Shipment
- The system uses customer-specific reports if configured, otherwise the default report
- Subject can be either the shipment number (e.g., "102001") or the SystemId GUID
- The PDF format and content depend on the configured report layout
- Requires read permission on Sales Shipment Header and Report Selections tables
- Filter Table No: 110 (Sales Shipment Header)
- Message Direction: Outbound

**Related Message Types:**

- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve sales invoice PDF
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf): Retrieve sales credit memo PDF
- [Sales.ReturnReceipt.Pdf](#salesreturnreceiptpdf): Retrieve return receipt PDF
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full shipment record data in JSON format

---

## Sales.SalesCreditMemo.Pdf

**Purpose:** Retrieve a posted sales credit memo as a PDF document.

**Description:** Retrieves a posted sales credit memo as a PDF document using the configured report selection. The credit memo can be identified by either the document number or SystemId (GUID).

**Message Direction:** Outbound

**Request Parameters:**

The credit memo number or SystemId can be specified either in the **subject** field or in the **data** parameters:

**Option 1: Using subject field with credit memo number**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesCreditMemo.Pdf",
  "source": "MyApp v1.0",
  "subject": "104001"
}
```

**Option 2: Using subject field with SystemId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesCreditMemo.Pdf",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using JSON data parameters with creditMemoNo**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesCreditMemo.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "creditMemoNo": "104001"
  }
}
```

**Option 4: Using JSON data parameters with creditMemoId**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesCreditMemo.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "creditMemoId": "{12345678-1234-1234-1234-123456789012}"
  }
}
```

**Option 5: Using generic documentNo parameter**
```json
{
  "specversion": "1.0",
  "type": "Sales.SalesCreditMemo.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "documentNo": "104001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Sales credit memo number or SystemId (GUID). Can be provided here or in data parameters.
  - Example (number): "104001"
  - Example (SystemId): "&#123;12345678-1234-1234-1234-123456789012&#125;"
- **creditMemoNo** (optional): Credit memo number in data field. Takes precedence over subject.
- **creditMemoId** (optional): Credit memo SystemId (GUID) in data field. Used if creditMemoNo not provided.
- **documentNo** (optional): Generic document number alias. Used if credit memo-specific parameters not provided.
- **documentId** (optional): Generic document SystemId alias. Used if other parameters not provided.

**Response Format:**

The initial response is a JSON object containing a download URL and the content type of the downloadable file:

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Call the `downloadUrl` to retrieve the PDF binary. The downloaded content has content type `application/pdf`. The PDF is generated using the configured report selection for Sales Credit Memo (S.Cr.Memo).

**Error Messages:**

- `"Subject parameter is required. Provide the credit memo number or SystemId."` - No subject provided
- `"Sales Credit Memo {subject} not found."` - Credit memo doesn't exist
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid version

**Notes:**

- The PDF is generated using the report selection configured in Report Selections for Sales Credit Memo
- The system uses customer-specific reports if configured, otherwise the default report
- Subject can be either the credit memo number (e.g., "104001") or the SystemId GUID
- The PDF format and content depend on the configured report layout
- Requires read permission on Sales Cr.Memo Header and Report Selections tables
- Filter Table No: 114 (Sales Cr.Memo Header)
- Message Direction: Outbound

**Related Message Types:**

- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve sales invoice PDF
- [Sales.SalesShipment.Pdf](#salessalesshipmentpdf): Retrieve sales shipment PDF
- [Sales.ReturnReceipt.Pdf](#salesreturnreceiptpdf): Retrieve return receipt PDF
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full credit memo record data in JSON format

---

## Sales.ReturnReceipt.Pdf

**Purpose:** Retrieve a posted return receipt as a PDF document.

**Description:** Retrieves a posted return receipt as a PDF document using the configured report selection. The return receipt can be identified by either the document number or SystemId (GUID).

**Message Direction:** Outbound

**Request Parameters:**

The return receipt number or SystemId can be specified either in the **subject** field or in the **data** parameters:

**Option 1: Using subject field with return receipt number**
```json
{
  "specversion": "1.0",
  "type": "Sales.ReturnReceipt.Pdf",
  "source": "MyApp v1.0",
  "subject": "105001"
}
```

**Option 2: Using subject field with SystemId**
```json
{
  "specversion": "1.0",
  "type": "Sales.ReturnReceipt.Pdf",
  "source": "MyApp v1.0",
  "subject": "{12345678-1234-1234-1234-123456789012}"
}
```

**Option 3: Using JSON data parameters with returnReceiptNo**
```json
{
  "specversion": "1.0",
  "type": "Sales.ReturnReceipt.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "returnReceiptNo": "105001"
  }
}
```

**Option 4: Using JSON data parameters with returnReceiptId**
```json
{
  "specversion": "1.0",
  "type": "Sales.ReturnReceipt.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "returnReceiptId": "{12345678-1234-1234-1234-123456789012}"
  }
}
```

**Option 5: Using generic documentNo parameter**
```json
{
  "specversion": "1.0",
  "type": "Sales.ReturnReceipt.Pdf",
  "source": "MyApp v1.0",
  "data": {
    "documentNo": "105001"
  }
}
```

**Request Parameters:**

- **subject** (optional): Return receipt number or SystemId (GUID). Can be provided here or in data parameters.
  - Example (number): "105001"
  - Example (SystemId): "&#123;12345678-1234-1234-1234-123456789012&#125;"
- **returnReceiptNo** (optional): Return receipt number in data field. Takes precedence over subject.
- **returnReceiptId** (optional): Return receipt SystemId (GUID) in data field. Used if returnReceiptNo not provided.
- **documentNo** (optional): Generic document number alias. Used if return receipt-specific parameters not provided.
- **documentId** (optional): Generic document SystemId alias. Used if other parameters not provided.

**Response Format:**

The initial response is a JSON object containing a download URL and the content type of the downloadable file:

```json
{
  "downloadUrl": "/api/origo/bifrost/v1.0/responses({guid})",
  "contentType": "application/pdf"
}
```

Call the `downloadUrl` to retrieve the PDF binary. The downloaded content has content type `application/pdf`. The PDF is generated using the configured report selection for Return Receipt (S.Ret.Rcpt.).

**Error Messages:**

- `"Subject parameter is required. Provide the return receipt number or SystemId."` - No subject provided
- `"Return Receipt {subject} not found."` - Return receipt doesn't exist
- `"Unsupported specification version {version}. Expected version 1.0."` - Invalid version

**Notes:**

- The PDF is generated using the report selection configured in Report Selections for Return Receipt
- The system uses customer-specific reports if configured, otherwise the default report
- Subject can be either the return receipt number (e.g., "105001") or the SystemId GUID
- The PDF format and content depend on the configured report layout
- Requires read permission on Return Receipt Header and Report Selections tables
- Filter Table No: 6660 (Return Receipt Header)
- Message Direction: Outbound

**Related Message Types:**

- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve sales invoice PDF
- [Sales.SalesShipment.Pdf](#salessalesshipmentpdf): Retrieve sales shipment PDF
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf): Retrieve sales credit memo PDF
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget): Retrieve full return receipt record data in JSON format

---

## Integration Patterns

### Pattern 1: Order Entry Workflow with Validation

Complete order entry workflow with credit check, availability check, and pricing validation before releasing:

```
1. Customer.CreditLimit.Get → Verify customer has available credit
2. Item.Availability.Get → Check item availability for delivery date
3. Item.Price.Get → Retrieve current pricing
4. Data.Records.Set → Create sales order header and lines
5. Sales.Document.Release → Release order for processing
```

### Pattern 2: Inventory Management Dashboard

Real-time inventory dashboard using availability and pricing information:

```
1. Data.Records.Get → Get list of items (Item table)
2. Item.Availability.Get → Get availability for each item
3. Item.Price.Get → Get pricing information for each item
4. Display combined inventory and pricing dashboard
```

### Pattern 3: Customer Portal Integration

E-commerce or customer portal integration workflow:

```
1. Customer.CreditLimit.Get → Display available credit to customer
2. Item.Availability.Get → Show available quantities
3. Item.Price.Get → Display customer-specific pricing
4. Data.Records.Set → Create order from portal
5. Sales.Document.Release → Auto-release based on credit/availability rules
```

---

## Related Documentation

- **[API_Reference.md](/foundation/reference/api/)** - Main API reference with Queue, Task, and Response API endpoints
- **[Data_Message_Types.md](/foundation/message-types/data/)** - Data message types (Data.Records.Get, Data.Records.Set, Data.RecordIds.Get)
- **[Metadata_Message_Types.md](/foundation/message-types/metadata/)** - Metadata message types (Help.Tables.Get, Help.Fields.Get, etc.)
- **[Setup_Reference.md](/foundation/reference/setup/)** - Configuration and setup information

---

## Sales.Document.Create

**Purpose:** Create a new sales document header for a specified customer and document type.

**Direction:** Inbound (Action request)

**Filter Table:** Sales Header (36)

**Description:** Creates a new sales document (Quote, Order, Invoice, Credit Memo, Blanket Order, or Return Order) for a customer. Only the header is created — lines must be added separately using Data.Records.Set.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | No | Customer number or SystemId (GUID) |
| data.documentType | Yes | Document type: "Quote", "Order", "Invoice", "Credit Memo", "Blanket Order", "Return Order" |
| data.postingDate | No | Posting date (ISO YYYY-MM-DD). Defaults to WorkDate |
| data.no | No | Customer number (alternative to subject) |
| data.id | No | Customer SystemId (GUID, alternative to subject) |
| data.systemId | No | Customer SystemId (GUID, alternative to subject) |
| data.recordSystemId | No | Customer SystemId (GUID, alternative to subject) |

### Customer Lookup Priority

1. **subject** field: GUID → GetBySystemId, plain text → Get by No.
2. **data** JSON keys (first match): no, id, systemId, recordSystemId

### Example Requests

**Create a sales order for customer 10000:**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Create",
  "source": "MyApp v1.0",
  "subject": "10000",
  "data": {
    "documentType": "Order"
  }
}
```

**Create a sales invoice with a custom posting date:**
```json
{
  "specversion": "1.0",
  "type": "Sales.Document.Create",
  "source": "OrderSync v2.0",
  "data": {
    "documentType": "Invoice",
    "no": "10000",
    "postingDate": "2026-04-15"
  }
}
```

### Response Format

Returns JSON in Data.Records.Get format:

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-...",
      "primaryKey": {
        "DocumentType": "Order",
        "No_": "SO-001"
      },
      "fields": {
        "DocumentType": "Order",
        "No_": "SO-001",
        "SelltoCustomerNo_": "10000",
        "SelltoCustomerName": "Adatum Corporation",
        "PostingDate": "2026-03-07",
        "Status": "Open"
      }
    }
  ]
}
```

### Error Responses

| Error | Cause |
|-------|-------|
| `documentType is required in request JSON` | Missing documentType in data |
| `Invalid document type 'X'` | Unrecognized document type value |
| Customer not found | No customer matches the provided identifier |

**Implementation Notes:**

- Document number is assigned by the number series on Insert
- Customer triggers are executed via Validate("Sell-to Customer No.")
- Posting date defaults to WorkDate() if not specified or invalid
- Response uses Data.Records.Get format with all header fields

**Related Message Types:**

- [Sales.Document.Release](#salesdocumentrelease): Release a sales document
- [Sales.Document.Reopen](/foundation/reference/message-types/sales-document-reopen/): Reopen a released sales document
- [Sales.Document.Post](#salesdocumentpost): Post a sales document
- [Data.Records.Set](/foundation/message-types/data/): Add lines to the created document

---

## Sales.Document.PreviewPost

**Purpose:** Simulate posting a sales document and return all resulting ledger entries without committing any changes.

**Description:** Drives the standard BC posting routine (`Codeunit "Sales-Post (Yes/No)"`) through `Codeunit "Gen. Jnl.-Post Preview"`, which captures every entry that *would* be inserted and then rolls back the transaction. Use this to validate that a document can be posted, show an AI agent the exact financial impact, or surface predicted document numbers and totals before posting.

**Message Direction:** Inbound

**Side effects:** None — the transaction is always rolled back. The sales header remains unchanged.

**Supported Document Types:** Order, Invoice, Credit Memo, Return Order.

**Input Parameters:**

- `source` (required): Description of the calling application.
- `subject` (required/optional): Sales document number or SystemId (GUID). May also be supplied via the `data` payload.
- `data` (optional): JSON object with the document identifier. **First matched key wins**:
  - `systemId` / `recordSystemId` / `id`: Record SystemId (GUID).
  - `orderNo`: Sales order number (Document Type = Order).
  - `invoiceNo`: Sales invoice number.
  - `creditMemoNo`: Sales credit memo number.
  - `returnOrderNo`: Sales return order number.

**Document Selection Methods:** Any one of the following identifies the document:

1. `subject` as plain text — looked up as document `No.` across all four document types.
2. `subject` as GUID — looked up as `SystemId` on Sales Header.
3. `data.systemId` / `data.recordSystemId` / `data.id` — SystemId lookup.
4. `data.orderNo` / `data.invoiceNo` / `data.creditMemoNo` / `data.returnOrderNo` — typed `No.` lookup restricted to the matching Document Type.

**Response Format:**

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting Order SO-001 for customer C01 would create 6 ledger entries across 6 tables. Transaction is balanced.",
  "documentType": "Order",
  "documentNo": "SO-001",
  "customerNo": "C01",
  "customerName": "Acme Customer",
  "lcyCode": "USD",
  "documentCurrencyCode": "EUR",
  "documentExchangeRate": 1.08,
  "predictedNumbers": {
    "postedInvoiceNo": "SI-00045",
    "postedShipmentNo": "SS-00045"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 1080.00,
    "totalCreditLCY": 1080.00,
    "totalDebitFCY": 1000.00,
    "totalCreditFCY": 1000.00
  },
  "preview": [
    { "tableId": 17, "tableName": "G/L Entry", "tableCaption": "G/L Entry", "description": "...", "entryCount": 3, "entries": [ /* full row JSON per entry */ ] },
    { "tableId": 254, "tableName": "VAT Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 32, "tableName": "Item Ledger Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 5802, "tableName": "Value Entry", "entryCount": 1, "entries": [ ] },
    { "tableId": 21, "tableName": "Cust. Ledger Entry", "entryCount": 1, "entries": [ { "Amount": 1000.00, "AmountLCY": 1080.00, "CurrencyCode": "EUR" } ] },
    { "tableId": 380, "tableName": "Detailed Cust. Ledg. Entry", "entryCount": 1, "entries": [ ] }
    /* additional populated tables (e.g. Job Ledger Entry, FA Ledger Entry, Bank Account Ledger Entry, ...) appear here when the document touches them */
  ]
}
```

**Response Fields:**

- `status`: `"Success"` or `"Error"`.
- `rollback`: Always `true` on success — confirms no data was persisted.
- `summary`: One-line natural-language description.
- `documentType` / `documentNo` / `customerNo` / `customerName`: Source document context.
- `lcyCode`: Local Currency Code from G/L Setup.
- `documentCurrencyCode`: Empty when the document is in LCY.
- `documentExchangeRate`: FCY→LCY rate. **Always `1` when `documentCurrencyCode` is empty.**
- `predictedNumbers`: Document numbers that *would* be assigned by the No. Series at the moment of preview. For Order: `postedInvoiceNo` + `postedShipmentNo`; for Invoice: `postedInvoiceNo`; for Credit Memo: `postedCreditMemoNo`; for Return Order: `postedCreditMemoNo` + `postedReturnReceiptNo`. These are informational, not reservations.
- `totals.balanced`: `true` when LCY debits equal LCY credits (rounded to 0.01).
- `totals.totalDebit*` / `totalCredit*`: Sum of G/L Entry Debit/Credit amounts in LCY and FCY.
- `preview[]`: One element per ledger table populated by the BC posting routine. Tables are discovered dynamically via `Codeunit "Posting Preview Event Handler".FillDocumentEntry()`. The native helper provides curated field-name blocks for 17 BC ledger tables (G/L Entry, VAT Entry, Item Ledger Entry, Value Entry, Cust. / Detailed Cust. Ledger, Vendor / Detailed Vendor Ledger, Bank Account Ledger Entry, FA Ledger Entry, Maintenance Ledger Entry, Job Ledger Entry, Res. Ledger Entry, Service Ledger Entry, Warranty Ledger Entry, Employee / Detailed Employee Ledger Entry); extension tables added via the `OnGetPreviewFieldNames` event are included too.
- `preview[].entries[]`: Full row JSON per captured entry. Field names use mechanical normalization (`No.` → `No_`, `Amount (LCY)` → `AmountLCY`, etc.). Read-restricted fields configured in `Field Access ori` are omitted.

**Currency Invariant:**

`documentCurrencyCode == "" ⇒ documentExchangeRate == 1 ∧ totalDebitFCY == totalDebitLCY ∧ totalCreditFCY == totalCreditLCY`

When the document is in LCY, the FCY columns mirror the LCY columns and the exchange rate is `1`. Per-entry currency context is also available on each multi-currency entry (`CurrencyCode`, `Amount`, `AmountLCY`).

**Predicted vs Actual:** Between preview and actual posting another transaction may consume the predicted No. Series numbers, so the actual posted numbers may differ. Use `predictedNumbers` for informational display only.

**Error Scenarios:**

- Sales document not found → `{"status":"Error","error":"..."}`.
- Document has no lines → error mentioning "no lines".
- Posting validation failure → underlying BC error text is returned.

**Related Message Types:**

- [Sales.Document.Post](#salesdocumentpost): Actually posts the document (no rollback).
- [Sales.Document.Statistics](#salesdocumentstatistics): Header/line totals without simulating posting.


---

## Customer.Application.Post

**Purpose:** Apply one customer ledger entry (the *applying* entry) against one or more open customer ledger entries (the *applied-to* entries) and post the application via Microsoft codeunit 226 `"CustEntry-Apply Posted Entries"`.

**Description:** Mirrors the behaviour of the Apply Customer Entries page. The applying entry's `"Applies-to ID"` and `"Amount to Apply"` are stamped, each target entry is tagged with the same `Applies-to ID`, and `CustEntry-Apply Posted Entries.Apply` posts the application. All entries must belong to the same customer.

**Message Direction:** Inbound

**Supported Tables:** Cust. Ledger Entry (21)

### Request Format

**Bifrost Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| subject | Yes* | SystemId (GUID) or Entry No. (integer) of the applying customer ledger entry |
| type | Yes | `Customer.Application.Post` |

*The applying entry may also be identified via `systemId`, `recordSystemId`, `id`, `entryNo` or `entryNumber` in the request JSON.

**Request JSON:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| appliesToEntries | Array | Yes | Non-empty array of target entries to apply. Each element may be an integer (Entry No.), a GUID string (SystemId), or an object with `entryNo` / `entryNumber` / `systemId` / `recordSystemId` / `id`. |
| postingDate | Date | No | Posting date of the application. Defaults to the applying entry's posting date. |
| documentNo | Code[20] | No | Document No. stamped on the application. Defaults to the applying entry's document no. |
| amountToApply | Decimal | No | Amount to apply from the applying entry. Defaults to the entry's `Remaining Amount`. |

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Customer.Application.Post",
  "subject": "1234",
  "data": {
    "appliesToEntries": [5678, 5679],
    "postingDate": "2025-02-15",
    "documentNo": "PAY-2025-0001",
    "amountToApply": 1500.00
  }
}
```

### Response Format

```json
{
  "status": "Success",
  "applyingEntryNo": 1234,
  "applyingRecordSystemId": "a1b2c3d4-...",
  "customerNo": "10000",
  "documentNo": "PAY-2025-0001",
  "postingDate": "2025-02-15",
  "amountToApply": "1500.00",
  "totalApplied": "1500.00",
  "remainingAmount": "0.00",
  "open": false,
  "applications": [
    {
      "entryNo": 5678,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "INV-1001",
      "amountApplied": "1000.00"
    },
    {
      "entryNo": 5679,
      "recordSystemId": "...",
      "documentType": "Invoice",
      "documentNo": "INV-1002",
      "amountApplied": "500.00"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| applyingEntryNo | Integer | Entry No. of the applying entry |
| applyingRecordSystemId | GUID | SystemId of the applying entry |
| customerNo | Code[20] | Customer No. of the applying entry |
| documentNo | Code[20] | Document No. used for the application |
| postingDate | Date | Posting date used for the application |
| amountToApply | Decimal | Amount that was set as `Amount to Apply` on the applying entry |
| totalApplied | Decimal | Sum of `amountApplied` across all target entries |
| remainingAmount | Decimal | Remaining amount on the applying entry after the application |
| open | Boolean | Whether the applying entry is still open after the application |
| applications | Array | One entry per target. See below. |
| applications[].entryNo | Integer | Entry No. of the target entry |
| applications[].recordSystemId | GUID | SystemId of the target entry |
| applications[].documentType | Text | Document type of the target entry |
| applications[].documentNo | Code[20] | Document No. of the target entry |
| applications[].amountApplied | Decimal | Amount that was applied against the target entry |

### Configuration

None. The implementation uses Microsoft codeunit 226 and standard customer ledger entries directly.

### Error Scenarios

- Missing identifier on subject and request JSON.
- Applying entry not found by SystemId or Entry No.
- Applying entry not open.
- `appliesToEntries` missing or empty.
- A target entry belongs to a different customer than the applying entry.
- A target entry is closed.
- Microsoft codeunit 226 rejects the application (caller still receives a structured JSON error with callstack).

### Related Message Types

- [Customer.Application.Reverse](#customerapplicationreverse) - Reverse a posted application.
- [Customer.CreditLimit.Get](#customercreditlimitget) - Retrieve credit limit information for the customer.

---

## Customer.Application.Reverse

**Purpose:** Reverse (unapply) a posted application on a customer ledger entry via Microsoft codeunit 226 `"CustEntry-Apply Posted Entries.PostUnApplyCustomer"`.

**Description:** By default the most recent application on the supplied entry is reversed. A specific application can be targeted by passing `detailedEntryNo`. Microsoft codeunit 226 enforces unapply rules (e.g. no later transactions that depend on this application).

**Message Direction:** Inbound

**Supported Tables:** Cust. Ledger Entry (21)

### Request Format

**Bifrost Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| subject | Yes* | SystemId (GUID) or Entry No. (integer) of the customer ledger entry whose application should be reversed |
| type | Yes | `Customer.Application.Reverse` |

*The entry may also be identified via `systemId`, `recordSystemId`, `id`, `entryNo` or `entryNumber` in the request JSON.

**Request JSON:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| detailedEntryNo | Integer | No | Detailed Cust. Ledg. Entry No. of the application to reverse. Defaults to the last application on the entry. |
| postingDate | Date | No | Posting date of the reversal. Defaults to the application's posting date. |
| documentNo | Code[20] | No | Document No. stamped on the reversal. Defaults to the application's document no. |

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Customer.Application.Reverse",
  "subject": "1234",
  "data": {
    "postingDate": "2025-02-15",
    "documentNo": "REV-2025-0001"
  }
}
```

### Response Format

```json
{
  "status": "Success",
  "entryNo": 1234,
  "recordSystemId": "...",
  "customerNo": "10000",
  "reversedDetailedEntryNo": 5678,
  "reversedAmount": "1500.00",
  "postingDate": "2025-02-15",
  "documentNo": "REV-2025-0001",
  "remainingAmount": "1500.00",
  "open": true
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` or `Error` |
| entryNo | Integer | Entry No. of the customer ledger entry |
| recordSystemId | GUID | SystemId of the customer ledger entry |
| customerNo | Code[20] | Customer No. of the entry |
| reversedDetailedEntryNo | Integer | Detailed Cust. Ledg. Entry No. that was reversed |
| reversedAmount | Decimal | Amount that was reversed |
| postingDate | Date | Posting date used for the reversal |
| documentNo | Code[20] | Document No. used for the reversal |
| remainingAmount | Decimal | Remaining amount on the entry after the reversal |
| open | Boolean | Whether the entry is open after the reversal |

### Configuration

None. The implementation uses Microsoft codeunit 226 directly.

### Error Scenarios

- Missing identifier on subject and request JSON.
- Entry not found.
- The entry has no posted application that can be reversed.
- Supplied `detailedEntryNo` does not exist or is not an Application entry.
- Microsoft codeunit 226 rejects the unapply (e.g. later transactions block the unapply).

### Related Message Types

- [Customer.Application.Post](#customerapplicationpost) - Apply customer ledger entries.

---

## Sales.Quote.MakeOrder

**Purpose:** Convert a sales quote into a sales order.

**Direction:** Inbound (Action request)

**Filter Table:** Sales Header (36)

**Description:** Invokes the standard BC `Codeunit "Sales-Quote to Order"` (codeunit 86) to convert an existing sales quote into a sales order. The original quote is deleted and a new sales order is created with the same customer, lines, and dimensions. Returns the new order number along with key header fields.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | Yes | Quote document number or SystemId (GUID) of the Sales Header |

### Subject Identification Order

The subject value is resolved via `FindSalesHeader`:
1. If subject is a valid GUID → `GetBySystemId`
2. Otherwise → `Get` by document number across all sales document types

The resolved document **must** have `Document Type = Quote`, otherwise an error is returned.

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Sales.Quote.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "SQ-001"
}
```

### Response Format (Success)

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` on success, `Error` on failure |
| quoteNo | Code[20] | Number of the original quote that was converted |
| orderNo | Code[20] | Number of the newly created sales order |
| orderSystemId | Guid | SystemId (GUID) of the new sales order header |
| customerNo | Code[20] | Sell-to customer number |
| customerName | Text | Sell-to customer name |
| documentDate | Date | ISO date (yyyy-MM-dd) — document date of the new order |
| orderDate | Date | ISO date (yyyy-MM-dd) — order date of the new order |

### Error Responses

| Error | Cause |
|-------|-------|
| `Subject parameter is required.` | Subject was empty |
| `Sales document {No} not found.` | No sales header matches the subject |
| `Sales document {No} is not a Quote (actual type: {Type}).` | Subject resolved to a non-Quote document |
| Error text from BC | The standard `Sales-Quote to Order` codeunit raised an error (callstack included as `callstack` field) |

### Related Message Types

- [Sales.Document.Create](#salesdocumentcreate): Create a quote from scratch
- [Sales.Document.Release](#salesdocumentrelease): Release the resulting order
- [Sales.Document.Post](#salesdocumentpost): Post the resulting order

---

## Sales.BlanketOrder.MakeOrder

**Purpose:** Convert a sales blanket order into a sales order.

**Direction:** Inbound (Action request)

**Filter Table:** Sales Header (36)

**Description:** Invokes the standard BC `Codeunit "Blanket Sales Order to Order"` (codeunit 87) to create a new sales order from a blanket order. Lines with `Qty. to Ship > 0` are transferred to the new order; the blanket order remains and outstanding quantities are reduced accordingly.

### Request Format

| Parameter | Required | Description |
|-----------|----------|-------------|
| source | Yes | Calling application identifier |
| subject | Yes | Blanket order document number or SystemId (GUID) of the Sales Header |

### Subject Identification Order

1. If subject is a valid GUID → `GetBySystemId`
2. Otherwise → `Get` by document number across all sales document types

The resolved document **must** have `Document Type = Blanket Order`, otherwise an error is returned.

### Prerequisites

Each blanket-order line that should be transferred must have `Qty. to Ship > 0` (use Data.Records.Set first to set the values). Lines with zero `Qty. to Ship` are skipped.

### Example Request

```json
{
  "specversion": "1.0",
  "type": "Sales.BlanketOrder.MakeOrder",
  "source": "MyApp v1.0",
  "subject": "SB-001"
}
```

### Response Format (Success)

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` on success, `Error` on failure |
| blanketOrderNo | Code[20] | Number of the source blanket order |
| orderNo | Code[20] | Number of the newly created sales order |
| orderSystemId | Guid | SystemId (GUID) of the new sales order header |
| customerNo | Code[20] | Sell-to customer number |
| customerName | Text | Sell-to customer name |
| documentDate | Date | ISO date (yyyy-MM-dd) — document date of the new order |
| orderDate | Date | ISO date (yyyy-MM-dd) — order date of the new order |

### Error Responses

| Error | Cause |
|-------|-------|
| `Subject parameter is required.` | Subject was empty |
| `Sales document {No} not found.` | No sales header matches the subject |
| `Sales document {No} is not a Blanket Order (actual type: {Type}).` | Subject resolved to a non-blanket document |
| Error text from BC | The standard `Blanket Sales Order to Order` codeunit raised an error (e.g. no lines with `Qty. to Ship > 0`); callstack included as `callstack` field |

### Related Message Types

- [Sales.Document.Create](#salesdocumentcreate): Create a blanket order from scratch
- [Sales.Document.Release](#salesdocumentrelease): Release the resulting order
- [Sales.Quote.MakeOrder](#salesquotemakeorder): Sister operation for sales quotes

---


## Sales.SalesInvoice.Correct

**Purpose:** Cancel a posted sales invoice and start a new draft sales invoice for correction.

**Description:** Wraps BC standard codeunit 1303 `Correct Posted Sales Invoice` method `CancelPostedInvoiceCreateNewInvoice`. Posts a corrective credit memo against the original invoice and creates a new draft `Sales Header` (Document Type = Invoice) initialised from the original invoice.

**Message Direction:** Inbound

**Posting Gate:** `G/L`. The request is rejected when G/L posting is disabled in Bifrost Setup.

**Identifier Resolution Order:** GUID via Subject (SystemId) ? Subject as `No.` (Get) ? JSON keys (`systemId`, `recordSystemId`, `id`, `invoiceNo`, `no`, `documentNo`).

**Input Parameters:**

```json
{
  "type": "Sales.SalesInvoice.Correct",
  "subject": "POST-INV-000123"
}
```

Or by SystemId:

```json
{
  "type": "Sales.SalesInvoice.Correct",
  "subject": "5f0d3b6e-3e8e-4a8b-9f6b-1d3c4e5f6a7b"
}
```

Or by JSON data:

```json
{
  "type": "Sales.SalesInvoice.Correct",
  "data": { "invoiceNo": "POST-INV-000123" }
}
```

**Response Format:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "POST-INV-000123",
  "originalInvoiceId": "5f0d3b6e-3e8e-4a8b-9f6b-1d3c4e5f6a7b",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "cancellingCreditMemo": {
    "no": "PCM-000456",
    "id": "1a2b3c4d-..."
  },
  "newDraftInvoice": {
    "no": "SI-000789",
    "id": "9f8e7d6c-...",
    "documentType": "Invoice"
  }
}
```

**Response Fields:**
- `originalInvoiceNo` / `originalInvoiceId`: identifiers of the cancelled invoice
- `customerNo` / `customerName`: from the original invoice
- `cancellingCreditMemo.no` / `.id`: the corrective credit memo posted by BC (looked up via `Cancelled Document` table)
- `newDraftInvoice.no` / `.id` / `.documentType`: the new draft `Sales Header` created by BC

**Process Flow:**
1. Resolve the posted invoice from `subject` or request JSON.
2. Enforce the `G/L` posting gate.
3. Run BC `CancelPostedInvoiceCreateNewInvoice` inside an isolated `Codeunit.Run` so BC errors are returned as JSON with full callstack.
4. BC posts a cancelling sales credit memo, fully applies it to the original invoice, and creates a new draft `Sales Header` (Document Type = Invoice) copied from the original.
5. The cancelling credit memo is looked up via the `Cancelled Document` link table (`Source ID` = 112, `Cancelled Doc. No.` = original invoice).
6. Original, cancelling credit memo, and new draft are returned in a single JSON response.

**Output Documents:**

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `.no` |
| New editable draft invoice | `Sales Header` (Document Type = Invoice) | `newDraftInvoice.id` / `.no` |

**Document Linkage:**
- Original invoice: `Cancelled = true`, `Canceled By Cr. Memo No.` = cancelling credit memo no.
- Cancelling credit memo: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = original invoice no.
- `Cancelled Document` table row: `Source ID` = 112, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.
- The new draft has no field-level FK to the original; it is linked only via this response payload.

**Fetching the Resulting Documents with Data.Records.Get:**

Each `id` is the BC `SystemId`. Use it with `Data.Records.Get`:

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

**Error Scenarios:**
- Missing identifier → `Error` with `Message subject or request data must contain a record identifier`.
- Invoice not found → `Error`.
- Invoice cannot be corrected (already cancelled, payments applied, posting period closed, etc.) → `Error` with BC error text and `callstack` field.

**Related Message Types:**
- [Sales.SalesInvoice.Cancel](#salessalesinvoicecancel): Cancel without creating a new draft.
- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve the original invoice as PDF.
- [Sales.Document.Post](#salesdocumentpost): Post the new draft invoice once edited.

---

## Sales.SalesInvoice.Cancel

**Purpose:** Cancel a posted sales invoice by posting a corrective credit memo.

**Description:** Wraps BC standard codeunit 1303 `Correct Posted Sales Invoice` method `CancelPostedInvoice`. Posts a corrective credit memo against the original invoice. Unlike `Correct`, no new draft invoice is created.

**Message Direction:** Inbound

**Posting Gate:** `G/L`. The request is rejected when G/L posting is disabled in Bifrost Setup.

**Identifier Resolution Order:** Identical to `Sales.SalesInvoice.Correct`.

**Input Parameters:**

```json
{
  "type": "Sales.SalesInvoice.Cancel",
  "subject": "POST-INV-000123"
}
```

**Response Format:**

```json
{
  "status": "Success",
  "originalInvoiceNo": "POST-INV-000123",
  "originalInvoiceId": "5f0d3b6e-...",
  "customerNo": "C00010",
  "customerName": "Customer Ltd.",
  "cancellingCreditMemo": {
    "no": "PCM-000456",
    "id": "1a2b3c4d-..."
  }
}
```

The `newDraftInvoice` object is intentionally omitted.

**Process Flow:**
1. Resolve the posted invoice from `subject` or request JSON.
2. Enforce the `G/L` posting gate.
3. Run BC `CancelPostedInvoice` inside an isolated `Codeunit.Run` so BC errors are returned as JSON with full callstack.
4. BC posts a cancelling sales credit memo and fully applies it to the original invoice. No draft is created.
5. The cancelling credit memo is looked up via the `Cancelled Document` link table (`Source ID` = 112, `Cancelled Doc. No.` = original invoice).
6. Original invoice and cancelling credit memo are returned in a single JSON response.

**Output Documents:**

| Role | BC Table | Identifier in Response |
|---|---|---|
| Original posted invoice (now Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `.no` |

**Document Linkage:**
- Original invoice: `Cancelled = true`, `Canceled By Cr. Memo No.` = cancelling credit memo no.
- Cancelling credit memo: `Applies-to Doc. Type = Invoice`, `Applies-to Doc. No.` = original invoice no.
- `Cancelled Document` table row: `Source ID` = 112, `Cancelled Doc. No.` = original invoice, `Cancelled By Doc. No.` = cancelling credit memo.

**Fetching the Resulting Documents with Data.Records.Get:**

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

**Error Scenarios:** Same as `Sales.SalesInvoice.Correct`.

**Related Message Types:**
- [Sales.SalesInvoice.Correct](#salessalesinvoicecorrect): Cancel and start a new draft for correction.
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf): Retrieve the resulting cancelling credit memo.

---

## Sales.SalesInvoice.Send

**Purpose:** Send a posted sales invoice through Business Central's standard send pipeline using a resolved Document Sending Profile.

**Description:** Wraps BC standard `Sales Invoice Header.SendProfile(var "Document Sending Profile")`. The profile to use is determined by a three-step resolution chain (request override → customer profile → system default). The send action itself runs through the standard BC dispatcher and respects every option (E-Mail, Disk, Printer, Electronic Document) configured on the resolved profile.

**Message Direction:** Inbound

**Posting Gate:** None. Sending a document does not produce ledger entries.

**Profile Resolution Order:**

1. **Request override** — if the request includes a `documentSendingProfile` code, it is loaded and used. If the code does not exist, the request fails with `Document Sending Profile {code} not found.`. Response field `documentSendingProfileSource` = `Request`.
2. **Customer profile** — if the customer's `Document Sending Profile` field is set, it is loaded and used. If the customer references a code that no longer exists, the request fails with `Customer {no} references Document Sending Profile {code} which no longer exists.`. Response field `documentSendingProfileSource` = `Customer`.
3. **System default** — the first `Document Sending Profile` with `Default = true` is used. Response field `documentSendingProfileSource` = `Default`.
4. **No match** — if none of the above resolves, the request fails with `No Document Sending Profile resolved for customer {no} and no system default exists.`.

**Identifier Resolution Order:**

1. `data.invoiceNo`
2. `data.invoiceId` (SystemId)
3. `subject` (either an invoice number or a SystemId GUID; GUIDs are detected automatically)

**Input Parameters:**

```json
{
  "type": "Sales.SalesInvoice.Send",
  "subject": "POST-INV-000123",
  "data": {
    "documentSendingProfile": "EMAIL"
  }
}
```

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | Text | One of subject / `invoiceNo` / `invoiceId` is required | Invoice no. or SystemId GUID |
| `data.invoiceNo` | Code[20] | Optional | Wins over `subject` and `invoiceId` |
| `data.invoiceId` | GUID | Optional | Used if `invoiceNo` is not supplied |
| `data.documentSendingProfile` | Code[20] | Optional | Overrides the customer + default resolution chain |

**Success Response:**

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

**Error Response:**

```json
{
  "status": "Error",
  "error": "Document Sending Profile NOSUCH not found.",
  "callstack": "..."
}
```

**Response Fields:**

| Field | Type | Description |
|---|---|---|
| `status` | Text | `Success` or `Error` |
| `documentType` | Text | Always `PostedSalesInvoice` for this message type |
| `documentNo` | Code[20] | Posted invoice number |
| `documentId` | GUID | Posted invoice SystemId |
| `customerNo` | Code[20] | Sell-to customer number |
| `customerName` | Text | Customer name |
| `documentSendingProfileCode` | Code[20] | The profile actually used to send |
| `documentSendingProfileSource` | Text | `Request`, `Customer`, or `Default` — which step of the resolution chain matched |
| `message` | Text | Human-readable summary |
| `error` | Text | Present only on `Error` — the underlying message |
| `callstack` | Text | Present only on `Error` — full BC callstack for diagnostics |

**Error Scenarios:**

| Error | Cause |
|---|---|
| `Subject parameter is required. Provide the invoice number or SystemId.` | No identifier supplied in `subject`, `invoiceNo`, or `invoiceId` |
| `Sales Invoice {no} not found.` | Identifier supplied but no matching `Sales Invoice Header` row |
| `Document Sending Profile {code} not found.` | Request override code does not exist |
| `Customer {no} references Document Sending Profile {code} which no longer exists.` | Customer profile code is dangling |
| `No Document Sending Profile resolved for customer {no} and no system default exists.` | No override, no customer profile, no default |
| (BC SendProfile errors) | Surfaced verbatim through `error` + `callstack` (e.g., missing e-mail account, unconfigured electronic document setup) |

**Notes:**

- The send work itself is delegated to BC's `SendProfile`, which runs inside an isolated `Codeunit.Run`. Any BC error is returned as JSON without rolling back the outer message-task transaction.
- The response always includes `documentSendingProfileSource` so callers can audit which fallback was applied.
- Sending does not modify the posted invoice in BC.

**Related Message Types:**
- [Sales.SalesCreditMemo.Send](#salessalescreditmemosend): Same pattern for posted credit memos.
- [Sales.SalesInvoice.Pdf](#salessalesinvoicepdf): Retrieve the invoice as a PDF rather than sending it through the standard send pipeline.

---

## Sales.SalesCreditMemo.Send

**Purpose:** Send a posted sales credit memo through Business Central's standard send pipeline using a resolved Document Sending Profile.

**Description:** Wraps BC standard `Sales Cr.Memo Header.SendProfile(var "Document Sending Profile")`. Profile resolution is identical to `Sales.SalesInvoice.Send`.

**Message Direction:** Inbound

**Posting Gate:** None.

**Profile Resolution Order:** Identical to [Sales.SalesInvoice.Send](#salessalesinvoicesend).

**Identifier Resolution Order:**

1. `data.creditMemoNo`
2. `data.creditMemoId` (SystemId)
3. `subject`

**Input Parameters:**

```json
{
  "type": "Sales.SalesCreditMemo.Send",
  "subject": "POST-CRM-000456",
  "data": {
    "documentSendingProfile": "EMAIL"
  }
}
```

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `subject` | Text | One of subject / `creditMemoNo` / `creditMemoId` is required | Credit memo no. or SystemId GUID |
| `data.creditMemoNo` | Code[20] | Optional | Wins over `subject` and `creditMemoId` |
| `data.creditMemoId` | GUID | Optional | Used if `creditMemoNo` is not supplied |
| `data.documentSendingProfile` | Code[20] | Optional | Overrides the customer + default resolution chain |

**Success Response:**

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

**Error Response:**

```json
{
  "status": "Error",
  "error": "Sales Credit Memo POST-CRM-999999 not found.",
  "callstack": "..."
}
```

**Response Fields:** Same as `Sales.SalesInvoice.Send` except `documentType` = `PostedSalesCreditMemo`.

**Error Scenarios:** Same as `Sales.SalesInvoice.Send` except the document-not-found error is `Sales Credit Memo {no} not found.`.

**Related Message Types:**
- [Sales.SalesInvoice.Send](#salessalesinvoicesend): Same pattern for posted invoices.
- [Sales.SalesCreditMemo.Pdf](#salessalescreditmemopdf): Retrieve the credit memo as a PDF rather than sending it through the standard send pipeline.
