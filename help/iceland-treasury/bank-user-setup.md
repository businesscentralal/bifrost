---
id: bank-user-setup
title: "Bank credentials for your user"
---

Bifröst Iceland Treasury adds a group for each bank and claim collection agency to the
[User Setup Editor](/help/foundation/bifrost-user-setup-editor/) of **Bifrost User Setup**. This page is
for a user who has their own login at a bank, at Gjaldskil or at InKasso, and for the administrator who
helps them.

By default every call to a bank uses the company's user name and password from
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/). When the bank has given you a
login of your own, enter it here and your calls use it instead.

Open **Bifrost User Setup**, then your own user.

## Fields

| Field | Description |
| --- | --- |
| **... Username** | Your own user name at the bank or agency, for example **Arion banki Username**. Leave it blank to use the company's. The **Gjaldskil** and **InKasso** groups work the same way. |
| **User Password Stored** | Whether your own password is stored. The value is never shown. |
| **User API Key Stored** | Landsbankinn only. Whether your own API key is stored. |

## Actions

| Action | Description |
| --- | --- |
| **Set My ... Password** | Opens a masked dialog and stores your own password at that bank or agency, for example **Set My Gjaldskil Password**. |
| **Clear My ... Password** | Removes your stored password at that bank or agency, for example **Clear My InKasso Password**. |
| **Set My Landsbankinn API Key** | Stores your own Landsbankinn API key. |
| **Clear My Landsbankinn Secrets** | Removes both your Landsbankinn password and your Landsbankinn API key. |

## How a call chooses the login

- **Your user name is filled in:** the call uses your user name with your own password. If no password
  of yours is stored, the call stops and tells you to set it. It never sends the company password with
  your user name.
- **Your user name is blank:** the call uses the company's user name and password.
- **Landsbankinn API key:** your own key is used when it is stored, the company's otherwise.

## Good to know

- Your password and API key are kept for you alone, in this company, in protected storage. Nobody else
  sees them, and you do not need `BIFROST TAdmin ori` to enter them.
- What you may do at the bank still depends on your permission sets in Business Central and on your
  rights at the bank.
