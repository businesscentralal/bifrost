---
id: landsbankinn-account-get
title: "Landsbankinn.Account.Get"
sidebar_label: "Landsbankinn.Account.Get"
sidebar_position: 72
description: "Request and response contract for the Landsbankinn.Account.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Retrieves details for a single bank account at Landsbankinn by BBAN.

**Direction:** Outbound  
**Content-Type:** text/json

## Request
Provide **one** of `bankAccountNo` or `bban`:
```json
{
  "bankAccountNo": "SAFN"       // BC Bank Account "No." — the bank account number is read and normalized automatically
}
```
or:
```json
{
  "bban": "0109-05-012345"      // Icelandic BBAN — normalized to 12 digits automatically
}
```

### Parameter details
| Parameter | Type | Description |
|---|---|---|
| `bankAccountNo` | string | The BC Bank Account "No." field. The connector reads the bank account number from the card and normalizes it to 12-digit BBAN. |
| `bban` | string | Icelandic domestic basic bank account number (BBAN). Accepted formats: 12 digits without formatting (e.g. `010905012345`) or hyphen-separated parts: 3–4 digit bank code, 1–2 digit ledger code, 1–6 digit account number (e.g. `0109-05-012345` or `109-5-12345`). Normalized to 12 digits with leading zeros. Length: 5–14 chars. Pattern: `^\\d{1,4}-?\\d{1,2}-?\\d{1,6}$`. |

If both are provided, `bankAccountNo` takes precedence.

## Response
Returns the bank's full JSON account object as-is, plus `logEntryNo`.

## AI/Agent playbook
Use this to get details for a known account. If you only have a BC Bank Account No., pass `bankAccountNo` and the connector resolves the BBAN. If you have the raw account number (from a bank statement or user input), pass `bban`.

