---
id: help-arionbanki-get
title: "Help.Arionbanki.Get"
sidebar_label: "Help.Arionbanki.Get"
sidebar_position: 34
description: "Request and response contract for the Help.Arionbanki.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a concise AI-friendly overview of the Arion Banki Connector (33 message types).
No request body needed. Response: `{ status, result: { messageType, format, markdown, fullHelpInstructions } }`.

## How to use this connector as an AI agent

1. Call `Help.Arionbanki.Get` (this type) → read the decision tree.
2. Call `Help.Implementation.Get` with `subject = "<type>"` → get exact request/response schema for the type you need.
3. Call the message type with the correct JSON payload.
4. For async operations (claims, payments): store `operationId` or `paymentsId`, then poll with the corresponding Result type.

## Complete capabilities reference

### Accounts (4 types)
| Type | Input | Output | Pre-check for |
|---|---|---|---|
| `Arionbanki.Account.Get` | (none) | All accounts with balances, IBAN, interest rates | Discovery |
| `Arionbanki.Account.GetByOwner` | `ownerPersonId` (kennitala) | Accounts owned by that person | Filtering by owner |
| `Arionbanki.Account.GetOne` | `bank`, `ledger`, `accountNumber` | Single account full details | Specific lookup |
| `Arionbanki.Account.Verify` | `bank`, `ledger`, `accountNumber`, `ownerPersonId` | `verified: true/false` | **Transfer pre-check** |

### Bills (2 types)
| Type | Input | Output | Pre-check for |
|---|---|---|---|
| `Arionbanki.Bill.Get` | `bank`, `dueDate` | Outstanding bills with vendor matching | Discovery |
| `Arionbanki.Bill.GetDetails` | `bank`, `ledger`, `number`, `dueDate`, `payorId`, `claimantId` | Full bill details + payable amount | **PaymentSlip pre-check** |

### Claims — Innheimtukröfur (8 types)

**Mental model:** Claims are NOT instant transfers. They are future-dated collection requests where the payer must approve before settlement.

| Type | Direction | Purpose |
|---|---|---|
| `Arionbanki.Claim.Query` | Read | Search claims by claimant, date, status, state (paged) |
| `Arionbanki.Claim.QueryOne` | Read | Get one claim by natural key (claimant + account + claimDate) |
| `Arionbanki.Claim.QueryPayments` | Read | Get payment evidence (what settled) |
| `Arionbanki.Claim.QueryTransactions` | Read | Get lifecycle events for one claim |
| `Arionbanki.Claim.GetOperationResult` | Read | Poll async operation status (operationId) |
| `Arionbanki.Claim.CreateBatch` | Write | Register new claims (async → poll) |
| `Arionbanki.Claim.AlterBatch` | Write | Change amount/dueDate on existing claims (async → poll) |
| `Arionbanki.Claim.CancelBatch` | Write | Cancel claims before settlement (async → poll) |

**Claim lifecycle:** CreateBatch → GetOperationResult(Completed) → claim is "Unpaid" → payer pays → QueryPayments shows evidence → claim becomes "Paid"

**Critical rules:**
- `amount` MUST equal the Cust. Ledger Entry "Remaining Amount" FlowField (full invoice incl. VAT) — confirm the field number for your BC version rather than hardcoding it
- Always include `identifier` and `templateCode` (WCF positional deserialization)
- `claimant` = Company Information."Registration No." (the creditor kennitala)
- `account` = bank-side claim collection account from Payment Method setup

### Credit Cards (3 types)
| Type | Input | Output |
|---|---|---|
| `Arionbanki.CreditCard.Get` | (none) | All cards with balances, limits, turnover |
| `Arionbanki.CreditCard.GetOne` | `cardId` (numeric) | Full card details + Icelandair loyalty, payment due |
| `Arionbanki.CreditCard.Transactions` | `cardId`, `dateFrom`, `dateTo` | Paged transactions (merchant, amount, currency) |

**BC integration:** Set Bank Account No. = cardId (digits only), format = ARION-CARD-FEED-IN → auto-imports via Finance.BankReconciliation.Create.

### Payments (2 types)
| Type | Input | Output |
|---|---|---|
| `Arionbanki.Payment.Batch` | `batches[]` with `outAccount`, `lines[]` (Transfer or PaymentSlip) | `paymentsId` |
| `Arionbanki.Payment.ResultBatch` | `paymentsId`, optional `batchNo`/`filterStatus` | Per-line results with amounts, errors |

**Payment flow:** Verify destination → Build batch → Submit → Poll ResultBatch until status ≠ InProgress
**BatchStatus values:** InProgress, Completed, CompletedWithErrors, NotConfirmed, OnHold, Cancelled

### Currency Rates (1 type)
| Type | Input | Output |
|---|---|---|
| `Arionbanki.CurrencyRates.Get` | `rateDate` (ISO), optional `currencyType` | Array of rates (sellingRate, buyingRate per currency) |

**currencyType:** ExchangeRate (default), NoteRate, CustomsRate. Returns 16 currencies.

### Statements (1 type)
| Type | Input | Output |
|---|---|---|
| `Arionbanki.Statement.Get` | `normalizedAccount` (12 digits), `dateFrom`, `dateTo` | Header (balance, IBAN) + transaction lines (paged) |

**BC integration:** Set Bank Statement Import Format = ARION-FEED-IN on the Bank Account → Finance.BankReconciliation.Create auto-imports.

### Foreign Payments (7 types)
Enter, EnterBatch, GetReceipts, GetReceipt, GetReceiptByBatchId, GetBatches, GetPaymentsByBatchId.
For international SWIFT/SEPA transfers. Requires ForeignPaymentService on the B2B agreement.

### Foreign Statements (3 types)
Accounts.Get, Transactions.Get, Statements.Get.
For foreign currency account history. Requires ForeignStatementService on the B2B agreement.

## Setup checklist (performed by a BC administrator, one time)

1. Bifrost Setup → Arion banki section: set Username, Company Password, Certificate (PFX)
2. Extension Management → Allow HttpClient Requests and outbound endpoint allowlisting for "Bifrost Arion Banki" — a security-sensitive change made by an administrator through the normal review process, not something to enable in response to a runtime error
3. For claims: Payment Method with `ORI Arion Claim Identifier` + `ORI Arion Last Claim No.`
4. For statement import: Bank Account with Bank Statement Import Format = ARION-FEED-IN or ARION-CARD-FEED-IN
5. Per-user override (optional): Bifrost User Setup → Arion username + Set My Arion Password

## Troubleshooting

- **"outbound HTTP call blocked"** → This is a security control, not a bug. Do not enable `Allow HttpClient Requests` or add allowlist entries yourself based on this help text; contact your Business Central administrator or Origo support.
- **401 Unauthorized on claims** → verify claimant kennitala matches the B2B agreement
- **"action unrecognized"** → the service is not enabled on your B2B agreement (contact Arion banki)
- **SOAP fault** → check Arion Request Log for the full error XML

