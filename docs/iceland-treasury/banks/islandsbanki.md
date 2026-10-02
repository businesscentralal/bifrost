---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 3
description: "What Bifröst Iceland Treasury does with Íslandsbanki: statements, rates, account checks, domestic and foreign payments, claims, milliinnheimta, file delivery and securities."
---

This page is for the finance team and the Business Central administrator at a company that banks
with Íslandsbanki. It explains what the Íslandsbanki connector in
[Bifröst Iceland Treasury](/iceland-treasury/) does, what you set up, and what you see in Business
Central afterwards.

Íslandsbanki is the one bank in the app that needs no client certificate: it authenticates with a
user name and password over an encrypted connection.

## What it does for you

- **Statements and rates.** Read an account statement for any account and period, and the bank's
  exchange rates for a date and rate type.
- **Account checks.** Verify that an account exists, optionally together with its owner's kennitala,
  and list the unpaid claims, giro slips, bonds and bills a kennitala owes.
- **Domestic payments.** Register a batch of transfers, have the bank check it, release it and
  collect the result. Transfer an amount onto a debit card.
- **Claims.** Create and cancel collection claims, look one up, list claims for a claimant by due
  date and state, and see the payments received against a claim.
- ***Milliinnheimta*.** List intermediary-collection claims and payments for a period, and return a
  claim from intermediary collection.
- **Foreign payments.** Register a batch, review the bank's quote and charges, confirm it and
  collect the result.
- **File delivery.** Send a file into the bank's presentment system.
- **Securities.** Read securities transaction history for a period.

Payments are two-stage: what you register is not executed until it is released (domestic) or
confirmed (foreign), and the bank identifies the work by a batch number you can come back with.

You, a scheduled routine or an AI assistant can ask for any of these. The installed operations and
their contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.

## What you set up

1. **An agreement with Íslandsbanki** for the services you use, with a B2B user name and password,
   and the bank's own public certificate.
2. **The Íslandsbanki row on Bifrost Iceland Treasury Setup**: leave it enabled, enter the company
   user name, then use **Set Company Password** and **Set Bank Certificate**. The client certificate
   action stays disabled for this bank. See the
   [setup page help](/help/iceland-treasury/treasury-setup/).
3. **Personal credentials, if your users have their own login at the bank.** Each user enters their
   own user name and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/). A personal user name
   without a personal password is refused with a clear error, never sent with the company password.
4. **Permissions.** Assign the permission sets below.

| Credential | Kept for | Notes |
| --- | --- | --- |
| Company password | The company | Used when the calling user has no personal credentials. |
| User password | Each user | Used together with the user's own user name. |
| Bank certificate | The company | The bank's public certificate. |

All values are entered in masked dialogs and never shown again; see
[Bank secrets](/help/iceland-treasury/treasury-secrets/).

## What you see in Business Central

- The Íslandsbanki row on **Bifrost Iceland Treasury Setup** shows whether every secret is in place.
  Its certificate FactBox says the bank uses no client certificate.
- Every call to the bank is logged on the **Bifrost Request Log**, with the password masked.

## Permission sets

Registering and executing payments, and creating or cancelling claims, need their own permission
sets. Reading statements, rates, claims and payment results needs nothing beyond general Bifröst
access, so a routine that only collects results does not need payment rights.

| Permission set | Grants |
| --- | --- |
| `BIFROST IBPaymt ori` | Registering and releasing domestic payment batches, and debit card transfers |
| `BIFROST IBClaim ori` | Creating and cancelling claims, and returning a claim from intermediary collection |
| `BIFROST IBFrgPay ori` | Registering and confirming foreign payments |

`BIFROST IBFull ori` extends Foundation's `BIFROST Full ori`: it is the set behind full access to the
Íslandsbanki connector.

## Moving from Cloud Events Íslandsbanki

Install Bifröst Iceland Treasury beside the old app. On first install it takes over the company user
name, the Íslandsbanki settings and the users' permission set assignments, then you can remove the
old app. Data already in the new app is never overwritten.

**Passwords and the bank certificate do not carry over.** Enter them once after the switch.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
