---
id: incoming-documents
title: "Incoming document message types"
sidebar_position: 11
---

**Parent Document:** [API_Reference.md](/foundation/reference/api/)  
**Implementation Folder:** `app/src/Message Type/Implementations/IncomingDocument/`

---

## Overview

This document describes the Incoming Document message types in the Bifrost API. These message types cover the full lifecycle of an Incoming Document in Business Central — from receiving a file, through optional additional attachments, processing into a purchase or journal document, to querying the document and its attachments.

| Message Type | Direction | Purpose | Related Table(s) |
|--------------|-----------|---------|------------------|
| Incoming.Document.Create | Inbound | Create a new Incoming Document with a main attachment | Incoming Document (130), Incoming Document Attachment (133) |
| Incoming.Document.Attach | Inbound | Add supplemental attachments to an existing Incoming Document | Incoming Document Attachment (133) |
| Incoming.Document.Process | Inbound | Process an Incoming Document to create a purchase invoice or journal line | Incoming Document (130) |
| Incoming.Document.Get | Outbound | Retrieve an Incoming Document with header fields and all attachments | Incoming Document (130), Incoming Document Attachment (133) |
| Incoming.Document.SetDefault | Inbound | Set the default (main) attachment on an Incoming Document | Incoming Document (130), Incoming Document Attachment (133) |

**Typical workflow:**
1. Call `Incoming.Document.Create` to upload the main file and create the Incoming Document.
2. Optionally call `Incoming.Document.Attach` one or more times to add supplemental files.
3. Call `Incoming.Document.Process` to create a purchase invoice or journal entry from the document.
4. Call `Incoming.Document.Get` at any point to retrieve the current document state and all attachments.
5. Call `Incoming.Document.SetDefault` to change which attachment is the main (default) attachment.

---

## Incoming.Document.Create

**Direction:** Inbound  
**Object IDs:** Codeunit 10078113 (`IncomingDoc Create Impl ori`), Codeunit 10077961 (`IncomingDoc Create Help ori`)

### Purpose

Creates a new Incoming Document in Business Central with a main attachment. The file content must be provided as a Base64-encoded string together with the file name.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Create",
  "source": "MyApp v1.0",
  "data": "{\"fileName\":\"invoice.pdf\",\"fileContent\":\"<base64-encoded content>\"}"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fileName | Text | Yes | File name including extension |
| fileContent | Text | Yes | Base64-encoded file content |

### Response Format

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "lineNo": 10000,
  "description": "Purchase from Fabrikam",
  "documentDate": "2026-04-01",
  "dueDate": "",
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

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `"Success"` on success, `"Error"` on failure |
| entryNo | Integer | Entry No. of the created Incoming Document |
| id | Text | SystemId (GUID without braces) of the created Incoming Document |
| lineNo | Integer | Line No. of the main attachment |
| description | Text | Description of the Incoming Document |
| documentDate | Text | Document date in ISO format |
| dueDate | Text | Due date in ISO format |
| vendorNo | Text | Vendor number associated with the document |
| vendorName | Text | Vendor name associated with the document |
| documentStatus | Text | Current status of the Incoming Document |
| dataExchangeType | Text | Data Exchange Type used for processing |
| processed | Boolean | Whether the document has been processed |
| posted | Boolean | Whether the document has been posted |
| record | Object | Linked BC record metadata (empty object if none) |
| error | Array | Error messages from the Incoming Document (empty array if none). See [Error Message Object Fields](#error-message-object-fields) in Incoming.Document.Process for the full schema |

### Error Scenarios

| Error | Cause |
|-------|-------|
| `fileName is required.` | The `fileName` field is missing or empty |
| `fileContent is required.` | The `fileContent` field is missing or empty |

---

## Incoming.Document.Attach

**Direction:** Inbound  
**Object IDs:** Codeunit 10078112 (`IncomingDoc Attach Impl ori`), Codeunit 10077960 (`IncomingDoc Attach Help ori`)

### Purpose

Adds a supplemental attachment to an existing Incoming Document. The target document is identified by its Entry No. or SystemId in the **subject** field. The file content must be provided as a Base64-encoded string.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Attach",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"fileName\":\"delivery-note.xml\",\"fileContent\":\"<base64-encoded content>\"}"
}
```

Or by SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}",
  "data": "{\"fileName\":\"delivery-note.xml\",\"fileContent\":\"<base64-encoded content>\"}"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fileName | Text | Yes | File name including extension |
| fileContent | Text | Yes | Base64-encoded file content |

### Response Format

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

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `"Success"` on success, `"Error"` on failure |
| entryNo | Integer | Entry No. of the Incoming Document |
| id | Text | SystemId (GUID without braces) of the Incoming Document |
| lineNo | Integer | Line No. of the newly created attachment |
| description | Text | Description of the Incoming Document |
| documentDate | Text | Document date in ISO format |
| dueDate | Text | Due date in ISO format |
| vendorNo | Text | Vendor number associated with the document |
| vendorName | Text | Vendor name associated with the document |
| documentStatus | Text | Current status of the Incoming Document |
| dataExchangeType | Text | Data Exchange Type used for processing |
| processed | Boolean | Whether the document has been processed |
| posted | Boolean | Whether the document has been posted |
| record | Object | Linked BC record metadata (empty object if none) |
| error | Array | Error messages from the Incoming Document (empty array if none). See [Error Message Object Fields](#error-message-object-fields) in Incoming.Document.Process for the full schema |

### Error Scenarios

| Error | Cause |
|-------|-------|
| `fileName is required.` | The `fileName` field is missing or empty |
| `fileContent is required.` | The `fileContent` field is missing or empty |
| `Incoming Document X not found.` | The subject does not match any Incoming Document |

---

## Incoming.Document.Process

**Direction:** Inbound  
**Object IDs:** Codeunit 10078116 (`IncomingDoc Process Impl ori`), Codeunit 10077963 (`IncomingDoc Process Help ori`)

### Purpose

Processes an Incoming Document using the standard Business Central OCR/document processing flow, which attempts to create a purchase invoice or a journal line from the document.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Process",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Or by SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}"
}
```

