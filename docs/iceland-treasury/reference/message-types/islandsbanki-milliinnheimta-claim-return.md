---
id: islandsbanki-milliinnheimta-claim-return
title: "Islandsbanki.Milliinnheimta.Claim.Return"
sidebar_label: "Islandsbanki.Milliinnheimta.Claim.Return"
sidebar_position: 51
description: "Request and response contract for the Islandsbanki.Milliinnheimta.Claim.Return Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns a claim from intermediary collection (SkilaKrofu on milliinnheimta.asmx).

**Direction:** Outbound  
**Content-Type:** text/json  
**Access:** Gated — requires the `Isb Claim Gate` permission set.

## Request
Supply a `claim` object identifying the claim (same Krafa shape as Claim.Create / Claim.Cancel).
```json
{ "claim": { "kennitalaKrofuhafa": "1234567890", "bankanumer": 515, "hofudbok": 66,
             "krofunumer": 1001, "gjalddagi": "2026-05-01", "nidurfellingardagur": "2026-08-01",
             "kennitalaGreidanda": "0987654321", "upphaed": 25000.00, "tilvisun": "INV-1001",
             "eindagi": "2026-05-15" } }
```

## Response
```json
{ "status": "Success", "logEntryNo": 62 }
```

