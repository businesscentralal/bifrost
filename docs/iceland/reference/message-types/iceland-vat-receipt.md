---
id: iceland-vat-receipt
title: "Iceland.VAT.Receipt"
sidebar_label: "Iceland.VAT.Receipt"
sidebar_position: 68
description: "Request and response contract for the Iceland.VAT.Receipt Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the PDF receipt from a submitted VAT period. **Local operation only** — does NOT call RSK.

**Direction:** Local
**RSK Operation:** None (reads from stored Media field)

## Lifecycle position
```
... → Submit → [Submitted] → **Receipt** (returns stored PDF)
```

## State gates
| Current Status | Behavior |
|---|---|
| Open | **Error** — not yet submitted |
| Validated | **Error** — not yet submitted |
| Submitted | Returns the stored PDF receipt as base64 |
| Reversed | **Error** — looks for the non-reversed Submitted record instead |

## Behavior
1. Finds the period record with Status = Submitted (non-reversed) for the given VSK/Year/Period.
2. Reads the PDF Receipt Media field.
3. Returns the base64-encoded PDF content.

## Request
```json
{
  "vat": {
    "vskNumer": "123456",
    "ar": 2026,
    "timabil": "01"
  }
}
```
All three fields are **required**.

## Response
```json
{
  "vskNumber": "123456",
  "year": 2026,
  "period": "01",
  "revisionNo": 1,
  "pdf": "<base64-encoded PDF content>"
}
```

## Agent playbook
1. **Prerequisite:** Period must have been submitted successfully (Status = Submitted).
2. The PDF was stored during the Submit operation — this just reads it from the database.
3. Decode the base64 `pdf` field to get the actual PDF file content.
4. If multiple revisions exist, this returns the receipt from the Submitted (non-reversed) one.
5. Submit does NOT include the PDF in its response — always use this endpoint to get it.

## Errors
- No Submitted period found → error (submit first).
- PDF Receipt is empty → error (RSK did not provide a receipt during submission).