### Response Format

```json
{
  "status": "Success",
  "record": {
    "tableNo": 38,
    "tableName": "Purchase Header",
    "tableCaption": "Purchase Header",
    "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890"
  },
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

On failure, a `"status": "Error"` response is returned with an `"error"` array containing the BC error messages that prevented the document from reaching `Status = Created`.

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `"Success"` when `Incoming Document.Status = Created` after processing; `"Error"` otherwise |
| entryNo | Integer | Entry No. of the processed Incoming Document |
| id | Text | SystemId (GUID without braces) of the processed Incoming Document |
| record | Object | Present on success. Table metadata for the linked BC document created from this Incoming Document |
| error | Array | Present on failure. Array of BC error message objects that explain why processing did not reach `Status = Created` |

##### record Object Fields

| Field | Type | Description |
|-------|------|-------------|
| tableNo | Integer | Table number of the linked BC document (e.g. 38 for Purchase Header, 81 for Gen. Journal Line) |
| tableName | Text | Internal name of the linked document table |
| tableCaption | Text | Translated caption of the linked document table |
| recordSystemId | Text | SystemId (GUID without braces) of the linked BC document |

##### Error Message Object Fields

Each object in the `error` array has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Error message ID |
| message | Text | Error message text |
| type | Text | Message type caption (e.g. `"Error"`, `"Warning"`) |
| table | Object | Source table — `{ "id": <tableNo>, "name": "<tableName>" }` |
| field | Object | Source field — `{ "id": <fieldNo>, "name": "<fieldName>" }` |
| context | Object | Context — `{ "tableNumber": <int>, "fieldNumber": <int>, "fieldName": "<text>" }` |
| additionalInformation | Text | Additional information from the error message |

### Error Scenarios

| Error | Cause |
|-------|-------|
| `Incoming Document X not found.` | The subject does not match any Incoming Document |
| `Incoming Document X has already been posted.` | The Incoming Document's linked document has been posted |

---

## Incoming.Document.Get

**Direction:** Outbound  
**Object IDs:** Codeunit 10078114 (`IncomingDoc Get Impl ori`), Codeunit 10077962 (`IncomingDoc Get Help ori`)

### Purpose

Retrieves header information and all file attachments for an existing Incoming Document. Attachments are grouped into a `mainAttachment` object and an `additionalAttachments` array. File content is returned as Base64-encoded strings.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.Get",
  "source": "MyApp v1.0",
  "subject": "1001"
}
```

Or by SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}"
}
```

The **subject** field accepts either:
- An Entry No. (integer as text, e.g. `"1001"`)
- A SystemId GUID (with or without braces)

### Response Format

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
  "record": {
    "tableNo": 38,
    "tableName": "Purchase Header",
    "tableCaption": "Purchase Header",
    "recordSystemId": "c3d4e5f6-a1b2-7890-abcd-ef1234567890"
  },
  "error": [],
  "mainAttachment": {
    "lineNo": 10000,
    "fileName": "invoice.pdf",
    "fileContent": "<base64-encoded file content>"
  },
  "additionalAttachments": [
    {
      "lineNo": 20000,
      "fileName": "delivery-note.xml",
      "fileContent": "<base64-encoded file content>"
    }
  ]
}
```

