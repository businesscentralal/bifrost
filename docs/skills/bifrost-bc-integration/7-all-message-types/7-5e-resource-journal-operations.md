---
id: 7-5e-resource-journal-operations
title: "7.5e Resource journal operations"
sidebar_label: "7.5e Resource journal operations"
sidebar_position: 14
---

**Identification:** Same three modes (pipe-form, SystemId, JSON `{templateName, batchName}` with JSON precedence).

**Workflow:** `Resources.ResourceJournal.SetupNewLine` → `Data.Records.Set` → `Resources.ResourceJournal.Check` → `Resources.ResourceJournal.Post`.

#### `Resources.ResourceJournal.SetupNewLine`

```json
{ "specversion": "1.0", "type": "Resources.ResourceJournal.SetupNewLine", "source": "MyApp", "subject": "RESOURCE|DEFAULT" }
```

#### `Resources.ResourceJournal.Check`

Response: `status`, `validationResult`, `templateName`, `batchName`, `batchDescription`, `lineCount`, `totalQuantity`, `totalCost`, `errorCount`, `warningCount`, `errors[]`, `warnings[]`.

#### `Resources.ResourceJournal.Post`

Posts via BC `Res. Jnl.-Post Batch` (isolated). Response (success): `status`, `templateName`, `batchName`, `batchDescription`, `linesPosted`, `postingDate`, `totalQuantity`, `totalCost`.

**Conditional register fields:** `resourceRegisterNo`, `resourceRegisterId`, `fromEntryNo`, `toEntryNo` are present **only when a Resource Register row is created** for the posting. Consumers must treat them as optional. (A Resource Register entry is not always created — depends on the BC posting outcome.)

---
