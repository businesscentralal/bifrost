---
id: 7-5c-1-transfer-order-operations
title: "7.5c.1 Transfer order operations"
sidebar_label: "7.5c.1 Transfer order operations"
sidebar_position: 9
---

Transfer orders use the `Transfer Header` (table 5740) and `Transfer Line` (table 5741) tables.

**Identification (for actions on existing orders):** `subject` field — GUID → SystemId, plain text → Transfer Header `No.`. `data` JSON keys (first match wins): `systemId`, `recordSystemId`, `id`, `documentNo`, `transferOrderNo`, `no`.

**Workflow:** `Inventory.TransferOrder.Create` → `Data.Records.Set` (Transfer Line) → `Inventory.TransferOrder.Release` → `Inventory.TransferOrder.Post` (Ship, then Receive for non-direct).

#### `Inventory.TransferOrder.Create`

Creates a Transfer Header. Required: `transferFromCode`, `transferToCode`. Required when `directTransfer = false`: `inTransitCode`. Optional: `directTransfer`, `postingDate` (defaults to WORKDATE), `shipmentDate`, `receiptDate`, `externalDocumentNo`.

```json
{ "specversion": "1.0", "type": "Inventory.TransferOrder.Create", "source": "MyApp",
  "data": { "transferFromCode": "BLUE", "transferToCode": "RED", "inTransitCode": "OUT. LOG." } }
```

Response: `status`, `documentNo`, `systemId`, `transferFromCode`, `transferToCode`, `inTransitCode`, `directTransfer`, `postingDate`, `shipmentDate`, `receiptDate`, `externalDocumentNo`, `statusAfter` (= `"Open"`).

#### `Inventory.TransferOrder.Release`

Calls codeunit 5708 `Release Transfer Document`. Response: `status`, `documentNo`, `transferFromCode`, `transferToCode`, `directTransfer`, `statusBefore`, `statusAfter`. Already-released orders return Success with both = `"Released"`.

#### `Inventory.TransferOrder.Reopen`

Calls codeunit 5708 `Release Transfer Document`.Reopen. Same response shape as `Release` but with status transition Released → Open. Already-open orders return Success with both = `"Open"`.

#### `Inventory.TransferOrder.Post`

Calls codeunit 5706 `TransferOrder-Post (Yes/No)`. Request: `postingType` = `"Ship"` or `"Receive"` (case-insensitive). Required for non-direct transfers; ignored for direct transfers (BC's Inventory Setup `Direct Transfer Posting` decides Receipt+Shipment vs. single Direct Transfer).

Response: `status`, `documentNo`, `postingType`, `directTransfer`, `postedShipmentNo`, `postedReceiptNo`, `postingDate`. Posted numbers are populated by diffing `Last Shipment No.` / `Last Receipt No.` on the Transfer Header before and after posting.

#### `Inventory.TransferOrder.PreviewPost`

Simulates posting via `Gen. Jnl.-Post Preview` and rolls back. Same request fields as `Post`. Response:

- `preview[]` — one element per captured BC table, each with `rows[]`.
- `predictedNumbers` — next document number(s) BC would assign: `postedShipmentNo` (non-direct Ship), `postedReceiptNo` (non-direct Receive), or `postedDirectTransferNo` (direct).
- `totals` — `balanced`, `totalDebitLCY`, `totalCreditLCY`.

#### `Inventory.TransferOrder.Statistics`

Mirrors Page 5755 `Transfer Statistics`. Read-only. Response includes header fields plus `totals { lineCount, quantity, parcels, netWeight, grossWeight, volume }`. Derived lines (`Derived From Line No. <> 0`) are excluded.

---
