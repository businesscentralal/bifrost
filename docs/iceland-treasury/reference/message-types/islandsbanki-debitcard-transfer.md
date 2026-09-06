---
id: islandsbanki-debitcard-transfer
title: "Islandsbanki.DebitCard.Transfer"
sidebar_label: "Islandsbanki.DebitCard.Transfer"
sidebar_position: 44
description: "Request and response contract for the Islandsbanki.DebitCard.Transfer Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Transfers an amount onto a debit card (MillifaeraInnADebetkort).

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Request
```json
{
  "debitAccount": "0133-26-019507",   // (required) withdrawal account
  "ownerKennitala": "1234567890",     // (optional) withdrawal account owner
  "cardBank": 133,                     // (required) bank number of the debit card
  "cardGuaranteeNumber": 123456,       // (required) cheque-guarantee number of the card
  "textKey": "...",                    // (optional)
  "amount": 5000.00                    // (required)
}
```

## Response
```json
{ "status": "Success", "logEntryNo": 45 }
```

