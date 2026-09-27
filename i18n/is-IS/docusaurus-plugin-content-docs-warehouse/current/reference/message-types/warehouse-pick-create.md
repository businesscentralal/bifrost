---
id: warehouse-pick-create
title: "Warehouse.Pick.Create"
sidebar_label: "Warehouse.Pick.Create"
sidebar_position: 1
description: "Beiðni- og svarsamningur Bifröst-skilaboðategundarinnar Warehouse.Pick.Create."
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

Stofnar vöruhúsatínslu úr fyrirliggjandi vöruhúsaafhendingu. Keyrir BC-skýrslu 7318 `Whse.-Shipment - Create Pick` (sömu aðgerð og *Create Pick* á síðu vöruhúsaafhendingar). Skilar `Warehouse Activity Header` (`Type = Pick`) sem varð til, ásamt samtölum línanna.

**Stefna**: Inn á við (breytir stöðu)  **Efnisgerð**: `text/json`

## Forsendur

- Vöruhúsaafhendingin verður að vera til og hafa að minnsta kosti eina línu.
- `Location Code` afhendingarinnar verður að vísa á birgðageymslu með `Require Pick = true` (yfirleitt birgðageymsla með stýrðum frágangi og tínslu / WMS). Í birgðageymslum með `Require Shipment = true, Require Pick = false` þarf enga tínslu — kallaðu beint á `Warehouse.Shipment.Post`.
- Nægar birgðir verða að vera í upprunahólfunum svo að BC hafi eitthvað að tína.

## Auðkenning vöruhúsaafhendingarinnar

Tilgreindu afhendinguna með Bifröst-viðfanginu (GUID = SystemId, eða texti = `No.`) eða með einum af þessum lyklum í JSON-beiðninni:

| Lykill | Merking |
|---|---|
| `systemId` / `recordSystemId` / `id` | SystemId á `Warehouse Shipment Header`. |
| `whseShipmentNo` / `shipmentNo` / `no` | `No.` á `Warehouse Shipment Header`. |

## Færibreytur beiðni

| Færibreyta | Gerð | Áskilin | Athugasemdir |
|---|---|---|---|
| `whseShipmentNo` | code[20] | Eitt auðkenni áskilið | Eða notaðu `shipmentNo` / `no` / `systemId` / viðfang. |
| `assignedUserId` | code[50] | Nei | Sett á vöruhúsatínsluna sem verður til. Háð skrifatakmörkun á `Warehouse Activity Header."Assigned User ID"`. |
| `sortingMethod` | string | Nei | Heiti úr BC-upptalningunni `Whse. Activity Sorting Method`, óháð há- og lágstöfum — nú: `None`, `Item`, `Document`, `Shelf or Bin`, `Due Date`, `Ship-To`, `Bin Ranking`, `Action Type` (BC 27). Villusvarið telur upp nákvæmlega þau gildi sem gilda í þinni útgáfu. Háð skrifatakmörkun á `Warehouse Activity Header."Sorting Method"`. |
| `setBreakbulkFilter` | boolean | Nei (sjálfgefið false) | Ekki stutt í þessari útgáfu API-sins. Ef `true` er sent kemur villa. |
| `doNotFillQtyToHandle` | boolean | Nei (sjálfgefið false) | Ekki stutt í þessari útgáfu API-sins. Ef `true` er sent kemur villa. |

### Dæmi um beiðni
```json
{
  "whseShipmentNo": "WS001001",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking"
}
```

## Snið svars

```json
{
  "status": "Success",
  "whseShipmentNo": "WS001001",
  "pickNo": "WPK000123",
  "pickSystemId": "00000000-0000-0000-0000-000000000000",
  "locationCode": "WHITE",
  "assignedUserId": "ADMIN",
  "sortingMethod": "Bin Ranking",
  "totalPickLines": 4,
  "totalQtyToHandle": 12,
  "message": "Warehouse Pick WPK000123 created from Shipment WS001001 with 4 lines."
}
```

Ef `sortingMethod` er ekki tilgreint skilar svarið `"sortingMethod": "None"` (auður skjátexti BC-upptalningarinnar er staðlaður í `None`).

## Bókunarhlið

Ekkert — stofnun tínslu skráir enga birgðahreyfingu. Fylgitegundin `Warehouse.Pick.Register` krefst heimildasafnsins `BIFROST WhsePost ori`.

## Reitatakmarkanir

Áður en gildi frá kallanda eru sett á vöruhúsatínsluna kallar útfærslan á `Bifrost Field Access.IsFieldWriteRestricted` fyrir:

- `Warehouse Activity Header."Assigned User ID"` (þegar `assignedUserId` er sent)
- `Warehouse Activity Header."Sorting Method"` (þegar `sortingMethod` er sent)

Takmarkaður reitur stöðvar beiðnina með villusvari — tínslan er samt til í gagnagrunninum; fjarlægðu hana eða keyrðu aftur án takmörkuðu færibreytunnar.

## Villur

