---
id: bifrost-setup
title: "Bifrost Setup"
sidebar_label: "Setup"
sidebar_position: 22
---

The **Bifrost Setup** page is the central configuration point for Bifröst. Use it to select the implementation behind each business feature, set the default language and the monthly message quota, manage secrets and licensing, and - for Vendors and Partners - manage the partner program.

## Notifications

Every setup notification of the Bifröst family appears here, never on another application's page. Depending on the situation you see:

| Notification | Action |
| --- | --- |
| _HTTP client requests are not enabled for: &lt;applications&gt;_ | **Start setup wizard** opens the [Setup Wizard](/help/foundation/bifrost-setup-wizard/) on the HTTP step. |
| _The Bifrost End-User License Agreement has not been approved for this company_ | **Start setup wizard**. Until the agreement is approved, every call for the company is refused. |
| _Bifrost … license quota is running low_ | Shown when a Prepaid pool has fewer than 1,000 messages left. |
| _Request Debug Mode is ON_ | A reminder to switch off **Request Debug Mode** after troubleshooting. |
| _This tenant is eligible to register as a Bifrost Vendor_ | **Register as Vendor** - see [Working as a Vendor](/foundation/licensing/vendor/). |
| _A Bifrost Vendor has introduced this tenant as a Partner_ | **Register as Partner** - see [Working as a Partner](/foundation/licensing/partner/). |
| _A Bifrost Partner has invited this tenant as a Customer_ | **Register as Customer** - moves the tenant to the Subscription license. See [Being a Customer](/foundation/licensing/customer/). |
| _Pending customer / partner leave request(s) are waiting for review_ | Open **Pending Customer Leave Requests** or **Pending Partner Leave Requests**. |
| _Your leave request was rejected by …_ | Shows the reason the Partner or Vendor gave. |
| _Your Bifröst Partner relationship has ended_ / _A Bifröst Vendor has cancelled this Partner_ | A cancellation was applied on Sync - see [Leaving and cancelling](/foundation/licensing/leaving-and-cancelling/). |

The partner-program notifications are shown only to users with licence administration permission (the `BIFROST LicAdm ori` permission set). There is no notification for missing credentials: a credential that has not been entered disables the message types that need it. Enter credentials from **Secrets** or in the wizard.

## Fields

| Field | Description |
| --- | --- |
| **Customer Credit Limit Type** | The implementation used by `Customer.CreditLimit.Get`. The default uses the standard Business Central credit-limit calculation. Other apps can add implementations by extending the enum. |
| **Credit Limit Tolerance %** | A percentage (0–100) added on top of the customer's credit limit. With 10 % and a credit limit of 10,000 LCY, the customer may use up to 11,000 LCY before being flagged. |
| **Customer Statement Type** | The implementation used by `Customer.Statement.PDF`. |
| **Item Price Calculation Type** | The implementation used by `Item.Price.Get`. The default reads active sales price list lines, including customer-specific and all-customer price lists, with VAT. |
| **Default Language Code** | The language used for messages that do not send an `lcid`. When blank, the Company Information language is used, then English (1033). |
| **ChangeLog Write Guard** | Which fields `Data.Records.Set` may write, based on Change Log coverage. **Open** (default) - no check. **Blocked** - only fields covered by the change log. **Via force** - as Blocked, but a caller with the `BIFROST Force ori` permission set may pass `"force": true`. Exceptions are kept on [ChangeLog Guard Exceptions](/help/foundation/changelog-guard-exceptions/). |
| **Export Company Name Type** | Which company name `CSV.Records.Get` and `CSV.DeletedRecords.Get` write to the `$Company` column: **Company Name** (default, stable) or **Company Display Name** (falls back to Company Name when blank). |
| **Default Email Scenario** | The email scenario used to pick the sending account when a request does not name one. |
| **Request Debug Mode** | Stores full, unmasked request and response bodies in the [Request Log](/help/foundation/bifrost-request-log/). Use only while troubleshooting. Requires the `BIFROST ReqLgAdm ori` permission set. |
| **Company Monthly Message Quota** | The most chargeable messages the company may use in a calendar month, on either license type. `0` means no limit. When the quota is reached, calls are refused until the next month. Not enforced in a sandbox. Counted from the Bifrost Messages not yet reported by the daily usage sync, so it caps the messages since the last sync rather than the full month; keep at least 31 days of Bifrost Messages in the retention policy. See [How the monthly quotas are counted](/foundation/licensing/license-types/#how-monthly-quotas-are-counted). |

The **Environment** group (online only) shows the **Environment Name**, **Company Id**, **Azure Tenant Id**, the **Task API Url** and **Queue API Url** of this company, and a **Connection Prompt** you can paste into an AI assistant to connect it to this environment.

The page also lists the **Available Message Types** and, for licence administrators outside a sandbox, the [License fact box](/help/foundation/license-fact-box/).

## Actions

| Group | Action | Description |
| --- | --- | --- |
| Messages | **Bifrost Messages** | The messages in the queue. |
| | **Request Log** | Your outbound HTTP requests - see [Bifrost Request Log](/help/foundation/bifrost-request-log/). |
| | **Delete Log** / **Delete Setup** | The audit log of deleted records and its setup. |
| Setup | **User Setup** | Per-user setup: linked records, system prompt, monthly message quota. |
| | **Field Access** | Field-level read/write restrictions - see [Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/). |
| | **ChangeLog Guard Exceptions**, **Change Log Setup**, **Retention Policies** | Change-log guard exceptions, change-log coverage and automatic clean-up. Keep at least 31 days of Bifrost Messages when you use the monthly quotas. |
| | **Secrets** | The secrets every installed Bifröst application needs - see [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/). |
| | **Setup Wizard** | Opens the [Setup Wizard](/help/foundation/bifrost-setup-wizard/). |
| Licensing | **Sync** | Reports pending usage to the licensing service, refreshes the licence status, and applies invitations, cancellations and leave-request outcomes. Also runs once a day in the background. |
| | **Revoke EULA Approval** | Withdraws the licence agreement approval for this company; calls are refused until the wizard is run again. |
| | **License Usage** | The usage entries of your tenant - see [Bifrost Usage Entries](/help/foundation/license-usage/). |
| | **Configure Rate Limit** | Subscription tenants, production only - see [Configure Rate Limit](/help/foundation/rate-limit-configuration/). |
| | **Onboard as Vendor** | Tenants approved as a Vendor - see [Vendor Onboarding](/help/foundation/vendor-onboarding-wizard/). |
| | **Partner Management**, **Pending Partner Leave Requests**, **Deregister as Vendor** | Vendors - see [Working as a Vendor](/foundation/licensing/vendor/). |
| | **Customer Management** | Partners and Vendors - see [Customer Management](/help/foundation/customer-management/). |
| | **Pending Customer Leave Requests**, **Request to Leave Vendor** | Partners - see [Working as a Partner](/foundation/licensing/partner/). |
| | **Request to Leave Partner** | Customers - see [Being a Customer](/foundation/licensing/customer/). |
| Connectors | **Microsoft Copilot**, **OpenAI ChatGPT** | Open the Bifröst connector in each AI agent store. |
| Memory | **Memory**, **User Memory** | Company- and user-scoped memory records. |
| | **Bifrost Translations**, **Bifrost Integration** | Translations and the integration log. |
| Apps | **Find Apps** | The registry of applications built on Bifröst. Installed Bifröst applications add their own setup action to this group. |

## Tips

-   The setup record is created automatically when you open the page for the first time.
-   Changing the **Default Language Code** takes effect immediately for all subsequent messages.
-   The licensing actions are shown only to users with licence administration permission.
