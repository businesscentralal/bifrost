---
id: bifrost-messages
title: "Bifrost Messages"
sidebar_label: "Bifrost Messages"
sidebar_position: 12
---

The **Bifrost Messages** page displays all bifrost messages that have been received by the system. Messages are sorted by date/time in descending order (newest first). From this page you can monitor processing status, download request and response data, retry or cancel background tasks, and edit request payloads.

## Columns

| Column | Description |
| --- | --- |
| **Id** | Unique identifier (GUID) of the message. |
| **Version** | Bifrost specification version (e.g. 1.0). |
| **Type** | The message type that determines how the message is processed (e.g. `Customer.CreditLimit.Get`). |
| **Status** | Current processing status: _Task completed_, _Task is running_, _Task is not running_, or _No task scheduled_. |
| **Source** | The external system or application that sent the message. |
| **Subject** | Free-text subject describing what the message is about. |
| **Language** | The language in which the message will be processed. |
| **Date & Time** | When the message was received. |
| **Last Modified** | When the message was last updated in the system. |
| **Data Content Type** | MIME type of the payload (e.g. `application/json`). |
| **Request Data Length** | Size (bytes) of the incoming request payload. Hidden by default. |
| **Response Data Length** | Size (bytes) of the response generated after processing. Hidden by default. |
| **Task Id** | Identifier of the background task. Hidden by default. |

## Actions

### Task

| Action | Description |
| --- | --- |
| **Retry Task** | Re-schedules the background task to reprocess the selected message. Use when a task has failed. |
| **Run Task** | Processes the selected message synchronously in the current session instead of waiting for the scheduled background task. |
| **Cancel Task** | Cancels the scheduled background task. The task is removed from the task scheduler. |

### Request

| Action | Description |
| --- | --- |
| **Download File** | Downloads the incoming request payload as a file (JSON, XML, or TXT depending on the content type). |
| **Edit** | Opens the [Bifrost Message Editor](/help/foundation/bifrost-message-editor/) so you can view or modify the request data. |

### Response

| Action | Description |
| --- | --- |
| **Download File** | Downloads the processing result/response data as a file. |

## FactBoxes

-   **Request Data** – shows the incoming payload of the selected message. See [Bifrost Request](/help/foundation/bifrost-request/).
-   **Response Data** – shows the response payload after processing. See [Bifrost Response](/help/foundation/bifrost-response/).
