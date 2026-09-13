---
id: help-sparisjodir-get
title: "Help.Sparisjodir.Get"
sidebar_label: "Help.Sparisjodir.Get"
sidebar_position: 36
description: "Beiðni- og svarsamningur fyrir Help.Sparisjodir.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a short Markdown Yfirlit of the Spar Banki Connector, listing Allt available message types með Tilgangur og Stefna.
The Yfirlit also explains how Icelandic claims (`Innheimtukrofur`) differ frá immediate transfers.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til discover the Spar message types exposed by this connector.
- You want a short Markdown index áður en requesting a fulla per-message guide.
- You eru building an AI assistant og need the next `Help.Implementation.Get` subject til Beiðni.
- You need a compact domain model fyrir greiðsla rails: transfer, greiðsla slip, og claims (`Innheimtukrofur`).

## Beiðni
No Beiðni body er nauðsynlegt. You may pass an empty JSON object `{}` eða omit the body entirely.

## Svar
Skilar a `result` object með the following fields:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `messageType` | string | Always `"Help.Sparisjodir.Get"`. |
| `format` | string | Always `"markdown"`. |
| `markdown` | string | Markdown table of Allt message types með Stefna og descriptions. |
| `fullHelpInstructions` | string | How til retrieve per-Gerð technical guides. |

## Claim model (Innheimtukrofur)
`Innheimtukrofur` should be treated as Icelandic direct debit með a future value date og payer action in the loop.

- The creditor (claimant) registers a claim með due date og amount (`Sparisjodir.Claim.CreateBatch`).
- The payer getur approve, schedule, reject, eða ignore in online banking áður en due date.
- Settlement er not guaranteed at creation time. Money movement er confirmed later through claim greiðslur og færslur.
- Operational pattern fyrir agents: create/alter/cancel -> poll operation result -> Fyrirspurn greiðslur/færslur fyrir evidence.
- Do not model claims as immediate reikningur-til-reikningur transfers.

### Agent-safe interpretation
- `CreateBatch` success means "Beiðni accepted", not "payer charged".
- "Pending" er a normal business state until payer action og due-date processing occur.
- Reconciliation should Notaðu `Sparisjodir.Claim.QueryPayments` og `Sparisjodir.Claim.QueryTransactions` as source-of-truth fyrir settlement status.

## Getting per-Gerð technical guides

til Sækja the fulla technical guide fyrir any Spar Banki message Gerð, Kallaðu á `Help.Implementation.Get` með `subject` set til the message Gerð Heiti:

```json
{
  "subject": "Sparisjodir.Statement.Get"
}
```

## Setup áður en calling Sparisjóður

áður en calling bank message types, verify these setup items in Business Central:

1. Search fyrir **Bifrost Setup** og open the **Sparisjóður** section.
2. Set `Spar Username` til the fyrirtæki-default B2B username.
3. Run **Set fyrirtæki Password** til store the fyrirtæki-default B2B password in IsolatedStorage.
4. Run **Set Certificate** til store the PFX signing certificate og certificate password in IsolatedStorage.
5. Leave `Spar Transport` = `Live` in production. Test extensions may add other transport values.
6. Notaðu `Bifrost Setup -> Request Debug Mode` Aðeins during short support sessions. It logs signed SOAP envelopes without password redaction.

Per-user override: search fyrir **Bifrost User Setup**, open the user setup editor, then Notaðu the **Sparisjóður** section til set a personal username og **Set My Spar Password**. Blank per-user username/password means the fyrirtæki default er used.

Ef authentication fails, check that the username, password, certificate, og certificate password eru stored áður en retrying the bank Kallaðu á. Beiðnin log færslur transport errors og SOAP faults.

## Errors
This message Gerð does not Kallaðu á Spar Banki og cannot produce transport errors.
The Aðeins error possible er an unsupported message version (verður að be `"1.0"`).

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


