---
id: api
title: "API reference"
sidebar_position: 2
---

## Overview

The Origo Bifrost extension provides API endpoints for managing and processing bifrost messages following the Bifrost specification. This document describes all available API endpoints and supported message types.

**Namespace:** `Origo.Bifrost`  
**API Publisher:** `origo`  
**API Group:** `bifrost`  
**API Version:** `v1.0`

---

## API Endpoints

### 1. Bifrost Data API — Response Data {#bifrost-data-api-response-data}

**Purpose:** Returns the response data content for a given message.

**Endpoint Details:**

- **Entity Name:** `response`
- **Entity Set Name:** `responses`
- **Base URL:** `/api/origo/bifrost/v1.0/responses`
- **Access:** Read-only (no insert or modify operations)

**Fields:**

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | Guid | Unique identifier of the message |
| `data` | Blob | Response data content |

**Supported Operations:**

- **GET** (single): Retrieve response data for a specific message by ID
- **GET** (collection): Retrieve all response data entries

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

---

### 1b. Request Data API ori — Request Payload

**Purpose:** Returns the original request data payload for a given message. Useful for inspecting or re-replaying what was sent.

**Endpoint Details:**

- **Entity Name:** `request`
- **Entity Set Name:** `requests`
- **Base URL:** `/api/origo/bifrost/v1.0/requests`
- **Access:** Read-only (no insert or modify operations)

**Fields:**

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | Guid | Unique identifier of the message |
| `data` | Blob | Original request payload (JSON, XML, or plain text) |

**Supported Operations:**

- **GET** (single): Retrieve request payload for a specific message by ID
- **GET** (collection): Retrieve all request data entries (filtered to the current user)

**Preferred — fetch the raw payload directly (no prior lookup needed):**

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')/data
Authorization: Bearer {token}
```

Or fetch the OData record (returns the `id` and `data` fields as JSON):

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')
Authorization: Bearer {token}
```

**Security:** Results are automatically filtered to records created by the calling application (`SystemCreatedBy = UserSecurityId()`).

---

### 2. Queue API ori {#queue-api-ori}

**Purpose:** Create message requests and get status for queued (asynchronous) messages.

**Endpoint Details:**

- **Entity Name:** `queue`
- **Entity Set Name:** `queues`
- **Base URL:** `/api/origo/bifrost/v1.0/queues`
- **Processing Mode:** Asynchronous (messages are scheduled for background processing)

**Fields:**

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `specversion` | Text | Bifrost specification version | Yes |
| `type` | Enum | Message type identifier | Yes |
| `source` | Text | Description of the application using the bifrost (e.g., "MyApp v1.2.3", "DataSync Service") | Yes |
| `id` | Guid | Unique identifier (auto-generated) | No |
| `time` | DateTime | Event timestamp | No |
| `subject` | Text | Subject of the event | No |
| `continueFromRecordId` | Guid | SystemId of the record to resume from in continuation-enabled message types (e.g., CSV.Records.Get). Omit for the first request; set to the value returned in a previous response to continue. | No |
| `lcid` | Integer | Windows Language ID for language-specific captions (e.g., 1033 for English, 1031 for German). If not specified, uses the Default Language Code from Bifrost Setup | No |
| `datacontenttype` | Text | Content type of the data (application/json, application/xml, text/plain) | No |
| `data` | BigText | Request parameters (JSON, XML, or plain text depending on implementation; all built-in message types require JSON) | No |

**Supported Operations:**

#### POST - Create Queue Message

Creates a new message request that will be processed asynchronously.

**Request Body:**

```json
{
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1033
}
```

**Response:** Returns the created message with assigned ID and timestamp. Once processing is complete, the `data` field will contain the download URL to retrieve the response data.

#### GET - Retrieve Queue Messages

Retrieves queued messages (messages with an assigned Task ID).

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/queues
```

#### PATCH - Update Queue Message

Not typically used for this API.

---

### Queue API Actions

#### RetryTask

Retries the processing of a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.RetryTask
```

**Description:** Attempts to reprocess a failed or completed message. If the task is already running it will not be restarted.

**Status Values:**

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Created | 201 Created | Task is already running and cannot be retried |
| Updated | 200 OK | Task was successfully restarted |
| None | 204 No Content | Failed to create a new background task |

