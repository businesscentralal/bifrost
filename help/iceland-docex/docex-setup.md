---
id: docex-setup
title: "Bifröst DocEx Setup"
sidebar_label: "DocEx Setup"
sidebar_position: 2
---

**Bifröst DocEx Setup** is the single setup page of the document exchange module. It is opened from the **Apps** group on the Bifröst **Setup** page and holds one section per provider: the environment to talk to, the credential status, and the actions that enter, clear and test the credentials.

There is one setup record per company, created automatically the first time the page opens.

## Providers

Each provider group has an **Environment** field selecting which service the module calls — normally Live or Test — and a read-only **Credentials** status showing whether the values that provider needs have been entered.

| Group | Fields |
| --- | --- |
| **Advania** | Environment, Web UI User Name, Credentials status. |
| **Unimaze** | Environment, Credentials status. |
| **InExchange** | Environment, Credentials status. |
| **BIS30 Reference Data** | Environment. The Peppol reference lists need no credentials. |

Changing an environment changes which secret the module reads: credentials are stored per provider **and** per environment, so a Test key never leaks into a Live call.

## Credentials

Credentials are never fields on this page. They live in the Bifröst secret store and are never shown again — the page reports only whether a value exists.

Each provider needs its own values, stored per environment:

| Provider | Values |
| --- | --- |
| Advania | User name and password for the Advania API. |
| Unimaze | User name and password (the password field also takes an API key). |
| InExchange | API key, and the client token that identifies the company. |

Credentials entered in Origo Cloud Events DocEx cannot be carried over. Enter each value once after installing.

## Actions

| Group | Action | Description |
| --- | --- | --- |
| **Advania** | Set Username / Set Password | Opens the shared masked dialog and stores the value for the selected environment. |
| | Clear Credentials | Removes both stored values for the selected environment. |
| | Test Advania Connection | Calls the provider with the stored credentials and reports the result. |
| | Open Advania Web UI | Opens an authenticated session in the Advania web interface. |
| **Unimaze** | Set Username / Set Password or API Key | Stores the value for the selected environment. |
| | Clear Credentials | Removes both stored values. |
| | Test Unimaze Connection | Verifies the stored credentials. |
| **InExchange** | Set API Key / Set Client Token | Stores the value for the selected environment. |
| | Clear Credentials | Removes both stored values. |
| | Test InExchange Connection | Verifies the stored credentials. |
| **General** | App Secrets | Opens the Bifröst App Secrets list filtered to Bifrost Iceland DocEx: every secret the module needs, and whether a value has been entered. |
| | Update BII Data Exchange Definitions | Recreates the `BIIINVOICE` and `BIICREDITMEMO` data exchange definitions. Run it if you import incoming documents. |
| | BIS30 Code Map | Opens the [BIS30 Code Map](/help/iceland-docex/bis30-code-map/). |
| | VAT G/L Account Map | Opens the [Vendor VAT G/L Account Map](/help/iceland-docex/vend-vat-gl-map/). |

## Outbound HTTP

Every provider is reached over HTTP. Outbound HTTP for the Bifröst apps is turned on by the setup wizard: until it is, **Bifröst Setup** shows a notification with the action **Start setup wizard**, and no document exchange call succeeds.

## Getting started

1.  Open **Bifröst Setup**. If it shows the HTTP notification, choose **Start setup wizard** first. Then choose **Bifrost Iceland DocEx Setup** in the **Apps** group.
2.  Set the **Environment** for each provider you use.
3.  Enter the credentials for those providers with the **Set …** actions.
4.  Choose **Test … Connection** for each provider and confirm it succeeds.
5.  Choose **Update BII Data Exchange Definitions** if you import incoming documents.
6.  Send and receive documents through Bifröst, for example by asking your AI assistant.
