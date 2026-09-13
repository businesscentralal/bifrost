---
id: islandsbanki
title: "Íslandsbanki"
sidebar_label: "Íslandsbanki"
sidebar_position: 3
description: "Twenty-three message types over the Íslandsbanki B2B SOAP services: statements, rates, greiðslur, claims, milliinnheimta, foreign greiðslur, file delivery og securities."
---

The Íslandsbanki module connects Business Central til the bank's B2B SOAP services. It exposes twenty-three message types covering reikningur statements, currency rates, reikningur verification, unpaid invoices, domestic og foreign greiðslur, direct collection claims, *milliinnheimta*, presentment-file delivery og securities færsla history.

Íslandsbanki er the one bank in Iceland Treasury that signs nothing. Its transport sends a WS-Security UsernameToken over TLS, so the module never loads a client certificate. It stores the bank's own public certificate instead, og that er the Aðeins certificate it holds.

## What it covers

| Area | What the module does |
| --- | --- |
| **Statements og rates** | Reads an reikningur statement fyrir an reikningur og date span með skip/take paging, og the bank's published exchange rates fyrir a date og rate Gerð. |
| **reikningur checks** | Verifies that an reikningur exists, optionally against an owner's registration number, og lists the unpaid claims, giro slips, bonds og bills owed by a registration number. |
| **Domestic greiðslur** | Registers an interbank transfer batch, error-checks it, executes it og collects Niðurstaðan. Also transfers an amount onto a debit card. |
| **Claims** | Býr til og cancels stakan collection claims, fetches one claim by its identity, lists claims fyrir a claimant over a due-date span og state, og lists the greiðslur received against a claim. |
| **Milliinnheimta** | Lists intermediary-collection claims og greiðslur fyrir a claimant over a date span, og Skilar a claim frá intermediary collection. |
| **Foreign greiðslur** | Registers a cross-border greiðsla batch, fetches the quote og charges fyrir it, confirms it og collects Niðurstaðan. |
| **File delivery** | Sends a Base64-encoded file í the bank's presentment system. |
| **Securities** | Skilar securities færsla history fyrir an identifier over a date span. |

Every Kallaðu á er written til Foundation's shared Bifröst Beiðni Log með the log Gerð `Islandsbanki`. The WS-Security password element er redacted frá the logged envelope unless Beiðni Debug Mode er switched on in Bifröst Setup.

## Message types

Each Gerð below has a Mynduð síða in the [message Gerð reference](/iceland-treasury/reference/message-types/), which carries the fulla Beiðni og Svar contract, the validation errors og the access rules. The same contract er available at runtime through `Help.Implementation.Get`.

| Gerð | What it does |
| --- | --- |
| `Islandsbanki.Statement.Get` | Sækir an reikningur statement fyrir an reikningur og date span, með skip/take paging. |
| `Islandsbanki.CurrencyRates.Get` | Sækir exchange rates fyrir a given date og rate Gerð. |
| `Islandsbanki.Account.Verify` | Checks whether an reikningur, og optionally an owner registration number, exists. |
| `Islandsbanki.UnpaidInvoice.Query` | Lists the unpaid claims, giro slips, bonds og bills owed by a registration number. |
| `Islandsbanki.Payment.Batch` | Registers a batch of interbank transfers og Skilar bank batch number. Gated. |
| `Islandsbanki.Payment.Validate` | Error-checks a registered greiðsla batch by batch number. |
| `Islandsbanki.Payment.Execute` | Executes a registered greiðsla batch by batch number. Gated. |
| `Islandsbanki.Payment.Result` | Fetches the status og result of a greiðsla batch by batch number. |
| `Islandsbanki.DebitCard.Transfer` | Transfers an amount onto a debit card. Gated. |
| `Islandsbanki.Claim.Create` | Býr til a stakan collection claim. Gated. |
| `Islandsbanki.Claim.Cancel` | Cancels a collection claim. Gated. |
| `Islandsbanki.Claim.Get` | Fetches a stakan claim by its identity. |
| `Islandsbanki.Claim.Query` | Lists claims fyrir a claimant over a due-date span og state. |
| `Islandsbanki.Claim.QueryPayments` | Lists the greiðslur received against one claim. |
| `Islandsbanki.Milliinnheimta.Claim.Query` | Lists intermediary-collection claims fyrir a claimant over a date span. |
| `Islandsbanki.Milliinnheimta.Payment.Query` | Lists intermediary-collection greiðslur fyrir a claimant over a date span. |
| `Islandsbanki.Milliinnheimta.Claim.Return` | Skilar a claim frá intermediary collection. Gated. |
| `Islandsbanki.ForeignPayment.Register` | Registers a batch of foreign greiðslur og Skilar bank batch number. Gated. |
| `Islandsbanki.ForeignPayment.Rates` | Fetches the rates, quote og service charges fyrir a registered foreign-greiðsla batch. |
| `Islandsbanki.ForeignPayment.Confirm` | Confirms og executes a registered foreign-greiðsla batch. Gated. |
| `Islandsbanki.ForeignPayment.Result` | Fetches Niðurstaðan og status of a foreign-greiðsla batch. |
| `Islandsbanki.File.Send` | Sends a Base64-encoded file í the presentment system. |
| `Islandsbanki.Securities.TransactionHistory` | Skilar securities færsla history fyrir an identifier over a date span. |

