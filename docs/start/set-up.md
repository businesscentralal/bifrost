---
id: set-up
title: "Set up Bifröst"
sidebar_label: "Set up Bifröst"
sidebar_position: 3
description: "The administrator's route in four stages: set up Business Central, connect your AI assistant, understand usage and licensing, then make the first call and roll it out."
---

# Set up Bifröst

Getting Bifröst running takes four stages. This page walks through them in order, says what you
decide at each step and who needs to be involved, and links to the page with the details.

1. **[Set up Business Central](#stage-1-set-up-business-central)**: install, the setup wizard,
   permissions, and what agents may reach.
2. **[Connect your AI assistant](#stage-2-connect-your-ai-assistant)**: Copilot, ChatGPT, Claude or
   another tool.
3. **[Understand usage and licensing](#stage-3-understand-usage-and-licensing)**: what is counted
   and where you see it.
4. **[Make the first call and roll it out](#stage-4-make-the-first-call-and-roll-it-out)**.

## Who needs to be involved

| Task | Who can do it |
|---|---|
| Install the apps | A Business Central user with **D365 EXTENSION MGT** or SUPER |
| Accept the licence agreement | Someone entitled to accept terms for the company |
| Allow outbound HTTP for the apps | A user with SUPER, or write permission on the *NAV App Setting* table |
| Consent to the Bifröst MCP server | A **Global Administrator** or **Application Administrator** in Microsoft Entra ID |
| Assign permissions | A Business Central user with **SECURITY** or SUPER |
| Decide what agents may see and what is kept | The administrator, together with whoever owns the data in the company |

## Stage 1: Set up Business Central

### 1. Install

Install **Bifrost Foundation** first, then the Bifröst apps you use. Each app depends on
Foundation, so AppSource installs them in the right order. The [app list](/apps/) shows what is
available.

### 2. Run the setup wizard

Open **Bifrost Setup** (search for it with *Tell me*). The notification at the top leads to the
**setup wizard**. It is the only place any Bifröst app asks for setup; the other apps never show
banners of their own.

The wizard takes you through the licence agreement, outbound HTTP for every installed Bifröst
app, credentials the apps need, licensing, and, online, the MCP server connection. **Every company
runs it once: until it is finished, Bifröst refuses calls for that company.**

What the licensing step does depends on the environment. In production, finishing the wizard
activates the trial; in a sandbox no trial is needed; on-premises, the connection to the licensing
service has to be verified first.

Step by step: [Setup wizard](/help/foundation/bifrost-setup-wizard/).

:::note Be aware
Accepting the licence agreement in the wizard accepts the [Terms of Use](/foundation/eula/) for the
company. The first step of the wizard says what Bifröst stores with Origo. Read both before you
accept.
:::

### 3. Give people and apps permission

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

### 4. Decide which tools may act for a user

When an AI assistant or another tool calls Bifröst as a named user, Bifröst records where the call
comes from, and the user may have to approve that source before it can act for them. The approval
type is set per user in **Bifrost User Setup**.

See [Approve session source](/help/foundation/session-source-approval/) and
[Bifrost User Setup](/help/foundation/bifrost-user-setup-editor/).

### 5. Decide which fields agents should not get

On **Bifrost Setup**, choose **Field Access**. For each user or Entra application, add the table
and field you want to restrict, and choose the restriction:

- **Both**: the field is left out of answers and cannot be changed;
- **Read**: the field is left out of answers;
- **Write**: the field can be read but not changed.

Restrictions apply to Bifröst's record operations, immediately, and not to the Business Central
client. Fields without a restriction behave as normal. Details:
[Bifrost Field Accesses](/help/foundation/bifrost-field-accesses/).

:::caution Be aware
The fourth type, **Bypass**, does not restrict anything: it lets writes to that field through
without a change-log trail. Use it only when you mean to.
:::

### 6. Check the setup page

Go through **Bifrost Setup** once; every field is described in
[Bifrost Setup](/help/foundation/bifrost-setup/). Two fields deserve a deliberate decision:

- **ChangeLog Write Guard** decides whether writes through Bifröst must leave a change-log trail.
  If you use Bifröst with bookkeeping, decide it with that in mind: your bookkeeping obligations
  stay yours, and Bifröst's logs do not replace your own records.
- **Request Debug Mode** stores full, unmasked request and response bodies in the request log. Turn
  it on only while troubleshooting, and off again afterwards.

### 7. Decide what is kept, and for how long

These logs live in your own Business Central:

- **[Bifrost Messages](/help/foundation/bifrost-messages/)** keeps every call Bifröst receives,
  with the request and the response, so it holds whatever data those calls returned.
- **[Request log](/help/foundation/bifrost-request-log/)** keeps the calls Bifröst apps make to
  other systems, masked unless debug mode is on.
- **[Delete log](/help/foundation/bifrost-delete-log/)** can keep a copy of records deleted
  through Bifröst, if you turn that on.
- **Memory and user setup** hold free text that agents and users write.

:::caution Be aware
You decide how long these logs are kept, with **Retention Policies** on Bifrost Setup, and who may
open them, with permissions. **Bifrost Messages has no retention period until you set one**, so
messages are kept until you do. Anyone with the `BIFROST Read ori` or `BIFROST Full ori` permission
set can open every message on the Bifrost Messages page, so give those sets only to the people who
need them. Keep at least 31 days of Bifrost Messages if you use monthly message quotas, because the
quotas are counted from them. These logs are part of the data your company
holds, so include them wherever your own policies on data apply.
:::

## Stage 2: Connect your AI assistant

Online, the last step of the setup wizard gives you what you need to connect an assistant:

- **The Bifröst MCP server address** to add to your assistant.
- **The consent link** for the *Origo Bifrost* enterprise application. A Global Administrator or
  Application Administrator in Microsoft Entra ID opens it once for your organisation, so the MCP
  server can sign users in.
- **Links to the Bifröst connector** in the assistants' stores.

Then, depending on the assistant:

| Assistant | How it connects |
|---|---|
| **Microsoft Copilot** | Add the Bifröst connector from its store. **Bifrost Setup** also has a **Microsoft Copilot** action under *Connectors* that opens it. |
| **ChatGPT** | Add the Bifröst connector from its store. **Bifrost Setup** has an **OpenAI ChatGPT** action under *Connectors*. |
| **Other assistants that support MCP servers** | Add the Bifröst MCP server address as a remote MCP server or custom connector in the assistant's settings, and sign in with your Business Central user. |

Each user signs in as themselves, so the assistant works with exactly that user's permissions. The
first time a new assistant acts for a user, the user may be asked to approve it (step 4).

**Bifrost Setup** also has a **Connection Prompt** you can paste into an assistant, so it knows which
environment and company to work in.

Building your own integration instead of using an assistant? See the
[API reference](/foundation/reference/api/). Building agents or tools? See
[Skills for AI agents](/skills/).

## Stage 3: Understand usage and licensing

Bifröst counts **messages**: one for each successful call that does work. Looking up what exists
and reading help is not counted.

- **Two pools.** Calls made by a person and calls made by an app identity are counted separately,
  so each can be sized on its own.
- **A trial** is activated in production when the setup wizard is finished. A sandbox does not use
  one.
- **Limits you can set.** A monthly message quota per company on Bifrost Setup, and per user on
  Bifrost User Setup, stop usage at a level you choose.
- **See what is used** on **License Usage** from Bifrost Setup, per company, day and type.
- **Where licences come from.** Directly from Origo, or through your Bifröst partner.

The whole model, and what happens when a quota runs out: [Licensing](/foundation/licensing/).

## Stage 4: Make the first call and roll it out

1. **Check the setup.** Bifrost Setup opens without a notification at the top, and every caller
   has the Bifröst API permission set, the Business Central permissions for its data and only the
   posting gates it needs.
2. **Make a first call.** Ask a connected assistant *"Who am I in Business Central?"*. The call
   appears in **Bifrost Messages**, and the caller shown is the user you expected.
3. **Try something real, in a sandbox first.** A question, then a change with a preview, such as
   the examples on [What Bifröst is](/start/).
4. **Tell your users what to expect.** [Using Bifröst](/start/using-bifrost/) is written for them:
   what they can ask, what it will not do, and what to do when it says no.
5. **Keep an eye on it.** Look at Bifrost Messages and License Usage now and then, keep permissions
   narrow, and when you install another Bifröst app, run the setup wizard again so it covers the
   new app.

## What you are responsible for

In short, and as set out in the [Terms of Use](/foundation/eula/):

- **Permissions**: who can call, and what each identity can reach and post.
- **The assistants and systems you connect**, and your agreements with their providers.
- **What agents do** under your identities: review and supervise their actions, and require
  confirmation where an action matters.
- **What is kept**: retention and access for the logs in your Business Central.
- **Bookkeeping**: traceability and retention under bookkeeping law remain yours.

## Next

- [Every page in Bifrost Foundation](/help/foundation/): the in-product help
- [Licensing](/foundation/licensing/): the full licence model
- [What Bifröst is](/start/): the overview, if you are explaining it to someone
