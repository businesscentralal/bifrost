---
id: error-handling
title: "Response patterns and error handling"
sidebar_label: "Response patterns and error handling"
sidebar_position: 3
description: "The two response shapes a message type can return, the order in which a client has to check for errors (transport, then task status, then payload), and the mistakes that look plausible against this API but fail. Check the error order here before writing any retry logic."
---

The two response shapes a message type can return, the order in which a client has to check for errors (transport, then task status, then payload), and the mistakes that look plausible against this API but fail. Check the error order here before writing any retry logic.

[← back to SKILL.md](../index.md) · originally sections 5, 16 of the single-file skill.

---

## 5. Response Patterns

### Pattern A — Two-step (most data operations)

1. POST returns `{ …, "data": "<url>" }`
2. GET the URL → result JSON

### Pattern B — Direct response (some operations)

PDF types and some inbound operations embed status/error directly in the POST response.
No `data` URL. Check `response.status === "Error"` immediately.

### Error handling order

```
POST /tasks
  ├─ if response.status === "Error"   → direct error (no data URL)
  └─ if response.data exists
       └─ GET response.data
            ├─ if result.status === "Error"   → task execution error
            └─ if result.status === "Success" → use result
```

Error shape:
```json
{
  "status": "Error",
  "error": "Human-readable error message",
  "callStack": "Codeunit.Method line N — ..."
}
```

---

## 16. Common Mistakes to Avoid

1. **`data` must be a JSON string** — `"data": "{\"tableName\":\"Customer\"}"` not `"data": {"tableName": "Customer"}`. Failing to stringify is the most common error.

2. **Tenant GUID in returned data URLs** — the URL in `task.data` uses the internal tenant GUID, not the named tenant. Use it verbatim, or if constructing from a known message ID use the named-tenant form (both are accepted).

3. **Field values in `Data.Records.Set` must be strings** — even numbers and booleans: `"Quantity": "5"` not `"Quantity": 5`.

4. **FlowFields are blank unless `fieldNumbers` is specified** in `Data.Records.Get`.

5. **`noOfRecords` does not change with pagination** — it is always the total matching-filter count. Don't re-request it per page.

6. **Primary key fields must never appear in `fields`** in `Data.Records.Set` — put them in `primaryKey` only.

7. **PDF response is binary** — do not try to JSON-parse it. Use `response.arrayBuffer()` or `response.blob()`.

8. **`tableView` field names differ from JSON keys** — use the `name` from `Help.Fields.Get` in WHERE clauses, not `jsonName`.

9. **Enum/Option values in `tableView`** must use the AL name (always English), not the localised caption.

10. **`subject` can accept a GUID** (the record's SystemId) for most typed message types — useful for document lookups when you don't have the document number.

11. **Posting message types are permission-gated per domain** — every `*.Post` and `*.Reverse` message type that writes ledger entries requires one of five permission sets:
    - `G/L Posting ori` — `Finance.GeneralJournal.Post`, `Finance.GeneralJournal.ReverseRegister`, `Finance.GeneralJournal.ReverseTransaction`, `Finance.BankReconciliation.Post`, `Finance.VAT.CalcAndPostSettlement`, `Customer.Application.Post`, `Customer.Application.Reverse`, `Vendor.Application.Post`, `Vendor.Application.Reverse`, `Sales.Document.Post`, `Purchase.Document.Post`
    - `Item Posting ori` — `Inventory.ItemJournal.Post`, `Inventory.TransferOrder.Post`, `Inventory.AssemblyOrder.Post`
    - `FA Posting ori` — `FixedAssets.FAJournal.Post`
    - `Job Posting ori` — `Projects.ProjectJournal.Post`
    - `Resource Posting ori` — `Resources.ResourceJournal.Post`

    These sets are **standalone** and not included in `BIFROST Read ori` or `BIFROST Full ori`. A missing permission produces the response:
    ```json
    { "status": "Error", "error": "Posting denied: missing '<permission set name>' permission set (BIFROST GL Post ori, BIFROST ItemPost ori, BIFROST FA Post ori, BIFROST Job Post ori, BIFROST Res Post ori or BIFROST WhsePost ori)." }
    ```
    `Sales.Document.Post` and `Purchase.Document.Post` are gated to `G/L Posting ori` only, even though they may write item entries downstream.
