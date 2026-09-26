---
id: sales-salesinvoice-cancel
title: "Sales.SalesInvoice.Cancel"
sidebar_label: "Sales.SalesInvoice.Cancel"
sidebar_position: 132
description: "Beiðni- og svarsamningur fyrir Sales.SalesInvoice.Cancel Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Cancels a posted sales reikningur með posting a cancelling sales credit memo that auto-applies til the original reikningur. No ný draft er created.
Wraps BC codeunit `Correct Posted Sales Invoice`.`CancelPostedInvoice`.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Bókunarheimild

The sama G/L Bókunarheimild as `Sales.Document.Post` er enforced.

## Process Flow

1. Resolve the posted sales reikningur úr `subject` eða request JSON (Sjá Identifier Resolution below).
2. Assert the G/L Bókunarheimild; abort með an Villa response ef Kallandinn er ekki allowed til post.
3. Run BC `CancelPostedInvoice` í einangraðri færslu svo hver villa frá BC er gripin og skilað sem JSON-villusvari (kóði `BusinessCentralError`).
4. BC Bókar a cancelling sales credit memo og fully applies it til the original reikningur; no draft reikningur er created.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link tafla (Uppruni ID = `Sales Invoice Header`, Cancelled Doc. No. = original reikningur).
6. Return the original reikningur og the cancelling credit memo as a single JSON response.

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Dæmi um beiðni
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
  "cancellingCreditMemo": { "no": "PS-CRM200", "id": "22222222-2222-2222-2222-222222222222" }
}
```

## Output skjöl

eftir a tókst call two skjöl exist:

| Role | BC tafla | Identifier in Response |
|---|---|---|
| Original posted reikningur (now flagged Cancelled) | `Sales Invoice Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling sales credit memo (posted, fully applied) | `Sales Cr.Memo Header` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |

### Linkage

- The original reikningur carries `Cancelled = true` og `Canceled By Cr. Memo No.` = the cancelling credit memo númer.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` og `Applies-to Doc. No.` = the original reikningur númer.
- A row in the BC `Cancelled Document` tafla einnig pairs the two: `Source ID` = `Sales Invoice Header` tafla númer, `Cancelled Doc. No.` = original reikningur, `Cancelled By Doc. No.` = cancelling credit memo.

## Fetching the Resulting skjöl með Data.Records.Get

hver `id` in Svarið er the `SystemId` of the BC færsla. nota them með `Data.Records.Get` til retrieve the full færsla JSON.

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Cr.Memo Header",
    "tableView": "WHERE(SystemId=CONST(22222222-2222-2222-2222-222222222222))"
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

Re-lesa the original reikningur til confirm the cancellation flag:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Sales Invoice Header",
    "tableView": "WHERE(No.=CONST(PS-INV103001))"
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
| `You cannot cancel this posted sales invoice ...` | BC blocks cancellation (already cancelled / paid / has opið jöfnanir). |

## Tengdar skilaboðategundir

- `Sales.SalesInvoice.Correct` — cancel + create ný editable draft.
- `Data.Records.Get` — fetch full færsla data fyrir the skjöl listed above.
- `Purchase.PurchaseInvoice.Cancel` — purchase counterpart.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

