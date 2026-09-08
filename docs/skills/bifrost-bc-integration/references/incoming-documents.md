---
id: incoming-documents
title: "Incoming documents"
sidebar_label: "Incoming documents"
sidebar_position: 16
description: "Creating an incoming document with its main attachment, adding supplemental attachments, choosing the default one, processing the document into a purchase document, and reading it all back."
---

Creating an incoming document with its main attachment, adding supplemental attachments, choosing the default one, processing the document into a purchase document, and reading it all back.

[← back to SKILL.md](../index.md) · originally sections 7.7 of the single-file skill.

---

### 7.7 INCOMING DOCUMENT OPERATIONS

Five message types cover the full Incoming Document lifecycle: Create → (Attach) → Process → Get, plus SetDefault for re-ordering attachments.

| Type | Direction | Purpose |
|---|---|---|
| `Incoming.Document.Create` | Inbound | Create a new Incoming Document with a main attachment |
| `Incoming.Document.Attach` | Inbound | Add supplemental attachments to an existing Incoming Document |
| `Incoming.Document.Process` | Inbound | Process an Incoming Document to create a purchase invoice or journal line |
| `Incoming.Document.Get` | Outbound | Retrieve header fields and all attachments from an Incoming Document |
| `Incoming.Document.SetDefault` | Inbound | Set the default (main) attachment by re-ordering attachments |

All five types identify the target document via the **subject** field (Entry No. as text, or SystemId GUID). `Incoming.Document.Create` does not require a subject.

---

#### `Incoming.Document.Create` — create Incoming Document with main attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Create",
  "source": "MyApp v1.0",
  "data": "{\"fileName\":\"invoice.pdf\",\"fileContent\":\"<base64>\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `fileName` | Yes | File name including extension |
| `fileContent` | Yes | Base64-encoded file content |

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 10000,
  "description": "",
  "documentDate": "2026-04-01",
  "dueDate": "",
  "vendorNo": "",
  "vendorName": "",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Get`). `lineNo` is the attachment line number.

---

#### `Incoming.Document.Attach` — add supplemental attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Attach",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"fileName\":\"delivery-note.xml\",\"fileContent\":\"<base64>\"}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `fileName` | Yes | File name including extension |
| `fileContent` | Yes | Base64-encoded file content |

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 20000,
  "description": "Purchase from Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": {},
  "error": []
}
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Get`). `lineNo` is the new attachment line number.

---

#### `Incoming.Document.Process` — process to purchase document

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Process",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Response:
```json
{ "status": "Success", "record": { "tableNo": 38, "tableName": "Purchase Header", "tableCaption": "Purchase Header", "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890" }, "entryNo": 1001, "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
```

`status` is `"Success"` when `Incoming Document.Status = Created` after processing, and a `record` object contains table metadata (`tableNo`, `tableName`, `tableCaption`, `recordSystemId`) for the **linked BC document** (e.g. Purchase Header) created from the Incoming Document. On failure, `status` is `"Error"` and an `error` array contains BC error message objects.

**Error message object fields:**

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Error message ID |
| `message` | Text | Error message text |
| `type` | Text | Message type caption (e.g. `"Error"`, `"Warning"`) |
| `table` | Object | Source table — `{ "id": <tableNo>, "name": "<tableName>" }` |
| `field` | Object | Source field — `{ "id": <fieldNo>, "name": "<fieldName>" }` |
| `context` | Object | Context — `{ "tableNumber": <int>, "fieldNumber": <int>, "fieldName": "<text>" }` |
| `additionalInformation` | Text | Additional information from the error message |

The same `error` array schema is returned by `Incoming.Document.Get`, `Incoming.Document.Create`, and `Incoming.Document.Attach`.

The request body is not used — only `subject` is required.

---

#### `Incoming.Document.Get` — retrieve document with attachments

Direction: **Outbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Get",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Response:
```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Purchase from Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam Inc.",
  "documentStatus": "New",
  "dataExchangeType": "",
  "processed": false,
  "posted": false,
  "record": { "tableNo": 38, "tableName": "Purchase Header", "tableCaption": "Purchase Header", "recordSystemId": "c3d4e5f6-..." },
  "error": [],
  "mainAttachment": {
    "lineNo": 10000,
    "fileName": "invoice.pdf",
    "fileContent": "<base64-encoded content>"
  },
  "additionalAttachments": [
    {
      "lineNo": 20000,
      "fileName": "delivery-note.xml",
      "fileContent": "<base64-encoded content>"
    }
  ]
}
```

**Header fields:**

| Field | Type | Description |
|---|---|---|
| `record` | Object | Linked BC document metadata (`tableNo`, `tableName`, `tableCaption`, `recordSystemId`). Empty object when no document is linked |
| `error` | Array | BC error messages from the Incoming Document. Empty array when no errors |

**Attachment fields** (same shape for `mainAttachment` and each `additionalAttachments` entry):

| Field | Type | Description |
|---|---|---|
| `lineNo` | Integer | Attachment line number (10000, 20000, …) |
| `fileName` | Text | File name + extension (e.g. `invoice.pdf`) — BC `Name` + `"." ` + `"File Extension"` |
| `fileContent` | Text | Base64-encoded file content — caller must decode before use |

**Notes:**
- `mainAttachment` is **omitted** when the Incoming Document has no main attachment.
- `additionalAttachments` is always present but may be an empty array `[]`.
- `record` contains table metadata for the linked BC document (e.g. Purchase Header) when one exists.
- `error` contains BC error messages saved against the Incoming Document.
- Subject accepts Entry No. (integer as text) or SystemId GUID (with or without braces).

**Key errors:** `Incoming Document X not found.`

---

#### `Incoming.Document.SetDefault` — set default attachment

Direction: **Inbound**

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.SetDefault",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"lineNo\": 20000}"
}
```

| Parameter | Required | Description |
|---|---|---|
| `lineNo` | Yes | Line No. of the attachment to set as the default (main) attachment |

Response:
```json
{ "status": "Success", "entryNo": 1001, "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
```

Response includes the full Incoming Document header fields (same shape as `Incoming.Document.Create` / `Incoming.Document.Attach`).

**Notes:**
- Requires at least 2 attachments on the document.
- All attachments are deleted and re-inserted: specified `lineNo` becomes Line No. 10000 (`Main Attachment = true`), the rest follow at 20000, 30000, etc. in their original order.
- BLOB content is preserved during re-ordering.

**Key errors:** `lineNo is required.` · `Attachment with lineNo X not found.` · `At least 2 attachments are required to set a default.` · `Incoming Document X not found.`
