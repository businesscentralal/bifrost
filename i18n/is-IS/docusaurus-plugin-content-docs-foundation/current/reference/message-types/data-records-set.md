---
id: data-records-set
title: "Data.Records.Set"
sidebar_label: "Data.Records.Set"
sidebar_position: 19
description: "Beiðni- og svarsamningur fyrir Data.Records.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Inserts eða Uppfærir ein eða fleiri BC færslur using the Data Shipping standard JSON shape (`{id, primaryKey, fields}`). Svarið uses the **sama shape** as `Data.Records.Get`, so the output of one er gilt input til the other eftir editing `fields`.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Athugasemdir um endurtekningar og öryggi

- **ekki endurtekningarþolið on insert** unless the tafla has a unique primary key in `primaryKey` — re-sending the sama insert against an auto-númer tafla Býr til a ný færsla.
- The whole batch runs inside an isolated `Codeunit.Run` (`Data Records Set Process`, 65328). On hvaða Mistókst, the entire batch rolls back og Svarið contains `error` og `callstack`.
- bók-færsla edit töflur (`G/L Entry-Edit`, `Cust. Entry-Edit`, etc.) eru routed automatically so writes go through the stutt BC paths.
- Pending-approval changes eru blocked með `PreventPendingApprovalChanges`.

## Forgangsröð auðkenna (tafla)

1. `data.tableName` 2. `data.tableNumber` 3. `data.tableNo` 4. `data.tableId` 5. `subject` envelope attribute (Heiti eða númer).

## Per-færsla Lookup Order

fyrir hver færsla in `data[]`:
1. **`id` aðeins** → SystemId lookup. fannst → update. fannst ekki + `identityInsert:true` → insert með that SystemId. fannst ekki otherwise → Villa.
2. **`id` + `primaryKey`** → SystemId lookup, then verify `primaryKey` matches; mismatch → Villa.
3. **`primaryKey` aðeins** → set PK fields og `Find('=')`. fannst → update; fannst ekki → insert.
4. **Neither** → insert. PK verður að be auto-numbered eða it mun fail.

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `data` | hlutur[] | Yes | fylki of færsla objects. |
| `data[].id` | GUID (no braces) | No | SystemId; triggers update path. |
| `data[].primaryKey` | hlutur | No | Primary key Reitur(s). áskilið fyrir insert unless auto-numbered. |
| `data[].fields` | hlutur | No | Non-PK fields. PK fields here eru **ignored** — they verður að be in `primaryKey`. |
| `data[].identityInsert` | bool | No | Allow insert með Kallandi-supplied SystemId. |
| `force` | bool | No | Top-level. aðeins honoured þegar `ChangeLog Write Guard = Via force` **og** Kallandinn has the `BIFROST Force ori` heimild set. Ignored in opið / Blocked modes. |

### Dæmi um beiðni
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "primaryKey": { "No_": "10000" },
      "fields": { "Name": "Contoso Ltd.", "City": "Atlanta" }
    }
  ],
  "force": false
}
```

## Uppbygging svars

```json
{
  "status": "Success",
  "insertedCount": 5,
  "modifiedCount": 3,
  "result": [
    { "id": "...", "primaryKey": { "No_": "10000" }, "fields": { "Name": "Contoso Ltd." } }
  ]
}
```

## Uppgötvunarferli

áður en writing til an unfamiliar tafla:
1. `Help.Tables.Get` — confirm the tafla er writable (ekki innri).
2. `Help.Fields.Get` — list Reitur numbers, types, options/enums, skrifa-takmarkanir.
3. `Data.Records.Get` með `take: 1` — get a template færsla með exact normalized key names.
4. Edit `fields` úr the template, send back via `Data.Records.Set`.

## Stöðlun reitaheita

sama rule as `Data.Records.Get`: `%`, `.`, `"`, `\`, `/`, `'` → `_`, then strip remaining non-alphanumerics. nota the keys exactly as returned með `Data.Records.Get` (e.g. `No_`, `SelltoCustomerNo_`, `BalanceLCY`).

## Gildi Format

