---
id: index
title: "Bifröst Iceland Treasury"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Icelandic bank integrations as Bifröst message types: Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir on a shared IOBS SOAP signer framework."
---

# Bifröst Iceland Treasury

**Your Icelandic banks, inside Business Central.** Fetch statements, send payments and manage
claims (*kröfur*) at Landsbankinn, Arion banki, Íslandsbanki, Kvika banki and Sparisjóðir without
leaving Business Central.

Each bank works the same way through Bifröst, so a routine, an integration or an assistant reaches
every bank in the same way. You set up only the banks you use.

*An additional app on [Bifröst Foundation](/foundation/), for companies in Iceland. New to Bifröst? Start
with [How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Import bank statements into a reconciliation.** At Landsbankinn, Arion banki and Sparisjóðir a
  statement imports straight into **Bank Acc. Reconciliation**, and you see a summary of the lines
  and balances. Landsbankinn and Arion banki can import card transactions the same way.
- **Read statements, accounts and balances.** Read account statements at every bank, and look up
  or verify accounts. Landsbankinn also gives end-of-day balances, and Íslandsbanki securities
  transaction history.
- **Send payments.** Submit domestic payment batches at every bank and collect the result.
  Landsbankinn, Arion banki and Íslandsbanki also take foreign payments.
- **Create and follow up claims (*kröfur*).** Create and cancel claims, change them where the bank
  allows it, and see the payments received against them.
- **Work with cards, documents and rates.** Card transactions and ledger keys at Landsbankinn,
  credit cards at Arion banki and Sparisjóðir, electronic documents at Landsbankinn and Arion
  banki, and currency rates at every bank.
- **Reconcile on a schedule.** Treasury fetches the statement and Foundation's bank reconciliation
  matches it. With [Orchestrator](/orchestrator/) the same routine runs by itself, for example
  every morning, and tells you what did not match. See
  [What it covers, and how it grows](/documentation/how-it-works/#what-it-covers-and-how-it-grows).

## Get it

Install **Bifrost Iceland Treasury** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later, Essentials or Premium.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Make an agreement with each bank for the services you use, and get the user name, password and certificates or keys it issues. | Finance, with the bank |
| 2 | Allow outbound HTTP for Bifröst apps, once, in Foundation's **Bifrost Setup Wizard**. | Business Central administrator |
| 3 | Run **Set up Bifrost Iceland Treasury banks** from **Assisted Setup**. One wizard covers all five banks; enter the company user name and secrets for the banks you use. | Business Central administrator |
| 4 | For claims at Landsbankinn, Arion banki or Sparisjóðir, set the bank's claim identifier on the Payment Method. For statement import, choose the bank's import format on the Business Central bank account. | Business Central administrator |
| 5 | Give each user or service the permission sets for what they may do at the bank. Users who sign in as themselves enter their own bank credentials. | Business Central administrator, then each user |

The step-by-step guides are in the in-product help:
[Treasury Setup Wizard](/help/iceland-treasury/treasury-setup-wizard/),
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/),
[Bank secrets](/help/iceland-treasury/treasury-secrets/),
[Bank credentials for your user](/help/iceland-treasury/bank-user-setup/) and
[Payment Methods](/help/iceland-treasury/payment-methods/).

What each bank needs and covers, per bank: [Landsbankinn](./banks/landsbankinn),
[Arion banki](./banks/arion), [Íslandsbanki](./banks/islandsbanki), [Kvika banki](./banks/kvika)
and [Sparisjóðir](./banks/sparisjodir).

## Good to know

- **It acts as you.** A call uses the user's own bank credentials if they have set them, and
  the company defaults otherwise. Every call is logged.
- **Passwords, certificates and keys** are entered in masked dialogs and stored in Business
  Central's Isolated Storage. They are never written to a table or shown in a response. The setup
  page shows certificate details, so you can see when one needs renewing.
- **Payments and claims move money.** They sit behind their own permission sets, so a user can be
  allowed to read statements without being allowed to pay. Try them in a test company first.
- **Requests are signed.** Landsbankinn, Arion banki, Kvika banki and Sparisjóðir sign each request
  with a client certificate, through Draupnir. Íslandsbanki uses a user name and password only.
- **Moving from the earlier Cloud Events bank apps?** Data is taken over on install, but stored
  passwords and certificates do not carry over. Enter them again after the switch.

## Capabilities and reference

Capabilities: **`Landsbankinn`**, **`Arionbanki`**, **`Islandsbanki`**, **`Sparisjodir`** and
**`Kvikabanki`**, one per bank.

What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [Draupnir signers](./reference/draupnir-signers): how requests to the banks are signed
- [In-product help](/help/iceland-treasury/)
- [AppSource validation scenarios](./user-scenarios) · [AppSource listing text](./listing)
- Permission sets: one per area that reads or moves money at each bank, listed on each bank page.
  A full set per bank extends Foundation's `BIFROST Full ori`, for example `BIFROST LBFull ori`
  for Landsbankinn.
