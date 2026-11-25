---
id: projects
title: "Projects Setup"
sidebar_position: 1
---

**Projects Setup** holds the company settings of Bifröst Projects: whether assistants and integrations may
work with projects in this company, and how field visits record time, travel and mileage. It is for the
administrator who sets the app up.

Open it from the list of installed apps on [Bifrost Setup](/help/foundation/bifrost-setup/), or search for
**Projects Setup** in Business Central. Business Central has a standard page with the same name for its own
project settings; this one has the **General** and **Field service** groups described below. There is one
setup record per company. It is created when the app is installed, or the first time the page opens.

![Projects Setup](/img/projects/en-us/projects.png)

## General

| Field | What it does |
| --- | --- |
| **Enabled** | When on, assistants and integrations can use the project operations in this company: projects, tasks and planning lines, status, copies, archives, quotes, usage, WIP, statistics, reports, resource allocation and follow-up requests. When off, those operations are not offered, and a call to one of them answers with an error that says Projects is turned off and that it is turned on here. On when the setup record is created. |

## Field service

These fields are used when a technician records a visit from an assistant: starting and stopping work or
travel on a project task, and completing the visit.

| Field | What it does |
| --- | --- |
| **Follow-up Task Increment** | The numbering step for a new project task created from a follow-up request. The new task is numbered after the task the request came from and stays within that task's group. Zero uses one. From 0 to 10,000. |
| **Travel Work Type Code** | The work type that travel time is recorded with on the time sheet. Travel cannot be recorded until a work type that exists is chosen here. |
| **Mileage Resource No.** | The resource that kilometres driven are recorded with when a visit is completed. The resource must not be blocked and must have a base unit of measure. Kilometres cannot be recorded until it is set. |
| **Rounding Minutes** | How the length of a visit is rounded before the hours are added to the time sheet: to the nearest multiple of this number of minutes. With 15, a visit of 52 minutes is recorded as 45 minutes and one of 53 minutes as 1 hour. Zero or one uses one minute. |
| **Client Time Tolerance Hours** | How many hours back a technician's assistant may give the time a visit started or stopped, for example when the technician records a visit afterwards. An older time is refused. Zero uses 24 hours. |
| **Allow Unplanned Tasks** | When on, a technician can start a visit on a project task that has no planning line for their resource. When off, a visit can only be started on a task the technician is planned on. Off when the setup record is created. |

## Good to know

- **Time sheets are not affected by Enabled.** Creating, submitting, approving, posting and archiving time
  sheets, usage lines and field visits do not depend on this field. They depend on the caller's
  permissions to time sheets and to the app's permission sets.
- **Turning it on grants no permission.** Callers still need their own Business Central permissions to
  projects and Bifröst's `BIFROST Read ori` or `BIFROST Full ori`. An operation the caller has no
  permission for is not offered to the assistant.
- **Who can change it.** `BIFROST Full ori` lets a user open and change this page. `BIFROST Read ori`
  lets the app read the settings but not change them.
- **Change it here.** An assistant cannot change this page's settings through Bifröst's general data
  operations.
- **Hours use the resource's unit.** Visit hours are added to the time sheet as quantities of the
  technician's resource, so technician resources should use hours as their unit of measure.

More about the app: [Bifröst Projects](/projects/). Technicians' vans are set up on
[Technician Setup](/help/projects/technician-setup/).
