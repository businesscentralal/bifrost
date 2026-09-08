---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 4
description: "Eleven message types over the Kvika netbanki IOBS services: claim query, asynchronous claim and payment batches, account statements and currency rates."
---

The Kvika banki module connects Business Central to the Kvika netbanki services over the Icelandic Online Banking Standard (IOBS, *Sambankaskema*). It exposes eleven message types covering claim search and lookup, asynchronous claim batches, payment batches, account statements and currency rates.

Kvika signs its SOAP envelopes. The module builds them through Draupnir, the shared IOBS signer framework, using a client certificate held in the shared secret store.

## What it covers

| Area | What the module does |
| --- | --- |
| **Claim search** | Paged claim search by claimant, period, payor identifier and status, and a single claim lookup by its full key. Period filters can be applied against the due date, final due date, cancellation date or creation date. |
| **Claim batches** | Creates, alters and cancels claims in batches. The bank processes each batch asynchronously; the result is collected afterwards. Claim creation, alteration and cancellation are batch-only, as the standard requires. |
| **Claim payments** | Paged search of the payments received against claims. |
| **Payments** | Submits payment batches of account-to-account transfers and claim payments, then polls the result. Batches can carry a forward payment date and can be set to roll back as a whole on error. |
| **Statements** | Reads an account statement for an account and date span in the IOBS bank import and export format. All bank pages are merged into one set of transaction lines, which the caller pages with skip and take. |
| **Currency rates** | Reads the bank's published currency rates. |

Every call is written to Foundation's shared Bifröst Request Log with the log type `Kvika banki`. The WS-Security password element is redacted from the logged envelope unless Request Debug Mode is switched on in Bifröst Setup.

## Message types

Each type below has a generated page in the [message type reference](/iceland-treasury/reference/message-types/), which carries the full request and response contract, the validation errors and the access rules. The same contract is available at runtime through `Help.Implementation.Get`.

| Type | What it does |
| --- | --- |
| `Kvikabanki.Claim.Query` | Paged claim search by claimant, period, payor and status. |
| `Kvikabanki.Claim.QueryOne` | Single claim lookup by claim key. |
| `Kvikabanki.Claim.CreateBatch` | Asynchronous batch claim creation. |
| `Kvikabanki.Claim.AlterBatch` | Asynchronous batch claim alteration. |
| `Kvikabanki.Claim.CancelBatch` | Asynchronous batch claim cancellation by key. |
| `Kvikabanki.Claim.QueryPayments` | Paged payment search for claims. |
| `Kvikabanki.Claim.GetOperationResult` | Polls the result of an asynchronous claim batch. |
| `Kvikabanki.Payment.Batch` | Asynchronous batch payment submission. |
| `Kvikabanki.Payment.ResultBatch` | Polls the result of an asynchronous payment batch. |
| `Kvikabanki.Statement.Get` | Reads an account statement for an account and date span. |
| `Kvikabanki.CurrencyRates.Get` | Reads currency rates. |

## Setting up

Kvika is configured from the shared **Bifröst Treasury Setup** page, which lists all five banks in one place. The row for Kvika carries the enabled flag, the company user name, an optional base-URL override and the transport selection. See the [Treasury Setup help](/help/iceland-treasury/treasury-setup/) for the page itself.

Kvika uses four of the shared bank secrets:

| Secret | Scope | Purpose |
| --- | --- | --- |
| Company password | Company | The password for the company user name. Used when the caller has no personal credentials. |
| User password | Company and user | The password for a caller's personal user name. |
| Client certificate | Company | The certificate the module signs the SOAP envelope with. |
| Certificate password | Company | The password protecting that certificate. Leave it unset if the certificate has none. |

Secrets are held in the extension's own Isolated Storage, never in a table, telemetry entry or error message. See the [secrets help](/help/iceland-treasury/treasury-secrets/) for how to store and clear them.

A caller can authenticate as themselves rather than as the company. A personal user name is entered on **Bifröst User Setup**, and the personal password is stored against the same record; see the [user setup help](/help/iceland-treasury/bank-user-setup/). Name and password must match in scope: if a personal user name is set without a personal password, the call fails with an explicit error rather than falling back to the company password.

## Asynchronous claim batches

The three writing claim operations are asynchronous. `Claim.CreateBatch`, `Claim.AlterBatch` and `Claim.CancelBatch` hand the batch to the bank and return an operation id straight away. The caller keeps that id and collects the outcome later with `Claim.GetOperationResult`; nothing blocks waiting for the bank to finish.

Payments follow the same shape. `Payment.Batch` returns a payments identifier for each submitted batch, and `Payment.ResultBatch` polls it. The poll can be narrowed to the batch status, the errors only, the successful lines only, or everything.

Reading is synchronous throughout: `Claim.Query`, `Claim.QueryOne`, `Claim.QueryPayments`, `Statement.Get` and `CurrencyRates.Get` answer from the call itself.

## Permission sets

Every Kvika message type sits behind a gate table. Each gate is an empty table, and the permission set that grants write access to it is the permission itself — the module checks write permission before it does any work, and a caller without it gets an error response with no side effects. The three gates split the module by domain, so statement reads can be granted without granting payment execution.

| Permission set | Gates |
| --- | --- |
| `BIFROST KVClmPmt ori` | The seven claim types: `Claim.Query`, `Claim.QueryOne`, `Claim.CreateBatch`, `Claim.AlterBatch`, `Claim.CancelBatch`, `Claim.QueryPayments`, `Claim.GetOperationResult` |
| `BIFROST KVPaymt ori` | `Kvikabanki.Payment.Batch`, `Kvikabanki.Payment.ResultBatch` |
| `BIFROST KVStmt ori` | `Kvikabanki.Statement.Get`, `Kvikabanki.CurrencyRates.Get` |

`BIFROST KVFull ori` extends Foundation's `BIFROST Full ori` with the module's objects; it is the set to grant an integration user that needs everything.

## Replacing the per-tenant app

This module succeeds the per-tenant app *Cloud Events Kvika banki*. The two can be installed side by side, and on its first install the module runs a take-over that copies the predecessor's data:

- the company-wide Kvika settings, which move from the old setup table onto the shared Bank Setup row — the enabled flag, the base URL and the company user name all carry over, so a company that had switched the connector on stays switched on;
- the Kvika fields that lived on shared base tables, copied field by field because their numbers moved with the new object range;
- every user assignment of an old permission set, re-pointed at the Bifröst set that replaces it.

The legacy transport selection is deliberately not carried over: every production company runs the live transport, which is what the new row defaults to. The take-over runs only on a first install, so it cannot overwrite work done after the switch.

Stored secrets do **not** carry over. Isolated Storage is scoped per extension and this is a new app, so the passwords and the client certificate must be entered again once the module is installed.
