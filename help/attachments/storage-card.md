---
id: storage-card
title: "Bifrost Storage Connection"
---

Use **Bifrost Storage Connection** to bind a Bifröst connection to a registered file account. Open a connection from [Bifrost Storage Setup](/help/attachments/storage-setup/).

## Configure the connection

1. Enter **Code** and **Description**.
2. Choose the **Connector** for your storage provider.
3. Choose **Select File Account**, or the lookup beside **File Account Name**, and select a [registered account](/help/attachments/storage-account-lookup/).
4. Set **Base Path** to the folder within that account to use for this connection.
5. Choose **Test Connection** to check that the configured storage can be reached.
6. Review **Enabled** before making the connection available.

The connector's Business Central setup owns the account credentials. This card selects an existing account; it does not replace its credential setup. Changing the account or base path changes where subsequent file operations go. Review existing attachment links before changing a connection already in use.
