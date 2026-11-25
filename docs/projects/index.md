---
id: index
title: "Bifröst Projects"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Project work in Business Central from an assistant or an integration: projects, tasks and planning, usage and WIP, budget and actual, quotes, time sheets and field service visits."
---

# Bifröst Projects

**Run project work in Business Central from the assistant or system you already use.** Bifröst Projects
lets an assistant, a planning tool or an integration set up projects with their tasks and planning lines,
keep the plan current, post usage and work in progress, see where a project stands against its budget,
send the quote, and take time sheets from the first hour to posting. Field technicians record their
visits, travel, kilometres and parts from their own assistant, get the customer's signature and ask for
follow-up work.

Every operation runs Business Central's own project logic, exactly as if a user did it, and the results
appear on the standard Business Central pages: the project card, project tasks and planning lines, the
project ledger, WIP entries, time sheets and journals.

This page is for the people who decide on the app and set it up. Bifröst Projects is an additional app on
[Bifröst Foundation](/foundation/). New to Bifröst? Start with
[How Bifröst works](/documentation/how-it-works/).

## What you can do

### Projects and planning

- **Set up a project in one step.** Create a project with its tasks and planning lines (resource, item,
  G/L account or text) in one call, or add and change tasks and planning lines later. If Business Central
  refuses any part, nothing is kept. Indent the task structure the way **Indent Project Tasks** does.
- **Keep the plan current.** Update a project, change its status (for example from Quote to Open or
  Completed) or block it, and move planning dates by a date formula or to a fixed date for a whole
  project or a range of tasks.
- **Copy and archive.** Copy a project to a new one, or copy a range of tasks with their planning lines
  into an existing project. Archive a version of a project, list its archived versions and read one.
- **Send the quote.** Send the quote of a project in status Quote to its bill-to customer through a
  document sending profile, as the **Send Project Quote** action on the project card does.
- **Buy and use what the project needs.** Create purchase orders for the items a project still needs,
  link an open purchase line to a project task, move planning lines to the project journal without posting
  them, post item usage to a task, and link posted usage to planning lines.
- **Work in progress.** Calculate WIP, read calculated and posted WIP entries, post WIP to the general
  ledger and reverse posted WIP. Read the WIP methods and create or update your own. Bring the item cost
  on project entries up to the adjusted cost after a cost adjustment.
- **See where a project stands.** Read budget, actual, billable and invoiced cost and price, the budget
  against the actual figures per task, and the standard project reports as data or as a PDF.
- **Plan resources.** Read the capacity of resources, how much of it is allocated to open projects, what
  is still available and the hours on time sheets, per day, week, month, quarter or year.

### Time sheets

- **Each person keeps their own time sheet.** From their assistant, an employee creates their time sheet
  for the week, adds lines and hours, reads it back with any rejection comments, and submits it. Only the
  owner of a time sheet submits its lines.
- **Approvers decide.** The approver named on a time sheet sees the lines waiting for them, and approves
  or rejects them, per line or for the whole sheet, with a reason when rejecting. Nobody approves their own
  time sheet.
- **Administrators run the period.** Create time sheets for chosen resources and periods, fill them from
  project planning or from the previous time sheet, register absence, reopen lines, post approved lines
  through a project journal and archive posted time sheets.
- **Usage on the time sheet.** Items and resources used, such as parts or kilometres, are recorded on the
  time sheet and go through the same approval. Approved usage is moved to the item, resource or project
  journal for posting. See [Time Sheet Usage Lines](/help/projects/ts-usage-lines/).
- **Time Sheet Date on invoices.** Sales invoice and credit memo lines created from a project show the date
  of the work they invoice. See [Time Sheet Date](/help/projects/time-sheet-date/).

### Field service

- **The technician's day.** A technician asks their assistant what is planned for today and gets a brief
  for each visit: the site, the planned hours and items, and what has already been recorded.
- **Visits that record themselves.** The technician starts and stops travel or work on a project task.
  The hours are rounded and added to their time sheet. Completing the visit records the kilometres driven
  and the outcome. Nothing is submitted until the technician submits it.
- **Parts from the van.** The technician says which parts were used; they are recorded from the van's
  stock, and the assistant can show what is left in the van and what is below its reorder point. See
  [Technician Setup](/help/projects/technician-setup/).
- **Sign-off and visit report.** The customer signs on the technician's device, and the signature and
  photos are kept with the completed visit. The visit report shows time, parts and the outcome with the signature,
  in English or Icelandic and without prices. A signed visit is locked.
- **Follow-up work.** The technician asks for follow-up work from the site. The project manager converts
  the request into a new or existing project task with planning lines, or rejects it. See
  [Project Follow-up Requests](/help/projects/follow-up-requests/).

<details>
<summary>See the pages in Business Central</summary>

**Projects Setup**

![Projects Setup](/img/projects/en-us/projects.png)

**Project Follow-up Requests**

![Project Follow-up Requests](/img/projects/en-us/follow-up-requests.png)

**Technician Setup**

![Technician Setup](/img/projects/en-us/technician-setup.png)

**Time Sheet Usage Lines**

![Time Sheet Usage Lines](/img/projects/en-us/ts-usage-lines.png)

**Time Sheet Date on a demo sales invoice**

![Time Sheet Date on a demo sales invoice](/img/projects/en-us/time-sheet-date.png)

</details>

## Capabilities

