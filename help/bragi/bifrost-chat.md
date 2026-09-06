---
id: bifrost-chat
title: "Bifrost Chat"
sidebar_label: "Chat"
sidebar_position: 2
---

**Bifrost Chat** is an AI assistant that appears as a FactBox on the right-hand side of the pages you already work on. You ask questions in plain language and the assistant answers using live Business Central data, because it can call Bifrost message types as tools while it works.

The FactBox always knows which record you are looking at. If you open it on a sales order, the assistant already has that order in its context and you can ask about _this_ order without typing the document number. The same chat is available on a full page through the **Focus** action when the FactBox becomes too narrow.

## Where the FactBox Appears

The Bifrost Chat FactBox is added to the following standard pages:

| Area | Pages |
| --- | --- |
| **Customers and vendors** | Customer Card, Customer List, Vendor Card, Vendor List. |
| **Items** | Item Card, Item List. |
| **Sales documents** | Sales Quote, Sales Order, Sales Invoice, Sales Credit Memo, Sales Return Order and their list pages. |
| **Purchase documents** | Purchase Quote, Purchase Order, Purchase Invoice, Purchase Credit Memo, Purchase Return Order and their list pages. |
| **Ledger entries** | General Ledger Entries, Customer Ledger Entries, Detailed Cust. Ledg. Entries, Vendor Ledger Entries, Item Ledger Entries, Value Entries, VAT Entries, Bank Account Ledger Entries. |
| **Incoming documents** | Incoming Document, Incoming Documents. |
| **Bifrost setup** | User Setup Editor, where you can try the chat right after assigning a language model. |

