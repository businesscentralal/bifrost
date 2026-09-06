---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 3
description: "Twenty-three message types over the Íslandsbanki B2B SOAP services: statements, rates, payments, claims, milliinnheimta, foreign payments, file delivery and securities."
---

The Íslandsbanki module connects Business Central to the bank's B2B SOAP services. It exposes twenty-three message types covering account statements, currency rates, account verification, unpaid invoices, domestic and foreign payments, direct collection claims, *milliinnheimta*, presentment-file delivery and securities transaction history.

Íslandsbanki is the one bank in Iceland Treasury that signs nothing. Its transport sends a WS-Security UsernameToken over TLS, so the module never loads a client certificate. It stores the bank's own public certificate instead, and that is the only certificate it holds.

## What it covers

| Area | What the module does |
| --- | --- |
| **Statements and rates** | Reads an account statement for an account and date span with skip/take paging, and the bank's published exchange rates for a date and rate type. |
| **Account checks** | Verifies that an account exists, optionally against an owner's registration number, and lists the unpaid claims, giro slips, bonds and bills owed by a registration number. |
| **Domestic payments** | Registers an interbank transfer batch, error-checks it, executes it and collects the result. Also transfers an amount onto a debit card. |
| **Claims** | Creates and cancels single collection claims, fetches one claim by its identity, lists claims for a claimant over a due-date span and state, and lists the payments received against a claim. |
| **Milliinnheimta** | Lists intermediary-collection claims and payments for a claimant over a date span, and returns a claim from intermediary collection. |
| **Foreign payments** | Registers a cross-border payment batch, fetches the quote and charges for it, confirms it and collects the result. |
| **File delivery** | Sends a Base64-encoded file into the bank's presentment system. |
| **Securities** | Returns securities transaction history for an identifier over a date span. |

Every call is written to Foundation's shared Bifröst Request Log with the log type `Islandsbanki`. The WS-Security password element is redacted from the logged envelope unless Request Debug Mode is switched on in Bifröst Setup.

## Message types

Each type below has a generated page in the [message type reference](/iceland-treasury/reference/message-types/), which carries the full request and response contract, the validation errors and the access rules. The same contract is available at runtime through `Help.Implementation.Get`.

| Type | What it does |
| --- | --- |
| `Islandsbanki.Statement.Get` | Retrieves an account statement for an account and date span, with skip/take paging. |
| `Islandsbanki.CurrencyRates.Get` | Retrieves exchange rates for a given date and rate type. |
| `Islandsbanki.Account.Verify` | Checks whether an account, and optionally an owner registration number, exists. |
| `Islandsbanki.UnpaidInvoice.Query` | Lists the unpaid claims, giro slips, bonds and bills owed by a registration number. |
| `Islandsbanki.Payment.Batch` | Registers a batch of interbank transfers and returns the bank batch number. Gated. |
| `Islandsbanki.Payment.Validate` | Error-checks a registered payment batch by batch number. |
| `Islandsbanki.Payment.Execute` | Executes a registered payment batch by batch number. Gated. |
| `Islandsbanki.Payment.Result` | Fetches the status and result of a payment batch by batch number. |
| `Islandsbanki.DebitCard.Transfer` | Transfers an amount onto a debit card. Gated. |
| `Islandsbanki.Claim.Create` | Creates a single collection claim. Gated. |
| `Islandsbanki.Claim.Cancel` | Cancels a collection claim. Gated. |
| `Islandsbanki.Claim.Get` | Fetches a single claim by its identity. |
| `Islandsbanki.Claim.Query` | Lists claims for a claimant over a due-date span and state. |
| `Islandsbanki.Claim.QueryPayments` | Lists the payments received against one claim. |
| `Islandsbanki.Milliinnheimta.Claim.Query` | Lists intermediary-collection claims for a claimant over a date span. |
| `Islandsbanki.Milliinnheimta.Payment.Query` | Lists intermediary-collection payments for a claimant over a date span. |
| `Islandsbanki.Milliinnheimta.Claim.Return` | Returns a claim from intermediary collection. Gated. |
| `Islandsbanki.ForeignPayment.Register` | Registers a batch of foreign payments and returns the bank batch number. Gated. |
| `Islandsbanki.ForeignPayment.Rates` | Fetches the rates, quote and service charges for a registered foreign-payment batch. |
| `Islandsbanki.ForeignPayment.Confirm` | Confirms and executes a registered foreign-payment batch. Gated. |
| `Islandsbanki.ForeignPayment.Result` | Fetches the result and status of a foreign-payment batch. |
| `Islandsbanki.File.Send` | Sends a Base64-encoded file into the presentment system. |
| `Islandsbanki.Securities.TransactionHistory` | Returns securities transaction history for an identifier over a date span. |

