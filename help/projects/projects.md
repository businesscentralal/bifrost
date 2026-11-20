---
id: projects
title: "Projects Setup"
sidebar_position: 1
---

**Projects Setup** turns the project operations of Bifröst Projects on or off for this company. It is
for the administrator who decides whether assistants and integrations may work with projects here.

Open it from the list of installed apps on [Bifrost Setup](/help/foundation/bifrost-setup/), or search
for **Projects Setup** in Business Central. Business Central has a standard page with the same name for
its own project settings; this one has a single field, **Enabled**. There is one setup record per
company; it is created when the app is installed, or the first time the page opens.

## Fields

| Field | What it does |
| --- | --- |
| **Enabled** | When on, assistants and integrations can use the project operations in this company: projects, tasks and planning lines, status, copies, archives, quotes, usage, WIP, statistics, reports and resource allocation. When off, those operations are not offered, and a call to one of them answers with an error that says Projects is turned off and how to turn it on. On when the setup record is created. |

## Good to know

- **The time sheet operations are not affected.** Creating, submitting, approving, posting and
  archiving time sheets through Bifröst does not depend on this field; it depends on the caller's
  permissions to time sheets.
- **Turning it on grants no permission.** Callers still need their own Business Central permissions
  to projects and Bifröst's `BIFROST Read ori` or `BIFROST Full ori`. An operation the caller has no
  permission for is not offered to the assistant.
- **Posting needs `BIFROST Full ori`.** Posting WIP, posting item usage, linking purchase lines to a
  project and archiving a project version need it on top of the caller's Business Central permissions.
  `BIFROST Full ori` also lets a user open and change this page.
- **Change it here.** An assistant cannot change this page's setting through Bifröst's general data
  operations.

More about the app: [Bifröst Projects](/projects/).
