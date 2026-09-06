---
id: ja-search-query
title: "Ja.Search.Query"
sidebar_label: "Ja.Search.Query"
sidebar_position: 75
description: "Request and response contract for the Ja.Search.Query Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Use this for free-text discovery across people, businesses, addresses, and places in Já Símaskrá Search v6.

## When should I use this?
| Scenario | Use `Ja.Search.Query`? | Why |
|---|---|---|
| You only have a name, phone number, or address fragment | Yes | Search can resolve partial and mixed text. |
| You have a known person kennitala and need official registry fields | No | Use `Ja.Person.Get`. |
| You have a known company kennitala and need official company registry fields | No | Use `Ja.Company.Get`. |

## Message metadata
- Direction: Outbound
- Content-Type: text/json
- Requires: Já Search API key in Bifrost Setup
- **Permission required**: BIFROST Ja

## Request
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

## Request fields
| Field | Required | Description |
|---|---|---|
| `q` | Yes | Free-text search term. Can be phone, person name, company name, or address text. |
| `scope` | No | `people`, `businesses`, or `fast`. |
| `start` | No | 1-based paging start. |
| `count` | No | Results per page, max 30. |
| `fields` | No | Comma-separated field projection. |
| `filter` | No | `open`, `svæði:<region>`, or both separated by comma. |
| `west`, `east`, `south`, `north` | No | Coordinate bounds, all four required when used. |
| `time` | No | RFC 3339 timestamp for opening-hours filter. |

## Response
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
- **Coordinates:** all four (west, east, south, north) required for bounding-box filtering.
- **Opening hours:** `filter=open` with optional `time=2025-06-22T18:30Z` (defaults to now).
- **Multiple filters:** join with comma, e.g. `filter=open,svæði:reykjavik`.

## Errors
- `Missing required 'q'` — the search term was not supplied.
- `The Já Search API key is not configured` — set the key in Bifrost Setup.
- `Access denied` — the BIFROST Ja permission set is not assigned.
- Any `error` text returned by Já is surfaced verbatim.

## Notes
- `count` is capped at 30 by the Já Search API.
- Region names are Icelandic: Reykjavik, Austurland, Suðurland, Vesturland, Vestfirðir, Norðurland.

## Related message types
- Use `Ja.Person.Get` after search when you need authoritative person details by kennitala.
- Use `Ja.Company.Get` after search when you need authoritative company details by kennitala.

