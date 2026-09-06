---
id: index
title: "Bifröst Bragi — Help"
sidebar_label: "Bifröst Bragi — Help"
sidebar_position: 1
slug: /
---

**Bifrost Bragi** is a Business Central extension by Origo that adds AI chat to Business Central. It builds on Bifrost Foundation and contributes the Bifrost Chat control add-in, language models, a Copilot chat provider, an in-process MCP tool server and the `LLM.Prompt.Complete` message type.

The chat appears as a FactBox on customer, vendor, item, sales, purchase, ledger entry and incoming document pages, and it knows which record you are looking at. Through the MCP tool server the assistant reads and updates Business Central data with your own permissions, so it can answer with live figures instead of general advice.

## Pages

| Page | Description |
| --- | --- |
| [Bifrost Chat](/help/bragi/bifrost-chat/) | The chat FactBox and the focused full-page chat: how to open it, how record context works, what permission is required, and which tools the assistant can call. |
| [Bifrost Language Models](/help/bragi/bifrost-lang-model-list/) | List of all defined language models, opened from the Bifrost Language Models action on Bifrost Setup. |
| [Bifrost Language Model Card](/help/bragi/bifrost-lang-model-card/) | Card page for a single language model – chat provider, model settings and the Markdown skill injected into the conversation. |

## Getting Started

1.  Assign the `BIFROST Chat ori` permission set to every user who is allowed to use the chat.
2.  Open **Bifrost Setup**, choose **Bifrost Language Models** and create a language model with a chat provider and a skill.
3.  Mark one language model as **Default**, or assign a language model per user on the Bifrost User Setup Editor.
4.  Open a customer, item or sales document and ask the assistant a question in the **Bifrost Chat** FactBox.
