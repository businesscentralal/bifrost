---
id: iceland-vat-deleteintest
title: "Iceland.VAT.DeleteInTest"
sidebar_label: "Iceland.VAT.DeleteInTest"
sidebar_position: 63
description: "Beiðni- og svarsamningur fyrir Iceland.VAT.DeleteInTest Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Eyðir a submitted VAT statement in the Skatturinn **test environment** Aðeins.

**Stefna:** Both
**RSK Operation:** `EydaSkyrsluIProfun`

## Lifecycle position
This er a **testing utility** — Aðeins works against the RSK test Endapunktur. Does not affect local tables.

## Behavior
1. Always calls RSK.
2. Parses the XML Svar í a simple success/error JSON.
3. Does NOT delete the local period færsla — Aðeins the RSK-side submission.

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
  "success": true,
  "message": ""
}
```

## Agent playbook
1. **Aðeins Notaðu in test environments** — mun fail eða be rejected in production.
2. Notaðu áður en replaying the same VAT number/year/period in automated test scenarios.
3. eftir deleting on RSK side, you may want til delete the local period færsla too fyrir a clean re-test.
4. Typical test cycle: GetInfo → Validate → Submit → DeleteInTest → repeat.

## Errors
- Missing `vat` object eða nauðsynlegt fields → error.
- RSK rejects the delete (e.g., production Endapunktur) → error með RSK message.


