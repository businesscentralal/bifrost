---
id: project-ledger-createsalesinvoice
title: "Project.Ledger.CreateSalesInvoice"
sidebar_label: "Project.Ledger.CreateSalesInvoice"
sidebar_position: 103
description: "Request and response contract for the Project.Ledger.CreateSalesInvoice Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates Sales Invoice(s) from billable project (job) planning lines. Wraps BC's `Job Create-Invoice` engine (codeunit 1002). Only "Contract (Billable)" planning lines with positive `Qty. to Transfer to Invoice` are eligible.

**Direction**: Inbound (creates Sales documents) · **Content-Type**: `text/json`

## Idempotency
**Not idempotent.** Each call creates new Sales Invoice documents. Repeated calls with the same parameters will create duplicate invoices (unless all billable lines have already been invoiced).

## Identifier Resolution
The project is identified via:
1. `projectNo` field in request JSON (preferred)
2. `subject` field on the Bifrost envelope (fallback)

## Request Parameters

| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `projectNo` | Code[20] | Yes* | (subject) | Project number. Required in JSON or subject. |
| `taskFilter` | Text | No | (all tasks) | Filter on Job Task No. e.g. `1000..2000` |
| `postingDate` | Date | No | WorkDate | Posting date for the invoice |
| `invoiceDate` | Date | No | postingDate | Document date |
| `createPerProject` | Boolean | No | true | When true, all billable lines for the project are grouped into a single invoice. When false, one invoice is created per Job Task |

## Request Example

```json
{
  "projectNo": "J00010",
  "taskFilter": "1000..2000",
  "postingDate": "2026-07-15",
  "createPerProject": true
}
```

## Response Format (Success)

```json
{
  "status": "Success",
  "projectNo": "J00010",
  "postingDate": "2026-07-15",
  "invoiceDate": "2026-07-15",
  "createdDocuments": [
    {
      "type": "Invoice",
      "no": "SI-1001",
      "customerNo": "C10000",
      "customerName": "Contoso Ltd.",
      "lineCount": 3,
      "amount": 5000.00,
      "amountIncludingVAT": 6200.00
    }
  ],
  "excludedLines": [
    {
      "jobTaskNo": "3000",
      "lineNo": 10000,
      "type": "G/L Account",
      "no": "2120",
      "description": "Purchases",
      "quantity": 1,
      "lineAmount": 286000.00,
      "reason": "G/L Account lines cannot be included on a sales document."
    }
  ]
}
```

`excludedLines` lists every billable planning line that matched the selection filters but was not transferred to an invoice, with the reason it was skipped. Always empty on a fully successful run.

## Response Format (Error)

```json
{
  "status": "Error",
  "error": "Project J99999 not found.",
  "callstack": "..."
}
```

## Posting Gate
Requires the `BIFROST Job Post ori` permission set assigned to the calling user. Without it, the message returns a "Posting denied" error without processing.

## Errors

| Condition | Error message |
|---|---|
| Missing permission set | Posting denied: missing 'BIFROST Job Post ori' permission set. |
| Project not found | Project &#123;no&#125; not found. |
| No billable lines | No billable planning lines found for project &#123;no&#125; with the specified filters. |
| BC validation failure | (BC error text + callstack) |

## Billable Line Selection
Only Job Planning Lines where:
- `Contract Line` = true (Line Type is Billable or Both Budget and Billable)
- `Qty. to Transfer to Invoice` > 0

Lines already fully invoiced are automatically excluded by BC's engine.

Lines with `Type` = G/L Account cannot be placed on a sales document (BC limitation) and are reported in `excludedLines` instead of being silently dropped.

## Post-Creation
The created Sales Invoice is in draft state (not posted). To post it, use `Sales.Document.Post` with the returned document number.

## Related Message Types
- `Project.Ledger.CreateSalesCreditMemo` — creates credit memos from project planning lines
- `Projects.ProjectJournal.Post` — posts project journal batches
- `Sales.Document.Post` — posts the created invoice

