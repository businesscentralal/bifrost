---
id: treasury-setup
title: "Bifrost Iceland Treasury Setup"
sidebar_label: "Treasury Setup"
sidebar_position: 2
---

The **Bifrost Iceland Treasury Setup** page is where you connect Business Central to the Icelandic banks. It lists the five bank connectors the app ships with, one row each, so you can see at a glance which banks are switched on, which have a user name, and which are still missing a secret.

Open it from the **Apps** group on the Bifröst **Setup** page, under **Iceland Treasury**.

## Why a list and not a tab per bank

All five banks are configured the same way: a master switch, a user name, and a set of secrets. A list answers the question you usually arrive with — *which banks are ready?* — on one screen, and adding a sixth bank adds a row rather than a new tab, new fields and new actions.

The detail that does differ between banks, and the actions that store secrets, apply to whichever row you have selected.

## Fields

| Field | Description |
|---|---|
| **Bank** | The Icelandic bank the row configures: Landsbankinn, Arion banki, Íslandsbanki, Kvika banki or Sparisjóðir. |
| **Enabled** | Whether the connector may run. Turn it off to stop every message type of that bank without deleting its settings. New rows start switched on. |
| **Username** | The company-default B2B user name the bank issued. A user can override it for themselves on **Bifrost User Setup**. |
| **Secrets** | Whether every secret this bank needs has been entered. Shows **Complete** in green, or **Missing** highlighted. |
| **Base URL** | Optional endpoint override, hidden by default. Leave it blank to use the connector's built-in production endpoint. Use it only for a test or sandbox gateway. |

## The Certificate FactBox

The FactBox on the right shows the client signing certificate of the selected bank: subject, issuer, thumbprint, and the dates it is valid between. The expiry date is coloured — red once the certificate has expired, amber in its last 30 days — so you can renew it before the bank starts refusing the connection.

For Íslandsbanki the FactBox says the bank does not use a client certificate. That is correct: Íslandsbanki authenticates with a user name and password over TLS and signs nothing.

## Actions

| Action | What it does |
|---|---|
| **Set Company Password** | Enters the company-default B2B password for the selected bank. |
| **Set Certificate** | Uploads the client signing certificate (a `.pfx` file) and asks for its password. The certificate is checked against the password before either is stored, so a typo is caught immediately. Disabled for banks that do not use one. |
| **Set Bank Certificate** | Uploads the bank's own public certificate, used to encrypt requests to it. Only Íslandsbanki uses this. |
| **Set API Key** | Enters the REST API key. Only Landsbankinn uses one. |
| **Clear Company Secrets** | Removes every stored company secret of the selected bank, after confirming. |
| **Setup Wizard** | Opens the [setup wizard](./treasury-setup-wizard.md), which walks you through the same settings one bank at a time. |
| **Bifrost App Secrets** | Opens the Bifröst-wide secret registry, which lists what every installed Bifröst application needs. |

## Which secrets each bank uses

Not every bank uses every secret. The actions that do not apply are disabled for the selected row.

| Bank | Password | Client certificate | API key | Bank certificate |
|---|---|---|---|---|
| Landsbankinn | Yes | Yes | Yes | — |
| Arion banki | Yes | Yes | — | — |
| Íslandsbanki | Yes | — | — | Yes |
| Kvika banki | Yes | Yes | — | — |
| Sparisjóðir | Yes | Yes | — | — |

## Where secrets are stored

Values go into encrypted storage that belongs to the extension. They are never written to a table, never included in telemetry, and never shown again once entered — the page only ever reports whether a value is present.

Because each extension has its own storage, secrets **cannot** be carried over from the older per-tenant or Cloud Events bank apps. When you install Bifrost Iceland Treasury alongside one of those, the bank's user name and its other settings are copied across, but every password, certificate and API key has to be entered once on this page.

## Per-user credentials

A user who has their own login at a bank can set their own user name on **Bifrost User Setup**, and their own password there. When a user name is set for a user, the connector uses that user's password, never the company one — the two are always used as a pair, so a password entered for one identity is never sent under another.

## Related pages

- [Treasury Setup Wizard](./treasury-setup-wizard.md)
- [Bank secrets](./treasury-secrets.md)
