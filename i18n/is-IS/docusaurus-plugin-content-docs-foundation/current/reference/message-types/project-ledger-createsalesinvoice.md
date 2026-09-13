---
id: project-ledger-createsalesinvoice
title: "Project.Ledger.CreateSalesInvoice"
sidebar_label: "Project.Ledger.CreateSalesInvoice"
sidebar_position: 103
description: "Beiðni- og svarsamningur fyrir Project.Ledger.CreateSalesInvoice Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til Sales reikningur(s) úr billable project (job) planning lines. Wraps BC's `Job Create-Invoice` engine (codeunit 1002). aðeins "Contract (Billable)" planning lines með positive `Qty. to Transfer to Invoice` eru eligible.

**Stefna**: Innkomandi (Býr til Sales skjöl) · **Efnisgerð**: `text/json`

## Idempotency
**ekki endurtekningarþolið.** hver call Býr til ný Sales reikningur skjöl. Repeated calls með the sama parameters mun create duplicate reikningar (unless all billable lines have already been invoiced).

## Identifier Resolution
The project er identified via:
1. `projectNo` Reitur in request JSON (preferred)
2. `subject` Reitur on the Bifrost envelope (fallback)

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Sjálfgefið | Athugasemdir |
|---|---|---|---|---|
| `projectNo` | Code[20] | Yes* | (subject) | Project númer. áskilið in JSON eða subject. |
| `taskFilter` | Text | No | (all tasks) | Filter on Job Task No. e.g. `1000..2000` |
| `postingDate` | dagsetning | No | WorkDate | Posting dagsetning fyrir the reikningur |
| `invoiceDate` | dagsetning | No | postingDate | skjal dagsetning |
| `createPerProject` | sanngildi | No | true | þegar true, all billable lines fyrir the project eru grouped í a single reikningur. þegar false, one reikningur er created per Job Task |

## Dæmi um beiðni

```json
{
  "projectNo": "J00010",
  "taskFilter": "1000..2000",
  "postingDate": "2026-07-15",
  "createPerProject": true
}
```

## Response Format (Tókst)

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

`excludedLines` Sýnir lista yfir every billable planning line that matched the selection filters but was ekki transferred til an reikningur, með the reason it was skipped. Always empty on a fully tókst run.

## Response Format (Villa)

```json
{
  "status": "Error",
  "error": "Project J99999 not found.",
  "callstack": "..."
}
```

## Bókunarheimild
Requires the `BIFROST Job Post ori` heimild set assigned til the calling user. án it, the message Skilar a "Posting denied" Villa án processing.

## Villur

| Condition | Villa message |
|---|---|
| vantar heimild set | Posting denied: vantar 'BIFROST Job Post ori' heimild set. |
| Project fannst ekki | Project &#123;no&#125; fannst ekki. |
| No billable lines | No billable planning lines fannst fyrir project &#123;no&#125; með the specified filters. |
| BC validation Mistókst | (BC Villa text + callstack) |

## Billable Line Selection
aðeins Job Planning Lines where:
- `Contract Line` = true (Line Gerð er Billable eða Both Budget og Billable)
- `Qty. to Transfer to Invoice` > 0

Lines already fully invoiced eru automatically excluded með BC's engine.

Lines með `Type` = G/L Account getur ekki be placed on a sales skjal (BC limitation) og eru reported in `excludedLines` instead of being silently dropped.

## Post-Creation
The created Sales reikningur er in draft state (ekki posted). til post it, nota `Sales.Document.Post` með the returned skjal númer.

## Tengdar skilaboðategundir
- `Project.Ledger.CreateSalesCreditMemo` — Býr til credit memos úr project planning lines
- `Projects.ProjectJournal.Post` — Bókar project dagbók batches
- `Sales.Document.Post` — Bókar the created reikningur

