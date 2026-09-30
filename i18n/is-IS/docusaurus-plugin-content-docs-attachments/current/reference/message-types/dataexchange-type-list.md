---
id: dataexchange-type-list
title: "DataExchange.Type.List"
sidebar_label: "DataExchange.Type.List"
sidebar_position: 5
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina DataExchange.Type.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar Data Exchange Type-færslur. Fyrirtæki sem hefur engar skilar fjöldanum 0 og tómu fylki.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `DataExchange.Type.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Engar færibreytur í beiðninni.

## Dæmi um beiðni
```json
{ }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `count` | integer | Fjöldi Data Exchange Type-færslna. Núll þegar fyrirtækið hefur engar. |
| `types` | array | `code`, `description`, `dataExchDefCode`, `userFeedbackCodeunit`, `validationCodeunit`, `dataHandlingCodeunit` og `type`. Heiti kóðaeininganna þriggja og `type` eru lesin úr tengdri Data Exch. Def. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Næstu skref
- Til að lesa skilgreininguna sem gerð vísar á → kallaðu á `DataExchange.Definition.Get` (sendu `dataExchDefCode` sem `code`).

---
Yfirlit yfir gagnaskipti: sæktu hjálpina fyrir `Help.DataExchange.Get`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

