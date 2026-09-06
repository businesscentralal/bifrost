---
id: documentexchange-unimaze-updatestatus
title: "DocumentExchange.Unimaze.UpdateStatus"
sidebar_label: "DocumentExchange.Unimaze.UpdateStatus"
sidebar_position: 75
description: "Request and response contract for the DocumentExchange.Unimaze.UpdateStatus Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Changes the delivery status of a received document. Typically used to mark a document
as "delivered" (processed) after importing it into BC.

## Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messageId | string | **Yes** | Document message ID (from GetUnread/GetInbox) |
| status | integer or string | **Yes** | Target status — see Partner Differences below |
| comment | string | No | Optional comment added to the document log |

## Partner Differences
The `status` parameter accepts different values depending on the active partner:

### Advania (integer status IDs)
| Value | Meaning | When to use |
|-------|---------|-------------|
| 3 | ssDelivered | Document successfully imported into BC |
| 4 | ssError | Processing failed — will be retried |
| 20 | ssInProcess | Document is being reviewed |
| 21 | ssApproved | Document approved by receiver |
| 22 | ssDenied | Document rejected by receiver |
| 23 | ssPaid | Invoice has been paid |

Use `DocumentExchange.GetStatuses` to get the full list (only `receiver_can_use=Y` statuses are settable).

### Unimaze (text status names)
| Value | Meaning | When to use |
|-------|---------|-------------|
| delivered | Delivered | Document received and processed |
| imported | Imported | Document imported into ERP |
| failed | Failed | Processing failed |

## Response
```json
{ "successful": true }
```

## Workflow
1. Retrieve document: `GetDocument { "messageId": "<id>", "createIncomingDocument": true }`
2. Verify import succeeded (check incomingDocumentEntryNo in response)
3. Mark as delivered: `UpdateStatus { "messageId": "<id>", "status": 3, "comment": "Imported to BC" }`
4. Document is removed from GetUnread results after status change

## Important
- Only call UpdateStatus AFTER confirming the document was processed successfully
- If processing fails, either skip (leave unread for retry) or set status to failed/error
- The `comment` field is written to the document history log (visible via GetDocumentHistory)

