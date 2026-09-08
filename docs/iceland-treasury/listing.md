---
id: listing
title: "Partner Center listing"
sidebar_label: "Listing"
sidebar_position: 9
description: "The marketplace listing copy for this extension: offer name, summary, categories and full description."
---

> Copy these texts into Partner Center when creating/updating the offer listing.
>
> App id `54f038b6-4e7a-4e7d-bd95-a70587f27dd2` · Publisher **Origo** · Version **28.0.0.0**

---

## Offer Name
Bifrost Iceland Treasury

## Search Result Summary (max 100 chars)
Icelandic bank integrations for Business Central: statements, claims, payments and currency rates. (98)

## Short Description (max 100 chars)
Landsbankinn, Arion, Íslandsbanki, Kvika and Sparisjóðir as Bifrost message types. (82)

## Search Keywords
1. Iceland banking
2. bank statement
3. kröfur

## Categories
- **Primary:** Finance > Banking & Payments
- **Secondary:** IT & Admin Tools > Data Integration

## Industries
- Distribution
- Financial Services
- Manufacturing
- Professional Services
- Retail & Consumer Goods

---

## Description

See [Full description](#full-description) below for the full description text.

---

## Supported editions and markets

- **Editions:** Business Central Essentials and Premium
- **Countries/regions:** Iceland
- **Supported languages:** English (United States), Icelandic (Iceland)

## Dependencies

- **Bifrost Foundation** (Origo) `7505e808-6e52-4b96-a328-82573391297a` v28.0.0.0

---

## Support Link
https://www.origo.is/

## Help Link
https://businesscentralal.github.io/bifrost/en-us/iceland-treasury/

## Privacy Policy
https://www.origo.is/um-origo/stefnur/personuverndarstefna

## Terms of Use
https://www.origo.is/skilmalar-og-oryggismal

## Products your app works with
- Dynamics 365 Business Central

---

## Full description

**Bifrost Iceland Treasury** connects Business Central to the Icelandic banks. It builds on Bifrost — a message-based integration layer that gives external systems, AI agents and automation tools structured access to Business Central data and procedures via OData — and exposes claims, payments, statements, accounts, cards, currency rates and electronic documents as message types. Any MCP-compatible client, REST caller or Business Central process reaches every bank through the same Queue → Task → Data API pattern used across the Bifrost platform, without custom development.

The app adds 158 message types on top of **Bifrost Foundation**, covering five banks in one extension.

### Who is this for?

**Finance teams and accounting professionals at Icelandic companies** that use Business Central and bank domestically. It automates bank statement retrieval and reconciliation, claim management (*kröfur*), payment batch submission and foreign payments, replacing manual bank-portal work with API-driven automation.

**Target industries:** All industries in Iceland that hold corporate banking agreements — financial services, professional services, retail, manufacturing, distribution.

### One app, five banks

| Bank | What it covers |
|---|---|
| **Landsbankinn** | Claims, claim templates and claim batches, corporate cards and card ledger keys, accounts, portfolios and assets, currency and interest rates, electronic documents, acquiring settlement, domestic and foreign payments, and statement and card-transaction import. |
| **Arion banki** | Account, statement, bill and credit-card queries, claims and claim batches, domestic and foreign payments, foreign-currency accounts and statements, currency rates, electronic document upload and statement import. |
| **Íslandsbanki** | Account statement, currency rates, account verification, unpaid invoices, payment batches, debit-card transfer, claims, *milliinnheimta*, foreign payments, presentment-file upload and securities transaction history. |
| **Kvika banki** | Claim query and the asynchronous claim batch operations, account statement, currency rates, payment batch and payment result batch. |
| **Sparisjóðir** | Statements, claims and asynchronous claim batches, payments, currency rates, accounts, bills and credit cards, with statement import for each of the four savings-bank feeds. |

Each bank has its own domain help codeunits, so the built-in `Help.Implementation.Get` message type answers for every type with its exact request and response contract.

### Draupnir — the shared signing framework

Underneath the bank modules sits **Draupnir**, an implementation of the IOBS standard (*Icelandic Online Banking Standard*, *Sambankaskema*). Five WS-Security signing profiles sit behind one interface, so every bank module builds its signed SOAP envelopes the same way and a new bank connector inherits the transport rather than re-implementing it.

### Bank statement import and reconciliation

Landsbankinn, Arion banki and Sparisjóðir install Data Exchange definitions of type Bank Statement Import together with their Bank Export/Import Setup rows. Setting one as the **Bank Statement Import Format** on a Business Central bank account is all it takes: importing a statement on a Bank Acc. Reconciliation calls the bank, converts the response and maps it onto reconciliation lines through the standard mapping.

When there is no earlier posted statement to derive the date window from, the import asks for a start date first. After a successful import a read-only summary reports the account, the number of lines imported and the calculated starting and ending balances, and warns when those do not agree with what the reconciliation already held.

### Asynchronous batch operations

Claim batch operations at Kvika banki, Sparisjóðir and Íslandsbanki are asynchronous. The bank returns an operation id and the result is collected afterwards with a separate operation-result call, so a caller submits the batch, keeps the id and polls rather than blocking on the bank.

### Setup

All five banks are configured on one page, reached from the **Apps** group on the Bifrost Setup page: a row per bank with a master switch, the company-default user name and a status column showing whether every secret that bank needs has been entered. A certificate FactBox shows the subject, issuer, thumbprint and validity dates of the selected bank's signing certificate, and colours the expiry date so it can be renewed before the bank starts refusing connections.

An assisted setup wizard walks through the same settings one bank at a time, including allowing outbound HTTP requests for the extension. A user who holds their own login at a bank can override the company user name and password on Bifrost User Setup; user name and password are always resolved as a pair, so a password entered for one identity is never sent under another.

### Security

Passwords, client certificates, certificate passwords, API keys and the Íslandsbanki bank certificate are held in the extension's encrypted storage. They are never written to a table, never included in telemetry and never returned to a page — the setup page reports only whether a value is present. Outgoing SOAP envelopes are masked in the shared Bifrost request log unless request debug mode is switched on.

Message types that move money or change state at the bank sit behind access gates, one assignable permission set per gate, so a caller can be granted statement reads without being granted payment execution. Each bank also ships a full set that extends Bifrost Foundation's `BIFROST Full ori`, and the claim-carrying banks add a read-only claims set that extends `BIFROST Read ori`.

### Replacing the published apps

Bifrost Iceland Treasury is the successor of five earlier connectors: *Origo Cloud Events Landsbankinn*, *Origo Cloud Events Arionbanki*, and the per-tenant *Cloud Events Íslandsbanki*, *Cloud Events Kvika banki* and *Cloud Events Sparisjóðir*. Each module has an install codeunit that takes the predecessor's data over on first install while both apps are installed side by side — claims, batches, gate tables, the fields that live on shared base tables, and the existing permission-set assignments. A table that already holds rows is left alone, so a second install never overwrites live data.

Stored credentials do **not** carry over. Isolated Storage belongs to the extension that wrote it and the successor is a new app, so passwords, certificates and API keys are entered once after the switch.

### Supported editions and countries

- **Editions:** Business Central Essentials and Premium
- **Countries:** Iceland
- **Requires:** Bifrost Foundation (Origo)

### Requirements

- Business Central 28.0 or later
- Bifrost Foundation extension installed
- Outgoing HTTP client requests allowed for the extension
- An agreement with each bank for the services in use, and the user name, password, certificate or API key it issues
