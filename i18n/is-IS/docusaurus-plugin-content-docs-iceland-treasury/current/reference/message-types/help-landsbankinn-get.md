---
id: help-landsbankinn-get
title: "Help.Landsbankinn.Get"
sidebar_label: "Help.Landsbankinn.Get"
sidebar_position: 35
description: "Beiðni- og svarsamningur fyrir Help.Landsbankinn.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a short Markdown Yfirlit of the Landsbankinn Connector, listing Allt available message types með Tilgangur og Stefna.

**Stefna:** Outbound  
**Efnisgerð:** text/json

## Notað þegar
- You need til discover the Landsbankinn message types exposed by this connector.
- You want a short Markdown index áður en requesting a fulla per-message guide.
- You eru building an AI assistant og need the next `Help.Implementation.Get` subject til Beiðni.

## Beiðni
No Beiðni body er nauðsynlegt. You may pass an empty JSON object `{}` eða omit the body entirely.

## Svar
Skilar a `result` object með the following fields:

| Reitur | Gerð | Lýsing |
|---|---|---|
| `messageType` | string | Always `"Help.Landsbankinn.Get"`. |
| `format` | string | Always `"markdown"`. |
| `markdown` | string | Markdown table of Allt available message types með Stefna og descriptions. |
| `fullHelpInstructions` | string | How til retrieve per-Gerð technical guides. |

## Getting per-Gerð technical guides

til Sækja the fulla technical guide fyrir any Landsbankinn message Gerð, Kallaðu á `Help.Implementation.Get` með `subject` set til the message Gerð Heiti:

```json
{
  "subject": "Landsbankinn.Payment.Batch"
}
```

## Leiðbeiningar fyrir gervigreind/umboð
Notaðu this message first Þegar you need til discover the available Landsbankinn subjects, then Kallaðu á `Help.Implementation.Get` fyrir the exact Gerð you want til execute. Keep the message Gerð Heiti unchanged, Notaðu the help page as the contract source, og do not guess Beiðni shapes Þegar a per-Gerð guide exists.

### Capability-driven sequence (recommended)
1. **Discover**: Kallaðu á `Help.Landsbankinn.Get` og choose exact target subject.
2. **Contract load**: Kallaðu á `Help.Implementation.Get` fyrir that subject áður en sending business payload.
3. **Pre-check**: Notaðu `Landsbankinn.Account.Verify` fyrir transfer recipients; Notaðu `Landsbankinn.UnpaidInvoice.Query` fyrir claim candidates.
4. **Amount details**: Kallaðu á `Landsbankinn.PaymentSlip.Query` fyrir claim rows áður en constructing greiðsla lines.
5. **Execution**: submit once með `Landsbankinn.Payment.Batch`, then poll með `Landsbankinn.Payment.ResultBatch`.
6. **Tracking evidence**: persist `paymentsId` og `logEntryNo` frá submission og polling calls.

### Proven greiðsla Verkflæði (tested end-til-end)
```
1. UnpaidInvoice.Query { account: "BBBB-HH-NNNNNN" }
   -> returns invoices[] with: registrationNumber, claimAccount, gjalddagi, amountDueNow, hidden, paymentDecision
   -> hidden claims excluded by default (showHidden=false); add showHidden:"true" to include
   -> only consider invoices with paymentDecision != DoNotPay_*

2. PaymentSlip.Query { account: "<claimAccount>", kennitala: "<registrationNumber>", gjalddagi: "<gjalddagi>" }
   -> returns samtals (total payable including fees)

3. Payment.Batch { batches: [{ outAccount: "BBBBHHNNNNNN", lines: [
     { kind: "PaymentSlip", recipientAccount: "<claimAccount 12 digits>", recipientAccountOwnerId: "<registrationNumber>", dueDate: "<gjalddagi>", amount: <samtals> }
   ]}]}
   -> returns paymentsId

4. Payment.ResultBatch { paymentsId: "<id>" }
   -> poll until status != InProgress (terminal: Completed, CompletedWithErrors, NotConfirmed, Cancelled)
```

