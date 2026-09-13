---
id: storage-attachment-createforrecord
title: "Storage.Attachment.CreateForRecord"
sidebar_label: "Storage.Attachment.CreateForRecord"
sidebar_position: 3
description: "Request and response contract for the Storage.Attachment.CreateForRecord Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


Býr til a skjal attachment on any færsla - viðskiptavinur, vendor, fixed asset, skjal - úr base64, úr storage, eða by copying an existing attachment.

## Lýsigögn
- **Direction:** Inn á við (write)
- **Gagnategund:** text/json
- **Kalla:** call the `call_message_type` tool með `type` = `Storage.Attachment.CreateForRecord` og the parameters below as the `data` object.
- **External File Storage operation:** `GetFile`
- **Routing:** The færsla er addressed með `tableId`/`tableName` plus `recordSystemId` eða `no`. A `storageCode` er needed aðeins þegar the innihald source er a skrá in storage.

## Færibreytur

| Parameter | Nauðsynlegt | Type | Lýsing |
|---|---|---|---|
| `tableId` | No | integer | Table the attachment belongs to. Supply this eða tableName. Common gildi: 18 = Customer, 23 = Vendor, 27 = Item, 156 = Resource, 270 = Bank Account, 5050 = Contact, 5200 = Employee, 5600 = Fixed Asset, 167 = Job, 15 = G/L Account. |
| `tableName` | No | string | Table heiti instead of tableId, e.g. 'Fixed Asset', 'Customer', 'Bank Account'. Case-insensitive match against the BC object heiti. |
| `recordSystemId` | No | string (GUID) | SystemId of the færsla to attach to. Works fyrir every table, including those með composite primary keys. Supply this eða no. |
| `no` | No | string | Primary key gildi of the færsla (e.g. '10000' fyrir a viðskiptavinur, 'FA000010' fyrir a fixed asset). Only works fyrir tables whose primary key er a single Code eða Text field of 20 characters eða less. Notaðu færslaSystemId fyrir skjal tables og any table með a composite eða integer key. |
| `fileName` | No | string | File heiti including extension, e.g. 'samningur.pdf'. Nauðsynlegt unless copying úr an existing attachment that already carries a heiti. |
| `content` | No | base64 string | Content source 1: the skrá itself, base64-enkóðid inlína. The innihald er stored in the BC database. Notaðu fyrir small skrár. |
| `storageCode` | No | string | Content source 2 (with slóð): references a skrá already in storage. The attachment er born offloaded — innihald stays in storage og er served transparently. Notaðu fyrir skrár delivered via Storage.Upload.Commit. |
| `path` | No | string | Nauðsynlegt með storageCode. Path of the skrá within the storage tenging — typically the `path` returned by Storage.Upload.Commit. Each slóð getur aðeins be linked to one attachment. |
| `sourceTarget` | No | string | Content source 3 (with sourceSystemId): copies innihald úr an existing BC attachment. Value er 'IncomingDocument' eða 'DocumentAttachment'. |
| `sourceSystemId` | No | string (GUID) | SystemId of the existing attachment to copy innihald from. The innihald er duplicated server-side — nothing crosses the wire. |

## Dæmi um beiðni
```json
// Source 1 — inline base64 on a customer:\{ "tableId": 18, "no": "10000", "fileName": "contract.txt", "content": "SGVsbG8=" }\\// Source 2 — from storage (born offloaded) on a fixed asset:\{ "tableName": "Fixed Asset", "no": "FA000010", "fileName": "deed.pdf", "storageCode": "ARCHIVE", "path": "uploads/deed.pdf" }\\// Source 3 — copy from an existing incoming document attachment to a vendor:\{ "tableId": 23, "no": "20000", "sourceTarget": "IncomingDocument", "sourceSystemId": "e4a2..." }\\// Addressing by SystemId (works for any table):\{ "tableId": 18, "recordSystemId": "b2ae4a05-...", "fileName": "note.txt", "content": "SGVsbG8=" }
```

