---
id: index
title: "Bifröst Projects"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Project work in Business Central from an assistant or an integration — projects, tasks and planning lines, status, copies and archives, usage, WIP, statistics and reports, resource allocation, quotes and time sheets."
---

# Bifröst Projects

**Run project work in Business Central from the assistant or system you already use.** Bifröst
Projects lets an assistant, a planning tool or an integration set up projects with their tasks and
planning lines, keep them current, post usage and work in progress, read where a project stands
against its budget, send the quote, and move time sheets from submission to posting.

Every operation runs Business Central's own project logic, exactly as if a user did it, and the
results appear on the standard Business Central pages: the project card, project tasks and planning
lines, the project ledger, WIP entries and time sheets.

*An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).*

## What you can do

- **Set up a project in one step.** Create a project with its tasks and planning lines (resource,
  item, G/L account or text) in one call, or add and update tasks and planning lines later. If
  Business Central refuses any part, nothing is kept.
- **Keep projects current.** Update a project, change its status (for example from Quote to Open or
  Completed) or block it, through Business Central's own checks.
- **Copy and archive.** Copy a project to a new one with a range of tasks, its budget or billable
  lines, prices, quantities and dimensions. Archive a version of a project, list its archived versions
  and read one with its tasks and planning lines.
- **Send the quote.** Send the quote of a project in status Quote to its bill-to customer through a
  document sending profile, as the **Send Project Quote** action on the project card does.
- **Record usage.** Link an open purchase line to a project task, post item usage to a task through the
  project journal, read a task's usage links and remaining planning quantities, and link posted usage
  to a planning line or create planning lines from it.
- **Work in progress.** Calculate WIP, read calculated and posted WIP entries and post WIP to the
  general ledger. Read the WIP methods and create or update a custom one; the methods Business Central
  defines, and methods that WIP entries already use, are left as they are.
- **See where a project stands.** Read budget, actual, billable and invoiced cost and price, the budget
  against the actual figures per task, and the standard project reports (actual to budget, analysis,
  WIP to G/L and the project register) as data or as a PDF.
- **Plan resources.** Read the capacity of resources, how much of it is allocated to open projects and
  what is still available, per day, week, month, quarter or year.
- **Handle time sheets.** Create time sheets for chosen resources and weeks, fill them from project
  planning or from the previous time sheet, and register absence. The owner of a time sheet submits its
  lines; the approver named on the time sheet sees the lines waiting for them and approves or rejects
  them. An administrator reopens lines, posts approved lines through a project journal and archives
  posted time sheets.

## Capabilities

| Domain | Capabilities |
|---|---|
| **Projects** | Projects, tasks and planning lines from creation to status and blocking, copies and archived versions, project quotes, purchase and item usage, WIP calculation, posting and methods, budget and actual statistics, standard project reports, resource capacity and allocation, and time sheets from creation through submission and approval to posting and archiving |

## Get it

Install **Bifrost Projects** next to Bifröst Foundation, from AppSource or through your Business
Central partner. It needs Business Central 28 or later, Essentials or Premium, and Bifröst Foundation
28.0.5.0 or later. For the price, contact your Business Central partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Bifröst Foundation and complete its setup, then install **Bifrost Projects**. | Business Central administrator |
| 2 | Open **Projects Setup** and check that **Enabled** is on for this company. It is on when the app is installed. | Business Central administrator |
| 3 | Make sure the people and services that call it have Bifröst's `BIFROST Read ori` or `BIFROST Full ori`; Bifrost Projects adds its permissions to those sets. Give `BIFROST Full ori` only to those who may post and archive (see *Good to know*). | Business Central administrator |
| 4 | Check the Business Central setup the work needs: project number series and posting groups, WIP methods, project journal templates and batches, and **Archive Projects** in Business Central's own project setup (Jobs Setup) if projects are to be archived. For time sheets: resources that use time sheets, each with a time sheet owner and approver, and the time sheet settings in Resources Setup. | Business Central administrator or partner |

The help of the setup page has the details: [Projects Setup](/help/projects/projects/).

## Good to know

- **It acts as you.** Every call runs with the caller's own Business Central permissions and is
  logged on **Bifrost Messages**. An operation the caller has no permission for is not offered to the
  assistant.
- **Posting needs `BIFROST Full ori`.** Posting WIP, posting item usage, linking purchase lines to a
  project and archiving a project version need `BIFROST Full ori` on top of the caller's Business
  Central permissions. `BIFROST Read ori` is enough to read projects, statistics, reports and archived
  versions.
- **Time sheets need permission to time sheets.** The time sheet operations that create, change,
  approve, post or archive time sheets need the Business Central permissions to time sheets. With
  Bifrost Projects installed, `BIFROST Full ori` includes them (time sheets and their archive, project
  journal lines and employee absence), so assign it only to the people and services that may work with
  time sheets.
- **Owners submit, approvers decide.** Only the owner of a time sheet can submit its lines, and only
  the approver named on the time sheet can approve or reject them. The list of lines waiting for
  approval shows only the caller's own queue.
- **Some steps cannot be undone.** Posting time sheets, posting WIP, posting item usage and sending a
  quote are final. Posted entries are corrected the usual Business Central way.
- **Projects can be turned off for a company.** When **Enabled** is off on **Projects Setup**, the
  project operations are not offered to assistants in that company, and a call answers with an error
  that says so. The time sheet operations are not affected by this switch.
- **Some data is changed only through these operations.** An assistant cannot change Projects Setup,
  time sheet status, posted time sheet data or archived time sheets through Bifröst's general data
  operations; it uses the operations of this app, which keep Business Central's own checks.
- **Message types.** The operations this app adds are listed with all the others by the MCP tools
  (`list_domains`, `describe_domains`, `describe_message_type`) and on the **Bifrost Message Types**
  page, and each explains itself through `Help.Implementation.Get`.