## Setting up

Íslandsbanki is configured from the shared **Bifröst Treasury Setup** page, which lists all five banks in one place. The row for Íslandsbanki carries the enabled flag, the company user name, an optional base-URL override and the transport selection. See the [Treasury Setup help](/help/iceland-treasury/treasury-setup/) for the page itself.

Íslandsbanki uses three of the shared bank secrets:

| Secret | Scope | Purpose |
| --- | --- | --- |
| Company password | Company | The password for the company user name. Used when the caller has no personal credentials. |
| User password | Company and user | The password for a caller's personal user name. |
| Bank certificate | Company | The bank's own public certificate. |

There is no client certificate and no certificate password for this bank. Those actions stay switched off on the setup page, because the transport signs nothing. Secrets are held in the extension's own Isolated Storage, never in a table, telemetry entry or error message. See the [secrets help](/help/iceland-treasury/treasury-secrets/) for how to store and clear them.

A caller can authenticate as themselves rather than as the company. A personal user name is entered on **Bifröst User Setup**, and the personal password is stored against the same record; see the [user setup help](/help/iceland-treasury/bank-user-setup/). Name and password must match in scope: if a personal user name is set without a personal password, the call fails with an explicit error rather than falling back to the company password.

## Batch operations

Payments and foreign payments are two-stage. The bank does not execute what you register until you tell it to, and it identifies the work by a batch number rather than by an operation id.

- **Domestic payments.** `Payment.Batch` registers the transfers and returns the bank batch number. `Payment.Validate` error-checks that batch, `Payment.Execute` releases it, and `Payment.Result` reports what happened to it. A caller keeps the batch number and comes back for the result; it does not block waiting for the bank.
- **Foreign payments.** `ForeignPayment.Register` returns the batch number, `ForeignPayment.Rates` returns the quote and service charges for review, `ForeignPayment.Confirm` executes the batch and `ForeignPayment.Result` reports the outcome.

Registering and confirming are separately gated from reading the result, so a process that only collects outcomes needs no payment permission.

## Permission sets

Money- and state-moving message types sit behind gate tables. Each gate is an empty table, and the permission set that grants write access to it is the permission itself — the module checks write permission before it does any work, and a caller without it gets an error response with no side effects.

| Permission set | Gates |
| --- | --- |
| `BIFROST IBPaymt ori` | `Islandsbanki.Payment.Batch`, `Islandsbanki.Payment.Execute`, `Islandsbanki.DebitCard.Transfer` |
| `BIFROST IBClaim ori` | `Islandsbanki.Claim.Create`, `Islandsbanki.Claim.Cancel`, `Islandsbanki.Milliinnheimta.Claim.Return` |
| `BIFROST IBFrgPay ori` | `Islandsbanki.ForeignPayment.Register`, `Islandsbanki.ForeignPayment.Confirm` |

The remaining message types are read-only and are not gated. `BIFROST IBFull ori` extends Foundation's `BIFROST Full ori` with the module's objects; it is the set to grant an integration user that needs everything.

## Replacing the per-tenant app

This module succeeds the per-tenant app *Cloud Events Íslandsbanki*. The two can be installed side by side, and on its first install the module runs a take-over that copies the predecessor's data:

- the three gate tables, row for row, so existing access is preserved;
- the company user name, which moves from the old setup table onto the shared Bank Setup row;
- the Íslandsbanki fields that lived on shared base tables, copied field by field because their numbers moved with the new object range;
- every user assignment of an old permission set, re-pointed at the Bifröst set that replaces it.

The take-over runs only on a first install, and it skips any table that already holds rows, so it cannot overwrite work done after the switch.

Stored secrets do **not** carry over. Isolated Storage is scoped per extension and this is a new app, so the passwords and the bank certificate must be entered again once the module is installed.
