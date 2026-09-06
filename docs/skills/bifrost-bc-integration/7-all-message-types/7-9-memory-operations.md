---
id: 7-9-memory-operations
title: "7.9 Memory operations"
sidebar_label: "7.9 Memory operations"
sidebar_position: 18
---

Four message types provide key-value memory storage at two scopes: company-wide and per-user.

| Type | Direction | Purpose |
|---|---|---|
| `Memory.Company.Get` | Outbound | Retrieve company-scoped memory records with optional skip/take pagination |
| `Memory.Company.List` | Outbound | List company-scoped memory records (id and description only, no memory blob) |
| `Memory.Company.Set` | Inbound | Upsert company-scoped memory records from a JSON `data` array |
| `Memory.User.Get` | Outbound | Retrieve user-scoped memory records (filtered to current user) |
| `Memory.User.List` | Outbound | List user-scoped memory records (id and description only, no memory blob) |
| `Memory.User.Set` | Inbound | Upsert user-scoped memory records for the current user |

**Tables:**
- `Memory ori` (10077893) — company-scoped. PK: `Id` (Guid). Fields: `Description` (Text[2048]), `Memory` (Blob).
- `User Memory ori` (10077894) — user-scoped. PK: `User Name` (Code[50]) + `Id` (Guid). Automatically filtered to `UserId()` via FilterGroup(2).

**Permission set:** `BIFROST CoMem ori` (10077891) grants RIMD on Bifrost Memory, Translation ori, and Bifrost Storage.

#### `Memory.Company.Get` — retrieve company memory

```json
{
  "type": "Memory.Company.Get",
  "data": "{\"skip\":0,\"take\":50}"
}
```

**Optional request fields:** `skip` (Integer, default 0), `take` (Integer, default 100; 0 = all), `tableView` (Text — SetView filter).

**Response:**
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note", "memory": "Full text content" }
  ]
}
```

#### `Memory.Company.List` — list company memory (lightweight)

```json
{
  "type": "Memory.Company.List",
  "data": "{\"skip\":0,\"take\":50}"
}
```

**Optional request fields:** `skip` (Integer, default 0), `take` (Integer, default 100; 0 = all), `tableView` (Text — SetView filter).

**Response** (no `memory` field):
```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note" }
  ]
}
```

#### `Memory.Company.Set` — upsert company memory

```json
{
  "type": "Memory.Company.Set",
  "data": "{\"data\":[{\"id\":\"a1b2c3d4-...\",\"description\":\"My note\",\"memory\":\"Content\"}]}"
}
```

Each item in the `data` array requires `id` (Guid). `description` and `memory` are optional on update. If the `id` exists, the record is modified; otherwise inserted.

**Response:**
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    { "id": "a1b2c3d4-...", "description": "My note", "memory": "Content" }
  ]
}
```

#### `Memory.User.Get` / `Memory.User.Set`

Same request/response shapes as the Company variants. The difference:
- Records are automatically filtered to the current user (`UserId()`) via FilterGroup(2).
- Each record's `User Name` is set automatically on insert.

#### `Memory.User.List` — list user memory (lightweight)

Same as `Memory.Company.List` but user-scoped. Returns only `id` and `description` (no `memory` field). Records are automatically filtered to the current user.

---
