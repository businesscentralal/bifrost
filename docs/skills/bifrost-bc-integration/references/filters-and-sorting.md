---
id: filters-and-sorting
title: "tableView — filtering and sorting"
sidebar_label: "tableView — filtering and sorting"
sidebar_position: 7
description: "The tableView string: BC AL filter syntax (WHERE / FILTER / CONST), sorting with SORTING and ORDER, how skip and take interact with a sort, a quick reference of the operators, and when sorting has to happen on the client instead."
---

The `tableView` string: BC AL filter syntax (WHERE / FILTER / CONST), sorting with SORTING and ORDER, how skip and take interact with a sort, a quick reference of the operators, and when sorting has to happen on the client instead.

[← back to SKILL.md](../index.md) · originally sections 11, 19 of the single-file skill.

---

## 11. tableView Filter Syntax

`tableView` uses BC's AL table view syntax. Use the **`name`** from `Help.Fields.Get` (not `jsonName`) in WHERE clauses.

```
WHERE(FieldName=CONST(value))                                   ← exact match
WHERE(FieldName=FILTER(>1000))                                  ← comparison
WHERE(FieldName=FILTER(>0&<10000))                              ← range
WHERE(FieldName=FILTER(@*Corp*))                                ← case-insensitive contains (*)
WHERE(FieldName=FILTER(DEPT|SALES))                            ← OR
WHERE(Blocked=CONST( ))                                         ← blank/empty option
WHERE(Posting Date=FILTER(>=2026-01-01&<=2026-12-31))
WHERE(Blocked=CONST( ),Balance (LCY)=FILTER(>0))               ← multiple fields with AND
```

Operators: `CONST` (exact), `FILTER` (pattern/range), `>` `<` `>=` `<=`, `&` (AND on same field), `|` (OR), `*` (wildcard), `@` (case-insensitive), `..` (range).

### Sorting and paging within tableView

Prepend a `SORTING(...)` clause (using BC **field names**, not JSON keys) and an `ORDER(...)` clause before the `WHERE` clause. Combine with `skip` and `take` to fetch a specific slice in a controlled order.

```
SORTING(Field1,Field2,Field3) ORDER(Ascending) WHERE(...)
SORTING(Field1,Field2,Field3) ORDER(Descending) WHERE(...)
```

**Get the single most-recent record matching a filter** (skip:0, take:1, ORDER Descending):

```json
{
  "tableName": "Integration ori",
  "tableView": "SORTING(Source,Table Id,Date & Time) ORDER(Descending) WHERE(Source=CONST(MyApp),Table Id=CONST(18),Reversed=CONST(false))",
  "skip": 0,
  "take": 1
}
```

**Get the 5 oldest customer ledger entries for a customer** (skip:0, take:5, ORDER Ascending):

```json
{
  "tableName": "Cust. Ledger Entry",
  "tableView": "SORTING(Customer No.,Posting Date) ORDER(Ascending) WHERE(Customer No.=CONST(10000))",
  "skip": 0,
  "take": 5
}
```

Key rules:
- `SORTING(...)` field names use BC field names (same as `WHERE` clauses), not JSON keys.
- `ORDER(Ascending)` is the default — omit or include explicitly.
- `ORDER(Descending)` reverses the sort. Combined with `take:1` and `skip:0` this efficiently retrieves the latest entry.
- The `SORTING` + `ORDER` clause is evaluated **server-side by BC** — it is not client-side sorting in the MCP layer.
- You can sort by multiple fields: `SORTING(Field1,Field2)` — BC uses them left to right.

---

### 11a. Customer and item lookup patterns

To look up a customer by number or name, send `Data.Records.Get` with `tableName: "Customer"`
and a `tableView` filter. To look up an item, use `tableName: "Item"`.

For a ready-to-use, instance-accurate guide with live field names for *this* BC instance,
invoke the MCP prompts:

- `customer_lookup_pattern` — returns filter examples and the full Customer field table
- `item_lookup_pattern` — returns filter examples and the full Item field table

Both prompts fetch live field metadata and substitute it into the guide, so the field
numbers and `jsonName` values are guaranteed accurate for the connected BC instance.

---

## 19. tableView — Filtering and Sorting in BC Style

`tableView` is a Business Central AL table view string. It is the **only supported
server-side filtering mechanism** in `Data.Records.Get` and `Data.RecordIds.Get`.

### 19.1 Filtering Syntax

Use the **`name`** from `Help.Fields.Get` (original BC field name, may contain spaces
and punctuation) — not the `jsonName`.

```
WHERE(FieldName=OPERATOR(value))
WHERE(Field1=OPERATOR(val1),Field2=OPERATOR(val2))    ← AND (comma-separated)
```

**Operators:**

| Operator | Meaning | Example |
|---|---|---|
| `CONST(value)` | Exact match — single value | `WHERE(No.=CONST(10000))` |
| `FILTER(value)` | Pattern/range match | `WHERE(Balance (LCY)=FILTER(>1000))` |
| `FILTER(v1\|v2)` | OR — multiple values | `WHERE(Type=FILTER(Item\|Resource))` |
| `FILTER(lo..hi)` | Inclusive range | `WHERE(No.=FILTER(10000..20000))` |
| `FILTER(>val)` | Greater than | `WHERE(Balance (LCY)=FILTER(>0))` |
| `FILTER(>=val)` | Greater than or equal | `WHERE(Posting Date=FILTER(>=2026-01-01))` |
| `FILTER(<val)` | Less than | `WHERE(Credit Limit (LCY)=FILTER(<10000))` |
| `FILTER(lo&hi)` | Combined conditions on same field | `WHERE(Balance (LCY)=FILTER(>0&<50000))` |
| `FILTER(@*text*)` | Case-insensitive contains | `WHERE(Name=FILTER(@*Corporation*))` |
| `FILTER(text*)` | Starts with | `WHERE(No.=FILTER(C*))` |

