---
id: inventory
title: "Inventory message types"
sidebar_position: 6
---

This document describes the Inventory-related message types in Bifröst Foundation.

Errors and warnings follow the shared shape - see [Errors and warnings](../reference/errors.md). Error responses never contain a call stack.

## Overview

Inventory message types provide functionality for working with item journals (line setup, validation, posting), transfer orders (create, release, reopen, post, preview post, statistics) and assembly orders. Warehouse shipments, receipts, picks and put-aways are handled by the separate [Bifröst Warehouse](/warehouse/) app — see [Warehouse message types](#warehouse-message-types).

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
  "code": "BusinessCentralError",
  "error": "Error message text"
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
| `code` | string | Error code, `BusinessCentralError` when Business Central refused the posting (only on Error status) - see [Errors and warnings](../reference/errors.md) |

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
- Posting through this message is wrapped in an isolated codeunit so errors return a structured error response (code `BusinessCentralError`) rather than aborting the queue task; the call stack goes to telemetry only

### Workflow

1. Resolve the journal batch from subject or data
2. Verify lines exist in the batch
3. Call "Item Jnl.-Post Batch" to post all lines
4. Verify Item Register was created
5. On success: return register statistics
6. On error: return a structured error (code `BusinessCentralError` for a Business Central error) - see [Errors and warnings](../reference/errors.md)

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
- The underlying BC error message is returned in `error` (no call stack).

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

## Warehouse message types

The ten `Warehouse.*` message types — warehouse shipments, receipts, picks and put-aways — are not part of Bifröst Foundation. They ship in the separate **[Bifröst Warehouse](/warehouse/)** app, which runs on Foundation. To call them, install Bifröst Warehouse.

| Message Type | Purpose |
|--------------|---------|
| [Warehouse.Shipment.Create](/warehouse/reference/message-types/warehouse-shipment-create/) | Creates warehouse shipments from released Sales Orders and outbound Transfer Orders |
| [Warehouse.Shipment.Post](/warehouse/reference/message-types/warehouse-shipment-post/) | Posts a warehouse shipment (ship, optionally invoice) |
| [Warehouse.Shipment.PreviewPost](/warehouse/reference/message-types/warehouse-shipment-previewpost/) | Previews posting a warehouse shipment (ship + invoice); rolled back |
| [Warehouse.Receipt.Create](/warehouse/reference/message-types/warehouse-receipt-create/) | Creates warehouse receipts from released Purchase Orders, Sales Return Orders and inbound Transfer Orders |
| [Warehouse.Receipt.Post](/warehouse/reference/message-types/warehouse-receipt-post/) | Posts a warehouse receipt |
| [Warehouse.Receipt.Post.Preview](/warehouse/reference/message-types/warehouse-receipt-post-preview/) | Previews posting a warehouse receipt; rolled back |
| [Warehouse.Pick.Create](/warehouse/reference/message-types/warehouse-pick-create/) | Creates a warehouse pick from a warehouse shipment |
| [Warehouse.Pick.Register](/warehouse/reference/message-types/warehouse-pick-register/) | Registers a warehouse pick |
| [Warehouse.Putaway.Create](/warehouse/reference/message-types/warehouse-putaway-create/) | Creates, or returns the existing, put-away for a posted warehouse receipt |
| [Warehouse.Putaway.Register](/warehouse/reference/message-types/warehouse-putaway-register/) | Registers a warehouse put-away |

The warehouse posting gate stays in Foundation: posting and registering need the `BIFROST WhsePost ori` permission set (see [Posting Gates](/foundation/reference/setup/#posting-gates-bifrost-gl--item--fa--job--resource--warehouse-posting)).

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
app/src/Setup/Posting Gates/
  BifrostWarehousePosting.Table.al
  BifrostPostingGate.Codeunit.al
app/src/Permission Set/
  WarehousePosting.PermissionSet.al
```
