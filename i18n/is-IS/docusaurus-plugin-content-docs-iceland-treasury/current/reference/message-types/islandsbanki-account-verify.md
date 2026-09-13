---
id: islandsbanki-account-verify
title: "Islandsbanki.Account.Verify"
sidebar_label: "Islandsbanki.Account.Verify"
sidebar_position: 37
description: "Beiðni- og svarsamningur fyrir Islandsbanki.reikningur.Verify Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks whether an Islandsbanki reikningur exists (ErReikningurTil), optionally validating it against a kennitala.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til confirm a payee reikningur number er valid áður en creating a greiðsla.
- You need til confirm a kennitala og reikningur belong together.

## Beiðni
```json
{
  "account": "0133-26-019507",         // (required*) bank-ledger-account
  "kennitala": "1234567890"            // (optional) validate the account belongs to this national ID
}
```

\* Instead of `account`, you may pass the three numeric parts: `banki`, `hofudbok`, `reikningsnumer`.

## Svar
```json
{
  "status": "Success",
  "exists": true,
  "logEntryNo": 42
}
```

### Svar Reitur notes
- `exists = false` er a normal negative answer (the reikningur eða reikningur+kennitala pair does not exist), not an error.

## Errors
- `Missing required 'account' ...` - no reikningur was supplied.
- `'account' is not in the expected Islandsbanki format ...` - the reikningur string could not be parsed.

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Islandsbanki was blocked ...`, enable **Allow HttpClient Requests** fyrir the extension in Extension Management, og allow `https://ws.isb.is` Ef your environment uses an Endapunktur allowlist.


