---
id: clockify-timesheet-post
title: "Clockify.TimeSheet.Post"
sidebar_label: "Clockify.TimeSheet.Post"
sidebar_position: 34
description: "Request and response contract for the Clockify.TimeSheet.Post Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Transfers approved, unposted time-sheet detail í a Job Journal batch og posts the línur.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-post`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `journalTemplate` | No | string | Job Journal Template heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Template on Clockify Stilltuup. | — |
| `journalBatch` | No | string | Job Journal Batch heiti (Code[10]). Sjálfgefið er the Clockify Job Journal Batch on Clockify Stilltuup. | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "journalTemplate": "VERK", "journalBatch": "CONTOSO" }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "status": "Tókst", "postedLines": 24 &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
This message tegund er not tracked in the Clockify Integration table.

## Notes
- Bókar approved time-sheet detail to the Job Journal via `Job Jnl.-Post Line`.\- BC-side only; gerir ekki call Clockify.\- Only línur með `Type = Job`, `Status = Approved`, og not yet posted eru innifalið.

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