### Transfer greiðsla (ISK reikningur-til-reikningur)
```
1. Account.Verify { account: "BBBB-HH-NNNNNN", kennitala: "<recipient kt>" } -> exists: true
2. Payment.Batch { batches: [{ outAccount: "BBBBHHNNNNNN", lines: [
     { kind: "Transfer", recipientAccount: "<12 digits>", recipientAccountOwnerId: "<kt>", recipientReference: "<sender kt>", amount: <ISK> }
   ]}]}
```

### Hidden claims management
Table "Lbi Hidden Claim" (PK: ClaimantKt + reikningur + DueDate) tracks claims excluded frá greiðsla suggestions.
- **Hide**: `set_records` on "Lbi Hidden Claim" með primaryKey fields + HiddenBy, HiddenAt, Reason
- **Unhide**: `set_records` setting Reversed=true, ReversedBy, ReversedAt
- **Fyrirspurn visible Aðeins**: `UnpaidInvoice.Query` með default showHidden=false excludes hidden claims
- **Fyrirspurn Allt**: `UnpaidInvoice.Query` með showHidden:"true" includes hidden (marked með hidden=true, paymentDecision=DoNotPay_Hidden)
- Retention policy auto-Eyðir reversed færslur eftir 1 year.

### Bank statement import í BC reconciliation
Notaðu `Finance.BankReconciliation.Create` (not `Statement.Get` directly):
```
call_message_type { type: "Finance.BankReconciliation.Create", subject: "<BC Bank Account No>", data: { statementDate: "YYYY-MM-DD" } }
-> creates Bank Acc. Reconciliation + imports lines from Landsbankinn in one call
-> requires Bank Account.Bank Statement Import Format = "LBI-FEED-IN"
```

### greiðsla batch Reitur names (critical)
- Notaðu `recipientAccount` (NOT inAccount) — 12 digits, no separators
- Notaðu `recipientAccountOwnerId` fyrir kennitala
- Notaðu `recipientReference` fyrir the sender kennitala (visible on statement)
- fyrir PaymentSlip lines: include `dueDate` (gjalddagi frá the unpaid invoice)
- Batch `nameOfBatch` prefixed með * = visible til Allt fyrirtæki users in online bank

### Tracking færslur in agent workflows
Some internal tracking tables may not be readable through generic Data.færslur.Sækja APIs.
Notaðu greiðsla result message types plus `logEntryNo` til read authoritative status/line outcomes.

## Setup áður en calling Landsbankinn

áður en calling bank message types, verify these setup items in Business Central:

1. Search fyrir **Bifrost Setup** og open the **Landsbankinn** section.
2. Set `Lbi Username` til the fyrirtæki-default B2B username.
3. Run **Set fyrirtæki Password** til store the fyrirtæki-default B2B password in IsolatedStorage.
4. Run **Set Certificate** til store the PFX signing certificate og certificate password in IsolatedStorage.
5. Leave `Lbi Transport` = `Live` in production. Test extensions may add other transport values.
6. Notaðu `Request Debug Mode` (on Bifrost Setup) Aðeins during short support sessions. It logs signed SOAP envelopes without password redaction.

Per-user override: search fyrir **Bifrost User Setup**, open the user setup editor, then Notaðu the **Landsbankinn** section til set a personal username og **Set My Landsbankinn Password**. Blank per-user username/password means the fyrirtæki default er used.

Ef authentication fails, check that the username, password, certificate, og certificate password eru stored áður en retrying the bank Kallaðu á. Beiðnin log færslur transport errors og SOAP faults.

## Errors
This message Gerð does not Kallaðu á Landsbankinn og cannot produce transport errors.
The Aðeins error possible er an unsupported message version (verður að be `"1.0"`).

## Troubleshooting - outbound HTTP blocked
Ef a Kallaðu á fails með `The outbound HTTP call to Landsbankinn was blocked by the Business Central environment...`, this er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add outbound allowlist entries based on this help text. Contact your Business Central administrator eða Origo support so they getur verify the correct outbound Endapunktur og apply the change through the normal extension/security review process.


