---
id: subscription-usage-importdata
title: "Subscription.Usage.ImportData"
sidebar_label: "Subscription.Usage.ImportData"
sidebar_position: 18
description: "Request and response contract for the Subscription.Usage.ImportData Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Creates a Usage Data Import header (table 8013) and a Usage Data Blob (table 8011) holding
the supplied file, then runs Microsoft's "Import And Process Usage Data" codeunit with the
"Create Imported Lines" processing step, which parses the file into Usage Data Generic Import
rows (table 8018). This only creates the imported lines - it does not turn them into billable
quantities. Call `Subscription.Usage.Process` afterwards, or set `runProcessing` to also run the
next processing step immediately.

## Request Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| supplierNo | Code[20] | Yes | The Usage Data Supplier the file was received from. May also be supplied as the message subject. |
| fileName | Text | No | The source file name recorded on the Usage Data Blob. Defaults to 'bifrost-usage.csv'. |
| content | Text | No* | The raw file content as text, for example a CSV payload. |
| contentBase64 | Text | No* | The file content, base64 encoded. Use this for non-text payloads. |
| runProcessing | Boolean | No | Defaults to false. When true, also runs the 'Process Imported Lines' step after the import. |

* Exactly one of `content` or `contentBase64` must be supplied.

## Request Example

```json
{
  "supplierNo": "USUP0010",
  "fileName": "august-usage.csv",
  "content": "SubscriptionID,ProductID,Quantity\n1001,PROD1,10",
  "runProcessing": true
}
```

## Response Shape

```json
{
  "status": "Success",
  "usageDataImportEntryNo": 137,
  "processingStatus": "Ok",
  "reason": "",
  "importedLineCount": 10
}
```

`reason` is only populated when `processingStatus` is `Error`. `importedLineCount` counts the
Usage Data Generic Import rows now standing for this Usage Data Import entry.

## Errors

| Condition | Message |
| --- | --- |
| Neither content nor contentBase64 was supplied | The request must supply either 'content' or 'contentBase64' for the usage data file. |
| supplierNo is missing | The request is missing the required parameter 'supplierNo'. |

Errors return `{ "status": "Error", "error": "...", "callstack": "..." }` and nothing is written.
A file that parses with row level problems is still a success - check `processingStatus` and
`reason`, and inspect the Usage Data Import entry in the client for row level detail.

## Safety

This message type writes. It creates a new Usage Data Import entry and its imported lines;
it does not post anything and does not touch existing Subscription data. The write runs in
an isolated transaction that rolls back on error.

## Related Message Types

- `Subscription.Usage.Process`

