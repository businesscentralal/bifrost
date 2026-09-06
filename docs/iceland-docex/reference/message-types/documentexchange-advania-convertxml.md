---
id: documentexchange-advania-convertxml
title: "DocumentExchange.Advania.ConvertXml"
sidebar_label: "DocumentExchange.Advania.ConvertXml"
sidebar_position: 3
description: "Request and response contract for the DocumentExchange.Advania.ConvertXml Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


> **Availability:** Advania only.

Converts raw UBL XML to a rendered PDF or HTML **without storing** the document.
Use this to preview what an invoice will look like before submitting it.

## When to Use
- Previewing a generated UBL XML invoice before SubmitDocument
- Debugging XML generation — verify the rendered output
- Generating a human-readable view for internal review

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| xml | string | **Yes** | Raw UBL XML content |
| output | string | No | `html` (default) or `pdf` |
| day | string | No | Stylesheet date dd.mm.yyyy (default: today) |

## Response
The rendered content is returned directly (HTML string or PDF binary).

## Key Difference from GetPresentation
- **ConvertXml** — works on raw XML, nothing is stored. Use BEFORE submit.
- **GetPresentation** — works on a UUID of an already-submitted document. Use AFTER submit.

