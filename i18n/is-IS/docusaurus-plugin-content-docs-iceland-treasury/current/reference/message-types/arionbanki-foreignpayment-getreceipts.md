---
id: arionbanki-foreignpayment-getreceipts
title: "Arionbanki.ForeignPayment.GetReceipts"
sidebar_label: "Arionbanki.ForeignPayment.GetReceipts"
sidebar_position: 27
description: "Beiðni- og svarsamningur fyrir Arionbanki.ForeignPayment.GetReceipts Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Sækir receipts fyrir foreign greiðslur in a date range.

Beiðni fields: `dateFrom`, `dateTo` (ISO YYYY-MM-DD).
Svar Reitur: `receipts[]` með transactionNo, batchId, paymentId, valueDate, amount, currencyCode, beneficiary, reference, status.


