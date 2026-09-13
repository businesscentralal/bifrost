---
id: llm-prompt-complete
title: "LLM.Prompt.Complete"
sidebar_label: "LLM.Prompt.Complete"
sidebar_position: 1
description: "Request and response contract for the LLM.Prompt.Complete Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit
One-shot LLM completion. Sendir a system prompt og notandi prompt to the stillt provider og returns the text response. No tools eru injected, no chat Bootstrap er applied, og no conversation state er returned.

This er the **general-purpose compute step** fyrir playbooks og scheduled verkþættir. Notaðu it whenever a pipelína needs reasoning, transformation, eða generation that no standard message tegund covers:
- **Date/time computation**: "What eru the start og end dagsetnings fyrir last month?"
- **Data comparison**: "Does address A match address B?" → Yes/No
- **Data transformation**: Compare structured data úr prior steps → JSON updagsetning commands
- **Text generation**: Generate SMS, email body, eða notification text úr step data
- **Report formatting**: Format vinnusvæði data as HTML, Markdown, eða plain text
- **Data extraction**: Extract fields úr unstructured text, PDF innihald, eða base64-enkóðid images
- **Translation**: Translate text to a target language
- **Classification**: Categorize input í predefined buckets
- **Decision routing**: "Should this viðskiptavinur get a reminder eða collection notice?" based on aging data
- **Data enrichment**: Validagsetning/normalize phone numbers, classify skjal tegunds úr OCR text
- **Filter generation**: Produce tableView filter strings eða dagsetning ranges fyrir subsequent Data.Records.Get steps
- **Format conversion**: Convert flat CSV/text to primaryKey/fields JSON fyrir Data.Records.Stilltu
- **Summarization**: Weekly sales summary, batch processing report, eða villa digest úr prior step output

**Key principle**: When building a playbook, ef there er no standard message tegund fyrir a step, use `LLM.Prompt.Complete` as the glue. It bridges any gap between structured data steps.

## Stefna
Út á við

## Svar Content Type
`text/json`

## Færibreytur beiðni
| Field | Type | Nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| prompt | Text | Yes | The notandi prompt — the verkþáttur eða question fyrir the model |
| system | Text | No | System prompt that guides the model behavior. This er sent as-is — no Bootstrap eða skill er injected. |
| roleCode | Code[20] | No | Bifrost Language Model kóði til notkunar. Sleppið til notkunar the caller's stillt eða sjálfgefið language model. |
| skrá | Object | No | An inlína skrá to send með the prompt: `{ "data": "<base64>", "mimeType": "image/png", "fileName": "invoice.png" }`. Sendued to the provider as-is. Takes precedence over `attachment`. |
| attachment | Object | No | A skrá already stored in Business Central: `{ "table": "Incoming Document Attachment" \| "Document Attachment", "systemId": "<guid>" }`. The innihald er read, base64-enkóðid og the MIME tegund derived úr the skrá extension. Ignored ef `file` er supplied, eða ef the færsla er fannst ekki. |

Not every provider accepts skrár — Copilot rejects them.

## Dæmi um beiðni
```json
{
  "prompt": "Extract the invoice number, date, and total from the following text:\n\nInvoice #4521\nDate: 2025-03-15\nTotal: $1,250.00",
  "system": "Extract structured data from text. Return valid JSON with keys: invoiceNo, date, total.",
  "roleCode": "CLAUDE"
}
```

### Dæmi um keðjur

**Date computation** (e.g. fyrir filtering færslur by last month):
```json
{
  "system": "Return ONLY a JSON object with startDate and endDate in YYYY-MM-DD format. No explanation.",
  "prompt": "Today is 2026-08-30. What are the first and last day of last month?"
}
```
→ `{"startDate":"2026-07-01","endDate":"2026-07-31"}`

**Villa notification SMS** (from playbook CUST-KT-SYNC step 12):
```json
{
  "roleCode": "KAPPI",
  "system": "Write a single SMS in Icelandic. Max 160 chars. No greeting. Return ONLY the SMS text.",
  "prompt": "Playbook CUST-KT-SYNC failed. Step 10 error: could not read customer records."
}
```

**Data comparison með vinnusvæði refs** (step references prior step outputs via @stepNo):
```json
{
  "system": "Compare two addresses. Answer ONLY Yes or No.",
  "prompt": "BC: @_current.fields.Address, @_current.fields.PostCode @_current.fields.City\\nRegistry: @30.@_iter.street, @30.@_iter.postCode @30.@_iter.city"
}
```

