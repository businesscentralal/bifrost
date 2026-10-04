---
id: bifrost-setup
title: "Bifrost Setup"
---

The **Bifrost Setup** page is the central configuration point for Bifröst. Use it to select the implementation behind each business feature, set the default language and the monthly message quota, and manage secrets and licensing.

## Notifications

Every setup notification of the Bifröst family appears here, never on another application's page. Depending on the situation you see:

| Notification | Action |
| --- | --- |
| _HTTP client requests are not enabled for: &lt;applications&gt;_ | **Start setup wizard** opens the [Setup Wizard](/help/foundation/bifrost-setup-wizard/) on the HTTP step. |
| _The Bifrost End-User License Agreement has not been approved for this company_ | **Start setup wizard**. Until the agreement is approved, every call for the company is refused. |
| _Bifrost … license quota is running low_ | Shown when a Prepaid pool has fewer than 200 messages left. |
| _Request Debug Mode is ON_ | A reminder to switch off **Request Debug Mode** after troubleshooting. |

There is no notification for missing credentials: a credential that has not been entered disables the message types that need it. Enter credentials from **Secrets** or in the wizard.

## Fields

| Field | Description |
| --- | --- |
| **Customer Credit Limit Type** | The implementation used when Bifröst reads a customer's credit limit. The default uses the standard Business Central credit-limit calculation. |
| **Credit Limit Tolerance %** | A percentage (0–100) added on top of the customer's credit limit. With 10 % and a credit limit of 10,000 LCY, the customer may use up to 11,000 LCY before being flagged. |
| **Customer Statement Type** | The implementation used when Bifröst produces a customer statement as a PDF file. |
| **Item Price Calculation Type** | The implementation used when Bifröst calculates an item's sales price. The default reads active sales price list lines, including customer-specific and all-customer price lists, with VAT. |
| **Default Language Code** | The language used for messages that do not send an `lcid`. When blank, the Company Information language is used, then English (1033). |
| **ChangeLog Write Guard** | Which fields Bifröst may change, based on Change Log coverage. **Blocked** (default) - only fields the change log records, fields with an [exception](/help/foundation/changelog-guard-exceptions/), and fields a user has a **Bypass** line for in [Field Access](/help/foundation/bifrost-field-accesses/). **Via force** - as Blocked, and a caller with the `BIFROST Force ori` permission set may force the change. **Open** - no check. In every setting, a forced change by a user with `BIFROST Force ori` may change the [company configuration fields](/documentation/end-customers/data-access/#company-configuration-fields) (posting dates, accounting periods, number series, the company's VAT and registration number) while a company is set up. |
| **Export Company Name Type** | Which company name a CSV export of records or deleted records writes to the `$Company` column: **Company Name** (default, stable) or **Company Display Name** (falls back to Company Name when blank). |
| **Default Email Scenario** | The email scenario used to pick the sending account when a request does not name one. |
| **Request Debug Mode** | Stores full, unmasked request and response bodies in the [Request Log](/help/foundation/bifrost-request-log/). Use only while troubleshooting. Requires the `BIFROST ReqLgAdm ori` permission set. |
| **Respect Data Sensitivity** | Shown under *Show more*. Whether the fields classified on [Bifrost Field Sensitivities](/help/foundation/bifrost-field-accesses/#field-sensitivities) are hidden from every user: **Off** (default) hides nothing, **Sensitive** hides the Sensitive fields, **Sensitive + Personal** hides both. A **None** line in Field Access opens a hidden field for one user. |
| **Company Monthly Message Quota** | The most chargeable messages the company may use in a calendar month, on either license type. `0` means no limit. When the quota is reached, calls are refused until the next month. Not enforced in a sandbox. On Subscription it does not count App Registration messages. Counted from the Bifrost Messages of the month, so keep at least 31 days of Bifrost Messages in the retention policy. See [How the monthly quotas are counted](/licensing/license-types/#how-monthly-quotas-are-counted). |

The **Environment** group (online only) shows the **Environment Name**, **Company Id**, **Azure Tenant Id**, the **Task API Url** and **Queue API Url** of this company, and a **Connection Prompt** you can paste into an AI assistant to connect it to this environment.

The page also lists the **Available Message Types** and, for licence administrators outside a sandbox, the [License fact box](/help/foundation/license-fact-box/).

## Actions

| Group | Action | Description |
| --- | --- | --- |
| Messages | **Bifrost Messages** | The messages in the queue. |
| | **Request Log** | Your outbound HTTP requests - see [Bifrost Request Log](/help/foundation/bifrost-request-log/). |
| | **Delete Log** / **Delete Setup** | The audit log of deleted records and its setup. |
| Setup | **User Setup** | Per-user setup: linked records, system prompt, monthly message quota. |
| | **Field Access** | Opens the [Field Access Overview](/help/foundation/bifrost-field-accesses/): the read and write lines of every user and application. |
| | **Field Sensitivities** | The company's classification of fields as Sensitive or Personal - see [Bifrost Field Sensitivities](/help/foundation/bifrost-field-accesses/#field-sensitivities). |
| | **ChangeLog Guard Exceptions**, **Change Log Setup**, **Retention Policies** | Change-log guard exceptions, change-log coverage and automatic clean-up. Keep at least 31 days of Bifrost Messages when you use the monthly quotas. |
| | **Remove Retention Registrations** | Run it in each company before you uninstall Bifröst. It removes the retention policies of the Bifröst log tables; no Bifröst data is deleted. Needs the Retention Pol. Admin permission set or SUPER. |
| | **Secrets** | The secrets every installed Bifröst application needs - see [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/). |
| | **Setup Wizard** | Opens the [Setup Wizard](/help/foundation/bifrost-setup-wizard/). |
| Licensing | **Sync** | Reports pending usage to the licensing service and refreshes the licence status. The daily background task only reports usage. |
| | **Revoke EULA Approval** | Withdraws the licence agreement approval for this company; calls are refused until the wizard is run again. |
| | **Connection Status** | Whether the licensing service can be reached, which connection secrets are available, whether an exhausted pool blocks messages, and the purchased and reported totals of the tenant. |
| | **License Usage** | The usage entries of your tenant - see [Bifrost Usage Entries](/help/foundation/license-usage/). |
| | **Configure Rate Limit** | Subscription tenants, production only. Raises the rate limit on sandbox usage through the public Bifröst MCP server - see [Configure Rate Limit](/help/foundation/rate-limit-configuration/). |
| Connectors | **Anthropic Claude**, **Microsoft Copilot**, **OpenAI ChatGPT** | Open the Bifröst connector in each AI assistant's store. |
| Memory | **Memory**, **User Memory** | Company- and user-scoped memory records. |
| | **Bifrost Translations**, **Bifrost Integration** | Translations and the integration log. |
| Apps | **Find Apps** | The registry of applications built on Bifröst. Installed Bifröst applications add their own setup action to this group. |

## Tips

-   The setup record is created automatically when you open the page for the first time.
-   Changing the **Default Language Code** takes effect immediately for all subsequent messages.
-   The licensing actions are shown only to users with licence administration permission.
