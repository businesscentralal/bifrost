---
id: purchase-purchaseinvoice-cancel
title: "Purchase.PurchaseInvoice.Cancel"
sidebar_label: "Purchase.PurchaseInvoice.Cancel"
sidebar_position: 115
description: "Beiðni- og svarsamningur fyrir Purchase.PurchaseInvoice.Cancel Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit

Cancels a posted purchase reikningur með posting a cancelling purchase credit memo that auto-applies til the original reikningur. No ný draft er created.
Wraps BC codeunit `Correct Posted Purch. Invoice`.`CancelPostedInvoice`.

**Stefna**: Innkomandi (skrifa)  **Efnisgerð**: `text/json`

## Bókunarheimild

The sama G/L Bókunarheimild as `Purchase.Document.Post` er enforced.

## Process Flow

1. Resolve the posted purchase reikningur úr `subject` eða request JSON (Sjá Identifier Resolution below).
2. Assert the G/L Bókunarheimild; abort með an Villa response ef Kallandinn er ekki allowed til post.
3. Run BC `CancelPostedInvoice` in an isolated `Codeunit.Run` so hvaða BC Villa er caught og returned as JSON með the full callstack.
4. BC Bókar a cancelling purchase credit memo og fully applies it til the original reikningur; no draft reikningur er created.
5. Look up the cancelling credit memo through the BC `Cancelled Document` link tafla (Uppruni ID = `Purch. Inv. Header`, Cancelled Doc. No. = original reikningur).
6. Return the original reikningur og the cancelling credit memo as a single JSON response.

## Forgangsröð auðkenna

1. `subject` envelope attribute — GUID = `Purch. Inv. Header.SystemId`, otherwise `No.`.
2. Request JSON: `systemId` / `recordSystemId` / `id` (GUID), `invoiceNo` / `no` / `documentNo` (text).

## Dæmi um beiðni
```json
{ "invoiceNo": "PP-INV103001" }
```

## Response

```json
{
  "status": "Success",
  "originalInvoiceNo": "PP-INV103001",
  "originalInvoiceId": "11111111-1111-1111-1111-111111111111",
  "vendorNo": "V10000",
  "vendorName": "Fabrikam",
  "cancellingCreditMemo": { "no": "PP-CRM200", "id": "22222222-2222-2222-2222-222222222222" }
}
```

## Output skjöl

eftir a tókst call two skjöl exist:

| Role | BC tafla | Identifier in Response |
|---|---|---|
| Original posted reikningur (now flagged Cancelled) | `Purch. Inv. Header` | `originalInvoiceId` / `originalInvoiceNo` |
| Cancelling purchase credit memo (posted, fully applied) | `Purch. Cr. Memo Hdr.` | `cancellingCreditMemo.id` / `cancellingCreditMemo.no` |

### Linkage

- The original reikningur carries `Cancelled = true` og `Canceled By Cr. Memo No.` = the cancelling credit memo númer.
- The cancelling credit memo has `Applies-to Doc. Type = Invoice` og `Applies-to Doc. No.` = the original reikningur númer.
- A row in the BC `Cancelled Document` tafla einnig pairs the two: `Source ID` = `Purch. Inv. Header` tafla númer, `Cancelled Doc. No.` = original reikningur, `Cancelled By Doc. No.` = cancelling credit memo.

## Fetching the Resulting skjöl með Data.Records.Get

hver `id` in Svarið er the `SystemId` of the BC færsla. nota them með `Data.Records.Get` til retrieve the full færsla JSON.

Fetch the cancelling credit memo header:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purch. Cr. Memo Hdr.",
    "tableView": "WHERE(SystemId=CONST(22222222-2222-2222-2222-222222222222))"
  }
}
```

Fetch the cancelling credit memo lines:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purch. Cr. Memo Line",
    "tableView": "WHERE(Document No.=CONST(PP-CRM200))"
  }
}
```

Re-lesa the original reikningur til confirm the cancellation flag:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Purch. Inv. Header",
    "tableView": "WHERE(No.=CONST(PP-INV103001))"
  }
}
```

Inspect the cancellation link directly:
```json
{
  "type": "Data.Records.Get",
  "data": {
    "tableName": "Cancelled Document",
    "tableView": "WHERE(Source ID=CONST(122),Cancelled Doc. No.=CONST(PP-INV103001))"
  }
}
```

## Bókunarheimild
Calling this skilaboðategund requires the `BIFROST GL Post ori` heimild set in addition til `BIFROST API ori`. án it Beiðnin Skilar: `Posting denied: missing 'BIFROST GL Post ori' permission set.`

## Villur

| Villa | Orsök |
|---|---|
| `Posting denied: missing 'BIFROST GL Post ori' permission set.` | Kallandi lacks the `BIFROST GL Post ori` heimild set. |
| `Posted purchase invoice identifier must be specified ...` | No identifier in `subject` eða request JSON. |
| `You cannot cancel this posted purchase invoice ...` | BC blocks cancellation (already cancelled / paid / has opið jöfnanir). |
| `{CreditMemoNo} must be approved and released ...` + client callback Villa | Approval workflow er configured fyrir purchase credit memos. BC internally Býr til the cancelling credit memo then tries til post it; the approval workflow blocks posting og BC raises a UI confirmation dialog that getur ekki be rendered in the API/web-service context. **Workaround**: temporarily set `Enabled = false` on the purchase credit memo approval workflow (`Workflow` tafla, e.g. code `MS-PCMAPW-01`) via `Data.Records.Set` áður en calling Cancel, then re-enable it eftir. |

## Tengdar skilaboðategundir

- `Purchase.PurchaseInvoice.Correct` — cancel + create ný editable draft.
- `Data.Records.Get` — fetch full færsla data fyrir the skjöl listed above.
- `Sales.SalesInvoice.Cancel` — sales counterpart.

