---
id: set-up
title: "Set up Bifröst"
sidebar_label: "Set up Bifröst"
sidebar_position: 2
description: "The administrator's route from install to first call: who needs to be involved, the setup wizard, permissions, who may connect, what is kept, and what you are responsible for."
---

# Set up Bifröst

This page is the administrator's route from install to a first working call. It says what to
do, in what order, who needs to be involved, and what you should be aware of along the way.
Every field and action has its own help page in Business Central, linked from each step, so the
details are kept in one place.

## Who needs to be involved

Setup touches three areas that different people usually own. Agree who does what first, so nobody
gets stuck halfway.

| Task | Who can do it |
|---|---|
| Install the apps | A Business Central user with **D365 EXTENSION MGT** or SUPER |
| Accept the licence agreement | Someone entitled to accept terms for the company |
| Allow outbound HTTP for the apps | A user with SUPER, or write permission on the *NAV App Setting* table |
| Consent to the Bifröst MCP server | A **Global Administrator** or **Application Administrator** in Microsoft Entra ID. Only needed if AI assistants connect through the Bifröst MCP server |
| Assign permissions | A Business Central user with **SECURITY** or SUPER |
| Decide what agents may see and keep | Whoever is responsible for data protection in the company, together with the administrator (see [step 6](#6-decide-what-agents-can-reach-and-what-is-kept)) |

## 1. Install

Install **Bifrost Foundation** first, then the Bifröst apps you use. Each app depends on
Foundation, so AppSource installs them in the right order. The [app list](/apps/) shows what is
available.

## 2. Run the setup wizard

Open **Bifrost Setup** (search for it with *Tell me*). The notification at the top leads to the
**setup wizard**. It is the only place any Bifröst app asks for setup; the other apps never show
banners of their own.

The wizard takes you through the licence agreement, outbound HTTP for every installed Bifröst
app, credentials the apps need, licensing, and, online, the MCP server connection. **Every company
runs it once: until it is finished, Bifröst refuses calls for that company.**

Step by step: [Setup wizard](/help/foundation/bifrost-setup-wizard/). What licensing means for you:
[Licensing](/foundation/licensing/).

:::note Be aware
Accepting the licence agreement in the wizard accepts the [Terms of Use](/foundation/eula/) for the
company, including Origo's terms on processing personal data. The first step of the wizard says what
Bifröst stores with Origo. Read it before you accept, and see [Privacy](/foundation/privacy/) for
who is controller and who is processor.
:::

## 3. Give people and apps permission

Two kinds of identity call Bifröst: **named users** (for example someone using an AI assistant) and
**Microsoft Entra applications** (an integration or agent with its own identity). Both get their
permissions in Business Central, on **Users** or **Microsoft Entra Applications**.

A caller needs two things:

- **The Bifröst permission set for calling the API** (`BIFROST API ori`), plus
- **the ordinary Business Central permissions** for the data it works with. Bifröst never gives a
  caller more than Business Central already allows.

Posting is opted into separately. Each ledger has its own **posting gate** (G/L, items, fixed
assets, projects, resources, warehouse), and gates are not part of the general Bifröst permission
sets. A caller without a gate can read and prepare, but not post.

Give administrators `BIFROST Full ori` and support staff `BIFROST Read ori`. The permission sets for
specific areas, such as approvals, company memory and licensing, are named on the help page of
the area they control.

:::caution Be aware
An AI agent can do everything the identity it runs as can do in Business Central, no more and no
less. Setting up those permissions, and keeping them as narrow as the job needs, is your
responsibility. Give each level of trust its own identity: a user or app that may only read
cannot post, however it is asked.
:::

## 4. Decide who may connect for a user

When an AI assistant or another tool calls Bifröst as a named user, Bifröst records where the call
comes from, and the user may have to approve that source before it can act for them. The approval
type is set per user in **Bifrost User Setup**.

See [Approve session source](/help/foundation/session-source-approval/) and
[Bifrost User Setup](/help/foundation/bifrost-user-setup-editor/).

:::note Be aware
The AI assistant or system that connects is your company's choice, and the data it receives is
handled under your own agreement with that provider. Choose the assistant, and the identity it runs
as, to match the data that identity can reach.
:::

## 5. Check the setup page

Go through **Bifrost Setup** once. Most companies change only a few fields. Every field is
described in [Bifrost Setup](/help/foundation/bifrost-setup/). Two of them deserve a deliberate
decision:

- **ChangeLog Write Guard** decides whether writes through Bifröst must leave a change-log trail.
  If you use Bifröst with bookkeeping, decide it with that in mind: your bookkeeping obligations
  stay yours, and Bifröst's logs do not replace your own records.
- **Request Debug Mode** stores full, unmasked request and response bodies in the request log. Turn
  it on only while troubleshooting, and off again afterwards.

The same page links to everything you may need later: user setup, field access, the change-log
guard, secrets, retention policies, and the logs.

## 6. Decide what agents can reach, and what is kept

Before you let people connect AI assistants, decide which data each identity should reach:

- **Hide what an identity has no reason to see.** [Field access](/help/foundation/bifrost-field-accesses/)
  restricts individual fields for a user or an Entra application, on top of Business Central's
  permissions. It applies to calls through Bifröst, not to the Business Central client. Check that
  the restriction does what you expect for the operations your agents use.
- **Be careful with exceptions.** A *Bypass* entry on field access, or an entry on ChangeLog Guard
  Exceptions, lets writes to that field through without a change-log trail.

Then decide what is kept, and for how long. These logs live in your own Business Central:

- **[Bifrost Messages](/help/foundation/bifrost-messages/)** keeps every call Bifröst receives,
  with the request and the response. Responses can contain personal data, such as names and
  addresses of customers or employees.
- **[Request log](/help/foundation/bifrost-request-log/)** keeps the calls Bifröst apps make to
  other systems, masked unless debug mode is on.
- **[Delete log](/help/foundation/bifrost-delete-log/)** can keep a copy of records deleted
  through Bifröst, if you turn that on.
- **Memory and user setup** hold free text that agents and users write, which can include personal
  data.

:::caution Be aware
You decide how long these logs are kept, with **Retention Policies** on Bifrost Setup, and who may
open them, with permissions. Keep at least 31 days of Bifrost Messages if you use monthly message
quotas, because the quotas are counted from them. When someone asks what data you hold about them,
or asks you to erase it, remember these logs as well as the records themselves.
:::

## 7. Check that it works

1. **Bifrost Setup** opens without a notification at the top.
2. Every caller has the Bifröst API permission set, the Business Central permissions for its data,
   and only the posting gates it needs.
3. Make a first call: ask an AI assistant connected to Bifröst "who am I in Business Central?", or
   have an integrator send `Help.WhoAmI.Get`. The call appears in **Bifrost Messages**, and the
   caller shown is the user or app you expected.

## What you are responsible for

In short, and as set out in the [Terms of Use](/foundation/eula/):

- **Permissions**: who can call, and what each identity can reach and post.
- **The assistants and systems you connect**, and your agreements with their providers.
- **What agents do** under your identities: review and supervise their actions, and require
  confirmation where an action matters.
- **What is kept**: retention and access for the logs in your Business Central, and requests from
  the people the data is about.
- **Bookkeeping**: traceability and retention under bookkeeping law remain yours.

## Next

- [Connect an AI assistant or integration](/foundation/reference/api/): the API and its endpoints
- [Privacy](/foundation/privacy/): who is controller and processor, and what goes to Origo
- [Every page in Bifrost Foundation](/help/foundation/): the in-product help
- [What Bifröst is](/start/): the overview, if you are explaining it to someone
