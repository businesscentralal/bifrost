---
id: email-draft-set
title: "Email.Draft.Set"
sidebar_label: "Email.Draft.Set"
sidebar_position: 31
description: "Request and response contract for the Email.Draft.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates an email draft in the Business Central Email Outbox. This message type NEVER sends the
message: it resolves an Email Scenario, builds the message, adds any attachments, saves the draft,
and returns the outbox URL. A person must open the Email Outbox in the BC client and press Send.
There is no send flag and no other message type in this API sends free-form email.

## Prerequisite
An email account must be configured in Business Central (Email Accounts page) and be reachable by
the resolved Email Scenario. Without one the call fails with "The specified email account does not
exist". The error is raised by the platform and is returned in the language of the calling session.

## Direction
Inbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| to | Text or Array of Text | Yes | Recipient(s); strings may be `;` or `,` separated |
| subject | Text | Yes | Email subject |
| htmlBody | Text | No | HTML body (alias: `body`) |
| cc | Text or Array of Text | No | CC recipients |
| bcc | Text or Array of Text | No | BCC recipients |
| emailScenario | Text | No | Name of an `Email Scenario` enum value |
| relatedTableId | Integer | No | Used to infer scenario when `emailScenario` is omitted |
| attachments | Array of objects | No | Zero or more attachments; see **Attachments** below |

## Attachments

`attachments` is optional and accepts zero or more entries. Each entry is a JSON object that must
contain `fileName` plus **exactly one** content source.

| Field | Required | Description |
|-------|----------|-------------|
| fileName | Yes | Attachment file name including extension, max 250 characters. Used verbatim. |
| contentBase64 | One of the two | Raw base64 of the file bytes. Decoded server-side into the attachment. |
| url / contentUrl | One of the two | An `http` or `https` address that BC downloads server-side. |
| contentType | No | MIME type. Defaults to `application/octet-stream`. Set it so the recipient's mail client renders the file correctly, for example `application/pdf`, `image/png`, `text/csv`. |

### Which source to use

Use `contentBase64` whenever the bytes already exist somewhere you can read, which is the normal
case when the file lives inside Business Central. Use `url` only for files that are published on a
web address the Business Central service itself can reach.

### contentBase64 rules
- Supply standard base64 text only. Do NOT wrap it in a data URI: `data:application/pdf;base64,...`
  is rejected, because the prefix is not valid base64.
- Do not URL-encode it and do not add quotes beyond normal JSON string quoting.
- Base64 inflates the payload by roughly 33 percent over the raw file size. Keep the whole request
  inside the gateway payload limit; for very large files publish them and use `url` instead.
- Invalid base64 fails fast with a message naming the attachment.

### url / contentUrl rules
- BC performs a plain server-side HTTP GET. **No authentication headers are sent.**
- The address must therefore be publicly reachable from the Business Central service. These all
  fail: `data:` URIs, `file:` paths, UNC paths, `localhost`, private network addresses, and any
  BC or Graph API endpoint that requires a token.
- A non-2xx response fails with the HTTP status code in the error message.

### Getting base64 out of Business Central
Anything stored in BC as a BLOB or Media field, or returned by another message type as base64, can
be attached directly:
- `Data.Records.Get` with `fieldNumbers` on a BLOB or Media field returns that field base64-encoded.
  Request the single field you need so the response stays small.
- Message types that return a base64 payload, for example `Sales.SalesInvoice.Pdf`,
  `Sales.SalesCreditMemo.Pdf`, `Sales.SalesShipment.Pdf` and `Customer.Statement.Pdf`. Look for a
  `dataBase64` or equivalent property in the response.

Pass the returned value into `contentBase64` unchanged. No decoding, re-encoding or hosting step is
needed.

## Scenario Resolution Order
1. Explicit `emailScenario` value.
2. Inferred from `relatedTableId`:
   - Customer (18), Sales Header (36), Sales Invoice Header (112), Sales Cr.Memo Header (114) -> `Sales`
   - Vendor (23), Purchase Header (38), Purch. Inv. Header (122), Purch. Cr. Memo Hdr. (124) -> `Purchasing`
   - Approval Entry (454) -> `Approvals`
3. `Default` scenario.
4. `Bifrost Setup`.`Default Email Scenario` if set.
5. First available scenario.

## Request Example: attach a PDF that lives in BC
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com",
    "subject": "Invoice copy",
    "htmlBody": "<p>A copy of the posted invoice is attached.</p>",
    "attachments": [
      {
        "fileName": "invoice-103045.pdf",
        "contentType": "application/pdf",
        "contentBase64": "JVBERi0xLjQKJeTjz9IK..."
      }
    ]
  }
}
```

## Request Example: attach from a public URL
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com",
    "cc": ["lead@example.com"],
    "subject": "Order confirmation",
    "htmlBody": "<p>Hi Jane,</p><p>Please find the order confirmation attached.</p>",
    "relatedTableId": 36,
    "attachments": [
      { "url": "https://example.com/files/SO-1023.pdf", "fileName": "SO-1023.pdf", "contentType": "application/pdf" }
    ]
  }
}
```

## Request Example: several attachments, mixed sources
```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": "jane@example.com;john@example.com",
    "subject": "Month end package",
    "htmlBody": "<p>Two files attached.</p>",
    "attachments": [
      { "fileName": "receipt.pdf", "contentType": "application/pdf", "contentBase64": "JVBERi0..." },
      { "fileName": "summary.csv", "contentType": "text/csv", "url": "https://example.com/summary.csv" }
    ]
  }
}
```

## Response Shape
```json
{
  "status": "Success",
  "messageId": "...",
  "outboxSystemId": "...",
  "outboxUrl": "https://businesscentral.../...",
  "emailScenarioResolved": "Sales"
}
```

## Errors
| Condition | Error message |
|-----------|---------------|
| Missing to | `Missing required field 'to' in request.` |
| Missing subject | `Missing required field 'subject' in request.` |
| Unknown scenario | `Email scenario '{name}' is not supported in this environment.` |
| Attachment entry is not an object | `Each entry in 'attachments' must be a JSON object.` |
| Attachment missing fileName | `Attachment entry must include 'fileName'.` |
| Attachment has no content source | `Attachment '{fileName}' must include exactly one content source: 'contentBase64' with raw base64 bytes, or 'url' / 'contentUrl' with an http or https address. Data URIs are not supported.` |
| Attachment has both sources | `Attachment '{fileName}' specifies both 'contentBase64' and 'url' / 'contentUrl'. Supply exactly one content source.` |
| Attachment base64 is invalid | `Attachment '{fileName}' has invalid 'contentBase64' content. Supply standard base64 text without a data URI prefix.` |
| Attachment download failed | `Failed to download attachment from URL '{url}' (HTTP {status}).` |

A failed attachment aborts the whole call: no draft is saved, so nothing needs cleaning up.

## Agent Playbook
1. Decide the source first. If the file is already in BC or is returned by another message type as
   base64, use `contentBase64`. Reach for `url` only for genuinely public web addresses.
2. Do not try to smuggle bytes through `url` with a data URI. It is rejected by design.
3. After a successful call, tell the user the draft is waiting and give them `outboxUrl`: this
   message type does not send, and no other message type will send it for them.

## Related Message Types
- `User.Notification.Send`

