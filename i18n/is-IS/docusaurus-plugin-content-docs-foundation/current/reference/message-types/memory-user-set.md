---
id: memory-user-set
title: "Memory.User.Set"
sidebar_label: "Memory.User.Set"
sidebar_position: 101
description: "Beiðni- og svarsamningur fyrir Memory.User.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Inserts eða Uppfærir user-scoped memory færslur in `Bifrost User Memory`. The current `UserId()` er forced as the owning user — færslur getur ekki be written fyrir other users. hver vöru in `data` er keyed með `id` (GUID); fyrirliggjandi rows eru modified, ný ones eru inserted. Supplying `memory` replaces the blob; empty strengur clears it.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
endurtekningarþolið per `id`: re-sending the sama payload yields the sama final state.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| data | fylki | Yes | ein eða fleiri memory færslur |

### Memory færsla Fields
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| id | GUID | Yes | Primary key (within current user) |
| Lýsing | Text | No | Short Lýsing |
| memory | Text | No | Full memory blob (UTF-8); empty strengur clears the blob |

## Dæmi um beiðni
The payload (the Bifrost `data` attribute) may be **either** a bare JSON fylki of færslur, **eða** an hlutur með a `data` fylki property. Both eru accepted.

Bare fylki (recommended via the `call_message_type` MCP tool — pass this as the tool's `data` argument):
```json
[
  { "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." }
]
```

hlutur form (data attribute wraps a `data` fylki):
```json
{ "data": [ { "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." } ] }
```

`id` er valfrjálst — omit it til insert a ný færsla (a GUID er assigned og returned); supply it til update an fyrirliggjandi færsla.

## Uppbygging svars
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [ { "userName": "JANE", "id": "a1b2c3d4-...", "description": "My personal notes", "memory": "..." } ]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar data fylki | `Missing record data. Provide a JSON array of records as the payload, or an object with a "data" array property.` |
| Per-færsla Mistókst | `Error processing record {n}` |
| Nothing applied | `status: Error` með `No records were inserted or updated. Please check the data and try again.` |

## Tengdar skilaboðategundir
- `Memory.User.Get`
- `Memory.User.List`
- `Memory.Company.Set`

