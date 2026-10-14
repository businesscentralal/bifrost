---
id: storage-setup
title: "Bifrost Storage Setup"
sidebar_position: 2
---

**Bifrost Storage Setup** lists the connections Bifröst uses to reach Business Central file accounts.
Open it from [Bifrost Attachments Setup](/help/attachments/attachments-setup/).

| Field | Meaning |
| --- | --- |
| **Code** | Identifies the connection a routine uses. |
| **Description** | Explains what this connection is for. |
| **Connector** | The kind of file account used by the connection. |
| **File Account Name** | The selected Business Central file account. |
| **Enabled** | Whether the connection can be used. |

Open a row to maintain it on the [connection card](/help/attachments/storage-card/). Register a file
account through **Storage Setup Wizard** on the Attachments setup page before selecting it.

## Attachments setup wizard

The Attachments setup wizard also opens help here. It checks whether HTTP requests are enabled for
the extension. If they are disabled, use **Enable HTTP Client Requests** if your permissions allow
it, or ask an administrator to enable them in **Extension Settings**. Choose **Verify** after the
setting changes, then continue and finish.

Finishing this wizard does not create a file account or a storage connection. Return to Attachments
setup to configure those and test the connection.
