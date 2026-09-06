---
id: iceland-vat-deleteintest
title: "Iceland.VAT.DeleteInTest"
sidebar_label: "Iceland.VAT.DeleteInTest"
sidebar_position: 63
description: "Request and response contract for the Iceland.VAT.DeleteInTest Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Deletes a submitted VAT statement in the Skatturinn **test environment** only.

**Direction:** Both
**RSK Operation:** `EydaSkyrsluIProfun`

## Lifecycle position
This is a **testing utility** — only works against the RSK test endpoint. Does not affect local tables.

## Behavior
1. Always calls RSK.
2. Parses the XML response into a simple success/error JSON.
3. Does NOT delete the local period record — only the RSK-side submission.

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
  "success": true,
  "message": ""
}
```

## Agent playbook
1. **Only use in test environments** — will fail or be rejected in production.
2. Use before replaying the same VAT number/year/period in automated test scenarios.
3. After deleting on RSK side, you may want to delete the local period record too for a clean re-test.
4. Typical test cycle: GetInfo → Validate → Submit → DeleteInTest → repeat.

## Errors
- Missing `vat` object or required fields → error.
- RSK rejects the delete (e.g., production endpoint) → error with RSK message.

