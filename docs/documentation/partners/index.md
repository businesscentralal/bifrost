---
id: index
title: "Partners and ISVs"
sidebar_label: "Partners and ISVs"
sidebar_position: 1
description: "For Business Central partners, resellers and ISVs: what to think about when you set up, support, sell or build on Bifröst."
---

# Partners and ISVs

You work with Business Central for other companies: you set it up for them, support them, resell
Bifröst (as a Bifröst **partner**, which customers may call their reseller), or build your own app
on it. This page lists what to think about, and where each topic
is covered.

## What partners use it for

- **For customers:** AI services you build, package and resell, such as reports and dashboards
  that customers change by asking, or assistants for one role.
- **In your own team:** demo data, troubleshooting, help with configuration, and exploring a
  customer's data when the customer has agreed to it.
- **In projects:** help moving data from older NAV or Business Central versions and other ERP
  systems, checked in Business Central before you go live.
- **In testing:** automated tests for new and changed features and before each release, run
  through the same message types a user's assistant would call.
- **Routines:** [Orchestrator](/orchestrator/) playbooks that chain message types from any app,
  built and looked after for a customer.

Demos and your own use are counted apart from customers' use, as the **Demo** and **Internal**
[charge types](/licensing/license-types/#charge-types).

## Setting it up for a customer

[Set it up](/setup/) is written so a customer can follow it, and says who is needed for each step.
When you do the steps for a customer, three things stay theirs:

- **The consent in step 3** is given by an administrator of the customer's Microsoft Entra ID.
- **The decisions in step 4**, on what agents may see and how long logs are kept, belong to whoever
  owns the data. [Administrators](/documentation/end-customers/administrators/) explains what they
  are deciding.
- **Accepting your invitation**, if the customer licenses Bifröst through you: see
  [Being a Customer](/licensing/customer/).

## Selling and licensing

A partner can license Bifröst to its customers and follow their usage. To become a Bifröst
partner, contact [The App Channel](https://www.theappchannel.com/).

- [Licensing and partner program](/licensing/): the roles, and who invoices whom
- [Working as a Partner](/licensing/partner/): registering, inviting customers,
  following their usage
- [Working as a Vendor](/licensing/vendor/): for a vendor with its own partners


## Supporting a customer

- The [in-product help](/help/foundation/) has a page for every Bifröst page in Business Central.
- **[Bifrost Messages](/help/foundation/bifrost-messages/)** shows every call, with the request and
  the answer, so you can see what an agent asked for and what it got back. A consultant with the
  `BIFROST Read ori` permission set in the customer's Business Central can open it; agree that with
  the customer, because it shows every message. Open the call in question and download the
  response to read the error.
- **Your own calls count too.** Work in a customer's tenant through a delegated partner plan counts in
  its own **Support** charge type; see [License types](/licensing/license-types/).
- [Using Bifröst](/documentation/end-customers/users/#when-it-says-no) lists what users see when
  Bifröst says no, and what it means.

{/* OPEN-11 */}

:::note Being written
Where partners escalate to Origo.
:::

## Building your own app

Bifröst reaches what has message types, and not every task in Business Central has one yet; see
[What it covers](/documentation/how-it-works/#what-it-covers-and-how-it-grows). Each missing
operation is something your app can add, as a message type in a capability of its own. Your app's message types join the same catalogue, every
connected agent can use them as soon as your app is installed and set up, and their use is counted, so it can be
sold like any other part of your app.

- [Build on Bifröst](/extensibility/): the concepts, and what makes an app callable by agents
- The [partner reference repository](https://github.com/businesscentralal/bc-bifrost-reference):
  a working example app and the full guide
- [Register your app](/apps/register-your-app/): list it among the apps built on Bifröst
- [Skills for AI agents](/skills/): what agents load to work with Bifröst

**Next:** [Set it up](/setup/), the steps you will take with each customer.
