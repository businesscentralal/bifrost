---
id: warehouse-receipt-post
title: "Warehouse.Receipt.Post"
sidebar_label: "Warehouse.Receipt.Post"
sidebar_position: 6
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Receipt.Post."
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

Bókar fyrirliggjandi vöruhúsamóttöku með því að keyra `Whse.-Post Receipt` í BC (kóðaeining 5760). Býr til `Posted Whse. Receipt` ásamt bókuðu upprunaskjölunum (Posted Purchase Receipt, Posted Return Shipment eða Posted Transfer Receipt) og eykur birgðir.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Forsendur

- `Warehouse Receipt Header` verður að vera til (yfirleitt stofnaður með `Warehouse.Receipt.Create`).
- Að minnsta kosti ein lína í vöruhúsamóttökunni með `Qty. to Receive > 0`.
- Í birgðageymslum með stýrðum frágangi og tínslu verður `Bin Code` línunnar að vera sett fyrir bókun.
- Ólíkt vöruhúsaafhendingu er **ekkert `invoice`-flagg** — móttökur taka aðeins á móti. Reikningsfærsla lánardrottins á innkaupapöntuninni er sérstök aðgerð síðar.

## Röð auðkenna

1. Reiturinn `subject` (GUID → `SystemId`, texti → `No.`).
2. `systemId` / `recordSystemId` / `id` í JSON-beiðninni (GUID).
3. `receiptNo` / `no` í JSON-beiðninni (texti).

## Endurtekning og öryggi

- **Ekki** óháð endurtekningu á stigi skilaboðategundarinnar: ef sama móttaka er bókuð aftur kemur villa frá BC (línur þegar bókaðar / móttakan ekki lengur til).
- Bókunin notar `Warehouse Receipt Header` upp — eftir árangur er honum eytt og svarið ber `postedWhseReceiptNo` til að fylgja málinu eftir.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `subject` | text/guid | Eitt auðkenni áskilið | Bifröst-viðfang. GUID → leit eftir SystemId; texti → leit eftir `No.`. |
| `systemId` / `recordSystemId` / `id` | guid | (valkostur) | Í JSON-beiðninni. |
| `receiptNo` / `no` | code[20] | (valkostur) | Í JSON-beiðninni. |

### Dæmi um beiðni
```json
{ "receiptNo": "WR001001" }
```

## Snið svars

Staðfest í keyrslu (móttaka innkaupapöntunar í GULUR, 5 × vara 1896-S):

```json
{
  "status": "Success",
  "receiptNo": "RE000010",
  "postedWhseReceiptNo": "R_000005",
  "postedWhseReceiptSystemId": "AC903C2D-DF61-F111-B7A5-FCCA66B996D7",
  "postedDocuments": [
    {
      "postedSourceDocument": "Posted Receipt",
      "postedSourceNo": "107242",
      "sourceDocument": "Purchase Order",
      "sourceNo": "106031"
    }
  ]
}
```

Snið númeranna er aðeins dæmi — `postedWhseReceiptNo` kemur úr númeraröðinni `Whse. Receipt Nos.` birgðageymslunnar og `postedSourceNo` úr bókunarnúmeraröð upprunaskjalsins (t.d. `P-RCPT` fyrir innkaupapöntun). `postedSourceDocument` er eitt af gildunum `Posted Receipt`, `Posted Return Shipment`, `Posted Transfer Receipt`.

## Bókunarhlið

Krefst heimildasafnsins `BIFROST WhsePost ori` (alltaf). Ekkert fjárhagshlið — móttökur skrifa ekki í fjárhagsbókunarskrá.

## Reitatakmarkanir

Engar í þessari skilaboðategund. Venjuleg sannprófun BC gildir á línum vöruhúsamóttökunnar.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Receipt Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, receiptNo, no.` (`MissingParameter`) | Ekkert auðkenni í `subject` eða í JSON-beiðninni. |
| `Warehouse Receipt Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Auðkenni var gefið en passar ekki við neina færslu; `parameter` og `received` tilgreina það. Öll auðkenni sem eru gefin eru prófuð. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Tvö auðkenni voru gefin sem vísa á ólíkar færslur. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | SystemId eða færslunúmer sem ekki er hægt að lesa. |
| `Warehouse Receipt {No} has no lines to post.` | Allar línur hafa Qty. to Receive = 0 eða hausinn hefur engar línur. |
| `The Warehouse Receipt Header does not exist. ...` | Sama móttaka bókuð aftur. Eftir heppnaða bókun er hausnum eytt. |
| Hvaða bókunarvilla BC sem er (t.d. `Bin Code must have a value`) | Kemur frá `Whse.-Post Receipt`. |

## Verkflæði frá upphafi til enda

Sjá `Warehouse.Receipt.Create` fyrir alla röðina: stofna → losa → taka á móti → bóka. Dæmigerð framhaldsskref eftir heppnaða bókun:

- Skoða `Posted Whse. Receipt` (tafla 7320) og `Posted Whse. Receipt Line` (tafla 7319) með `Data.Records.Get`.
- Skoða bókuðu innkaupamóttökuna / vöruskilaafhendinguna / millifærslumóttökuna sem varð til gegnum fylkið `postedDocuments`.
- Staðfesta birgðir með `Inventory.Item.GetInventory` eða `Data.Records.Get` á `Item Ledger Entry`.

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Create` — stofnar móttökuna sem er bókuð.
- `Warehouse.Receipt.Post.Preview` — hermir eftir bókuninni án þess að neitt sé vistað.
- `Warehouse.Shipment.Post` — hliðstæðan á útleið.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
