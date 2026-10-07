---
id: administrators
sidebar_label: "Overview"
sidebar_position: 1
slug: /end-customers/administrators
title: "Running Bifröst"
description: "For Business Central administrators: permissions, what agents may see, users, logs and retention, secrets, the settings, usage, and what you are responsible for."
---

# Running Bifröst: for administrators

[Set it up](/setup/) walks through the first setup. This page is what to weigh when you make those
choices, and what to keep an eye on afterwards. Everything here is on **Bifrost Setup** and needs
`BIFROST Full ori`; licensing actions also need `BIFROST LicAdm ori`. Every Bifröst page in Business Central is described
in the in-product help.

## Permissions

An AI agent can do at most what the identity it runs as can do in Business Central, and often less.
Bifröst never gives a caller more than Business Central already allows, and Field Access, the
ChangeLog Write Guard and the posting permission sets can narrow it further.

import PermissionLayers from '@site/src/components/PermissionLayers';

<PermissionLayers />

- **Keep each identity as narrow as its job.** Give each level of trust its own identity: a user or
  app that may only read cannot post, however it is asked.
- **Every set, and how the gates work,** is in [Permission sets and gates](/documentation/end-customers/permissions/).

## Users and agents

**Setup › User Setup** lists every user of Bifröst in the company. Open a user to set:

