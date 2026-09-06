---
id: help-license-environment-set
title: "Help.License.Environment.Set"
sidebar_label: "Help.License.Environment.Set"
sidebar_position: 55
description: "Request and response contract for the Help.License.Environment.Set Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Overrides the environment flags used by the licensing runtime.
```json
{ "isSaaS": true, "isSandbox": true, "isOnPrem": false }
```
Use the following to clear the override:
```json
{ "clear": true }
```

