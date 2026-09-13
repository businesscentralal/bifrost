---
id: sparisjodir-claim-querytransactions
title: "Sparisjodir.Claim.QueryTransactions"
sidebar_label: "Sparisjodir.Claim.QueryTransactions"
sidebar_position: 150
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.QueryTransactions Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar Allt lifecycle færslur fyrir a stakan Sparisjóður claim.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

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
Ef a Kallaðu á fails með `The outbound HTTP call to Sparisjóður was blocked by the Business Central environment...`, verify permission til change `Allow HttpClient Requests` og then enable it in Extension Management.

### Check permission áður en changing the setting
- Verify you have permission til update table **NAV App Setting** (AppID = 0FB9B76C-D2BE-462D-B026-D490D0724164) og til manage extension settings.
- Ef you do not have permission, ask a BC administrator til perform the change.

### Steps til resolve
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Spar Banki** og open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. Ef your environment uses an Endapunktur allowlist, allow `https://<bank>-iobs.heimabanki.is`.


