---
id: help-landsbankinn-get
title: "Help.Landsbankinn.Get"
sidebar_label: "Help.Landsbankinn.Get"
sidebar_position: 35
description: "Request and response contract for the Help.Landsbankinn.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a short Markdown overview of the Landsbankinn Connector, listing all available message types with purpose and direction.

**Direction:** Outbound  
**Content-Type:** text/json

## Use when
- You need to discover the Landsbankinn message types exposed by this connector.
- You want a short Markdown index before requesting a full per-message guide.
- You are building an AI assistant and need the next `Help.Implementation.Get` subject to request.

## Request
No request body is required. You may pass an empty JSON object `{}` or omit the body entirely.

## Response
Returns a `result` object with the following fields:

| Field | Type | Description |
|---|---|---|
| `messageType` | string | Always `"Help.Landsbankinn.Get"`. |
| `format` | string | Always `"markdown"`. |
| `markdown` | string | Markdown table of all available message types with direction and descriptions. |
| `fullHelpInstructions` | string | How to retrieve per-type technical guides. |

## Getting per-type technical guides

To get the full technical guide for any Landsbankinn message type, call `Help.Implementation.Get` with `subject` set to the message type name:

```json
{
  "subject": "Landsbankinn.Payment.Batch"
}
```

## AI/Agent playbook
Use this message first when you need to discover the available Landsbankinn subjects, then call `Help.Implementation.Get` for the exact type you want to execute. Keep the message type name unchanged, use the help page as the contract source, and do not guess request shapes when a per-type guide exists.

### Capability-driven sequence (recommended)
1. **Discover**: call `Help.Landsbankinn.Get` and choose exact target subject.
2. **Contract load**: call `Help.Implementation.Get` for that subject before sending business payload.
3. **Pre-check**: use `Landsbankinn.Account.Verify` for transfer recipients; use `Landsbankinn.UnpaidInvoice.Query` for claim candidates.
4. **Amount details**: call `Landsbankinn.PaymentSlip.Query` for claim rows before constructing payment lines.
5. **Execution**: submit once with `Landsbankinn.Payment.Batch`, then poll with `Landsbankinn.Payment.ResultBatch`.
6. **Tracking evidence**: persist `paymentsId` and `logEntryNo` from submission and polling calls.

### Proven payment workflow (tested end-to-end)
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

### Transfer payment (ISK account-to-account)
```
1. Account.Verify { account: "BBBB-HH-NNNNNN", kennitala: "<recipient kt>" } -> exists: true
2. Payment.Batch { batches: [{ outAccount: "BBBBHHNNNNNN", lines: [
     { kind: "Transfer", recipientAccount: "<12 digits>", recipientAccountOwnerId: "<kt>", recipientReference: "<sender kt>", amount: <ISK> }
   ]}]}
```

### Hidden claims management
Table "Lbi Hidden Claim" (PK: ClaimantKt + Account + DueDate) tracks claims excluded from payment suggestions.
- **Hide**: `set_records` on "Lbi Hidden Claim" with primaryKey fields + HiddenBy, HiddenAt, Reason
- **Unhide**: `set_records` setting Reversed=true, ReversedBy, ReversedAt
- **Query visible only**: `UnpaidInvoice.Query` with default showHidden=false excludes hidden claims
- **Query all**: `UnpaidInvoice.Query` with showHidden:"true" includes hidden (marked with hidden=true, paymentDecision=DoNotPay_Hidden)
- Retention policy auto-deletes reversed records after 1 year.

### Bank statement import into BC reconciliation
Use `Finance.BankReconciliation.Create` (not `Statement.Get` directly):
```
call_message_type { type: "Finance.BankReconciliation.Create", subject: "<BC Bank Account No>", data: { statementDate: "YYYY-MM-DD" } }
-> creates Bank Acc. Reconciliation + imports lines from Landsbankinn in one call
-> requires Bank Account.Bank Statement Import Format = "LBI-FEED-IN"
```

### Payment batch field names (critical)
- Use `recipientAccount` (NOT inAccount) — 12 digits, no separators
- Use `recipientAccountOwnerId` for kennitala
- Use `recipientReference` for the sender kennitala (visible on statement)
- For PaymentSlip lines: include `dueDate` (gjalddagi from the unpaid invoice)
- Batch `nameOfBatch` prefixed with * = visible to all company users in online bank

### Tracking records in agent workflows
Some internal tracking tables may not be readable through generic Data.Records.Get APIs.
Use payment result message types plus `logEntryNo` to read authoritative status/line outcomes.

## Setup before calling Landsbankinn

Before calling bank message types, verify these setup items in Business Central:

1. Search for **Bifrost Setup** and open the **Landsbankinn** section.
2. Set `Lbi Username` to the company-default B2B username.
3. Run **Set Company Password** to store the company-default B2B password in IsolatedStorage.
4. Run **Set Certificate** to store the PFX signing certificate and certificate password in IsolatedStorage.
5. Leave `Lbi Transport` = `Live` in production. Test extensions may add other transport values.
6. Use `Request Debug Mode` (on Bifrost Setup) only during short support sessions. It logs signed SOAP envelopes without password redaction.

Per-user override: search for **Bifrost User Setup**, open the user setup editor, then use the **Landsbankinn** section to set a personal username and **Set My Landsbankinn Password**. Blank per-user username/password means the company default is used.

If authentication fails, check that the username, password, certificate, and certificate password are stored before retrying the bank call. The request log records transport errors and SOAP faults.

## Errors
This message type does not call Landsbankinn and cannot produce transport errors.
The only error possible is an unsupported message version (must be `"1.0"`).

## Troubleshooting - outbound HTTP blocked
If a call fails with `The outbound HTTP call to Landsbankinn was blocked by the Business Central environment...`, this is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add outbound allowlist entries based on this help text. Contact your Business Central administrator or Origo support so they can verify the correct outbound endpoint and apply the change through the normal extension/security review process.

