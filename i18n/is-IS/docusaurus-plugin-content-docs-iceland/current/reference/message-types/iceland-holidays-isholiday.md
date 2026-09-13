---
id: iceland-holidays-isholiday
title: "Iceland.Holidays.IsHoliday"
sidebar_label: "Iceland.Holidays.IsHoliday"
sidebar_position: 30
description: "Beiðni- og svarsamningur fyrir Iceland.Holidays.IsHoliday Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks whether a stakan date er an Icelandic public holiday eða special day.
Pure local computation — no external API Kallaðu á eða authentication nauðsynlegt.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til check a stakan date áður en scheduling a greiðsla, delivery, eða task.
- You want til find the next available working day eftir a given date.
- You need the fastest point-in-time check without loading a fulla year of data.
- fyrir date ranges, Notaðu `Iceland.Holidays.Get` instead (one Kallaðu á per year er more efficient).

## Beiðni
- **Subject** (nauðsynlegt): A date in ISO format `YYYY-MM-DD` (e.g. `2026-06-17`).
- **Body** (valfrjálst): workday arithmetic relative til the subject date.

| Reitur | Gerð | Default | Lýsing |
|---|---|---|---|
| `workdayOffset` | Integer | `0` | Nth workday frá the subject date. Negative counts backwards. `0` = do not calculate. |
| `includeHalfDays` | Boolean | `false` | Treat Aðfangadagur og Gamlársdagur as working days. |

Omit the body og Svarið er unchanged. `workdayOffset` er capped at ±260 (about one working year).

### Last working day áður en a date

Subject `2026-06-18`, body `{ "workdayOffset": -1 }` answers
"the last working day áður en 17 June" — skipping the holiday og any weekend:

```json
{ "date": "2026-06-18", "isWorkDay": true,
  "workdayOffset": -1, "includeHalfDays": false, "workdayDate": "2026-06-16" }
```

Notaðu it til pick a business date áður en calling a feed that Aðeins publishes on
working days, such as `Iceland.Currency.Sync`.

## Svar
```json
{
  "messageType": "Iceland.Holidays.IsHoliday",
  "date": "2026-06-17",
  "isHoliday": true,
  "isSpecialDay": true,
  "description": "Þjóðhátíðardagurinn",
  "key": "jun17",
  "isWorkDay": false
}
```

### Svar Reitur notes
| Reitur | Notes |
|---|---|
| `date` | The queried ISO date. |
| `isHoliday` | `true` = statutory public holiday (non-working day). |
| `isSpecialDay` | `true` = holiday eða commonly observed day (superset of `isHoliday`). |
| `description` | Icelandic Heiti of the day. Present Aðeins Þegar `isSpecialDay = true`. |
| `key` | Stable machine identifier. Present Aðeins Þegar `isSpecialDay = true`. |
| `halfDay` | Present og `true` Aðeins on Aðfangadagur (Dec 24) og Gamlársdagur (Dec 31). |
| `isWorkDay` | `true` = normal working day eða half-day. `false` fyrir weekends og fulla public holidays. |

| `workdayOffset` | Echoed Aðeins Þegar a non-zero offset was requested. |
| `includeHalfDays` | Echoed Aðeins Þegar a non-zero offset was requested. |
| `workdayDate` | The resolved date. Present Aðeins Þegar a non-zero offset was requested. |

## Leiðbeiningar fyrir gervigreind/umboð
1. Notaðu `workdayOffset` til find the Nth working day frá a date (e.g. `{"workdayOffset": -1}` fyrir the last working day áður en).
2. Notaðu `isHoliday = true` fyrir strict non-working-day checks (greiðsla due dates, SLA expiry).
3. Notaðu `isSpecialDay = true` til avoid sending marketing on culturally important days beyond statutory holidays.
4. `halfDay = true` means work stops at noon — treat as partial working day fyrir scheduling.
5. Weekends return `isHoliday = false`, `isSpecialDay = false`, `isWorkDay = false`.
6. fyrir bulk date ranges, prefer `Iceland.Holidays.Get` (one Kallaðu á per year) over calling this per date in a loop.
Capability boundary: pure local computation; no external Kallaðu á er made.

## Errors
- `Subject is required. Provide a date in ISO format (e.g. 2026-06-17).` — subject missing.
- `Could not parse date from "...". Use ISO format: YYYY-MM-DD.` — unrecognized format.

## Dæmi
- Subject `2026-06-17` → isHoliday=true, "Þjóðhátíðardagurinn" (Independence Day)
- Subject `2026-12-24` → isHoliday=true, halfDay=true, "Aðfangadagur"
- Subject `2026-06-28` → isHoliday=false, isSpecialDay=false, isWorkDay=false (Sunday)
- Subject `2026-06-29` → isHoliday=false, isSpecialDay=false, isWorkDay=true (Monday)


