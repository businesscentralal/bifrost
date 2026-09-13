---
id: clockify-currency-list
title: "Clockify.Currency.List"
sidebar_label: "Clockify.Currency.List"
sidebar_position: 6
description: "Request and response contract for the Clockify.Currency.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the currencies defined in a Clockify vinnusvæði.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Clockify API:** `GET /workspaces (inline `currencies` from workspace object)`

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing | Finndu með |
|---|---|---|---|---|
| `workspaceId` | **Yes** | string | Target vinnusvæði ID | `Clockify.Workspace.List → id` |

`workspaceId` may be omitted þegar Default Workspace ID er stillt on Clockify Stilltuup.

## Dæmi um beiðni
```json
{ "workspaceId": "5f..." }
```

## Svar
Tókst:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` inniheldur an array of currency objects (each með `id`, `code`, og the vinnusvæði sjálfgefið flag).

Mistókst:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Samstillingarskráning
No tracking action required — this er a read operation. Notaðu `id` as `currencyId` in client operations.

## Algengar villur

| HTTP | Villa | Úrlausn |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Stilltuup |

## Notes
- Clockify has no standalone currencies endpoint. This message tegund reads `GET /workspaces` og extracts the requested vinnusvæði's `currencies` array.\- Each vara has an internal `id` (Clockify currency ID) og a 3-letter `code` (e.g. `ISK`, `USD`).\- Notaðu the `id` gildi (NOT the `code`) as `currencyId` in `Clockify.Client.Create` / `Clockify.Client.Update`. Senduing `currencyCode` er silently ignored.\- The list er per-vinnusvæði — the same currency kóði getur have different IDs in different vinnusvæðis.

## Tengdar aðgerðir
- **Notaðu currencyId:** `Clockify.Client.Create` og `Clockify.Client.Update` (body.currencyId)\- **Workspace info:** `Clockify.Workspace.List` returns the full vinnusvæði object including currencies

---
Full integration-table reference og entity model: request help fyrir `Help.Clockify.Get`.

