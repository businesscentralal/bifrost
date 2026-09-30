---
id: dataexchange-definition-list
title: "DataExchange.Definition.List"
sidebar_label: "DataExchange.Definition.List"
sidebar_position: 2
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina DataExchange.Definition.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar skilgreiningar gagnaskipta og þá Data Exchange Type-kóða sem vísa í hverja þeirra.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `DataExchange.Definition.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Engin `storageCode`. Valfrjálsar síur þrengja skilgreiningalistann.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `type` | Nei | string | Heiti enum-gildis skilgreiningargerðar, til dæmis `Generic Import` eða `Payment Export`. Slepptu til að fá allar skilgreiningar. |
| `direction` | Nei | string | `Import` eða `Export`. Skilgreining passar ef heiti gerðar hennar inniheldur það orð. |

## Dæmi um beiðni
```json
{ "direction": "Import" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `count` | integer | Fjöldi skilgreininga eftir síur. |
| `definitions` | array | Færslur með `code`, `name`, `type`, `fileType`, `readingWritingCodeunit`, `readingWritingXmlPort`, `extDataHandlingCodeunit`, `lineDefCount`, `mappingCount`, `usedByDataExchangeTypes`. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Óþekkt heiti gerðar | Sendu heiti enum-gildis Data Exch. Def-gerðar eða slepptu `type`. |
| direction er ekki Import eða Export | Slepptu `direction` eða sendu nákvæmlega annað þessara tveggja orða. |

## Næstu skref
- Til að lesa dálka og reitavarpanir → kallaðu á `DataExchange.Definition.Get` (sendu `code` sem var skilað).
- Til að sjá hvaða tegund innkomins fylgiskjals notar skilgreiningu → kallaðu á `DataExchange.Type.List` (berðu `dataExchDefCode` saman við `code`).

---
Yfirlit yfir gagnaskipti: sæktu hjálpina fyrir `Help.DataExchange.Get`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

