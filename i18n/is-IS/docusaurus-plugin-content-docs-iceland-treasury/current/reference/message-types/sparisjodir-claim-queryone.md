---
id: sparisjodir-claim-queryone
title: "Sparisjodir.Claim.QueryOne"
sidebar_label: "Sparisjodir.Claim.QueryOne"
sidebar_position: 148
description: "Beiðni- og svarsamningur fyrir Sparisjodir.Claim.QueryOne Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir the current state of a stakan Sparisjóður claim.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## AI note
Notaðu `claimDate` fyrir the BC/JSON claim key date og `dueDate` fyrir the BC/JSON final due date. The bank SOAP/XML API still uses `ct:DueDate` fyrir the claim key date og `ct:FinalDueDate` fyrir the final due date; do not rename those XML elements Þegar generating bank-integration Dæmi.

## Notað þegar
Notaðu this message Þegar the caller knows the exact `claimant + account + claimDate` key og needs the current claim state frá Sparisjóður.

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
- `Sparisjóður returned no claim for the supplied keys`

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


