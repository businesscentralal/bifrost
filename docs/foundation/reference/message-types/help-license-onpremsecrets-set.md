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


Writes or clears the on-premises licensing connection material for the current company.

On-premises licence customers receive the required secrets from **Origo** with their licence.
Do not invent or publish account names, keys, database identifiers, or other connection
literals on the public site — paste only the values Origo supplied into this message type
(or clear them with `clearAll`).

### Clear all stored on-premises licensing secrets
```json
{ "clearAll": true }
```

### Set secrets supplied by Origo

Pass the fields Origo documented for your on-premises licence. Field names and shapes are
part of that private delivery, not of this public contract page.
