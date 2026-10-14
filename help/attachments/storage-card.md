---
id: storage-card
title: "Bifrost Storage Connection"
sidebar_position: 3
---

Use **Bifrost Storage Connection** to bind a connection code to a registered file account. Open the
card from [Bifrost Storage Setup](/help/attachments/storage-setup/).

| Field | Meaning |
| --- | --- |
| **Code** | The connection identifier. Choose a code the routines using it can recognise. |
| **Description** | What the connection is intended for. |
| **Enabled** | Allows the connection to be used. |
| **Storage Type** | Selects the storage implementation. |
| **Connector** | Selects the kind of Business Central file account. |
| **File Account Name** | The account chosen through **Select File Account** or the field's lookup. |
| **Base Path** | An optional prefix added to paths used through this connection. Leave it blank to use the account root. |

Choose the connector first, then **Select File Account**. The
[account lookup](/help/attachments/storage-account-lookup/) shows accounts for that connector. Changing
the connector clears the previous account selection; select an account again.

Choose **Test Connection** to check that the selected account can be reached. A missing account or an
unreachable connection produces an error. A successful test confirms reachability; it does not test
every read, write or delete permission at the provider.

The account and provider permissions determine access. Review them before enabling a connection for
routines that can change or delete files.
