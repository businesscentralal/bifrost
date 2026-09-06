---
id: 12-creating-sales-orders-workflow
title: "12. Creating Sales Orders Workflow"
sidebar_label: "12. Creating Sales Orders Workflow"
sidebar_position: 14
---

There is no dedicated "create order" message type. Use `Data.Records.Set` for all steps.

### Step 1 — Create Sales Header

### Step 2 — Add Sales Lines (one call per line)

Increment `LineNo_` by 10000 for each additional line.

### Step 3 — Release

For a ready-to-use workflow description pre-populated with the live `jsonName` values and
field table for *this* BC instance, invoke the MCP prompt `sales_order_creation_workflow`.
It calls `get_table_fields` for both `Sales Header` and `Sales Line` and injects the results
into a step-by-step guide.

---
