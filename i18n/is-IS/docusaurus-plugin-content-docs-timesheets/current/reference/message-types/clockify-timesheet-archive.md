---
id: clockify-timesheet-archive
title: "Clockify.TimeSheet.Archive"
sidebar_label: "Clockify.TimeSheet.Archive"
sidebar_position: 32
description: "Request and response contract for the Clockify.TimeSheet.Archive Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Stilltuur í geymslu fully posted time sheets og removes empty posted sheets ending áður en the work dagsetning.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST (BC-side) /internal/timesheet-archive`

## Dæmi um beiðni
```json

```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur &#123; "status": "Tókst", "archived": 6 &#125;.

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
This message tegund er not tracked in the Clockify Integration table.

## Notes
- Flytur fully posted, non-open sheets to the archive; deletes empty posted sheets.\- BC-side only; gerir ekki call Clockify.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

