---
id: arionbanki-claim-queryone
title: "Arionbanki.Claim.QueryOne"
sidebar_label: "Arionbanki.Claim.QueryOne"
sidebar_position: 12
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.QueryOne Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the current state of a stakan Arion banki claim.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Note
`claimDate` er the BC/JSON claim key date og `dueDate` er the final due date. The bank SOAP/XML API uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message Þegar the caller knows the exact `claimant + account + claimDate` key og needs the current claim state frá Arion banki.

## Usage notes
Notaðu exactly one claim key per Kallaðu á, keep the reikningur og claimant values normalized, og keep the claim date in ISO format. Treat the returned claim object as read-Aðeins reference data fyrir downstream workflows such as posting, cancellation, eða status checks.
Persist `logEntryNo` Þegar storing reconciliation evidence.

## Beiðni
```json
{
  "claimant": "1234567",
  "account":  "0133260195661234",
  "claimDate":  "2026-06-30"
}
```

## Svar
Skilar `status`, `logEntryNo`, og a `claim` object með the fulla claim info row (eða omits `claim` Ef not found).
The `claim` object uses `claimDate` fyrir the key date og `dueDate` fyrir the final due date.

## Errors
- `Missing required 'claimant' (5-7 digit Claimant ID)`
- `Missing required 'account' (Bank+Ledger+Account number string)`
- `Missing required 'claimDate' (ISO date YYYY-MM-DD)`
- `Arion banki returned no claim for the supplied keys`

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


