---
id: how-it-works
title: "How Bifröst works"
sidebar_label: "How Bifröst works"
sidebar_position: 2
description: "The ideas behind Bifröst, explained once: message types, the one gate every call goes through, and how an agent finds and calls the right operation."
---

# How Bifröst works

**Ask Business Central. It works out how.**

Getting a new answer out of an ERP has always meant someone building it first: a report, an
integration, a project with a budget and a queue. Bifröst removes that step. You ask in your own
words, in Copilot, Claude or another AI assistant, and an **agent** does the work in Business
Central. (On this site, *agent* means the AI, or another system, acting for you.)

It can do that because the operations Bifröst offers are published as **message types**. Each
message type does one thing, such as checking item availability, turning a quote into an order or
posting a document, and each one describes itself: what it does, what it needs, what it returns and
what can go wrong. The agent reads those descriptions, picks the right operations and calls them.

## Capabilities and message types

Message types are grouped into **capabilities**. The first part of a message type's name says which
capability it belongs to:

| Message type | Capability | What it does |
|---|---|---|
| `Customer.CreditLimit.Get` | **Customer** | Checks a customer's credit: balance, overdue amount, open orders and what is left |
| `Sales.Document.Post` | **Sales** | Posts a sales document |
| `Item.Availability.Get` | **Item** | Works out how much of an item you can promise |

