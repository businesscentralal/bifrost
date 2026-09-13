---
id: clockify-client-create
title: "Clockify.Client.Create"
sidebar_label: "Clockify.Client.Create"
sidebar_position: 1
description: "Request and response contract for the Clockify.Client.Create Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a client in a Clockify vinnusvæði úr the request body.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `POST /workspaces/{workspaceId}/clients`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `client`)

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |
| `body.name` | **Yes** | string | Client display heiti (verður að vera unique in vinnusvæði) | — |
| `body.address` | No | string | Single-lína address (concatenate BC Address + Address 2 + Post Code + City + Country) | — |
| `body.email` | No | string | Client contact email | — |
| `body.note` | No | string | Free-text note | — |
| `body.currencyId` | No | string | Clockify currency ID (NOT the ISO kóði). Sleppið fyrir vinnusvæði sjálfgefið | `Clockify.Currency.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f...", "body": { "name": "Acme Inc.", "address": "Main St 1, 101 Reykjavik, IS", "currencyId": "6a..." } }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur the created client object (includes `id`, `name`, `workspaceId`).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
Record the link: call `Data.Records.Set` on `Clockify Integration` með `BC Table No.`, `BC SystemId`, `BC Code` (the BC source færsla), `Clockify Type` = `client`, `Clockify Id` = the `id` úr `data` in the response, `Clockify Workspace Id` = the vinnusvæði used, `Clockify Name` = display heiti. Stilltu `Reversed` = `false`.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 400 | Client heiti already er til in vinnusvæði | Notaðu `Clockify.Client.List` to find existing client, eða choose a different heiti |
| 401 | Unauthorized | Check API key on Clockify Stilltuup |
| 403 | Forbidden | API key notandi lacks vinnusvæði admin role |

## Notes
- `currencyCode` er **silently ignored** — Clockify returns 201 but uses vinnusvæði sjálfgefið. Alltaf use `currencyId`.\- `address` er a single free-text field; concatenate multi-lína BC address fields áður en sending.

## Tengdar aðgerðir
- **Resolve currencyId:** `Clockify.Currency.List` → match on `code` → use `id`\- **After creating:** Record integration link, then optionally create verkefni under this client\- **To updagsetning later:** `Clockify.Client.Update` (requires `clientId` úr create response)\- **To delete later:** First archive (`Clockify.Client.Update` body `{ "archived": true }`), then `Clockify.Client.Delete`

## Leiðbeiningar fyrir umboðsmann — áhrif valfrjálsra færibreyta

- Any parameter marked **Nauðsynlegt = No** may be omitted.
- Valfrjálst `body.*` fields omitted úr the request eru not sent to Clockify; Clockify applies endpoint sjálfgefiðs.

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