| Villa | Orsök |
|---|---|
| `Warehouse Shipment Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, shipmentNo, no.` (`MissingParameter`) | Ekkert auðkenni í `subject` eða í JSON-beiðninni. |
| `Warehouse Shipment Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | Auðkenni var gefið en passar ekki við neina færslu; `parameter` og `received` tilgreina það. Öll auðkenni sem eru gefin eru prófuð. |
| `The identifiers in {a} and {b} point to different records.` (`ConflictingIdentifiers`) | Tvö auðkenni voru gefin sem vísa á ólíkar færslur. |
| `"{value}" is not a valid GUID` / `integer` `(from {key}).` (`InvalidParameterFormat`) | SystemId eða færslunúmer sem ekki er hægt að lesa. |
| `Warehouse Shipment {id} does not exist.` | Uppgefið SystemId eða No. fannst ekki. |
| `Warehouse Shipment {n} has no lines to pick.` | Afhendingarhausinn er til en hefur engar línur. |
| `sortingMethod '{x}' is not valid. Expected one of: ...` | Gildið er ekki í `Whse. Activity Sorting Method.Names()`. |
| `Field {n} is restricted for write on table {t}.` | `Bifrost Field Access` lokar á `assignedUserId` eða `sortingMethod`. |
| `... = true is not supported by this API version.` | `setBreakbulkFilter` eða `doNotFillQtyToHandle` sent sem `true`. |
| `No Warehouse Pick was created for ...` | BC-skýrslan keyrði villulaust en bjó ekki til neinn aðgerðahaus (ekkert að tína, tínsla er þegar til, birgðageymslan krefst ekki tínslu). |
| `Nothing to handle.` / `There is nothing to create.` | Villa úr BC-skýrslunni, skilað sem Bifröst-villu — engar tiltækar birgðir í upprunahólfum. |

## Gildrur

- **Tínsla er þegar til**: BC-skýrsla 7318 býr þegjandi ekkert til ef opin vöruhúsatínsla fyrir afhendinguna er þegar til. Útfærslan skilar þá `No Warehouse Pick was created for ...`. Skoðaðu `Warehouse Activity Header` (`Type = Pick`, `Whse. Document No.` = afhendingin þín) áður en þú reynir aftur.
- **Birgðageymslur án tínslu**: Ef `Location Code` afhendingarinnar hefur `Require Pick = false` býr BC ekki til tínslu — þú færð sömu villu, `No Warehouse Pick was created for ...`. Kallaðu beint á `Warehouse.Shipment.Post`.
- **Ónógar birgðir**: BC-skýrsla 7318 býr aðeins til línur fyrir það sem er tiltækt í upprunahólfunum á þeirri stundu, að teknu tilliti til frátekninga á önnur skjöl. Afhending með `Quantity = 5` getur skilað tínslu með `totalQtyToHandle < 5`. Berðu `totalQtyToHandle` alltaf saman við samtölur afhendingarlínanna áður en þú lítur á kallið sem fullan árangur.
- **Birgðageymslur með skyldubundnum hólfum / WMS**: Birgðageymslur með `Bin Mandatory = true` eða `Directed Put-away and Pick = true` krefjast þess að upprunahólf séu uppsett og að gengið hafi verið frá vörunum. Án frágangs er tínslan tóm og þú færð `No Warehouse Pick was created for ...`.
- **Heimild fyrir `assignedUserId`**: Notandinn verður þegar að vera skráður sem `Warehouse Employee` í `Location Code` tínslunnar. Annars kemur BC-villan `The field Assigned User ID of table Warehouse Activity Header contains a value ({user}) that cannot be found in the related table (Warehouse Employee).`
- **Flokkunarlistinn breytist**: Upptalningin `Whse. Activity Sorting Method` er stækkanleg — Microsoft hefur bætt við gildum í gegnum tíðina. Listinn hér að ofan á við BC 27. Ef `sortingMethod` er hafnað inniheldur villusvarið gildandi lista fyrir þinn leigjanda.
- **`setBreakbulkFilter` / `doNotFillQtyToHandle`**: BC-skýrsla 7318 býður aðeins upp á þessa valkosti á beiðnisíðu sinni. Útfærslan hafnar `true` svo að stillingin tapist ekki þegjandi; slepptu lyklunum (eða sendu `false`) til að fá sjálfgefna hegðun BC.

## Leiðbeiningar fyrir gervigreindarfulltrúa

Þegar fulltrúi stýrir þessari skilaboðategund:

1. **Röð auðkenna er föst**: Viðfang > `systemId` > `recordSystemId` > `id` > `whseShipmentNo` > `shipmentNo` > `no`. Veldu nákvæmlega eitt; ekki blanda saman.
2. **Notaðu frekar SystemId en `No.`** í endurteknum köllum — númerið breytist þegar vöruhúsaafhending er bókuð eða henni eytt.
3. **Líttu á `status: "Success"` ásamt `totalPickLines == 0` sem mjúka villu** — tínslan er þá til en getur ekki hreyft birgðir; ekki halda áfram í `Warehouse.Pick.Register`.
4. **Endurtekning**: Þessi skilaboðategund er **ekki** óháð endurtekningu. Ef tímabundin villa verður eftir að BC-skýrsla 7318 keyrði en áður en svarið barst getur endurtekið kall búið til aðra tínslu. Flettu alltaf upp fyrirliggjandi tínslum fyrir afhendinguna áður en þú reynir aftur.
5. **Hlutatínsla**: Uppfærðu `Quantity` / `Qty. Outstanding` á línum vöruhúsaafhendingarinnar áður en kallað er á Pick.Create, eða breyttu `Qty. to Handle` á línum vöruhúsaaðgerðarinnar sem verða til með `Data.Records.Set` áður en kallað er á `Warehouse.Pick.Register`.

## Verkflæði

1. `Sales.Document.Release` (eða losun millifærslupöntunar)
2. `Warehouse.Shipment.Create`
3. **`Warehouse.Pick.Create`** — þessi skilaboðategund
4. `Warehouse.Pick.Register`
5. `Warehouse.Shipment.Post`

## Tengdar skilaboðategundir

- `Warehouse.Shipment.Create` — býr til inntakið.
- `Warehouse.Pick.Register` — skráir tínsluna eftir að starfsmaður vöruhússins hefur tínt vörurnar.
- `Warehouse.Shipment.Post` — lokaskrefið eftir að tínslan hefur verið skráð.
- `Data.Records.Get` — sækir hvaða reit sem er á `Warehouse Activity Header` / `Warehouse Activity Line` sem verður til.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).
