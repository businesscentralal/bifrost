---
id: help-next-line-no-get
title: "Help.NextLineNo.Get"
sidebar_label: "Help.NextLineNo.Get"
sidebar_position: 36
---

Á leið út  Efnisgerð: `text/json`

Skilar næsta tiltæka línunúmeri fyrir hvaða töflu sem er þar sem síðasta aðallyklasviðið er af gerðinni Integer. Nær yfir töflur eins og sölulínur, innkaupalínur, fjárhagsbókarlínur eða hvaða töflu sem er þar sem síðasta aðallyklasviðið er heiltala sem hækkar sjálfkrafa. Svarið inniheldur fullbúið `primaryKey` hlut sem hægt er að nota beint í `Data.Records.Set`.

## Beiðnibreytur

| Breyta | Nauðsynleg | Tegund | Lýsing |
| --- | --- | --- | --- |
| `tableName` / `tableNumber` / `tableNo` / `tableId` | Já | Texti / Heiltala | Marktafla (staðlað töfluauðkenni) |
| `primaryKey` | Já\* | Hlutur | Gildi foreldra aðallyklasviða (öll nema síðasta heiltölusviðið) |
| `id` | Já\* | GUID | SystemId á fyrirliggjandi færslu í töflunni |
| `increment` | Nei | Heiltala | Gildi sem bætt er við síðasta línunúmer. Sjálfgefið: 10000. Verður að vera > 0. |

\* Nákvæmlega eitt af `primaryKey` eða `id` verður að vera til staðar. Ef bæði eru til staðar hefur `id` forgang.

## Svarssnið

```
{
  "status": "Success",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001",
    "LineNo": 40000
  }
}
```

### Svarsreitir

| Reitur | Tegund | Lýsing |
| --- | --- | --- |
| `status` | Strengur | `"Success"` eða `"Error"` |
| `primaryKey` | Hlutur | Fullbúinn aðallykill með öllum foreldrasviðum og síðasta sviðinu stillt á næsta gildi |

## Villumerki

| Skilyrði | Villuskilaboð |
| --- | --- |
| Tafla fannst ekki | Table `{tableName}` not found. |
| Síðasta aðallyklasviðið er ekki heiltala | The last primary key field of table '`{tableName}`' (`{fieldName}`) is not an Integer field. |
| Of fá aðallyklasviðir | Table '`{tableName}`' must have at least two primary key fields. |
| Inntaksskilaboð vantar | Either 'primaryKey' or 'id' must be provided. |
| Gildi vantar í aðallyklasviði | Missing value for primary key field '`{fieldName}`'. |
| Færsla fannst ekki | Record with SystemId '`{id}`' not found in table '`{tableName}`'. |
| Ógilt hækkun | Increment must be greater than zero. |
| Engin lesheimild | You do not have read permission on table '`{tableName}`'. |

## Dæmi um notkun

### Beiðni (primaryKey)

```
{
  "tableName": "Sales Line",
  "primaryKey": {
    "DocumentType": "Order",
    "DocumentNo": "S-ORD-001"
  },
  "increment": 10000
}
```

### Beiðni (SystemId)

```
{
  "tableName": "Sales Line",
  "id": "a0e2b3c4-d5e6-7890-abcd-ef1234567890"
}
```

## Tengdar skilaboðagerðir

-   **Data.Records.Get** — Sækja full gögn færslu úr hvaða töflu sem er
-   **Data.Records.Set** — Setja inn eða uppfæra færslur (nota primaryKey beint)
-   **Help.Tables.Get** — Uppgötva tiltækar töflur
-   **Help.Fields.Get** — Uppgötva svið lýsigögn fyrir töflu
