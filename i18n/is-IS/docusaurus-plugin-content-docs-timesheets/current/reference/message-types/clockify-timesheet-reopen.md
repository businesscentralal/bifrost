---
id: clockify-timesheet-reopen
title: "Clockify.TimeSheet.Reopen"
sidebar_label: "Clockify.TimeSheet.Reopen"
sidebar_position: 36
description: "Request and response contract for the Clockify.TimeSheet.Reopen Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Opnar aftur submitted eða approved time-sheet línur back to Open, up to a cut-off dagsetning.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-reopen`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `endingDateTo` | No | string | Only reopen sheets ending on eða áður en this ISO dagsetning (YYYY-MM-DD). Sjálfgefið er the work dagsetning. | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "endingDateTo": "2026-06-30" }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "status": "Tókst", "reopenedLines": 3 &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
This message tegund er not tracked in the Clockify Integration table.

## Notes
- Opnar aftur submitted línur to Open og approved línur back through Submitted to Open.\- BC-side only; gerir ekki call Clockify.

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

