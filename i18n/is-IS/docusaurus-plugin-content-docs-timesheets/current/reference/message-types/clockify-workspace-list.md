---
id: clockify-workspace-list
title: "Clockify.Workspace.List"
sidebar_label: "Clockify.Workspace.List"
sidebar_position: 40
description: "Request and response contract for the Clockify.Workspace.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the Clockify vinnusvæðis the stillt API key getur access.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces`

## Dæmi um beiðni
```json
{ }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of vinnusvæði objects (each með `id`, `name`, `memberships`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu the returned `id` as `workspaceId` in allir other Clockify calls.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- No parameters needed — returns allir vinnusvæðis accessible by the API key.\- Most Clockify operations require a `workspaceId`. Kallaðu á this first to resolve it.\- The Clockify Stilltuup stores a sjálfgefið vinnusvæði; this call er aðeins needed to discover alternatives eða verify the stillt one.

## Tengdar aðgerðir
- **Get current notandi:** `Clockify.User.GetCurrent` (also returns `activeWorkspace`)\- **All other operations:** Sendu vinnusvæði `id` as `workspaceId` parameter

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

