---
id: llm-prompt-complete
title: "LLM.Prompt.Complete"
sidebar_label: "LLM.Prompt.Complete"
sidebar_position: 1
description: "Request and response contract for the LLM.Prompt.Complete Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
One-shot LLM completion. Sends a system prompt and user prompt to the configured provider and returns the text response. No tools are injected, no chat Bootstrap is applied, and no conversation state is returned.

This is the **general-purpose compute step** for playbooks and scheduled tasks. Use it whenever a pipeline needs reasoning, transformation, or generation that no standard message type covers:
- **Date/time computation**: "What are the start and end dates for last month?"
- **Data comparison**: "Does address A match address B?" → Yes/No
- **Data transformation**: Compare structured data from prior steps → JSON update commands
- **Text generation**: Generate SMS, email body, or notification text from step data
- **Report formatting**: Format workspace data as HTML, Markdown, or plain text
- **Data extraction**: Extract fields from unstructured text, PDF content, or base64-encoded images
- **Translation**: Translate text to a target language
- **Classification**: Categorize input into predefined buckets
- **Decision routing**: "Should this customer get a reminder or collection notice?" based on aging data
- **Data enrichment**: Validate/normalize phone numbers, classify document types from OCR text
- **Filter generation**: Produce tableView filter strings or date ranges for subsequent Data.Records.Get steps
- **Format conversion**: Convert flat CSV/text to primaryKey/fields JSON for Data.Records.Set
- **Summarization**: Weekly sales summary, batch processing report, or error digest from prior step output

**Key principle**: When building a playbook, if there is no standard message type for a step, use `LLM.Prompt.Complete` as the glue. It bridges any gap between structured data steps.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| prompt | Text | Yes | The user prompt — the task or question for the model |
| system | Text | No | System prompt that guides the model behavior. This is sent as-is — no Bootstrap or skill is injected. |
| roleCode | Code[20] | No | Bifrost Language Model code to use. Omit to use the caller's configured or default language model. |
| file | Object | No | An inline file to send with the prompt: `{ "data": "<base64>", "mimeType": "image/png", "fileName": "invoice.png" }`. Passed to the provider as-is. Takes precedence over `attachment`. |
| attachment | Object | No | A file already stored in Business Central: `{ "table": "Incoming Document Attachment" \| "Document Attachment", "systemId": "<guid>" }`. The content is read, base64-encoded and the MIME type derived from the file extension. Ignored if `file` is supplied, or if the record is not found. |

Not every provider accepts files — Copilot rejects them.

## Request Example
```json
{
  "prompt": "Extract the invoice number, date, and total from the following text:\n\nInvoice #4521\nDate: 2025-03-15\nTotal: $1,250.00",
  "system": "Extract structured data from text. Return valid JSON with keys: invoiceNo, date, total.",
  "roleCode": "CLAUDE"
}
```

### Playbook Examples

**Date computation** (e.g. for filtering records by last month):
```json
{
  "system": "Return ONLY a JSON object with startDate and endDate in YYYY-MM-DD format. No explanation.",
  "prompt": "Today is 2026-08-30. What are the first and last day of last month?"
}
```
→ `{"startDate":"2026-07-01","endDate":"2026-07-31"}`

**Error notification SMS** (from playbook CUST-KT-SYNC step 12):
```json
{
  "roleCode": "KAPPI",
  "system": "Write a single SMS in Icelandic. Max 160 chars. No greeting. Return ONLY the SMS text.",
  "prompt": "Playbook CUST-KT-SYNC failed. Step 10 error: could not read customer records."
}
```

**Data comparison with workspace refs** (step references prior step outputs via @stepNo):
```json
{
  "system": "Compare two addresses. Answer ONLY Yes or No.",
  "prompt": "BC: @_current.fields.Address, @_current.fields.PostCode @_current.fields.City\\nRegistry: @30.@_iter.street, @30.@_iter.postCode @30.@_iter.city"
}
```

