---
id: recurring-template
title: "Job Queue Recurring Template"
sidebar_label: "Job Queue Recurring Template"
sidebar_position: 10
---

A **Job Queue Recurring Template** describes one reusable schedule: the weekdays, the time window, the
interval and the time zone. When an [orchestrator entry](/help/orchestrator/scheduled-entry-card/) or a
[scheduled playbook](/help/orchestrator/schedule-playbook/) uses a template, it follows the template
instead of its own recurrence fields.

Open the card from [Job Queue Recurring Templates](/help/orchestrator/recurring-templates/). The
schedule is checked when you close the card, so an incomplete schedule cannot be saved.

## General

| Field | Description |
| --- | --- |
| **Code** | The unique code of the template. |
| **Description** | When the schedule applies, for example _Weekdays at night_. |
| **Time Zone** | The time zone the schedule is read in. Use the assist button to choose one. A new template starts with the time zone from your own settings. |

## Schedule

| Field | Description |
| --- | --- |
| **Run on Mondays** … **Run on Sundays** | The weekdays on which entries that use the template run. |
| **Starting Time** | The earliest time of day at which a run may start. |
| **Ending Time** | The latest time of day at which a run may start. |

## Recurrence

| Field | Description |
| --- | --- |
| **No. of Minutes between Runs** | The minimum number of minutes between two runs inside the time window. |
| **Next Run Date Formula** | A date formula for the next run date, for example `1D` or `1M`. |
