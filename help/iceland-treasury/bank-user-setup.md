---
id: bank-user-setup
title: "Bank credentials for your user"
sidebar_label: "Your bank credentials"
sidebar_position: 5
---

Every bank connector in Bifröst Iceland Treasury authenticates with a B2B user name and password that the bank issued. By default the whole company shares one set, entered on the [Treasury Setup page](./treasury-setup.md). **Bifrost User Setup** lets an individual user override that with credentials of their own.

Use it when people in the same company hold separate accounts at the bank — for example when the bank issues one B2B user per accountant and reports activity per user.

Open it by searching for **Bifrost User Setup**, then select your user.

## One group per bank

The page grows a group for each bank connector the app installs: Landsbankinn, Arion banki, Íslandsbanki, Kvika banki and Sparisjóður. All five groups work the same way.

| Field | Description |
|---|---|
| **Username** | Your personal B2B user name at that bank. Leave it blank to use the company default. |
| **User Password Stored** | Read-only. Shows whether a personal password has been stored for you. Use the actions to set or clear it — the value itself is never shown again. |
| **User API Key Stored** | Landsbankinn only. Shows whether a personal REST API key has been stored for you. |

## Actions

| Action | What it does |
|---|---|
| **Set My … Password** | Asks for your personal password at that bank and stores it in encrypted storage. |
| **Clear My … Password** | Removes your stored personal password. |
| **Set My Landsbankinn API Key** | Landsbankinn only. Stores your personal REST API key. |
| **Clear My Landsbankinn Secrets** | Landsbankinn only. Removes both your stored password and your stored API key. |

## How credentials are chosen

For each call, the connector resolves the user name and the password separately:

1. If you have a personal user name for that bank, it is used. Otherwise the company default is used.
2. If you have a personal password for that bank, it is used. Otherwise the company default is used.

That independence is deliberate — it lets you keep a personal user name while still using the shared password, which is what you want when the bank issues several user names against one account.

:::caution
If you set a personal user name for a **different** bank account than the company default, you must set a personal password too. A personal user name paired with the company password is a mismatched credential pair and the bank rejects the call.
:::

## Where the values are kept

Personal passwords and API keys go into the extension's encrypted storage, scoped to your user in this company. They are never written to a table, never appear in telemetry, and are never displayed again. The page only ever reports whether a value is present.

## Related

- [Treasury Setup](./treasury-setup.md) — the company-wide user name and secrets
- [Bank secrets](./treasury-secrets.md) — which secrets each bank uses
