---
id: dataexchange-entry-list
title: "DataExchange.Entry.List"
sidebar_label: "DataExchange.Entry.List"
sidebar_position: 4
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina DataExchange.Entry.List."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Listar unnar Data Exch.-færslur. Síðuskipting fylgir skip/take-reglum Foundation.

## Lýsigögn
- **Stefna:** Út á við (Outbound)
- **Efnisgerð (Content-Type):** text/json
- **Köllun:** kallaðu á tólið `call_message_type` með `type` = `DataExchange.Entry.List` og færibreyturnar hér að neðan sem `data`-hlutinn.
- **Beining:** Síaðu eftir skilgreiningarkóða og stofndagsbili. Flettu með `skip` og `take`.

## Færibreytur

| Færibreyta | Nauðsynleg | Gerð | Lýsing |
|---|---|---|---|
| `dataExchDefCode` | Nei | string | Aðeins færslur fyrir þennan Data Exch. Def-kóða. |
| `dateFrom` | Nei | string | Upphaf, að meðtöldu; staðaróháð dagsetning `YYYY-MM-DD` eða dagsetning og tími. |
| `dateTo` | Nei | string | Lok, að meðtöldu. Dagsetning án tíma nær yfir allan daginn. |
| `skip` | Nei | integer | Fjöldi færslna sem á að sleppa. Sjálfgefið er 0. Neikvætt gildi veldur villu. |
| `take` | Nei | integer | Síðustærð. Sjálfgefið 100 ef sleppt eða 0. Neikvætt gildi veldur villu. Takmarkað við 1000. |

## Dæmi um beiðni
```json
{ "dataExchDefCode": "SEPA CAMT", "take": 20 }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

Reitir í `data`:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `count` | integer | Færslur sem passa við síuna, áður en skipt er í síður. |
| `skip` | integer | Skip sem var notað. |
| `take` | integer | Take sem var notað. |
| `entries` | array | `entryNo`, `dataExchDefCode`, `dataExchLineDefCode`, `fileName`, `createdAt`, `hasFileContent`, `fieldCount`, `incomingEntryNo` (0 ef ekki tengt), `relatedRecord`. |

Mistókst (umgjörðin pakkar sjálfkrafa inn öllum villum sem koma upp):
```json
{ "status": "Error", "error": "<message>" }
```
Athugaðu alltaf `status` áður en þú lest `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Neikvæð skip eða take | Sendu skip >= 0 og take >= 0. |

## Athugasemdir
## Takmörk síðuskiptingar
`skip` er sjálfgefið 0 og neikvæðum gildum er hafnað. `take` er sjálfgefið 100 ef því er sleppt eða það er núll, neikvæðum gildum er hafnað og það er takmarkað við hámarkið 1000.


## Næstu skref
- Til að lesa reiti fyrir eina færslu → kallaðu á `DataExchange.Entry.Get` (sendu `entryNo` sem var skilað).

---
Yfirlit yfir gagnaskipti: sæktu hjálpina fyrir `Help.DataExchange.Get`.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

