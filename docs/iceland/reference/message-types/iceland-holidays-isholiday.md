---
id: iceland-holidays-isholiday
title: "Iceland.Holidays.IsHoliday"
sidebar_label: "Iceland.Holidays.IsHoliday"
sidebar_position: 30
description: "Request and response contract for the Iceland.Holidays.IsHoliday Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks whether a single date is an Icelandic public holiday or special day.
Pure local computation — no external API call or authentication required.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to check a single date before scheduling a payment, delivery, or task.
- You want to find the next available working day after a given date.
- You need the fastest point-in-time check without loading a full year of data.
- For date ranges, use `Iceland.Holidays.Get` instead (one call per year is more efficient).

## Request
- **Subject** (required): A date in ISO format `YYYY-MM-DD` (e.g. `2026-06-17`).
- **Body** (optional): workday arithmetic relative to the subject date.

| Field | Type | Default | Description |
|---|---|---|---|
| `workdayOffset` | Integer | `0` | Nth workday from the subject date. Negative counts backwards. `0` = do not calculate. |
| `includeHalfDays` | Boolean | `false` | Treat Aðfangadagur and Gamlársdagur as working days. |

Omit the body and the response is unchanged. `workdayOffset` is capped at ±260 (about one working year).

### Last working day before a date

Subject `2026-06-18`, body `{ "workdayOffset": -1 }` answers
"the last working day before 17 June" — skipping the holiday and any weekend:

```json
{ "date": "2026-06-18", "isWorkDay": true,
  "workdayOffset": -1, "includeHalfDays": false, "workdayDate": "2026-06-16" }
```

Use it to pick a business date before calling a feed that only publishes on
working days, such as `Iceland.Currency.Sync`.

## Response
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

### Response field notes
| Field | Notes |
|---|---|
| `date` | The queried ISO date. |
| `isHoliday` | `true` = statutory public holiday (non-working day). |
| `isSpecialDay` | `true` = holiday or commonly observed day (superset of `isHoliday`). |
| `description` | Icelandic name of the day. Present only when `isSpecialDay = true`. |
| `key` | Stable machine identifier. Present only when `isSpecialDay = true`. |
| `halfDay` | Present and `true` only on Aðfangadagur (Dec 24) and Gamlársdagur (Dec 31). |
| `isWorkDay` | `true` = normal working day or half-day. `false` for weekends and full public holidays. |

| `workdayOffset` | Echoed only when a non-zero offset was requested. |
| `includeHalfDays` | Echoed only when a non-zero offset was requested. |
| `workdayDate` | The resolved date. Present only when a non-zero offset was requested. |

## AI/Agent playbook
1. Use `workdayOffset` to find the Nth working day from a date (e.g. `{"workdayOffset": -1}` for the last working day before).
2. Use `isHoliday = true` for strict non-working-day checks (payment due dates, SLA expiry).
3. Use `isSpecialDay = true` to avoid sending marketing on culturally important days beyond statutory holidays.
4. `halfDay = true` means work stops at noon — treat as partial working day for scheduling.
5. Weekends return `isHoliday = false`, `isSpecialDay = false`, `isWorkDay = false`.
6. For bulk date ranges, prefer `Iceland.Holidays.Get` (one call per year) over calling this per date in a loop.
Capability boundary: pure local computation; no external call is made.

## Errors
- `Subject is required. Provide a date in ISO format (e.g. 2026-06-17).` — subject missing.
- `Could not parse date from "...". Use ISO format: YYYY-MM-DD.` — unrecognized format.

## Examples
- Subject `2026-06-17` → isHoliday=true, "Þjóðhátíðardagurinn" (Independence Day)
- Subject `2026-12-24` → isHoliday=true, halfDay=true, "Aðfangadagur"
- Subject `2026-06-28` → isHoliday=false, isSpecialDay=false, isWorkDay=false (Sunday)
- Subject `2026-06-29` → isHoliday=false, isSpecialDay=false, isWorkDay=true (Monday)

