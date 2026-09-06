---
id: inventory
title: "Inventory message types"
sidebar_position: 6
---

This document describes the Inventory-related message types in Bifröst Foundation.

## Overview

Inventory message types provide functionality for working with item journals (line setup, validation, posting), transfer orders (create, release, reopen, post, preview post, statistics), assembly orders, and warehouse shipments (create from released source documents, post with optional invoicing).

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline) | Inbound | Creates a new item journal line with defaults — the default way to prepare a journal line |
| [Inventory.ItemJournal.Check](#inventoryitemjournalcheck) | Outbound | Validates an item journal batch and returns readiness status |
| [Inventory.ItemJournal.Post](#inventoryitemjournalpost) | Inbound | Posts an item journal batch and returns posting statistics |
| [Inventory.ItemJournal.PreviewPost](#inventoryitemjournalpreviewpost) | Inbound | Simulates posting an item journal batch and returns predicted ledger entries (rolled back) |
| [Inventory.TransferOrder.Create](#inventorytransferordercreate) | Inbound | Creates a new transfer order header |
| [Inventory.TransferOrder.Release](#inventorytransferorderrelease) | Inbound | Releases a transfer order (Open → Released) |
| [Inventory.TransferOrder.Reopen](#inventorytransferorderreopen) | Inbound | Reopens a released transfer order (Released → Open) |
| [Inventory.TransferOrder.Post](#inventorytransferorderpost) | Inbound | Posts a transfer order shipment, receipt, or direct transfer |
| [Inventory.TransferOrder.PreviewPost](#inventorytransferorderpreviewpost) | Inbound | Simulates posting and returns predicted ledger entries (rolled back) |
| [Inventory.TransferOrder.Statistics](#inventorytransferorderstatistics) | Outbound | Returns line quantity, parcels, weights, and volume |
| [Inventory.AssemblyOrder.Create](#inventoryassemblyordercreate) | Inbound | Creates a new assembly order header for a parent item |
| [Inventory.AssemblyOrder.RefreshLines](#inventoryassemblyorderrefreshlines) | Inbound | Refreshes BOM component lines on an existing assembly order |
| [Inventory.AssemblyOrder.Release](#inventoryassemblyorderrelease) | Inbound | Releases an assembly order (Open → Released) |
| [Inventory.AssemblyOrder.Reopen](#inventoryassemblyorderreopen) | Inbound | Reopens a released assembly order (Released → Open) |
| [Inventory.AssemblyOrder.Post](#inventoryassemblyorderpost) | Inbound | Posts an assembly order, creating the finished item and consuming components |
| [Inventory.AssemblyOrder.PreviewPost](#inventoryassemblyorderpreviewpost) | Inbound | Simulates posting and returns predicted ledger entries (rolled back) |
| [Inventory.AssemblyOrder.Statistics](#inventoryassemblyorderstatistics) | Outbound | Returns cost statistics (material, resource, overhead, expected vs. actual) |
| [Warehouse.Shipment.Create](#warehouseshipmentcreate) | Inbound | Creates Warehouse Shipment(s) from released source documents (Sales Order, Outbound Transfer Order) |
| [Warehouse.Shipment.Post](#warehouseshipmentpost) | Inbound | Posts a Warehouse Shipment (ship, optionally invoice) |
| [Warehouse.Pick.Create](#warehousepickcreate) | Inbound | Creates a Warehouse Pick from a Warehouse Shipment (wraps BC report 7318) |
| [Warehouse.Pick.Register](#warehousepickregister) | Inbound | Registers a Warehouse Pick (wraps BC codeunit 7307); Warehouse Posting ori gated |
| [Warehouse.Putaway.Create](#warehouseputawaycreate) | Inbound | Creates a Warehouse Put-away from a Posted Whse. Receipt (wraps BC report 7305) |
| [Warehouse.Putaway.Register](#warehouseputawayregister) | Inbound | Registers a Warehouse Put-away (wraps BC codeunit 7307); Warehouse Posting ori gated |
| [Warehouse.Receipt.Create](#warehousereceiptcreate) | Inbound | Creates Warehouse Receipt(s) from released source documents (Purchase Order, Sales Return Order, Inbound Transfer Order) |
| [Warehouse.Receipt.Post](#warehousereceiptpost) | Inbound | Posts a Warehouse Receipt |
| [Warehouse.Receipt.Post.Preview](#warehousereceiptpostpreview) | Inbound | Simulates posting a Warehouse Receipt and returns predicted ledger entries (rolled back) |
| [Warehouse.Shipment.PreviewPost](#warehouseshipmentpreviewpost) | Inbound | Simulates posting a Warehouse Shipment (Ship + Invoice) and returns predicted ledger entries (rolled back) |

---

## Inventory.ItemJournal.SetupNewLine

**Direction**: Inbound (creates a new journal line)

**Purpose**: Creates and inserts a new item journal line in the specified batch, pre-populated with defaults from BC's `SetUpNewLine` procedure. This is the default way to prepare an item journal line before populating business fields via `Data.Records.Set`.

Default values inherited from the template and batch include Entry Type, Posting Date, Location Code, and other template-driven defaults. If a No. Series is configured on the journal batch, the Document No. is automatically populated from the next number in the series.

The line is assigned the next available Line No. (last line + 10000, or 10000 if the batch is empty).

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "ITEM|DEFAULT",
  "id": "c3d4e5f6-7890-12cd-ef34-567890abcdef",
  "time": "2026-04-15T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

#### Journal Batch Identification

1. **Pipe-separated in subject**: `"subject": "TEMPLATE|BATCH"`
2. **SystemId in subject**: `"subject": "guid-without-braces"`
3. **JSON data parameters**:
```json
{
  "data": {
    "templateName": "ITEM",
    "batchName": "DEFAULT"
  }
}
```

JSON data parameters take precedence over the subject field.

#### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldNumbers` | int[] | all fields | Field numbers to include in response. When omitted, all fields are returned. |
| `noOfLines` | integer | 1 | Number of lines to create in a single call (1–100). |
| `clearExistingLines` | boolean | false | When true, deletes all existing lines in the batch before creating new ones. |

```json
{
  "data": {
    "templateName": "ITEM",
    "batchName": "DEFAULT",
    "noOfLines": 5,
    "clearExistingLines": true,
    "fieldNumbers": [1, 2, 5, 12]
  }
}
```

### Response Format

The response uses the same shape as `Data.Records.Get`: an array of records each with `id`, `primaryKey`, and `fields`.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "ITEM",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "T-00001",
        "EntryType": "Purchase",
        "LocationCode": "BLUE",
        "..."
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "Success" or "Error" |
| `noOfRecords` | integer | Number of lines created |
| `result` | array | One element per newly inserted line |
| `result[].id` | string | SystemId of the new journal line |
| `result[].primaryKey` | object | `JournalTemplateName`, `JournalBatchName`, `LineNo_` |
| `result[].fields` | object | All non-PK fields (or only those in `fieldNumbers` if specified) |

### Behaviour

1. The batch is identified using one of the three methods above.
2. If `clearExistingLines` is true, all existing lines in the batch are deleted.
3. The last existing line in the batch is found (if any).
4. For each new line, BC's `SetUpNewLine` is called using the previous line as reference. This applies defaults from the template and batch. If a No. Series is configured, Document No. is populated from the next number in the series.
5. The line is inserted with triggers, then included in the response.

### Typical Workflow

1. Call `Inventory.ItemJournal.SetupNewLine` to create one or more lines with defaults.
2. Use the returned `id` (SystemId) with `Data.Records.Set` to populate Item No., Quantity, Unit Cost, etc.
3. Call `Inventory.ItemJournal.Check` to validate the batch.
4. Call `Inventory.ItemJournal.Post` to post.

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No template/batch, SystemId, or pipe-separated subject provided |
| Batch not found | The specified batch does not exist |

### Related Message Types

- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck) — Validate batch before posting
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost) — Post a validated batch
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset) — Update fields on the newly created line
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget) — Read journal lines (same response shape)

---

## Inventory.ItemJournal.Check

**Direction**: Outbound (validation only, no data modification)

**Purpose**: Validates an item journal batch without posting. Returns readiness status with detailed validation results.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "ITEM|DEFAULT",
  "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "time": "2026-04-15T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

Identification follows the same three-method pattern (pipe subject, SystemId subject, JSON data parameters).

### Response Format

#### Ready
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Item Batch",
  "lineCount": 2,
  "totalQuantity": 15.0,
  "totalAmount": 1500.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings
```json
{
  "status": "Success",
  "validationResult": "ReadyWithWarnings",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "lineCount": 2,
  "totalQuantity": 15.0,
  "totalAmount": 1500.0,
  "errorCount": 0,
  "warningCount": 2,
  "errors": [],
  "warnings": [
    "Line 10000: Posting Date 2026-12-31 is in the future.",
    "Line 20000: Unit Cost not specified — defaulting to Item Card cost."
  ]
}
```

#### NotReady
```json
{
  "status": "Success",
  "validationResult": "NotReady",
  "templateName": "ITEM",
  "batchName": "INVALID",
  "lineCount": 1,
  "totalQuantity": 0.0,
  "totalAmount": 0.0,
  "errorCount": 1,
  "warningCount": 0,
  "errors": [
    "Line 10000: Quantity must not be zero."
  ],
  "warnings": []
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "Success" for validation (even when NotReady) |
| `validationResult` | string | "Ready", "ReadyWithWarnings", or "NotReady" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `lineCount` | integer | Number of journal lines in batch |
| `totalQuantity` | decimal | Sum of Quantity on all lines |
| `totalAmount` | decimal | Sum of Amount on all lines |
| `errorCount` | integer | Number of blocking errors |
| `warningCount` | integer | Number of non-blocking warnings |
| `errors` | array | List of error messages (prevent posting) |
| `warnings` | array | List of warning messages (posting allowed) |

### Validation Rules

Uses BC's Error Message Management framework with codeunit "Item Jnl.-Check Line" to collect ALL validation errors in a single pass.

**Per-Line Validation includes:**
- Required fields (Posting Date, Document No., Entry Type, Item No., Quantity ≠ 0)
- Posting period: Date must be within allowed posting period
- Items: Must exist, not be Blocked
- Locations and Bins (if Location Mandatory is set)
- Unit of Measure, Variant Code consistency
- Dimensions: Required dimensions must be present and valid

**Additional Warnings (non-blocking):**
- Future posting dates (after work date) generate warnings

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No subject or data parameters provided |
| Batch not found | Template/batch combination does not exist |

### Notes

- **Non-Destructive**: Does NOT modify any data
- **Error Collection**: Collects all validation errors, not just the first one
- An empty batch returns `validationResult: "NotReady"` with `status: "Success"`

### Related Message Types

- [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline)
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget)

---

## Inventory.ItemJournal.Post

**Direction**: Inbound (modifies data — posts journal and clears lines)

**Purpose**: Posts a validated item journal batch to create Item Ledger Entries.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Inventory.ItemJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "ITEM|BATCH001",
  "id": "b2c3d4e5-6789-01bc-def2-234567890abc",
  "time": "2026-04-15T14:20:00Z",
  "datacontenttype": "application/json",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Success
```json
{
  "status": "Success",
  "templateName": "ITEM",
  "batchName": "BATCH001",
  "batchDescription": "Default Item Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 15.0,
  "totalAmount": 1500.0,
  "itemRegisterNo": 42,
  "itemRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 1001,
  "toEntryNo": 1002
}
```

#### Error
```json
{
  "status": "Error",
  "error": "Error message text",
  "callstack": "Full error callstack from posting"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "Success" or "Error" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `linesPosted` | integer | Number of journal lines posted |
| `postingDate` | string | Posting date (ISO format) |
| `totalQuantity` | decimal | Total Quantity posted |
| `totalAmount` | decimal | Total Amount posted |
| `itemRegisterNo` | integer | Item Register number created (when register was produced) |
| `itemRegisterId` | string | Item Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First Item Ledger Entry No. in register |
| `toEntryNo` | integer | Last Item Ledger Entry No. in register |
| `error` | string | Error message (only on Error status) |
| `callstack` | string | Error callstack (only on Error status) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post in the batch
- Posting validation errors (item blocked, missing dimensions, etc.)
- Missing journal batch identification

### Notes

- Uses BC's standard "Item Jnl.-Post Batch" codeunit for posting
- All journal lines are cleared from the batch after successful posting; the batch record itself remains
- The Item Register record contains the entry-number range for audit
- Posting through this message is wrapped in an isolated codeunit so errors return a structured response with `callstack` rather than aborting the queue task

### Workflow

1. Resolve the journal batch from subject or data
2. Verify lines exist in the batch
3. Call "Item Jnl.-Post Batch" to post all lines
4. Verify Item Register was created
5. On success: return register statistics
6. On error: return error message with callstack

**Recommended approach:** Validate with `Inventory.ItemJournal.Check` first, then post with `Inventory.ItemJournal.Post`.

### Security Considerations

- Posting item journals requires standard BC posting permissions
- All posted entries maintain `Journal Batch Name` for traceability

### Related Message Types

- [Inventory.ItemJournal.SetupNewLine](#inventoryitemjournalsetupnewline)
- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Inventory.ItemJournal.PreviewPost

**Direction**: Inbound (simulates posting; no data modification)

**Purpose**: Simulates posting an Item Journal batch and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Item Jnl.-Post` subscriber, captures the in-memory entries via `Posting Preview Event Handler`, then enumerates every populated table from `FillDocumentEntry`. Typical previewed tables include `Item Ledger Entry`, `Value Entry`, and (for journals that generate G/L impact) `G/L Entry` and `VAT Entry`.

### Input Parameters

Journal batch identification (first matched wins):

| Method | Subject field | Data field |
|--------|---------------|------------|
| Pipe-separated names | `TEMPLATE\|BATCH` | — |
| SystemId GUID | `<guid>` (no braces) | — |
| Template + batch names | — | `templateName` + `batchName` |

### Response Format

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting item journal batch ITEM|DEFAULT (2 lines) would create 4 ledger entries across 2 tables. G/L impact is balanced.",
  "templateName": "ITEM",
  "batchName": "DEFAULT",
  "batchDescription": "Default Journal Batch",
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedDocumentNos": ["***"],
  "totals": { "balanced": true, "totalDebitLCY": 254500.0, "totalCreditLCY": 254500.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1896-S", "DocumentNo_": "***", "Quantity": "5", "LocationCode": "AÐAL" }
        }
      ]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `rollback` | boolean | Always `true` — confirms no data was persisted. |
| `summary` | string | One-line natural-language description of the simulated posting. |
| `templateName` / `batchName` / `batchDescription` | string | Journal batch identification. `batchDescription` may be empty. |
| `linesToPost` | integer | Number of journal lines fed into the preview. |
| `postingDate` | string | Posting Date of the first line (ISO format). |
| `lcyCode` | string | Local Currency code from General Ledger Setup. |
| `predictedDocumentNos` | string[] | Distinct `Document No.` values across the previewed G/L entries. May contain the literal `"***"` when BC's preview engine masks an unassigned number-series value. Empty when the journal does not produce G/L impact. |
| `totals.balanced` | boolean | `true` when `totalDebitLCY = totalCreditLCY` (rounded to 0.01). |
| `totals.totalDebitLCY` / `totalCreditLCY` | decimal | Sum of G/L Entry Debit/Credit amounts in LCY. |
| `preview[]` | array | One element per populated ledger table that BC would write to. |
| `preview[].tableId` / `tableName` / `tableCaption` | int / string / string | Table number, raw BC table name, and `RecordRef.Caption` (display name). |
| `preview[].entryCount` | integer | Number of entries that would be inserted into this table. |
| `preview[].entries[]` | array | Per-entry objects with `id` (placeholder SystemId GUID), `primaryKey` (object of PK field-name → value), and `fields` (all serialized fields). Field names follow the same normalization as `Data.Records.Get`. `DocumentNo_` values inside `fields` are commonly `"***"` when BC masks an unassigned number-series. |

### Operational Notes

- **Insert lines via the BC client when possible** — the AL `Insert(true)` and OnValidate triggers populate derived fields (posting groups, location, costing method) automatically. When inserting via OData/MCP `set_records`, supply every field BC needs to post; `set_records` does not call OnValidate.
- The preview rolls back, but does **not** roll back metadata changes made before the call (e.g. updated batch headers). Only the captured ledger inserts are discarded.

### Errors

BC validation errors propagate verbatim to the caller. Common errors:
- `Item journal batch must be identified via subject (TEMPLATE|BATCH or SystemId) or data parameters (templateName, batchName).`
- `Item journal batch {template}|{batch} not found.`
- `Item journal batch {template}|{batch} has no lines to post.`
- `Gen. Prod. Posting Group must have a value in Item Journal Line: ...` — line is missing posting groups. Common when inserted via `set_records` (no OnValidate).
- `Posting preview failed and no entries were captured. The journal cannot be posted in its current state.` — rare catch-all.

### Related Message Types

- [Inventory.ItemJournal.Check](#inventoryitemjournalcheck) - Validate without simulating the post.
- [Inventory.ItemJournal.Post](#inventoryitemjournalpost) - Actually post.
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Same pattern for general journals.

---

## Inventory.TransferOrder.Create

**Direction**: Inbound

Creates a new Transfer Header. Lines are added separately via `Data.Records.Set` against table `Transfer Line`.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Inventory.TransferOrder.Create",
  "source": "MyApp",
  "subject": "",
  "data": {
    "transferFromCode": "BLUE",
    "transferToCode": "RED",
    "inTransitCode": "OUT. LOG.",
    "directTransfer": false,
    "postingDate": "2026-03-07",
    "shipmentDate": "2026-03-07",
    "receiptDate": "2026-03-07",
    "externalDocumentNo": ""
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `transferFromCode` | Code[10] | Yes | Source Location code |
| `transferToCode` | Code[10] | Yes | Destination Location code |
| `inTransitCode` | Code[10] | If `directTransfer` is false | In-transit Location code |
| `directTransfer` | Boolean | No | `true` for a direct transfer (no in-transit) |
| `postingDate` | Date | No | Defaults to WORKDATE |
| `shipmentDate` | Date | No | |
| `receiptDate` | Date | No | |
| `externalDocumentNo` | Code[35] | No | |

### Response

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "systemId": "...",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "inTransitCode": "OUT. LOG.",
  "directTransfer": false,
  "statusAfter": "Open"
}
```

### Errors

- Missing `transferFromCode` / `transferToCode`.
- Missing `inTransitCode` for non-direct transfers.
- Invalid Location codes (BC validation).

---

## Inventory.TransferOrder.Release

**Direction**: Inbound

Releases a transfer order (Open → Released) via codeunit 5708 `Release Transfer Document`.

### Identification

- `subject` field: GUID → SystemId, plain text → Transfer Header `No.`.
- `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

### Response

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

Already-released orders return Success with `statusBefore = statusAfter = "Released"`.

---

## Inventory.TransferOrder.Reopen

**Direction**: Inbound

Reopens a released transfer order (Released → Open) via codeunit 5708 `Release Transfer Document`.

Identification matches `Release`. Response shape matches `Release` with `statusBefore = "Released"` and `statusAfter = "Open"`. Already-open orders return Success with both fields = `"Open"`.

---

## Inventory.TransferOrder.Post

**Direction**: Inbound (action)

Posts a transfer order via codeunit 5706 `TransferOrder-Post (Yes/No)`.

- Non-direct transfer: caller specifies `postingType` = `"Ship"` or `"Receive"`.
- Direct transfer: `postingType` is ignored. BC's Inventory Setup `Direct Transfer Posting` decides Receipt+Shipment vs. single Direct Transfer.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postingType` | Text | Required for non-direct | `"Ship"` or `"Receive"` (case-insensitive) |

### Response

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "postingType": "Ship",
  "directTransfer": false,
  "postedShipmentNo": "TS-0001",
  "postedReceiptNo": "",
  "postingDate": "2026-03-07"
}
```

`postedShipmentNo` / `postedReceiptNo` are populated by diffing `Last Shipment No.` / `Last Receipt No.` on the Transfer Header before and after posting.

### Implementation note

Codeunit 5706's `SetParameters` is internal. The implementation uses a manual event subscriber (`Transfer Post Subscriber ori`) on `OnBeforeGetPostingOptions` to inject the three booleans (`PostShipment`, `PostReceipt`, `PostTransfer`) and set `IsHandled := true`.

---

## Inventory.TransferOrder.PreviewPost

**Direction**: Inbound (action, read-only)

Simulates posting a transfer order and returns predicted ledger entries (Item Ledger, Value Entry, G/L Entry where applicable). The transaction is rolled back via `Gen. Jnl.-Post Preview`.

Request fields match `Post`.

### Response

The `preview` array contains one element per captured BC table; each element has a `rows` array. `predictedNumbers` contains the next-assigned document number:

- Non-direct, Ship → `postedShipmentNo`
- Non-direct, Receive → `postedReceiptNo`
- Direct transfer → `postedDirectTransferNo`

`totals` contains `balanced`, `totalDebitLCY`, `totalCreditLCY`.

### Errors

- Transfer order has no lines.
- Posting would fail (e.g. insufficient inventory). The underlying BC error message is returned.

---

## Inventory.TransferOrder.Statistics

**Direction**: Outbound (read-only)

Returns transfer order header and aggregated line totals. Calculation mirrors Page 5755 `Transfer Statistics`; derived lines (`Derived From Line No. <> 0`) are excluded from totals.

### Response

```json
{
  "status": "Success",
  "documentNo": "TO-0001",
  "transferFromCode": "BLUE",
  "transferToCode": "RED",
  "directTransfer": false,
  "statusValue": "Open",
  "postingDate": "2026-03-07",
  "shipmentDate": "2026-03-07",
  "receiptDate": "2026-03-07",
  "totals": {
    "lineCount": 2,
    "quantity": 50,
    "parcels": 5,
    "netWeight": 250.0,
    "grossWeight": 275.0,
    "volume": 12.5
  }
}
```

---

## Inventory.AssemblyOrder.Create

**Direction**: Inbound

Creates a new Assembly Order header (Assembly Header with Document Type = Order) for a parent item, optionally refreshing component lines from the BOM. Lines may also be added separately via `Data.Records.Set` against table `Assembly Line`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `itemNo` | Code[20] | Yes | Parent (assembly) item No. |
| `quantity` | Decimal | Yes | Quantity to assemble (> 0) |
| `variantCode` | Code[10] | No | Variant Code |
| `locationCode` | Code[10] | No | Output Location |
| `binCode` | Code[20] | No | Output Bin |
| `unitOfMeasureCode` | Code[10] | No | Unit of Measure |
| `description` | Text[100] | No | Header description (defaults to Item description) |
| `postingDate` | Date | No | Defaults to WORKDATE |
| `dueDate` | Date | No | |
| `startingDate` | Date | No | |
| `endingDate` | Date | No | |
| `quantityToAssemble` | Decimal | No | Partial quantity to assemble (defaults to `quantity`) |
| `refreshLines` | Boolean | No | Re-runs BOM expansion after setting fields (default `true`) |

### Response

```json
{
  "status": "Success",
  "documentNo": "AO-0001",
  "systemId": "...",
  "itemNo": "1000",
  "variantCode": "",
  "description": "Bicycle",
  "locationCode": "",
  "binCode": "",
  "unitOfMeasureCode": "PCS",
  "quantity": 5,
  "quantityToAssemble": 5,
  "postingDate": "2026-04-15",
  "dueDate": "2026-04-15",
  "startingDate": "2026-04-15",
  "endingDate": "2026-04-15",
  "statusAfter": "Open",
  "lineCount": 4
}
```

### Errors

- Missing `itemNo` or `quantity <= 0`.
- Invalid Item, Location, Variant, UoM (BC validation).

---

## Inventory.AssemblyOrder.RefreshLines

**Direction**: Inbound

Refreshes the BOM component lines on an existing Assembly Order. Use this after changing `Item No.`, `Quantity`, `Variant Code`, `Location Code`, or `Unit of Measure Code` on the header.

### Identification

- `subject` field: GUID → SystemId, plain text → Assembly Header `No.`.
- `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`.

### Response

```json
{
  "status": "Success",
  "documentNo": "AO-0001",
  "linesBefore": 4,
  "linesAfter": 4,
  "statusAfter": "Open"
}
```

### Errors

- Missing identifier.
- Assembly Header is Released (lines cannot be refreshed on released orders — call `Reopen` first).

### Implementation note

The implementation calls `AssemblyHeader.Validate("Item No.", AssemblyHeader."Item No.")` which triggers BC's internal BOM refresh through the table's `OnValidate("Item No.")` trigger. This is the Cloud-safe equivalent of the OnPrem-only `RefreshBOM` procedure.

---

## Inventory.AssemblyOrder.Release

**Direction**: Inbound

Releases an assembly order (Open → Released) via codeunit 414 `Release Assembly Document`.

Identification matches `RefreshLines`.

### Response

```json
{
  "status": "Success",
  "documentNo": "AO-0001",
  "itemNo": "1000",
  "statusBefore": "Open",
  "statusAfter": "Released"
}
```

Already-released orders return Success with `statusBefore = statusAfter = "Released"`.

---

## Inventory.AssemblyOrder.Reopen

**Direction**: Inbound

Reopens a released assembly order (Released → Open) via codeunit 414 `Release Assembly Document`. The work is delegated to an isolated process codeunit (`Asm. Order Reopen Process ori`) so BC errors are caught and returned as a structured Error response instead of aborting the queue task.

Identification and response shape match `Release`. Already-open orders return Success with both fields = `"Open"`.

---

## Inventory.AssemblyOrder.Post

**Direction**: Inbound (action)

Posts an assembly order via codeunit 900 `Assembly-Post`. Consumes component inventory and produces the finished parent item.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postingDate` | Date | No | Overrides header Posting Date for the run |

### Response

```json
{
  "status": "Success",
  "documentNo": "AO-0001",
  "postedDocumentNo": "PAO-0001",
  "postedSystemId": "...",
  "postedQuantity": 5,
  "assembleToOrder": false,
  "postingDate": "2026-04-15"
}
```

`assembleToOrder` is `true` when the assembly order originated from a sales order (Assemble-to-Order); in that case the source sales line is updated. `postedSystemId` is the SystemId of the resulting `Posted Assembly Header`.

### Errors

- Insufficient component inventory.
- Status is not Released (depending on Assembly Setup).
- The underlying BC error message is returned with `callstack`.

---

## Inventory.AssemblyOrder.PreviewPost

**Direction**: Inbound (action, read-only)

Simulates posting an assembly order and returns predicted ledger entries (Item Ledger, Value Entry, Capacity Ledger Entry, G/L Entry). The transaction is rolled back via `Gen. Jnl.-Post Preview`.

### Response

The `preview` array contains one element per captured BC table; each element has a `rows` array. `predictedNumbers` contains the next-assigned posted assembly order number (`postedDocumentNo`). `totals` contains `balanced`, `totalDebitLCY`, `totalCreditLCY`.

### Errors

- Insufficient component inventory.
- Posting would fail (BC error message returned).

---

## Inventory.AssemblyOrder.Statistics

**Direction**: Outbound (read-only)

Returns assembly order header and cost statistics. Calculation mirrors Page 920 `Assembly Order Statistics`.

### Response

```json
{
  "status": "Success",
  "documentNo": "AO-0001",
  "itemNo": "1000",
  "statusValue": "Open",
  "postingDate": "2026-04-15",
  "dueDate": "2026-04-15",
  "quantity": 5,
  "quantityToAssemble": 5,
  "assembledQuantity": 0,
  "remainingQuantity": 5,
  "cost": {
    "expectedMaterialCost": 250.00,
    "expectedResourceCost": 0.00,
    "expectedResourceOverheadCost": 0.00,
    "expectedAssemblyOverheadCost": 0.00,
    "expectedTotalCost": 250.00,
    "actualMaterialCost": 0.00,
    "actualResourceCost": 0.00,
    "actualResourceOverheadCost": 0.00,
    "actualAssemblyOverheadCost": 0.00,
    "actualTotalCost": 0.00
  }
}
```

Expected costs are derived from the assembly order lines (`Cost Amount` on each line). Actual costs are derived from posted Item Ledger / Capacity Ledger entries via `CalcActualCosts`.

---

## Warehouse.Shipment.Create

**Direction**: Inbound (action)

Creates one Warehouse Shipment per supplied source document by delegating to BC codeunit 5752 `Get Source Doc. Outbound`. Supported source types: `SalesOrder`, `TransferOrder` (outbound side).

Each source produces its own `Warehouse Shipment Header` (BC standard behaviour — BC does not auto-merge sources into a single shipment from this API). The source must be **Released**, and its `Location Code` must have **Require Shipment** = true.

Not a posting action — no posting gate. Not idempotent: every call inserts new Warehouse Shipment Headers from the relevant number series.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceDocuments` | Array | Yes | One or more `{ sourceType, documentNo }` entries |
| `sourceDocuments[].sourceType` | Text | Yes | `"SalesOrder"` or `"TransferOrder"` (case-insensitive) |
| `sourceDocuments[].documentNo` | Code[20] | Yes | The source document number; the source must be Released |
| `locationCode` | Code[10] | No | If set, every source must match this location; mismatches return Error. Subject to write-restriction on `Warehouse Shipment Header."Location Code"` |
| `assignedUserId` | Code[50] | No | Applied to each created `Warehouse Shipment Header` after creation |
| `postingDate` | Date | No | Format 9 (ISO `yyyy-MM-dd`). Applied to each created `Warehouse Shipment Header` after creation |

### Example Request

```json
{
  "sourceDocuments": [
    { "sourceType": "SalesOrder", "documentNo": "SO-0001" },
    { "sourceType": "TransferOrder", "documentNo": "TO-0007" }
  ],
  "locationCode": "BLUE",
  "assignedUserId": "PICKER01",
  "postingDate": "2025-11-15"
}
```

### Response

```json
{
  "status": "Success",
  "noOfShipments": 2,
  "shipments": [
    {
      "recordSystemId": "...",
      "no": "WS-0001",
      "locationCode": "BLUE",
      "assignedUserId": "PICKER01",
      "sourceType": "SalesOrder",
      "sourceDocumentNo": "SO-0001",
      "linesCreated": 2
    }
  ]
}
```

### Errors

- `sourceDocuments is required and must contain at least one entry.`
- `Source #N is missing sourceType or documentNo (both required).`
- `Unsupported sourceType '<X>'. Expected: SalesOrder, TransferOrder.`
- `Sales Order '<no>' not found.` / `Transfer Order '<no>' not found.`
- `Sales Order '<no>' is not Released.` / `Transfer Order '<no>' is not Released.`
- `Sales Order '<no>' uses location '<x>' which does not match the requested locationCode '<y>'.` / `Transfer Order '<no>' ships from '<x>' which does not match the requested locationCode '<y>'.`
- `Location '<code>' (from Sales Order '<no>') does not require shipment routing` — set `Require Shipment` on the Location card.
- `No Warehouse Shipment was created for <sourceType> '<no>'` — already on an open shipment, no lines remain to ship, or pick already started.
- `Field Location Code is restricted for write on table Warehouse Shipment Header.` — `Field Access ori` blocks the `locationCode` parameter.

---

## Warehouse.Shipment.Post

**Direction**: Inbound (action)

Posts a `Warehouse Shipment` via BC codeunit 5763 `Whse.-Post Shipment`.

Gated by **Warehouse Posting ori** (always) and **G/L Posting ori** (when `invoice = true`, because the invoice pass writes to the G/L Register).

### Identifier Resolution Order

1. `subject` — GUID resolves to `Warehouse Shipment Header.SystemId`; non-GUID text resolves to `Warehouse Shipment Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `shipmentNo` / `no` — resolves to `"No."`.

The first match wins. If none resolve, the call returns `Warehouse Shipment identifier must be specified ...`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Shipment `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Shipment `SystemId` |
| `shipmentNo` / `no` | Code[20] | One of | Shipment `No.` |
| `invoice` | Boolean | No | When true, also post invoice for source documents that support it (e.g. Sales Order). Default `false` |

### Response

```json
{
  "status": "Success",
  "shipmentNo": "WS-0001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS-0001",
  "postedWhseShipmentSystemId": "...",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo": "S-INV-0001",
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001"
    }
  ]
}
```

`postedDocuments` is derived from the `Posted Whse. Shipment Line` table (de-duplicated by `Posted Source Document` + `Posted Source No.`), so it reports every distinct posted source document the warehouse shipment produced.

### Errors

- `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, shipmentNo).`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- `Posting denied: missing 'BIFROST GL Post ori' permission set.` (only when `invoice = true`).
- `Warehouse Shipment <no> has no lines to post.`
- BC underlying error from `Whse.-Post Shipment` (e.g. quantity to ship is zero, open pick exists, item tracking incomplete, posting date locked).

---

## Warehouse.Pick.Create

**Direction**: Inbound (action)

Creates a Warehouse Pick (`Warehouse Activity Header.Type = Pick`) from a `Warehouse Shipment Header`. Wraps BC report 7318 `Whse.-Shipment - Create Pick` (the same action as *Create Pick* on the Warehouse Shipment page). The report call is isolated in codeunit 10078140 `Whse Pick Create Process ori` so report-time errors surface as Error responses without aborting the outer message-task transaction.

Not a posting action — no posting gate. The companion `Warehouse.Pick.Register` requires `Warehouse Posting ori`.

### Prerequisites

- The shipment's `Location Code` must have `Require Pick = true`. On Locations with `Require Shipment = true, Require Pick = false`, no pick is needed — call `Warehouse.Shipment.Post` directly.
- The Warehouse Shipment must have at least one line.
- Sufficient available stock must exist for BC to build pick lines.

### Identifier Resolution Order

1. `subject` — GUID resolves to `Warehouse Shipment Header.SystemId`; non-GUID text resolves to `Warehouse Shipment Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `whseShipmentNo` / `shipmentNo` / `no` — resolves to `"No."`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Warehouse Shipment `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Warehouse Shipment `SystemId` |
| `whseShipmentNo` / `shipmentNo` / `no` | Code[20] | One of | Warehouse Shipment `No.` |
| `assignedUserId` | Code[50] | No | Applied to the created Warehouse Pick. Subject to write-restriction on `Warehouse Activity Header."Assigned User ID"` |
| `sortingMethod` | Text | No | Case-insensitive name from BC enum `Whse. Activity Sorting Method` — currently: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). The error response lists the exact set valid on your build. Subject to write-restriction on `Warehouse Activity Header."Sorting Method"`. When omitted, the response returns `"sortingMethod": "None"` (the BC enum's blank caption is normalised). |
| `setBreakbulkFilter` | Boolean | No | **Not supported** in this API version. Sending `true` returns an Error response |
| `doNotFillQtyToHandle` | Boolean | No | **Not supported** in this API version. Sending `true` returns an Error response |

### Example Request

```json
{
  "whseShipmentNo": "WS-0001",
  "assignedUserId": "PICKER01",
  "sortingMethod": "Bin Ranking"
}
```

### Response

```json
{
  "status": "Success",
  "whseShipmentNo": "WS-0001",
  "pickNo": "WPK-0001",
  "pickSystemId": "00000000-0000-0000-0000-000000000000",
  "locationCode": "WHITE",
  "assignedUserId": "PICKER01",
  "sortingMethod": "Bin Ranking",
  "totalPickLines": 4,
  "totalQtyToHandle": 12,
  "message": "Warehouse Pick WPK-0001 created from Shipment WS-0001 with 4 lines."
}
```

### Errors

- `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, whseShipmentNo, no).`
- `Warehouse Shipment <id> does not exist.`
- `Warehouse Shipment <no> has no lines to pick.`
- `sortingMethod '<value>' is not valid. Expected one of: ...`
- `Field Assigned User ID is restricted for write on table Warehouse Activity Header.`
- `Field Sorting Method is restricted for write on table Warehouse Activity Header.`
- `setBreakbulkFilter = true is not supported by this API version. Only the BC defaults (false) are honoured.`
- `doNotFillQtyToHandle = true is not supported by this API version. Only the BC defaults (false) are honoured.`
- `No Warehouse Pick was created for Warehouse Shipment <no>.` — BC report ran without error but produced no activity header (nothing to pick, pick already exists, or location does not require a pick).
- BC underlying error from `Whse.-Shipment - Create Pick` (e.g. `Nothing to handle.` when bin contents have no positive availability).

---

## Warehouse.Pick.Register

**Direction**: Inbound (action)

Registers a Warehouse Pick via BC codeunit 7307 `Whse.-Activity-Register`. After registration:

- The source `Warehouse Shipment Line` rows receive the picked quantity (`Qty. Picked`, `Qty. to Ship`).
- The pick header moves to history as `Registered Whse. Activity Hdr.`.
- The originating Warehouse Shipment becomes eligible for `Warehouse.Shipment.Post`.

Gated by **Warehouse Posting ori**.

### Pre-condition: Lines Must Have Qty. to Handle

BC registers only what the warehouse worker has confirmed picked. `Warehouse.Pick.Create` populates `Qty. to Handle` on every line (the BC report default). To register a **partial** pick, first call `Data.Records.Set` on `Warehouse Activity Line` to update `Qty. to Handle` per line.

### Identifier Resolution Order

1. `subject` — GUID resolves to `Warehouse Activity Header.SystemId`; non-GUID text resolves to `Warehouse Activity Header."No."` (Type = Pick).
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `pickNo` / `no` — resolves to `"No."`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Pick `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Pick `SystemId` |
| `pickNo` / `no` | Code[20] | One of | Pick `No.` |

No other parameters are accepted. To adjust per-line `Qty. to Handle` before registering, use `Data.Records.Set` on `Warehouse Activity Line`.

### Response

```json
{
  "status": "Success",
  "pickNo": "WPK-0001",
  "linesRegistered": 4,
  "totalQtyRegistered": 12,
  "shipmentNo": "WS-0001",
  "shipmentSystemId": "...",
  "registeredPickNo": "RWPK-0001",
  "registeredPickSystemId": "...",
  "shipmentLines": [
    {
      "shipmentNo": "WS-0001",
      "lineNo": 10000,
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 2,
      "qtyPicked": 2,
      "qtyToShip": 2,
      "qtyOutstanding": 2
    }
  ],
  "message": "Warehouse Pick WPK-0001 (4 lines) registered against Warehouse Shipment WS-0001."
}
```

`qtyOutstanding` mirrors the BC `Warehouse Shipment Line."Qty. Outstanding"` flow (`Quantity - Qty. Shipped`). Pick registration does not ship — the value stays equal to the line `Quantity` until `Warehouse.Shipment.Post` runs.

### Errors

- `Warehouse Pick identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, pickNo, no).`
- `Warehouse Pick <id> does not exist.`
- `Warehouse Activity <no> is not of Type Pick.`
- `Warehouse Pick <no> has no lines.`
- `Nothing to register.` — all lines have `Qty. to Handle = 0`.
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- BC underlying error from `Whse.-Activity-Register`.

---

## Warehouse.Putaway.Create

**Direction**: Inbound (action)

Ensures a Warehouse Put-away (`Warehouse Activity Header.Type = Put-away`) exists for a `Posted Whse. Receipt Header` and returns it. Wraps BC report 7305 `Whse.-Source - Create Document` (the same action used by *Create Put-away* on the Posted Warehouse Receipt page) via `SetPostedWhseReceiptLine`. The report call is isolated in codeunit 10078143 `Whse Putaway Create Proc. ori` so report-time errors surface as Error responses without aborting the outer message-task transaction.

Not a posting action — no posting gate. The companion `Warehouse.Putaway.Register` requires `Warehouse Posting ori`.

### Idempotent / auto-create behaviour

Whether posting the receipt already created the put-away is governed by base app codeunit 5760 `Whse.-Post Receipt`: `ShouldCreatePutAway := "Require Put-away" AND NOT "Use Put-away Worksheet"`.

- On a `Require Put-away` location with **`Use Put-away Worksheet = false`** (the BC default — e.g. demo locations GULUR/HVÍTUR), posting **auto-creates** the put-away. Report 7305 then has nothing left and BC raises `There is nothing to handle.` — so this message type returns the **already-existing** put-away as `Success` with `"alreadyExisted": true` (rather than surfacing the error).
- On a location with **`Use Put-away Worksheet = true`**, posting does not create the put-away; this message type creates it (`"alreadyExisted": false`).

The message type is therefore idempotent: a repeat call against an unregistered put-away returns the same put-away. Either way the returned `putawayNo` is ready for `Warehouse.Putaway.Register` — do not treat `alreadyExisted = true` as a failure.

### Prerequisites

- A **Posted** Whse. Receipt must exist for the source. Unposted Warehouse Receipts cannot be used — call `Warehouse.Receipt.Post` first.
- The receipt's `Location Code` must have `Require Put-away = true`. On Locations with `Require Receive = true, Require Put-away = false`, no put-away is needed — the receipt-posting step already places stock in inventory.
- At least one Posted Whse. Receipt Line must have `Quantity > 0` and `Status <> Completely Put Away`.

### Identifier Resolution Order

1. `subject` — GUID resolves to `Posted Whse. Receipt Header.SystemId`; non-GUID text resolves to `Posted Whse. Receipt Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `postedWhseReceiptNo` / `receiptNo` / `no` — resolves to `"No."`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Posted Whse. Receipt `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Posted Whse. Receipt `SystemId` |
| `postedWhseReceiptNo` / `receiptNo` / `no` | Code[20] | One of | Posted Whse. Receipt `No.` |
| `assignedUserId` | Code[50] | No | Applied to the created Warehouse Put-away. Subject to write-restriction on `Warehouse Activity Header."Assigned User ID"` |
| `sortingMethod` | Text | No | Case-insensitive name from BC enum `Whse. Activity Sorting Method` — currently: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). The error response lists the exact set valid on your build. Subject to write-restriction on `Warehouse Activity Header."Sorting Method"`. When omitted, the response returns `"sortingMethod": "None"`. |
| `setBreakbulkFilter` | Boolean | No | **Not supported** in this API version. Sending `true` returns an Error response |
| `doNotFillQtyToHandle` | Boolean | No | **Not supported** in this API version. Sending `true` returns an Error response |

### Example Request

```json
{
  "postedWhseReceiptNo": "PWR000123",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

### Response

Verified live (BC 27, CRONUS IS) — worksheet location `CEPUT`, PO of 5 × item `1896-S`:

```json
{
  "status": "Success",
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "putawayNo": "PU000025",
  "putawaySystemId": "31cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "locationCode": "CEPUT",
  "assignedUserId": "",
  "sortingMethod": "None",
  "alreadyExisted": false,
  "totalPutawayLines": 1,
  "totalQtyToHandle": 5,
  "message": "Warehouse Put-away PU000025 created from Posted Receipt R_000030 with 1 lines."
}
```

- `alreadyExisted` — `false` when this call created the put-away; `true` when an open put-away already existed (e.g. posting auto-created it) and was returned as-is.
- `totalPutawayLines` — **one** line per source line on a non-bin location (`Bin Mandatory = false`); on `Bin Mandatory` / `Directed Put-away and Pick` locations each source line becomes a **Take + Place pair**, so the count roughly doubles.

### Errors

- `Posted Whse. Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, postedWhseReceiptNo, receiptNo, no).`
- `Posted Whse. Receipt <id> does not exist.`
- `Posted Whse. Receipt <no> has no lines to put away.`
- `sortingMethod '<value>' is not valid. Expected one of: ...`
- `Field Assigned User ID is restricted for write on table Warehouse Activity Header.`
- `Field Sorting Method is restricted for write on table Warehouse Activity Header.`
- `setBreakbulkFilter = true is not supported by this API version. Only the BC defaults (false) are honoured.`
- `doNotFillQtyToHandle = true is not supported by this API version. Only the BC defaults (false) are honoured.`
- `No Warehouse Put-away was created for Posted Whse. Receipt <no>.` — report 7305 ran without error but produced no activity header AND none pre-existed (location does not require put-away, or cross-dock already consumed the lines).
- BC underlying error from `Whse.-Source - Create Document` (e.g. `No available bin ...` on directed put-away locations without a bin policy).

> `There is nothing to handle.` (report 7305 when a put-away already exists for the receipt) is **not** returned as an error — it is converted to a `Success` response with `"alreadyExisted": true`.

---

## Warehouse.Putaway.Register

**Direction**: Inbound (action)

Registers a Warehouse Put-away via BC codeunit 7307 `Whse.-Activity-Register` (the same codeunit used for Pick registration). After registration:

- The source `Posted Whse. Receipt Line` rows receive the put-away quantity (`Qty. Put Away`, transitioning Status from `Partially Put Away` to `Completely Put Away`).
- Bin contents are updated — stock moves from the receive bin to the storage bin.
- The put-away header moves to history as `Registered Whse. Activity Hdr.` (the source `Warehouse Activity Header` row is deleted).

Gated by **Warehouse Posting ori**.

### Pre-condition: Lines Must Have Qty. to Handle

BC registers only what the warehouse worker has confirmed put away. `Warehouse.Putaway.Create` populates `Qty. to Handle` on every line (the BC report default). To register a **partial** put-away, first call `Data.Records.Set` on `Warehouse Activity Line` to update `Qty. to Handle` per line. On `Bin Mandatory` / `Directed Put-away and Pick` locations put-away lines come in **Take + Place pairs** — update both rows to the same value. On a non-bin location (`Bin Mandatory = false`) there is a single line per source line and no pairing (verified live: a 1-line receipt → 1 put-away line, `linesRegistered = 1`).

### Identifier Resolution Order

1. `subject` — GUID resolves to `Warehouse Activity Header.SystemId`; non-GUID text resolves to `Warehouse Activity Header."No."` (Type = Put-away).
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `putawayNo` / `no` — resolves to `"No."`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Put-away `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Put-away `SystemId` |
| `putawayNo` / `no` | Code[20] | One of | Put-away `No.` |

No other parameters are accepted. To adjust per-line `Qty. to Handle` before registering, use `Data.Records.Set` on `Warehouse Activity Line`.

### Response

Verified live (BC 27, CRONUS IS) — registering `PU000025` (1 line, 5 × item `1896-S`):

```json
{
  "status": "Success",
  "putawayNo": "PU000025",
  "linesRegistered": 1,
  "totalQtyRegistered": 5,
  "postedWhseReceiptNo": "R_000030",
  "postedWhseReceiptSystemId": "26cfe041-ff61-f111-b7a5-fb5809e04ea8",
  "registeredPutawayNo": "PU_000007",
  "registeredPutawaySystemId": "244cf98f-ff61-f111-b7a5-fb5809e04ea8",
  "receiptLines": [
    {
      "postedWhseReceiptNo": "R_000030",
      "lineNo": 10000,
      "sourceDocument": "Purchase Order",
      "sourceNo": "106032",
      "sourceLineNo": 10000,
      "itemNo": "1896-S",
      "qty": 5,
      "qtyPutAway": 5,
      "qtyOutstanding": 0,
      "status": "Completely Put Away"
    }
  ],
  "message": "Warehouse Put-away PU000025 (1 lines) registered against Posted Whse. Receipt R_000030."
}
```

`qtyPutAway` and `status` on each receipt line reflect the post-registration totals: full registrations transition the line to `Completely Put Away`; partial registrations leave it at `Partially Put Away` with `qtyOutstanding > 0`.

### Errors

- `Warehouse Put-away identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, putawayNo, no).`
- `Warehouse Put-away <id> does not exist.`
- `Warehouse Activity <no> is not of Type Put-away.`
- `Warehouse Put-away <no> has no lines.`
- `Nothing to register.` — all lines have `Qty. to Handle = 0`.
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- BC underlying error from `Whse.-Activity-Register` (e.g. `Qty. to Handle (Base) in the line must be equal to ...` when Take and Place pairs are out of sync).

---

## Warehouse.Receipt.Create

**Direction**: Inbound (action)

Creates one Warehouse Receipt per supplied source document by delegating to BC codeunit 5751 `Get Source Doc. Inbound`. Supported source types: `PurchaseOrder`, `SalesReturnOrder`, `TransferOrder` (inbound side).

Each source produces its own `Warehouse Receipt Header`. The source must be **Released**, and its receiving `Location Code` must have **Require Receive** = true.

Not a posting action — no posting gate. Not idempotent: every call inserts new Warehouse Receipt Headers from the relevant number series.

### Location Source Per Source Type

| Source Type | Location used |
|-------------|---------------|
| PurchaseOrder | `Purchase Header."Location Code"` |
| SalesReturnOrder | `Sales Header."Location Code"` |
| TransferOrder | `Transfer Header."Transfer-to Code"` (the receiving location) |

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceDocuments` | Array | Yes | One or more `{ sourceType, documentNo }` entries |
| `sourceDocuments[].sourceType` | Text | Yes | `"PurchaseOrder"`, `"SalesReturnOrder"`, or `"TransferOrder"` (case-insensitive) |
| `sourceDocuments[].documentNo` | Code[20] | Yes | The source document number; the source must be Released |
| `locationCode` | Code[10] | No | If set, every source must receive at this location; mismatches return Error. Subject to write-restriction on `Warehouse Receipt Header."Location Code"` |
| `assignedUserId` | Code[50] | No | Applied to each created `Warehouse Receipt Header` after creation |
| `postingDate` | Date | No | Format 9 (ISO `yyyy-MM-dd`). Applied to each created `Warehouse Receipt Header` after creation |

### Example Request

```json
{
  "sourceDocuments": [
    { "sourceType": "PurchaseOrder", "documentNo": "PO-0001" },
    { "sourceType": "TransferOrder", "documentNo": "TO-0007" }
  ],
  "locationCode": "BLUE",
  "assignedUserId": "RECEIVER01",
  "postingDate": "2025-11-15"
}
```

### Response

```json
{
  "status": "Success",
  "noOfReceipts": 2,
  "receipts": [
    {
      "recordSystemId": "...",
      "no": "WR-0001",
      "locationCode": "BLUE",
      "assignedUserId": "RECEIVER01",
      "sourceType": "PurchaseOrder",
      "sourceDocumentNo": "PO-0001",
      "linesCreated": 2
    }
  ]
}
```

### Errors

- `sourceDocuments is required and must contain at least one entry.`
- `Source #N is missing sourceType or documentNo (both required).`
- `Unsupported sourceType '<X>'. Expected: PurchaseOrder, SalesReturnOrder, TransferOrder.`
- `Purchase Order '<no>' not found.` / `Sales Return Order '<no>' not found.` / `Transfer Order '<no>' not found.`
- `Purchase Order '<no>' is not Released.` / `Sales Return Order '<no>' is not Released.` / `Transfer Order '<no>' is not Released.`
- `Purchase Order '<no>' uses location '<x>' which does not match the requested locationCode '<y>'.` (and the equivalent error per source type)
- `Location '<code>' (from Purchase Order '<no>') does not require receive routing` — set `Require Receive` on the Location card.
- `No Warehouse Receipt was created for <sourceType> '<no>' — already on an open receipt, no lines remain to receive, or put-away already started.` — bundled cause: source already on an open WR, or already fully received, or has an active put-away. Returned even when the source has been previously fully received via a posted WR.
- `Field Location Code is restricted for write on table Warehouse Receipt Header.` — `Field Access ori` blocks the `locationCode` parameter.

### Discovery — find receipt-required locations

Use `Data.Records.Get` on `Location` (table 14) with `tableView = "WHERE(Require Receive=CONST(true))"` to enumerate candidates. Inspect `RequirePutaway`, `DirectedPutawayandPick`, and `BinMandatory` on each row to anticipate downstream put-away or bin requirements.

---

## Warehouse.Receipt.Post

**Direction**: Inbound (action)

Posts a `Warehouse Receipt` via BC codeunit 5760 `Whse.-Post Receipt`.

Gated by **Warehouse Posting ori**. No invoice option — warehouse receipts only post receipt of goods. The posted source documents that result (Posted Purchase Receipt, Posted Return Receipt, Posted Transfer Receipt) are reported in the response.

After a successful post the `Warehouse Receipt Header` is deleted by BC. Re-posting the same identifier returns `The Warehouse Receipt Header does not exist.`.

### Identifier Resolution Order

1. `subject` — GUID resolves to `Warehouse Receipt Header.SystemId`; non-GUID text resolves to `Warehouse Receipt Header."No."`.
2. JSON `systemId` / `recordSystemId` / `id` — resolves to `SystemId`.
3. JSON `receiptNo` / `no` — resolves to `"No."`.

The first match wins. If none resolve, the call returns `Warehouse Receipt identifier must be specified ...`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | Text/Guid | One of | Receipt `No.` or `SystemId` |
| `systemId` / `recordSystemId` / `id` | Guid | One of | Receipt `SystemId` |
| `receiptNo` / `no` | Code[20] | One of | Receipt `No.` |

### Response

```json
{
  "status": "Success",
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "AC903C2D-DF61-F111-B7A5-FCCA66B996D7",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo": "107242",
      "sourceDocument": "Purchase Order",
      "sourceNo": "106031"
    }
  ]
}
```

Number formats are example only. `postedWhseReceiptNo` comes from the location's `Whse. Receipt Nos.` series; `postedSourceNo` from the source's posting series. `postedSourceDocument` is one of `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`. `postedDocuments` is derived from `Posted Whse. Receipt Line` and de-duplicated by `(postedSourceDocument, postedSourceNo)`.

### Errors

- `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).`
- `Posting denied: missing 'BIFROST WhsePost ori' permission set.`
- `Warehouse Receipt <no> has no lines to post.`
- `The Warehouse Receipt Header does not exist.` — typically when re-posting an identifier whose header was deleted on a previous successful post.
- BC underlying error from `Whse.-Post Receipt` (e.g. quantity to receive is zero, item tracking incomplete, posting date locked, missing Bin Code on a directed put-away/pick location).

---

## Warehouse.Receipt.Post.Preview

**Direction**: Inbound (action)

Simulates posting a Warehouse Receipt and returns the captured ledger entries without committing. Driven through `Whse.-Post Receipt (Yes/No)` (codeunit 5761) bound with `EventSubscriberInstance = Manual`, whose `OnRunPreview` subscriber sets preview mode on `Whse.-Post Receipt` (5760). The transaction is then rolled back via `Gen. Jnl.-Post Preview`.

Not gated — no actual posting happens, so no posting gate is enforced.

### Identifier Resolution

Same as `Warehouse.Receipt.Post` (subject GUID/text, then JSON `systemId`/`recordSystemId`/`id`/`receiptNo`/`no`).

### Captured Tables

BC's Posting Preview only captures inserts into a fixed whitelist:

| Table | ID | Always present? |
|-------|----|-----------------|
| Item Ledger Entry | 32 | Yes — one per receipt line |
| Value Entry | 5802 | Yes — one Direct Cost entry per receipt line |
| G/L Entry | 17 | Only if cost adjustment runs inline. Receipts normally produce none |

`Posted Whse. Receipt Header` (table 7320) is **not** in the whitelist. As a result `predictedNumbers.postedWhseReceiptNo` is always emitted but is **always empty** in preview.

### Number Redaction

BC's Posting Preview redacts assigned document numbers to `***` to signal they would be rolled back. Affects:

- `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` — always `***` in preview.
- `preview[].rows[].DocumentNo_` on Item Ledger Entry / Value Entry rows — also `***`.

Use `Warehouse.Receipt.Post` to obtain the actual numbers.

### Response

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 0,
    "totalCreditLCY": 0
  },
  "preview": [
    { "tableName": "Item Ledger Entry", "tableNo": 32, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] },
    { "tableName": "Value Entry",       "tableNo": 5802, "rowCount": 1, "rows": [ /* DocumentNo_ = "***" */ ] }
  ]
}
```

The `predictedNumbers` key set varies by source type:

| Source on the receipt | Key | Value in preview |
|-----------------------|-----|------------------|
| Purchase Order | `postedPurchaseReceiptNo` | `***` |
| Sales Return Order | `postedReturnReceiptNo` | `***` |
| Inbound Transfer Order | `postedTransferReceiptNo` | `***` |

Warehouse receipts have no direct G/L impact — `balanced` is `true` with `0` totals.

### Errors

- `Warehouse Receipt identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, receiptNo).`
- `Warehouse Receipt <no> has no lines to post.`
- BC underlying error from `Whse.-Post Receipt` (the same conditions as the real post).

---

## Warehouse.Shipment.PreviewPost

**Direction**: Inbound (simulates posting; no data modification)

**Purpose**: Simulates posting a Warehouse Shipment (Ship + Invoice) and returns the ledger entries that **would** be produced — without writing anything to the database. Drives the BC `Gen. Jnl.-Post Preview.SetContext + Run()` headless flow against the `Whse.-Post Shipment (Yes/No)` subscriber. Typical previewed tables include `Item Ledger Entry`, `Value Entry`, `Posted Whse. Shipment Header`, `Posted Whse. Shipment Line`, `Sales Shipment Header`, `Sales Shipment Line`, plus `Sales Invoice Header`, `Sales Invoice Line`, `G/L Entry`, `VAT Entry`, `Cust. Ledger Entry` for the invoice pass.

**Important — Invoice flag is fixed.** BC's `Whse.-Post Shipment (Yes/No)` preview subscriber forces `Invoice = true`. The response `invoice` field is therefore always `true`.

### Input Parameters

First match wins:

| Method | Subject field | Data field |
|--------|---------------|------------|
| SystemId GUID | `<guid>` (no braces) | — |
| Shipment No. | `WS-0001` | — |
| SystemId in data | — | `systemId` / `recordSystemId` / `id` |
| Shipment No. in data | — | `shipmentNo` / `no` |

### Response Format

```json
{
  "status": "Success",
  "rollback": true,
  "summary": "Preview-posting warehouse shipment WS-0001 (2 lines, Ship + Invoice) would create 10 ledger entries across 6 tables. G/L impact is balanced.",
  "shipmentNo": "WS-0001",
  "locationCode": "WHITE",
  "invoice": true,
  "linesToPost": 2,
  "postingDate": "2026-04-15",
  "lcyCode": "ISK",
  "predictedNumbers": ["INV-0012"],
  "totals": { "balanced": true, "totalDebitLCY": 250.0, "totalCreditLCY": 250.0 },
  "preview": [
    {
      "tableId": 32,
      "tableName": "Item Ledger Entry",
      "tableCaption": "Item Ledger Entry",
      "entryCount": 1,
      "entries": [
        {
          "id": "00000000-0000-0000-0000-000000000000",
          "primaryKey": { "EntryNo_": "1" },
          "fields": { "ItemNo_": "1000", "DocumentNo_": "***", "Quantity": "-5", "LocationCode": "WHITE" }
        }
      ]
    }
  ]
}
```

### Response Fields

Same envelope as `Inventory.ItemJournal.PreviewPost` (`rollback`, `summary`, `totals`, `preview[]` with `tableCaption` + per-entry `id`/`primaryKey`/`fields`). Shipment-specific additions:

| Field | Type | Description |
|-------|------|-------------|
| `shipmentNo` / `locationCode` | string | Identifying header fields. |
| `invoice` | boolean | Always `true` — BC's preview subscriber forces Ship + Invoice. |
| `linesToPost` | integer | Warehouse Shipment Lines fed into the preview. |
| `predictedNumbers` | string[] | Distinct `Document No.` values across the previewed G/L entries (typically the future Sales Invoice No., Posted Whse. Shipment No., etc.). May contain `"***"`. |

### Operational Notes

- **WMS locations require a registered pick first.** On a location with `Require Pick = true` (e.g. CRONUS `WHITE` / `GULUR`), Warehouse Shipment Lines start with `Qty. to Ship = 0`. The warehouse pick must be created **and registered** before previewing — pick registration is what writes `Qty. to Ship` back onto the shipment lines.
- **Locations with `Require Shipment = true` and `Require Pick = false`** behave like a basic shipping flow: `Qty. to Ship` is populated when the shipment line is created, so the preview runs directly without a pick step.
- **Invoice flag is fixed at `true`.** To preview Ship-only behaviour, use the source document's own posting preview (e.g. `Sales.Document.PreviewPost`).

### Errors

BC validation errors propagate verbatim. Common errors:
- `Warehouse Shipment identifier must be specified in subject field or request JSON (systemId, recordSystemId, id, no, shipmentNo).`
- `Warehouse Shipment {no} has no lines to post.`
- `There is nothing to post because the document does not contain a quantity or amount.` — every line has `Qty. to Ship = 0` (on WMS locations, no pick has been registered).
- `Posting preview failed and no entries were captured. The shipment cannot be posted in its current state.` — rare catch-all.

### Related Message Types

- [Warehouse.Shipment.Create](#warehouseshipmentcreate) - Create a shipment from a source document.
- [Warehouse.Shipment.Post](#warehouseshipmentpost) - Actually post (with or without invoice).
- [Finance.GeneralJournal.PreviewPost](/foundation/message-types/finance/#financegeneraljournalpreviewpost) - Same pattern for the general journal.

---

## Implementation Details

### Object IDs

| Object Type | Object ID | Object Name |
|-------------|-----------|-------------|
| Enum Value | 10078085 | Inventory.ItemJournal.SetupNewLine |
| Implementation Codeunit | 10078128 | Item Jnl. SetupLine Impl ori |
| Help Codeunit | 10077973 | Item Jnl. SetupLine Help ori |
| Enum Value | 10078086 | Inventory.ItemJournal.Check |
| Implementation Codeunit | 10078129 | Item Journal Check Impl ori |
| Help Codeunit | 10077974 | Item Journal Check Help ori |
| Enum Value | 10078087 | Inventory.ItemJournal.Post |
| Implementation Codeunit | 10078130 | Item Journal Post Impl ori |
| Help Codeunit | 10077975 | Item Journal Post Help ori |
| Enum Value | 10078123 | Inventory.ItemJournal.PreviewPost |
| Implementation Codeunit | 10078127 | Item Jnl. Prev. Post Impl ori |
| Help Codeunit | 10077972 | Item Jnl. Prev. Post Help ori |
| Enum Value | 10078097 | Inventory.TransferOrder.Create |
| Implementation Codeunit | 10078132 | Transfer Order Create Impl ori |
| Help Codeunit | 10077977 | Transfer Order Create Help ori |
| Enum Value | 10078098 | Inventory.TransferOrder.Release |
| Implementation Codeunit | 10078134 | Transf. Order Release Impl ori |
| Help Codeunit | 10077979 | Transf. Order Release Help ori |
| Enum Value | 10078099 | Inventory.TransferOrder.Reopen |
| Implementation Codeunit | 10078135 | Transfer Order Reopen Impl ori |
| Help Codeunit | 10077980 | Transfer Order Reopen Help ori |
| Enum Value | 10078100 | Inventory.TransferOrder.Post |
| Implementation Codeunit | 10078133 | Transfer Order Post Impl ori |
| Help Codeunit | 10077978 | Transfer Order Post Help ori |
| Enum Value | 10078101 | Inventory.TransferOrder.PreviewPost |
| Implementation Codeunit | 10078131 | Transf Doc Prev. Post Impl ori |
| Help Codeunit | 10077976 | Transf Doc Prev. Post Help ori |
| Enum Value | 10078102 | Inventory.TransferOrder.Statistics |
| Implementation Codeunit | 10078137 | Transfer Order Stats Impl ori |
| Help Codeunit | 10077981 | Transfer Order Stats Help ori |
| Process Codeunit | 10078138 | Transfer Post Subscriber ori |
| Process Codeunit | 10078136 | Transf. Order Reopen Proc. ori |
| Enum Value | 10078106 | Inventory.AssemblyOrder.Create |
| Implementation Codeunit | 10078122 | Assembly Order Create Impl ori |
| Help Codeunit | 10077968 | Assembly Order Create Help ori |
| Enum Value | 10078107 | Inventory.AssemblyOrder.RefreshLines |
| Implementation Codeunit | 10078119 | Asm. Order RefreshLn Impl ori |
| Help Codeunit | 10077965 | Asm. Order RefreshLn Help ori |
| Enum Value | 10078108 | Inventory.AssemblyOrder.Release |
| Implementation Codeunit | 10078124 | Asm. Order Release Impl ori |
| Help Codeunit | 10077970 | Asm. Order Release Help ori |
| Enum Value | 10078109 | Inventory.AssemblyOrder.Reopen |
| Implementation Codeunit | 10078125 | Assembly Order Reopen Impl ori |
| Help Codeunit | 10077971 | Assembly Order Reopen Help ori |
| Enum Value | 10078110 | Inventory.AssemblyOrder.Post |
| Implementation Codeunit | 10078123 | Assembly Order Post Impl ori |
| Help Codeunit | 10077969 | Assembly Order Post Help ori |
| Enum Value | 10078111 | Inventory.AssemblyOrder.PreviewPost |
| Implementation Codeunit | 10078121 | Asm. Doc Prev. Post Impl ori |
| Help Codeunit | 10077967 | Asm. Doc Prev. Post Help ori |
| Enum Value | 10078112 | Inventory.AssemblyOrder.Statistics |
| Implementation Codeunit | 10078120 | Asm. Order Statistics Impl ori |
| Help Codeunit | 10077966 | Asm. Order Statistics Help ori |
| Process Codeunit | 10078126 | Asm. Order Reopen Process ori |
| Enum Value | 10078121 | Warehouse.Shipment.Create |
| Implementation Codeunit | 10078148 | Whse Shipment Create Impl ori |
| Help Codeunit | 10077989 | Whse Shipment Create Help ori |
| Enum Value | 10078122 | Warehouse.Shipment.Post |
| Implementation Codeunit | 10078149 | Whse Shipment Post Impl ori |
| Help Codeunit | 10077990 | Whse Shipment Post Help ori |
| Enum Value | 10078130 | Warehouse.Pick.Create |
| Implementation Codeunit | 10078139 | Whse Pick Create Impl ori |
| Process Codeunit | 10078140 | Whse Pick Create Process ori |
| Help Codeunit | 10077982 | Whse Pick Create Help ori |
| Enum Value | 10078131 | Warehouse.Pick.Register |
| Implementation Codeunit | 10078141 | Whse Pick Register Impl ori |
| Help Codeunit | 10077983 | Whse Pick Register Help ori |
| Enum Value | 10078132 | Warehouse.Putaway.Create |
| Implementation Codeunit | 10078142 | Whse Putaway Create Impl ori |
| Process Codeunit | 10078143 | Whse Putaway Create Proc. ori |
| Help Codeunit | 10077984 | Whse Putaway Create Help ori |
| Enum Value | 10078133 | Warehouse.Putaway.Register |
| Implementation Codeunit | 10078144 | Whse Putaway Register Impl ori |
| Help Codeunit | 10077985 | Whse Putaway Register Help ori |
| Enum Value | 10078127 | Warehouse.Receipt.Create |
| Implementation Codeunit | 10078145 | Whse Receipt Create Impl ori |
| Help Codeunit | 10077986 | Whse Receipt Create Help ori |
| Enum Value | 10078128 | Warehouse.Receipt.Post |
| Implementation Codeunit | 10078146 | Whse Receipt Post Impl ori |
| Help Codeunit | 10077987 | Whse Receipt Post Help ori |
| Enum Value | 10078129 | Warehouse.Receipt.Post.Preview |
| Implementation Codeunit | 10078147 | Whse Rcpt Post Prev. Impl ori |
| Help Codeunit | 10077988 | Whse Rcpt Post Prev. Help ori |
| Enum Value | 10078126 | Warehouse.Shipment.PreviewPost |
| Implementation Codeunit | 10078150 | Whse Ship. Prev. Post Impl ori |
| Help Codeunit | 10077991 | Whse Ship. Prev. Post Help ori |
| Gate Table | 10077908 | Warehouse Posting ori |
| Permission Set | 10077900 | BIFROST WhsePost ori |

### File Locations

```
app/src/Message Type/
  Implementations/Inventory/
    ItemJnlSetupLineImpl.Codeunit.al
    ItemJournalCheckImpl.Codeunit.al
    ItemJournalPostImpl.Codeunit.al
    ItemJnlPreviewPostImpl.Codeunit.al
    TransferOrder/
      TransferOrderCreateImpl.Codeunit.al
      TransferOrderReleaseImpl.Codeunit.al
      TransferOrderReopenImpl.Codeunit.al
      TransferOrderPostImpl.Codeunit.al
      TransferDocPreviewPostImpl.Codeunit.al
      TransferOrderStatisticsImpl.Codeunit.al
      TransferPostSubscriber.Codeunit.al
      TransferOrderReopenProcess.Codeunit.al
    AssemblyOrder/
      AssemblyOrderCreateImpl.Codeunit.al
      AsmOrderRefreshLinesImpl.Codeunit.al
      AssemblyOrderReleaseImpl.Codeunit.al
      AssemblyOrderReopenImpl.Codeunit.al
      AssemblyOrderPostImpl.Codeunit.al
      AssemblyDocPreviewPostImpl.Codeunit.al
      AsmOrderStatisticsImpl.Codeunit.al
      AssemblyOrderReopenProcess.Codeunit.al
  Help/Inventory/
    ItemJnlSetupLineHelp.Codeunit.al
    ItemJournalCheckHelp.Codeunit.al
    ItemJournalPostHelp.Codeunit.al
    ItemJnlPreviewPostHelp.Codeunit.al
    TransferOrder/
      TransferOrderCreateHelp.Codeunit.al
      TransferOrderReleaseHelp.Codeunit.al
      TransferOrderReopenHelp.Codeunit.al
      TransferOrderPostHelp.Codeunit.al
      TransferDocPreviewPostHelp.Codeunit.al
      TransferOrderStatisticsHelp.Codeunit.al
    AssemblyOrder/
      AssemblyOrderCreateHelp.Codeunit.al
      AsmOrderRefreshLinesHelp.Codeunit.al
      AssemblyOrderReleaseHelp.Codeunit.al
      AssemblyOrderReopenHelp.Codeunit.al
      AssemblyOrderPostHelp.Codeunit.al
      AssemblyDocPreviewPostHelp.Codeunit.al
      AsmOrderStatisticsHelp.Codeunit.al
    Warehouse/
      WhseShipmentCreateImpl.Codeunit.al
      WhseShipmentPostImpl.Codeunit.al
      WhseShipPreviewPostImpl.Codeunit.al
      WhsePickCreateImpl.Codeunit.al
      WhsePickCreateProcess.Codeunit.al
      WhsePickRegisterImpl.Codeunit.al
      WhsePutawayCreateImpl.Codeunit.al
      WhsePutawayCreateProcess.Codeunit.al
      WhsePutawayRegisterImpl.Codeunit.al
  Help/Inventory/
    Warehouse/
      WhseShipmentCreateHelp.Codeunit.al
      WhseShipmentPostHelp.Codeunit.al
      WhseShipPreviewPostHelp.Codeunit.al
      WhsePickCreateHelp.Codeunit.al
      WhsePickRegisterHelp.Codeunit.al
      WhsePutawayCreateHelp.Codeunit.al
      WhsePutawayRegisterHelp.Codeunit.al
app/src/Setup/Posting Gates/
  BifrostWarehousePosting.Table.al
  BifrostPostingGate.Codeunit.al
app/src/Permission Set/
  WarehousePosting.PermissionSet.al
```
