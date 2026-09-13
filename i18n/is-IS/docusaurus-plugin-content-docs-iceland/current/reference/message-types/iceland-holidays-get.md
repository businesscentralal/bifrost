---
id: iceland-holidays-get
title: "Iceland.Holidays.Get"
sidebar_label: "Iceland.Holidays.Get"
sidebar_position: 29
description: "Beiðni- og svarsamningur fyrir Iceland.Holidays.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar Allt Icelandic public holidays og special days fyrir a given year eða month.
Pure local computation — no external API Kallaðu á eða authentication nauðsynlegt.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til Listi Allt Icelandic public holidays in a year fyrir scheduling eða display.
- You need til identify non-working days in a payroll period eða delivery window.
- You eru building a calendar, work-hour, eða SLA calculation feature.
- You need the fulla set of special days (not just statutory holidays) in a stakan Kallaðu á.

## Beiðni
- **Subject** (nauðsynlegt): Year eða year-month til Fyrirspurn.
  - `2026` — Allt special/holiday days in 2026 (~32 entries)
  - `2026-12` — Aðeins days in December 2026
- **Body**: Not used. Leave empty eða pass `{}`.

## Svar
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

### Svar Reitur notes
| Reitur | Notes |
|---|---|
| `date` | ISO date (YYYY-MM-DD). |
| `description` | Icelandic Heiti of the day (e.g. "Nýársdagur"). |
| `key` | Stable machine identifier (e.g. `nytarsdagur`, `paska`, `jola`). Consistent across years — Notaðu fyrir lookups. |
| `holiday` | `true` = statutory public holiday (non-working day). `false` = culturally observed day, not a legal holiday. |
| `halfDay` | Present og `true` Aðeins on Aðfangadagur (Dec 24) og Gamlársdagur (Dec 31). Afternoon off Aðeins. |

## Leiðbeiningar fyrir gervigreind/umboð
1. fyrir a fulla-year holiday calendar, Kallaðu á með subject = year Aðeins: `2026`.
2. fyrir a stakan month (e.g. payroll period), Notaðu subject = `2026-12`.
3. Filter `holiday = true` til Sækja statutory non-working days; check `halfDay = true` fyrir half-days (noon cutoff).
4. Notaðu `key` til identify the same holiday across different years — Easter (`key = paska`) falls on a different date each year.
5. A fulla year Skilar ~32 entries (16 statutory holidays + 16 special/observed days); month mode Skilar a subset.
6. fyrir stakan-date point queries, prefer `Iceland.Holidays.IsHoliday` — it avoids loading the fulla year.
Capability boundary: pure local computation; no external Kallaðu á er made.

## Errors
- `Subject is required. Provide a year (e.g. 2026) or year-month (e.g. 2026-12).` — subject missing.
- `Could not parse year from subject "...". Use format: 2026 or 2026-12.` — unrecognized subject format.