---

#### CancelTask

Cancels the scheduled task for a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.CancelTask
```

**Description:** Cancels a running or scheduled background task. If no task is scheduled, the action returns immediately.

**Status Values:**

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Deleted | 204 No Content | No task was scheduled |
| Updated | 200 OK | Task was successfully cancelled |
| None | 204 No Content | Task cancellation failed |

---

#### GetStatus

Gets the status of a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Status Values:**

- **Created:** Message is still running/processing
- **Deleted:** No task is scheduled
- **Updated:** Task has been completed and results are available
- **None:** Message status is not known

**HTTP Status Codes:**

The GetStatus action returns standard HTTP status codes based on the message state:

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Created | 201 Created | Message is still being processed |
| Updated | 200 OK | Processing completed successfully |
| Deleted | 204 No Content | No task scheduled for this message |
| None | 204 No Content | Message status is not known |

**Response:** Returns the current processing status via the WebServiceActionContext.

---

### 3. Task API ori {#task-api-ori}

**Purpose:** Create and process bifrost messages synchronously (immediate processing).

**Endpoint Details:**

- **Entity Name:** `task`
- **Entity Set Name:** `tasks`
- **Base URL:** `/api/origo/bifrost/v1.0/tasks`
- **Processing Mode:** Synchronous (messages are processed immediately upon creation)

**Fields:**

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `specversion` | Text | Bifrost specification version | Yes |
| `type` | Enum | Message type identifier | Yes |
| `source` | Text | Description of the application using the bifrost (e.g., "MyApp v1.2.3", "DataSync Service") | Yes |
| `id` | Guid | Unique identifier (auto-generated) | No |
| `time` | DateTime | Event timestamp | No |
| `subject` | Text | Subject of the event | No |
| `continueFromRecordId` | Guid | SystemId of the record to resume from in continuation-enabled message types (e.g., CSV.Records.Get). Omit for the first request; set to the value returned in a previous response to continue. | No |
| `datacontenttype` | Text | Content type of the data (application/json, application/xml, text/plain) | No |
| `data` | BigText | Request parameters (JSON, XML, or plain text depending on implementation; all built-in message types require JSON) | No |

**Supported Operations:**

#### POST - Create and Process Task

Creates a new message and processes it immediately. The response will contain the download URL to the response data in the `data` field.

**Request Body:**

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

**Response:** Returns the message with the download URL to the response data in the `data` field.

#### GET - Retrieve Task Messages

Retrieves task messages (messages without an assigned Task ID).

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/tasks
```

---

## Message Types

The Bifrost extension supports the following message types for data operations and business workflows:

**Extensibility:** This extension can be extended with custom implementations for additional message types by implementing the `Msg Interface ori`. All built-in message types require JSON format in the `data` field for request parameters.

### Message Type Categories

For detailed documentation, see the specialized reference documents:

- **[Data Message Types](/foundation/message-types/data/)** - Data operations for retrieving and updating Business Central records
- **[Metadata Message Types](/foundation/message-types/metadata/)** - Schema discovery and API metadata operations
- **[Sales Message Types](/foundation/message-types/sales/)** - Business operations for sales, customers, and items
- **[Purchase Message Types](/foundation/message-types/purchase/)** - Business operations for purchase orders and receipts
- **[Finance Message Types](/foundation/message-types/finance/)** - Finance operations for general journals and fixed asset journals including validation and posting
- **[Inventory Message Types](/foundation/message-types/inventory/)** - Item journal operations including setup, validation, and posting
- **[Projects Message Types](/foundation/message-types/projects/)** - Project (job) journal operations including setup, validation, and posting
- **[Resources Message Types](/foundation/message-types/resources/)** - Resource journal operations including setup, validation, and posting
- **[IncomingDocument Message Types](/foundation/message-types/incoming-documents/)** - Operations for creating, attaching, processing, and retrieving Incoming Documents
- **[Approval Message Types](/foundation/message-types/approval/)** - Document approval operations including sending, approving, rejecting, delegating, and retrieving approval entries
- **[Memory Message Types](/foundation/message-types/memory/)** - Persistent key-value blob storage scoped to company or user

For building an application on top of Bifröst Foundation, see:

