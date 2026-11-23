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
| **Username** | The company's user name at the bank. A user who has their own login enters it on **Bifrost User Setup**. |
| **Secrets** | **Complete** when your own authorization or the company authorization is stored for this bank; **Missing** when neither is stored. Certificate status is shown separately. The values are never shown. |
| **SOAP Signer** | For Íslandsbanki, Kvika banki and Sparisjóðir only: how requests are signed. Leave it blank unless the bank asks for another profile. Blank means the bank's usual profile: WSE2 for Íslandsbanki and Kvika banki, WSE3 for the savings banks. |

## Information

The **Information** FactBox keeps the existing secure connection status line and adds the following
authorization status for the selected bank, without displaying stored values.

| Field | Description |
| --- | --- |
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
| **Set My Bank Authorization** | Opens a masked dialog for your own authorization for the selected bank. The value is available only while you enter it and is not displayed again after saving. Your authorization is used before the company authorization. |
| **Clear My Bank Authorization** | Removes your own authorization for the selected bank after confirmation. The company authorization is unchanged. |
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

**Set your own authorization.** Select the bank, then choose **Set My Bank Authorization**. Enter your
personal API key for Landsbankinn, or your personal bank password for the other banks, in the masked
dialog and confirm. **My authorization** changes to **Registered** and **Authentication** to
**Available**. For your personal user name and other user settings, see
[Bank credentials for your user](/help/iceland-treasury/bank-user-setup/).

**Clear your own authorization.** Select the bank, choose **Clear My Bank Authorization** and confirm.
**My authorization** changes to **Not registered**. **Authentication** remains **Available** if company
authorization is stored; otherwise it changes to **Missing**. Cancelling leaves your authorization as it was.

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
