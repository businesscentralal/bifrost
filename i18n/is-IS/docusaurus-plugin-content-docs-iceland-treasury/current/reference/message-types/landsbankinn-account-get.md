---
id: landsbankinn-account-get
title: "Landsbankinn.Account.Get"
sidebar_label: "Landsbankinn.Account.Get"
sidebar_position: 72
description: "Beiðni- og svarsamningur fyrir Landsbankinn.reikningur.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir details fyrir a stakan bankareikningur at Landsbankinn by BBAN.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Beiðni
Gefðu upp **one** of `bankAccountNo` eða `bban`:
```json
{
  "bankAccountNo": "SAFN"       // BC Bank Account "No." — the bank account number is read and normalized automatically
}
```
eða:
```json
{
  "bban": "0109-05-012345"      // Icelandic BBAN — normalized to 12 digits automatically
}
```

### Upplýsingar um færibreytur
| Parameter | Gerð | Lýsing |
|---|---|---|
| `bankAccountNo` | string | The BC bankareikningur "No." Reitur. Tengingin reads the bankareikningur number frá the card og normalizes it til 12-digit BBAN. |
| `bban` | string | Icelandic domestic basic bankareikningur number (BBAN). Accepted formats: 12 digits without formatting (e.g. `010905012345`) eða hyphen-separated parts: 3–4 digit bank code, 1–2 digit ledger code, 1–6 digit reikningur number (e.g. `0109-05-012345` eða `109-5-12345`). Normalized til 12 digits með leading zeros. Length: 5–14 chars. Pattern: `^\\d{1,4}-?\\d{1,2}-?\\d{1,6}$`. |

Ef both eru provided, `bankAccountNo` takes precedence.

## Svar
Skilar bank's fulla JSON reikningur object as-er, plus `logEntryNo`.

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this til Sækja details fyrir a known reikningur. Ef you Aðeins have a BC bankareikningur No., pass `bankAccountNo` og Tengingin resolves the BBAN. Ef you have the raw reikningur number (frá a bank statement eða user input), pass `bban`.


