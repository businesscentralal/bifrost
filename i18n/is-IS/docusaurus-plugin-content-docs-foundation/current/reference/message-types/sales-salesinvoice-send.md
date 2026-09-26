---
id: sales-salesinvoice-send
title: "Sales.SalesInvoice.Send"
sidebar_label: "Sales.SalesInvoice.Send"
sidebar_position: 135
description: "Beiðni- og svarsamningur fyrir Sales.SalesInvoice.Send Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Tilgangur

Triggers the BC standard "Send" action on a posted sales reikningur. The action delivers the reikningur til its recipient using whatever channels eru configured on the resolved skjal Sending Profile: email, printer, disk export, eða an electronic skjal (PEPPOL/EHF/E-reikningur) routed through a skjal Exchange Service. This er the sama action that runs þegar a user clicks **Send** on the posted sales reikningur page, exposed as a Bifrost so external systems og agents getur trigger it án a UI.

nota this skilaboðategund þegar an upstream system (an MCP client, a workflow, an AI agent) needs til send a posted reikningur til the viðskiptamanni right eftir posting, eða til resend it later, án coding the channel logic. Channel selection (email vs print vs e-skjal) lives entirely in BC configuration via skjal Sending Profiles; this message aðeins decides *which* profile til nota.

**Stefna**: Innkomandi (action)  **Efnisgerð**: `text/json`

## What Happens þegar You Call This

1. **Resolve the reikningur** - locate the `Sales Invoice Header` úr Beiðnin (`invoiceId` GUID, `invoiceNo`, eða `subject`).
2. **Resolve the profile** - pick a `Document Sending Profile` using the resolution chain below.
3. **Hand off til BC** - call `Sales Invoice Header.SendProfile(DocumentSendingProfile)`. úr this point the behaviour er exactly the standard BC Send.
4. **BC dispatches hver enabled channel** on the profile:
   - **Printer** - Sendir the report til the configured printer ef `Printer` er enabled.
   - **E-Mail** - renders the report attachment + email body og Sendir through the configured email account ef `E-Mail` er enabled. The `Sent as Email` flag on the header er set on Tókst.
   - **Disk** - writes the report (PDF eða electronic skjal file) til the user's download/temp location ef `Disk` er enabled.
   - **Electronic skjal** - builds the e-skjal (PEPPOL / OIOUBL / custom format), hands it til the configured skjal Exchange Service (DES), og Uppfærir the header tracking fields ef `Electronic Document` er enabled.
5. **Return Svarið** - Tókst envelope með the resolved profile + its Uppruni, eða villusvar með upprunalega villutexta BC (kóði `BusinessCentralError`).

## Channel Support þegar Called via the API

This Bifrost runs on the BC Data Services API surface, which **does ekki allow client-side callbacks**. That restricts which profile channels actually work þegar invoked through this skilaboðategund:

| Channel | Works via API? | Athugasemdir |
|---|---|---|
| **E-Mail** | Yes | Sent server-side through the configured email account. |
| **Electronic skjal** | Yes | Built og handed til the skjal Exchange Service server-side. |
| **Disk** | **No** | Triggers a client-side file-download callback. BC Skilar: *"Client callbacks eru ekki stutt on Microsoft Dynamics 365 Business Central Data Services."* The call er rejected og the wrapper Skilar it as an `Error` envelope. |
| **Printer** | **No** | sama client-callback takmörkun as Disk. |

Make sure the resolved profile (`Request` / `Customer` / `Default`) routes aðeins through E-Mail og/eða Electronic skjal. Disk- eða Printer-aðeins profiles mun always Villa þegar called via this skilaboðategund, even though they work fine þegar a user clicks **Send** in the BC client.

## Tracking - Where the Status Lives eftir Sending

This skilaboðategund does ekki return delivery confirmation. Delivery er asynchronous (especially fyrir email og electronic skjöl). eftir the call Skilar `Success`, query the `Sales Invoice Header` til inspect what happened:

| Reitur | Gerð | What it tells you |
|---|---|---|
| `Sent as Email` | sanngildi | `true` once the email channel handed the message til the mail server. |
| `No. Printed` | heiltala | Incremented hver time the printer channel produced the skjal. |
| `Document Exchange Status` | Option | Lifecycle of the e-skjal at the skjal Exchange Service: `Not Sent`, `Sent to Document Exchange Service`, `Sent to Recipient`, `Delivered to Recipient`, `Failed Delivery to Recipient`. |
| `Document Exchange Identifier` | Code[50] | The DES-side identifier - notað til look up / trace the electronic skjal in the exchange service portal. |

nota `Data.Records.Get` (tafla 112 `Sales Invoice Header`) til retrieve these fields eftir sending. The `Document Exchange Status` Gildi er updated asynchronously með the DES connector job queue.

