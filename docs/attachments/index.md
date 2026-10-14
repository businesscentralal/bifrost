---
id: index
title: "Bifröst Attachments"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Connect Business Central file accounts to Bifröst and work with files and data exchange definitions."
---

# Bifröst Attachments

Bifröst Attachments lets an assistant or a routine work with files through the file accounts you
configure in Business Central. Administrators choose the account, connector and optional base path
for each storage connection. The app also provides operations for Business Central data exchange
definitions and entries.

The app extends [Bifröst Foundation](/foundation/). This documentation describes its setup; it does
not mean the app is available on AppSource. Ask your Business Central partner about availability.

## Set it up

1. Open **Bifrost Setup**, then **Bifrost Attachments Setup** in the **Apps** group.
2. Choose **Setup Wizard** to allow the installed Bifröst apps to make HTTP requests.
3. Use **Storage Setup Wizard** to register a file account in Business Central, or **Storage Setup**
   to review the accounts already configured for your company.
4. Open **Bifrost Storage Setup**, create a connection and select its connector and file account.
5. Set an optional **Base Path**, enable the connection and choose **Test Connection** on its card.

The details are in [Attachments setup](/help/attachments/attachments-setup/),
[storage connections](/help/attachments/storage-setup/) and the
[connection card](/help/attachments/storage-card/).

## Permissions and responsibility

Your administrator assigns **Bifrost Storage** for the storage features and **Bifrost Data Exchange**
for data exchange features, alongside the Foundation permissions needed for your work. Your file
account also needs permission at the storage provider.

File operations can change or delete files in the selected account. Use an account and a base path
appropriate for the company, and check the connection before allowing a routine to use it. Treat
**Base Path** as a path prefix; manage access rights on the account and at the storage provider.

Data exchange operations can change definitions used for imports and exports. Review such changes
with the person responsible for those processes before applying them.

For the available operations, use the live catalogue in your installed environment. See
[How Bifröst works](/documentation/how-it-works/).
