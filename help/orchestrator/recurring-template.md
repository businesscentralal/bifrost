---
id: recurring-template
title: "Job Queue Recurring Template"
sidebar_label: "Job Queue Recurring Template"
sidebar_position: 10
---

A **Job Queue Recurring Template** describes one reusable schedule. When an [orchestrator entry](/help/orchestrator/scheduled-entry-card/) or a [scheduled playbook](/help/orchestrator/schedule-playbook/) refers to a template, the entry follows the template instead of its own recurrence fields.

The schedule is validated when you close the card, so an incomplete pattern cannot be saved.

## General

| Field | Description |
| --- | --- |
| **Code** | The unique code of the template. |
| **Description** | A description that explains when the pattern applies, for example _Every weekday at night_. |
| **Time Zone** | The time zone the schedule is interpreted in. Use the assist button to pick one; new templates start from your own time zone in User Personalization. |

## Schedule

| Field | Description |
| --- | --- |
| **Run on Mondays … Run on Sundays** | The weekdays on which entries using this template run. |
| **Starting Time** | The earliest time of day at which a run may start. |
| **Ending Time** | The latest time of day at which a run may start. |

## Recurrence

| Field | Description |
| --- | --- |
| **No. of Minutes between Runs** | The minimum number of minutes between two runs inside the time window. |
| **Next Run Date Formula** | A date formula used to calculate the next run date, for example `1D` or `1M`. |
