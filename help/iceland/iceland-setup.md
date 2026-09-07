---
id: iceland-setup
title: "Bifrost Iceland Setup"
sidebar_label: "Bifrost Iceland Setup"
sidebar_position: 2
---

The **Bifrost Iceland Setup** card (`Iceland Setup ori`) holds every setting of the Bifröst Iceland connectors — Umsjá, SMS, Skatturinn, Skilagrein and Já Gagnatorg. Open it from the **Bifrost Iceland Setup** action in the **Apps** group of the Bifröst **Setup** page, where it is also promoted, or by searching for *Bifrost Iceland Setup*. There is exactly one setup record per company.

Nothing about Iceland is configured on Bifröst Foundation's own setup card any more. Foundation's **Setup** page carries a single Iceland action, and everything else lives here, so the app can be installed, configured and removed on its own.

A guided **Set up Bifrost Iceland connectors** wizard (`Iceland Setup Wizard ori`) walks through the connector client-type settings step by step. Start it from **Assisted Setup**, or from the **Setup Wizard** action on this page. Outbound HTTP and every credential on this page are configured once, for every installed Bifröst application, by Bifröst Foundation's own **Bifrost Setup Wizard** - this app's wizard does not repeat either step.

## Notifications

The card raises two notifications when they apply.

| Notification | What to do |
| --- | --- |
| Outgoing HTTP client requests are not allowed for Bifröst Iceland. | Use the **Open Extension Settings** action on the notification and switch **Allow HttpClient Requests** on. No connector reaches an external service until this is on. |
| Credentials are missing for one or more domains. | The text lists the domains that have nothing stored yet. Use the actions of that domain to enter the credentials. |

## Umsjá

Þjóðskrá lookups through the Umsjá service.

| Field | Description |
| --- | --- |
| Umsja Client Type | Which Umsjá client the connector uses — the live service, or the test/none client. |
| Umsja Licence | The Umsjá licence number issued to the company. |
| Credentials | Whether an Umsjá user name and password are stored. Read-only — use the actions to set or clear them. |

| Action | Description |
| --- | --- |
| Set User Name | Prompts for the Umsjá web-service user name in the shared masked dialog. |
| Set Password | Prompts for the Umsjá web-service password in the shared masked dialog. |
| Clear Credentials | Removes the stored Umsjá user name and password. |

Umsjá credentials unlock `Iceland.NationalRegistry.*`, `Iceland.Search*`, `Iceland.Parties.Get`, `Iceland.Relations.Get` and the related lookups. The objects are covered by **BIFROST Umsja ori**, which is not assignable on its own — it comes with **BIFROST ISFull ori**. Registry synchronization is gated separately by the assignable **BIFROST NatReg ori**.

## SMS

| Field | Description |
| --- | --- |
| SMS Client Type | Which gateway handles `Iceland.SMS.Send` — Síminn, Síminn (SOAP) or Nova. The sub-groups below follow this choice. |

### Síminn

Shown when the client type is Síminn or Síminn (SOAP).

| Field | Description |
| --- | --- |
| Síminn Default Sender ID | Sender shown to the recipient when the request does not name one. Maximum 11 characters. |
| Credentials | Whether a Síminn user name and password are stored. Read-only. |

| Action | Description |
| --- | --- |
| Set Síminn User Name | Prompts for the Síminn magnSMS user name. |
| Set Síminn Password | Prompts for the Síminn magnSMS password. |
| Clear Síminn Credentials | Removes the stored Síminn user name and password. |

### Nova

Shown when the client type is Nova.

| Field | Description |
| --- | --- |
| Nova Default Sender ID | Sender used for the Nova gateway when the request does not name one. |
| Credentials | Whether a Nova user name and password are stored. Read-only. |

| Action | Description |
| --- | --- |
| Set Nova User Name | Prompts for the Nova SMS user name. |
| Set Nova Password | Prompts for the Nova SMS password. |
| Clear Nova Credentials | Removes the stored Nova user name and password. |

Sending to Icelandic numbers requires **BIFROST SMS ori**; sending to foreign numbers additionally requires **BIFROST SMS Fgn ori**.

## Skatturinn

| Field | Description |
| --- | --- |
| Rsk Client Type | Live or Test. Test submits to the RSK sandbox with no real tax consequences. |
| VAT Password | Whether the VAT (virðisaukaskattur) password is stored. Read-only. |
| Payroll Password | Whether the payroll (staðgreiðsla) password is stored. Read-only. |
| Capital Income Tax Password | Whether the capital income tax (fjármagnstekjuskattur) password is stored. Read-only. |

| Action | Description |
| --- | --- |
| Set VAT Password | Prompts for the VAT web-service password. |
| Set Payroll Password | Prompts for the payroll web-service password. |
| Set Capital Income Tax Password | Prompts for the capital income tax web-service password. |
| Clear Skatturinn Passwords | Removes all three stored Skatturinn passwords. |

The kennitala used to authenticate against Skatturinn is read from **Company Information → Registration No.** It is never entered on this page, so set it there before submitting anything.

