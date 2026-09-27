---
id: warehouse-receipt-post-preview
title: "Warehouse.Receipt.Post.Preview"
sidebar_label: "Warehouse.Receipt.Post.Preview"
sidebar_position: 7
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Receipt.Post.Preview."
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

Hermir eftir bókun vöruhúsamóttöku og skilar færslunum sem náðust (birgðafærslur og virðisfærslur — sjá töflurnar hér að neðan) án þess að neitt sé vistað. Bókunin er keyrð gegnum `Whse.-Post Receipt (Yes/No)` (kóðaeining 5761), bundin með `EventSubscriberInstance = Manual`, og `OnRunPreview`-áskrifandi hennar setur `Whse.-Post Receipt` (5760) í forskoðunarham. Allri aðgerðinni er rúllað til baka eftir söfnunina með Posting Preview Event Handler í BC.

Notaðu þetta til að sannreyna hvað `Warehouse.Receipt.Post` myndi skila — áætluð númer bókaðra skjala, áhrif á færslur, jafnvægi eða ójafnvægi — áður en bókað er.

**Stefna**: Inn á við (engin stöðubreyting — rúllað til baka)  **Efnisgerð**: `text/json`

## Töflur sem nást

Bókunarforskoðun BC safnar aðeins innsetningum í fastan lista af töflum. Við bókun vöruhúsamóttöku er safnað úr þessum töflum:

| Tafla (ID) | Tafla | Alltaf til staðar? |
|---|---|---|
| 32 | Item Ledger Entry | Já — ein færsla á hverja móttökulínu. |
| 5802 | Value Entry | Já — ein Direct Cost-færsla á hverja móttökulínu. |
| 17 | G/L Entry | Aðeins ef kostnaðarleiðrétting keyrir samhliða. Móttökur búa yfirleitt **engar** til. |

`Posted Whse. Receipt Header` (tafla 7320) er **EKKI** á forskoðunarlista BC — útfærslan sér því aldrei innsetninguna í forskoðun. Þess vegna er `predictedNumbers.postedWhseReceiptNo` alltaf sent en er **alltaf tómt** í svarinu. (Staðfest með MCP-prófun í keyrslu.)

## Forsendur

Þær sömu og fyrir `Warehouse.Receipt.Post`: `Warehouse Receipt Header` verður að vera til, hafa að minnsta kosti eina línu með `Qty. to Receive > 0`, og allar hólfakröfur stýrðs frágangs verða þegar að vera uppfylltar.

## Röð auðkenna

1. Reiturinn `subject` (GUID → `SystemId`, texti → `No.`).
2. `systemId` / `recordSystemId` / `id` í JSON-beiðninni (GUID).
3. `receiptNo` / `no` í JSON-beiðninni (texti).

## Endurtekning og öryggi

