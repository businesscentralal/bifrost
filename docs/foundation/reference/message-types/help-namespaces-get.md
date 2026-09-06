---
id: help-namespaces-get
title: "Help.Namespaces.Get"
sidebar_label: "Help.Namespaces.Get"
sidebar_position: 65
description: "Request and response contract for the Help.Namespaces.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the distinct list of AL namespace values for all non-obsolete normal tables in `Table Metadata`. This is a lightweight server-side aggregation — the BC server collects unique namespace strings without returning full table metadata. Use this as **Step 1** in table discovery before calling `Help.Tables.Get` with a `namespace` filter.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| namespaceFilter | Text | No | Optional filter expression. Supports BC wildcards: `Microsoft.Finance.*` returns only Finance namespaces. Omit to return all namespaces. |

## Request Examples
All namespaces:
```json
{ "type": "Help.Namespaces.Get" }
```
Only Finance namespaces:
```json
{ "type": "Help.Namespaces.Get", "data": { "namespaceFilter": "Microsoft.Finance.*" } }
```

## Response Shape
```json
{
  "status": "Success",
  "namespaces": [
    "Microsoft.Sales.Customer",
    "Microsoft.Finance.GeneralLedger.Account",
    "Microsoft.Finance.ReceivablesPayables",
    "Origo.Bifrost"
  ]
}
```

## Recommended Two-Step Table Discovery Workflow
When you do not know which tables exist, always use this two-step approach to avoid context-window overflow:
```
Step 1 — discover namespaces (this type, lightweight):
  { "type": "Help.Namespaces.Get" }
  → { "namespaces": ["Microsoft.Sales.Customer", "Microsoft.Finance.GeneralLedger", ...] }

Step 2 — list tables in the relevant namespace:
  { "type": "Help.Tables.Get", "data": { "namespace": "Microsoft.Sales.*" } }
  → { "result": [ { "id": 18, "name": "Customer", ... }, ... ] }
```

> ⚠️ **Never call `Help.Tables.Get` without a table identifier or namespace filter.** Unfiltered calls return thousands of rows and will overflow the AI context window.

## Notes
- Only non-obsolete (`ObsoleteState = No | Pending`) tables of type `Normal` are included.
- Namespaces are returned in the order first encountered during a table scan; the order may vary between calls.
- The `namespace` filter uses standard BC `SetFilter` wildcards: `*` matches any substring, `?` matches a single character.

## Related Message Types
- `Help.Tables.Get` — use after this type to list tables within a namespace
- `Help.Fields.Get` — list fields for a specific table

