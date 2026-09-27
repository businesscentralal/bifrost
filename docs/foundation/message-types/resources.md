---
id: resources
title: "Resources message types"
sidebar_position: 8
---

This document describes the Resources-related message types in Bifröst Foundation.

Errors and warnings follow the shared shape - see [Errors and warnings](../reference/errors.md). Error responses never contain a call stack.

## Overview

Resources message types provide functionality for working with resource journals, including line setup, validation and posting.

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate) | Inbound | Adds lines to an existing batch, with values or blank |
| [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck) | Outbound | Validates a resource journal batch and returns readiness status |
| [Resources.ResourceJournal.Post](#resourcesresourcejournalpost) | Inbound | Posts a resource journal batch and returns posting statistics |

---

## Resources.ResourceJournal.Create

**Direction**: Inbound

Adds lines to an existing resource journal batch in one call. With `lines`, every line is checked before anything is inserted and every problem is reported in one answer, so nothing is created when one line is wrong (at most 200 lines). Without `lines`, `noOfLines` blank lines are inserted with the BC defaults. `clearExistingLines` deletes the batch's lines first and is destructive. The call never creates a batch.

```json
{
  "type": "Resources.ResourceJournal.Create",
  "subject": "RESOURCE|DEFAULT",
  "data": {
    "lines": [
      { "resourceNo": "LINDA", "quantity": 2 }
    ]
  }
}
```

### Typical Workflow

1. `Resources.ResourceJournal.Create` with `lines`.
2. `Resources.ResourceJournal.Check` to validate the batch.
3. `Resources.ResourceJournal.Post` to post.

The request parameters, the line fields (required and optional), the validation order and the errors are on the reference page: [Resources.ResourceJournal.Create](/foundation/reference/message-types/resources-resourcejournal-create/).

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

- [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate)
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
| `totalCost` | decimal | Total Cost posted |
| `resourceRegisterNo` | integer | Resource Register number created (when register was produced) |
| `resourceRegisterId` | string | Resource Register SystemId (GUID without braces) |
| `fromEntryNo` | integer | First Resource Ledger Entry No. in register |
| `toEntryNo` | integer | Last Resource Ledger Entry No. in register |
| `error` | string | Error message (only on Error status) |
| `code` | string | Error code, `BusinessCentralError` when Business Central refused the posting (only on Error status) - see [Errors and warnings](../reference/errors.md) |

### Error Handling

**Common errors:**
- Journal batch not found
- No lines to post
- Posting validation errors
- Missing journal batch identification

### Notes

- Uses BC's "Res. Jnl.-Post Batch" codeunit for posting
- All journal lines are cleared from the batch after successful posting
- Posting is wrapped in an isolated codeunit so errors return a structured error response (code `BusinessCentralError`); the call stack goes to telemetry only

**Recommended approach:** Validate with `Resources.ResourceJournal.Check` first, then post with `Resources.ResourceJournal.Post`.

### Related Message Types

- [Resources.ResourceJournal.Create](#resourcesresourcejournalcreate)
- [Resources.ResourceJournal.Check](#resourcesresourcejournalcheck)
- [Data.Records.Get](/foundation/message-types/data/#datarecordsget)
- [Data.Records.Set](/foundation/message-types/data/#datarecordsset)

---

## Implementation Details

### Object IDs

| Object Type | Object ID | Object Name |
|-------------|-----------|-------------|
| Enum Value | 10078094 | Resources.ResourceJournal.Create |
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
