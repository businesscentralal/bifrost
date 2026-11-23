---
id: treasury-setup
title: "Bifrost Iceland Treasury Setup"
---

**Bifrost Iceland Treasury Setup** is where an administrator connects Business Central to the Icelandic
banks and to the claim collection agencies Gjaldskil and InKasso. It lists one row per bank or agency, so
you see at a glance which are switched on, which have a user name, and whether authentication is available. It is
also where the tracking pages are opened from.

Open it with **Iceland Treasury** in the **Apps** group on [Bifrost Setup](/help/foundation/bifrost-setup/).
Only a holder of `BIFROST TAdmin ori` can change the bank setup or store, clear and copy company credentials.
For everyone else the setup fields are read-only. You can still set or clear your own bank authorization.

Outgoing HTTP requests are not allowed here. The [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/)
allows them for every installed Bifröst app, this one included. Nothing reaches a bank until they are
allowed.

## Fields

| Field | Description |
| --- | --- |
| **Bank** | The bank or claim collection agency the row configures. The four savings banks share one row, **Sparisjóðir**. |
| **Enabled** | Whether the bank may be called. Turn it off to stop every operation of that bank without removing its settings. |
| **Username** | The company's user name at the bank. A user who has their own login sets it with **Set My Bank Authorization**, which stores the name on that user's **Bifrost User Setup**. A blank personal name keeps this company default. |
| **Secrets** | **Complete** when your own authorization or the company authorization is stored for this bank; **Missing** when neither is stored. Certificate status is shown separately. The values are never shown. |
| **SOAP Signer** | Shown only for Íslandsbanki, Kvika banki and Sparisjóðir. Leave it blank unless the bank tells you to use WSE2 or WSE3. Blank uses the bank's usual profile: WSE2 for Íslandsbanki and Kvika banki, WSE3 for the savings banks. |

## Information

The **Information** FactBox follows the selected bank. It keeps the secure connection status line and
shows the user name in use, plus the authorization status below. It does not show a password.

| Field | Description |
| --- | --- |
| **User name** | The user name used for the selected bank. Your own name is shown as **(own)**. The company name is shown as **(company default)**. When no company user name is stored, the field shows **(company default)** on its own. |
| **My authorization** | **Registered** when you have stored your own authorization for the selected bank; **Not registered** otherwise. |
| **Authentication** | **Available** when your own authorization or the company authorization is stored; **Missing** only when neither is stored. |

**Not registered** can therefore appear together with **Available** when the company authorization is
stored. **Available** describes stored authorization; it does not confirm that the bank accepts it or
that the certificate is valid. Check the separate **Certificate** FactBox for certificate details.

## Certificate

The **Certificate** FactBox shows the client certificate stored for the selected bank: **Subject**,
**Issuer**, **Thumbprint**, **Valid From** and **Expires**. Renew the certificate with the bank before
it expires and store the new one with **Set Certificate**: the bank refuses requests signed with an
expired certificate. When no certificate is stored, or the stored one cannot be opened with its
password, the FactBox says so. Gjaldskil and InKasso use no certificate.

## Actions

| Action | Description |
| --- | --- |
| **Set Company Password** | Opens a masked dialog and stores the company's password at the selected bank. |
| **Set My Bank Authorization** | Asks for your user name and your own authorization for the selected bank in one dialog. The user name is saved on your **Bifrost User Setup**. Leave it blank, or leave an unchanged company-default hint, to keep the company default. The authorization (your password, or your API key at Landsbankinn) is masked, stored for you alone and is not shown again. Your authorization is used before the company authorization. |
| **Clear My Bank Authorization** | Removes your own authorization for the selected bank after you confirm. The company authorization is unchanged. When you also have your own user name for that bank, a second question asks whether to remove it. Declining the first question changes nothing. Declining the second keeps the user name. |
| **Copy Certificate To...** | Copies the selected bank's company certificate and its password to another bank. Requires `BIFROST TAdmin ori` and asks before replacing an existing certificate at the destination. |
| **Set Certificate** | Uploads the client certificate (a `.pfx` file) and asks for its password. The certificate is opened with the password before either is stored, so a wrong password is caught at once. Not available for Gjaldskil and InKasso. |
| **Set Bank Certificate** | Íslandsbanki only. Uploads the bank's own public certificate. |
| **Set API Key** | Landsbankinn only. Stores the company's API key. |
| **Clear Company Secrets** | Removes every stored company secret of the selected bank, after you confirm. |
| **Recreate Setup Data** | Creates the bank's statement import format and its bank export/import setup again where they are missing. Safe to run at any time. Not available for Gjaldskil and InKasso, which have no statements. |
| **Refresh Bank Statement Config** | Deletes and recreates the bank's statement import format and its bank export/import setup. Not available for Gjaldskil and InKasso. |
| **Bank Payment Batches** | Opens [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/). |
| **Bank Claims** | Opens [Bank Claims](/help/iceland-treasury/bank-claims/). |
| **Bank Claim Batches** | Opens [Bank Claim Batches](/help/iceland-treasury/bank-claim-batches/). |
| **Bank Claim Payments** | Opens [Bank Claim Payments](/help/iceland-treasury/bank-claim-payments/). |
| **Bank Tracking Log** | Opens the [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/). |
| **Setup Wizard** | Opens the Bifrost Setup Wizard, which allows outgoing HTTP requests and walks through the credentials of every Bifröst app. |
| **Bifrost App Secrets** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/). |
| **Bifrost Setup** | Opens [Bifrost Setup](/help/foundation/bifrost-setup/). |

