---
id: 11-tableview-filter-syntax
title: "11. TableView Filter Syntax"
sidebar_label: "11. TableView Filter Syntax"
sidebar_position: 13
---

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
