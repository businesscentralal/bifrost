---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Attachments published on Microsoft AppSource."
---

# Bifröst Attachments release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Attachments published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.3.3 — 22 November 2026

### Changed

- Working with files and folders in storage, attachment offload and restore, uploads, and Data Exchange imports and exports no longer ask for a confirmation count. These operations can be repeated or corrected, so an assistant or another app treats them as ordinary changes. A file written to external storage is still not rolled back with Business Central, and the help says so.
- Older callers that still send a count keep working; the count is ignored.
- The Data Exchange setup tables follow Bifröst Foundation's setup mode: an administrator can change them through your assistant or an integration only while setup mode is on.

## 28.3.2 — 10 November 2026

### Added

- **Hand a stored file to another Bifröst app.** Your AI assistant can copy a file from a storage connection into Bifröst's temporary storage for uploaded files, so another Bifröst app can use it without the file being downloaded and uploaded again. The file in storage is not changed. A file that does not exist is reported as missing, and a file larger than 240 MiB is refused before anything is copied.
- **Large uploads into temporary storage.** A file uploaded in parts can now be put together in Bifröst's temporary storage instead of in a storage account, for another Bifröst app to pick up. If a check fails, the upload is kept so it can be tried again.
- **Test storage without credentials.** A storage connection can use storage inside the company, with no account, credentials or network connection, to try out storage operations. Each connection keeps its own files, and they are removed with the connection.

### Changed

- Data exchange definitions can no longer be deleted through Bifröst. The request is refused with a message in your language and nothing is deleted; delete definitions in Business Central. Deleting data exchange entries and files is unchanged.
- When a file is attached to an incoming document, the answer gives both the data exchange type that was asked for and the type the incoming document has after Business Central has recognized and processed it. The data exchange type that the answer already gave now reports the type that was applied.
- The built-in help for every Attachments operation is in English in every language. Descriptions, keywords and error messages are still translated.
- The help for restoring an attachment says which files are deleted from storage: only files that the attachment created. Files that were in storage before, and older links, are kept.

### Fixed

- The list of data exchange types shows whether each type is for invoices or credit memos, with the same values you use when you set a type.
- Exporting with Data Exchange checks the target before it asks for confirmation. Export formats that need someone at the screen are refused in background calls before anything is written.
- Processing with Data Exchange runs only the real mapping lines of a definition, and names an invalid mapping, table or codeunit before anything is processed.
- A CSV upload with only a header row is refused before anything is written, and the upload is kept so you can correct the file and try again. Messages about invalid file content are shorter and keep the details needed to recover.
- License administrators can open Bifrost Setup when Attachments is installed, without extra permission sets.

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