**Structured output úr multi-step data** (LLM generates JSON updagsetning commands):
```json
{
  "system": "Compare BC addresses with registry. Return ONLY a JSON array of records to update. No explanation.",
  "prompt": "@10,20,30"
}
```
→ Output er fed directly to a subsequent `Data.Records.Set` step.

**Document classification** (classify incoming skjal úr OCR/PDF text):
```json
{
  "system": "Classify the document. Return ONLY one of: Invoice, CreditMemo, DeliveryNote, PurchaseOrder, Unknown.",
  "prompt": "@10.text"
}
```

**Decision routing** (determine action based on viðskiptavinur aging data):
```json
{
  "system": "Given customer balance and overdue days, return ONLY a JSON object: {action, reason}. Actions: Reminder, CollectionNotice, InternalEscalation, NoAction.",
  "prompt": "Customer 10000, balance 450000 ISK, 95 days overdue, 2 previous reminders sent."
}
```

**Generate tableView filter** (compute dynamic filter fyrir the next Data.Records.Get step):
```json
{
  "system": "Return ONLY a BC tableView filter string. No explanation.",
  "prompt": "Today is 2026-08-30. Filter Sales Invoice Header where Posting Date is in the previous fiscal quarter (April-June 2026) and Sell-to Customer No. starts with 1."
}
```
→ `WHERE(Posting Date=FILTER(2026-04-01..2026-06-30),Sell-to Customer No.=FILTER(1*))`

**Weekly summary email body** (format data úr prior step as email HTML):
```json
{
  "system": "Create a professional HTML email body in Icelandic summarizing weekly sales. Use <table> for the data. Return ONLY the HTML.",
  "prompt": "@10"
}
```

**Extract fields úr sgeturned reikningur image** (base64 image úr prior step):
```json
{
  "system": "Extract invoice fields from the image. Return JSON: {vendorName, invoiceNo, date, totalAmount, currency}.",
  "prompt": "Extract from this invoice: @10.base64Image"
}
```

**Payment reminder in Icelandic** (compose úr viðskiptavinur balance data):
```json
{
  "system": "Write a polite payment reminder in Icelandic. Include amount and due date. Max 500 chars. Return ONLY the text.",
  "prompt": "Customer: @_current.fields.Name, overdue amount: @10.fields.BalanceDueLCY, oldest due date: @10.fields.OldestDueDate"
}
```

## Snið svars
The provider's response object er returned með `status` og `text` added. `text` er a copy of
the provider's `reply`, so callers getur read either. Any other property the provider returns
(token usage, model heiti) er passed through unchanged.
```json
{
  "status": "Success",
  "reply": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}",
  "text": "{\"invoiceNo\":\"4521\",\"date\":\"2025-03-15\",\"total\":1250.00}"
}
```

## Munur á gagnvirku Bifröst-spjalli
| | LLM.Prompt.Complete | Bifrost Chat (FactBox / Chat Focus) |
|---|---|---|
| Tools | None | Full MCP tool server |
| System prompt | Kallaðu áer's `system` aðeins | Bootstrap + identity + language model skill |
| Record context | None | The færsla the chat was opened úr |
| Conversation state | None | Kept fyrir the session, multi-turn |
| Notaðu case | Playbooks, scheduled verkþættir | Interactive chat |

## Val þjónustuveitu
1. Ef `roleCode` er supplied, uses that language model directly. An unknown kóði er an villa —
   it gerir ekki fall through to the steps below.
2. Otherwise reads Bifrost Language Model Code úr the notandi's Bifrost Notaður Stilltuup
3. Falls back to the sjálfgefið language model (where Default = true)

## Aðgangur
Kallandinn needs the `BIFROST Chat ori` permission set (write permission on the Chat Gate).
`BIFROST Bragi ori` alone er not enough — the chat gate er assigned explicitly.

## Villas
All villur eru returned as `status: Error` með an `error` message; never as an HTTP failure.

| Skilyrði | Skilaboð |
|-----------|---------|
| Kallaðu áer lacks the chat permission set | LLM prompt denied: missing 'Bifrost Chat' permission set. |
| No `prompt` supplied | The "prompt" field er required. |
| `roleCode` fannst ekki | Bifrost Language Model "X" fannst ekki. |
| No provider stillt | No chat provider stillt. Stilltu up a Bifrost Language Model með a Chat Provider. |
| Provider villa (including Copilot not enabled, eða a skrá sent to Copilot) | Villa detail úr the provider |

