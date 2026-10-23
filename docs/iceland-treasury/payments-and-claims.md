---
id: payments-and-claims
title: "Payments and claims"
sidebar_label: "Payments and claims"
sidebar_position: 2
description: "How Bifröst Iceland Treasury registers payment batches for approval at the bank, confirms payments from the bank statement, and creates and follows claims (kröfur) and their payments."
---

# Payments and claims

This page is for the finance team that pays suppliers and collects from customers through Bifröst
Iceland Treasury. It explains what happens from the moment a payment batch or a claim is sent to the
bank until it is paid, and where you see each step in Business Central.

## A payment batch, start to finish

1. **Register the batch.** An assistant, an integration or a routine registers the batch at the bank:
   the account it is paid from, and each payment with its recipient, amount and reference. Domestic
   (ISK) batches go to Arion banki or Landsbankinn, foreign payment batches to any of the banks.
   Bifröst checks the batch before it calls the bank: a name that contains *STP* is refused, and so is a
   date of forward payment in the past. When no date is given, the batch is for today.
2. **Approve and pay it at the bank.** The batch now waits in the bank's online banking. A person at
   your company with the right to approve payments there approves it and the bank pays it. Bifröst
   never approves, signs or pays a batch. Start the batch name with `*` so that this person sees it:
   without it, the online bank shows the batch only to the web service user who registered it.
3. **Follow the result.** Reading the batch's result at the bank updates its status in Business
   Central: awaiting approval, in progress, completed, completed with errors, cancelled. A payment the
   bank refused shows its error, and the refused payments can be registered again as a new batch.
4. **See that it is paid.** A payment is paid when the statement of the account it is paid from shows
   it. Every statement Bifröst reads, and every bank reconciliation import, is checked against the open
   payments of that account: a matching debit marks the payment **Paid**, with the statement reference,
   so the same transaction is never matched twice. A credit on a recipient's account of the same amount
   confirms a payment too.

### Choices on a batch

- **One withdrawal for the batch.** The bank can take the batch total from the paying account in one
  withdrawal (one statement line), or one withdrawal per payment (one line each, the default).
- **What the payment is for.** A payment can name the Business Central record it pays: a posted purchase
  invoice, a vendor or customer ledger entry, a vendor, a payment journal line, a G/L account or a bank
  account. Bifröst checks that the record exists before it calls the bank, and keeps it on the payment.
  It is never sent to the bank.
- **Foreign payments need a Central Bank category key** (*flokkunarlykill*) for each payment, which
  tells the Central Bank of Iceland what the payment is for. Landsbankinn takes the three-letter keys,
  for example `VAR` for goods, `THJ` for services, `INN` for a transfer to an account in your own name
  and `LAU` for salary. Arion banki and Íslandsbanki take the older numeric keys, for example `099` for
  other goods trade, `350` for other business services, `305` for computer and information services
  and `421` for wages. A key the bank does not take is refused before the bank is called.

### Where you see it

- [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/): every batch Bifröst registered,
  its status at the bank, its payments and their charges.
- [Bank Payments](/help/iceland-treasury/bank-payments/): single payments, opened from **Find entries** (Navigate).
- [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/): every action at a bank, with the
  status after it.

## A claim, start to finish

1. **Set up the collection agreement.** Each collection agreement with a bank is a **Payment Method**
   with the bank's claim identifier and the last claim number used. See
   [Payment Methods](/help/iceland-treasury/payment-methods/).
2. **Create the claim.** An assistant, an integration or a routine creates the claim at the bank: the
   payer, amount, claim date and due date, and optionally the customer, the customer ledger entries it
   collects and the payment method. Bifröst checks the customer, the entries and the payment method
   before it calls the bank. At Arion banki and Íslandsbanki claims are created, changed and cancelled in
   batches: the bank accepts the batch first and reports each claim's outcome afterwards. At Landsbankinn
   a claim is created under one of your claim templates and confirmed at once.
3. **Follow it.** The claim and its ledger entries are kept in Business Central, and the customer ledger
   entry shows the claim's account, date and status in its FactBox. Changing or cancelling the claim at
   the bank updates it.
4. **Register the payments.** Reading the claim payments at the bank registers each payment once,
   against its claim. A claim is **Partially Paid** or **Paid** only from the payments registered against
   it, and **Expired** when the bank's cancellation date has passed. When the bank reports a cancelled
   claim as open again, for example because it was reactivated in the online bank, the claim reopens.

### Where you see it

- [Bank Claims](/help/iceland-treasury/bank-claims/): every claim, with its ledger entries and payments.
- [Bank Claim Batches](/help/iceland-treasury/bank-claim-batches/): every batch of claims sent to a bank.
- [Bank Claim Payments](/help/iceland-treasury/bank-claim-payments/): every payment the banks reported.
- The [Customer Ledger Entry Details FactBox](/help/iceland-treasury/customer-ledger-factbox/).

## Posting

The tracking pages have fields for posting in Business Central: document number, posting date,
journal template, batch and line, and **Posted**. Bifröst Iceland Treasury does not post payments or
claim payments, so these fields are blank. Post payments and claim payments in Business Central as you
do today. The bank account each batch is paid from, and each claim is paid into, is shown so you can
find them.

## Next steps

- The bank pages: [Arion banki](/iceland-treasury/banks/arion/) · [Íslandsbanki](/iceland-treasury/banks/islandsbanki/) ·
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/)
- [Permission sets](/iceland-treasury/#permissions) for payments and claims
