---
id: index
title: "Bifröst Language Models"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "AI chat for Business Central: language models, seven chat providers, an MCP tool server and a one-shot completion message type."
---

# Bifröst Language Models

**Chat with Business Central where you already work.** A chat panel sits beside the customer, item
or order you have open, knows which record it is, and answers from live data with your own
permissions.

{/* OPEN-20 */}

*An add-on to [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Ask about the record in front of you.** On a sales order: *"Is anything on this order short
  in stock?"* On a customer: *"Summarise this customer's open entries."* The chat already knows
  which order or customer you mean.
- **Get live figures, not guesses.** The chat reads Business Central through Bifröst's message
  types, so its answers come from your data at that moment.
- **Stay in Business Central.** The chat is on 36 standard pages: customers, vendors, items, sales
  and purchase documents, ledger entries and incoming documents. **Focus** opens it on a full page.
- **Choose your provider.** Copilot, OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI or your
  own model. Copilot needs no API key.
- **Use a model inside a routine.** `LLM.Prompt.Complete` gives a playbook or a scheduled task one
  answer from a model, for example to classify or summarise a document.

## Get it

Install **Bifrost Language Models** next to Bifröst Foundation, from AppSource or through your
partner. It needs Business Central 28.0 or later.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Choose a provider. For **Copilot**, turn it on under **Copilot & AI Capabilities**; for another provider, have its API key ready. | Business Central administrator |
| 2 | On **Bifrost Setup**, open **Bifrost Language Models Setup** and run its **Setup Wizard**, or create a language model by hand, then choose **Import Defaults** for the skill text. Mark one model as **Default**. | Business Central administrator |
| 3 | Give each person who may chat the **`BIFROST Chat ori`** permission set, next to `BIFROST LLM ori` (or `BIFROST LLM Rd ori`). Chat is never included in other permission sets. | Business Central administrator |
| 4 | Open a customer, item or sales order: the chat appears on the right. | Each user |

The step-by-step guide is in the in-product help:
[Language Models setup](/help/language-models/language-models-setup/) and
[Bifrost Chat](/help/language-models/bifrost-chat/).

## Good to know

- **It acts as you.** The chat can only read and change what your own Business Central
  permissions allow, and every call is logged on **Bifrost Messages**.
- **No chat permission, no chat.** Without `BIFROST Chat ori` or a usable language model, the chat
  panel does not appear at all. There is no error message; check those two first.
- **API keys** are stored in Business Central, per user or as one shared key per model. Copilot
  runs on Microsoft-managed resources and needs none.
- **Your conversations go to the provider you choose**, under your agreement with that provider.
  See [Where your data goes](/documentation/how-it-works/#where-your-data-goes).

## Capabilities and reference

Capability: **`LLM`**. What each message type does, in plain words: [Capabilities](./capabilities).

- [Message type reference](./reference/message-types/): the contract of every type, generated from the app itself
- [Chat message types](./message-types) and [Adding a chat provider](./extensibility)
- [In-product help](/help/language-models/)
- Permission sets: `BIFROST LLM ori` or `BIFROST LLM Rd ori` for the app, `BIFROST Chat ori` for
  chat, `BIFROST ChatSvc ori` for setting a shared key.