## Svar
Tókst:
```json
{ "status": "Success", "data": ... }
```

`data` fields:

| Field | Type | Lýsing |
|---|---|---|
| `target` | string | Alltaf `DocumentAttachment`. |
| `tableId` | integer | The table the attachment was created on. |
| `no` | string | The færsla key the attachment hangs on. |
| `documentType` | string | The skjal tegund the base application derived úr the færsla. |
| `lineNo` | integer | The lína number the base application derived úr the færsla. |
| `attachmentId` | integer | The attachment's ID within the færsla's attachment list. |
| `systemId` | string (GUID) | SystemId of the new attachment. Sendu to Storage.Attachment.Offload eða Restore. |
| `fileName` | string | The final attachment skrá heiti (may be deduplicated, e.g. 'deed1.pdf'). |
| `contentLength` | integer | The skrá size in bytes. |
| `offloaded` | boolean | True þegar innihald stayed in storage (source 2). False fyrir inlína eða copy sources. |
| `storageCode` | string | Present aðeins þegar offloaded. The storage tenging serving the skrá. |
| `path` | string | Present aðeins þegar offloaded. The storage slóð of the skrá. |

Mistókst (the framework wraps any raised villa):
```json
{ "status": "Error", "error": "<message>" }
```
Alltaf branch on `status` áður en reading `data`.

## Algengar villur

| Villa | Úrlausn |
|---|---|
| Supply exactly one innihald source | Send innihald, eða storageCode með slóð, eða sourceTarget með sourceSystemId — never combine two sources in the same request. |
| No færsla was found in table | The host færsla verður exist áður en attaching. Check tableId og no/færslaSystemId. |
| has a composite primary key | The table has more than one key field. Address the færsla með færslaSystemId instead of no. |
| er not a kóði eða text field | The primary key er an Integer eða other non-text tegund. Notaðu færslaSystemId. |
| gerir ekki know which field identifies a færsla | The table er not in the set BC getur key an attachment to. This connector widens that set to allir tables með a single Code key; others need a subscriber on Document Attachment Mgmt.OnAfterTableHasNumberFieldPrimaryKey. |
| er longer than the 20 characters | The færsla identifier exceeds the 20-character limit of Document Attachment.No. |
| er already linked to another attachment | Each storage skrá getur aðeins back one attachment. Upload a separate copy eða use a different slóð. |

## Notes
Document tegund og lína number eru derived úr the host færsla — never supply them. File heitis eru deduplicated within a færsla: two skrár heitid 'deed.pdf' become 'deed.pdf' og 'deed1.pdf'. With the storage source (source 2) the local innihald er cleared og a link er færslaed, so the skrá er served on demand — the same state as Offload produces.\\### Supported tables\\The base application natively supports: Customer (18), Vendor (23), Item (27), Employee (5200), Fixed Asset (5600), Job (167), Resource (156), og the standard Sales/Purchase skjal tables. This connector widens that set to **every table whose primary key er a single Code field of 20 characters eða less** — including G/L Account (15), Bank Account (270), Contact (5050), Location (14), og any extension table með the same shape. For tables outside this set, use færslaSystemId (always works fyrir addressing) — but note that the base application verður still be able to derive a key fyrir the Document Attachment row.

## Next steps
- To deliver a large skrá first → call `Storage.Upload.Begin` (then Append og Commit, og pass the committed `path` + `storageCode` here as source 2).
- To move inlína innihald out of the database later → call `Storage.Attachment.Offload` (pass `target` = DocumentAttachment og the returned `systemId`).
- To pull offloaded innihald back í the database → call `Storage.Attachment.Restore` (pass `target` = DocumentAttachment og the returned `systemId`).

---
Connector overview og the list of stillt tengingar: request help fyrir `Help.Storage.Get` og call `Storage.Account.List`.

