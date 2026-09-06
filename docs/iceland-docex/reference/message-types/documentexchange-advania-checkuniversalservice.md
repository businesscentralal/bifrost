---
id: documentexchange-advania-checkuniversalservice
title: "DocumentExchange.Advania.CheckUniversalService"
sidebar_label: "DocumentExchange.Advania.CheckUniversalService"
sidebar_position: 1
description: "Request and response contract for the DocumentExchange.Advania.CheckUniversalService Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Checks if the authenticated user is enrolled in the Advania universal distribution service.

## Request
No parameters required. Uses the stored credentials for authentication.

## Response
Returns enrollment status. HTTP 400 = not enrolled. HTTP 200 = enrolled with service details.

