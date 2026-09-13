---
id: documentexchange-advania-statussync
title: "DocumentExchange.Advania.StatusSync"
sidebar_label: "DocumentExchange.Advania.StatusSync"
sidebar_position: 28
description: "Beiðni- og svarsamningur fyrir DocumentExchange.Advania.StatusSync Bifrastar-skilaboðagerð."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálpar-codeunit skilaboðagerðarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálpar-codeunitinu í forritinu, ekki þessari skrá.
:::


Syncs delivery status frá the skjal exchange fyrir sent invoices/credit memos.
Reads the exchange UUID frá Reitur 710, queries the exchange API fyrir current status,
og Uppfærir Reitur 711 (skjal Exchange Status) on the posted skjal.

## Beiðni — skjal Identifier (Gefðu upp ONE, eða omit Allt fyrir batch sync)
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| salesInvoiceNo | string | Posted invoice number til sync |
| salesInvoiceRecordSystemId | string | SystemId of posted invoice |
| salesCreditMemoNo | string | Posted credit memo number til sync |
| salesCreditMemoRecordSystemId | string | SystemId of posted credit memo |

### Batch Sync
Ef **no parameters** eru provided, syncs Allt skjöl where Reitur 711 = "Sent til skjal Exchange Service".
This er the recommended approach fyrir periodic status polling.

## Svar
```json
{
  "synced": 4,
  "updated": 2,
  "results": [
    {
      "documentNo": "103301",
      "type": "Invoice",
      "exchangeStatusId": 3,
      "exchangeStatus": "ssDeliverd",
      "bcStatus": "Delivered to Recipient",
      "changed": true
    }
  ]
}
```

| Svar Reitur | Lýsing |
|----------------|-------------|
| synced | Number of skjöl checked against the exchange |
| updated | Number of skjöl whose BC status was changed |
| results[].documentNo | Posted skjal number |
| results[].Gerð | "Invoice" eða "CreditMemo" |
| results[].exchangeStatusId | Raw status ID frá exchange |
| results[].exchangeStatus | Raw status code frá exchange (e.g. "ssDeliverd") |
| results[].bcStatus | Mapped BC status label (Icelandic) |
| results[].changed | true Ef Reitur 711 was updated, false Ef already current |

## Typed Access (Unified Buffer)
Svarið items map
onto `DocEx Status Buffer ori` færslur með delivery status enum values.

## Status Mapping (Exchange → BC)
| Exchange status_id | Exchange Code | → BC Status (Reitur 711) |
|-------------------|---------------|-------------------------|
| 1, 11, 28, 30, 31, 200 | ssUnDeliverd, etc. | Pending Connection til Recipient |
| 2, 3, 10, 13, 14, 20, 21, 23, 90 | ssDeliverd, ssApproved, etc. | Delivered til Recipient |
| 4, 5, 6, 7, 22, 992 | ssError, ssDenied, etc. | Delivery Failed |

## Verify eftir Sync með Data.færslur.Sækja
```
# Check invoice status:
Data.Records.Get table="Sales Invoice Header" filter="No.=103301"
  fields=[No. (3), Document Exchange Identifier (710),
          Document Exchange Status (711), Doc. Exch. Original Identifier (712)]

# Check credit memo status:
Data.Records.Get table="Sales Cr.Memo Header" filter="No.=104004"
  fields=[No. (3), Document Exchange Identifier (710),
          Document Exchange Status (711), Doc. Exch. Original Identifier (712)]

# Find all sent documents (batch sync candidates):
Data.Records.Get table="Sales Invoice Header"
  filter="Document Exchange Status=Sent to Document Exchange Service"
  fields=[No. (3), Document Exchange Status (711)]
```

## Reitur Reference (Posted Sales Invoice Header / Sales Cr.Memo Header)
| Reitur No. | Reitur Heiti | Gerð | Lýsing |
|-----------|------------|------|-------------|
| 710 | skjal Exchange Identifier | Text[50] | Exchange UUID (set by SubmitDocument) |
| 711 | skjal Exchange Status | Enum | BC status: Not Sent, Sent, Pending, Delivered, Failed |
| 712 | Doc. Exch. Original Identifier | Text[50] | xDoc TransactionId (set by CreateInvoice) |


