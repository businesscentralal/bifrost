---
id: arionbanki-foreignpayment-getreceipts
title: "Arionbanki.ForeignPayment.GetReceipts"
sidebar_label: "Arionbanki.ForeignPayment.GetReceipts"
sidebar_position: 27
description: "Request and response contract for the Arionbanki.ForeignPayment.GetReceipts Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Gets receipts for foreign payments in a date range.

Request fields: `dateFrom`, `dateTo` (ISO YYYY-MM-DD).
Response field: `receipts[]` with transactionNo, batchId, paymentId, valueDate, amount, currencyCode, beneficiary, reference, status.

