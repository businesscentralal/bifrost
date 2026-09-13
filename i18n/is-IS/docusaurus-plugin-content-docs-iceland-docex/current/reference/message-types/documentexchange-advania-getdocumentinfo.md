---
id: documentexchange-advania-getdocumentinfo
title: "DocumentExchange.Advania.GetDocumentInfo"
sidebar_label: "DocumentExchange.Advania.GetDocumentInfo"
sidebar_position: 9
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.GetDocumentInfo Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Skilar Allt metadata about a skjal: sender/receiver, dates, amounts, status, og Peppol profile info.

## Beiðni
| Reitur | Gerð | nauðsynlegt |
|-------|------|----------|
| messageId | string | **Yes** |

## Svar
stakan object (not paged). Key fields:
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| uuid | string | skjal UUID |
| from_ean, from_name | string | Sender Endapunktur |
| to_ean, to_name | string | Receiver Endapunktur |
| staðlaða | string | staðlaða code (STI, BII, NES2.0, BIS3) |
| transactiontype | string | færsla Gerð code |
| document_type | string | Invoice, CreditNote, RemittanceAdvice |
| document_id | string | Sender skjal number |
| status, status_id | string/int | Current status |
| currency | string | ISO currency code |
| payable_amount, base_amount | decimal | Amounts |
| issue_date, due_date, deadline_date | string | Dates YYYY-MM-DD |
| received | datetime | Þegar received by partner system |
| supplier_id, supplier_id_type | string | Supplier tax ID + scheme |
| customer_id, customer_id_type | string | viðskiptavinur tax ID + scheme |
| real_type | string | Actual root element Gerð |
| peppol_info | array | Peppol profile details (profilecode, documentidentifier, customization_id) |
| sourceidentifier | string | Sender external reference |
| payload_kb | decimal | skjal size in KB |

## Verkflæði
Notaðu GetDocumentInfo til inspect a skjal áður en deciding how til process it:
1. Sækja messageId frá GetUnread eða GetInbox
2. Kallaðu á GetDocumentInfo til inspect metadata (sender, Gerð, amount)
3. Based on document_type, route til appropriate processing (Invoice → Purchase, CreditNote → Credit)
4. Kallaðu á GetDocument til retrieve the fulla XML/PDF content

## Partner Notes
Both Advania og Unimaze support this action. Svar Reitur names may vary by partner —
the table above shows the Advania format. Unimaze Skilar similar data með slightly
different naming (e.g. senderIdentifier, receiverIdentifier).


