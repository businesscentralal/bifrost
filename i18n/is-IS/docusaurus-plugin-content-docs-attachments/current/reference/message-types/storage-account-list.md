---
id: storage-account-list
title: "Storage.Account.List"
sidebar_label: "Storage.Account.List"
sidebar_position: 2
description: "Request and response contract for the Storage.Account.List Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Lists the stillt storage tengingar (kóðis, descriptions, connectors og enabled state). No secrets eru exposed.

## Lýsigögn
- **Direction:** Út á við
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Account.List` og the parameters below as the `data` object.
- **Routing:** No routing parameters. Lists every stillt tenging so you getur pick a `storageCode` fyrir the other tegunds. This er the discovery entry point — call it first.

## Dæmi um beiðni
```json
{ }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `accounts` | array | One object per tenging: `{ code, description, connector, basePath, enabled }`. No secrets eru returned. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Notes
Notaðu a returned `code` as the `storageCode` on every other storage message tegund. Disabled tengingar eru listed but rejected at call time, so prefer ones með `enabled = true`.

## Next steps
- Once you have a storageCode → call `Storage.File.Create` (pass the `code` as `storageCode` (or use any other Storage.* tegund)).
- To upload a large skrá → call `Storage.Upload.Begin` (pass the `code` as `storageCode`).

## Tengdar aðgerðir
- **Connector overview:** `Help.Storage.Get`

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