- **Approval Type:** whether a new agent or tool must be approved once before it can act for the user
  (see [Decide which tools may act for a user](/setup/business-central/#decide-which-tools-may-act-for-a-user)).
- **User Monthly Message Quota:** the user's monthly limit.
- **Charge Type** (read-only): how the user's messages are counted. **User** for people, **App Registration** for
  integrations.

![Bifrost User Setup](/img/guides/en-us/user-setup.png)

## What agents may see and change

**Field Access** (**Setup › Field Access**) lists fields that one user or app should not get (**Read**), not change
(**Write**), or neither (**Both**) through Bifröst. Nothing changes in the Business Central client.

**An example.** Sigga uses an assistant, but agents should never see employees' bank account
numbers. Choose **New for User...**, pick Sigga's user, then add the table *Employee*, the field
*Bank Account No.* and the restriction **Both**. From then on, when her assistant lists employees,
the answer comes without bank account numbers, and the assistant cannot change them. Sigga herself
still sees them in Business Central.

![Bifrost Field Access Overview](/img/guides/en-us/field-access-overview.png)

Field Access has two more types. **None** restricts nothing and overrides a broader row, for example to open one table
for a user whose other changes are blocked. **Bypass** lets **that user or app only** change the field without a
change-log trail.

**ChangeLog Write Guard** on Bifrost Setup decides whether record changes through Bifröst must leave a change-log
trail. It is **Blocked** by default: only fields the change log covers can be changed, so turn on the change log for
the fields you want agents to change. If you use Bifröst with bookkeeping, decide it with that in mind: your
bookkeeping obligations stay yours, and Bifröst's logs do not replace your own records.

**Respect Data Sensitivity** (under *Show more*) hides the fields your company classifies as sensitive.

All of it, with the common *block every change, then open one table* setup and the data Bifröst always protects:
[Control what agents read and change](/documentation/end-customers/data-access/).

## Logs and retention

These logs live in your own Business Central. They are company data: include them in your own rules for retention
and access.

- **[Bifrost Messages](/help/foundation/bifrost-messages/)** (**Messages › Bifrost Messages**) keeps every call
  Bifröst receives, with the request, the response and the caller, so it holds whatever data those calls returned.
- **[Request Log](/help/foundation/bifrost-request-log/)** (**Messages › Request Log**) keeps the calls Bifröst apps
  make to other systems, masked unless debug mode is on. It is given a one-month retention policy automatically.

  ![Bifrost Request Log](/img/guides/en-us/request-log.png)

- **Delete logging** (**Actions › Delete Logging**) records deletions in the tables you list on **Delete Setup**,
  whoever deletes them. **Store Record** keeps a copy of each deleted record; the deletions are on **Delete Log**.

  ![Bifrost Delete Setup](/img/guides/en-us/delete-setup.png)

  ![Bifrost Delete Log](/img/guides/en-us/delete-log.png)

- **Memory and user setup** hold free text that agents and users write.

**Request Debug Mode** (under *Show more* on Bifrost Setup) stores full, unmasked request and response bodies in the
request log. Turn it on only while troubleshooting, and off again afterwards. Changing it needs `BIFROST ReqLgAdm ori`.

:::caution Be aware
- **Retention is yours to set.** Use **Setup › Retention Policies**. **Bifrost Messages has no retention period
  until you set one**, so messages are kept until you do.
- **Keep at least 31 days** of Bifrost Messages if you use monthly message quotas.
- **Access is yours to set.** Anyone with `BIFROST Read ori` or `BIFROST Full ori` can open every
  message on Bifrost Messages, so give those sets only to the people who need them.
:::

## Secrets

**Setup › Secrets** lists the credentials that Bifröst apps need, such as an access key for another system: which
app, what it is, whether it is set, and when and by whom. Use **Set...** to enter a value and **Clear** to remove it.
Values are stored for the company (or the company and user), never shown again, and never copied between companies.

![Bifrost App Secrets](/img/guides/en-us/secrets.png)

The list fills when you install Bifröst apps that connect to other systems; the setup wizard asks for their secrets
in one optional step.

## The other settings on Bifrost Setup

Choose **Show more** in the *General* section for the less common settings. Every field is described in
[Bifrost Setup](/help/foundation/bifrost-setup/).

![Bifrost Setup with Show more](/img/guides/en-us/setup-show-more.png)

| Setting | What it does |
|---|---|
| **Customer Credit Limit Type** | Which credit limit check agents use for customers |
| **Credit Limit Tolerance %** | How far over the credit limit a customer may go before it is flagged |
| **Customer Statement Type** | Which customer statement agents produce |
| **Item Price Calculation Type** | How item prices are calculated in answers |
| **Default Language Code** | The language of answers when a call does not ask for one |
| **ChangeLog Write Guard** | [What agents may see and change](#what-agents-may-see-and-change) |
| **Export Company Name Type** | Which company name goes into exports: the company name or its display name |
| **Default Email Scenario** | Which email account Bifröst uses when a call does not say |
| **Request Debug Mode** | [Logs and retention](#logs-and-retention) |
| **Respect Data Sensitivity** | [What agents may see and change](#what-agents-may-see-and-change) |
| **Company Monthly Message Quota** | [Usage and limits](#usage-and-limits) |

## Translations and integrations

Under **Related**:

- **Bifrost Translations:** translation entries that external systems read: for a source, a language and an English
  text, the translated text.
- **Bifrost Integration:** an event log of integration activity: for each event, the source system, the Business
  Central table and the time. Use it to see which system wrote to which table and when.

![Bifrost Translations](/img/guides/en-us/translations.png)

Both are filled by integrations; you normally only look at them.

## Other Bifröst apps

Each Bifröst app adds capabilities of its own. Once installed, each adds an action to the
**Apps** group on Bifrost Setup, which opens its own setup page. **Apps › Find Apps** opens the [list of apps](/apps/).

![The Apps group](/img/guides/en-us/menu-apps.png)

**After installing an app, run the setup wizard again** (**Licensing › Setup Wizard**). It turns on outbound HTTP for
the new app and asks for any credentials it needs.

## The license agreement and the wizard

**Licensing › Setup Wizard** can be run again at any time, for example to read the MCP server address or the consent
link in step 5. Close it with **X** if you do not want to finish it again.

**Licensing › Revoke EULA Approval** withdraws the company's approval of the [Terms of Use](/licensing/eula/). Every
Bifröst call from the company is then refused until the setup wizard is completed again. Business Central asks before
it does it.

![Revoke EULA Approval asks first](/img/guides/en-us/revoke-eula.png)

## Usage and limits

Bifröst counts **messages**: one for each successful call that does work. The help, memory, session, webhook
and change-log calls of Bifröst are not counted.

- **Limits you can set.** A monthly message quota per company on Bifrost Setup, and per user on
  Bifrost User Setup, stop usage at a level you choose. Empty means no limit. When a limit is reached, further calls
  are refused until the next calendar month, and the agent says so. The user limit is checked before the company
  limit.
- **See what is used** on **Actions › License Usage**, per company, day and type. **Licensing › Sync** refreshes the
  figures at once; a background task does the same every day.

How licensing works, and what happens when a quota runs out: [Licensing](/licensing/).
Prices: [Price](/price/).

## Keep an eye on it

- **Monthly:** look at License Usage and the License pane on Bifrost Setup; check that no limit is close.
- **When people change roles:** adjust their permission sets and Field Access rows.
- **When you install a Bifröst app:** run the setup wizard again.
- **Now and then:** look through Bifrost Messages for calls you did not expect, and check that Request Debug Mode is
  off.
- **Once:** set retention periods, and decide who may read the logs.

## Troubleshooting

| What you see | What to check |
|---|---|
| The assistant shows no Business Central tools at all | The connector is not switched on in that chat; see [Connect your AI assistant](/setup/connect-your-ai/#claude) |
| No environments or companies appear when the assistant connects | The one-time consent in your Microsoft Entra ID is missing; see [Consent once for your organisation](/setup/connect-your-ai/#consent-once-for-your-organisation) |
| Adding the connector does not detect the sign-in options, or sign-in fails | Check the MCP server address from wizard step 5. If it is right, contact your partner and pass on the exact error |
| All calls from the company are refused | Is the license agreement approved? Run the setup wizard |
| Calls are refused near the end of the month | A user or company monthly limit; [Usage and limits](#usage-and-limits) |
| Calls are refused and the License pane shows no messages left | The prepaid messages are used up; see [Licensing](/licensing/) |
| The License pane looks out of date | **Licensing › Sync**, then **Licensing › Connection Status** |
| An agent cannot change a field | The ChangeLog Write Guard, Change Log Setup, Field Access; [Control what agents read and change](/documentation/end-customers/data-access/) |
| A field is missing from answers | Field Access or Respect Data Sensitivity; same page |
| Posting is refused | A posting gate; [Permission sets and gates](/documentation/end-customers/permissions/) |
| A new Bifröst app does not work | Run the setup wizard again; check **Secrets** |
| You need to see exactly what an agent did | **Bifrost Messages**: the request, the answer and the caller of every call |

## What you are responsible for

In short, and as set out in the [Terms of Use](/licensing/eula/):

- **Permissions**: who can call, and what each identity can reach and post.
- **The assistants and systems you connect**, and your agreements with their providers.
- **What agents do** under your identities: review and supervise their actions, and require
  confirmation where an action matters.
- **What is kept**: retention and access for the logs in your Business Central. What Bifröst
  stores with Origo is in [Privacy](/licensing/privacy/).
- **Bookkeeping**: traceability and retention under bookkeeping law remain yours.

**Next:** [Control what agents read and change](/documentation/end-customers/data-access/), or
[Try it out](/try-it-out/) to test a change in a sandbox first.