**Structured output from multi-step data** (LLM generates JSON update commands):
```json
{
  "system": "Compare BC addresses with registry. Return ONLY a JSON array of records to update. No explanation.",
  "prompt": "@10,20,30"
}
```
→ Output is fed directly to a subsequent `Data.Records.Set` step.

**Document classification** (classify incoming document from OCR/PDF text):
```json
{
  "system": "Classify the document. Return ONLY one of: Invoice, CreditMemo, DeliveryNote, PurchaseOrder, Unknown.",
  "prompt": "@10.text"
}
```

**Decision routing** (determine action based on customer aging data):
```json
{
  "system": "Given customer balance and overdue days, return ONLY a JSON object: {action, reason}. Actions: Reminder, CollectionNotice, InternalEscalation, NoAction.",
  "prompt": "Customer 10000, balance 450000 ISK, 95 days overdue, 2 previous reminders sent."
}
```

**Generate tableView filter** (compute dynamic filter for the next Data.Records.Get step):
```json
{
  "system": "Return ONLY a BC tableView filter string. No explanation.",
  "prompt": "Today is 2026-08-30. Filter Sales Invoice Header where Posting Date is in the previous fiscal quarter (April-June 2026) and Sell-to Customer No. starts with 1."
}
```
→ `WHERE(Posting Date=FILTER(2026-04-01..2026-06-30),Sell-to Customer No.=FILTER(1*))`

**Weekly summary email body** (format data from prior step as email HTML):
```json
{
  "system": "Create a professional HTML email body in Icelandic summarizing weekly sales. Use <table> for the data. Return ONLY the HTML.",
  "prompt": "@10"
}
```

**Extract fields from scanned invoice image** (base64 image from prior step):
```json
{
  "system": "Extract invoice fields from the image. Return JSON: {vendorName, invoiceNo, date, totalAmount, currency}.",
  "prompt": "Extract from this invoice: @10.base64Image"
}
```

**Payment reminder in Icelandic** (compose from customer balance data):
```json
{
  "system": "Write a polite payment reminder in Icelandic. Include amount and due date. Max 500 chars. Return ONLY the text.",
  "prompt": "Customer: @_current.fields.Name, overdue amount: @10.fields.BalanceDueLCY, oldest due date: @10.fields.OldestDueDate"
}
```

## Response Shape
The provider's response object is returned with `status` and `text` added. `text` is a copy of
the provider's `reply`, so callers can read either. Any other property the provider returns
(token usage, model name) is passed through unchanged.
```json
{
  "status": "Success",
  "reply": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}",
  "text": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}"
}
```

## Difference from the interactive Bifrost Chat
| | LLM.Prompt.Complete | Bifrost Chat (FactBox / Chat Focus) |
|---|---|---|
| Tools | None | Full MCP tool server |
| System prompt | Caller's `system` only | Bootstrap + identity + language model skill |
| Record context | None | The record the chat was opened from |
| Conversation state | None | Kept for the session, multi-turn |
| Use case | Playbooks, scheduled tasks | Interactive chat |

## Provider Resolution
1. If `roleCode` is supplied, uses that language model directly. An unknown code is an error —
   it does not fall through to the steps below.
2. Otherwise reads Bifrost Language Model Code from the user's Bifrost User Setup
3. Falls back to the default language model (where Default = true)

## Access
The caller needs the `BIFROST Chat ori` permission set (write permission on the Chat Gate).
`BIFROST Bragi ori` alone is not enough — the chat gate is assigned explicitly.

## Errors
All errors are returned as `status: Error` with an `error` message; never as an HTTP failure.

| Condition | Message |
|-----------|---------|
| Caller lacks the chat permission set | LLM prompt denied: missing 'Bifrost Chat' permission set. |
| No `prompt` supplied | The "prompt" field is required. |
| `roleCode` not found | Bifrost Language Model "X" not found. |
| No provider configured | No chat provider configured. Set up a Bifrost Language Model with a Chat Provider. |
| Provider error (including Copilot not enabled, or a file sent to Copilot) | Error detail from the provider |