- **Les eingöngu**: Gen. Jnl.-Post Preview í BC rúllar aðgerðinni alltaf til baka eftir að færslunum hefur verið safnað. Ekkert er vistað.
- Krefst heimildasafnsins `BIFROST WhsePost ori` þótt ekkert sé vistað (sjá Bókunarhlið hér fyrir neðan).
- Númeraraðir færast fram og svo til baka — áætluðu númer bókaðra skjala eru þau sem BC hefði úthlutað, en þeim er skilað aftur í númeraröðina.

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `subject` | text/guid | Eitt auðkenni áskilið | Bifröst-viðfang. |
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
  "rollback": true,
  "summary": "Warehouse Receipt RE000010 at GULUR preview produced 2 entries (balanced).",
  "receiptNo": "RE000010",
  "locationCode": "GULUR",
  "sourceDocuments": [
    { "sourceDocument": "Purchase Order", "sourceNo": "106031" }
  ],
  "lcyCode": "ISK",
  "predictedNumbers": {
    "postedWhseReceiptNo": "",
    "postedPurchaseReceiptNo": "***"
  },
  "totals": {
    "balanced": true,
    "totalDebitLCY": 0.0,
    "totalCreditLCY": 0.0
  },
  "preview": [
    { "tableId": 32, "tableName": "Item Ledger Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] },
    { "tableId": 5802, "tableName": "Value Entry", "entries": ["...rows with DocumentNo_ redacted to ***..."] }
  ]
}
```

### Hulin númer (`***`)

Bókunarforskoðun BC hylur úthlutuð skjalanúmer með `***` til að sýna að þeim var rúllað til baka en ekki vistuð. Þetta á við um:

- `predictedNumbers.postedPurchaseReceiptNo` / `postedReturnReceiptNo` / `postedTransferReceiptNo` — alltaf `***` í bókunarforskoðun.
- `preview[].entries[].fields.DocumentNo_` í línum úr Item Ledger Entry / Value Entry — líka `***`.

Líttu á `***` sem „kerfið hefði úthlutað númeri úr viðeigandi númeraröð“. Notaðu `Warehouse.Receipt.Post` til að fá raunverulega númerið.

### Áætluð númer — hvaða lykill birtist

| Uppruni á móttökunni | Lykill í `predictedNumbers` | Gildi í forskoðun |
|---|---|---|
| Innkaupapöntun | `postedPurchaseReceiptNo` | `***` (hulið af BC) |
| Vöruskilapöntun | `postedReturnReceiptNo` | `***` (hulið af BC) |
| Millifærslupöntun á innleið | `postedTransferReceiptNo` | `***` (hulið af BC) |

`postedWhseReceiptNo` er alltaf sent en er **alltaf tómt** í forskoðun vegna þess að bókunarforskoðun BC safnar ekki innsetningum í `Posted Whse. Receipt Header` (tafla 7320). Keyrðu `Warehouse.Receipt.Post` til að fá raunverulega númerið.

### Samtölur — jafnvægisflaggið

Vöruhúsamóttökur hafa yfirleitt **engin bein áhrif á fjárhag** (birgðir eru færðar á kostnaðarverði, ekki við bókun) — `balanced = true` með `totalDebitLCY = totalCreditLCY = 0`. Ef móttakan setur af stað sjálfvirka kostnaðarleiðréttingu birtast fjárhagsfærslurnar sem náðust í `preview` og samtölurnar endurspegla þær.

## Bókunarhlið

Krefst heimildasafnsins `BIFROST WhsePost ori`, eins og `Warehouse.Receipt.Post`. Án þess er skilaboðategundin óvirk fyrir notandann (`isEnabled = false` í `Help.MessageTypes.Get`) og ekki hægt að kalla á hana.

## Reitatakmarkanir

Engar.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Receipt Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, receiptNo, no.` (`MissingParameter`) | Ekkert auðkenni í `subject` eða í JSON-beiðninni. |
| `Warehouse Receipt Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Auðkenni var gefið en passar ekki við neina færslu; `parameter` og `received` tilgreina það. Öll auðkenni sem eru gefin eru prófuð. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Tvö auðkenni voru gefin sem vísa á ólíkar færslur. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | SystemId eða færslunúmer sem ekki er hægt að lesa. |
| `Warehouse Receipt {No} has no lines to post.` | Engar línur, eða Qty. to Receive = 0 á öllum línum. |
| `Posting preview failed and no entries were captured ...` | `Whse.-Post Receipt` kastaði villu áður en færslum var safnað (t.d. vantar Bin Code, vara lokuð). Upphaflegi villutexti BC fylgir með. |

## Tengdar skilaboðategundir

- `Warehouse.Receipt.Post` — bókar í raun þegar forskoðunin lítur rétt út.
- `Warehouse.Receipt.Create` — stofnar móttökuna áður en hún er forskoðuð.
- `Inventory.TransferOrder.PreviewPost` — samsvarandi forskoðun fyrir millifærslupantanir.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
