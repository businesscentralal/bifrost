---
id: help-permissions-get
title: "Help.Permissions.Get"
sidebar_label: "Help.Permissions.Get"
sidebar_position: 68
description: "Beiðni- og svarsamningur fyrir Help.Permissions.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the current user's **Business Central heimild** fyrir a specified tafla. The flags reflect `RecordRef.ReadPermission()` og `RecordRef.WritePermission()`, which resolve standard BC heimild Stillir (such as `D365 BASIC`, `D365 READ`, `D365 BUS FULL ACCESS`) plus hvaða `InherentPermissions` declared on AL objects.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Identifier Resolution (tafla áskilið)
1. Request JSON: `tableName`, `tableNumber`, `tableNo`, `tableId` (in that order)
2. Bifrost `subject`
Villur ef no tafla getur be resolved.

## Beiðnibreytur
| Reitur | Gerð | áskilið | Lýsing |
|-------|------|----------|-------------|
| tableName / tableNumber / tableNo / tableId | Text eða heiltala | Yes (via JSON eða subject) | Target tafla |

## Dæmi um beiðni
```json
{ "type": "Help.Permissions.Get", "subject": "Customer" }
```

## Uppbygging svars
```json
{
  "status": "Success",
  "permissions": { "read": true, "write": false }
}
```

## Result Fields
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| permissions.read | sanngildi | True þegar BC grants lesa heimild on the tafla til the current user (úr heimild Stillir og inherent heimildir). |
| permissions.write | sanngildi | True þegar BC grants insert/modify/delete heimild on the tafla til the current user. |

## heimild Layers
Data access through the Bifrost API er gated með **two independent layers**. A request aðeins succeeds þegar both layers allow it.

1. **BC heimild** (this skilaboðategund)
   - Uppruni: BC heimild Stillir assigned til the user, plus `InherentPermissions` on AL objects.
   - Scope: whole tafla (lesa / insert / modify / delete).
   - þegar denied: `Data.Records.*` Skilar a heimild Villa úr the BC platform.
2. **Bifrost takmarkanir** (configured per user in `Bifrost Field Access`)
   - Uppruni: the `Bifrost Field Access` tafla maintained með Bifrost administrators.
   - Scope: per tafla **og** per Reitur, með takmörkun types `Read`, `Write`, `Both`, eða `Bypass`.
   - þegar denied: `Data.Records.Get` silently drops the Reitur úr Svarið; `Data.Records.Set` rejects the skrifa með an Villa; Create message types (`Sales.Document.Create`, `Purchase.Document.Create`, `Inventory.AssemblyOrder.Create`, `Inventory.TransferOrder.Create`, `Finance.BankReconciliation.Create`) refuse til create the færsla þegar the principal Reitur er skrifa-restricted.

### Effective access matrix
| BC `read` | Bifrost lesa takmörkun | Effective lesa |
|-----------|-------------------------------|----------------|
| true | none | Reitur er returned |
| true | `Read` eða `Both` | Reitur er dropped úr response (silently) |
| false | hvaða | Whole request fails með BC heimild Villa |

| BC `write` | Bifrost skrifa takmörkun | Effective skrifa |
|------------|--------------------------------|-----------------|
| true | none | Gildi er written |
| true | `Write` eða `Both` | skrifa er rejected með an Villa mentioning the Reitur og Gildi |
| false | hvaða | Whole request fails með BC heimild Villa |

## How til Resolve the Full Picture
til know whether the current user getur actually lesa eða skrifa a given tafla eða Reitur, query all three sources og combine them:

1. **BC heimild on the tafla** — call `Help.Permissions.Get` (this skilaboðategund). Les `permissions.read` og `permissions.write`.
2. **Bifrost takmörkun on the tafla** — call `Help.Tables.Get` með the tafla identifier. hver tafla in the result includes `readRestricted` og `writeRestricted` tafla-level flags. þegar `readRestricted=true` the tafla er blocked úr `Data.Records.Get` entirely; þegar `writeRestricted=true` the tafla er blocked úr `Data.Records.Set` entirely.
3. **Bifrost takmörkun on individual fields** — call `Help.Fields.Get` með the tafla identifier. hver Reitur in the result includes `readRestricted` og `writeRestricted` flags resolved against the **current user**. nota these til decide which fields til request in `Data.Records.Get` og which til send in `Data.Records.Set`.

### Combine the layers
- `canReadField = Help.Permissions.Get.permissions.read AND NOT Help.Tables.Get.readRestricted AND NOT Help.Fields.Get.readRestricted`
- `canWriteField = Help.Permissions.Get.permissions.write AND NOT Help.Tables.Get.writeRestricted AND NOT Help.Fields.Get.writeRestricted`

### Resolution example
```text
// 1) BC permission on the Customer table
{ "type": "Help.Permissions.Get", "subject": "Customer" }
// → { "permissions": { "read": true, "write": true } }

// 2) Bifrost table-level restriction
{ "type": "Help.Tables.Get", "subject": "Customer" }
// → { "result": [ { "id": 18, "name": "Customer", "readRestricted": false, "writeRestricted": false } ] }

// 3) Bifrost field-level restrictions for the current user
{ "type": "Help.Fields.Get", "subject": "Customer", "data": { "fieldNumbers": [1, 2, 102] } }
// → result[*].readRestricted / writeRestricted flags
```

## Caveats
- This skilaboðategund Athugar **aðeins** the BC heimild layer. Even þegar `permissions.read=true` og `permissions.write=true`, a Bifrost takmörkun getur still block individual fields eða the whole tafla.
- Bifrost takmarkanir eru resolved against `UserSecurityId()` of the user that owns the bifrost message; they may differ between users in the sama BC company.
- `Bifrost Field Access` einnig styður a `Bypass` takmörkun Gerð that releases ChangeLog skrifa-guard Athugar; it does ekki affect BC heimildir.

## Tengdar skilaboðategundir
- `Help.Tables.Get` — tafla-level Bifrost takmörkun flags
- `Help.Fields.Get` — per-Reitur Bifrost takmörkun flags fyrir the current user
- `Data.Records.Get` — consumer of the lesa layer
- `Data.Records.Set` — consumer of the skrifa layer

