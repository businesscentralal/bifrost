---
id: data-totals-get
title: "Data.Totals.Get"
sidebar_label: "Data.Totals.Get"
sidebar_position: 35
---

Outbound  Content-Type: `text/json`

Leggur saman eitt eða fleiri tugabrotarsvæði yfir allar samsvarandi færslur í tiltekinni Business Central töflu með því að nota innbyggða `CalcSums` fallið. Engar færslur eru farnar yfir — samlagning fer fram innfæddur í BC þjóninum. Skilar einu JSON niðurstöðuhluti með einu lykil/gildi pari fyrir hvert óskað svæði.

## Beiðnibreytur

| Breyta | Tegund | Nauðsynleg | Lýsing |
| --- | --- | --- | --- |
| `tableName` | strengur | Ein af töfluauðkenningum | Töfluheiti, t.d. `"Item Ledger Entry"` |
| `tableNumber` / `tableNo` / `tableId` | heiltala | Ein af töfluauðkenningum | Töflunúmer, t.d. `32` |
| `fieldNumbers` | fylki af heiltölum | Skylda | Svæðisnúmer til að leggja saman. Öll verða að vera Decimal-svæði og skilgreind sem SumIndexFields (SIFT-lyklar) í töflunni. Ef þetta vantar eða er tómt fylki, kemur villa. |
| `tableView` | strengur | Valkvæmt | BC AL töflusíustrengur í SetView-sniði, t.d. `"WHERE(Entry Type=CONST(Purchase))"`. Ef engar færslur uppfylla síuna skilar `CalcSums` 0 fyrir hvert svæði — þetta er ekki villa. |

**Athugasemd:** `skip`, `take`, `startDateTime` og `endDateTime` eru **ekki** studd.

## Svarsnið

```
{
  "status": "Success",
  "result": {
    "Quantity": 12500.00,
    "InvoicedQuantity": 11200.50
  }
}
```

## Nafngiftarregla reitanna

JSON-lyklar í `result`\-hlutanum eru leiddir af BC-svæðaheitum með sömu stripping-reglu og `Data.Records.Get`:

1.  Stafir `%`, `.`, `"`, `\`, `/`, `'` eru skipt út fyrir `_`
2.  Allir aðrir stafir utan `[a-zA-Z0-9_]` (t.d. bil) eru fjarlægðir

| BC-svæðaheiti | JSON-lykill |
| --- | --- |
| `Quantity` | `Quantity` |
| `Invoiced Quantity` | `InvoicedQuantity` |
| `Cost Amount (Actual)` | `CostAmountActual` |
| `Sales (LCY)` | `SalesLCY` |

## CalcSums-skilyrði

`Data.Totals.Get` notar BC-fallið `CalcSums`, sem krefst þess að hvert óskað svæði sé:

-   **Tegund Decimal** — Integer og aðrar tölutegunder eru ekki studdar (skilar villu)
-   **Skilgreint sem SumIndexField** á einum af SIFT-lyklunum töflunnar — svæði sem eru ekki SIFT valda BC-keyrsluvillu

Notaðu `Help.Fields.Get` skilaboðagerðina til að skoða svæðalýsigögn og staðfesta hvort svæði sé SumIndexField áður en þessi skilaboðagerð er kölluð.

## Villumeðferð

| Skilyrði | Svar |
| --- | --- |
| `fieldNumbers` vantar eða tómt fylki | `{"status":"Error","error":"fieldNumbers is required and must contain at least one field number."}` |
| Tafla ekki auðþekkjanleg | Villa send frá töflumat |
| Lesforréttur neitaður | `{"status":"Error","error":"Read permission denied for table {n}."}` |
| Svæðisnúmer er ekki til í töflu | `{"status":"Error","error":"Field {n} does not exist in table {t}."}` |
| Svæði er ekki af gerðinni Decimal | `{"status":"Error","error":"Field {n} ({name}) in table {t} is not of type Decimal."}` |
| Svæði er lestakmarkað | `{"status":"Error","error":"Read access to field {n} ({name}) in table {t} is restricted."}` |
| Svæði er ekki SumIndexField | BC-keyrslovilla berst sem verkefnisbilun |
| Engar færslur uppfylla `tableView` | Skilar 0 fyrir hvert svæði — ekki villa |

## Notkunardæmi

### Beiðni — Leggja saman Magn og Reikningsfært magn fyrir innkaupafærslur

```
{
  "specversion": "1.0",
  "type": "Data.Totals.Get",
  "source": "my-integration",
  "datacontenttype": "application/json",
  "data": {
    "tableName": "Item Ledger Entry",
    "fieldNumbers": [12, 14],
    "tableView": "WHERE(Entry Type=CONST(Purchase))"
  }
}
```

### Svar

```
{
  "status": "Success",
  "result": {
    "Quantity": 8500.00,
    "InvoicedQuantity": 7200.00
  }
}
```

## Tengdar skilaboðagerðir

-   **Data.Records.Get** — full færsluupplýsingar sem JSON með síðuskiptingu; sama töfluauðkenning og `tableView`\-breytur
-   **Data.RecordIds.Get** — skilar aðeins færsluauðkennum og breytingatímamerkjum
-   **Help.Fields.Get** — skilar svæðalýsigögnum þar á meðal hvort svæði sé SumIndexField