Sent-email history (subject, recipients, attachment, timestamp) er recorded með the BC base app in the `Sent Email` / `Email Outbox` töflur og er reachable úr the posted reikningur via standard navigation.

## Profile Forgangsröð úrlausnar

1. **Request override** - `documentSendingProfile` in Beiðnin body. verður að exist in the `Document Sending Profile` tafla; otherwise the call Villur. nota this fyrir one-off resends through a non-Sjálfgefið channel án changing the viðskiptamanni master.
2. **viðskiptamanni profile** - `Customer."Document Sending Profile"` fyrir the reikningur's Sell-til viðskiptamanni. This er the normal, per-viðskiptamanni routing.
3. **System Sjálfgefið** - the fyrsta `Document Sending Profile` með `Default = true`. Acts as the safety net þegar neither override nor viðskiptamanni profile er set.

ef none of the three resolves, the call Villur með `No Document Sending Profile resolved for customer {No} and no system default profile exists.`

The `documentSendingProfileSource` Reitur in the Tókst response tells you which of the three was notað (`Request` / `Customer` / `Default`).

## Subject Identification Order

1. `subject` envelope attribute - GUID = `Sales Invoice Header.SystemId`, otherwise `No.`.
2. Request JSON: `invoiceNo` / `invoiceId` (resolved í the subject via `ResolveDocumentSubject`).

## Beiðnibreytur

| Reitur | Gerð | áskilið | Lýsing |
|---|---|---|---|
| `invoiceNo` | strengur | One of these eða `subject` | Sales reikningur Header `No.`. |
| `invoiceId` | GUID | One of these eða `subject` | Sales reikningur Header `SystemId`. |
| `documentSendingProfile` | Code[20] | No | One-time override profile code; verður að exist. |

## Dæmi um beiðni
```json
{ "invoiceNo": "PSI-001", "documentSendingProfile": "EMAIL" }
```

## Uppbygging svars - Tókst

```json
{
  "status": "Success",
  "documentType": "PostedSalesInvoice",
  "documentNo": "PSI-001",
  "documentId": "11111111-1111-1111-1111-111111111111",
  "customerNo": "C10000",
  "customerName": "Adatum",
  "documentSendingProfileCode": "EMAIL",
  "documentSendingProfileSource": "Request",
  "message": "Document sent successfully."
}
```

A `Success` response means BC accepted the send call og dispatched all enabled channels án throwing. It does ekki guarantee end-til-end delivery - query the tracking fields above fyrir that.

## Uppbygging svars - Mistókst

```json
{
  "status": "Error",
  "error": "<message>",
  "hint": "..."
}
```

## Svarreitir

| Reitur | Gerð | Lýsing |
|---|---|---|
| `documentType` | strengur | Always `PostedSalesInvoice`. |
| `documentNo` | strengur | Sales reikningur Header `No.`. |
| `documentId` | GUID | Sales reikningur Header `SystemId`. |
| `customerNo` | Code[20] | Sell-til viðskiptamanni No. on the reikningur. |
| `customerName` | Text[100] | Sell-til viðskiptamanni Heiti on the reikningur. |
| `documentSendingProfileCode` | Code[20] | The resolved profile code that was notað. |
| `documentSendingProfileSource` | strengur | `Request`, `Customer`, eða `Default` - where the resolved profile came úr. |
| `message` | strengur | Status message. |

## Villur

| Trigger | Villa |
|---|---|
| vantar identifier | `Subject parameter is required. Provide the invoice number or SystemId.` |
| reikningur fannst ekki | `Sales Invoice {No} not found.` |
| Override profile vantar | `Document Sending Profile "{Code}" not found.` |
| viðskiptamanni profile dangling | `Document Sending Profile "{Code}" referenced by customer {No} does not exist.` |
| No profile og no Sjálfgefið | `No Document Sending Profile resolved for customer {No} and no system default profile exists.` |
| hvaða BC SendProfile Villa | Original BC Villa text (e.g. vantar email account, vantar report selection, electronic skjal validation Mistókst). |

## Tengdar skilaboðategundir

- `Sales.SalesCreditMemo.Send` - sama behaviour fyrir posted credit memos.
- `Data.Records.Get` (tafla 112) - lesa back `Sent as Email`, `Document Exchange Status`, `Document Exchange Identifier` til confirm delivery state.
- `Data.Records.Get` (tafla 60 `Document Sending Profile`) - inspect which channels a given profile enables.

## Villur og viðvaranir
Villur og viðvaranir fylgja sameiginlega sniðinu - sjá [Villur og viðvaranir](/foundation/reference/errors/).

