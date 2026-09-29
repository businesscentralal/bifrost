---
id: dataexchange-entry-get
title: "DataExchange.Entry.Get"
sidebar_label: "DataExchange.Entry.Get"
sidebar_position: 3
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina DataExchange.Entry.Get."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Skilar einni Data Exch.-færslu. Reitum er skipt í síður. Innihald skrár fylgir aðeins þegar beðið er um það og aðeins upp að 1 MB.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `DataExchange.Entry.Get` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Færslan er tilgreind með `entryNo` úr `DataExchange.Entry.List`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `entryNo` | **Já** | integer | Númer Data Exch.-færslu. |
| `includeFields` | Nei | boolean | Tekur með fylkið `fields`, skipt í síður. Sjálfgefið er true. |
| `includeFileContent` | Nei | boolean | Tekur með `contentBase64`. Sjálfgefið er false. Hafnað ef skráin er stærri en 1 MB. |
| `skip` | Nei | integer | Fjöldi reitalína sem á að sleppa þegar `includeFields` er true. Sjálfgefið er 0. Neikvætt gildi veldur villu. |
| `take` | Nei | integer | Síðustærð reita. Sjálfgefið 100 ef sleppt eða 0. Neikvætt gildi veldur villu. Takmarkað við 1000. |

## Dæmi um beiðni
```json
{ "entryNo": 20, "includeFields": true, "skip": 0, "take": 50 }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `entryNo` | integer | Færslan. Listareitirnir (`dataExchDefCode`, `fileName`, `createdAt`, `hasFileContent`, `fieldCount`, `incomingEntryNo`, `relatedRecord`) fylgja með. |
| `fields` | array | Til staðar þegar `includeFields` er true. Hvert atriði er `lineNo`, `columnNo`, `columnName`, `value`, `dataExchLineDefCode`. |
| `contentBase64` | string | Til staðar aðeins þegar `includeFileContent` er true og skráin er 1 MB eða minni. |
| `contentLength` | integer | Lengd í bætum, til staðar ásamt `contentBase64`. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Vantar entryNo eða það er óþekkt | Sendu `entryNo` úr `DataExchange.Entry.List`. |
| Innihald skrár stærri en 1 MB | Slepptu `includeFileContent`. Kallið skilar villu og engu innihaldi. |

## Athugasemdir
## Takmörk síðuskiptingar
`skip` er sjálfgefið 0 og neikvæðum gildum er hafnað. `take` er sjálfgefið 100 ef því er sleppt eða það er núll, neikvæðum gildum er hafnað og það er takmarkað við hámarkið 1000.


## Næstu skref
- Til að velja aðra færslu → kallaðu á `DataExchange.Entry.List`.

---
Yfirlit yfir gagnaskipti: sæktu hjálpina fyrir `Help.DataExchange.Get`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

