---
id: help-dataexchange-get
title: "Help.DataExchange.Get"
sidebar_label: "Help.DataExchange.Get"
sidebar_position: 6
description: "Beiðni- og svarsamningur fyrir Bifröst-skilaboðategundina Help.DataExchange.Get."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs-from-source.mjs`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Lesaðgangur að gagnaskiptaskilgreiningum Business Central, gerðum innkominna fylgiskjala og unnum færslum. Engu er hlaðið upp og ekkert er skrifað.

Skilaboðategundirnar eru Outbound og skiptast á JSON. Kallaðu á tegund með `call_message_type`, `type` = heiti skilaboðategundarinnar og `data` = færibreytur hennar.

## Ferli

Skilgreining (`Data Exch. Def`) lýsir skrá: gerð hennar (innflutningur eða útflutningur), skráargerð, les-/ritkóðaeiningu eða XMLport, línuskilgreiningum, dálkaskilgreiningum og reitavörpunum á marktöflu.

Tilgangur innkomins fylgiskjals er `Data Exchange Type`: kóði sem vísar á eina skilgreiningu. Endurgjafar-, staðfestingar- og gagnavinnslukóðaeiningarnar eru skráðar á þeirri skilgreiningu og þeim er skilað með gerðinni.

Unnin skrá er `Data Exch.`-færsla (endurskoðunarfærslan: skráarheiti, skilgreining, valfrjálst skráarinnihald) ásamt `Data Exch. Field`-færslum (eitt þáttað gildi fyrir hverja línu og dálk).

## Áfangar

| Áfangi | Hvað hann bætir við | Staða í þessari útgáfu |
|---|---|---|
| 0 Könnun | `Help.DataExchange.Get`, `DataExchange.Definition.List`/`Get`, `DataExchange.Type.List`, `DataExchange.Entry.List`/`Get` | Tiltækt |
| 2 Innkomin fylgiskjöl | upphleðsla í innkomið fylgiskjal með Data Exchange Type | Ekki í þessari útgáfu |
| 1 Almennur innflutningur | `DataExchange.Import.Run`, `Storage.Upload.CommitToDataExchange`, vinnsla og eyðing | Ekki í þessari útgáfu |
| 3 Útflutningur | `DataExchange.Export.Run` | Ekki í þessari útgáfu |
| 4 Umsjón skilgreininga | inn- og útflutningur skilgreiningar sem XML | Ekki í þessari útgáfu |

## Ákvörðunartré

- Þarft að sjá hvaða skilgreiningar eru til áður en nokkru er hlaðið upp → `DataExchange.Definition.List`.
- Þarft dálkana og reitavarpanirnar sem skilgreining gerir ráð fyrir → `DataExchange.Definition.Get` með þeim `code`.
- Þarft gerðir innkominna fylgiskjala og hvaða skilgreiningu hver þeirra notar → `DataExchange.Type.List`. Tómt fyrirtæki skilar `count` 0.
- Þarft unnar skrár → `DataExchange.Entry.List`, síðan `DataExchange.Entry.Get` fyrir eitt `entryNo`.
- Þarft að skrifa `Data Exch.`-færslu → notaðu ekki `Data.Records.Set`. Sú skrift er lokuð. Sérhæfðu skrifararnir (`DataExchange.Import.Run` / `Storage.Upload.CommitToDataExchange`) koma í síðari áfanga.

## Keðjun

1. `DataExchange.Definition.List` → lestu `code` (og `usedByDataExchangeTypes`).
2. `DataExchange.Definition.Get` með þeim `code` → lestu `lineDefs`, `columnDefs` og `mappings` áður en skrá er búin til.
3. `DataExchange.Type.List` → lestu `code` og `dataExchDefCode` þegar kallandi velur gerð innkomins fylgiskjals.
4. `DataExchange.Entry.List` → lestu `entryNo`.
5. `DataExchange.Entry.Get` með því `entryNo` → lestu `fields`. Sendu `includeFileContent` true aðeins þegar skráin er í mesta lagi 1 MB.

## Svarumslag

- Tókst — `{ "status": "Success", "data": { ... } }`
- Villa — `{ "status": "Error", "error": "<message>" }`

Listar skila `count` og nefndu fylki (`definitions`, `types` eða `entries`). Færslulistinn og reitasíður færslu skila einnig `skip` og `take`.

