---
id: iceland-holidays-get
title: "Iceland.Holidays.Get"
sidebar_label: "Iceland.Holidays.Get"
sidebar_position: 29
description: "Request and response contract for the Iceland.Holidays.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns all Icelandic public holidays and special days for a given year or month.
Pure local computation — no external API call or authentication required.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to list all Icelandic public holidays in a year for scheduling or display.
- You need to identify non-working days in a payroll period or delivery window.
- You are building a calendar, work-hour, or SLA calculation feature.
- You need the full set of special days (not just statutory holidays) in a single call.

## Request
- **Subject** (required): Year or year-month to query.
  - `2026` — all special/holiday days in 2026 (~32 entries)
  - `2026-12` — only days in December 2026
- **Body**: Not used. Leave empty or pass `{}`.

## Response
```json
{
  "messageType": "Iceland.Holidays.Get",
  "year": 2026,
  "count": 32,
  "days": [
    {
      "date": "2026-01-01",
      "description": "Nýársdagur",
      "key": "nytarsdagur",
      "holiday": true
    },
    {
      "date": "2026-12-24",
      "description": "Aðfangadagur",
      "key": "adfangadagur",
      "holiday": true,
      "halfDay": true
    }
  ]
}
```

### Response field notes
| Field | Notes |
|---|---|
| `date` | ISO date (YYYY-MM-DD). |
| `description` | Icelandic name of the day (e.g. "Nýársdagur"). |
| `key` | Stable machine identifier (e.g. `nytarsdagur`, `paska`, `jola`). Consistent across years — use for lookups. |
| `holiday` | `true` = statutory public holiday (non-working day). `false` = culturally observed day, not a legal holiday. |
| `halfDay` | Present and `true` only on Aðfangadagur (Dec 24) and Gamlársdagur (Dec 31). Afternoon off only. |

## AI/Agent playbook
1. For a full-year holiday calendar, call with subject = year only: `2026`.
2. For a single month (e.g. payroll period), use subject = `2026-12`.
3. Filter `holiday = true` to get statutory non-working days; check `halfDay = true` for half-days (noon cutoff).
4. Use `key` to identify the same holiday across different years — Easter (`key = paska`) falls on a different date each year.
5. A full year returns ~32 entries (16 statutory holidays + 16 special/observed days); month mode returns a subset.
6. For single-date point queries, prefer `Iceland.Holidays.IsHoliday` — it avoids loading the full year.
Capability boundary: pure local computation; no external call is made.

## Errors
- `Subject is required. Provide a year (e.g. 2026) or year-month (e.g. 2026-12).` — subject missing.
- `Could not parse year from subject "...". Use format: 2026 or 2026-12.` — unrecognized subject format.

