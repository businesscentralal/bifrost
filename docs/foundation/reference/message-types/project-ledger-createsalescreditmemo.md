---
id: project-ledger-createsalescreditmemo
title: "Project.Ledger.CreateSalesCreditMemo"
sidebar_label: "Project.Ledger.CreateSalesCreditMemo"
sidebar_position: 102
description: "Request and response contract for the Project.Ledger.CreateSalesCreditMemo Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Creates Sales Credit Memo(s) from project (job) planning lines. Uses BC's `Job Create-Invoice` engine (codeunit 1002) in credit memo mode. Only "Contract (Billable)" planning lines with negative `Qty. to Transfer to Invoice` are eligible.

**Direction**: Inbound (creates Sales documents) · **Content-Type**: `text/json`

## Idempotency
**Not idempotent.** Each call creates new Sales Credit Memo documents.

## Identifier Resolution
The project is identified via:
1. `projectNo` field in request JSON (preferred)
2. `subject` field on the Bifrost envelope (fallback)

## Request Parameters

| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `projectNo` | Code[20] | Yes* | (subject) | Project number. Required in JSON or subject. |
| `taskFilter` | Text | No | (all tasks) | Filter on Job Task No. e.g. `1000..2000` |
| `postingDate` | Date | No | WorkDate | Posting date for the credit memo |
| `invoiceDate` | Date | No | postingDate | Document date |
| `createPerProject` | Boolean | No | true | When true, all eligible lines for the project are grouped into a single credit memo. When false, one credit memo is created per Job Task |

## Request Example

```json
{
  "projectNo": "J00010",
  "postingDate": "2026-07-15"
}
```

## Response Format (Success)

```json
{
  "status": "Success",
  "projectNo": "J00010",
  "postingDate": "2026-07-15",
  "documentDate": "2026-07-15",
  "createdDocuments": [
    {
      "type": "Credit Memo",
      "no": "SCM-1001",
      "customerNo": "C10000",
      "customerName": "Contoso Ltd.",
      "lineCount": 2,
      "amount": -1500.00,
      "amountIncludingVAT": -1860.00
    }
  ],
  "excludedLines": []
}
```

`excludedLines` lists every eligible planning line that was not transferred to a credit memo, with the reason it was skipped (e.g. G/L Account lines cannot be placed on a sales document). Always empty on a fully successful run.

## Response Format (Error)

```json
{
  "status": "Error",
  "error": "Project J99999 not found.",
  "callstack": "..."
}
```

## Posting Gate
Requires the `BIFROST Job Post ori` permission set assigned to the calling user.

## Errors

| Condition | Error message |
|---|---|
| Missing permission set | Posting denied: missing 'BIFROST Job Post ori' permission set. |
| Project not found | Project &#123;no&#125; not found. |
| No eligible lines | No billable planning lines found for project &#123;no&#125; with the specified filters. |
| BC validation failure | (BC error text + callstack) |

## Credit Memo Line Selection
Only Job Planning Lines where:
- `Contract Line` = true
- `Qty. to Transfer to Invoice` &lt; 0 (negative = credit direction)

## Post-Creation
The created Sales Credit Memo is in draft state. To post it, use `Sales.Document.Post` with the returned document number.

## Related Message Types
- `Project.Ledger.CreateSalesInvoice` — creates invoices from project planning lines
- `Projects.ProjectJournal.Post` — posts project journal batches
- `Sales.Document.Post` — posts the created credit memo

