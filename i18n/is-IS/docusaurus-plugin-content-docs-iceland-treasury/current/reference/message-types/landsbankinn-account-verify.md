---
id: landsbankinn-account-verify
title: "Landsbankinn.Account.Verify"
sidebar_label: "Landsbankinn.Account.Verify"
sidebar_position: 75
description: "Beiðni- og svarsamningur fyrir Landsbankinn.reikningur.Verify Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Checks whether an reikningur exists at Landsbankinn via the Landsbankaskema `LI_Fyrirspurn_er_reikningur_til` operation.

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Schema:** Landsbankaskema `LI_Fyrirspurn_er_reikningur_til` (process.ashx)

## Notað þegar
- You need til validate an reikningur number áður en posting a greiðsla eða claim against it.

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu one reikningur og one kennitala pair per Kallaðu á. Normalize dashes og spaces áður en sending, og treat a false/failed Svar as a verification result rather than a formatting exception unless the bank explicitly Skilar an input error.

Pre-check policy fyrir greiðsla batches: Notaðu this verify Kallaðu á fyrir **transfer lines** áður en `Landsbankinn.Payment.Batch`.
fyrir claim/greiðsla-slip lines, Notaðu `Landsbankinn.UnpaidInvoice.Query` + `Landsbankinn.PaymentSlip.Query` (not reikningur-verify) as the primary pre-check Slóð.

## Beiðni
```json
{
  "account":   "0133-26-019507", // (required) branch-ledger-number; dashes optional
  "kennitala": "6306251060"       // (required) account owner registration number; dashes optional
}
```

## Svar
```json
{
  "status": "Success",
  "account": "0133-26-019507",
  "exists": true
}
```

## Errors
- `Missing required 'account'` - the `account` property er missing.
- `'account' must be ... branch-ledger-number` - the reikningur could not be split í 4-2-6 parts.
- `The bank rejected the LI_Fyrirspurn_er_reikningur_til request ...` - the bank returned a fault.

## Authentication
Landsbankaskema uses a session login með the same username og password configured fyrir the other Landsbankinn services. The session token er acquired og cached sjálfkrafa.


