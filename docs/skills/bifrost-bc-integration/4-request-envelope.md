---
id: 4-request-envelope
title: "4. Request Envelope"
sidebar_label: "4. Request Envelope"
sidebar_position: 6
---

Every POST body follows this structure:

| Field | Required | Type | Notes |
|---|---|---|---|
| `specversion` | Yes | string | Always `"1.0"` |
| `type` | Yes | string | Message type, e.g. `"Data.Records.Get"` |
| `source` | Yes | string | Caller identifier, e.g. `"MyApp v2.3"` |
| `id` | No | GUID | Auto-generated if omitted |
| `subject` | Depends | string | Target record key (customer no., table name, order no., item no., …). Required by some types. |
| `data` | Depends | **JSON string** | Input parameters. **Must be serialized to a string**: `"data": "{\"tableName\":\"Customer\"}"`. Not an object. |
| `lcid` | No | integer | Windows Language ID for localised captions. 1033 = English, 1039 = Icelandic. Defaults to Bifrost Setup language. |
| `datacontenttype` | No | string | `"application/json"` — informational only |

---
