---
id: iceland-parties-get
title: "Iceland.Parties.Get"
sidebar_label: "Iceland.Parties.Get"
sidebar_position: 41
description: "Request and response contract for the Iceland.Parties.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets company parties (board members, auditors, founders, etc.).

## Endpoint
- Method: `POST`
- Path: `/api/Parties`

## Request
- **Request Body (JSON)**:\n  - `CompanyID` (required): 10-digit kennitala of a **company**.\n  - `TypesOfRoles` (optional): Array of role type IDs to filter.\n    Values: `1` Stjórn, `2` Endurskoðandi, `3` Eigandi, `4` Framkvæmdastjórn, `5` Prókúruhafi, `6` Stofnandi, `7` Útibússtjóri, `8` Umboðsaðili, `9` Varastjórn.\n  - Example: `{"CompanyID": "4112032630", "TypesOfRoles": ["1", "5"]}`

## Response
- The connector wraps the Umsja response in a standard JSON envelope with `status` and `result`.
- Returns: List of parties (board members, auditors, founders, etc.) for the company.

## Example Wrapper
```json
{
  "status": "Success",
  "result": {
    "messageType": "Iceland.Parties.Get",
    "path": "/api/Parties",
    "description": "Gets company parties (board members, auditors, founders, etc.).",
    "payload": { ... }
  }
}
```

