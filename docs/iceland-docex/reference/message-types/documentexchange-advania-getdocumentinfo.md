---
id: documentexchange-advania-getdocumentinfo
title: "DocumentExchange.Advania.GetDocumentInfo"
sidebar_label: "DocumentExchange.Advania.GetDocumentInfo"
sidebar_position: 9
description: "Request and response contract for the DocumentExchange.Advania.GetDocumentInfo Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns all metadata about a document: sender/receiver, dates, amounts, status, and Peppol profile info.

## Request
| Field | Type | Required |
|-------|------|----------|
| messageId | string | **Yes** |

## Response
Single object (not paged). Key fields:
| Field | Type | Description |
|-------|------|-------------|
| uuid | string | Document UUID |
| from_ean, from_name | string | Sender endpoint |
| to_ean, to_name | string | Receiver endpoint |
| standard | string | Standard code (STI, BII, NES2.0, BIS3) |
| transactiontype | string | Transaction type code |
| document_type | string | Invoice, CreditNote, RemittanceAdvice |
| document_id | string | Sender document number |
| status, status_id | string/int | Current status |
| currency | string | ISO currency code |
| payable_amount, base_amount | decimal | Amounts |
| issue_date, due_date, deadline_date | string | Dates YYYY-MM-DD |
| received | datetime | When received by partner system |
| supplier_id, supplier_id_type | string | Supplier tax ID + scheme |
| customer_id, customer_id_type | string | Customer tax ID + scheme |
| real_type | string | Actual root element type |
| peppol_info | array | Peppol profile details (profilecode, documentidentifier, customization_id) |
| sourceidentifier | string | Sender external reference |
| payload_kb | decimal | Document size in KB |

## Workflow
Use GetDocumentInfo to inspect a document before deciding how to process it:
1. Get messageId from GetUnread or GetInbox
2. Call GetDocumentInfo to inspect metadata (sender, type, amount)
3. Based on document_type, route to appropriate processing (Invoice → Purchase, CreditNote → Credit)
4. Call GetDocument to retrieve the full XML/PDF content

## Partner Notes
Both Advania and Unimaze support this action. Response field names may vary by partner —
the table above shows the Advania format. Unimaze returns similar data with slightly
different naming (e.g. senderIdentifier, receiverIdentifier).

