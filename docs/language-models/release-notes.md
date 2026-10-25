---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Language Models published on Microsoft AppSource."
---

# Bifröst Language Models release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Language Models published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

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
