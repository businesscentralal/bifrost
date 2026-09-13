---
id: subscription-usage-importdata
title: "Subscription.Usage.ImportData"
sidebar_label: "Subscription.Usage.ImportData"
sidebar_position: 18
description: "Request and response contract for the Subscription.Usage.ImportData Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Býr til a Usage Data Import header (table 8013) og a Usage Data Blob (table 8011) holding
the supplied skrá, then runs Microsoft's "Import And Process Usage Data" kóðiunit með the
"Create Imported Lines" processing step, which parses the skrá í Usage Data Generic Import
rows (table 8018). This aðeins creates the imported línur - it gerir ekki turn them í billable
quantities. Kallaðu á `Subscription.Usage.Process` afterwards, eða set `runProcessing` to also run the
next processing step immediately.

## Færibreytur beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
| --- | --- | --- | --- |
| supplierNo | Code[20] | Yes | The Usage Data Supplier the skrá was received from. May also be supplied as the message subject. |
| skráName | Text | No | The source skrá heiti færslaed on the Usage Data Blob. Sjálfgefið er 'bifrost-usage.csv'. |
| innihald | Text | No* | The raw skrá innihald as text, fyrir example a CSV payload. |
| innihaldBase64 | Text | No* | The skrá innihald, base64 enkóðid. Notaðu this fyrir non-text payloads. |
| runProcessing | Boolean | No | Sjálfgefið er false. When true, also runs the 'Process Imported Lines' step eftir the import. |

* Exactly one of `content` eða `contentBase64` verður að vera supplied.

## Dæmi um beiðni

```json
{
  "supplierNo": "USUP0010",
  "fileName": "august-usage.csv",
  "content": "SubscriptionID,ProductID,Quantity\n1001,PROD1,10",
  "runProcessing": true
}
```

## Snið svars

```json
{
  "status": "Success",
  "usageDataImportEntryNo": 137,
  "processingStatus": "Ok",
  "reason": "",
  "importedLineCount": 10
}
```

`reason` er aðeins populated þegar `processingStatus` er `Error`. `importedLineCount` counts the
Usage Data Generic Import rows now standing fyrir this Usage Data Import entry.

## Villas

| Skilyrði | Skilaboð |
| --- | --- |
| Neither innihald nor innihaldBase64 was supplied | Beiðnin verður supply either 'innihald' eða 'innihaldBase64' fyrir the usage data skrá. |
| supplierNo er missing | Beiðnin er missing the required parameter 'supplierNo'. |

Villas return `{ "status": "Error", "error": "...", "callstack": "..." }` og nothing er written.
A skrá that parses með row level problems er still a success - check `processingStatus` and
`reason`, og inspect the Usage Data Import entry in the client fyrir row level detail.

## Öryggi

This message tegund writes. It creates a new Usage Data Import entry og its imported línur;
it gerir ekki post anything og gerir ekki touch existing Subscription data. The write runs in
an isolated transaction that rolls back on villa.

## Tengdar skilaboðategundir

- `Subscription.Usage.Process`

