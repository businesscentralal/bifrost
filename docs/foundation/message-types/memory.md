---
id: memory
title: "Memory message types"
sidebar_position: 12
---

This document describes the Memory-related message types in Bifröst Foundation.

## Overview

Memory message types provide persistent key-value blob storage for Bifrost integrations. Records store a GUID identifier, a description, and arbitrary UTF-8 text content in a blob field. Two scoping levels are available:

- **Company-scoped** (`Memory.Company.*`) — shared across all authenticated users within a company. Isolation is handled automatically by `DataPerCompany = true`.
- **User-scoped** (`Memory.User.*`) — private to the creating user. Enforced via `FilterGroup(2)` on the `User Name` field, so each user only sees their own records.

## Message Type List

| Message Type | Direction | Purpose |
|--------------|-----------|---------|
| [Memory.Company.Get](#memorycompanyget) | Outbound | Retrieve company-scoped memory records |
| [Memory.Company.List](#memorycompanylist) | Outbound | List company-scoped memory records (id and description only) |
| [Memory.Company.Set](#memorycompanyset) | Inbound | Insert or update company-scoped memory records |
| [Memory.User.Get](#memoryuserget) | Outbound | Retrieve user-scoped memory records (private to creator) |
| [Memory.User.List](#memoryuserlist) | Outbound | List user-scoped memory records (id and description only) |
| [Memory.User.Set](#memoryuserset) | Inbound | Insert or update user-scoped memory records |

---

## Memory.Company.Get

**Direction**: Outbound (Response to request)

**Purpose**: Retrieves company-scoped memory records. All authenticated users in the company can read these records.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.Get",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Integer | No | Number of records to skip (pagination). Default 0. |
| `take` | Integer | No | Maximum number of records to return. Default 100. 0 = all. |
| `tableView` | String | No | BC table view filter expression. |

#### Example — Paginated Request

```json
{
  "skip": 0,
  "take": 10
}
```

#### Example — Filter by Id

```json
{
  "tableView": "WHERE(Id=FILTER(a1b2c3d4-e5f6-7890-abcd-ef1234567890))"
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `noOfRecords` | Integer | Total records matching filters (before skip/take) |
| `result` | Array | Array of record objects |

Each record object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | The memory record Id (primary key) |
| `description` | String | Description text (max 2048 chars) |
| `memory` | String | UTF-8 plain text content stored in the blob |

#### Example Response

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Shared company config",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Table Reference

**Table**: Bifrost Memory (10077904)

| No. | Name | Type | In PK |
|-----|------|------|-------|
| 4 | Id | GUID | Yes |
| 5 | Description | Text[2048] | No |
| 6 | Memory | Blob (UTF-8 text) | No |

### Access Rules

- Any authenticated user can read company-scoped records.
- Company isolation is handled automatically by `DataPerCompany = true`.

---

## Memory.Company.List

**Direction**: Outbound (Response to request)

**Purpose**: Lists company-scoped memory records returning only `id` and `description`. The memory blob content is excluded for lightweight enumeration. Use `Memory.Company.Get` to retrieve the full memory content for specific records.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.List",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Integer | No | Number of records to skip (pagination). Default 0. |
| `take` | Integer | No | Maximum number of records to return. Default 100. 0 = all. |
| `tableView` | String | No | BC table view filter expression. |

#### Example — Paginated Request

```json
{
  "skip": 0,
  "take": 10
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `noOfRecords` | Integer | Total records matching filters (before skip/take) |
| `result` | Array | Array of record objects |

Each record object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | The memory record Id (primary key) |
| `description` | String | Description text (max 2048 chars) |

> **Note**: The `memory` blob field is intentionally excluded. Use `Memory.Company.Get` to retrieve full content.

#### Example Response

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Shared company config"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "description": "Integration settings"
    }
  ]
}
```

### Table Reference

**Table**: Bifrost Memory (10077904)

| No. | Name | Type | In PK | Included |
|-----|------|------|-------|----------|
| 4 | Id | GUID | Yes | Yes |
| 5 | Description | Text[2048] | No | Yes |
| 6 | Memory | Blob (UTF-8 text) | No | **No** |

### Access Rules

- Any authenticated user can read company-scoped records.
- Company isolation is handled automatically by `DataPerCompany = true`.

---

## Memory.Company.Set

**Direction**: Inbound (Write operation)

**Purpose**: Inserts or updates company-scoped memory records. If a record with the specified `id` exists, it is updated; otherwise a new record is inserted with an auto-generated GUID.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.Company.Set",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{\"data\":[{\"description\":\"config\",\"memory\":\"{}\"}]}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | Array | Yes | Array of record objects to insert or update |

Each record object:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | GUID | No | Memory record Id. If provided and exists, updates the record. If omitted, inserts a new record with auto-generated GUID. |
| `description` | String | No | Description text (max 2048 chars) |
| `memory` | String | No | UTF-8 plain text content to store in the blob |

#### Example — Insert New Record

```json
{
  "data": [
    {
      "description": "Shared company config",
      "memory": "{\"settings\": {}}"
    }
  ]
}
```

#### Example — Update Existing Record

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Updated company config",
      "memory": "{\"settings\": {\"updated\": true}}"
    }
  ]
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `insertedCount` | Integer | Number of records inserted |
| `modifiedCount` | Integer | Number of records modified |
| `result` | Array | Array of processed record objects (same format as Memory.Company.Get response) |

#### Example Response

```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Shared company config",
      "memory": "{\"settings\": {}}"
    }
  ]
}
```

### Table Reference

**Table**: Bifrost Memory (10077904)

| No. | Name | Type | Writable |
|-----|------|------|----------|
| 4 | Id | GUID | Yes (auto-generated if omitted) |
| 5 | Description | Text[2048] | Yes |
| 6 | Memory | Blob | Yes (UTF-8 text) |

### Access Rules

- **New records**: Any authenticated user can create.
- **Existing records**: Any authenticated user in the same company can update.

---

## Memory.User.Get

**Direction**: Outbound (Response to request)

**Purpose**: Retrieves user-scoped memory records. Only the creator can read their own records. Records created by other users are not visible.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.Get",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Integer | No | Number of records to skip (pagination). Default 0. |
| `take` | Integer | No | Maximum number of records to return. Default 100. 0 = all. |
| `tableView` | String | No | BC table view filter expression. |

#### Example — Paginated Request

```json
{
  "skip": 0,
  "take": 10
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `noOfRecords` | Integer | Total records matching filters (before skip/take) |
| `result` | Array | Array of record objects |

Each record object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | The memory record Id |
| `description` | String | Description text (max 2048 chars) |
| `memory` | String | UTF-8 plain text content stored in the blob |

#### Example Response

```json
{
  "status": "Success",
  "noOfRecords": 1,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "My personal settings",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Table Reference

**Table**: User Memory ori (10077905)

| No. | Name | Type | In PK |
|-----|------|------|-------|
| 1 | User Name | Code[50] | Yes |
| 2 | Id | GUID | Yes |
| 3 | Description | Text[2048] | No |
| 4 | Memory | Blob (UTF-8 text) | No |

### Access Rules

- Only the creator can read their own user-scoped records.
- Records are filtered to `User Name = current user` automatically via `FilterGroup(2)`.
- `User Name` is automatically set on insert from the current user identity.

---

## Memory.User.List

**Direction**: Outbound (Response to request)

**Purpose**: Lists user-scoped memory records returning only `id` and `description`. The memory blob content is excluded for lightweight enumeration. Only the creator can see their own records. Use `Memory.User.Get` to retrieve the full memory content for specific records.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.List",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Integer | No | Number of records to skip (pagination). Default 0. |
| `take` | Integer | No | Maximum number of records to return. Default 100. 0 = all. |
| `tableView` | String | No | BC table view filter expression. |

#### Example — Paginated Request

```json
{
  "skip": 0,
  "take": 10
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `noOfRecords` | Integer | Total records matching filters (before skip/take) |
| `result` | Array | Array of record objects |

Each record object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | GUID | The memory record Id |
| `description` | String | Description text (max 2048 chars) |

> **Note**: The `memory` blob field is intentionally excluded. Use `Memory.User.Get` to retrieve full content.

#### Example Response

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "My personal settings"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "description": "Saved search filters"
    }
  ]
}
```

### Table Reference

**Table**: User Memory ori (10077905)

| No. | Name | Type | In PK | Included |
|-----|------|------|-------|----------|
| 1 | User Name | Code[50] | Yes | No |
| 2 | Id | GUID | Yes | Yes |
| 3 | Description | Text[2048] | No | Yes |
| 4 | Memory | Blob (UTF-8 text) | No | **No** |

### Access Rules

- Only the creator can read their own user-scoped records.
- Records are filtered to `User Name = current user` automatically via `FilterGroup(2)`.
- `User Name` is automatically set on insert from the current user identity.

---

## Memory.User.Set

**Direction**: Inbound (Write operation)

**Purpose**: Inserts or updates user-scoped memory records. Only the creator can read and modify their own records.

### Request Format

Bifrost parameters:
```json
{
  "specversion": "1.0",
  "type": "Memory.User.Set",
  "source": "MyApp v1.0",
  "datacontenttype": "application/json",
  "data": "{\"data\":[{\"description\":\"my settings\",\"memory\":\"{}\"}]}"
}
```

#### Request Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | Array | Yes | Array of record objects to insert or update |

Each record object:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | GUID | No | Memory record Id. If provided and exists, updates the record. If omitted, inserts a new record with auto-generated GUID. |
| `description` | String | No | Description text (max 2048 chars) |
| `memory` | String | No | UTF-8 plain text content to store in the blob |

#### Example — Insert New Record

```json
{
  "data": [
    {
      "description": "My personal settings",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

#### Example — Update Existing Record

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "Updated personal settings",
      "memory": "{\"theme\":\"light\"}"
    }
  ]
}
```

### Response Format

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Success"` or `"Error"` |
| `insertedCount` | Integer | Number of records inserted |
| `modifiedCount` | Integer | Number of records modified |
| `result` | Array | Array of processed record objects (same format as Memory.User.Get response) |

#### Example Response

```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "description": "My personal settings",
      "memory": "{\"theme\":\"dark\"}"
    }
  ]
}
```

### Table Reference

**Table**: User Memory ori (10077905)

| No. | Name | Type | Writable |
|-----|------|------|----------|
| 1 | User Name | Code[50] | No (set automatically to current user) |
| 2 | Id | GUID | Yes (auto-generated if omitted) |
| 3 | Description | Text[2048] | Yes |
| 4 | Memory | Blob | Yes (UTF-8 text) |

### Access Rules

- **New records**: Only visible to the creator.
- **Existing records**: Only the original creator can update (enforced by `User Name` match).
- `User Name` is automatically set on insert from the current user identity.
- Other users cannot see or modify these records.

---

## Permission Sets

| Permission Set | ID | Description |
|---|---|---|
| Bifrost Company Memory | 10077891 | Grants RIMD access to the Bifrost Memory and Translation ori tables. Assign to users who need full memory management capabilities. |

---

## Related Documentation

- [API Reference](/foundation/reference/api/) — Full API endpoint documentation
- [Setup Reference](/foundation/reference/setup/) — Configuration and permission set details
- [Data Message Types](/foundation/message-types/data/) — Generic data record operations
