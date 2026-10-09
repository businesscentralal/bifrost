---
id: how-it-works
title: "How Bifröst works"
sidebar_label: "How Bifröst works"
sidebar_position: 1
description: "The ideas behind Bifröst, explained once: operations that describe themselves, the one gate every call goes through, and how an agent finds and calls the right one."
---

# How Bifröst works

**Ask Business Central. It works out how.**

Getting a new answer out of an ERP has always meant someone building it first: a report, an
integration, a project with a budget and a queue. Bifröst removes that step. You ask in your own
words, in Copilot, Claude or another AI assistant, and an **agent** does the work in Business
Central. (On this site, *agent* means the AI, or another system, acting for you.)

It can do that because every operation Bifröst offers describes itself. An operation does one
thing, such as checking item availability, turning a quote into an order or posting a document,
and it says what it does, what it needs, what it returns and what can go wrong. The agent reads
those descriptions, picks the right operations and calls them. (Developers know an operation as a
*message type*; that is the only place the word matters.)

## Why Bifröst {#why-bifrost}

With Bifröst, your AI assistant does the work in Business Central, under your control.

1. **It does the work.** Each operation is a finished Business Central task, from
   checking a customer's credit to turning a quote into an order or posting a document. It uses Business
   Central's own logic, the same as when a person does it in the client. Nothing has to be built, or
   maintained, for each new question.
2. **You see a posting before it is posted.** The agent can preview a posting: the entries it would
   create, without posting anything. And an agent posts only for a user you have opened the posting gate
   for, even if that user may post in Business Central.
3. **You decide what agents may touch.** On top of each user's own permissions, you can hide fields from
   agents, require that every field an agent changes is traced in the change log, set a monthly limit per
   user and for the company, and see every call in your own Business Central. See
   [Permission sets and gates](/documentation/end-customers/permissions/) and
   [What agents read and change](/documentation/end-customers/data-access/).
4. **It fits how you already work.** Copilot, ChatGPT, Claude or any other assistant that supports MCP,
   so you are not tied to one provider. Your integrations call the same operations, also in the
   background, and Business Central tells them when the work is done. Online and on-premises.

Every Bifröst app adds operations to the same catalogue, behind the same controls, and every connected
assistant can use them the same day.

## Domains and operations

The operations are grouped into **domains**, such as Customer, Sales or Item. For example:

| Domain | An operation in it |
|---|---|
| **Customer** | Checks a customer's credit: balance, overdue amount, open orders and what is left |
| **Sales** | Posts a sales document |
| **Item** | Works out how much of an item you can promise |

- **An operation** does one thing, and it is what an agent calls. Each one describes itself.
- **A domain** groups the operations about the same thing, such as customers or sales documents. An
  agent looks at the domains first, then picks an operation inside the right one.
