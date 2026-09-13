---
id: project-ledger-createsalescreditmemo
title: "Project.Ledger.CreateSalesCreditMemo"
sidebar_label: "Project.Ledger.CreateSalesCreditMemo"
sidebar_position: 102
description: "Beiðni- og svarsamningur fyrir Project.Ledger.CreateSalesCreditMemo Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Býr til Sales Credit Memo(s) úr project (job) planning lines. Uses BC's `Job Create-Invoice` engine (codeunit 1002) in credit memo mode. aðeins "Contract (Billable)" planning lines með negative `Qty. to Transfer to Invoice` eru eligible.

**Stefna**: Innkomandi (Býr til Sales skjöl) · **Efnisgerð**: `text/json`

## Idempotency
**ekki endurtekningarþolið.** hver call Býr til ný Sales Credit Memo skjöl.

## Identifier Resolution
The project er identified via:
1. `projectNo` Reitur in request JSON (preferred)
2. `subject` Reitur on the Bifrost envelope (fallback)

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Sjálfgefið | Athugasemdir |
|---|---|---|---|---|
| `projectNo` | Code[20] | Yes* | (subject) | Project númer. áskilið in JSON eða subject. |
| `taskFilter` | Text | No | (all tasks) | Filter on Job Task No. e.g. `1000..2000` |
| `postingDate` | dagsetning | No | WorkDate | Posting dagsetning fyrir the credit memo |
| `invoiceDate` | dagsetning | No | postingDate | skjal dagsetning |
| `createPerProject` | sanngildi | No | true | þegar true, all eligible lines fyrir the project eru grouped í a single credit memo. þegar false, one credit memo er created per Job Task |

## Dæmi um beiðni

```json
{
  "projectNo": "J00010",
  "postingDate": "2026-07-15"
}
```

## Response Format (Tókst)

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

`excludedLines` Sýnir lista yfir every eligible planning line that was ekki transferred til a credit memo, með the reason it was skipped (e.g. G/L Account lines getur ekki be placed on a sales skjal). Always empty on a fully tókst run.

## Response Format (Villa)

```json
{
  "status": "Error",
  "error": "Project J99999 not found.",
  "callstack": "..."
}
```

## Bókunarheimild
Requires the `BIFROST Job Post ori` heimild set assigned til the calling user.

## Villur

| Condition | Villa message |
|---|---|
| vantar heimild set | Posting denied: vantar 'BIFROST Job Post ori' heimild set. |
| Project fannst ekki | Project &#123;no&#125; fannst ekki. |
| No eligible lines | No billable planning lines fannst fyrir project &#123;no&#125; með the specified filters. |
| BC validation Mistókst | (BC Villa text + callstack) |

## Credit Memo Line Selection
aðeins Job Planning Lines where:
- `Contract Line` = true
- `Qty. to Transfer to Invoice` &lt; 0 (negative = credit Stefna)

## Post-Creation
The created Sales Credit Memo er in draft state. til post it, nota `Sales.Document.Post` með the returned skjal númer.

## Tengdar skilaboðategundir
- `Project.Ledger.CreateSalesInvoice` — Býr til reikningar úr project planning lines
- `Projects.ProjectJournal.Post` — Bókar project dagbók batches
- `Sales.Document.Post` — Bókar the created credit memo

