---
id: index
title: "Bifröst Language Models"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Chat with Business Central beside the record you have open, with the language model you choose, and give routines a model answer when they need one."
---

# Bifröst Language Models

**Chat with Business Central where you already work.** Bifröst Language Models puts a chat beside the
customer, item, document or entries you have open. The assistant knows which record you are looking at,
reads live data from Business Central to answer, and works as you, within your permissions. You choose
the language model it uses: Copilot, OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI or a model you
host yourself.

This page is for the people who decide on the app and set it up. Bifröst Language Models is an
additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).

## What you can do

- **Ask about the record in front of you.** On a sales order: *"Is anything on this order short in
  stock?"* On a customer: *"Summarise this customer's open entries."* The chat already knows which order
  or customer you mean.
- **Get answers from your data.** The assistant reads Business Central through Bifröst while it works,
  so its answers come from your data at that moment. When an answer contains business figures that the
  assistant has not read in that turn, Bifröst asks it once to check them against Business Central or to
  say that it cannot.
- **Stay in Business Central.** The chat, **Chat via Bifrost**, sits in the FactBox pane of the customer,
  vendor and item pages, the sales and purchase documents and their lists, the ledger entry pages and
  incoming documents. **Focus** opens it on a full page. See
  [Bifrost Chat in Business Central](/language-models/chat/).
- **Choose a model per group of people.** Each language model carries its provider, its settings and a
  skill: instructions that shape how the assistant answers. A sales team and a finance team can each
  chat with a model set up for their work.
- **Use a model inside a routine.** A scheduled task or a playbook can ask a language model for one
  answer, for example to classify or summarise a document.

## Capabilities

| Domain | Capabilities |
|---|---|
| **LLM** | One answer from a language model for a routine or an integration, without a conversation |

In a conversation, the assistant uses the capabilities of every installed Bifröst app: what it can read
and do is what Foundation and the other apps provide.

## Get it

Install **Bifrost Language Models** next to Bifröst Foundation, from AppSource or through your Business
Central partner. It needs Business Central 28.0 or later. For the price, contact your Business Central
partner.

Installing or upgrading the app makes it the provider of Bifröst's chat, unless another app already
provides it.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Choose a provider. Copilot needs nothing outside Business Central. For another provider, have its API key ready, and for Azure OpenAI or a model of your own its address. | Business Central administrator |
| 2 | Run the Bifröst setup wizard (**Setup Wizard** on **Bifrost Setup**) if you have not run it since installing the app. It allows the app to reach the providers over the internet. | Business Central administrator |
| 3 | On **Bifrost Setup**, choose **Bifrost Language Models Setup** in the **Apps** group, then **Language Models**. Create a language model with a code, a provider and a skill. For Copilot, **Init Copilot Defaults** on the list creates a ready model. | Business Central administrator |
| 4 | On the language model card, enter the API key: a shared key for the whole company, or a personal key that each user enters. | Administrator, or each user |
| 5 | Assign the permission sets (below), and on each person's Bifröst user setup choose the **Language Model Code** they chat with. | Business Central administrator |
| 6 | Open a customer, item or sales order: **Chat via Bifrost** appears in the FactBox pane. | Each user |

How to chat, what each person needs first and what to do when the chat does not answer:
[Bifrost Chat in Business Central](/language-models/chat/).

The help of each page has the details:
[Bifrost Language Models Setup](/help/language-models/language-models-setup/),
[Bifrost Language Model](/help/language-models/bifrost-lang-model-card/) and
[Chat via Bifrost](/help/language-models/bifrost-chat/).

### Permission sets

| Set | For |
|---|---|
| `BIFROST Chat ori` (from Foundation) | Everyone who may chat, and the identity a routine runs as when it asks a model for an answer. It is never part of another set |
| `BIFROST LLM Rd ori` | Everyone who chats: reading the language models |
| `BIFROST LLM Chat ori` | Everyone who chats with OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI or a model of your own. Not needed for Copilot |
| `BIFROST LLM ori` | The administrators who create and change language models |
| `BIFROST ChatSvc ori` | The people who set or clear a model's shared API key |

People who chat also need the Bifröst sets they use Bifröst with; see
[Permission sets and gates](/documentation/end-customers/permissions/).

## Good to know

- **It acts as you.** The assistant can read and change only what your own Business Central permissions
  and Bifröst's protections allow. Every call it makes for you is a Bifröst message: it is logged on
  **Bifrost Messages** and counted like any other (see [Usage and billing](/licensing/usage-and-billing/)).
- **No chat until three things are in place:** the `BIFROST Chat ori` permission set, a language model
  chosen on your Bifröst user setup, and a model that can answer (an API key, or Copilot turned on). Until
  then the chat does not appear on the record pages; your Bifröst user setup shows it with a message that it is
  disabled.
- **API keys stay in Bifröst's secret store**, never on a page or in a table. A model has a shared key for
  the company and, if you want, a personal key per user. Copilot runs on resources Microsoft manages and
  needs no key.
- **The model's address is protected.** The Base URL and paths of a language model can be changed only on
  its card in Business Central, not by an AI agent through Bifröst, so an agent cannot send a key
  somewhere else.
- **Your conversations go to the provider you choose**, under your agreement with that provider. See
  [Where your data goes](/documentation/how-it-works/#where-your-data-goes).
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_message_types`, `describe_message_type`) and on the **Bifrost Message Types** page, and each
  explains itself through `Help.Implementation.Get`.