**Blank/empty option values** — use `CONST( )` with a single space:
```
WHERE(Blocked=CONST( ))         ← not blocked customers
WHERE(Document Type=CONST(Order),Status=CONST(Open))
```

**Dynamic values in template literals:**
```javascript
// Exact match from variable
const tableView = `WHERE(Registration Number=CONST(${regNo}))`;

// Numeric range from variables
const tableView = `WHERE(Balance (LCY)=FILTER(>${minBalance}&<${maxBalance}))`;

// Date range (use BC date format YYYY-MM-DD in FILTER)
const tableView = `WHERE(Posting Date=FILTER(>=${fromDate}&<=${toDate}))`;

// Multiple conditions (AND)
const tableView = `WHERE(Customer No.=CONST(${customerNo}),Open=CONST(true))`;

// OR values
const tableView = `WHERE(Document Type=FILTER(Order|Invoice))`;
```

**Special characters in values** — most separator characters are safe inside `CONST()`.
For `FILTER()`, avoid embedding `&`, `|`, `.."` as they are filter operators.

### 19.2 Sorting Syntax

`tableView` also supports sorting via an `ORDER BY` clause appended after `WHERE`.
BC sorts results using the BC-side key ordering — you can specify the key fields and direction.

```
SORTING(FieldName1,FieldName2) ORDER(Ascending|Descending)
WHERE(Blocked=CONST( )) SORTING(Name) ORDER(Ascending)
SORTING(Posting Date,Entry No.) ORDER(Descending)
```

Full combined example:
```javascript
const tableView = `WHERE(Customer No.=CONST(${custNo}),Open=CONST(true)) SORTING(Due Date) ORDER(Ascending)`;
```

> **Important:** SORTING field names use the **original BC field name** (with spaces),
> same as WHERE clauses. Not the `jsonName`. Example: `SORTING(Due Date)` not `SORTING(DueDate)`.

**Common sort patterns:**

```javascript
// Customers A–Z
tableView: 'SORTING(Name) ORDER(Ascending)'

// Most recent entries first
tableView: 'WHERE(Customer No.=CONST(10000)) SORTING(Posting Date,Entry No.) ORDER(Descending)'

// Items by No. ascending
tableView: 'SORTING(No.) ORDER(Ascending)'

// Active customers sorted by balance (highest first)
tableView: 'WHERE(Blocked=CONST( )) SORTING(Balance (LCY)) ORDER(Descending)'
```

### 19.3 tableView Quick Reference

```javascript
// Only active (non-blocked) customers
tableView: "WHERE(Blocked=CONST( ))"

// Specific customer's open ledger entries
tableView: `WHERE(Customer No.=CONST(${custNo}),Open=CONST(true))`

// Sales orders (not invoices) for a customer
tableView: `WHERE(Document Type=CONST(Order),Sell-to Customer No.=CONST(${custNo}))`

// Items with quantity on hand
tableView: "WHERE(Inventory=FILTER(>0))"

// Records modified in date range (combine with startDateTime/endDateTime for SystemModifiedAt)
// Note: tableView date filters apply to regular BC date fields; startDateTime/endDateTime targets SystemModifiedAt
tableView: `WHERE(Posting Date=FILTER(>=${fromDate}&<=${toDate}))`

// Post Code table lookup
tableView: `WHERE(Code=CONST(${postCode}))`

// Check for duplicate customer by registration number
tableView: `WHERE(Registration Number=CONST(${regNo}))`

// Payment Terms table — look up by code
tableView: `WHERE(Code=CONST(${paymentTermsCode}))`

// Gen. Business Posting Group — all unblocked groups
tableView: "WHERE(Blocked=CONST(false))"
```

### 19.4 Client-Side vs Server-Side Sorting

`tableView` SORTING pushes sorting to BC (efficient for large datasets). For small
result sets already in memory, client-side sorting is simpler:

```javascript
function sortRecords(records, jsonFieldName, direction = 'asc') {
  return [...records].sort((a, b) => {
    const valA = a.fields?.[jsonFieldName] ?? a.primaryKey?.[jsonFieldName] ?? '';
    const valB = b.fields?.[jsonFieldName] ?? b.primaryKey?.[jsonFieldName] ?? '';
    
    // Numeric sort
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }
    
    // String sort
    const cmp = String(valA).localeCompare(String(valB));
    return direction === 'asc' ? cmp : -cmp;
  });
}

// Usage
const sorted = sortRecords(salesHistory, 'quantity', 'desc');
```

Use **server-side SORTING** when:
- Fetching large datasets with pagination (sort affects which records land on each page)
- You need the BC-native key ordering

Use **client-side sorting** when:
- All records are already loaded (no pagination)
- Sorting by a computed or display value not matching a BC field directly
- User is clicking table column headers after initial load