## Setting up

Íslandsbanki er configured frá the shared **Bifröst Treasury Setup** page, which lists Allt five banks in one place. The row fyrir Íslandsbanki carries the enabled flag, the fyrirtæki user Heiti, an valfrjálst base-URL override og the transport selection. See the [Treasury Setup help](/help/iceland-treasury/treasury-setup/) fyrir the page itself.

Íslandsbanki uses three of the shared bank secrets:

| Secret | Scope | Tilgangur |
| --- | --- | --- |
| fyrirtæki password | fyrirtæki | The password fyrir the fyrirtæki user Heiti. Used Þegar the caller has no personal credentials. |
| User password | fyrirtæki og user | The password fyrir a caller's personal user Heiti. |
| Bank certificate | fyrirtæki | The bank's own public certificate. |

There er no client certificate og no certificate password fyrir this bank. Those actions stay switched off on the setup page, because the transport signs nothing. Secrets eru held in the extension's own Isolated Storage, never in a table, telemetry entry eða error message. See the [secrets help](/help/iceland-treasury/treasury-secrets/) fyrir how til store og clear them.

A caller getur authenticate as themselves rather than as the fyrirtæki. A personal user Heiti er entered on **Bifröst User Setup**, og the personal password er stored against the same færsla; see the [user setup help](/help/iceland-treasury/bank-user-setup/). Heiti og password verður að match in scope: Ef a personal user Heiti er set without a personal password, the Kallaðu á fails með an explicit error rather than falling back til the fyrirtæki password.

## Batch operations

greiðslur og foreign greiðslur eru two-stage. The bank does not execute what you register until you tell it til, og it identifies the work by a batch number rather than by an operation id.

- **Domestic greiðslur.** `Payment.Batch` registers the transfers og Skilar bank batch number. `Payment.Validate` error-checks that batch, `Payment.Execute` releases it, og `Payment.Result` reports what happened til it. A caller keeps the batch number og comes back fyrir Niðurstaðan; it does not block waiting fyrir the bank.
- **Foreign greiðslur.** `ForeignPayment.Register` Skilar batch number, `ForeignPayment.Rates` Skilar quote og service charges fyrir review, `ForeignPayment.Confirm` executes the batch og `ForeignPayment.Result` reports the outcome.

Registering og confirming eru separately gated frá reading Niðurstaðan, so a process that Aðeins collects outcomes needs no greiðsla permission.

## Permission sets

Money- og state-moving message types sit behind gate tables. Each gate er an empty table, og the permission set that grants write access til it er the permission itself — the module checks write permission áður en it does any work, og a caller without it Sækir an error Svar með no side effects.

| Permission set | Gates |
| --- | --- |
| `BIFROST IBPaymt ori` | `Islandsbanki.Payment.Batch`, `Islandsbanki.Payment.Execute`, `Islandsbanki.DebitCard.Transfer` |
| `BIFROST IBClaim ori` | `Islandsbanki.Claim.Create`, `Islandsbanki.Claim.Cancel`, `Islandsbanki.Milliinnheimta.Claim.Return` |
| `BIFROST IBFrgPay ori` | `Islandsbanki.ForeignPayment.Register`, `Islandsbanki.ForeignPayment.Confirm` |

The remaining message types eru read-Aðeins og eru not gated. `BIFROST IBFull ori` extends Foundation's `BIFROST Full ori` með the module's objects; it er the set til grant an integration user that needs everything.

## Replacing the per-tenant app

This module succeeds the per-tenant app *Cloud Events Íslandsbanki*. The two getur be installed side by side, og on its first install the module runs a take-over that copies the predecessor's data:

- the three gate tables, row fyrir row, so existing access er preserved;
- the fyrirtæki user Heiti, which moves frá the old setup table onto the shared Bank Setup row;
- the Íslandsbanki fields that lived on shared base tables, copied Reitur by Reitur because their numbers moved með the new object range;
- every user assignment of an old permission set, re-pointed at the Bifröst set that replaces it.

The take-over runs Aðeins on a first install, og it skips any table that already holds rows, so it cannot overwrite work done eftir the switch.

Stored secrets do **not** carry over. Isolated Storage er scoped per extension og this er a new app, so the passwords og the bank certificate verður að be entered again once the module er installed.