- **A message type** is one operation, and it is what an agent calls. Each one describes itself;
  see [What a message type says about itself](#what-a-message-type-says-about-itself) below.
- **A capability** is a group of message types about the same thing, such as customers or sales
  documents. An agent looks at the capabilities first, then picks a message type inside the right
  one.
- **An app** is what you install. It adds one or more capabilities, or more message types to one
  that exists: Foundation brings the standard Business Central ones, and each other app adds its own.

```mermaid
flowchart LR
  F["App: Foundation"] --> C1["Capability: Customer"]
  F --> C2["Capability: Sales"]
  F --> C3["Capability: Finance"]
  T["App: Iceland Treasury"] --> C4["Capability: Landsbankinn"]
  C1 --> M1["Customer.CreditLimit.Get"]
  C1 --> M2["Customer.Statement.Pdf"]
  C2 --> M3["Sales.Document.Post"]
  C3 --> M4["Finance.BankReconciliation.Match"]
  C4 --> M5["Landsbankinn.Account.Transactions"]
```

*In words: an app adds capabilities, and each capability holds message types. Foundation adds
Customer, Sales and Finance, among others; Iceland Treasury adds one capability per bank, such as
Landsbankinn. `Customer.CreditLimit.Get` and `Customer.Statement.Pdf` both belong to Customer.*

In the assistant's own tool list, capabilities are called *domains*. They have nothing to do with
Microsoft's **Copilot & AI Capabilities** page in Business Central, which turns Copilot features on
and off.

### What a message type says about itself

Every message type carries its own description, in three layers. The agent reads them in this order
before it calls anything:

| Layer | What it says | For `Customer.CreditLimit.Get` |
|---|---|---|
| **The name** | The capability, the thing and what is done to it | Customer · credit limit · get (reads, changes nothing) |
| **One line** | What it does, so the agent can choose between similar ones | Checks a customer's credit: balance, overdue amount, open orders and what is left |
| **The help** | What it needs, what it returns and what can go wrong | Which customer and how to name it; the figures that come back; the answer when the customer does not exist |

The help is written by the people who build the app, and it is the same text you can read on this
site: the [message type reference](/foundation/reference/message-types/), for example
[`Customer.CreditLimit.Get`](/foundation/reference/message-types/customer-creditlimit-get/). So a new
message type is usable as soon as its app is installed, set up and permitted: nothing has to be taught to the assistant first.


## Four things that make it different

- **Nothing is built for your question.** The operations describe themselves, so an agent can
  combine them, including for questions nobody planned for.
- **It runs as you.** Every call runs as your own Business Central user, with your permissions, or
  as the app identity an integration was given. It reaches only what that identity is allowed to,
  and every call is logged in your Business Central. You decide what each identity may do; see
  [Administrators](/documentation/end-customers/administrators/).
- **It grows without a release.** Any app, Origo's or a partner's, can add capabilities, and every
  connected agent can use them the same day.
- **You choose the AI.** Copilot, ChatGPT, Claude or any other assistant that supports MCP works
  the same way, so you are not tied to one provider, and you can use more than one.

## How it fits together

import PlatformMap from '@site/src/components/PlatformMap';

<PlatformMap />

[Bifröst Foundation](/foundation/) is the one gate. It holds the catalogue of message types, hands
out their help, checks permissions and license, and logs every call. Everything else in the family
is an app that adds its own capabilities to the same catalogue. The [app list](/apps/) shows them.

## What happens when you ask

> "How many of item 1896-S can we still promise this week, and where are they?"

1. **The agent searches** the catalogue in your words and gets a short list of candidates.
2. **It chooses** by their one-line descriptions. `Item.Availability.Get` returns calculated
   availability per location, including reservations and expected receipts, which is what the
   question is about; the on-hand count alone would not answer it.
3. **It reads the help** of that message type: how to name the item, what comes back.
4. **It calls it.** Foundation checks that you may, runs it as you and logs the call.

   ![A real call in Claude, with the connector under its temporary name: the assistant asks to run Item.Availability.Get for item 1896-S](/img/setup/claude-invoke-availability.png)

5. **It answers** in plain words, with the figures per location.

A change works the same way, with one more safeguard: the agent can look before it acts.

> "Turn quote SQ-1042 into an order and show me what posting it would do."

The agent calls `Sales.Quote.MakeOrder`, then `Sales.Document.PreviewPost`, which shows the entries
posting would create **without posting anything**. You see the result before anything is posted,
and whether the agent may post at all is decided by the permissions of the identity it runs as.

When something goes wrong, the answer says what to do next, for example that a number does not
exist and how to look it up. The agent corrects itself or asks you.

## Where your data goes

import DataFlow from '@site/src/components/DataFlow';

<DataFlow />

In more detail:

- **Origo** does not store message contents or your business data, {/* OPEN-07 OPEN-08 OPEN-18 */} and they are not used to train
  AI models. Its licensing service keeps your Bifröst configuration (company identification,
  environment name and connection details), usage counts with times and message type names, and a
  hashed identifier of your tenant; the apps also send it technical diagnostics (telemetry). {/* OPEN-09 */} The
  setup wizard shows what the licensing service stores before you accept.
- **Bifrost Messages** in your Business Central keeps each call with the data it returned, for as
  long as you decide; see [Logs and retention](/documentation/end-customers/administrators/#logs-and-retention).

The full statement: [Privacy](/licensing/privacy/).

## How far it goes

| | What | Example |
|---|---|---|
| **Answer** | A question answered from live data | "What is still open on this project?" |
| **Act** | One operation, on request | "Release this sales order." |
| **Chain** | Several operations toward one outcome | Quotes to orders, previewed, reported back |
| **Keep** | A result you open again | A credit-exposure view you check each morning |
| **Run on a schedule** | The same chain, unattended | A reconciliation every Friday, with [Orchestrator](/orchestrator/) |
| **Build on it** | An assistant or app other people use | A role-specific console, or your own app's message types |

## What it covers, and how it grows

Installing Bifröst Foundation does not open all of Business Central to an assistant. It opens what
has been built for it, and that is a lot:

| | How far it reaches | How |
|---|---|---|
| **Read** | Most of your data | A general read reaches any table that is not restricted, within your permissions and [Field Access](/documentation/end-customers/administrators/#field-access). Most questions can be answered. |
| **Do** | What has a message type | Creating, converting, releasing and posting each need their own message type. Foundation's [capabilities](/foundation/capabilities/) cover sales, purchasing, finance, inventory and projects, among others. Not every task in Business Central has one yet. |
| **Change a field** | A narrow, guarded path | A general write can change fields in a record, by default only the fields the change log covers ([ChangeLog Write Guard](/documentation/end-customers/administrators/#the-setup-page)). It does not replace an operation with Business Central's own logic. |

When there is no message type for a task, the assistant cannot do it through Bifröst, and it should
say so. {/* OPEN-19 */} That is the edge of what is installed, not a fault.

### Every app moves the edge

Capabilities come from apps, and anyone can build one. Each app's capabilities join the same
catalogue, behind the same gate: the same permissions, the same log, the same help an agent reads
before it calls. Every connected agent can use it as soon as the app is installed, set up and permitted.

- **Origo's apps** add capabilities such as Icelandic banks, document exchange, storage and schedules;
  see the [app list](/apps/).
- **Partners and ISVs** add capabilities for their own apps and industries, and list them in the
  [app registry](/apps/register-your-app/). See [Build on Bifröst](/extensibility/).
- **Your own developers** can add a capability for your company's own processes, the same way.
- **[Orchestrator](/orchestrator/)** chains message types from any app into routines, with no code.

**An example: bank reconciliation.** Each app you add lets you ask for more:

| With | You can ask | Capabilities used |
|---|---|---|
| Foundation | *"Reconcile the main bank account against this statement and show me what does not match."* | `Finance` |
| + [Iceland Treasury](/iceland-treasury/) | *"Fetch yesterday's statement from Landsbankinn and reconcile it."* {/* OPEN-30 */} | `Landsbankinn`, `Finance` |
| + [Orchestrator](/orchestrator/) | *"Do this every morning and tell me what did not match."* | `Orchestrator`, `Landsbankinn`, `Finance` |

The assistant combines capabilities from different apps as if they were one product.

**Missing something?**

1. Ask the assistant: *"Which capabilities can you use here?"* It lists what your installation has.
2. Look in the [app list](/apps/): it may be in an app you have not installed yet.
3. If not, ask your Business Central partner or [Origo](https://www.origo.is/). It can be built,
   either as a new app or as more message types in an app that exists; see
   [Build on Bifröst](/extensibility/).

**Next:** [Set it up](/setup/), or the page for your role:
[Users](/documentation/end-customers/users/) · [Administrators](/documentation/end-customers/administrators/) ·
[Developers](/documentation/end-customers/developers/) · [Partners](/documentation/partners/).