| Domain | Capabilities |
|---|---|
| **Projects** | Projects, tasks and planning lines from creation to status, copies and archived versions, project quotes, purchasing and item usage, WIP and WIP methods, budget and actual figures and standard project reports, resource capacity and allocation, time sheets from the owner's first hour through approval to posting, usage lines, and field service visits with van stock, sign-off and follow-up requests |

## Get it

Install **Bifrost Projects** next to Bifröst Foundation, from AppSource or through your Business Central
partner. It needs Business Central 28.0 or later, Essentials or Premium, and Bifröst Foundation 28.0.15.0 or
later. For the price, contact your Business Central partner.

## Set it up

| Step | What | Who |
|---|---|---|
| 1 | Install Bifröst Foundation and complete its setup, then install **Bifrost Projects**. | Business Central administrator |
| 2 | Open **Projects Setup** and check that **Enabled** is on for this company. It is on when the app is installed. | Business Central administrator |
| 3 | Assign the permission sets below to the people and services that use the app. | Business Central administrator |
| 4 | Check the Business Central setup the work needs: project number series and posting groups, WIP methods, project journal templates and batches, and **Archive Projects** in Business Central's own project setup if projects are to be archived. | Business Central administrator or partner |
| 5 | For time sheets: the time sheet settings in **Resources Setup**, and resources that use time sheets, each with a time sheet owner and an approver. | Business Central administrator |
| 6 | For field service: on **Projects Setup**, a travel work type, a mileage resource, the rounding and whether technicians may work on tasks they are not planned on. Set up each van as a location and link it to its technician on **Technician Setup**. Technician resources should use hours as their unit of measure. | Business Central administrator |

The help of each page has the details: [Projects Setup](/help/projects/projects/),
[Technician Setup](/help/projects/technician-setup/),
[Time Sheet Usage Lines](/help/projects/ts-usage-lines/) and
[Project Follow-up Requests](/help/projects/follow-up-requests/).

### Permission sets

Bifröst Projects adds its operations to Bifröst's `BIFROST Read ori` and `BIFROST Full ori`. Project work
needs one of those together with the person's own Business Central permissions to projects. Time sheets,
usage and field service also need one of these sets:

| Set | For | Assign with |
|---|---|---|
| `PROJ TS SELF ori` | Employees who keep their own time sheets | `BIFROST Read ori` |
| `PROJ TS APPROVER ori` | Approvers who approve or reject the time sheets addressed to them | `BIFROST Read ori` |
| `PROJ TS POST ori` | The people who post and archive time sheets | `BIFROST Read ori` |
| `PROJ TS ADMIN ori` | Time sheet administrators: time sheets for others, absence, reopening, the list of pending approvals, and Technician Setup | `BIFROST Full ori` (`BIFROST Read ori` to read pending approvals only) |
| `PROJ USAGE ori` | Approvers and the back office who handle usage lines | `BIFROST Full ori` (`BIFROST Read ori` to view only) |
| `PROJ FIELD TECH ori` | Field technicians: their own time sheets and usage, visits, parts from the van, sign-off and follow-up requests | `BIFROST Read ori` |
| `PROJ VISIT ori` | Visits only, for someone who already has `PROJ TS SELF ori` | `BIFROST Read ori` and `PROJ TS SELF ori` |

`PROJ TS ADMIN ori` also gives direct access to time sheets, their archive, project journal lines and
employee absence in Business Central, so assign it only to the people who administer time sheets. See
[Permission sets and gates](/documentation/end-customers/permissions/) for how the Bifröst sets work.

## Good to know

- **It acts as you.** Every call runs with the caller's own Business Central permissions and is logged on
  **Bifrost Messages**. An operation the caller has no permission for is not offered to the assistant.
- **Posting needs `BIFROST Full ori`.** Posting WIP, reversing posted WIP, posting item usage and
  archiving a project version need `BIFROST Full ori` on top of the caller's Business Central
  permissions. `BIFROST Read ori` is enough to read projects, statistics, reports and archived versions.
- **Owners submit, approvers decide.** Only the owner of a time sheet can submit its lines, and only the
  approver named on the time sheet can approve or reject them. A person's list of lines waiting for
  approval shows only their own queue.
- **Posting is final.** Posting time sheets, WIP and item usage cannot be undone by the app. Posted
  entries are corrected the usual Business Central way, and posted WIP can be reversed.
- **A signed visit is locked.** After the customer signs, the technician can no longer change the visit
  or add usage to it. To change it, ask the project manager to unlock it.
- **Signatures come from the customer.** A signature is captured from the customer, never made by the
  assistant. Bifröst Projects does not send the visit report itself; the assistant shows who it would go to
  and asks before it is sent.
- **Projects can be turned off for a company.** When **Enabled** is off on **Projects Setup**, the project
  operations and follow-up requests are not offered to assistants in that company. Time sheets, usage
  lines and visits do not depend on this switch.
- **Some data is changed only through these operations.** An assistant cannot change Projects Setup, time
  sheet status, usage line status, visit times and hours, or the decision on a follow-up request through
  Bifröst's general data operations; it uses the operations of this app, which keep Business Central's own
  checks.
- **Finding the operations.** The operations this app adds are listed with all the others by the MCP
  tools (`list_domains`, `describe_domains`, `describe_message_type`) and on Bifrost Setup, and each
  explains itself through `Help.Implementation.Get`.

[Release notes](./release-notes) · [AppSource listing text](./listing) · [AppSource validation scenarios](./user-scenarios)