All values eru validated via `RecRef.Field(n).Validate()`. nota culture-invariant formats:
- **dagsetning / DateTime**: ISO 8601 (`2026-02-19` / `2026-02-19T14:30:00Z`)
- **tugabrot / heiltala**: `1250.50` (dot tugabrot)
- **sanngildi**: `true` / `false`
- **GUID**: bare, no braces
- **Option / Enum**: send the **display caption** (matches what `Data.Records.Get` Skilar)
- **BLOB / Media / MediaSet**: Base64
- **FlowFields / system fields (SystemId, SystemCreatedAt, ...)** eru ignored.

## Reitur Validation Order

**Fields in `fields` eru validated in the exact order they appear in the JSON hlutur.** BC's `Validate()` trigger runs immediately fyrir hver Reitur as it er processed, so a Reitur's gilt values eða tafla relations eru determined með the state of the færsla *at that moment* — ekki með all fields in the batch combined.

**Rule: place hvaða enum/option Reitur that controls a tafla relation eða restricts another Reitur's gilt values *áður en* the dependent Reitur in the JSON hlutur.**

ef you send the dependent Reitur fyrsta, it validates against the færsla's *current* (old) Gildi of the controlling enum — which may silently clear the dependent Reitur eða raise a validation Villa even though your intended combination er gilt.

### Common dependent pairs in BC journals

| Send this fyrsta (enum) | Then send this (dependent Gildi) | Why |
|---|---|---|
| `AccountType` | `AccountNo_` | Lookup tafla changes (G/L Account / viðskiptamanni / birgi / Bank Account / Fixed Asset / Employee) |
| `Bal_AccountType` | `Bal_AccountNo_` | sama — lookup tafla fyrir balancing account depends on Gerð |
| `DocumentType` | `AppliestoDoc_No_` | gilt skjal numbers depend on skjal Gerð (reikningur / Credit Memo / …) |
| `AppliestoDoc_Type` | `AppliestoDoc_No_` | sama — lookup filtered með applies-til Gerð |
| `GenPostingType` | `GenBusPostingGroup`, `GenProdPostingGroup` | Posting group combinations validated against posting matrix |
| `Type` (Sales/Purchase line) | `No_` | vöru / G/L Account / Resource / Fixed Asset / Charge lookup |

### Correct vs. wrong key order

```json
// ✅ CORRECT — Bal_AccountType comes before Bal_AccountNo_ in the JSON object
// BC validates Bal_AccountType first (switches lookup to Bank Account table),
// then validates Bal_AccountNo_ against that new lookup → "CHECKING" is found.
{
  "fields": {
    "AccountType": "Vendor",
    "AccountNo_": "10000",
    "Bal_AccountType": "Bank Account",
    "Bal_AccountNo_": "CHECKING"
  }
}

// ❌ WRONG — Bal_AccountNo_ appears before Bal_AccountType
// BC validates Bal_AccountNo_ first, while Bal_AccountType is still "G/L Account"
// → "CHECKING" not found in G/L Account table → field silently cleared or error.
{
  "fields": {
    "Bal_AccountNo_": "CHECKING",
    "Bal_AccountType": "Bank Account"
  }
}
```

> **Agent tip**: þegar building the `fields` hlutur, always construct it enum-fyrsta. ef you eru unsure which fields have dependencies, call `Help.Fields.Get` og look at the `tableRelation` property — hvaða Reitur með a conditional tafla relation (e.g. filtered með another Reitur) er a dependent Reitur og verður að come eftir its controlling enum.

## Takmarkanir á aðgangi að reitum

Per-user Reitur-level skrifa takmarkanir eru enforced via `Bifrost Field Access` (codeunit 65350). þegar a Reitur carries takmörkun Gerð `Both` eða `Write` fyrir the current user (eða a wildcard færsla matches), the skrifa er rejected og the Reitur er omitted úr the `Did you mean` / gilt-Reitur hints. This check er **independent of** og runs **áður en** the ChangeLog skrifa Guard.

Wildcards: `Field No. = 0` covers all fields on a tafla; `Table No. = 0` covers all töflur fyrir the user. Forgangsröð úrlausnar: specific færsla → all-fields wildcard → all-töflur wildcard. fyrsta match wins.

