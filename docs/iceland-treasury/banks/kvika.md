---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 4
description: "What Bifröst Iceland Treasury does with Kvika banki: claims and claim batches, payment batches, account statements and currency rates."
---

This page is for the finance team and the Business Central administrator at a company that banks
with Kvika banki. It explains what the Kvika connector in
[Bifröst Iceland Treasury](/iceland-treasury/) does, what you set up, and what you see in Business
Central afterwards.

## What it does for you

- **Find claims.** Search claims by claimant, period, payer and status, or look up one claim. The
  period can be the due date, final due date, cancellation date or creation date.
- **Create, change and cancel claims in batches.** Kvika takes claim changes in batches only. The bank
  confirms the batch straight away and reports the outcome afterwards, so nothing waits on the bank.
- **Claim payments.** See the payments received against your claims.
- **Payments.** Send batches of account-to-account transfers and claim payments, with a future
  payment date if you want, and choose whether the whole batch is rolled back when one line fails.
  Collect the result afterwards: the status, the errors only, the successful lines, or everything.
- **Statements.** Read an account statement for any account and period.
- **Currency rates.** Kvika's published rates.

You, a scheduled routine or an AI assistant can ask for any of these. The installed operations and
their contracts are read from Business Central itself: the MCP tools `list_message_types` and
`describe_message_type`, or the Bifrost Message Types page.

## What you set up

1. **An agreement with Kvika banki** for the services you use, with a B2B user name, a password and a
   client signing certificate (a `.pfx` file, with its password if it has one).
2. **The Kvika row on Bifrost Iceland Treasury Setup**: leave it enabled, enter the company user name,
   then use **Set Company Password** and **Set Certificate**. See the
   [setup page help](/help/iceland-treasury/treasury-setup/) and
   [Draupnir signers](../reference/draupnir-signers.md).
3. **Personal credentials, if your users have their own login at the bank.** Each user enters their
   own user name and password on **Bifrost User Setup**; see
   [Bank credentials for your user](/help/iceland-treasury/bank-user-setup/). A personal user name
   without a personal password is refused with a clear error, never sent with the company password.
4. **Permissions.** Assign the permission sets below.

| Credential | Kept for | Notes |
| --- | --- | --- |
| Company password | The company | Used when the calling user has no personal credentials. |
| User password | Each user | Used together with the user's own user name. |
| Client certificate and its password | The company | Signs every request. Leave the password empty if the certificate has none. |

All values are entered in masked dialogs and never shown again; see
[Bank secrets](/help/iceland-treasury/treasury-secrets/).

## What you see in Business Central

- The Kvika row on **Bifrost Iceland Treasury Setup** shows whether every secret is in place, and
  the certificate FactBox shows when the certificate expires.
- Every call to the bank is logged on the **Bifrost Request Log**, with the password masked.

## Permission sets

Every Kvika operation needs one of three permission sets, so statement reads can be granted without
payment rights.

| Permission set | Grants |
| --- | --- |
| `BIFROST KVClmPmt ori` | Finding claims, claim batches and their results, and claim payments |
| `BIFROST KVPaymt ori` | Payment batches and their results |
| `BIFROST KVStmt ori` | Statements and currency rates |

`BIFROST KVFull ori` extends Foundation's `BIFROST Full ori`: it is the set behind full access to the
Kvika connector.

## Moving from Cloud Events Kvika banki

Install Bifröst Iceland Treasury beside the old app. On first install it takes over the Kvika
settings (whether the connector is enabled and the company user name), the Kvika fields on standard
Business Central records and the users' permission set assignments, then you can remove the old app.
Data already in the new app is never overwritten.

**Passwords and the client certificate do not carry over.** Enter them once after the switch.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Draupnir signers](../reference/draupnir-signers.md): the client certificate
- [Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/)
