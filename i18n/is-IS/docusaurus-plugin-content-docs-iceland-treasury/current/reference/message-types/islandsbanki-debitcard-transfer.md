---
id: islandsbanki-debitcard-transfer
title: "Islandsbanki.DebitCard.Transfer"
sidebar_label: "Islandsbanki.DebitCard.Transfer"
sidebar_position: 44
description: "Beiðni- og svarsamningur fyrir Islandsbanki.DebitCard.Transfer Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Transfers an amount onto a debit card (MillifaeraInnADebetkort).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Payment Gate` permission set.

## Beiðni
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

## Svar
```json
{ "status": "Success", "logEntryNo": 45 }
```