- **An app** is what you install. It adds domains, or more operations to a domain that exists:
  Foundation brings the standard Business Central ones (see [what Foundation covers](/foundation/#capabilities)),
  and each other app adds its own.

```mermaid
flowchart LR
  F["App: Foundation"] --> C1["Domain: Customer"]
  F --> C2["Domain: Sales"]
  F --> C3["Domain: Finance"]
  T["App: another Bifröst app"] --> C4["Domain: its own"]
  C1 --> M1["Check a credit limit"]
  C1 --> M2["Customer statement as PDF"]
  C2 --> M3["Post a sales document"]
  C3 --> M4["Match a bank reconciliation"]
  C4 --> M5["Its own operations"]
```

*In words: an app adds domains, and each domain holds operations. Foundation adds Customer, Sales
and Finance, among others; another Bifröst app adds a domain of its own. Checking a credit limit and
printing a customer statement both belong to Customer.*

Because every operation describes itself, a new one is usable as soon as its app is installed, set
up and permitted; nothing has to be taught to the assistant first.

## How it fits together

import PlatformMap from '@site/src/components/PlatformMap';

<PlatformMap />

[Bifröst Foundation](/foundation/) is the one gate. It holds the catalogue of operations, hands out
their help, checks permissions and license, and logs every call. Everything else in the family is
an app that adds its own operations to the same catalogue. The [app list](/apps/) shows the apps
that are available.

## What happens when you ask

> "How many of item 1896-S can we still promise this week, and where are they?"

1. **The agent searches** the catalogue in your words and gets a short list of candidates.
2. **It chooses** by their one-line descriptions. The availability operation returns calculated
   availability per location, including reservations and expected receipts, which is what the
   question is about; the on-hand count alone would not answer it.
3. **It reads the help** of that operation: how to name the item, what comes back.
4. **It calls it.** Foundation checks that you may, runs it as you and logs the call.
5. **It answers** in plain words, with the figures per location.

A change works the same way, with one more safeguard: the agent can look before it acts.

> "Turn quote SQ-1042 into an order and show me what posting it would do."

The agent turns the quote into an order, then previews the posting, which shows the entries
posting would create **without posting anything**. You see the result before anything is posted,
and whether the agent may post at all is decided by the permissions of the identity it runs as.

When something goes wrong, the answer says what to do next, for example that a number does not
exist and how to look it up. The agent corrects itself or asks you.

## Where your data goes

import DataFlow from '@site/src/components/DataFlow';

<DataFlow />

In more detail:

- **Origo** does not store message contents or your business data, and they are not used to train
  AI models. Its licensing service keeps your Bifröst configuration (company identification,
  environment name and connection details), usage counts with times and the names of the operations
  called, and a hashed identifier of your tenant; the apps also send it technical diagnostics
  (telemetry). The setup wizard shows what the licensing service stores before you accept.
- **Bifrost Messages** in your Business Central keeps each call with the data it returned, for as
  long as you decide; see [Logs and retention](/documentation/end-customers/administrators/#logs-and-retention).

The full statement: [Privacy](/licensing/privacy/).

## How far it goes

From one answer to a chain of operations: [Try it out](/try-it-out/#what-to-ask-first)
goes through the levels, with a question to try for each.

## What it covers, and how it grows

Installing Bifröst Foundation does not open all of Business Central to an assistant. It opens what
has been built for it, and that is a lot:

| | How far it reaches | How |
|---|---|---|
| **Read** | Most of your data | A general read reaches any table that is not restricted, within your permissions and [Field Access](/documentation/end-customers/data-access/#field-access). Most questions can be answered. |
| **Do** | What has an operation | Creating, converting, releasing and posting each need their own operation. Foundation's domains cover sales, purchasing, finance, inventory and projects, among others. Not every task in Business Central has one yet. |
| **Change a field** | A narrow, guarded path | A general write can change fields in a record, by default only the fields the change log covers ([ChangeLog Write Guard](/documentation/end-customers/data-access/#the-changelog-write-guard)). It does not replace an operation with Business Central's own logic. |

When there is no operation for a task, the assistant cannot do it through Bifröst, and it should
say so. That is the edge of what is installed, not a fault.

### Every app moves the edge

Operations come from apps, and they all join the same catalogue, behind the same permissions and
the same log. Other Bifröst apps add domains of their own. Each has its own setup page, reached from
the **Apps** group on Bifröst Setup, its own help, and keeps its credentials in the shared secret
store; see the [app list](/apps/).

The assistant combines operations from different apps in one conversation.

**Missing something?**

1. Ask the assistant: *"What can you do here?"* It lists what your installation has.
2. Look in the [app list](/apps/): it may be in an app you have not installed yet.
3. If not, ask your Business Central partner. It can be built,
   either as a new app or as more operations in an app that exists.

**Next:** [Set it up](/setup/), or the page for your role:
[Users](/documentation/end-customers/users/) · [Administrators](/documentation/end-customers/administrators/) ·
[Developers](/documentation/end-customers/developers/).
