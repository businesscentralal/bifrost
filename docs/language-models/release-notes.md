---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Language Models published on Microsoft AppSource."
---

# Bifröst Language Models release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Language Models published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.3 — D Month YYYY

### Added

- A scheduled task or a playbook can ask a language model a question and get an answer that is based on live Business Central data. The model can only read: it never creates, changes, posts or deletes anything, and it works within the permissions of the user or routine that asks.
- The answer can be plain text, or one complete HTML page that a routine can hand on, for example to build a report. You can add your own context and instructions and ask for a structured answer.
- Each question has limits on how many times the model may read data, how many rounds it may take and how much text each read may return. The limits are set per company in **Language Models Setup**, in a new group for question limits. The setup page is now editable.
- Every language model prompt starts with the current date, time and time zone, so relative questions such as "last week" or "today" are answered from the time of the request, not from the time the session started.
- Files can be sent with a question or a prompt in two ways: files you upload to Business Central first, and files that a routine produces in an earlier step and passes on directly. Text documents, PDF, PNG and JPEG are accepted, up to 10 files in all. The total size is limited for each language model and never above 100 MB.
- Questions leave usage events in Business Central telemetry for administrators: which model answered, how many rounds and reads it took, how long it took and how it ended. The events never contain the question, the context or the answer.

### Changed

- The language model setup sets the limits for questions per company. Existing companies start with the same limits that applied before.
- Bifröst Language Models now needs Bifröst Foundation 28.0.13 or later.
- Your AI assistant gets fuller descriptions of the new question operation and of file attachments, in English and Icelandic.

### Fixed

- Sending a text document, such as a plain text file, no longer fails with OpenAI, Azure OpenAI or a model you host yourself. The text is now handed to the model as text, and PDF and pictures work as before.
- Google Gemini answers questions about text and PDF documents. Before, such a question failed with a general provider error.
- xAI (Grok) accepts text documents and answers successfully when files are attached. Before, a successful xAI answer could be reported as a failure. When xAI refuses a file, the message now tells you whether it was the upload or the answer that was refused.
- Anthropic failures show the provider's status and, when it is safe to show, the reason. Plain text documents are accepted by Anthropic.
- When you ask for an HTML page, an answer that contains figures is no longer replaced by a short "nothing to verify" note. An answer that the provider cut off at its token limit is refused instead of being returned as if it were complete.
- Files are checked before anything is sent to a provider. Data that is not valid Base64, or a PDF, PNG or JPEG whose content does not match its type, is refused with a clear message. A picture type that the app does not accept, and files above the size limits, are refused in the same way.
- File types are recognized however they are written, for example in capital letters or with extra parameters, so a picture type written as IMAGE/PNG is handled as a PNG.
- If you send a picture to a language model that cannot read pictures, you get a clear message naming the model and suggesting up to three of your other models that can, instead of a general provider error.
- Using a Copilot language model for a prompt gives a clear message when Copilot is not set up or not active, or when the session cannot use it. Copilot works for prompts only in an interactive Business Central session, not through an API connection.
- Questions and prompts that carry uploaded files now report the current date and time. Before, the date and time were left out whenever uploaded files were attached.
- **Assisted Setup** lists the Language Models setup for people who may see it but not run it, and does not give them more rights.
- A license administrator with restricted permissions can open **Bifrost Setup** when Language Models is installed.

## 28.0.2 — 28 October 2026

### Changed

- The setup's user list opens faster. It now reads the chat permissions and each person's language model choice once, instead of looking them up for every row.
- The permission columns in the user list use translated captions, and the tooltips still name the permission sets they stand for.

### Fixed

- The setup now keeps permissions that people inherit through a security group. They are shown correctly in the user list and are no longer lost when the list is refreshed.
- Icelandic texts in the setup use the same wording for Copilot and agent features in actions, help, status and tooltips.

## 28.0.1 — 25 October 2026

### Added

- Language Models has its own **assisted setup**. It shows whether HTTP access is on for this app and opens Foundation's setup to turn it on for every Bifröst app, shows whether Copilot is available and initialized, and keeps the chat provider you already use.
- The setup gives the people you choose the chat permissions for the company and a language model each. Choosing **Finish** completes the Assisted Setup step.
- **Language Models Setup** opens the new setup, and the Foundation setup stays available from the same page.

### Changed

- Your AI assistant gets a fuller description of every Language Models operation: what it answers, the errors it can return and why, and what it changes in Business Central.
- The operation that asks a language model for one answer is easier to find: it has more search terms in English and Icelandic and says plainly that it only reads. It points to Business Central data access for prompts that need data.

## 28.0.0 — 19 October 2026

### First version on Microsoft AppSource

- Chat with Business Central beside the record you have open. **Chat via Bifrost** sits in the FactBox pane of customers, vendors, items, sales and purchase documents, ledger entries and incoming documents, and **Focus** opens it on a full page.
- The assistant knows which record you are looking at, reads live data from Business Central to answer, and works as you, within your permissions.
- Choose the language model per group of people: Copilot, OpenAI, Azure OpenAI, Anthropic, Google Gemini, xAI or a model you host yourself, each with its own settings and instructions.
- Keep API keys in Bifröst's secret store, as a shared key for the company or a personal key for each user. Copilot needs no key.
- Let a scheduled task or a playbook ask a language model for one answer, for example to classify or summarize a document.
