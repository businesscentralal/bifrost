---
id: ja-search-query
title: "Ja.Search.Query"
sidebar_label: "Ja.Search.Query"
sidebar_position: 75
description: "Beiðni- og svarsamningur fyrir Ja.Search.Fyrirspurn Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Notaðu this fyrir free-text discovery across people, businesses, addresses, og places in Já Símaskrá Search v6.

## Þegar should I Notaðu this?
| Scenario | Notaðu `Ja.Search.Query`? | Why |
|---|---|---|
| You Aðeins have a Heiti, phone number, eða address fragment | Yes | Search getur resolve partial og mixed text. |
| You have a known person kennitala og need official registry fields | No | Notaðu `Ja.Person.Get`. |
| You have a known fyrirtæki kennitala og need official fyrirtæki registry fields | No | Notaðu `Ja.Company.Get`. |

## Message metadata
- Stefna: Outbound
- Efnisgerð: text/json
- Requires: Já Search API key in Bifrost Setup
- **Permission nauðsynlegt**: BIFROST Ja

## Beiðni
```json
{
  "q": "Já hf",                 // (required) free-text search term
  "scope": "businesses",        // (optional) people | businesses | fast
  "start": 1,                    // (optional) 1-based page start (default 1)
  "count": 10,                   // (optional) results per page (max 30)
  "fields": "name,phone,address", // (optional) comma-separated field list
  "filter": "open,svæði:reykjavik", // (optional) "open" and/or "svæði:region"
  "west": "-21.94", "east": "-21.83", "south": "64.12", "north": "64.15", // (optional) bounding box
  "time": "2025-06-22T18:30"   // (optional) RFC 3339 format; use with filter:open
}
```

## Beiðni fields
| Reitur | nauðsynlegt | Lýsing |
|---|---|---|
| `q` | Yes | Free-text search term. getur be phone, person Heiti, fyrirtæki Heiti, eða address text. |
| `scope` | No | `people`, `businesses`, eða `fast`. |
| `start` | No | 1-based paging start. |
| `count` | No | Results per page, max 30. |
| `fields` | No | Comma-separated Reitur projection. |
| `filter` | No | `open`, `svæði:<region>`, eða both separated by comma. |
| `west`, `east`, `south`, `north` | No | Coordinate bounds, Allt four nauðsynlegt Þegar used. |
| `time` | No | RFC 3339 timestamp fyrir opening-hours filter. |

## Svar
```json
{
  "status": "Success", "query": "Já hf", "scope": "businesses",
  "items": [ { "name": "Já hf.", "address": "Álfheimar 74", "postal_code": 104, "municipality": "Reykjavík",
              "phone": { "number": "5851100", "pretty": "585 1100", "mobile": false }, "type": "business" } ],
  "meta": { "first_item": 1, "last_item": 10, "total_items": 23 }
}
```

## Filtering
- **Regions (named):** `filter=svæði:Reykjavik`, `svæði:Austurland`, `svæði:Vesturland`, etc.
- **Coordinates:** Allt four (west, east, south, north) nauðsynlegt fyrir bounding-box filtering.
- **Opening hours:** `filter=open` með valfrjálst `time=2025-06-22T18:30Z` (defaults til now).
- **Multiple filters:** join með comma, e.g. `filter=open,svæði:reykjavik`.

## Errors
- `Missing required 'q'` — the search term was not supplied.
- `The Já Search API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set er not assigned.
- Any `error` text returned by Já er surfaced verbatim.

## Notes
- `count` er capped at 30 by the Já Search API.
- Region names eru Icelandic: Reykjavik, Austurland, Suðurland, Vesturland, Vestfirðir, Norðurland.

## Related message types
- Notaðu `Ja.Person.Get` eftir search Þegar you need authoritative person details by kennitala.
- Notaðu `Ja.Company.Get` eftir search Þegar you need authoritative fyrirtæki details by kennitala.


