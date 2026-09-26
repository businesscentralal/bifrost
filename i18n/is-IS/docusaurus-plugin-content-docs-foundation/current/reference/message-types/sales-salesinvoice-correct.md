---
id: sales-salesinvoice-correct
title: "Sales.SalesInvoice.Correct"
sidebar_label: "Sales.SalesInvoice.Correct"
sidebar_position: 133
description: "Beiðni- og svarsamningur fyrir Sales.SalesInvoice.Correct Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Cancels a posted sales reikningur og Býr til a ný editable sales reikningur draft pre-populated með the sama lines.
Wraps BC codeunit `Correct Posted Sales Invoice`.`CancelPostedInvoiceCreateNewInvoice`.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Bókunarheimild

The sama G/L Bókunarheimild as `Sales.Document.Post` er enforced. Bifrost Setup verður að allow G/L posting fyrir the calling identity.

## Process Flow

1. Resolve the posted sales reikningur úr `subject` eða request JSON (Sjá Identifier Resolution below).
2. Assert the G/L Bókunarheimild; abort með an Villa response ef Kallandinn er ekki allowed til post.
3. Run BC `CancelPostedInvoiceCreateNewInvoice` í einangraðri færslu svo hver villa frá BC er gripin og skilað sem JSON-villusvari (kóði `BusinessCentralError`).
4. BC Bókar a cancelling sales credit memo, fully applies it til the original reikningur, og Býr til a ný draft `Sales Header` (skjal Gerð = reikningur) copied úr the original.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link tafla (Uppruni ID = `Sales Invoice Header`, Cancelled Doc. No. = original reikningur).
6. Return the original reikningur, the cancelling credit memo, og the ný draft reikningur as a single JSON response.

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Beiðnibreytur

| Færibreyta | Gerð | áskilið | Athugasemdir |
|---|---|---|---|
| `invoiceNo` | strengur | Sjá above | Posted Sales reikningur `No.`. |
| `invoiceId` (alias `id`/`systemId`) | GUID | Sjá above | Posted Sales reikningur `SystemId`. |

### Dæmi um beiðni
```json
{ "invoiceNo": "PS-INV103001" }
```

## Response

```json
{
  "status": "Success",
  "originalInvoiceNo": "PS-INV103001",
  "originalInvoiceId": "11111111-1111-1111-1111-111111111111",
  "customerNo": "C10000",
  "customerName": "Adatum",
  "cancellingCreditMemo": { "no": "PS-CRM200", "id": "22222222-2222-2222-2222-222222222222" },
  "newDraftInvoice": { "no": "S-INV1101", "id": "33333333-3333-3333-3333-333333333333", "documentType": "Invoice" }
}
```

## Output skjöl

eftir a tókst call three skjöl exist:

| Role | BC tafla | Identifier in Response |
|---|---|---|
| Original posted reikningur (now flagged Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |
| ný editable draft reikningur | `Sales Header` (skjal Gerð = reikningur) | `newDraftInvoice.id` / `newDraftInvoice.no` |

### Linkage

- The original reikningur carries `Cancelled = true` og `Canceled By Cr. Memo No.` = the cancelling credit memo númer.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` og `Applies-to Doc. No.` = the original reikningur númer.
- A row in the BC `Cancelled Document` tafla einnig pairs the two: `Source ID` = `Sales Invoice Header` tafla númer, `Cancelled Doc. No.` = original reikningur, `Cancelled By Doc. No.` = cancelling credit memo.
- The ný draft reikningur has no Reitur-level FK til the original; the aðeins link er through this response payload (`newDraftInvoice.no` / `.id`).

## Fetching the Resulting skjöl með Data.Records.Get

hver `id` in Svarið er the `SystemId` of the BC færsla. nota them með `Data.Records.Get` til retrieve the full færsla JSON.

Fetch the ný draft reikningur header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Header",
    "tableView": "WHERE(SystemId=CONST(33333333-3333-3333-3333-333333333333))"
  }
}
```

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Header",
    "tableView": "WHERE(No.=CONST(PS-CRM200))"
  }
}
```

Fetch the lines of the ný draft reikningur (nota `newDraftInvoice.no` úr Svarið):
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Line",
    "tableView": "WHERE(Document Type=CONST(Invoice),Document No.=CONST(S-INV1101))"
  }
}
```

Fetch the cancelling credit memo lines:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Line",
    "tableView": "WHERE(Document No.=CONST(PS-CRM200))"
  }
}
```

Inspect the cancellation link directly:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Cancelled Document",
    "tableView": "WHERE(Source ID=CONST(112),Cancelled Doc. No.=CONST(PS-INV103001))"
  }
}
```

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Sales Invoice Header identifier is missing. Pass it as the subject, or as one of: systemId, recordSystemId, id, invoiceNo, no, documentNo.` (`MissingParameter`); gefið en fannst ekki: `Sales Invoice Header "{value}" was not found (from {subject or key}).` (`RecordNotFound`) | No identifier in `subject` eða request JSON. |
| `You cannot cancel this posted sales invoice ...` | BC blocks correction (already cancelled / corrective færslur lokað / paid). |
| Posting period / dimension / viðskiptamanni bók Villur | Skilað úr bókunarkerfi BC með kóða `BusinessCentralError`. |

## Tengdar skilaboðategundir

- `Sales.SalesInvoice.Cancel` — cancel aðeins, no ný draft.
- `Sales.Document.Post` — post the ný draft once edited.
- `Data.Records.Get` — fetch full færsla data fyrir the skjöl listed above.
- `Purchase.PurchaseInvoice.Correct` — purchase counterpart.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

