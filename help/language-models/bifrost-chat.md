---
id: bifrost-chat
title: "Chat via Bifrost"
---

**Chat via Bifrost** is an AI assistant in the FactBox pane of the page you are on. Ask in plain language;
the assistant reads live Business Central data to answer and works as you, within your permissions. This
help opens from the pages that show the chat. For the page itself, see Microsoft's Business Central
documentation.

## Where you find it

| Area | Pages |
| --- | --- |
| **Customers and vendors** | Customer Card, Customers, Vendor Card, Vendors |
| **Items** | Item Card, Items |
| **Sales** | Sales Quote, Sales Order, Sales Invoice, Sales Credit Memo, Sales Return Order, and their lists |
| **Purchases** | Purchase Quote, Purchase Order, Purchase Invoice, Purchase Credit Memo, Purchase Return Order, and their lists |
| **Entries** | General Ledger Entries, Customer Ledger Entries, Detailed Cust. Ledg. Entries, Vendor Ledger Entries, Item Ledger Entries, Value Entries, VAT Entries, Bank Account Ledger Entries |
| **Incoming documents** | Incoming Document, Incoming Documents |
| **Bifröst** | The Bifröst user setup, to try the chat right after choosing a language model |

## The record you are on

The chat knows which record you have open, and shows its name above the conversation. Ask *"summarise
this customer's open entries"* or *"is anything on this order short in stock?"* without typing the number.
When you move to another record, the chat follows it.

## Actions

| Action | Description |
| --- | --- |
| **Focus** | Opens the conversation on a full page, with the same record. Close the page to return; the conversation comes back with you. |
| **User Setup** | Opens your [Bifröst user setup](/help/foundation/bifrost-user-setup-editor/), where you choose your language model and write your own instructions for the assistant. |

## Before you can chat {#prerequisites}

The chat appears only when all of these are in place. If one is missing, it does not appear, and there is
no error message.

| Requirement | Who sees to it |
| --- | --- |
| The `BIFROST Chat ori` permission set, with `BIFROST LLM Rd ori`, and `BIFROST LLM Chat ori` for any provider other than Copilot | Your administrator |
| A language model chosen in **Language Model Code** on your Bifröst user setup | Your administrator, or you |
| A model that can answer: an API key for its provider (shared, or your own), or Copilot turned on | Your administrator, or you |

## How it answers

The assistant uses Bifröst's operations as tools: it finds out what is installed, reads records, counts
and totals them, follows a document to its entries, and with your confirmation creates or changes records.
It can also give you a link that opens a page or record, handle attachments and save a file to your
device. The chat shows which tool it is calling while it works, and one question can take several steps.

- **Figures come from your data.** The assistant is told never to state a business figure it has not read.
  When an answer contains figures that the assistant has not read in that turn, Bifröst asks it once to
  check them against Business Central or to say that it cannot.
- **It works as you.** It can read and change only what you could yourself, within Bifröst's protections.
  Every call is logged on **Bifrost Messages**.
- **It answers in your language**, the language of your Business Central session.
- **What it remembers.** Ask it to remember a preference and it keeps it for your next conversations. It
  also reads what has been stored for the whole company.

## Common tasks

- **Ask about the current record:** open the document and type your question.
- **Work in a larger window:** choose **Focus**, carry on, and close the page to return.
- **Change assistant:** choose **User Setup**, pick another **Language Model Code**, and open the page
  again.
- **Give the assistant standing instructions:** write them in the system prompt on your Bifröst user setup.
  For a whole team, an administrator writes them in the skill of the team's language model.

## Tips

- The conversation is not saved. Closing the page ends it, so copy anything you want to keep.
- In a long conversation, the earliest messages may no longer be sent to the model; your current question
  always is. Start a new conversation for a new task.
- If the answers seem off, ask the assistant which tools it called, and check the skill of your language
  model.

## See also

- [Bifrost Language Model](/help/language-models/bifrost-lang-model-card/): provider, model, key and skill
- [Bifröst Language Models](/language-models/): what the app does and how to set it up