## What each bank needs

| Bank or agency | Password | Client certificate | API key |
| --- | --- | --- | --- |
| Arion banki | Yes | Yes | No |
| Íslandsbanki | Yes | Yes | No |
| Kvika banki | Yes | Yes | No |
| Landsbankinn | Yes | Yes | Yes |
| Sparisjóðir | Yes | Yes | No |
| Gjaldskil | Yes | No | No |
| InKasso | Yes | No | No |

The actions that do not apply to the selected bank are not available. See
[Bank secrets](/help/iceland-treasury/treasury-secrets/) for where the values are kept.

## Common tasks

**Connect a bank.** Select its row, enter **Username**, then choose **Set Company Password**, **Set
Certificate** and, for Landsbankinn, **Set API Key**. **Secrets** turns to **Complete**. For Gjaldskil
and InKasso the company password is all that is needed.

**Set your own authorization.** Select the bank, then choose **Set My Bank Authorization**. When you
have no user name of your own, the dialog shows the company user name as a hint. Enter your user name,
or leave the field blank or the hint unchanged to keep the company default. When you already have your
own user name, the dialog shows that name: leave it, clear it to return to the company default, or type
a new one. Then enter your personal API key for Landsbankinn, or your personal bank password for the
other banks, in the masked field and confirm. The name is stored on your
[Bifrost User Setup](/help/iceland-treasury/bank-user-setup/). **User name** on **Information** shows
your name with **(own)**, or the company name with **(company default)**. **My authorization** changes
to **Registered** and **Authentication** to **Available**.

**Clear your own authorization.** Select the bank, choose **Clear My Bank Authorization** and confirm.
Your authorization is removed and the company authorization stays. If you have your own user name for
that bank, a second question asks whether to remove it. Declining the first question changes nothing.
Declining the second keeps your user name. **My authorization** changes to **Not registered**.
**Authentication** remains **Available** if company authorization is stored; otherwise it changes to
**Missing**.

**Copy a company certificate.** With `BIFROST TAdmin ori`, select the bank that holds the certificate,
choose **Copy Certificate To...**, then select another bank. Only banks that use a client certificate
are offered. The certificate and its password are copied together. If the destination already has a
certificate, confirm before it is replaced; cancelling leaves it unchanged. No copy is made if the
source bank has no stored certificate. Select the destination row to check its **Certificate** FactBox.

**Stop using a bank.** Turn off **Enabled**. Its operations stop and its settings stay, so you can turn it
on again later.

**Renew a certificate.** Choose **Set Certificate** and upload the new `.pfx` file with its password. The
FactBox shows the new expiry date.

**Repair statement import.** When **Import Bank Statement** cannot find the bank's import format, choose
**Recreate Setup Data** on the bank's row.

## Good to know

- The setup wizard [Bifrost Iceland Treasury - Bank Setup](/help/iceland-treasury/treasury-setup-wizard/)
  walks through the same settings one bank or agency at a time.
- Passwords, certificates and keys stay in protected storage and are never shown again; see
  [Bank secrets](/help/iceland-treasury/treasury-secrets/).
- What each bank covers: [Arion banki](/iceland-treasury/banks/arion/),
  [Íslandsbanki](/iceland-treasury/banks/islandsbanki/), [Kvika banki](/iceland-treasury/banks/kvika/),
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/) and [Sparisjóðir](/iceland-treasury/banks/sparisjodir/);
  the claim collection agencies: [Gjaldskil](/iceland-treasury/agencies/gjaldskil/) and
  [InKasso](/iceland-treasury/agencies/inkasso/).
