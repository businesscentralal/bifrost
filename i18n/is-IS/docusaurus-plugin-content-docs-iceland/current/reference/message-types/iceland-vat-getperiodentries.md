---
id: iceland-vat-getperiodentries
title: "Iceland.VAT.GetPeriodEntries"
sidebar_label: "Iceland.VAT.GetPeriodEntries"
sidebar_position: 66
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.GetPeriodEntries Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir VAT period entries directly frá Skatturinn. **Read-Aðeins** — never writes til local tables.

**Stefna:** Outbound
**RSK Operation:** `NaIFaerslurTimabils`

## Lifecycle position
This er a **utility/lookup** operation — it does not participate in the VAT lifecycle state machine.
Notaðu it til inspect what RSK has on file without affecting local færslur.

## Behavior
1. Always calls RSK (no caching, no local writes).
2. Parses the XML Svar í structured JSON entries.
3. Skilar entries as a flat JSON array.

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
  "entries": [
    { "entryType": "VSK01", "level": "", "categoryId": "1", "description": "Skattskyld velta", "amount": 500000 },
    { "entryType": "VSK02", "level": "", "categoryId": "2", "description": "Útskattur", "amount": 120000 }
  ]
}
```

## Agent playbook
1. Notaðu this til **compare** what RSK has vs. what er stored locally eftir GetInfo.
2. Ef you need til populate local tables, Notaðu `Iceland.VAT.GetInfo` instead.
3. Useful fyrir reconciliation eða debugging discrepancies áður en Validate.
4. This er the Aðeins VAT Fyrirspurn operation that does NOT require `KerfiUtgafa` registration — it works immediately.

## Error Svar
On failure, Skilar a structured error instead of throwing:
```json
{
  "success": false,
  "rskStatusCode": 999,
  "error": "<RSK error message>"
}
```

## Errors
- Missing `vat` object eða nauðsynlegt fields → error.
- RSK SOAP fault → returned as structured error með details.
- HTTP non-200 → Skilar `success: false` með `httpStatus` og `error` fields.

## Troubleshooting
- Þessi aðgerð does NOT send `KerfiUtgafa` — Notaðu it til verify basic RSK connectivity.
- An empty `entries` array með no error means the period has no data at RSK (valid fyrir future/unused periods).
- Check Beiðnin Log (table Beiðni Log ori, LogType=VAT, Operation=NaIFaerslurTimabils) fyrir diagnostics.


