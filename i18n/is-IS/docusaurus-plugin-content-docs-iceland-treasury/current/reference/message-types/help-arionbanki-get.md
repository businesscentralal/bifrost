---
id: help-arionbanki-get
title: "Help.Arionbanki.Get"
sidebar_label: "Help.Arionbanki.Get"
sidebar_position: 34
description: "Beiðni- og svarsamningur fyrir Help.Arionbanki.Sækja Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a concise AI-friendly Yfirlit of the Arion Banki Connector (33 message types).
No Beiðni body needed. Svar: `{ status, result: { messageType, format, markdown, fullHelpInstructions } }`.

## How til Notaðu this connector as an AI agent

1. Kallaðu á `Help.Arionbanki.Get` (this Gerð) → read the decision tree.
2. Kallaðu á `Help.Implementation.Get` með `subject = "<type>"` → Sækja exact Beiðni/Svar schema fyrir the Gerð you need.
3. Kallaðu á the message Gerð með the correct JSON payload.
4. fyrir async operations (claims, greiðslur): store `operationId` eða `paymentsId`, then poll með the corresponding Result Gerð.

## Complete capabilities reference

### Accounts (4 types)
| Gerð | Input | Output | Pre-check fyrir |
|---|---|---|---|
| `Arionbanki.Account.Get` | (none) | Allt accounts með balances, IBAN, interest rates | Discovery |
| `Arionbanki.Account.GetByOwner` | `ownerPersonId` (kennitala) | Accounts owned by that person | Filtering by owner |
| `Arionbanki.Account.GetOne` | `bank`, `ledger`, `accountNumber` | stakan reikningur fulla details | Specific lookup |
| `Arionbanki.Account.Verify` | `bank`, `ledger`, `accountNumber`, `ownerPersonId` | `verified: true/false` | **Transfer pre-check** |

### Bills (2 types)
| Gerð | Input | Output | Pre-check fyrir |
|---|---|---|---|
| `Arionbanki.Bill.Get` | `bank`, `dueDate` | Outstanding bills með vendor matching | Discovery |
| `Arionbanki.Bill.GetDetails` | `bank`, `ledger`, `number`, `dueDate`, `payorId`, `claimantId` | fulla bill details + payable amount | **PaymentSlip pre-check** |

### Claims — Innheimtukröfur (8 types)

**Mental model:** Claims eru NOT instant transfers. They eru future-dated collection requests where the payer verður að approve áður en settlement.

| Gerð | Stefna | Tilgangur |
|---|---|---|
| `Arionbanki.Claim.Query` | Read | Search claims by claimant, date, status, state (paged) |
| `Arionbanki.Claim.QueryOne` | Read | Sækja one claim by natural key (claimant + reikningur + claimDate) |
| `Arionbanki.Claim.QueryPayments` | Read | Sækja greiðsla evidence (what settled) |
| `Arionbanki.Claim.QueryTransactions` | Read | Sækja lifecycle events fyrir one claim |
| `Arionbanki.Claim.GetOperationResult` | Read | Poll async operation status (operationId) |
| `Arionbanki.Claim.CreateBatch` | Write | Register new claims (async → poll) |
| `Arionbanki.Claim.AlterBatch` | Write | Change amount/dueDate on existing claims (async → poll) |
| `Arionbanki.Claim.CancelBatch` | Write | Cancel claims áður en settlement (async → poll) |

**Claim lifecycle:** CreateBatch → GetOperationResult(Completed) → claim er "Unpaid" → payer pays → QueryPayments shows evidence → claim becomes "Paid"

**Critical rules:**
- `amount` verður að equal the Cust. Ledger Entry "Remaining Amount" FlowField (fulla invoice incl. VAT) — confirm the Reitur number fyrir your BC version rather than hardcoding it
- Always include `identifier` og `templateCode` (WCF positional deserialization)
- `claimant` = fyrirtæki Information."Registration No." (the creditor kennitala)
- `account` = bank-side claim collection reikningur frá greiðsla Aðferð setup

