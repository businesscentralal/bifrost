---
id: iceland-setup
title: "Iceland Setup"
sidebar_label: "Iceland Setup"
sidebar_position: 2
---

Bifrost Iceland is configured from the **Iceland** group on the **Bifrost Setup** page, which the app adds through the page extension `Iceland Setup Ext ori`. A guided **Bifrost Iceland Setup** wizard (`Iceland Setup Wizard ori`) opens on first install and walks through the same settings step by step.

All settings are stored per company. Passwords are never written to the setup table — they go into Business Central Isolated Storage and can only be replaced, never read back.

## Step 1 — HTTP client requests

Every connector in this app calls an external web service. Business Central blocks outgoing HTTP from an extension until it is allowed, so the wizard checks the switch first and offers **Enable HTTP Client Requests** and **Open Extension Settings**. Nothing else works until this is on.

## Step 2 — Umsjá (national registry)

| Field | Description |
| --- | --- |
| Iceland Umsja Client Type | Which Umsjá client to use — the live service or the built-in test/none client. |
| Licence | The Umsjá licence number issued to the company. |
| Username | Umsjá web-service user name. Stored in Isolated Storage. |
| Password | Umsjá web-service password. Stored in Isolated Storage, shown masked. |
| Credentials Stored | Read-only indicator on the setup page showing whether a user name and password are present. |

Umsjá credentials unlock the `Iceland.NationalRegistry.*`, `Iceland.Search*`, `Iceland.Parties.Get`, `Iceland.Relations.Get` and related message types. Umsjá objects are covered by **BIFROST Umsja ori**, which is not assignable on its own — it comes with **BIFROST ISFull ori**. The registry synchronization is gated separately by the assignable **BIFROST NatReg ori**.

## Step 3 — SMS

| Field | Description |
| --- | --- |
| SMS Client Type | Which gateway handles `Iceland.SMS.Send` — Síminn, Síminn (SOAP), Nova, or none. |
| Síminn — Default Sender ID | Sender shown to the recipient when the request does not name one. |
| Síminn — Username / Password | Credentials for the Síminn magnSMS API. Stored in Isolated Storage. |
| Nova — Default Sender ID | Sender used for the Nova gateway. |
| Nova — Username / Password | Credentials for the Nova SMS API. Stored in Isolated Storage. |

Sending to Icelandic numbers requires **BIFROST SMS ori**; sending to foreign numbers additionally requires **BIFROST SMS Fgn ori**.

## Step 4 — Skatturinn (RSK)

| Field | Description |
| --- | --- |
| Skatturinn Client Type | Production or Test. Test submits to the RSK sandbox (`vefurp.rsk.is`) with no real tax consequences. |
| VAT Password | Password for the VAT (virðisaukaskattur) web service. Stored in Isolated Storage. |
| Payroll Password | Password for the payroll (staðgreiðsla) web service. Stored in Isolated Storage. |
| FTS Password | Optional. Password for the capital income tax (fjármagnstekjuskattur) web service. |
| VAT / Payroll / FTS Password Stored | Read-only indicators on the setup page showing which passwords are present. |

The company kennitala used to authenticate against Skatturinn is read from **Company Information**, not from this page — set the Registration Number there before submitting anything.

Permission sets: **BIFROST VAT ori** for VAT, **BIFROST Payroll ori** for payroll, **BIFROST CapTax ori** for capital income tax.

## Step 5 — Skilagrein

| Field | Description |
| --- | --- |
| Skilagrein Client Type | Which Skilagrein web client to use. |

Skilagrein passwords are _not_ entered on the setup page. Each collector has its own web-service password, entered from the [Skilagrein Collectors](/help/iceland/iceland-skilagrein/) page with the **Set Web Service Password** action. Submitting to a collector requires **BIFROST Collect ori**.

## Step 6 — Já Gagnatorg

| Field | Description |
| --- | --- |
| Search API Key | Já Search v6 (Símaskrá) API key, used by `Ja.Search.Query`. Stored in Isolated Storage, shown masked. |
| Search API Key Stored | Read-only indicator showing whether the Search key is present. |
| Registry API Key | Já Skrá v1 (Þjóðskrá / Fyrirtækjaskrá) API key, used by `Ja.Person.Get` and `Ja.Company.Get`. Stored in Isolated Storage, shown masked. |
| Registry API Key Stored | Read-only indicator showing whether the Registry key is present. |

Calling any of the three real Ja Gagnatorg message types additionally requires the **BIFROST Ja ori** permission set. `Help.Ja.Get` is open to all users.

## Related actions on the setup page

The Iceland group on the Bifrost Setup page also links the master-data pages: Skilagrein Collectors, Pension Funds, Unions, Rehabilitation Funds, Pension Supplements, and [National Registry Entries](/help/iceland/iceland-umsja-registry/).

## Notes

-   All passwords are held in Isolated Storage and are never exposed in logs, in the request log, or in API responses.
-   Passwords do not carry over from the predecessor app. Bifrost Iceland is a separate extension, and Isolated Storage is private to each extension, so every password must be entered again here after installation.
-   Use the Skatturinn test client type for the first submissions and switch to Production once the payloads validate.
-   Message types that need no credentials — holidays, postal codes, ISO currencies, Seðlabanki rates, island.is lookups — work as soon as HTTP client requests are enabled.
-   **BIFROST ISFull ori** is a permission set extension: it adds every Iceland object to Bifrost Foundation's **BIFROST Full ori**. Assign **BIFROST Full ori** — the Iceland objects come with it.
