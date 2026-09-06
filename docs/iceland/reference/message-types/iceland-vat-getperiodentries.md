---
id: iceland-vat-getperiodentries
title: "Iceland.VAT.GetPeriodEntries"
sidebar_label: "Iceland.VAT.GetPeriodEntries"
sidebar_position: 66
description: "Request and response contract for the Iceland.VAT.GetPeriodEntries Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves VAT period entries directly from Skatturinn. **Read-only** — never writes to local tables.

**Direction:** Outbound
**RSK Operation:** `NaIFaerslurTimabils`

## Lifecycle position
This is a **utility/lookup** operation — it does not participate in the VAT lifecycle state machine.
Use it to inspect what RSK has on file without affecting local records.

## Behavior
1. Always calls RSK (no caching, no local writes).
2. Parses the XML response into structured JSON entries.
3. Returns entries as a flat JSON array.

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
  "entries": [
    { "entryType": "VSK01", "level": "", "categoryId": "1", "description": "Skattskyld velta", "amount": 500000 },
    { "entryType": "VSK02", "level": "", "categoryId": "2", "description": "Útskattur", "amount": 120000 }
  ]
}
```

## Agent playbook
1. Use this to **compare** what RSK has vs. what is stored locally after GetInfo.
2. If you need to populate local tables, use `Iceland.VAT.GetInfo` instead.
3. Useful for reconciliation or debugging discrepancies before Validate.
4. This is the only VAT query operation that does NOT require `KerfiUtgafa` registration — it works immediately.

## Error response
On failure, returns a structured error instead of throwing:
```json
{
  "success": false,
  "rskStatusCode": 999,
  "error": "<RSK error message>"
}
```

## Errors
- Missing `vat` object or required fields → error.
- RSK SOAP fault → returned as structured error with details.
- HTTP non-200 → returns `success: false` with `httpStatus` and `error` fields.

## Troubleshooting
- This operation does NOT send `KerfiUtgafa` — use it to verify basic RSK connectivity.
- An empty `entries` array with no error means the period has no data at RSK (valid for future/unused periods).
- Check the Request Log (table Request Log ori, LogType=VAT, Operation=NaIFaerslurTimabils) for diagnostics.

