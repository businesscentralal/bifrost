---
id: warehouse-shipment-post
title: "Warehouse.Shipment.Post"
sidebar_label: "Warehouse.Shipment.Post"
sidebar_position: 9
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Shipment.Post."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::

:::note Krefst Bifröst Warehouse
Þessi skilaboðategund tilheyrir **Bifröst Warehouse**, sem keyrir ofan á **Bifröst Foundation**. Settu bæði upp;
án Bifröst Warehouse er tegundin ekki í skránni sem `Help.MessageTypes.Get` skilar.
:::


## Yfirlit

Bókar vöruhúsaafhendingu (afhending, valfrjálst með reikningi). Keyrir `Whse.-Post Shipment` í BC (kóðaeining 5763) og skilar bókuðu vöruhúsaafhendingunni (Posted Whse. Shipment) ásamt þeim bókuðu söluafhendingum sem urðu til.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Forsendur

Bókunin fer eftir birgðageymslu línanna í vöruhúsaafhendingunni:

- **`Require Pick = false`** — `Qty. to Ship` á línu vöruhúsaafhendingarinnar hefur þegar verið fyllt út af `Warehouse.Shipment.Create`. Bókaðu strax.
- **`Require Pick = true`** (þ.m.t. stýrður frágangur og tínsla) — lína vöruhúsaafhendingarinnar byrjar með `Qty. to Ship = 0`. Vöruhúsatínslu verður að stofna, tína og **skrá** með `Warehouse.Pick.Create` og síðan `Warehouse.Pick.Register` áður en þessi skilaboðategund tekst. Án skráðrar tínslu kemur BC-villan `There is nothing to post because the document does not contain a quantity or amount.`

BC hafnar því að `Qty. to Ship` sé skrifað handvirkt á `Warehouse Shipment Line` til að sleppa tínsluskrefinu (`Qty. to Ship must not be greater than 0 units ...`).

## Röð auðkenna

1. `subject` — GUID = `Warehouse Shipment Header.SystemId`, annars `Warehouse Shipment Header."No."`.
2. `systemId` / `recordSystemId` / `id` í JSON — `SystemId`.
3. `shipmentNo` / `no` í JSON — `Warehouse Shipment Header."No."`.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| auðkenni | ýmsar | **Já** | Sjá röð auðkenna. |
| `invoice` | boolean | Nei | Sjálfgefið `false` (aðeins afhending). Þegar `true` þarf `BIFROST GL Post ori` til viðbótar við `BIFROST WhsePost ori`. |

### Dæmi um beiðni
```json
{
  "shipmentNo": "WS001001",
  "invoice": true
}
```

## Snið svars

```json
{
  "status": "Success",
  "shipmentNo": "WS001001",
  "invoice": true,
  "postedWhseShipmentNo": "PWS001001",
  "postedWhseShipmentSystemId": "00000000-0000-0000-0000-000000000000",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Sales Shipment",
      "postedSourceNo": "PS-SHP103001",
      "sourceDocument": "Sales Order",
      "sourceNo": "SO-0001"
    }
  ]
}
```

`postedWhseShipmentNo` og `postedWhseShipmentSystemId` eru aðeins með þegar `Whse.-Post Shipment` bjó til `Posted Whse. Shipment Header`. `postedDocuments` er leitt af `Posted Whse. Shipment Line`, án tvítekninga eftir `(postedSourceDocument, postedSourceNo)`, og gildir fyrir allar upprunagerðir (sölupöntun → Posted Sales Shipment, millifærslupöntun → Posted Transfer Shipment o.s.frv.).

## Bókunarhlið

- **Alltaf**: heimildasafnið `BIFROST WhsePost ori`.
- **Auk þess þegar `invoice = true`**: heimildasafnið `BIFROST GL Post ori`.

## Reitatakmarkanir

Engin athugun á einstökum reitum — öll aðgerðin er varin með heimildasöfnunum hér að ofan.

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST WhsePost ori' permission set.` | Kallandann vantar bókunarheimild vöruhúss. |
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | `invoice = true` og kallandann vantar fjárhagsbókunarheimild. |
| `Warehouse Shipment Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, shipmentNo, no.` (`MissingParameter`) | Ekkert auðkenni í `subject` eða í JSON-beiðninni. |
| `Warehouse Shipment Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Auðkenni var gefið en passar ekki við neina færslu; `parameter` og `received` tilgreina það. Öll auðkenni sem eru gefin eru prófuð. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Tvö auðkenni voru gefin sem vísa á ólíkar færslur. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | SystemId eða færslunúmer sem ekki er hægt að lesa. |
| `Warehouse Shipment {n} has no lines to post.` | Hausinn er til en hefur engar línur. |
| `There is nothing to post because the document does not contain a quantity or amount.` | Allar línur vöruhúsaafhendingarinnar hafa `Qty. to Ship = 0`. Í birgðageymslu með `Require Pick = true` þýðir það að engin tínsla hefur enn verið skráð — sjá Forsendur. |
| Bókunarvillur BC | Koma frá `Whse.-Post Shipment` (t.d. opin tínsla er til, rakning vöru ófullgerð, bókunardagsetning læst). |

## Verkflæði frá upphafi til enda

Sjá hjálp `Warehouse.Shipment.Create` fyrir alla keðjuna: `Sales.Document.Create` → `Data.Records.Set` (Sales Line) → `Sales.Document.Release` → `Warehouse.Shipment.Create` → `Warehouse.Pick.Create` → `Warehouse.Pick.Register` (þegar `Require Pick = true`) → `Warehouse.Shipment.Post`.

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — stofnar vöruhúsaafhendinguna úr upprunaskjölum.
- `Warehouse.Pick.Create` — stofnar vöruhúsatínsluna þegar `Require Pick = true`.
- `Warehouse.Pick.Register` — skráir tínsluna svo að `Qty. to Ship` fyllist út.
- `Sales.Document.Post` — fyrir reikningshliðina í fjárhag án vöruhúsaskrefsins.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
