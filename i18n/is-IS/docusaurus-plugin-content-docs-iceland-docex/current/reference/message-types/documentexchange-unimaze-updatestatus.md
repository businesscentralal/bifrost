---
id: documentexchange-unimaze-updatestatus
title: "DocumentExchange.Unimaze.UpdateStatus"
sidebar_label: "DocumentExchange.Unimaze.UpdateStatus"
sidebar_position: 75
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Unimaze.UpdateStatus Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Changes the delivery status of a received skjal. Typically used til mark a skjal
as "delivered" (processed) eftir importing it í BC.

## Beiðni
| Reitur | Gerð | nauðsynlegt | Lýsing |
|-------|------|----------|-------------|
| messageId | string | **Yes** | skjal message ID (frá GetUnread/GetInbox) |
| status | integer eða string | **Yes** | Target status — see Partner Differences below |
| comment | string | No | valfrjálst comment added til the skjal log |

## Partner Differences
The `status` parameter accepts different values depending on the active partner:

### Advania (integer status IDs)
| Value | Meaning | Þegar til Notaðu |
|-------|---------|-------------|
| 3 | ssDelivered | skjal með góðum árangri imported í BC |
| 4 | ssError | Processing failed — mun be retried |
| 20 | ssInProcess | skjal er being reviewed |
| 21 | ssApproved | skjal approved by receiver |
| 22 | ssDenied | skjal rejected by receiver |
| 23 | ssPaid | Invoice has been paid |

Notaðu `DocumentExchange.GetStatuses` til Sækja the fulla Listi (Aðeins `receiver_can_use=Y` statuses eru settable).

### Unimaze (text status names)
| Value | Meaning | Þegar til Notaðu |
|-------|---------|-------------|
| delivered | Delivered | skjal received og processed |
| imported | Imported | skjal imported í ERP |
| failed | Failed | Processing failed |

## Svar
```json
{ "successful": true }
```

## Verkflæði
1. Retrieve skjal: `GetDocument { "messageId": "<id>", "createIncomingDocument": true }`
2. Verify import succeeded (check incomingDocumentEntryNo in Svar)
3. Mark as delivered: `UpdateStatus { "messageId": "<id>", "status": 3, "comment": "Imported to BC" }`
4. skjal er removed frá GetUnread results eftir status change

## Important
- Aðeins Kallaðu á UpdateStatus eftir confirming the skjal was processed með góðum árangri
- Ef processing fails, either skip (leave unread fyrir retry) eða set status til failed/error
- The `comment` Reitur er written til the skjal history log (visible via GetDocumentHistory)


