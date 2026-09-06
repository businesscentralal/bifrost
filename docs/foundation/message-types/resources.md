---
id: resources
title: "Resources message types"
sidebar_position: 8
---

This document describes the Resources-related message types in Bifröst Foundation.

## Overview

Resources message types provide functionality for working with resource journals, including line setup, validation and posting.

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Resources.ResourceJournal.SetupNewLine](#resourcesresourcejournalsetupnewline) | Inbound | Creates a new resource journal line with defaults |
| [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck) | Outbound | Validates a resource journal batch and returns readiness status |
| [Resources.ResourceJournal.Post](#resourcesresourcejournalpost) | Inbound | Posts a resource journal batch and returns posting statistics |

---

## Resources.ResourceJournal.SetupNewLine

**Direction**: Inbound (creates a new journal line)

**Purpose**: Creates and inserts a new resource journal line in the specified batch, pre-populated with defaults from BC's `SetUpNewLine` procedure. This is the default way to prepare a resource journal line before populating business fields via `Data.Records.Set`.

Default values inherited from the template and batch include Entry Type, Posting Date, and template-driven fields. If a No. Series is configured on the batch, Document No. is populated from the next number in the series. The line is assigned the next available Line No. (last line + 10000, or 10000 if the batch is empty).

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Resources.ResourceJournal.SetupNewLine",
  "source": "MyIntegrationApp v1.0",
  "subject": "RES|DEFAULT",
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
    "templateName": "RESOURCE",
    "batchName": "DEFAULT"
  }
}
```

JSON data parameters take precedence over the subject field.

#### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldNumbers` | int[] | all fields | Field numbers to include in response |
| `noOfLines` | integer | 1 | Number of lines to create (1–100) |
| `clearExistingLines` | boolean | false | When true, deletes all existing lines in the batch first |

### Response Format