The FactBox is hidden when the current user is not allowed to chat or when no language model is available. See [Before You Can Chat](#prerequisites) below.

## Actions

| Action | Description |
| --- | --- |
| **Focus** | Opens the conversation on the full-page **Bifrost Chat** view. The current conversation, the record context and the language model skill are carried over, and anything you add on the focused page is carried back when you close it. |
| **User Setup** | Opens the Bifrost **User Setup Editor** for the signed-in user, where the language model assignment and the personal system prompt are maintained. |

## Record Context

Every time you move to another record, the hosting page hands the table number, the record's SystemId and a caption to the chat. The caption is shown above the chat area so you can see which record the assistant is working with.

-   Ask _"summarise this customer's open entries"_ and the assistant resolves "this customer" from the context.
-   Moving to a different record clears the tool session so the assistant does not mix data from the previous record.
-   Some pages add a context skill – extra guidance that applies only on that page – on top of the skill from your language model.

## Before You Can Chat {#prerequisites}

Two conditions must be met before the FactBox becomes visible:

| Requirement | How it is met |
| --- | --- |
| **Chat permission** | The user must hold the `BIFROST Chat ori` permission set (caption _Chat Gate_). It is deliberately not part of the Bifrost Read or Bifrost Full permission sets – an administrator has to assign it to each user who is allowed to use AI chat. |
| **A language model** | At least one record on [Bifrost Language Models](/help/bragi/bifrost-lang-model-list/) must be configured and usable, either marked as **Default** or assigned to the user on User Setup. |

If either is missing the FactBox simply does not appear on the page – there is no error message. Start troubleshooting with the permission set, then with the language model.

## Setting Up a Language Model

1.  Open **Bifrost Setup** and choose the **Bifrost Language Models** action.
2.  Create a language model and give it a **Code** and a **Description**.
3.  Select the **Chat Provider**. _Copilot_ routes the conversation through the Business Central Copilot infrastructure; _None_ disables chat for that model.
4.  Fill in the model settings – **Model**, **Base URL**, **Max Tokens**, **Timeout Seconds** – or accept the provider defaults.
5.  Write the **Skill** in Markdown, or use **Import Defaults** to download the provider's standard skill text. The skill tells the assistant what it is good at and how it should answer.
6.  Mark one language model as **Default**. Only one model can be the default, and it is used by everyone who has no personal assignment.

If the chosen provider needs an API key, the chat asks for it the first time you use it and stores it securely in isolated storage. Administrators with the required permission can store a company-wide service key instead, so individual users are not prompted at all.

## Per-User Language Model Assignment

The Bifrost **User Setup** record for each user carries a **Language Model Code** field. It is edited on the **User Setup Editor** page, which is reachable from the **User Setup** action in the chat FactBox or from Bifrost Setup.

| Value | Effect |
| --- | --- |
| **Filled in** | The chat uses that language model – its provider, its model settings and its skill – for this user only. |
| **Empty** | The chat falls back to the language model marked as **Default**. If no default exists, the chat is not shown. |

This is how one company can run several assistants side by side: a sales model with sales instructions, a finance model with posting instructions, and so on. The user's personal system prompt on User Setup is added on top of the language model skill.

## What the Assistant Can Do

Bifrost Bragi contains a built-in MCP tool server. It exposes Bifrost message types to the language model as tools, so the assistant can look data up and act on it instead of guessing. Everything runs in your own session, under your own Business Central permissions – the assistant can never read or write anything you could not read or write yourself.

| Tool group | What the assistant uses it for |
| --- | --- |
| **Discovery** | `list_message_types`, `get_message_type_help`, `search_tables`, `get_fields`, `who_am_i` – finding out which operations, tables and fields exist and who is signed in. |
| **Reading data** | `get_records`, `get_record_ids`, `get_record_count`, `get_totals`, `find_entries` – reading records, counting them, adding up amounts and navigating from a document to its ledger entries. |
| **Changing data** | `set_records`, `get_next_line_no` – creating and updating records, for example adding a line to a sales order. The assistant reads before it writes and asks you to confirm first. |
| **Files** | `get_blob`, `set_blob`, `list_blobs`, `delete_blobs`, `download_blob` – handling attachments, PDF documents and other binary content, and saving a file to your device. |
| **Memory** | `get_user_memory`, `set_user_memory` – remembering your preferences between conversations. Company memory is read at the start of every session. |
| **Navigation** | `get_page_url` – producing a clickable link to a page or record card so you can jump straight to it. |
| **Anything else** | `invoke_message_type` – calling any enabled Bifrost message type, including message types added by other Bifröst apps installed in the environment. |

When a tool is running, the chat shows which tool it is calling. Tool results are fed back to the model, which may then call another tool before it answers – so a single question can turn into several lookups.

## Common Tasks

-   **Ask about the current record:** open a document, type your question and let the assistant resolve the context.
-   **Work in a larger window:** choose **Focus**, continue the conversation and close the page to return to the FactBox with the conversation intact.
-   **Change assistant:** choose **User Setup**, set another **Language Model Code** and reopen the page.
-   **Get a link:** ask for a link to a record and the assistant returns a deep link you can click or share.
-   **Give the assistant standing instructions:** put them in the language model skill (for a group of users) or in the personal system prompt on User Setup (for yourself).

## Tips

-   The conversation is not stored in the database. Closing the page ends the conversation, so copy out anything you want to keep.
-   Use memory for facts that should survive between conversations – ask the assistant to remember them.
-   The assistant answers in the language resolved for your user, so an Icelandic user gets Icelandic answers from the same language model.
-   If answers look wrong or too generic, review the **Skill** on the language model first – that text is what shapes the assistant's behaviour.
-   Ask the assistant to explain what it did. It can list the tools it called, which is the fastest way to see why an answer looks the way it does.

## See Also

-   [Bifrost Language Models](/help/bragi/bifrost-lang-model-list/) – List of all defined language models
-   [Bifrost Language Model Card](/help/bragi/bifrost-lang-model-card/) – Provider, model settings and skill
-   [Bifrost Bragi Help](/help/bragi/) – Overview of the extension
