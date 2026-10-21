---
id: iceland-setup
title: "Bifrost Iceland Setup"
sidebar_position: 1
---

**Bifrost Iceland Setup** is where the administrator chooses which environment each Icelandic service
uses and enters the credentials the services need. Everything for Umsjá, Síminn, Skatturinn and
Skilagrein is on this one page.

Open it from the list of installed apps on [Bifrost Setup](/help/foundation/bifrost-setup/). There is one setup record per company. The **Bifrost Iceland Connector Setup**
guide, started from **Assisted Setup**, shows the choices of this page step by step (the client types, the
Umsjá license and the sender ID), so this page describes it too. The guide takes no passwords: enter them
here or in the Bifrost Setup Wizard.

Credentials are never shown. Each **Set** action opens a masked dialog, the value goes straight to
protected storage, and the page only reports whether a value is **Stored** or **Not set**. Outgoing HTTP
requests for the app, and the credentials of every Bifröst app, are also managed in the
[Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/). Nothing reaches an outside service until
HTTP requests are allowed there.

## Umsjá

Umsjá is the service that delivers the national registry (Þjóðskrá). It needs a license.

| Field | Description |
| --- | --- |
| **Umsja Client Type** | Which Umsjá connection the national registry operations use. |
| **Licence** | The Umsjá license number. It is sent with every sign-in. |
| **Credentials** | Whether the Umsjá user name and password are stored. |

## SMS

| Field | Description |
| --- | --- |
| **SMS Client Type** | The gateway used to send SMS. Síminn is the gateway of this version. |
| **Síminn Default Sender ID** | The sender shown on the text message when the request does not name one, up to 11 characters. |
| **Credentials** | Whether the Síminn magnSMS user name and password are stored. |

## Skatturinn

Skatturinn (the Directorate of Internal Revenue, RSK) receives the VAT, payroll withholding and capital
income tax returns.

| Field | Description |
| --- | --- |
| **Skatturinn Client Type** | **Live** calls Skatturinn's production service. **Test** calls Skatturinn's test environment. The live and the test environment each have their own passwords. Start with **Test**. |
| **VAT Password** | Whether the password of the VAT (virðisaukaskattur) web service is stored. The kennitala is read from **Registration No.** on **Company Information**, not from this page. |
| **Payroll Password** | Whether the password of the payroll withholding (staðgreiðsla) web service is stored. |
| **Capital Income Tax Password** | Whether the capital income tax (fjármagnstekjuskattur) password is stored. When it is not, the payroll password is used instead. |

## Skilagrein

| Field | Description |
| --- | --- |
| **Skilagrein Client Type** | Which connection the contribution returns use. |

Each collector has its own web service password. Open **Skilagrein Collectors** and use **Set Web Service
Password** on the collector; see [Skilagrein Collectors](/help/iceland/iceland-skilagrein/).

## Actions

| Action | Description |
| --- | --- |
| **Set User Name**, **Set Password**, **Clear Credentials** | Enter or remove the Umsjá user name and password. |
| **Set Síminn User Name**, **Set Síminn Password**, **Clear Síminn Credentials** | Enter or remove the Síminn magnSMS user name and password. |
| **Set VAT Password**, **Set Payroll Password**, **Set Capital Income Tax Password** | Enter the password of that Skatturinn service for the environment chosen in **Skatturinn Client Type**. |
| **Clear Skatturinn Passwords** | Removes the stored VAT, payroll and capital income tax passwords of the chosen environment. |
| **App Secrets** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/) filtered to this app, to see which credentials are stored, when they were entered and by whom. |
| **Setup Wizard** | Opens the Bifrost Setup Wizard. |
| **Skilagrein Collectors** | Opens the list of collectors. |
| **National Registry Entries** | Shown when the Umsjá client is enabled. Opens the local copy of the national registry; see [National Registry Entries](/help/iceland/iceland-umsja-registry/). |

## Good to know

- Credentials are not copied when you upgrade from an earlier version or install next to a predecessor
  app. Enter every password and license again on this page.
- Changing **Skatturinn Client Type** changes which stored passwords are used. A password entered for
  **Test** does not work on **Live**.
- Who may send returns, load the national registry or send SMS is set with permission sets; see
  [Permissions](/iceland/#permissions).
- The request log masks the content of calls to Umsjá, Skatturinn and Skilagrein. Turning on
  **Request Debug Mode** in Bifrost Setup keeps it in full while you troubleshoot; turn it off again
  afterwards.
