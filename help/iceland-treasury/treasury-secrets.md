---
id: treasury-secrets
title: "Bank secrets"
---

**Enter Bank Secret** is the masked dialog that stores a password or an API key for a bank. This page is
for the administrator who enters the company's bank secrets and for users who enter their own. It also
explains which secrets each bank uses and where they are kept.

The dialog opens from **Set Company Password** and **Set API Key** on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/) and in the
[setup wizard](/help/iceland-treasury/treasury-setup-wizard/), and from the **Set My ...** actions on
**Bifrost User Setup**.

## Fields

| Field | Description |
| --- | --- |
| **Secret** | The bank and the secret the value is stored for, for example the company password at Landsbankinn. |
| **Value** | The value to store. It is masked while you type and never shown again. |

Type or paste the value and choose **OK**. **Cancel** stores nothing.

## The secrets of each bank

| Secret | Kept for | Used by |
| --- | --- | --- |
| **Company Password** | The company | Every bank |
| **User Password** | One user | Every bank, when the user has their own login |
| **Certificate** and **Certificate Password** | The company | Every bank, to sign requests |
| **API Key** | The company | Landsbankinn |
| **User API Key** | One user | Landsbankinn, instead of the company's API key |

The certificate is a `.pfx` file. **Set Certificate** uploads it and asks for its password; the
certificate is opened with the password before either is stored.

## Where they are kept

Secrets are kept in Bifröst Iceland Treasury's own protected storage. They are never written to a
table, a log or an error message, and never shown again; the pages only say whether a value is stored.
Every call to a bank is logged on the **Bifrost Request Log** with the passwords masked.

Because the storage belongs to this app, secrets do not carry over from another app, including Origo's
earlier apps for Arion banki and Landsbankinn: enter them once after you install.

## Company and personal logins

A company's user name pairs with the company password, and a user's own user name with that user's
password. They are never mixed, so a password entered for one login is never sent with another. When a
user has entered their own user name but no password, the call stops and says so.

## Common tasks

**Change a secret.** Enter it again; the new value replaces the old one.

**Remove the company's secrets for a bank.** Choose **Clear Company Secrets** on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/). The bank stays enabled; its calls
stop until new secrets are entered.

**Check what is stored.** **Secrets** on Bifrost Iceland Treasury Setup shows **Complete** or **Missing**
for each bank. Only a holder of `BIFROST TAdmin ori` can enter or clear the company's secrets; each user
enters and clears their own on **Bifrost User Setup**.
