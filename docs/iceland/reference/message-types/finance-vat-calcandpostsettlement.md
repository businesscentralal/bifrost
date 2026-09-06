---
id: finance-vat-calcandpostsettlement
title: "Finance.VAT.CalcAndPostSettlement"
sidebar_label: "Finance.VAT.CalcAndPostSettlement"
sidebar_position: 1
description: "Request and response contract for the Finance.VAT.CalcAndPostSettlement Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Runs Report 20 "Calc. and Post VAT Settlement" to close open VAT entries for a period.
After posting, VAT entries are marked Closed and filtered in the VAT Statement.

**Direction:** Inbound (posts G/L entries)

## Role in VAT Return Workflow
```
Post transactions → **CalcAndPostSettlement** → VATStatement.Preview → Map to RSK → Validate → Submit
```
This MUST be called before VATStatement.Preview with selection "Closed".
It settles ALL open VAT entries in the date range.

## Request
```json
{
  "startingDate": "2026-03-01",
  "endingDate": "2026-04-30",
  "postingDate": "2026-04-30",
  "documentNo": "VSK-P16-SETTL",
  "settlementAccountNo": "5610"
}
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| startingDate | Yes | Period start (use GetInfo startDate) |
| endingDate | Yes | Period end (use GetInfo endDate) |
| postingDate | Yes | Posting date for settlement G/L entry |
| documentNo | Yes | Document number for the settlement |
| settlementAccountNo | Yes | G/L Account for net VAT balance (e.g. "5610") |

## Response
```json
{
  "status": "Success",
  "posted": true,
  "glRegisterNo": 1099,
  "fromVATEntryNo": 574,
  "toVATEntryNo": 580
}
```

## Agent Playbook
1. Post all sales/purchase transactions for the period first.
2. Call this to close the VAT entries. Use the period dates from GetInfo.
3. Then call `Finance.VATStatement.Preview` with `selection: "Closed"` to get amounts.
4. For correction workflows: post additional transactions, then call this AGAIN for the same period.
   Only the NEW (still open) entries will be settled.

