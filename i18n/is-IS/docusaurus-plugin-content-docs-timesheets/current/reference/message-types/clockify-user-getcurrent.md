---
id: clockify-user-getcurrent
title: "Clockify.User.GetCurrent"
sidebar_label: "Clockify.User.GetCurrent"
sidebar_position: 37
description: "Request and response contract for the Clockify.User.GetCurrent Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Skilar the currently authenticated Clockify notandi. Notaðu its id as notandiId fyrir time-entry operations.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /user`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `user`)

## Dæmi um beiðni
```json
{ }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the authenticated notandi object (includes `id`, `name`, `email`, `activeWorkspace`, `defaultWorkspace`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu the returned `id` as `userId` in time-entry operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- No parameters needed — returns the notandi who owns the API key.\- The `id` field er the `userId` required by `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.List`, etc.\- `activeWorkspace` er the notandi's currently selected vinnusvæði ID.

## Tengdar aðgerðir
- **List allir notendur in vinnusvæði:** `Clockify.User.List`\- **Notaðu notandiId fyrir tímafærslur:** `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.List`

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

