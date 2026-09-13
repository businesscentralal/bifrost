---
id: iceland-vat-receipt
title: "Iceland.VAT.Receipt"
sidebar_label: "Iceland.VAT.Receipt"
sidebar_position: 68
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.Receipt Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar PDF receipt frá a submitted VAT period. **Local operation Aðeins** — does NOT Kallaðu á RSK.

**Stefna:** Local
**RSK Operation:** None (reads frá stored Media Reitur)

## Lifecycle position
```
... → Submit → [Submitted] → **Receipt** (returns stored PDF)
```

## State gates
| Current Status | Behavior |
|---|---|
| Open | **Error** — not yet submitted |
| Validated | **Error** — not yet submitted |
| Submitted | Skilar stored PDF receipt as base64 |
| Reversed | **Error** — looks fyrir the non-reversed Submitted færsla instead |

## Behavior
1. Finds the period færsla með Status = Submitted (non-reversed) fyrir the given VSK/Year/Period.
2. Reads the PDF Receipt Media Reitur.
3. Skilar base64-encoded PDF content.

## Beiðni
```json
{
  "vat": {
    "vskNumer": "123456",
    "ar": 2026,
    "timabil": "01"
  }
}
```
Allt three fields eru **nauðsynlegt**.

## Svar
```json
{
  "vskNumber": "123456",
  "year": 2026,
  "period": "01",
  "revisionNo": 1,
  "pdf": "<base64-encoded PDF content>"
}
```

## Agent playbook
1. **Prerequisite:** Period verður að have been submitted með góðum árangri (Status = Submitted).
2. The PDF was stored during the Submit operation — this just reads it frá the database.
3. Decode the base64 `pdf` Reitur til Sækja the actual PDF file content.
4. Ef multiple revisions exist, this Skilar receipt frá the Submitted (non-reversed) one.
5. Submit does NOT include the PDF in its Svar — always Notaðu this Endapunktur til Sækja it.

## Errors
- No Submitted period found → error (submit first).
- PDF Receipt er empty → error (RSK did not Gefðu upp a receipt during submission).