A separate `Bypass` takmörkun Gerð **opts a Reitur out** of the ChangeLog skrifa Guard — Sjá the ChangeLog skrifa Guard section below.

## ChangeLog skrifa Guard

Restricts which fields may be written, based on the **Bifrost Setup > ChangeLog skrifa Guard** Reitur:

| Mode | Behaviour |
|---|---|
| `Open` (Sjálfgefið) | All writable fields allowed. |
| `Blocked` | aðeins fields covered með Change Log modification logging eru writable. |
| `Via force` | sama as `Blocked`, but Kallandi may send `"force": true` ef they hold the `BIFROST Force ori` heimild set. |

### Change Log Reitur-enabled check

A Reitur er considered *covered með Change Log* þegar either:

- The Reitur's `Change Log Setup (Table)` færsla has `Log Modification = All Fields`, **eða**
- A `Change Log Setup (Field)` færsla exists fyrir the Reitur með `Log Modification = true`.

A Reitur með a `Bypass` færsla in `Bifrost Field Access` er einnig considered allowed in `Blocked` / `Via force` mode regardless of its Change Log coverage (Reitur-scoped, ekki user-scoped).

þegar `Change Log Activated` er `false` in `Change Log Setup`, the guard treats the entire system as uncovered: in `Blocked` mode every non-bypassed Reitur er rejected.

### Block response
```json
{
  "status": "Error",
  "error": "The following fields are not covered by Change Log...",
  "blockedFields": [ { "fieldNo": 2, "fieldCaption": "Name" } ],
  "guardMode": "Blocked",
  "forceAvailable": false
}
```
þegar `forceAvailable: true`, retry með `"force": true`.

## Examples

### Insert a ný viðskiptamanni (subject = "viðskiptamanni")
```json
{
  "data": [
    {
      "primaryKey": { "No_": "XTEST-12345" },
      "fields": { "Name": "Test Customer", "Address": "1 Test St", "City": "Atlanta" }
    }
  ]
}
```

### Update með SystemId
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "fields": { "Address": "789 New Street", "City": "Portland" }
    }
  ]
}
```

### Update með primary key
```json
{
  "data": [
    { "primaryKey": { "No_": "10000" }, "fields": { "Balance": 2500.75 } }
  ]
}
```

### Mixed batch (update + insert)
```json
{
  "data": [
    { "id": "<guid>", "fields": { "City": "Boston" } },
    { "primaryKey": { "No_": "CUST-NEW" }, "fields": { "Name": "Fresh Customer", "City": "Miami" } }
  ]
}
```

## Villur

| Condition | Message |
|---|---|
| vantar `data` fylki | `Missing required 'data' array in request.` |
| tafla fannst ekki | `Table {name} not found.` |
| færsla vantar fyrir SystemId án `identityInsert` | `Record with SystemId {guid} not found. Use "identityInsert": true to insert a new record with this SystemId.` |
| PK mismatch | `Primary key does not match the record with SystemId {guid}` |
| Reitur validate mistókst | `Failed to set field {name} ({n}) with value {v}` |
| Unknown Reitur key | `Invalid field "{name}" in {object} object. Field does not exist in the target table. Did you mean "{suggestion}"? Valid field names: ...`. The "Did you mean" hint appears þegar the supplied key matches a real Reitur eftir normalization — nota the suggestion verbatim. |
| ChangeLog skrifa Guard block | Sjá block response above (`blockedFields`, `guardMode`, `forceAvailable`). |
| Pending approval | Villa úr `PreventPendingApprovalChanges`. |

On hvaða Villa Svarið einnig includes a `callstack` Reitur (captured via `GetLastErrorCallStack`).

## Tengdar skilaboðategundir

- **Data.Records.Get** — sama JSON shape; nota til get a template færsla áður en editing.
- **Data.Notes.Set** — fyrir adding Athugasemdir (færsla Link tafla) instead of Reitur values.
- **Help.Fields.Get** — discover Reitur numbers, types, og skrifa takmarkanir.

