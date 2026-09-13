---
id: clockify-timesheet-create
title: "Clockify.TimeSheet.Create"
sidebar_label: "Clockify.TimeSheet.Create"
sidebar_position: 33
description: "Request and response contract for the Clockify.TimeSheet.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til upcoming weekly time sheets fyrir every time-sheet resource (No. Series + owner + period handled).

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-create`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `weeksAhead` | No | integer | Target number of upcoming sheets per resource (sjálfgefið 4). | — |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "weeksAhead": 4 }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "status": "Tókst", "created": 8 &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
This message tegund er not tracked in the Clockify Integration table.

## Notes
- BC-side only; gerir ekki call Clockify.\- Idempotent: aðeins fills the gap up to `weeksAhead` sheets per resource.\- Requires Resources Stilltuup `Time Sheet Nos.` og resources með `Use Time Sheet` = true.

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

