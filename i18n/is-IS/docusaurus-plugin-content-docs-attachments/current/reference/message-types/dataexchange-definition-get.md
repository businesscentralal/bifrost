---
id: dataexchange-definition-get
title: "DataExchange.Definition.Get"
sidebar_label: "DataExchange.Definition.Get"
sidebar_position: 1
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina DataExchange.Definition.Get."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar einni skilgreiningu gagnaskipta, ásamt línuskilgreiningum, dálkaskilgreiningum og reitavörpunum, raðað eftir lyklum þeirra.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `DataExchange.Definition.Get` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Skilgreiningin er tilgreind með `code` úr `DataExchange.Definition.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `code` | **Já** | string | Kóði Data Exch. Def. |

## Dæmi um beiðni
```json
{ "code": "SEPA CAMT" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `code` | string | Kóði skilgreiningar. Hinir listareitirnir (`name`, `type`, `fileType`, heiti kóðaeininga og XMLport, fjöldatölur, `usedByDataExchangeTypes`) fylgja með. |
| `lineDefs` | array | `code`, `name`, `columnCount`, `dataLineTag`, `namespace`, raðað eftir línukóða. |
| `columnDefs` | array | `lineDef`, `columnNo`, `name`, `dataType`, `dataFormat`, `dataFormattingCulture`, `path`, `negativeSign`, `constant`, raðað eftir línukóða og síðan dálknúmeri. |
| `mappings` | array | `lineDef`, `tableId`, `tableName`, `mappingCodeunit`, `preMappingCodeunit`, `postMappingCodeunit`, `dataExchNoFieldId`, `useAsIntermediateTable` og `fieldMappings` (`columnNo`, `fieldId`, `fieldName`, `optional`, `multiplier`, `overwriteValue`, `transformationRule`). |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Vantar kóða | Sendu `code`. |
| Óþekktur kóði | Kallaðu á `DataExchange.Definition.List` og notaðu `code` sem er skilað. |

## Næstu skref
- Til að lista skilgreiningar aftur → kallaðu á `DataExchange.Definition.List`.

---
Yfirlit yfir gagnaskipti: sæktu hjálpina fyrir `Help.DataExchange.Get`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