Uses the `Data.Records.Get` response shape.

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
      "primaryKey": {
        "JournalTemplateName": "RESOURCE",
        "JournalBatchName": "DEFAULT",
        "LineNo_": 10000
      },
      "fields": {
        "PostingDate": "2026-04-15",
        "DocumentNo_": "RJ-00001",
        "EntryType": "Usage",
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
| `result[].id` | string | SystemId of the new journal line |
| `result[].primaryKey` | object | `JournalTemplateName`, `JournalBatchName`, `LineNo_` |
| `result[].fields` | object | All non-PK fields (or only those in `fieldNumbers`) |

### Typical Workflow

1. Call `Resources.ResourceJournal.SetupNewLine` to create lines with defaults.
2. Use the returned `id` with `Data.Records.Set` to populate Resource No., Quantity, Unit Cost, etc.
3. Call `Resources.ResourceJournal.Check` to validate.
4. Call `Resources.ResourceJournal.Post` to post.

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No template/batch, SystemId, or pipe-separated subject provided |
| Batch not found | The specified batch does not exist |

### Related Message Types

- [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck)
- [Resources.ResourceJournal.Post](#resourcesresourcejournalpost)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)

---

## Resources.ResourceJournal.Check

**Direction**: Outbound (validation only)

**Purpose**: Validates a resource journal batch without posting. Returns readiness status with detailed validation results.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Resources.ResourceJournal.Check",
  "source": "dynamics365/businesscentral",
  "subject": "RES|DEFAULT",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Ready
```json
{
  "status": "Success",
  "validationResult": "Ready",
  "templateName": "RESOURCE",
  "batchName": "DEFAULT",
  "batchDescription": "Default Resource Batch",
  "lineCount": 2,
  "totalQuantity": 16.0,
  "totalCost": 800.0,
  "errorCount": 0,
  "warningCount": 0,
  "errors": [],
  "warnings": []
}
```

#### ReadyWithWarnings / NotReady

Same shape with `validationResult` set accordingly and populated `errors` / `warnings` arrays.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "Success" for validation |
| `validationResult` | string | "Ready", "ReadyWithWarnings", or "NotReady" |
| `templateName` | string | Journal template name |
| `batchName` | string | Journal batch name |
| `batchDescription` | string | Journal batch description |
| `lineCount` | integer | Number of journal lines in batch |
| `totalQuantity` | decimal | Sum of Quantity on all lines |
| `totalCost` | decimal | Sum of Total Cost on all lines |
| `errorCount` | integer | Number of blocking errors |
| `warningCount` | integer | Number of non-blocking warnings |
| `errors` | array | Error messages (prevent posting) |
| `warnings` | array | Warning messages (posting allowed) |

### Validation Rules

Uses BC's "Res. Jnl.-Check Line" codeunit via the Error Message Management framework to collect all errors in a single pass.

**Per-Line Validation includes:**
- Required fields (Posting Date, Document No., Resource No., Quantity ≠ 0)
- Posting period
- Resources: Must exist, not be Blocked
- Unit of Measure consistency
- Dimensions: Required dimensions must be present and valid

**Additional Warnings (non-blocking):**
- Future posting dates generate warnings

### Error Handling

| Error | Cause |
|-------|-------|
| Missing identification | No subject or data parameters provided |
| Batch not found | Template/batch combination does not exist |

### Notes

- **Non-Destructive**: Does NOT modify any data
- Collects all validation errors, not just the first

### Related Message Types

- [Resources.ResourceJournal.SetupNewLine](#resourcesresourcejournalsetupnewline)
- [Resources.ResourceJournal.Post](#resourcesresourcejournalpost)
- [Help.Tables.Get](/foundation/message-types/metadata/#helptablesget)

---

## Resources.ResourceJournal.Post

**Direction**: Inbound (modifies data — posts journal and clears lines)

**Purpose**: Posts a validated resource journal batch to create Resource Ledger Entries.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Resources.ResourceJournal.Post",
  "source": "MyIntegrationApp v1.0",
  "subject": "RES|BATCH001",
  "data": {}
}
```

Identification follows the same three-method pattern.

### Response Format

#### Success
```json
{
  "status": "Success",
  "templateName": "RESOURCE",
  "batchName": "BATCH001",
  "batchDescription": "Default Resource Batch",
  "linesPosted": 2,
  "postingDate": "2026-04-15",
  "totalQuantity": 16.0,
  "totalCost": 800.0,
  "resourceRegisterNo": 21,
  "resourceRegisterId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "fromEntryNo": 301,
  "toEntryNo": 302
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
| `totalCost` | decimal | Total Cost posted |
| `resourceRegisterNo` | integer | Resource Register number created (when register was produced) |
| `resourceRegisterId` | string | Resource Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First Resource Ledger Entry No. in register |
| `toEntryNo` | integer | Last Resource Ledger Entry No. in register |
| `error` | string | Error message (only on Error status) |
| `callstack` | string | Error callstack (only on Error status) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post
- Posting validation errors
- Missing journal batch identification

### Notes

- Uses BC's "Res. Jnl.-Post Batch" codeunit for posting
- All journal lines are cleared from the batch after successful posting
- Posting is wrapped in an isolated codeunit so errors return a structured response with `callstack`

**Recommended approach:** Validate with `Resources.ResourceJournal.Check` first, then post with `Resources.ResourceJournal.Post`.

### Related Message Types

- [Resources.ResourceJournal.SetupNewLine](#resourcesresourcejournalsetupnewline)
- [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Implementation Details

### Object IDs

| Object Type | Object ID | Object Name |
|-------------|-----------|-------------|
| Enum Value | 10078094 | Resources.ResourceJournal.SetupNewLine |
| Implementation Codeunit | 10078197 | Res. Jnl. SetupLine Impl ori |
| Help Codeunit | 10078032 | Res. Jnl. SetupLine Help ori |
| Enum Value | 10078095 | Resources.ResourceJournal.Check |
| Implementation Codeunit | 10078198 | Resource Jnl. Check Impl ori |
| Help Codeunit | 10078033 | Resource Jnl. Check Help ori |
| Enum Value | 10078096 | Resources.ResourceJournal.Post |
| Implementation Codeunit | 10078199 | Resource Journal Post Impl ori |
| Help Codeunit | 10078034 | Resource Journal Post Help ori |

### File Locations

```
app/src/Message Type/
  Implementations/Resources/
    ResourceJnlSetupLineImpl.Codeunit.al
    ResourceJournalCheckImpl.Codeunit.al
    ResourceJournalPostImpl.Codeunit.al
  Help/Resources/
    ResourceJnlSetupLineHelp.Codeunit.al
    ResourceJournalCheckHelp.Codeunit.al
    ResourceJournalPostHelp.Codeunit.al
```
