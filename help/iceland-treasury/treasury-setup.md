---
id: treasury-setup
title: "Bifrost Iceland Treasury Setup"
---

**Bifrost Iceland Treasury Setup** is where an administrator connects Business Central to the Icelandic
banks. It lists one row per bank, so you see at a glance which banks are switched on, which have a user
name, and which still miss a secret. It is also where the tracking pages are opened from.

Open it with **Iceland Treasury** in the **Apps** group on [Bifrost Setup](/help/foundation/bifrost-setup/).
Only a holder of `BIFROST TAdmin ori` can change it; for everyone else it opens read-only and the actions
that store or clear secrets are not available.

Outgoing HTTP requests are not allowed here. The [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/)
allows them for every installed Bifröst app, this one included. Nothing reaches a bank until they are
allowed.

## Fields

| Field | Description |
| --- | --- |
| **Bank** | The bank the row configures. |
| **Enabled** | Whether the bank may be called. Turn it off to stop every operation of that bank without removing its settings. |
| **Username** | The company's user name at the bank. A user who has their own login enters it on **Bifrost User Setup**. |
| **Secrets** | **Complete** when every secret this bank needs is stored, **Missing** otherwise. The values are never shown. |
| **SOAP Signer** | For Íslandsbanki and Kvika banki only: how requests are signed. Leave it blank unless the bank asks for another profile. |

## Certificate

The **Certificate** FactBox shows the client certificate stored for the selected bank: **Subject**,
**Issuer**, **Thumbprint**, **Valid From** and **Expires**. Renew the certificate with the bank before
it expires and store the new one with **Set Certificate**: the bank refuses requests signed with an
expired certificate. When no certificate is stored, or the stored one cannot be opened with its
password, the FactBox says so.

## Actions

| Action | Description |
| --- | --- |
| **Set Company Password** | Opens a masked dialog and stores the company's password at the selected bank. |
| **Set Certificate** | Uploads the client certificate (a `.pfx` file) and asks for its password. The certificate is opened with the password before either is stored, so a wrong password is caught at once. |
| **Set Bank Certificate** | Íslandsbanki only. Uploads the bank's own public certificate. |
| **Set API Key** | Landsbankinn only. Stores the company's API key. |
| **Clear Company Secrets** | Removes every stored company secret of the selected bank, after you confirm. |
| **Recreate Setup Data** | Creates the bank's statement import format and its bank export/import setup again where they are missing. Safe to run at any time. |
| **Refresh Bank Statement Config** | Deletes and recreates the bank's statement import format and its bank export/import setup. |
| **Bank Payment Batches** | Opens [Bank Payment Batches](/help/iceland-treasury/bank-payment-batches/). |
| **Bank Claims** | Opens [Bank Claims](/help/iceland-treasury/bank-claims/). |
| **Bank Claim Batches** | Opens [Bank Claim Batches](/help/iceland-treasury/bank-claim-batches/). |
| **Bank Claim Payments** | Opens [Bank Claim Payments](/help/iceland-treasury/bank-claim-payments/). |
| **Bank Tracking Log** | Opens the [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/). |
| **Setup Wizard** | Opens the Bifrost Setup Wizard, which allows outgoing HTTP requests and walks through the credentials of every Bifröst app. |
| **Bifrost App Secrets** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/). |
| **Bifrost Setup** | Opens [Bifrost Setup](/help/foundation/bifrost-setup/). |

## What each bank needs

| Bank | Password | Client certificate | API key |
| --- | --- | --- | --- |
| Arion banki | Yes | Yes | No |
| Íslandsbanki | Yes | Yes | No |
| Kvika banki | Yes | Yes | No |
| Landsbankinn | Yes | Yes | Yes |

The actions that do not apply to the selected bank are not available. See
[Bank secrets](/help/iceland-treasury/treasury-secrets/) for where the values are kept.

## Common tasks

**Connect a bank.** Select its row, enter **Username**, then choose **Set Company Password**, **Set
Certificate** and, for Landsbankinn, **Set API Key**. **Secrets** turns to **Complete**.

**Stop using a bank.** Turn off **Enabled**. Its operations stop and its settings stay, so you can turn it
on again later.

**Renew a certificate.** Choose **Set Certificate** and upload the new `.pfx` file with its password. The
FactBox shows the new expiry date.

**Repair statement import.** When **Import Bank Statement** cannot find the bank's import format, choose
**Recreate Setup Data** on the bank's row.

## Good to know

- The setup wizard [Bifrost Iceland Treasury - Bank Setup](/help/iceland-treasury/treasury-setup-wizard/)
  walks through the same settings one bank at a time.
- Passwords, certificates and keys stay in protected storage and are never shown again; see
  [Bank secrets](/help/iceland-treasury/treasury-secrets/).
- What each bank covers: [Arion banki](/iceland-treasury/banks/arion/),
  [Íslandsbanki](/iceland-treasury/banks/islandsbanki/), [Kvika banki](/iceland-treasury/banks/kvika/) and
  [Landsbankinn](/iceland-treasury/banks/landsbankinn/).
