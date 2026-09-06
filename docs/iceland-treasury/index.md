---
id: index
title: "Bifröst Iceland Treasury"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Icelandic bank integrations as Bifröst message types: Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir on a shared IOBS SOAP signer framework."
---

Bifröst Iceland Treasury connects Business Central to the Icelandic banks. It builds on Bifröst Foundation and exposes claims, payments, statements, accounts, cards, currency rates and electronic documents as message types, so an external caller, an MCP client or a Business Central process reaches every bank through the same queue, task and data pattern used by the rest of Bifröst.

Underneath sits **Draupnir**, the IOBS (Icelandic Online Banking Standard, *Sambankaskema*) signer framework. Every bank module builds its WS-Security signed SOAP envelopes through the same interface, so a new bank connector inherits the transport rather than re-implementing it.

## Modules

| Module | What it covers |
| --- | --- |
| **Draupnir** | The IOBS SOAP signer framework — six signing profiles behind one interface. Not a bank connector itself. |
| **Landsbankinn** | Claims and claim batches, claim templates, cards and card ledger keys, accounts, portfolios and assets, currency and interest rates, electronic documents, acquiring settlement, domestic and foreign payments, and bank statement import and reconciliation. |
| **Arion** | Account, statement, bill and credit-card queries, claims and claim batches (*innheimtukröfur*), domestic and foreign payments, foreign statements, currency rates, electronic document upload and bank statement reconciliation. |
| **Íslandsbanki** | 23 message types over the B2B SOAP services: account statement, currency rates, account verification, unpaid invoices, payment batches, debit-card transfer, claims, *milliinnheimta*, foreign payments, presentment-file upload and securities transaction history. |
| **Kvika banki** | 11 message types over the Kvika netbanki IOBS services: claim query and the asynchronous batch operations, account statement, currency rates, payment batch and payment result batch. |
| **Sparisjóðir** | 26 message types over the Sparisjóður Sambankaskema 2013 services: statements, claims and asynchronous claim batches, payments, currency rates, accounts, bills, credit cards and the request-log reader, plus statement import into Bank Acc. Reconciliation through a Data Exchange definition. |

Each module has its own domain help codeunits, so `Help.Implementation.Get` answers for every message type with its exact request and response contract.

## How it works

1. Install Bifröst Foundation, then Bifröst Iceland Treasury.
2. Enable outgoing HTTP client requests for the extension.
3. Configure the banks the company uses from the **Bifrost Setup** page. Certificates and credentials are registered with Foundation's shared secret store and never land in a table.
4. Callers send Bifröst messages naming a bank message type; Draupnir signs the envelope and the module talks to the bank.

## Asynchronous batch operations

Claim batch operations at Kvika, Sparisjóðir and Íslandsbanki are asynchronous: the bank returns an operation id and the result is collected afterwards with `getOperationResult`. A caller submits the batch, keeps the operation id and polls — it does not block waiting for the bank.

## Permission sets

Money- and state-moving message types sit behind gate tables, one permission set per gate, so a caller can be granted statement reads without being granted payment execution. Each module also ships a full set that extends Foundation's `BIFROST Full ori` — `BIFROST IBFull ori`, `BIFROST KVFull ori`, `BIFROST SPFull ori` and the Landsbankinn and Arion equivalents — and Sparisjóðir adds a read-only claims set that extends `BIFROST Read ori`.

## Replacing the published apps

Iceland Treasury is the successor of five published or per-tenant Cloud Events apps: *Origo Cloud Events Landsbankinn*, *Origo Cloud Events Arionbanki*, and the per-tenant *Cloud Events Íslandsbanki*, *Cloud Events Kvika banki* and *Cloud Events Sparisjóðir*. Each module has its own install codeunit that takes the predecessor's data over on first install while both apps are installed side by side, including the fields that live on shared base tables and the existing permission-set assignments.

Stored credentials do **not** carry over — Isolated Storage is scoped per extension, and the successor is a new app. Certificates and passwords are entered again after the switch.

## Requirements

- Microsoft Dynamics 365 Business Central 28.0 or later, Essentials or Premium.
- Bifröst Foundation, available separately on AppSource.
- An agreement with the bank for the services in use, and the certificates and credentials it issues.
- Outgoing HTTP client requests enabled for the extension.

## Where to go next

- [In-product help](/help/iceland-treasury/)
- [Message type reference](./reference/message-types/) — the request and response contract for every type, generated from the app itself
- [Build on Bifröst](/extensibility/)