### Credit Cards (3 types)
| Gerð | Input | Output |
|---|---|---|
| `Arionbanki.CreditCard.Get` | (none) | Allt cards með balances, limits, turnover |
| `Arionbanki.CreditCard.GetOne` | `cardId` (numeric) | fulla card details + Icelandair loyalty, greiðsla due |
| `Arionbanki.CreditCard.Transactions` | `cardId`, `dateFrom`, `dateTo` | Paged færslur (merchant, amount, currency) |

**BC integration:** Set bankareikningur No. = cardId (digits Aðeins), format = ARION-CARD-FEED-IN → auto-imports via Finance.BankReconciliation.Create.

### greiðslur (2 types)
| Gerð | Input | Output |
|---|---|---|
| `Arionbanki.Payment.Batch` | `batches[]` með `outAccount`, `lines[]` (Transfer eða PaymentSlip) | `paymentsId` |
| `Arionbanki.Payment.ResultBatch` | `paymentsId`, valfrjálst `batchNo`/`filterStatus` | Per-line results með amounts, errors |

**greiðsla flow:** Verify destination → Build batch → Submit → Poll ResultBatch until status ≠ InProgress
**BatchStatus values:** InProgress, Completed, CompletedWithErrors, NotConfirmed, OnHold, Cancelled

### Currency Rates (1 Gerð)
| Gerð | Input | Output |
|---|---|---|
| `Arionbanki.CurrencyRates.Get` | `rateDate` (ISO), valfrjálst `currencyType` | Array of rates (sellingRate, buyingRate per currency) |

**currencyType:** ExchangeRate (default), NoteRate, CustomsRate. Skilar 16 currencies.

### Statements (1 Gerð)
| Gerð | Input | Output |
|---|---|---|
| `Arionbanki.Statement.Get` | `normalizedAccount` (12 digits), `dateFrom`, `dateTo` | Header (balance, IBAN) + færsla lines (paged) |

**BC integration:** Set Bank Statement Import Format = ARION-FEED-IN on the bankareikningur → Finance.BankReconciliation.Create auto-imports.

### Foreign greiðslur (7 types)
Enter, EnterBatch, GetReceipts, GetReceipt, GetReceiptByBatchId, GetBatches, GetPaymentsByBatchId.
fyrir international SWIFT/SEPA transfers. Requires ForeignPaymentService on the B2B agreement.

### Foreign Statements (3 types)
Accounts.Sækja, færslur.Sækja, Statements.Sækja.
fyrir foreign currency reikningur history. Requires ForeignStatementService on the B2B agreement.

## Setup checklist (performed by a BC administrator, one time)

1. Bifrost Setup → Arion banki section: set Username, fyrirtæki Password, Certificate (PFX)
2. Extension Management → Allow HttpClient Requests og outbound Endapunktur allowlisting fyrir "Bifrost Arion Banki" — a security-sensitive change made by an administrator through the normal review process, not something til enable in Svar til a runtime error
3. fyrir claims: greiðsla Aðferð með `ORI Arion Claim Identifier` + `ORI Arion Last Claim No.`
4. fyrir statement import: bankareikningur með Bank Statement Import Format = ARION-FEED-IN eða ARION-CARD-FEED-IN
5. Per-user override (valfrjálst): Bifrost User Setup → Arion username + Set My Arion Password

## Troubleshooting

- **"outbound HTTP Kallaðu á blocked"** → This er a security control, not a bug. Do not enable `Allow HttpClient Requests` eða add allowlist entries yourself based on this help text; contact your Business Central administrator eða Origo support.
- **401 Unauthorized on claims** → verify claimant kennitala matches the B2B agreement
- **"action unrecognized"** → the service er not enabled on your B2B agreement (contact Arion banki)
- **SOAP fault** → check Arion Beiðni Log fyrir the fulla error XML


