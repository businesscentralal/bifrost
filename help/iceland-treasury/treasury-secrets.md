---
id: treasury-secrets
title: "Bank secrets"
sidebar_label: "Bank secrets"
sidebar_position: 4
---

Every Icelandic bank connector needs credentials: a password, usually a client certificate, and for Landsbankinn an API key. This page explains where those values live, who can see them, and what to do when one is missing.

## What is stored

| Secret | Scope | Used by |
|---|---|---|
| **Company Password** | One value per company | All five banks |
| **User Password** | One value per user | All five banks, when a user has their own bank user name |
| **Certificate** | One value per company | Landsbankinn, Arion banki, Kvika banki, Sparisjóðir |
| **Certificate Password** | One value per company | The same four banks |
| **API Key** | One value per company | Landsbankinn |
| **User API Key** | One value per user | Landsbankinn |
| **Bank Certificate** | One value per company | Íslandsbanki |

Íslandsbanki is the exception on certificates: it authenticates with a user name and password over TLS and signs nothing, so it never uses a client certificate. It does store the bank's own public certificate, which is used to encrypt requests to it.

## Where the values live

Values are written to the extension's own encrypted storage. They are never written to a table, never included in telemetry, and never returned to a page — the setup page only ever reports whether a value is present, not what it is.

Storage belongs to the extension that wrote it. That has one practical consequence worth planning for: **secrets do not migrate.** Installing Bifrost Iceland Treasury next to an older Cloud Events or per-tenant bank app copies over the bank's user name and its other settings, but every password, certificate and API key must be entered once on [Bifrost Iceland Treasury Setup](./treasury-setup.md).

## Company and personal credentials

Most companies use one set of bank credentials shared by everyone. A user who has their own login at a bank can instead set a personal user name on **Bifrost User Setup**, and a personal password alongside it.

The two are always used as a pair. When a user has their own bank user name, the connector uses that user's password; when they do not, it uses the company user name with the company password. It never mixes them, so a password entered for one identity is never sent under another. If a personal user name is set but no personal password is stored, the connector says so rather than quietly falling back to the company password.

## Reading the status

On [Bifrost Iceland Treasury Setup](./treasury-setup.md) the **Secrets** column shows **Complete** or **Missing** for each bank. Missing means at least one secret the connector needs has no value — check the company password first, then the certificate for the four banks that use one, then the API key for Landsbankinn.

While a bank shows **Missing**, its message types report themselves as unavailable and refuse to run, rather than calling the bank and failing there.

## The Bifröst secret registry

**Bifrost App Secrets**, reachable from the Treasury Setup page, lists the secrets that every installed Bifröst application declares it needs, with a description, whether a value has been stored, and when and by whom. It is the place to look when you are auditing which credentials a tenant holds.

Bifrost Iceland Treasury holds its own values rather than in that shared registry, because the credentials have to be readable as text to build a signed SOAP envelope for the banks, and the shared registry deliberately does not hand values back in that form. Its status column therefore is not the authority for this app — [Bifrost Iceland Treasury Setup](./treasury-setup.md) is.

## Removing secrets

**Clear Company Secrets** on the setup page removes every stored company secret for the selected bank after confirming. A user can clear their own personal secrets from **Bifrost User Setup**. Clearing does not disable the connector; to stop a bank entirely, turn off **Enabled** on its row.
