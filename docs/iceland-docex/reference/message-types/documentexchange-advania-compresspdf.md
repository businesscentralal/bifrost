---
id: documentexchange-advania-compresspdf
title: "DocumentExchange.Advania.CompressPdf"
sidebar_label: "DocumentExchange.Advania.CompressPdf"
sidebar_position: 2
description: "Request and response contract for the DocumentExchange.Advania.CompressPdf Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Compresses a PDF document using the Advania service. Reduces file size for storage or email.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| endpointId | string | **Yes** | Your authorized endpoint (kennitala) |
| pdfContent | string | **Yes** | Base64-encoded PDF content |
| compression | string | No | Level: screen, ebook (default), printer, prepress, none |
| filename | string | No | Output filename (appends "-compressed") |

## Response
The compressed PDF binary in the response body (base64 or raw depending on API version).

## Compression levels
| Level | Use case | Quality |
|-------|----------|---------|
| screen | Web viewing | Lowest file size, lower quality |
| ebook | Email/archive (default) | Good balance |
| printer | Print-ready | Higher quality, larger files |
| prepress | Professional printing | Highest quality |
| none | Lossless FlateDecode only | No quality loss |

