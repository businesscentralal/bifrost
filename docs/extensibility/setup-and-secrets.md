---
id: setup-and-secrets
title: "Setup, secrets and the request log"
sidebar_label: "Setup and secrets"
sidebar_position: 5
description: "How a dependent app joins Bifrost Setup, keeps its credentials in the Foundation secret store, and logs its outbound calls in the shared request log."
---

# Setup, secrets and the request log

An administrator sets up every Bifröst app from one page, **Bifrost Setup**. A dependent app
registers with Foundation, adds one action to that page, keeps its credentials in Foundation's
secret store, and logs its outbound calls in Foundation's request log.

The code for all of this is in the partner guide,
[START-HERE §5.5 Platform integration](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#55-platform-integration),
with the signatures in [§5.7](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#57-foundation-api-cheat-sheet).
This page states the rules.

## Register your app

Subscribe to `OnRegisterApps` on `App Registry ori` and add your app, with your setup page if
you have one. Registration is what puts your app into the Bifrost Setup Wizard, the setup
notifications and the **Bifrost App Secrets** page. It is also what lets an administrator turn
on outbound HTTP for your app.

## One action on Bifrost Setup

Add **at most one action** to the Bifrost Setup page: a page extension that adds your action to
the `Apps` group and its action reference to `Category_Apps`. The action opens your own setup
page. Nothing else on the page is an extension point:

- do not add fields to the setup table or the page; keep them on your own setup table and page;
- do not add action groups, several actions or a promoted category of your own.

Keep the caption to your app's name, for example "Contoso Field Service", and put the
explanation in the tooltip.

## Never show your own setup notifications

Do not raise a notification of your own about setup, blocked HTTP or missing credentials, on
Bifrost Setup or on your own pages. Foundation collects these for every registered app and
shows them together on Bifrost Setup, with the way to fix them. When a call fails for one of
these reasons, answer with an error that names what is missing and where to set it.

## Secrets

**A credential never goes into a table field**, encrypted or not, and never into telemetry or an
error message. Store it with `Secret Store ori`, which keeps the value in isolated storage.
Do not build a store of your own: the Bifrost App Secrets page shows only what is in
Foundation's store, so an administrator could not find, rotate or audit anything else.

What an app does with the store:

- **Register** each secret it needs, from its install code and again when its setup page opens,
  so the administrator sees every secret, including missing ones. A secret has a scope: one
  value for the company, or one per user.
- **Set** a value, usually through Foundation's masked input dialog on your setup page.
- **TryGet** the value as `SecretText` when it is needed, inside a non-debuggable procedure, and
  pass it straight into the request. It returns false when no value is stored.
- **IsSet** to show whether a value exists, without reading it.
- **Clear** a value and keep the registration, so the administrator still sees it as missing.
- **Unregister** when the secret is no longer used, for example when the record that owned it
  is deleted.

An app reaches **only its own secrets**: every call names your own app id, and Foundation
refuses a call for another app's id. The Bifrost App Secrets page shows which secrets exist and
whether they are set, never the values.

Secrets are not copied when a successor app takes over from an older one. Register them at
install and tell administrators, in your release notes, that they must enter them again.

A message type that receives a secret in its request redacts the stored request, as described
in the partner guide.

## The request log for your outbound calls

Foundation keeps a shared, masked log of outbound HTTP calls. Log your own calls there rather
than in a table of your own.

- `Request Logger ori` writes an entry: the operation, method, URL, status, duration, success,
  error text and bodies. It can write in the foreground or in a separate session, so an entry
  survives a rollback of the work that failed.
- `Request Log Type ori` classifies your traffic. Add a value for your app.
- `Request Log Masker ori` decides what is stored. A value with no masker of its own redacts
  every body and error text. Bind your own masker only if you need finer control, such as keeping
  error text readable.
- `Request Log URL Masker ori` decides what of the full URL and the operation text is stored. A
  value with no URL masker of its own stores both as passed in. If your URL path or query, or the
  operation you log, can carry an identifier such as a kennitala, implement this interface on your
  masker codeunit and name it on your enum value:
  `Implementation = "Request Log Masker ori" = X, "Request Log URL Masker ori" = X;`.
- `Request Log Reader ori` reads an entry back.

Masking happens once, when the entry is written. The masker's base-URL result must contain only
the scheme and host. Never put a credential or token in a URL. The setup's **Request Debug
Mode** stores bodies unmasked; it is for troubleshooting only.

## Next

- Registering secrets and change-log guard exceptions at install: [Platform integration in START-HERE](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#55-platform-integration).
- Everything else you may rely on: [Foundation public surface](/extensibility/public-surface).
