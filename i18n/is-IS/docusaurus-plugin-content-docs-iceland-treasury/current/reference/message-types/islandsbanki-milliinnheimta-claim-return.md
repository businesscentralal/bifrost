---
id: islandsbanki-milliinnheimta-claim-return
title: "Islandsbanki.Milliinnheimta.Claim.Return"
sidebar_label: "Islandsbanki.Milliinnheimta.Claim.Return"
sidebar_position: 51
description: "Beiðni- og svarsamningur fyrir Islandsbanki.Milliinnheimta.Claim.Return Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar a claim frá intermediary collection (SkilaKrofu on milliinnheimta.asmx).

**Stefna:** Outbound  
**Efnisgerð:** text/json  
**Access:** Gated — requires the `Isb Claim Gate` permission set.

## Beiðni
Supply a `claim` object identifying the claim (same Krafa shape as Claim.Create / Claim.Cancel).
```json
{ "claim": { "kennitalaKrofuhafa": "1234567890", "bankanumer": 515, "hofudbok": 66,
             "krofunumer": 1001, "gjalddagi": "2026-05-01", "nidurfellingardagur": "2026-08-01",
             "kennitalaGreidanda": "0987654321", "upphaed": 25000.00, "tilvisun": "INV-1001",
             "eindagi": "2026-05-15" } }
```

## Svar
```json
{ "status": "Success", "logEntryNo": 62 }
```


