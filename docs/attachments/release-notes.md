---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Attachments published on Microsoft AppSource."
---

# Bifröst Attachments release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Attachments published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.3.1 — 25 October 2026

### Changed

- Your AI assistant gets a fuller description of every Attachments operation: what it answers, the errors it can return and why, and what it changes in Business Central.
- When an incoming document is turned into a document, the answer now identifies the document that was created, not the incoming document. If an integration used this value as the incoming document's identity, read that identity separately.
- File listings show each folder relative to the connection's base path and each file by its own name. The storage provider's account path is no longer exposed.

### Fixed

- Attachments linked to an incoming document can be processed with Data Exchange without bringing the file back into Business Central or changing the file in storage.
- Processing a Data Exchange entry stops with a clear message if the entry's definition is missing or its codeunits do not fit the data. A definition that entries still use can no longer be deleted, and the message says how to proceed.
- The data exchange type accepts Invoice and Credit Memo, keeps the existing value if you leave it out and reports the stored value.
- A missing, empty or null file name is refused with one clear error before anything reaches storage, for new uploads and for linked attachments. Errors when attaching a file to a record now include a next step.

## 28.3.0 — 21 October 2026

### First version on Microsoft AppSource

- Work with files through the file accounts you configure in Business Central. An administrator chooses the account, the connector and an optional base path for each storage connection, and tests the connection on its card.
- Let an assistant or a routine create, change and delete files in the selected account. Replacing an existing file must be asked for on purpose.
- Attach files to Business Central records, and upload large files in parts.
- Work with data exchange definitions and entries: import, export and process data with the definitions you already use.
- Use the **Storage Setup Wizard** to register a file account, and assign **Bifrost Storage** and **Bifrost Data Exchange** to the people who need them.
