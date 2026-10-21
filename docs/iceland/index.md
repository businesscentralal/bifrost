---
id: index
title: "Bifröst Iceland"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Use Icelandic registry, tax, contribution and reference services from your assistant or integration in Business Central."
---

# Bifröst Iceland

**Work with Icelandic services from the assistant or system you already use.** Bifröst Iceland lets
business users and administrators connect their Business Central work to national registry data,
tax returns, contribution statements, exchange rates and SMS.

It is an additional app on [Bifröst Foundation](/foundation/). Start with
[How Bifröst works](/documentation/how-it-works/) for the shared setup and the way an assistant works
with Business Central.

## What you can do

- **Prepare tax work.** Retrieve and validate tax information, submit VAT, payroll withholding and
  capital income tax returns, and read the service's response and receipt.
- **Work with national registry data.** Look up people and companies through Umsjá and maintain a local
  national registry copy for the work that needs it.
- **Refresh financial reference data.** Get exchange rates and economic indicators from Seðlabanki
  Íslands, and update currency exchange rates in Business Central.
- **Prepare contribution statements.** Get Skilagrein collector and fund information, send contribution
  statements and handle the collector's response.
- **Use Icelandic reference services.** Check registration numbers, vehicles, customs information,
  public holidays and postal codes, and send SMS through the configured service.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Iceland** | National registry information, Icelandic tax and contribution services, rates and reference data, and SMS. |
| **Finance** | VAT statement information and VAT settlement in Business Central. |

## Get it

Install **Bifrost Iceland** alongside Bifröst Foundation and the Icelandic localization of Business
Central. Contact your Business Central partner about installation and availability. For the price,
contact your Business Central partner.

## Set it up

1. Complete [the setup for your company](/setup/business-central/) and the shared Bifröst setup.
2. Open **Bifrost Setup**, then choose **Bifrost Iceland Setup** under **Apps**.
3. Select the clients for the services the company uses. Your administrator enters the service
   credentials and confirms the company's registration number before tax work starts.
4. Give each caller its Business Central permissions and the Iceland service permission sets it needs.
   See [Permission sets and gates](/documentation/end-customers/permissions/) for the shared rules.
5. Check the selected service and review its result before using it for live submissions or messages.

For the settings and page actions, open the page's help in Business Central.

## Good to know

- Service accounts, access agreements and credentials are arranged with the services the company uses.
- Sending a return, contribution statement or SMS can have an external effect. Check the company,
  recipient, period and selected service before asking an assistant to send it.
- National registry information can contain personal data. Give access only to the people and
  integrations that need it, and manage the retained copy according to the company's requirements.
- The installed operations explain themselves through the MCP tools `list_domains`, `describe_domains`
  and `describe_message_type`, or on the **Bifrost Message Types** page. Follow the live description
  for the operation you want to use.

Next, follow [the user setup](/setup/pick-your-assistant/) to connect an assistant and ask it to
perform a task the company has configured.
