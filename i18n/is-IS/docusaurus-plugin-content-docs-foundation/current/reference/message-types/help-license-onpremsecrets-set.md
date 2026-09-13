---
id: help-license-onpremsecrets-set
title: "Help.License.OnPremSecrets.Set"
sidebar_label: "Help.License.OnPremSecrets.Set"
sidebar_position: 58
description: "Beiðni- og svarsamningur fyrir Help.License.OnPremSecrets.Set Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


Writes og clears the on-premises licensing secrets in company-scoped IsolatedStorage.
```json
{
  "clearAll": true,
  "accountName": "my-cosmos-account",
  "accessKey": "<base64>",
  "databaseId": "CE-licenses",
  "containerId": "licenses"
}
```

