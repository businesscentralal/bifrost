---
id: active-tasks-fact-box
title: "Active Background Tasks"
sidebar_label: "Active Background Tasks"
sidebar_position: 2
---

The **Active Background Tasks** FactBox appears on the [Bifrost Setup](/help/foundation/bifrost-setup/) page. It lists all bifrost messages that currently have a running background task, showing entries up to 48 hours old. Use this panel to monitor and cancel in-progress processing tasks.

## Columns

| Column | Description |
| --- | --- |
| **Type** | The message type of the bifrost being processed in the background. |
| **Date & Time** | When the message was queued for processing. |
| **Task Id** | Unique identifier of the background task processing the message. |

## Actions

| Action | Description |
| --- | --- |
| **Cancel Task** | Cancels the background task for the selected message. A confirmation is required before the task is stopped. |
| **Cancel All** | Cancels all active background tasks shown in the list. |
