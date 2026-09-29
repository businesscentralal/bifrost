---
id: administrators
title: "Running Bifröst"
sidebar_label: "Administrators"
sidebar_position: 2
description: "For Business Central administrators: permissions, what agents may see, the setup page, logs and retention, usage, and what you are responsible for."
---

# Running Bifröst: for administrators

[Set it up](/setup/) walks through the first setup. This page is what to weigh when you make those
choices, and what to keep an eye on afterwards. Every page in Foundation is described in the
[in-product help](/help/foundation/).

## Permissions

An AI agent can do everything the identity it runs as can do in Business Central, no more and no
less. Bifröst never gives a caller more than Business Central already allows.

import PermissionLayers from '@site/src/components/PermissionLayers';

<PermissionLayers />

- **Keep each identity as narrow as its job.** Give each level of trust its own identity: a user or
  app that may only read cannot post, however it is asked.
- **Area permission sets**, for example for approvals, company memory and licensing, are named on
  the help page of the area they control.

## Field Access

**What it is.** A list of fields that one user, or one app, should not get or not change when working
through Bifröst. Nothing else changes: in the Business Central client that person still sees and
edits the field as before.

**An example.** Sigga uses an assistant, but agents should never see employees' bank account
numbers. On **Bifrost Field Accesses**, choose Sigga's user, then add the table *Employee*, the field
*Bank Account No.* and the restriction **Both**. From then on, when her assistant lists employees,
the answer comes without bank account numbers, and the assistant cannot change them. Sigga herself
still sees them in Business Central.

**The three restrictions:**

| Restriction | The agent can read the field | The agent can change the field |
|---|---|---|
| **Both** | No | No |
| **Read** | No | Yes |
| **Write** | Yes | No |

**One row per user or app.** To restrict a field for several people, add a row for each of them.

**Where it applies.** Immediately, to everything Bifröst reads and writes for that user or app,
including exports, totals, change-log history and creating documents. Not to the Business Central
client, and not to posting. Use it for fields agents should not see or change, for example personal
data such as national ID numbers or bank details. Details:
[Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/).

:::caution Be aware
The list also offers a fourth type, **Bypass**. It restricts nothing: it lets writes to that field
through without a change-log trail, **for every caller**, whichever user the row names. Use it only
when you mean to.
:::

## The setup page

Two fields on [Bifrost Setup](/help/foundation/bifrost-setup/) deserve a deliberate decision:

- **ChangeLog Write Guard** decides whether record writes through Bifröst must leave a change-log
  trail. It is **Blocked** by default: only fields the change log covers can be written, so turn on
  the change log for the fields you want agents to change.
  If you use Bifröst with bookkeeping, decide it with that in mind: your bookkeeping obligations
  stay yours, and Bifröst's logs do not replace your own records.
- **Request Debug Mode** stores full, unmasked request and response bodies in the request log. Turn
  it on only while troubleshooting, and off again afterwards. Changing it needs the
  `BIFROST ReqLgAdm ori` permission set.

## Logs and retention

These logs live in your own Business Central:

- **[Bifrost Messages](/help/foundation/bifrost-messages/)** keeps every call Bifröst receives,
  with the request and the response, so it holds whatever data those calls returned.
- **[Request log](/help/foundation/bifrost-request-log/)** keeps the calls Bifröst apps make to
  other systems, masked unless debug mode is on. It is given a one-month retention policy
  automatically.
- **[Delete log](/help/foundation/bifrost-delete-log/)** logs deletions in the tables you list on
  **Delete Setup**, whoever deletes them, and keeps a copy of the record if **Store Record** is on.
- **Memory and user setup** hold free text that agents and users write.

:::caution Be aware
- **Retention is yours to set.** Use **Retention Policies** on Bifrost Setup. **Bifrost Messages has
  no retention period until you set one**, so messages are kept until you do.
- **Keep at least 31 days** of Bifrost Messages if you use monthly message quotas. {/* OPEN-14 */}
- **Access is yours to set.** Anyone with `BIFROST Read ori` or `BIFROST Full ori` can open every
  message on Bifrost Messages, so give those sets only to the people who need them.
- **These logs are company data.** Include them wherever your own policies on data apply.
:::

## Usage and limits

Bifröst counts **messages**: one for each successful call that does work. The help, memory, session, webhook
and change-log message types of Origo's apps are not counted.

- **Limits you can set.** A monthly message quota per company on Bifrost Setup, and per user on
  Bifrost User Setup, stop usage at a level you choose.
- **See what is used** on **License Usage** from Bifrost Setup, per company, day and type.

How licensing works, and what happens when a quota runs out: [Licensing](/foundation/licensing/).
Prices: [Cost](/cost/).

## Keep an eye on it

{/* OPEN-17 */}

- Look at Bifrost Messages and License Usage now and then.
- Keep permissions narrow as roles change.
- When you install another Bifröst app, run the setup wizard again so it covers the new app.

## What you are responsible for

In short, and as set out in the [Terms of Use](/foundation/eula/):

- **Permissions**: who can call, and what each identity can reach and post.
- **The assistants and systems you connect**, and your agreements with their providers.
- **What agents do** under your identities: review and supervise their actions, and require
  confirmation where an action matters.
- **What is kept**: retention and access for the logs in your Business Central. What Bifröst
  stores with Origo is in [Privacy](/foundation/privacy/).
- **Bookkeeping**: traceability and retention under bookkeeping law remain yours.

**Next:** [Licensing](/foundation/licensing/) for how usage is licensed, or [Try it out](/try-it-out/) to test a change in a sandbox first.
