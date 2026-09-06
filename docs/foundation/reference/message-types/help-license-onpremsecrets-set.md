---
id: help-license-onpremsecrets-set
title: "Help.License.OnPremSecrets.Set"
sidebar_label: "Help.License.OnPremSecrets.Set"
sidebar_position: 58
description: "Request and response contract for the Help.License.OnPremSecrets.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Writes and clears the on-premises licensing secrets in module-scoped IsolatedStorage.
```json
{
  "clearAll": true,
  "accountName": "my-cosmos-account",
  "accessKey": "<base64>",
  "databaseId": "CE-licenses",
  "containerId": "licenses",
  "rijndaelKey": "<base64>",
  "rijndaelVector": "<base64>"
}
```

