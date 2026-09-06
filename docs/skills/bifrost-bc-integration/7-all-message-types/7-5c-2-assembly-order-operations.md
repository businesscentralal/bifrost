---
id: 7-5c-2-assembly-order-operations
title: "7.5c.2 Assembly order operations"
sidebar_label: "7.5c.2 Assembly order operations"
sidebar_position: 10
---

Assembly orders use the `Assembly Header` (table 900) and `Assembly Line` (table 901) tables. Document Type is always `Order`.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Assembly Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `assemblyOrderNo`, `no`. The lookup is constrained to Document Type = Order via the helper `Argument.FindAssemblyHeader(...)` on the message argument table.

**Workflow:** `Inventory.AssemblyOrder.Create` (refreshes BOM by default) → optional `Data.Records.Set` on Assembly Line → optional `Inventory.AssemblyOrder.RefreshLines` after header field changes → `Inventory.AssemblyOrder.Release` → `Inventory.AssemblyOrder.Post`.

#### `Inventory.AssemblyOrder.Create`

Creates an Assembly Header (Document Type = Order). Required: `itemNo`, `quantity` (> 0). Optional: `variantCode`, `locationCode`, `binCode`, `unitOfMeasureCode`, `description`, `postingDate` (defaults to WORKDATE), `dueDate`, `startingDate`, `endingDate`, `quantityToAssemble`, `refreshLines` (default `true`).

Response: `status`, `documentNo`, `systemId`, `itemNo`, `variantCode`, `description`, `locationCode`, `binCode`, `unitOfMeasureCode`, `quantity`, `quantityToAssemble`, `postingDate`, `dueDate`, `startingDate`, `endingDate`, `statusAfter` (= `"Open"`), `lineCount`.

#### `Inventory.AssemblyOrder.RefreshLines`

Refreshes BOM component lines on an existing assembly order. Use this after editing `Item No.`, `Quantity`, `Variant Code`, `Location Code`, or `Unit of Measure Code` on the header. Response: `status`, `documentNo`, `linesBefore`, `linesAfter`, `statusAfter`. Errors if the header is Released.

**Cloud-safe implementation:** `RefreshBOM` is `[Scope('OnPrem')]` in BC27. The implementation calls `AssemblyHeader.Validate("Item No.", AssemblyHeader."Item No.")` which triggers the same BOM-refresh path via the table's `OnValidate("Item No.")` trigger.

#### `Inventory.AssemblyOrder.Release`

Calls codeunit 414 `Release Assembly Document`. Response: `status`, `documentNo`, `itemNo`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.AssemblyOrder.Reopen`

Calls codeunit 414 `Release Assembly Document`.Reopen via an isolated process codeunit (`Asm. Order Reopen Process ori`, `Codeunit.Run` pattern) so BC errors return as a structured Error response. Same response shape as `Release` with Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.AssemblyOrder.Post`

Calls codeunit 900 `Assembly-Post`. Request: optional `postingDate` overrides the header value.

Response: `status`, `documentNo`, `postedDocumentNo`, `postedSystemId`, `postedQuantity`, `assembleToOrder`, `postingDate`. `assembleToOrder` is `true` when the source is a sales order (Assemble-to-Order); in that case the source sales line is updated. `postedSystemId` is the SystemId of the resulting `Posted Assembly Header` (table 910).

#### `Inventory.AssemblyOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table (Item Ledger, Value Entry, Capacity Ledger, G/L Entry), each with `rows[]`.
- `predictedNumbers` — `postedDocumentNo` (the next Posted Assembly Order No. BC would assign).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.AssemblyOrder.Statistics`

Mirrors Page 920 `Assembly Order Statistics`. Read-only. Response includes header fields plus a `cost` object: `expectedMaterialCost`, `expectedResourceCost`, `expectedResourceOverheadCost`, `expectedAssemblyOverheadCost`, `expectedTotalCost`, and the matching `actual*` fields. Expected costs are summed from `Cost Amount` on assembly lines; actual costs are computed via `CalcActualCosts` from Item Ledger / Capacity Ledger entries.

---
