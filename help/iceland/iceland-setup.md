---
id: iceland-setup
title: "Bifrost Iceland Setup"
---

Use **Bifrost Iceland Setup** to select the Icelandic service clients, check their credential status
and open the registry and contribution reference pages. An administrator opens it from **Bifrost
Setup** → **Apps** → **Bifrost Iceland Setup**.

## Service settings

| Group | Settings and actions |
|---|---|
| **Umsjá** | **Umsja Client Type**, **Licence** and credential status. Use **Set User Name**, **Set Password** or **Clear Credentials** for the service account. |
| **SMS** | **SMS Client Type** and the default sender ID for Síminn. The group for the selected service shows its credential status and set/clear actions. |
| **Skatturinn** | **Skatturinn Client Type** and status for **VAT Password**, **Payroll Password** and **Capital Income Tax Password**. The set actions enter the corresponding passwords; **Clear Skatturinn Passwords** removes them. |
| **Skilagrein** | **Skilagrein Client Type** and **Collector Passwords** status. Passwords belong to individual collectors; set them on **Skilagrein Collectors**. |

Choose the client and account agreed with the service provider. Check **Company Information** →
**Registration No.** before tax submissions, because that identifies the company to Skatturinn.

For shared HTTP setup and credentials, follow [the company setup](/setup/business-central/)
and the help for [Bifrost Setup](/help/foundation/bifrost-setup/).

## Page actions

| Action | What it opens |
|---|---|
| **App Secrets** | The shared credential-management page, filtered to this app. |
| **Setup Wizard** | The shared Bifrost Setup Wizard. |
| **Skilagrein Collectors** | Collector information and each collector's password actions. |
| **National Registry Entries** | The local national registry copy. Shown when the Umsjá client is enabled. |

The service status fields show whether credentials are present; use the corresponding set or clear
action when changing a service account. Give access to this page only to the administrators who need
it, following [Permission sets and gates](/documentation/end-customers/permissions/).

## Connector setup wizard

The **Bifrost Iceland Connector Setup** wizard is available through **Assisted Setup**. It guides the
administrator through **Welcome**, **Connector Clients** and **Setup Complete**. Select the service
clients and sender IDs, then choose **Finish** to save them.

The shared Bifrost Setup Wizard handles HTTP and credentials. Complete that setup before checking a
service connection. Opening the Iceland connector wizard does not submit tax returns or send SMS.

## Check the setup

Check the selected service, credential status and company registration number, then perform an
appropriate read-only check with your assistant. Review the result before live submissions.