- **[Extending Bifröst Setup](/extensibility/setup-and-secrets/)** - the one action a dependent app adds to the Bifröst Setup page
- **[Secrets](/foundation/reference/secrets/)** - the unified secret store every application uses

### All Available Message Types

| Message Type | Description | Direction | Documentation |
|--------------|-------------|-----------|---------------|
| **Data Operations** | | | |
| Data.Records.Get | Retrieve full record data as JSON following data shipping standard. Supports field filtering, table view filtering, and date/time range filtering. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#datarecordsget) |
| Data.Records.Set | Insert or update full record data as JSON. Automatically determines insert vs update based on SystemId or primary key. | Inbound | [Data_Message_Types.md](/foundation/message-types/data/#datarecordsset) |
| Data.RecordIds.Get | Retrieve record IDs and modification timestamps for sync scenarios. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#datarecordidsget) |
| CSV.Records.Get | Export all matching records from a specified table as a UTF-8 CSV file in Open Mirroring format. Supports continuation via `continueFromRecordId` for large exports approaching the 2 GB limit. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#csvrecordsget) |
| Data.Totals.Get | Aggregate Decimal SumIndexFields across all matching records using CalcSums. Returns field totals as a single JSON object. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#datatotalsget) |
| Deleted.Records.Get | Retrieve full field-level snapshots of deleted records from the Delete Log ori. Requires "Store Record" enabled per table. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#deletedrecordsget) |
| Deleted.RecordIds.Get | Retrieve SystemId and deletion timestamp for deleted records. Lightweight — no "Store Record" requirement. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#deletedrecordidsget) |
| CSV.DeletedRecords.Get | Export deleted record audit log entries as CSV. Fixed audit columns: systemId, tableId, tableName, deletedAt, userId. | Outbound | [Data_Message_Types.md](/foundation/message-types/data/#csvdeletedrecordsget) |
| **Metadata Operations** | | | |
| Help.Tables.Get | Returns list of all available tables with ID and name. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helptablesget) |
| Help.Fields.Get | Retrieve field metadata including field number, name, type, length, primary key status, and table relation indicators. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpfieldsget) |
| Help.MessageTypes.Get | Returns list of all available message types with metadata for API discovery. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpmessagetypesget) |
| Help.Implementation.Get | Returns help documentation for a specified message type (self-documenting API). | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpimplementationget) |
| Help.Permissions.Get | Retrieve current user's read/write permissions for a specified table. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helppermissionsget) |
| Help.NextLineNo.Get | Returns the next available line number for a table whose last PK field is an Integer. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helpnextlinenoget) |
| Help.PageUrl.Get | Returns the Business Central web URL for the card page of a specific record. Response content type: text/json. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helppageurlget) |
| Help.TableRelations.Get | Returns all foreign-key relationships for a table including conditional relation branches. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#helptablerelationsget) |
| Field.Translation.Get | Retrieve BC system translations for a specific record field. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationget) |
| Field.Translation.Set | Write or delete BC system translations for a record field. | Inbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationset) |
| Field.Translations.Get | Retrieve BC system translations for all fields (or a specific field) on a record. | Outbound | [Metadata_Message_Types.md](/foundation/message-types/metadata/#fieldtranslationsget) |
| **Sales, Customer & Item Operations** | | | |
| Customer.CreditLimit.Get | Retrieve customer credit limit information with balance, outstanding amounts, and credit status. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#customercreditlimitget) |
| Customer.SalesHistory.Get | Retrieve sales history by item for a specific customer within a date range, based on Item Ledger Entries. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#customersaleshistoryget) |
| Customer.Statement.Pdf | Retrieve customer statement as a PDF document with optional date range using configured report selection. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#customerstatementpdf) |
| Item.Availability.Get | Retrieve item availability (Physical Inventory or Calculated Quantity with supply/demand). | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#itemavailabilityget) |
| Item.Price.Get | Retrieve item price information from price lists based on customer, date, quantity, and variant. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#itempriceget) |
| Sales.Document.Post | Post a released sales order (shipment, invoice, or both). | Inbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentpost) |
| Sales.Document.Release | Release an open sales order to make it ready for processing and posting. | Inbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentrelease) |
| Sales.Document.Reopen | Reopen a released or pending approval sales document to allow modifications. | Inbound | [Sales_Message_Types.md](/foundation/reference/message-types/sales-document-reopen/) |
| Sales.Document.Statistics | Retrieve sales document statistics including amounts, VAT totals, quantities, weight and volume. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentstatistics) |
| Sales.Document.PreviewPost | Simulate posting a sales document and return every captured ledger entry (G/L, VAT, Item, Value, Cust. / Detailed Cust. Ledger, and any other ledger table populated by the BC posting routine, including extension tables) without committing. | Inbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salesdocumentpreviewpost) |
| Sales.SalesInvoice.Pdf | Retrieve posted sales invoice as a PDF document using configured report selection. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalesinvoicepdf) |
| Sales.SalesShipment.Pdf | Retrieve posted sales shipment as a PDF document using configured report selection. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalesshipmentpdf) |
| Sales.SalesCreditMemo.Pdf | Retrieve posted sales credit memo as a PDF document using configured report selection. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salessalescreditmemopdf) |
| Sales.ReturnReceipt.Pdf | Retrieve posted return receipt as a PDF document using configured report selection. | Outbound | [Sales_Message_Types.md](/foundation/message-types/sales/#salesreturnreceiptpdf) |
| **Purchase Operations** | | | |
| Purchase.Document.Release | Release an open purchase document. | Inbound | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentrelease) |
| Purchase.Document.Reopen | Reopen a released or pending approval purchase document to allow modifications. | Inbound | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentreopen) |
| Purchase.Document.Statistics | Retrieve purchase document statistics including amounts, VAT totals, quantities, weight and volume. | Outbound | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentstatistics) |
| Purchase.Document.Post | Post a purchase document and return the resulting posted invoice number. | Inbound | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentpost) |
| Purchase.Document.PreviewPost | Simulate posting a purchase document and return every captured ledger entry (G/L, VAT, Item, Value, Vendor / Detailed Vendor Ledger, and any other ledger table populated by the BC posting routine, including extension tables) without committing. | Inbound | [Purchase_Message_Types.md](/foundation/message-types/purchase/#purchasedocumentpreviewpost) |
| **Finance Operations** | | | |
| Finance.GeneralJournal.Check | Validates a general journal batch and returns comprehensive readiness status with detailed validation results. Uses BC Error Message Management framework to collect all errors in a single pass. | Outbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financegeneraljournalcheck) |
| Finance.GeneralJournal.Post | Posts a general journal batch and returns posting statistics including entry counts by type (GL, Customer, Vendor). | Inbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financegeneraljournalpost) |
| Finance.FAJournal.SetupNewLine | Create and initialize a new fixed asset journal line with defaults inherited from template and batch. | Inbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalsetupnewline) |
| Finance.FAJournal.Check | Validates a fixed asset journal batch without posting. Zero-amount lines produce warnings (non-blocking). | Outbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalcheck) |
| Finance.FAJournal.Post | Posts a fixed asset journal batch and returns posting statistics including FA register and entry range. | Inbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalpost) |
| Finance.FAJournal.PreviewPost | Simulate posting a fixed asset journal batch and return every captured ledger entry (Maintenance Ledger, FA Ledger, G/L, VAT) without committing. | Inbound | [Finance_Message_Types.md](/foundation/message-types/finance/#financefajournalpreviewpost) |
| **Inventory Operations** | | | |
| Inventory.ItemJournal.SetupNewLine | Create and initialize a new item journal line with defaults inherited from template and batch. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalsetupnewline) |
| Inventory.ItemJournal.Check | Validates an item journal batch without posting. Returns line count, total quantity, total amount, and errors/warnings. | Outbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalcheck) |
| Inventory.ItemJournal.Post | Posts an item journal batch and returns posting statistics including item register and entry range. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalpost) |
| Inventory.ItemJournal.PreviewPost | Simulate posting an item journal batch and return every captured ledger entry (Item Ledger, Value Entry, and G/L when applicable) without committing. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#inventoryitemjournalpreviewpost) |
| **Warehouse Operations** | | | |
| Warehouse.Shipment.Create | Creates one Warehouse Shipment per supplied source document (Sales Order, Outbound Transfer Order) via BC codeunit 5752 `Get Source Doc. Outbound`. Each source produces its own header. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentcreate) |
| Warehouse.Shipment.Post | Posts a Warehouse Shipment via BC codeunit 5763 `Whse.-Post Shipment`. Optional `invoice=true` also invoices the source documents. Gated by `Warehouse Posting ori` (always) and `G/L Posting ori` (when `invoice=true`). | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentpost) |
| Warehouse.Pick.Create | Creates a Warehouse Pick from a Warehouse Shipment via BC report 7318 `Whse.-Shipment - Create Pick`. Optional `assignedUserId` and `sortingMethod` applied after creation (subject to field-access write-restrictions on `Warehouse Activity Header`). | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehousepickcreate) |
| Warehouse.Pick.Register | Registers a Warehouse Pick via BC codeunit 7307 `Whse.-Activity-Register`. Moves the pick to history and writes `Qty. Picked` / `Qty. to Ship` to the source Warehouse Shipment lines. Gated by `Warehouse Posting ori`. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehousepickregister) |
| Warehouse.Putaway.Create | Creates a Warehouse Put-away from a Posted Whse. Receipt via BC report 7305 `Whse.-Source - Create Document`. Optional `assignedUserId` and `sortingMethod` applied after creation (subject to field-access write-restrictions on `Warehouse Activity Header`). | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseputawaycreate) |
| Warehouse.Putaway.Register | Registers a Warehouse Put-away via BC codeunit 7307 `Whse.-Activity-Register`. Moves stock from receive bins to storage bins and writes `Qty. Put Away` to the source Posted Whse. Receipt lines. Gated by `Warehouse Posting ori`. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseputawayregister) |
| Warehouse.Shipment.PreviewPost | Simulate posting a Warehouse Shipment (Ship + Invoice — invoice flag is forced by BC's preview subscriber) and return every captured ledger entry without committing. WMS locations require a registered pick first. | Inbound | [Inventory_Message_Types.md](/foundation/message-types/inventory/#warehouseshipmentpreviewpost) |
| **Projects Operations** | | | |
| Projects.ProjectJournal.SetupNewLine | Create and initialize a new project (job) journal line with defaults inherited from template and batch. | Inbound | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalsetupnewline) |
| Projects.ProjectJournal.Check | Validates a project journal batch without posting. Returns line count, total quantity, total line amount, and errors/warnings. | Outbound | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalcheck) |
| Projects.ProjectJournal.Post | Posts a project journal batch and returns posting statistics including job register and entry range. | Inbound | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalpost) |
| Projects.ProjectJournal.PreviewPost | Simulate posting a project (job) journal batch and return every captured ledger entry (Job Ledger Entry with `tableCaption "Project Ledger Entry"`, Res. Ledger Entry, and G/L when applicable) without committing. `DimensionSetID` is returned as an array of `{DimensionCode, DimensionValueCode}`. | Inbound | [Projects_Message_Types.md](/foundation/message-types/projects/#projectsprojectjournalpreviewpost) |
| **Resources Operations** | | | |
| Resources.ResourceJournal.SetupNewLine | Create and initialize a new resource journal line with defaults inherited from template and batch. | Inbound | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalsetupnewline) |
| Resources.ResourceJournal.Check | Validates a resource journal batch without posting. Returns line count, total quantity, total cost, and errors/warnings. | Outbound | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalcheck) |
| Resources.ResourceJournal.Post | Posts a resource journal batch and returns posting statistics. Resource register fields are conditional (present only when a register is created). | Inbound | [Resources_Message_Types.md](/foundation/message-types/resources/#resourcesresourcejournalpost) |
| **Incoming Document Operations** | | | |
| Incoming.Document.Create | Create a new Incoming Document with a main file attachment. | Inbound | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentcreate) |
| Incoming.Document.Attach | Add a supplemental attachment to an existing Incoming Document. | Inbound | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentattach) |
| Incoming.Document.Process | Process an Incoming Document to create a purchase invoice or journal line. | Inbound | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentprocess) |
| Incoming.Document.Get | Retrieve an Incoming Document with header fields and all attachments as Base64. | Outbound | [IncomingDocument_Message_Types.md](/foundation/message-types/incoming-documents/#incomingdocumentget) |
| **Approval Operations** | | | |
| Document.Approval.Get | Retrieve approval log entries with linked active and posted approval entries, with per-record permission filtering. | Outbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalget) |
| Document.Approval.Send | Create approval entries for a document with approver assignments based on configured approval workflows. | Inbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalsend) |
| Document.Approval.Approve | Approve one or more open Approval Entry records using BC standard Approvals Mgmt. authorization. | Inbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalapprove) |
| Document.Approval.Reject | Reject one or more open Approval Entry records with optional comment. | Inbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalreject) |
| Document.Approval.Me | Retrieve approval entries assigned to the calling user with source document linking. | Outbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovalme) |
| Document.Approval.Delegate | Delegate one or more open Approval Entry records to another user. | Inbound | [Approval_Message_Types.md](/foundation/message-types/approval/#documentapprovaldelegate) |
| **Memory Operations** | | | |
| Memory.Company.Get | Retrieve company-scoped memory records with pagination and tableView filtering. | Outbound | [Memory_Message_Types.md](/foundation/message-types/memory/#memorycompanyget) |
| Memory.Company.Set | Insert or update company-scoped memory records via a data array. | Inbound | [Memory_Message_Types.md](/foundation/message-types/memory/#memorycompanyset) |
| Memory.User.Get | Retrieve user-scoped memory records (private to the creator). | Outbound | [Memory_Message_Types.md](/foundation/message-types/memory/#memoryuserget) |
| Memory.User.Set | Insert or update user-scoped memory records (private to the creator). | Inbound | [Memory_Message_Types.md](/foundation/message-types/memory/#memoryuserset) |

---

## Events and Webhooks

The Bifrost extension provides **External Business Events** that enable external systems to receive webhook notifications when messages complete or fail processing. This eliminates the need for continuous polling and enables true event-driven architectures.

### Webhook Notifications

**Event Pattern:** Minimal Notification + API Fetch

1. **Message Submitted**: External system submits message to Queue API or Task API
2. **Processing**: Business Central processes the message asynchronously (Queue API) or synchronously (Task API)
3. **Event Raised**: When processing completes or fails, BC raises an External Business Event
4. **Webhook Notification**: Subscribed endpoints receive minimal notification (MessageId, MessageType, Timestamp)
5. **Data Retrieval**: External system calls Data API using MessageId to fetch full response

### Available Events

| Event Name | When Raised | Webhook Payload | Use Case |
|------------|-------------|-----------------|----------|
| **BifrostMessageCompleted** | Message processing succeeds | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Notify external systems of successful completion |
| **BifrostMessageFailed** | Message processing fails | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Alert on processing failures |

### Configuration

Configure webhook subscriptions via Business Central's **Event Subscriptions** page:

1. Navigate to **Event Subscriptions**
2. Create new subscription
3. Select event: `BifrostMessageCompleted` or `BifrostMessageFailed`
4. Set **Event Category**: "Origo Bifrost"
5. Configure endpoint URL and authentication
6. Enable subscription

### Complete Documentation

For comprehensive webhook setup, security considerations, code examples, and troubleshooting:

**→ See [Events and Webhooks Reference](/foundation/reference/events-and-webhooks/)**

Includes:
- Webhook payload specifications
- Event subscription setup guide
- Integration event documentation (for BC extensions)
- Security best practices
- Example implementations (Node.js, C#, Python)
- Troubleshooting guide

---

## Authentication

All API endpoints require proper authentication using OAuth 2.0 or Basic Authentication as configured in Business Central.

**Required Permissions:**

- Users must have appropriate permissions defined in the `BIFROST Full ori` permission set or equivalent permissions to access bifrost functionality.

### Data Isolation — Entra Application Boundary

All Bifrost endpoints (`/tasks`, `/queues`, `/responses`, `/requests`) enforce **strict data isolation at the Entra Application level**.

Every response is automatically filtered server-side to records where `SystemCreatedBy = UserSecurityId()`. `UserSecurityId()` in Business Central resolves to the Object ID of the **Entra Application (Client ID)** that authenticated the request.

**Consequences:**

| Scenario | Result |
|---|---|
| App A lists `/queues` | Returns only messages submitted by App A |
| App A requests `/responses({id})` for a message created by App B | Returns empty — no data leaked |
| App A requests `/requests({id})` for a message created by App B | Returns empty — no data leaked |
| Two apps share the same company + environment | Each sees only its own message history |

This isolation is **unconditional** — it cannot be overridden by OData filters, admin credentials, or any other mechanism. It applies to GET (listing and single-record reads) on all four endpoints.

---

## Usage Examples

### Example 1: Get List of Tables (Synchronous)

**Request:**

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

**Response:**

```json
{
  "@odata.context": "...",
  "specversion": "1.0",
  "type": "Help.Tables.Get",
  "source": "MyIntegrationApp v1.0",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-19T10:30:00Z",
  "subject": "",
  "datacontenttype": "text/json",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

---

### Example 2: Get Table Fields (Asynchronous)

**Step 1: Queue the Request**

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

**Step 2a: Option 1 - Poll for Status**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Step 2b: Option 2 - Webhook Notification (Recommended)**

Subscribe to the `BifrostMessageCompleted` event and receive automatic notification when processing completes:

```json
{
  "MessageId": "{message-id}",
  "MessageType": "Help.Fields.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses({message-id})/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

**Step 3: Retrieve Results**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

**Note:** For webhook setup, see [Events and Webhooks Reference](/foundation/reference/events-and-webhooks/).

---

### Example 3: Get Modified Records

**Request:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Data.RecordIds.Get",
  "source": "DataSync Service v2.1",
  "datacontenttype": "application/json",
  "data": "{\"tableName\":\"Customer\",\"startDateTime\":\"2026-02-01T00:00:00Z\",\"endDateTime\":\"2026-02-19T23:59:59Z\"}"
}
```

---

### Example 4: Get Available Message Types

**Request:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Response:**

```json
{
  "@odata.context": "...",
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "my-application",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-25T10:30:00Z",
  "subject": "",
  "datacontenttype": "text/json",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

**Note:** The `data` field contains a download URL. Retrieve the actual response data by calling the URL.

---

### Example 5: Get Help Documentation for a Message Type

**Request:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "subject": "Help.Fields.Get",
  "source": "my-application",
  "datacontenttype": "application/json"
}
```

**Response:**

```json
{
  "@odata.context": "...",
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "source": "my-application",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-25T10:35:00Z",
  "subject": "Help.Fields.Get",
  "datacontenttype": "text/markdown",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

**Note:** The `data` field contains a download URL. Retrieve the actual markdown help documentation by calling the URL.

---

## Error Handling

### Common Error Scenarios

1. **Table Not Found**
   - Error: "Table &#123;tableName&#125; not found."
   - Occurs when requesting fields or records for a non-existent table

2. **Invalid Message Type**
   - Occurs when the specified type is not supported for the requested operation

3. **Missing Required Fields**
   - Occurs when required fields like `type` or `specversion` are not provided

---

## Best Practices

1. **Choosing Between Queue and Task APIs:**
   - Use **Task API** for immediate results and simple operations
   - Use **Queue API** for long-running operations or bulk processing

2. **Message Types:**
   - All Help.* message types are designed for data retrieval and metadata discovery
   - Use Help.MessageTypes.Get to discover all available message types and their capabilities
   - Use Help.Implementation.Get to retrieve detailed help documentation for specific message types
   - Message direction is set to Outbound for all Help.* implementations

3. **Content Types:**
   - Use `application/json` for structured data payloads
   - Response content type is automatically set to `text/json`

4. **Status Checking:**
   - For queued messages, check status before retrieving results
   - Use the GetStatus action to determine if processing is complete

5. **Date/Time Filtering:**
   - Use ISO 8601 format for date/time values
   - All times should be in UTC

---

## Version History

**Version 1.0.0.0** - Initial release

- Bifrost Data API
- Queue API ori  
- Task API ori
- Data.Records.Get message type
- Data.Records.Set message type
- Data.RecordIds.Get message type
- Help.Tables.Get message type
- Help.Fields.Get message type
- Help.MessageTypes.Get message type
- Help.Implementation.Get message type
- Help.Permissions.Get message type
- Customer.CreditLimit.Get message type
- Item.Availability.Get message type
- Item.Price.Get message type
- Sales.Document.Release message type
