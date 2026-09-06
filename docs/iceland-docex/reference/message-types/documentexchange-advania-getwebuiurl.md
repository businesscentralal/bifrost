---
id: documentexchange-advania-getwebuiurl
title: "DocumentExchange.Advania.GetWebUIUrl"
sidebar_label: "DocumentExchange.Advania.GetWebUIUrl"
sidebar_position: 24
description: "Request and response contract for the DocumentExchange.Advania.GetWebUIUrl Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only.

Generates a single sign-on URL into the document exchange partner web portal.
Fetches a short-lived web token using stored credentials and builds a login link.

## When to Use
- Opening the partner portal for manual document management
- Providing users a "Go to exchange portal" action
- Troubleshooting — viewing documents directly on the exchange

## Request
No parameters required. Uses credentials from the active partner setup.

## Response
```json
{ "url": "https://exchange.example.com/login.html?webtoken=..." }
```
The URL is short-lived — open it promptly after generation.

## Related
- **GetPresentation** — view a specific document without opening the full portal

