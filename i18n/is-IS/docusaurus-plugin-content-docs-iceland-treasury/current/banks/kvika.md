---
id: kvika
title: "Kvika banki"
sidebar_label: "Kvika banki"
sidebar_position: 4
description: "Eleven message types over the Kvika netbanki IOBS services: claim Fyrirspurn, asynchronous claim og greiðsla batches, reikningur statements og currency rates."
---

The Kvika banki module connects Business Central til the Kvika netbanki services over the Icelandic Online Banking staðlaða (IOBS, *Sambankaskema*). It exposes eleven message types covering claim search og lookup, asynchronous claim batches, greiðsla batches, reikningur statements og currency rates.

Kvika signs its SOAP envelopes. The module builds them through Draupnir, the shared IOBS signer framework, using a client certificate held in the shared secret store.

## What it covers

| Area | What the module does |
| --- | --- |
| **Claim search** | Paged claim search by claimant, period, payor identifier og status, og a stakan claim lookup by its fulla key. Period filters getur be applied against the due date, final due date, cancellation date eða creation date. |
| **Claim batches** | Býr til, alters og cancels claims in batches. The bank processes each batch asynchronously; Niðurstaðan er collected afterwards. Claim creation, alteration og cancellation eru batch-Aðeins, as the staðlaða requires. |
| **Claim greiðslur** | Paged search of the greiðslur received against claims. |
| **greiðslur** | Sendir greiðsla batches of reikningur-til-reikningur transfers og claim greiðslur, then polls Niðurstaðan. Batches getur carry a forward greiðsla date og getur be set til roll back as a whole on error. |
| **Statements** | Reads an reikningur statement fyrir an reikningur og date span in the IOBS bank import og export format. Allt bank pages eru merged í one set of færsla lines, which the caller pages með skip og take. |
| **Currency rates** | Reads the bank's published currency rates. |

Every Kallaðu á er written til Foundation's shared Bifröst Beiðni Log með the log Gerð `Kvika banki`. The WS-Security password element er redacted frá the logged envelope unless Beiðni Debug Mode er switched on in Bifröst Setup.

## Message types

Each Gerð below has a Mynduð síða in the [message Gerð reference](/iceland-treasury/reference/message-types/), which carries the fulla Beiðni og Svar contract, the validation errors og the access rules. The same contract er available at runtime through `Help.Implementation.Get`.

| Gerð | What it does |
| --- | --- |
| `Kvikabanki.Claim.Query` | Paged claim search by claimant, period, payor og status. |
| `Kvikabanki.Claim.QueryOne` | stakan claim lookup by claim key. |
| `Kvikabanki.Claim.CreateBatch` | Asynchronous batch claim creation. |
| `Kvikabanki.Claim.AlterBatch` | Asynchronous batch claim alteration. |
| `Kvikabanki.Claim.CancelBatch` | Asynchronous batch claim cancellation by key. |
| `Kvikabanki.Claim.QueryPayments` | Paged greiðsla search fyrir claims. |
| `Kvikabanki.Claim.GetOperationResult` | Polls Niðurstaðan of an asynchronous claim batch. |
| `Kvikabanki.Payment.Batch` | Asynchronous batch greiðsla submission. |
| `Kvikabanki.Payment.ResultBatch` | Polls Niðurstaðan of an asynchronous greiðsla batch. |
| `Kvikabanki.Statement.Get` | Reads an reikningur statement fyrir an reikningur og date span. |
| `Kvikabanki.CurrencyRates.Get` | Reads currency rates. |

## Setting up

Kvika er configured frá the shared **Bifröst Treasury Setup** page, which lists Allt five banks in one place. The row fyrir Kvika carries the enabled flag, the fyrirtæki user Heiti, an valfrjálst base-URL override og the transport selection. See the [Treasury Setup help](/help/iceland-treasury/treasury-setup/) fyrir the page itself.

Kvika uses four of the shared bank secrets:

