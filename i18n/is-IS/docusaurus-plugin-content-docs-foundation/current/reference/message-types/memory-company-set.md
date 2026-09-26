---
id: memory-company-set
title: "Memory.Company.Set"
sidebar_label: "Memory.Company.Set"
sidebar_position: 98
description: "Beiðni- og svarsamningur fyrir Memory.Company.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Inserts eða Uppfærir company-scoped memory færslur in `Bifrost Memory`. hver vöru in `data` er keyed með `id` (GUID). ef the færsla exists it er modified; otherwise it er inserted. Supplying `memory` replaces the blob; an empty strengur clears it. hver færsla er processed individually — a single failing vöru does ekki stop the batch.

## Stefna
Innkomandi

## Response Content Gerð
`text/json`

## Idempotency
endurtekningarþolið per `id`: re-sending the sama payload yields the sama final state.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| data | fylki | Yes | ein eða fleiri memory færslur (Sjá below) |

### Memory færsla Fields
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| id | GUID | Yes | Primary key |
| Lýsing | Text | No | Short Lýsing |
| memory | Text | No | Full memory blob (UTF-8); empty strengur clears the blob |

## Dæmi um beiðni
The payload (the Bifrost `data` attribute) may be **either** a bare JSON fylki of færslur, **eða** an hlutur með a `data` fylki property. Both eru accepted.

Bare fylki (recommended via the `call_message_type` MCP tool — pass this as the tool's `data` argument):
```json
[
  { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." }
]
```

hlutur form (data attribute wraps a `data` fylki):
```json
{ "data": [ { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." } ] }
```

`id` er valfrjálst — omit it til insert a ný færsla (a GUID er assigned og returned); supply it til update an fyrirliggjandi færsla.

## Uppbygging svars
```json
{
  "status": "Success",
  "insertedCount": 1,
  "modifiedCount": 0,
  "result": [ { "id": "a1b2c3d4-...", "description": "Pricing rules", "memory": "..." } ]
}
```

## Villur
| Condition | Villa message |
|-----------|---------------|
| vantar data fylki | `Missing record data. Provide a JSON array of records as the payload, or an object with a "data" array property.` |
| Per-færsla Mistókst | `Error processing record {n}` |
| Nothing applied | `status: Error` með `No records were inserted or updated. Please check the data and try again.` |
| skrifa heimild denied | `You do not have permission to write to company memory. The 'BIFROST CoMem ori' permission set is required in addition to 'BIFROST API ori'.` |

## áskilið heimildir
Writing company memory requires the `BIFROST CoMem ori` heimild set in addition til the base `BIFROST API ori`. án it Beiðnin Skilar the skrifa-heimild Villa above; the `Help.WhoAmI.Get` response einnig exposes a `canUpdateCompanyMemory` flag callers getur check up front.

## Tengdar skilaboðategundir
- `Memory.Company.Get`
- `Memory.Company.List`
- `Memory.User.Set`

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

