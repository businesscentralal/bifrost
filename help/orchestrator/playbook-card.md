---
id: playbook-card
title: "Bifrost Playbook"
sidebar_label: "Bifrost Playbook"
sidebar_position: 6
---

Use the **Bifrost Playbook** card to define a playbook: a routine of steps, each one a Bifröst
operation in Business Central, where the answer of one step can feed the next. On the card you set the
steps, the conditions that gate and branch them and the request the first step receives, run the
playbook, and schedule it. The card also shows how each step did in the most recent run.

Open it from [Bifrost Playbooks](/help/orchestrator/playbooks/).

## General

| Field | Description |
| --- | --- |
| **Code** | The unique code of the playbook. |
| **Description** | What the playbook does. |

## Steps

The **Steps** part lists the steps in the order they run. For each step you choose the operation it
calls (the **Message Type** column), whether it repeats for every element of an array from an earlier
step, what counts as a check rather than an action, and which step comes next on success and on
failure. Steps that repeat over an array are indented, and disabled steps are dimmed. The **Last Run**
column shows how each step did in the most recent run: ✓ completed, ✗ failed, – skipped, · not run.

See [Playbook Steps](/help/orchestrator/playbook-steps/) for every column.

## Step Conditions

The **Step Conditions** part shows the conditions of the step selected in **Steps**. A **Start**
condition decides whether the step runs, a **Success** condition picks the next step, and an **Error**
condition fails the run without changing the path. All conditions in a group must be true; one true
group is enough.

See [Step Conditions](/help/orchestrator/playbook-conditions/) for every column.

## Schedule

| Field | Description |
| --- | --- |
| **Scheduled** | Shows whether the playbook has an orchestrator entry that runs it on a schedule. |

## Initial Request

| Field | Description |
| --- | --- |
| **Initial Request JSON** | The JSON passed to the first step when a run is started without a request of its own, for example with **Run Now** or on a schedule. Edit it directly in the field. |

## Request templates

Each step sends a request built from its request template, shown in the **Request Template** FactBox.
A template can use values the run has collected so far with an **@ path**:

- `@10.customerNo` is a value kept from the answer of step 10.
- `@_sys.today`, `@_sys.workDate`, `@_sys.thisMonthStart`, `@_sys.companyName` and `@_sys.userId`
  are values every run provides: dates, the company and the user who runs it.
- When a JSON value is only an @ path, the value keeps its type (a number, an object or a list). When
  the @ path sits inside other text, the value is written into the text.

Edit a template in the [Playbook Template Editor](/help/orchestrator/playbook-template-editor/), which
**Edit** in the FactBox opens. See [Request Template](/help/orchestrator/playbook-step-template-fact-box/)
for the FactBox.

## FactBoxes

| FactBox | Description |
| --- | --- |
| **Request Template** | The request template of the step selected in **Steps**, with actions to edit, download and upload it. |
| **Last Execution** | A summary of the most recent run: status, start, duration, counters and any error. See [Last Execution](/help/orchestrator/playbook-last-run-fact-box/). |

## Actions

| Action | Description |
| --- | --- |
| **Run Now** | Runs the playbook immediately, in the foreground, with the **Initial Request JSON**. When the run ends, a message gives its status and **Last Execution** is updated. |
| **Schedule** | Opens [Schedule Playbook](/help/orchestrator/schedule-playbook/), which creates an orchestrator entry that runs the playbook on a recurring schedule. Available only while the playbook is not scheduled. |
| **Orchestrator Entry** | Opens the playbook's [orchestrator entry](/help/orchestrator/scheduled-entry-card/), where you change the schedule, block it or run it once. Available only when the playbook is scheduled. |
| **Execution Log** | Opens the [Playbook Execution Log](/help/orchestrator/playbook-instances/) filtered to this playbook. |

## Tips

- A playbook runs with the permissions of the user who runs it; a scheduled playbook, with those of the
  user its job queue entry runs as.
- Try a playbook with **Run Now** before you schedule it: with a case where there is work to do, one
  where there is none, and one with a bad input.
- The operations a step can call, and what each one needs, are listed in
  [Available Message Types](/help/foundation/bifrost-message-type-list/) on Bifrost Setup.
