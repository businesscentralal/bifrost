---
id: bank-claim-payments
title: "Bank Claim Payments"
---

**Bank Claim Payments** lists every payment against a claim (*krafa*) that a bank reported, with the
claim it pays and the bank account the money arrived on. It is for the accountant who matches customer
payments.

Open it with **Bank Claim Payments** on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/). The same payments show for one
claim under **Claim Payments** on [Bank Claims](/help/iceland-treasury/bank-claims/). The page is
read-only: Bifröst registers each payment once, when the claim payments are read at the bank.

## Fields

| Field | Description |
| --- | --- |
| **Bank** | The bank that reported the payment. |
| **Booking Date** | The day the bank booked the payment. |
| **Claim Account**, **Claim Date** | The claim the payment is for. |
| **Customer No.** | The customer of the claim. |
| **Payor ID** | The kennitala of the payer. |
| **Amount**, **Amount Deposited**, **Total Amount** | The amounts the bank reported for the payment. |
| **Capital Gains Tax** | Capital income tax the bank reported for the payment, if any. |
| **Payment Type** | **Complete** or **Partial**, when the bank says. |
| **Reference** | The payment's reference. |
| **Bank Account No.** | The Business Central bank account the money arrived on, from the claim's payment method. |
| **Posted**, **Document No.**, **Posting Date**, **Journal Template Name**, **Journal Batch Name**, **Journal Line No.**, **Posted At** | For posting in Business Central. Bifröst does not post, so these are blank. |
| **Imported At** | When Bifröst registered the payment. |
| **Claim Entry No.** | The claim on [Bank Claims](/help/iceland-treasury/bank-claims/). Blank when the payment matches no claim Bifröst created. |
| **Entry No.** | The payment's number in Bifröst's tracking. |

## Good to know

- Reading the same payments again never registers them twice.
- **Find entries** (Navigate) on a document also finds the claim payments with its document number and posting date.
- When [Bifröst Language Models](/language-models/) is set up, the **Chat via Bifrost** FactBox on the right
  answers questions about the selected payment.
