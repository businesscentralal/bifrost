---
id: customer-registration-wizard
title: "Bifrost Customer Registration"
---

The **Bifrost Customer Registration** wizard registers the current tenant as a Bifröst **Customer** of a Partner
that invited it. It starts only from a **Sync** on the [Bifrost Setup](/help/foundation/bifrost-setup/) page:
choose **Register as Customer** on the notification that Sync raises when a Partner has invited the tenant.
Opened any other way, for example by URL, the wizard refuses to open. It is available only to users with licence
administration permission, once the End-User License Agreement is approved for the company, and only while an
invitation is pending. A sandbox cannot register.

## Steps

| Step | What happens |
| --- | --- |
| **1. Review and edit company information** | The [company step](/help/foundation/registration-company-information/): name, address, post code, city, county, country/region, phone number, email and VAT registration number from **Company Information**. Correct them here; the name is required. |
| **2. Choose the Partner** | Lists the pending invitations by the registered company name of each inviting Partner, with the time each was sent. With one invitation it is selected; with several, select the Partner you want to work with. |

Choose **Finish** to save your changes to Company Information and then accept the selected invitation. The
tenant's Bifröst configuration is linked to that Partner and the tenant moves to the **Subscription** license,
which the Partner invoices. If the save fails, nothing is accepted and the wizard stays open. **Cancel** leaves
Company Information unchanged.

See [License types](/licensing/license-types/#subscription).
