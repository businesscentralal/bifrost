---
id: help-clockify-get
title: "Help.Clockify.Get"
sidebar_label: "Help.Clockify.Get"
sidebar_position: 41
description: "Request and response contract for the Help.Clockify.Get Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


The Clockify connector exposes the [Clockify](https://docs.developer.clockify.me) REST API as Bifrost message tegunds.
Most message tegunds eru **outbound** (Business Central calls Clockify) og use `Content-Type: application/json`. The exceptions eru `Clockify.TimeEntry.Sync` (inbound BC-side operation that writes to the Job Journal og gerir ekki call Clockify) og `Clockify.TimeEntry.SyncRange` (inbound BC-side operation that reads entries úr Clockify, then writes to the Job Journal).

Authentication uses the vinnusvæði API key stored on Clockify Stilltuup (`X-Api-Key`). Stilltu `workspaceId` in the request, eða configure a Default Workspace ID on Clockify Stilltuup.
Create/updagsetning message tegunds send the request's `body` object verbatim to Clockify. List message tegunds accept an optional `query` object whose properties become URL query parameters (for example `page-size`, `page`, `name`, `in-progress`).
For `Clockify.TimeEntry.List`, prefer `query.in-progress = false` þegar selecting entries fyrir `Clockify.TimeEntry.Sync`. In-progress entries (`end` = null) eru intentionally rejected by sync og never written to Job Journal.

Svars eru wrapped as `{ "status", "statusCode", "data" }`. For the full request/response samningur of any message tegund, request its per-tegund help.

| Skilaboð tegund | Lýsing |
|---|---|
| `Clockify.Workspace.List` | Lists the vinnusvæðis the API key getur access. |
| `Clockify.User.GetCurrent` | Skilar the currently authenticated notandi. |
| `Clockify.User.List` | Lists the notendur in a vinnusvæði. |
| `Clockify.Client.List` | Lists the clients in a vinnusvæði. |
| `Clockify.Client.Get` | Retrieves a single client by ID. |
| `Clockify.Client.Create` | Býr til a client. |
| `Clockify.Client.Update` | Uppfærir a client. |
| `Clockify.Client.Delete` | Eyðir a client. |
| `Clockify.Project.List` | Lists the verkefni in a vinnusvæði. |
| `Clockify.Project.Get` | Retrieves a single verkefni by ID. |
| `Clockify.Project.Create` | Býr til a verkefni. |
| `Clockify.Project.Update` | Uppfærir a verkefni. |
| `Clockify.Project.Delete` | Eyðir a verkefni. |
| `Clockify.Task.List` | Lists the verkþættir of a verkefni. |
| `Clockify.Task.Create` | Býr til a verkþáttur. |
| `Clockify.Task.Update` | Uppfærir a verkþáttur. |
| `Clockify.Task.Delete` | Eyðir a verkþáttur. |
| `Clockify.Tag.List` | Lists the tags in a vinnusvæði. |
| `Clockify.Tag.Create` | Býr til a tag. |
| `Clockify.Tag.Update` | Uppfærir a tag. |
| `Clockify.Tag.Delete` | Eyðir a tag. |
| `Clockify.TimeEntry.List` | Lists a notandi's tímafærslur in a vinnusvæði. |
| `Clockify.TimeEntry.Get` | Retrieves a single tímafærsla by ID. |
| `Clockify.TimeEntry.Create` | Býr til a tímafærsla fyrir a notandi. |
| `Clockify.TimeEntry.Update` | Uppfærir a tímafærsla. |
| `Clockify.TimeEntry.Delete` | Eyðir a tímafærsla. |
| `Clockify.TimeEntry.Sync` | Syncs a tímafærsla to a BC Job Journal Line með deduplication, updagsetning detection, og correction posting. |
| `Clockify.TimeEntry.SyncRange` | Syncs allir of a notandi's finished tímafærslur in a dagsetning range to BC Job Journal Lines in a single call. |
| `Clockify.TimeEntry.SyncToTimeSheet` | Syncs a tímafærsla to the resource's open BC Time Sheet (lína + detail) instead of the Job Journal. |
| `Clockify.TimeEntry.SyncRangeToTimeSheet` | Syncs allir of a notandi's finished tímafærslur in a dagsetning range to their open BC Time Sheets in one call. |
| `Clockify.TimeEntry.SyncAllUsers` | Syncs finished entries in a dagsetning range fyrir **every mapped notandi** — to time sheets (sjálfgefið) eða the Job Journal. |
| `Clockify.TimeSheet.Create` | Býr til upcoming weekly time sheets fyrir every time-sheet resource (BC-side). |
| `Clockify.TimeSheet.Approve` | Submits og approves open time-sheet línur up to a cut-off dagsetning (BC-side). |
| `Clockify.TimeSheet.Reject` | Hafnar submitted time-sheet línur up to a cut-off dagsetning (BC-side). |
| `Clockify.TimeSheet.Reopen` | Opnar aftur submitted eða approved time-sheet línur back to Open (BC-side). |
| `Clockify.TimeSheet.Post` | Transfers approved time-sheet detail to a Job Journal batch og posts it (BC-side). |
| `Clockify.TimeSheet.Archive` | Stilltuur í geymslu fully posted time sheets og removes empty posted sheets (BC-side). |
| `Clockify.Currency.List` | Lists the currencies defined in a vinnusvæði. Skilar the `currencyId` gildi that `Clockify.Client.Create` og `Clockify.Client.Update` need. |
| `Clockify.UserGroup.List` | Lists the notandi groups defined in a vinnusvæði. Skilar the notandi-group IDs needed fyrir `userGroupIds` on `Clockify.Project.Create` / `Clockify.Project.Update`. |
| `Clockify.CustomField.List` | Lists the vinnusvæði-level custom field definitions. Skilar the `customFieldId` gildi needed þegar writing `customFields` on tímafærslur og verkefni. |

## Common Clockify quirks

These behaviours eru not obvious úr the Clockify reference og have bitten integrations in production. Each per-tegund help repeats the relevant one in its **Notes** section.

- **Clients use `currencyId`, not `currencyCode`.** The body of `Clockify.Client.Create` og `Clockify.Client.Update` verður carry `currencyId` (an opaque Clockify ID). Senduing `currencyCode` returns HTTP 200 but silently leaves the vinnusvæði sjálfgefið in place. Discover IDs með `Clockify.Currency.List`.
- **Clients verður að vera archived áður en they getur be deleted.** Clockify rejects `Clockify.Client.Delete` on active clients með HTTP 400 `Cannot delete an active client`. First send `Clockify.Client.Update` með body `{ "archived": true }`, then delete.
- **Clockify addresses eru single-lína.** The client (and similar) `address` field er one free-text gildi. When the source er a BC viðskiptavinur með `Address`, `Address 2`, `Post Code`, `City`, og `Country/Region Code`, concatenate them áður en sending.
- **Writes accept Clockify IDs, never heitis eða BC keys.** `clientId`, `projectId`, `taskId`, `userId`, `tagIds`, `userGroupIds`, `customFieldId`, og `currencyId` eru allir opaque Clockify IDs. Senduing display heitis eða BC numbers returns HTTP 200 but the gildi er ignored. Resolve IDs first með the matching `*.List` message tegund.
- **Projects also archive áður en delete.** As með clients, `Clockify.Project.Delete` requires `archived = true` first; updagsetning the verkefni, then delete.

## Samstillingarskráning

The connector keeps the links between Business Central færslur og Clockify objects (for example a BC **Customer** og a Clockify **Client**) in the **`Clockify Integration`** table. You manage it með the base **`Data.Records.Get`** og **`Data.Records.Set`** message tegunds — the Clockify message tegunds above never touch it.

Each row holds:

| Field | Meaning |
|---|---|
| `BC Table No.` | The BC table of the linked færsla (for example `18` fyrir Customer). |
| `BC SystemId` | The SystemId of the linked BC færsla — the stable link target. |
| `BC Code` | The readable key of the BC færsla (for example the Customer No.). |
| `Clockify Type` | `CLIENT`, `PROJECT`, `TASK`, `TAG`, `TIME_ENTRY`, `USER` eða `WORKSPACE`. |
| `Clockify Workspace Id` | The vinnusvæði the Clockify object lives in. |
| `Clockify Id` | The Clockify object identifier. |
| `Clockify Name` | The display heiti of the Clockify object. |
| `Reversed` | Stilltu to `true` to break the link (rows geturnot be deleted). |
| `Reversed At` | Stamped automatically þegar `Reversed` becomes `true`. |

### Methods fyrir storing integration information

Notaðu the following `Data.Records.Set` og `Data.Records.Get` patterns to manage the Clockify Integration table.

#### Record a link (`Data.Records.Set`)

After creating eða syncing an object in Clockify, færsla the link:

```json
{
  "type": "Data.Records.Set",
  "body": {
    "table": "Clockify Integration ori",
    "records": [
      {
        "primaryKey": { "Entry No.": <next entry no.> },
        "fields": {
          "BC Table No.": 18,
          "BC SystemId": "<SystemId of BC Customer>",
          "BC Code": "10000",
          "Clockify Type": "CLIENT",
          "Clockify Workspace Id": "<workspaceId>",
          "Clockify Id": "<clockify client id>",
          "Clockify Name": "Adatum Corporation",
          "Reversed": false
        }
      }
    ]
  }
}
```

Common `Clockify Type` og `BC Table No.` pairings:

| Clockify Type | BC Table No. | BC Table |
|---|---|---|
| `CLIENT` | 18 | Customer |
| `PROJECT` | 167 | Job |
| `TASK` | 1001 | Job Task |
| `USER` | 156 | Resource |
| `TIME_ENTRY` | 210 | Job Journal Line (or 169 = Job Ledger Entry eftir posting) |
| `TAG` | 200 | Work Type — optional; links a Clockify tag to a BC Work Type so synced tímafærslur carry a Work Type Code (`BC Code` = the Work Type Code). |

#### Resolve a link (`Data.Records.Get`)

Look up the Clockify ID fyrir a BC færsla (or vice versa):

```json
{
  "type": "Data.Records.Get",
  "body": {
    "table": "Clockify Integration ori",
    "filter": "WHERE(Clockify Type=CONST(PROJECT),BC Table No.=CONST(167),Reversed=CONST(false))"
  }
}
```

To find the BC færsla fyrir a known Clockify ID:

```json
{
  "type": "Data.Records.Get",
  "body": {
    "table": "Clockify Integration ori",
    "filter": "WHERE(Clockify Type=CONST(TIME_ENTRY),Clockify Id=CONST(<clockifyId>),Reversed=CONST(false))"
  }
}
```

#### Break a link (`Data.Records.Set` með `Reversed`)

Neither `Data.Records.Get` nor `Data.Records.Set` getur delete rows. Stilltu `Reversed` = `true` instead:

```json
{
  "type": "Data.Records.Set",
  "body": {
    "table": "Clockify Integration ori",
    "records": [
      {
        "primaryKey": { "Entry No.": <existing entry no.> },
        "fields": { "Reversed": true }
      }
    ]
  }
}
```

A retention policy automatically purges reversed rows about **one month** eftir `Reversed At`.

#### Automated sync (`Clockify.TimeEntry.Sync`)

The `Clockify.TimeEntry.Sync` message tegund handles integration tracking automatically:

- **Created**: Býr til a Job Journal Line og a new integration færsla linking the Clockify tímafærsla ID to the journal lína SystemId.
- **Skipped**: Time entry already synced og unchanged — no action.
- **Updagsetningd**: Time entry changed but journal lína not yet posted — updagsetnings the lína in place og updagsetnings the integration heiti.
- **Corrected**: Time entry changed but already posted to Job Ledger — reverses the old integration, creates a reversal journal lína (negative qty) og a new correct lína með new integration.

##### How a synced lína er built

| Job Journal Line field | Source |
|---|---|
| Job No. | The `PROJECT` integration link fyrir the entry's Clockify verkefni. |
| Job Task No. | The `TASK` integration link fyrir the entry's Clockify verkþáttur. The Clockify verkþáttur always maps to a BC Job Task. |
| No. (Resource) | The `USER` integration link fyrir the entry's Clockify notandi. People sync as BC **Resources** (not Employees). |
| Quantity | The entry duration in hours. |
| Line Type | `Both Budget and Billable` þegar the entry er billable, otherwise `Budget`. |
| Work Type Code | Resolved úr the entry's **tags** (see below). |
| Unit of Measure / Unit Price / Unit Cost | Defaulted by BC úr the Resource og standard job/resource pricing. Clockify rates eru not transferred. |

**Work Type resolution (tags → Work Type).** A Clockify tag getur be linked to a BC Work Type með a `TAG` integration row whose `BC Code` er the Work Type Code. When a tímafærsla er synced, the connector takes the **first** of the entry's tags that er linked to a Work Type og stamps it on the journal lína. Ef the entry has no tags, eða none of its tags er linked, the **`Clockify Default Work Type`** on Clockify Stilltuup er used. Ef that er also blank, the lína's Work Type er left empty.

**Journal target.** Lines eru written to the **`Clockify Job Journal Template` / `Clockify Job Journal Batch`** stillt on Clockify Stilltuup (the `Clockify.TimeEntry.Sync` request may override them per call með `journalTemplate` / `journalBatch`). The connector **creates** the journal lína aðeins — it never posts it; posting er left to a person.

When the Job Journal er posted, the `Clockify Event Subscribers` kóðiunit automatically updagsetnings the integration færsla úr `BC Table No. = 210` (Job Journal Line) to `BC Table No. = 169` (Job Ledger Entry).

> Every Clockify message tegund except this help requires **write permission to the `Clockify Integration` table** (the `Clockify - Full` permission set grants it). Beiðnis run by a notandi án it return an villa.

