---
id: index
title: "Bifröst Iceland"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Icelandic services in Business Central from an assistant or an integration — the national registry, VAT, payroll and capital income tax returns, central bank rates, Skilagrein, island.is and SMS."
---

# Bifröst Iceland

**Use the Icelandic services you already deal with from Business Central, and from the assistant or
system you already use.** Bifröst Iceland lets an integration, a scheduled routine or an AI assistant
look people and companies up in the national registry, file tax returns with Skatturinn, post the VAT
settlement, fetch exchange rates and other rates from Seðlabanki Íslands, send contributions through
Skilagrein, check details on island.is and send SMS.

Every operation runs inside your own Business Central company and keeps its own history there, so you
can see what was sent, to whom and with what answer.

*An additional app on [Bifröst Foundation](/foundation/), for companies in Iceland. New to Bifröst? Start
with [How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Look people and companies up (Þjóðskrá).** Find a person or a company by kennitala, name or
  address, see addresses, family and company relations, roles, board members and industry
  classification, and keep a local copy of the national registry in Business Central. This uses your
  Umsjá license.
- **File tax returns with Skatturinn.** Fetch the periods and their status, validate a return before it
  is sent, submit it, correct or reopen it where Skatturinn allows it, and get the receipt as a PDF.
  This covers virðisaukaskattur (VAT), staðgreiðsla (payroll withholding) and fjármagnstekjuskattur
  (capital income tax).
- **Prepare and close VAT.** Preview the VAT statement per box number, ready to be mapped to the
  return, and run Business Central's own Calculate and Post VAT Settlement.
- **Get rates from Seðlabanki Íslands.** Bring exchange rates straight into Business Central's
  currencies, and read policy and facility rates, REIBID and REIBOR, loan term yields, penalty interest
  (dráttarvextir), the consumer price index, the exchange rate index and the central bank's economic
  data.
- **Send contributions through Skilagrein.** Read the collectors, pension funds, unions and
  rehabilitation funds, send a contribution return to a collector and confirm or reject extra charges
  (aukagreiðslur).
- **Check details on island.is.** Validate a kennitala, look a vehicle up by plate number or vehicle
  identification number and work with customs tariffs.
- **Use Icelandic reference data.** Public holidays, the postal code register and the list of
  currencies.
- **Send SMS.** Send a text message through Síminn and read its delivery status.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Iceland** | National registry lookups by kennitala, name or address and a local copy of the registry, VAT, payroll and capital income tax returns with Skatturinn, rates and indices from Seðlabanki Íslands, Skilagrein collectors, funds and contribution returns, island.is kennitala, vehicle and customs lookups, holidays, postal codes and currencies, SMS |
| **Finance** | VAT statement preview per box number and the VAT settlement |

## Get it

Install **Bifrost Iceland** next to Bifröst Foundation, from AppSource or through your Business Central
partner. It is for companies in Iceland. It needs Business Central 28.0 or later, Essentials or Premium,
Microsoft's Icelandic localization (IS Core) and Bifröst Foundation 28.0.2.523 or later. For the price,
contact your Business Central partner.

Some services need an agreement of their own: a license for Umsjá, web service passwords from
Skatturinn, a password for each Skilagrein collector and an account with Síminn for SMS. The
exchange rates from Seðlabanki Íslands, the island.is lookups and the reference data need none.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Bifröst Foundation and complete its setup, then install **Bifrost Iceland**. Installing does not open the setup guide; start it from **Assisted Setup** or from **Bifrost Setup**. | Business Central administrator |
| 2 | In the [Bifrost Setup Wizard](/help/foundation/bifrost-setup-wizard/), allow outgoing HTTP requests for the app and enter the credentials you have. Nothing reaches an outside service until HTTP requests are allowed. | Business Central administrator |
| 3 | Open **Bifrost Iceland Setup** (from **Bifrost Setup**), choose Skatturinn **Test** or **Live**, enter the Umsjá license number and the Síminn sender ID. | Business Central administrator |
| 4 | Make sure **Registration No.** on **Company Information** holds the company's kennitala. Skatturinn reads it from there. | Accountant or administrator |
| 5 | For Skilagrein, open **Skilagrein Collectors** and set the web service password of each collector you send to. | Accountant or administrator |
| 6 | Give the people and services that call the app `BIFROST Full ori`, and the extra permission sets below to those who may do more. | Business Central administrator |

The help of the setup page has the details: [Bifrost Iceland Setup](/help/iceland/iceland-setup/). It
is followed by [Skilagrein Collectors](/help/iceland/iceland-skilagrein/) and
[National Registry Entries](/help/iceland/iceland-umsja-registry/).

Start with Skatturinn's **Test** environment. Switch to **Live** only when you have checked a return
from start to finish.

## Permissions

`BIFROST Full ori` gets the Iceland objects when the app is installed. Some work can also be given on
its own, so that the people who may send something to an authority are the ones you chose:

| Permission set | For | Included in `BIFROST Full ori` |
|---|---|---|
| `BIFROST NatReg ori` | Loading the national registry into Business Central | No |
| `BIFROST VAT ori` | VAT returns | Yes |
| `BIFROST Payroll ori` | Payroll withholding returns | Yes |
| `BIFROST CapTax ori` | Capital income tax returns | No |
| `BIFROST Collect ori` | Skilagrein contribution returns | No |
| `BIFROST SMS ori` | SMS to Icelandic numbers | Yes |
| `BIFROST SMS Fgn ori` | SMS to numbers abroad | Yes |

## Good to know

- **It acts as you.** Every call runs with the caller's own Business Central permissions and is
  logged on **Bifrost Messages**.
- **Credentials stay in protected storage.** A password or license is entered once in a masked dialog
  and never shown again; the setup page only says whether one is stored. Credentials are not copied
  when you upgrade from an earlier version or install next to a predecessor app; enter them again.
- **Logs hide sensitive content.** Request and response content for the national registry and for the
  tax and Skilagrein services is masked in the request log. While **Request Debug Mode** is on in
  Bifrost Setup, the content is kept in full for troubleshooting; switch it off when you are done.
- **The national registry holds personal data.** It is shared by every company in the environment.
  Give access only to those who need it, and see the [privacy statement](/licensing/privacy/) for how
  Bifröst handles data.
- **Long-running work goes through the queue.** Loading the whole national registry downloads a very
  large file and takes several minutes, so it is started through the Bifröst queue rather than as a
  direct call. Follow its result in the queue.
- **Returns are your responsibility.** Check what you send to Skatturinn and Skilagrein, and use the
  test environment first.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on the **Bifrost Message Types**
  page, and each explains itself through `Help.Implementation.Get`.