When no capital income tax password is stored, the payroll password is used for capital income tax as well. Store a separate one only when RSK issued a different password for that service.

Permission sets: **BIFROST VAT ori** for VAT, **BIFROST Payroll ori** for payroll, **BIFROST CapTax ori** for capital income tax.

## Skilagrein

| Field | Description |
| --- | --- |
| Skg Client Type | Which Skilagrein web client the connector uses. |

There is no Skilagrein password on this page. Each collector authenticates with its own web-service password, entered on the [Skilagrein Collectors](/help/iceland/iceland-skilagrein/) page with the **Set Web Service Password** action. Submitting to a collector requires **BIFROST Collect ori**.

## Já Gagnatorg

| Field | Description |
| --- | --- |
| Ja Client Type | Which Já Gagnatorg client the connector uses. |
| Search API Key | Whether the Já Search v6 (Símaskrá) key used by `Ja.Search.Query` is stored. Read-only. |
| Registry API Key | Whether the Já Skrá v1 (Þjóðskrá / Fyrirtækjaskrá) key used by `Ja.Person.Get` and `Ja.Company.Get` is stored. Read-only. |

| Action | Description |
| --- | --- |
| Set Search API Key | Prompts for the Já Search API key. |
| Set Registry API Key | Prompts for the Já Registry API key. |
| Clear Já API Keys | Removes both stored Já API keys. |

Calling any of the three real Já Gagnatorg message types additionally requires **BIFROST Ja ori**. `Help.Ja.Get` is open to all users.

## Other actions

| Action | Description |
| --- | --- |
| App Secrets | Opens Bifröst Foundation's app secrets list, filtered to Bifröst Iceland, showing every registered secret and whether it is set. |
| Setup Wizard | Starts the **Set up Bifrost Iceland** assisted setup. |
| Skilagrein Collectors | Opens the [Skilagrein Collectors](/help/iceland/iceland-skilagrein/) master-data page. |
| National Registry Entries | Opens the [National Registry Entries](/help/iceland/iceland-umsja-registry/) cache. |

## Where the credentials live

Every credential is held in the Bifröst Foundation **secret store**, not on this page and not in the setup table. Each **Set …** action opens the same shared masked dialog: the value is masked while you type, goes straight into storage, and is never displayed again. The fields on the card only report whether a value is present.

| Secret code | Holds | Scope |
| --- | --- | --- |
| `UMSJA-USERNAME` | Umsjá web-service user name | Company |
| `UMSJA-PASSWORD` | Umsjá web-service password | Company |
| `SIMINN-USERNAME` | Síminn magnSMS user name | Company |
| `SIMINN-PASSWORD` | Síminn magnSMS password | Company |
| `NOVA-USERNAME` | Nova SMS user name | Company |
| `NOVA-PASSWORD` | Nova SMS password | Company |
| `RSK-VAT-PASSWORD` | Skatturinn VAT password | Company |
| `RSK-PAYROLL-PASSWORD` | Skatturinn payroll password | Company |
| `RSK-FTS-PASSWORD` | Skatturinn capital income tax password | Company |
| `JA-SEARCH-API-KEY` | Já Search v6 API key | Company |
| `JA-REGISTRY-API-KEY` | Já Skrá v1 API key | Company |
| `SKG-COLLECTOR-<collector no.>-PASSWORD` | One per skilagrein.is collector, set from the collectors page | Company |

The values are written to IsolatedStorage owned by the Bifröst Foundation extension, never to a table field, never to telemetry and never to the request log.

## Notes

-   **Credentials do not carry over from Origo Cloud Events Iceland.** IsolatedStorage is private to each extension, so nothing stored by the predecessor app is readable here. An administrator has to enter every credential once after installing Bifröst Iceland.
-   The non-secret settings — client type selections, the Umsjá licence and the sender IDs — are taken over automatically on install and upgrade. Only the secrets need re-entering.
-   Use the Skatturinn Test client type for the first submissions and switch to Live once the payloads validate.
-   Message types that need no credentials — holidays, postal codes, ISO currencies, Seðlabanki rates, island.is lookups — work as soon as HTTP client requests are enabled.
-   **BIFROST ISFull ori** is a permission set extension: it adds every Iceland object to Bifröst Foundation's **BIFROST Full ori**. Assign **BIFROST Full ori** — the Iceland objects come with it.

## The setup wizard

**Set up Bifrost Iceland connectors** (`Iceland Setup Wizard ori`) covers the connector client-type settings in three steps.

| Step | Covers |
| --- | --- |
| Welcome | What the wizard configures, and a pointer to Bifrost Setup Wizard for HTTP and credentials. |
| Connector Clients | The client type of each domain — Umsjá, SMS, Skatturinn, Skilagrein, Já Gagnatorg — plus the Umsjá licence and the SMS sender ids. |
| Finish | Saves the settings. |

This wizard neither enables HTTP nor collects a credential. Both are configured once, for every installed Bifröst application, in Bifröst Foundation's **Bifrost Setup Wizard** (Bifröst Setup, action **Start setup wizard**) - run that first if the connectors here cannot reach the Icelandic services.
