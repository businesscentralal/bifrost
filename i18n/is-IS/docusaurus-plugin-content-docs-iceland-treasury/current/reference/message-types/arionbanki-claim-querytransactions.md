---
id: arionbanki-claim-querytransactions
title: "Arionbanki.Claim.QueryTransactions"
sidebar_label: "Arionbanki.Claim.QueryTransactions"
sidebar_position: 14
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.QueryTransactions Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar Allt lifecycle færslur fyrir a stakan Arion banki claim.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Note
`claimDate` er the BC/JSON claim key date og `dueDate` er the final due date. The bank SOAP/XML API uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message til inspect the lifecycle/greiðsla færslur fyrir one claim. Beiðnin identifies the claim by the natural key Aðeins.

## Beiðni (Allt fields nauðsynlegt)
```json
{
  "claimant": "1234567",
  "account":  "0101-26-123456",
  "claimDate":  "2026-06-15"
}
```

## Svar
Skilar `status`, `returned`, `totalCount`, `logEntryNo`, og a `transactions` array.
Each færsla object contains: `key` (claimant/reikningur/claimDate), `transactionDate`,
`amount`, `type`, `reference`, `payorId`, `bookingDate`, `description`.
Notaðu this Svar til reconcile what happened til a claim eftir creation, alteration, cancellation, greiðsla, eða collection handling.

## Errors
- `Missing required 'claimant', 'account' and 'claimDate' to identify the claim`
- `'claimDate' must be an ISO date YYYY-MM-DD`

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


