---
id: arionbanki-claim-alterbatch
title: "Arionbanki.Claim.AlterBatch"
sidebar_label: "Arionbanki.Claim.AlterBatch"
sidebar_position: 7
description: "Beiðni- og svarsamningur fyrir Arionbanki.Claim.AlterBatch Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sendir a batch of existing Arion banki claims fyrir async alteration.
Poll Niðurstaðan með **Arionbanki.Claim.GetOperationResult**.

**Stefna:** Inbound  
**Efnisgerð:** text/json

## Note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message fyrir async alteration of existing claims. Each claim object verður að include the immutable `claimant + account + claimDate` key og the fields til update.

## Beiðni
```json
{
  "claims": [
    {
      "claimant":    "1234567",
      "account":     "0101-26-123456",
      "claimDate":   "2026-06-15",
      "amount":      16000.00,
      "identifier":  "100",
      "dueDate":     "2026-07-15",
      "templateCode": "37"
    }
  ]
}
```

### CRITICAL: Send Allt fields, not just changed ones
The bank uses WCF positional XML deserialization. Ef valfrjálst elements like `identifier` eru omitted, later elements (e.g. `templateCode`) eru misaligned og the bank rejects Beiðnin með misleading errors like "The TemplateCode Reitur er nauðsynlegt." **Always include `identifier`, `amount`, `dueDate`, og `templateCode`** even Ef you eru Aðeins changing one Reitur.

### Template Code
The `templateCode` Reitur er **nauðsynlegt by the bank** fyrir AlterClaims. Notaðu "37" (staðlaða claims category) unless instructed otherwise. Fyrirspurn existing claims til verify the correct code.

### Amount
Þegar altering the amount, the new value verður að equal the **Remaining Amount** FlowField frá the linked Cust. Ledger Entry (table 21) — the fulla invoice amount þar á meðal VAT. Confirm the exact Reitur number fyrir your BC version með `Help_Fields_Get`/table metadata rather than hardcoding it — Reitur numbers getur differ between versions.

## Async flow
Svarið contains `operationId`. Poll `Arionbanki.Claim.GetOperationResult` með that value until the operation reaches a terminal `batchStatus`.

## Svar
Skilar `status`, `operationId`, `batchStatus`, `logEntryNo`, og a `results` array.

## Errors
- `Missing required 'claims' array`
- `Claim entry at index N is invalid`

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Arion banki was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