#### Header Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `"Success"` on success, `"Error"` on failure |
| entryNo | Integer | Incoming Document Entry No. |
| id | Text | SystemId (GUID without braces) |
| description | Text | Description of the Incoming Document |
| documentDate | Date | Document date in ISO format (yyyy-MM-dd) |
| dueDate | Date | Due date in ISO format (yyyy-MM-dd) |
| vendorNo | Code | Vendor No. from the Incoming Document |
| vendorName | Text | Vendor name from the Incoming Document |
| documentStatus | Text | Status: `New`, `Released`, `Rejected`, or `Posted` |
| dataExchangeType | Text | Data Exchange Type code configured on the Incoming Document |
| processed | Boolean | Whether the document has been processed |
| posted | Boolean | Whether the linked document has been posted |
| record | Object | Linked BC document metadata. Empty object when no document is linked |
| error | Array | BC error messages from the Incoming Document. Empty array when no errors. See [Error Message Object Fields](#error-message-object-fields) in Incoming.Document.Process for the full schema |

##### record Object Fields
| tableName | Text | Internal name of the linked document table |
| tableCaption | Text | Translated caption of the linked document table |
| recordSystemId | Text | SystemId (GUID without braces) of the linked BC document |

#### Attachment Fields (mainAttachment and additionalAttachments entries)

| Field | Type | Description |
|-------|------|-------------|
| lineNo | Integer | Attachment line number |
| fileName | Text | File name including extension (e.g. `invoice.pdf`) |
| fileContent | Text | Base64-encoded file content |

### Notes

- The `mainAttachment` object is **omitted** from the response if the Incoming Document has no main attachment.
- The `additionalAttachments` array is empty (`[]`) if there are no additional attachments.
- The `record` object contains table metadata for the linked BC document (e.g. Purchase Header) when one exists. It is an empty object when no document is linked.
- The `error` array contains BC error messages saved against the Incoming Document. It is an empty array when no errors exist.
- File content is always Base64-encoded; the caller must decode before use.

### Error Scenarios

| Error | Cause |
|-------|-------|
| `Incoming Document X not found.` | The subject does not match any Incoming Document |

---

## Incoming.Document.SetDefault

**Direction:** Inbound  
**Object IDs:** Codeunit 10078118 (`IncomingDoc SetDef Impl ori`), Codeunit 10078117 (`IncomingDoc SetDef Exec ori`), Codeunit 10077964 (`IncomingDoc SetDef Help ori`)

### Purpose

Sets the default (main) attachment on an existing Incoming Document. The specified attachment is deleted and re-inserted as the first attachment (Line No. 10000) with the Main Attachment flag set to true. All other attachments are re-inserted after it in their original relative order.

### Request Format

```json
{
  "specversion": "1.0",
  "type": "Incoming.Document.SetDefault",
  "source": "MyApp v1.0",
  "subject": "1001",
  "data": "{\"lineNo\": 20000}"
}
```

Or by SystemId:

```json
{
  "subject": "{a1b2c3d4-e5f6-7890-abcd-ef1234567890}",
  "data": "{\"lineNo\": 20000}"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lineNo | Integer | Yes | Line No. of the attachment to set as the default (main) attachment |

### Response Format

```json
{
  "status": "Success",
  "entryNo": 1001,
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | Text | `"Success"` on success, `"Error"` on failure |
| entryNo | Integer | Entry No. of the Incoming Document |
| id | Text | SystemId (GUID without braces) of the Incoming Document |

### Notes

- The Incoming Document must have at least 2 attachments. If fewer than 2 exist, an error is returned.
- All attachments are deleted and re-inserted: the specified attachment becomes Line No. 10000 (main), the rest follow at 20000, 30000, etc.
- File content (BLOB data) is preserved during the re-ordering.
- The original relative order of the non-default attachments is maintained.

### Error Scenarios

| Error | Cause |
|-------|-------|
| `lineNo is required.` | The `lineNo` field is missing from the request |
| `Attachment with lineNo X not found.` | No attachment with the specified Line No. exists on the document |
| `At least 2 attachments are required to set a default.` | The document has fewer than 2 attachments |
| `Incoming Document X not found.` | The subject does not match any Incoming Document |