| Secret | Scope | Tilgangur |
| --- | --- | --- |
| fyrirtæki password | fyrirtæki | The password fyrir the fyrirtæki user Heiti. Used Þegar the caller has no personal credentials. |
| User password | fyrirtæki og user | The password fyrir a caller's personal user Heiti. |
| Client certificate | fyrirtæki | The certificate the module signs the SOAP envelope með. |
| Certificate password | fyrirtæki | The password protecting that certificate. Leave it unset Ef the certificate has none. |

Secrets eru held in the extension's own Isolated Storage, never in a table, telemetry entry eða error message. See the [secrets help](/help/iceland-treasury/treasury-secrets/) fyrir how til store og clear them.

A caller getur authenticate as themselves rather than as the fyrirtæki. A personal user Heiti er entered on **Bifröst User Setup**, og the personal password er stored against the same færsla; see the [user setup help](/help/iceland-treasury/bank-user-setup/). Heiti og password verður að match in scope: Ef a personal user Heiti er set without a personal password, the Kallaðu á fails með an explicit error rather than falling back til the fyrirtæki password.

## Asynchronous claim batches

The three writing claim operations eru asynchronous. `Claim.CreateBatch`, `Claim.AlterBatch` og `Claim.CancelBatch` hand the batch til the bank og return an operation id straight away. The caller keeps that id og collects the outcome later með `Claim.GetOperationResult`; nothing blocks waiting fyrir the bank til finish.

greiðslur follow the same shape. `Payment.Batch` Skilar a greiðslur identifier fyrir each submitted batch, og `Payment.ResultBatch` polls it. The poll getur be narrowed til the batch status, the errors Aðeins, the successful lines Aðeins, eða everything.

Reading er synchronous throughout: `Claim.Query`, `Claim.QueryOne`, `Claim.QueryPayments`, `Statement.Get` og `CurrencyRates.Get` answer frá the Kallaðu á itself.

## Permission sets

Every Kvika message Gerð sits behind a gate table. Each gate er an empty table, og the permission set that grants write access til it er the permission itself — the module checks write permission áður en it does any work, og a caller without it Sækir an error Svar með no side effects. The three gates split the module by domain, so statement reads getur be granted without granting greiðsla execution.

| Permission set | Gates |
| --- | --- |
| `BIFROST KVClmPmt ori` | The seven claim types: `Claim.Query`, `Claim.QueryOne`, `Claim.CreateBatch`, `Claim.AlterBatch`, `Claim.CancelBatch`, `Claim.QueryPayments`, `Claim.GetOperationResult` |
| `BIFROST KVPaymt ori` | `Kvikabanki.Payment.Batch`, `Kvikabanki.Payment.ResultBatch` |
| `BIFROST KVStmt ori` | `Kvikabanki.Statement.Get`, `Kvikabanki.CurrencyRates.Get` |

`BIFROST KVFull ori` extends Foundation's `BIFROST Full ori` með the module's objects; it er the set til grant an integration user that needs everything.

## Replacing the per-tenant app

This module succeeds the per-tenant app *Cloud Events Kvika banki*. The two getur be installed side by side, og on its first install the module runs a take-over that copies the predecessor's data:

- the fyrirtæki-wide Kvika settings, which move frá the old setup table onto the shared Bank Setup row — the enabled flag, the base URL og the fyrirtæki user Heiti Allt carry over, so a fyrirtæki that had switched Tengingin on stays switched on;
- the Kvika fields that lived on shared base tables, copied Reitur by Reitur because their numbers moved með the new object range;
- every user assignment of an old permission set, re-pointed at the Bifröst set that replaces it.

The legacy transport selection er deliberately not carried over: every production fyrirtæki runs the live transport, which er what the new row defaults til. The take-over runs Aðeins on a first install, so it cannot overwrite work done eftir the switch.

Stored secrets do **not** carry over. Isolated Storage er scoped per extension og this er a new app, so the passwords og the client certificate verður að be entered again once the module er installed.

