---
id: treasury-setup-wizard
title: "Bifrost Iceland Treasury - Bank Setup"
---

**Bifrost Iceland Treasury - Bank Setup** is the assisted setup that connects Business Central to the
Icelandic banks, one bank at a time. It is for the administrator who sets the app up, and needs
`BIFROST TAdmin ori`.

Start it from **Assisted Setup**, where it is listed as **Set up Bifrost Iceland Treasury banks**. You can
set up one bank now and come back for the others: leaving early keeps what you entered, and running the
guide again never resets a bank you have already set up.

Before you start, allow outgoing HTTP requests for Bifröst apps in the
[Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/). Nothing reaches a bank until they are
allowed.

## Steps

**Welcome.** Says what the guide covers and reminds you to allow outgoing HTTP requests first.

**One step per bank.** Landsbankinn, Arion banki, Íslandsbanki and Kvika banki, each with the same fields:

| Field | Description |
| --- | --- |
| **Bank** | The bank this step sets up. |
| **Enabled** | Leave it on for a bank you use; turn it off for one you do not. |
| **Username** | The company's user name at the bank. |
| **Company Password** | **Stored** or **Not stored**. Use **Set Company Password** to enter it. |
| **Certificate** | **Stored** or **Not stored**. Use **Set Certificate** to upload the `.pfx` file and enter its password. |
| **API Key** | Landsbankinn only. **Stored** or **Not stored**. Use **Set API Key** to enter it. |

Each action opens a masked dialog that names the bank and the secret. A certificate is opened with its
password before either is stored, so a wrong password is caught at once.

**Finish.** On the last bank, **Finish** saves the bank you were on, marks the assisted setup as done
and closes the guide.

## After the guide

Everything the guide sets can be changed later on
[Bifrost Iceland Treasury Setup](/help/iceland-treasury/treasury-setup/), which also shows the
certificate's expiry date and opens the tracking pages. If a bank shows **Missing** under **Secrets**
there, a password, certificate or API key it needs was not entered.
