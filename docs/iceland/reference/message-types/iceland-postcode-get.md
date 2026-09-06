---
id: iceland-postcode-get
title: "Iceland.PostCode.Get"
sidebar_label: "Iceland.PostCode.Get"
sidebar_position: 51
description: "Request and response contract for the Iceland.PostCode.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Downloads the official Icelandic postal code registry (postnúmeraskrá) from
Byggðastofnun and returns all entries as a JSON array.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to validate or look up Icelandic postal codes.
- You need to map postal codes to cities or municipalities.
- You want to populate or refresh the BC Post Code table with Icelandic data.

## Request
```json
{}
```

No parameters required. The endpoint downloads the current postal code registry.

## Response
```json
{
  "status": "Success",
  "source": "Byggðastofnun - Postnúmeraskrá",
  "count": 150,
  "postCodes": [
    {
      "postCode": "101",
      "city": "Reykjavík",
      "municipality": "Reykjavíkurborg"
    }
  ]
}
```

## Response field notes
| Field | Notes |
|---|---|
| `postCode` | The 3-digit Icelandic postal code (as text to preserve leading zeros). |
| `city` | The place/area name (Icelandic). |
| `municipality` | The municipality (sveitarfélag) the postal code belongs to. |

## AI/Agent playbook
1. Call with an empty body `{}` to get the full postal code list.
2. Filter client-side by `postCode`, `city`, or `municipality` as needed.
3. Use `postCode` to validate addresses before posting documents.
4. Match `city` against the BC Post Code table for master data updates.

## Errors
- Connection/HTTP errors if Byggðastofnun is unreachable.
- `The postal code file contained no data rows.` — file format may have changed.

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Byggðastofnun was blocked ...`:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://www.byggdastofnun.is`.

