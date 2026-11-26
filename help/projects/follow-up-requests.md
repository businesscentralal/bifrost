---
id: follow-up-requests
title: "Project Follow-up Requests"
sidebar_position: 2
---

**Project Follow-up Requests** lists the follow-up work that technicians have asked for on project tasks,
and what the project manager decided about each request. A technician uses it to see their own requests;
a project manager uses it to see the requests on the projects they manage.

A request is made from the technician's assistant, usually at the end of a visit: "the second pump valve
needs replacing, about three hours, next week". It names the project task it came from, the technician's
resource, a description, and optionally estimated hours, parts, a preferred date, an urgency and photos.
The project manager then converts the request into project work or rejects it, also from an assistant.
This page shows the requests and the result; it does not change them.

Search for **Project Follow-up Requests** in Business Central to open it.

<!-- screenshot: Project Follow-up Requests 1033 -->
<!-- screenshot: Project Follow-up Requests 1039 -->

## Which requests you see

- **A technician** sees the requests they made themselves.
- **A project manager** sees the requests on projects where they are the **Project Manager**, or where the
  **Person Responsible** is a resource whose time sheets they own. A project manager is someone who may
  change project tasks and planning lines in Business Central.

## Fields

| Field | What it shows |
| --- | --- |
| **Request No.** | The number of the request. |
| **Project No.** | The project the request is about. |
| **Original Task No.** | The project task the technician was working on when the request was made. |
| **Technician Resource No.** | The technician's resource. |
| **Description** | What needs to be done. |
| **Estimated Hours** | The technician's estimate of the hours the work needs, if given. |
| **Preferred Date** | When the work should preferably be done, if given. |
| **Urgency** | How urgent the technician says the work is, if given. |
| **Status** | **Open** until the project manager decides, then **Converted** or **Rejected**. |
| **Converted Task No.** | The project task the request was converted into, a new one or an existing one. |
| **Resource Planning Line No.** | The resource planning line created for the estimated hours, when the request was converted. |
| **Decided At** | When the request was converted or rejected. |
| **Rejection Reason** | Why the request was rejected. |

The page has no actions of its own.

## What converting does

Converting a request turns it into project work, in one step that either succeeds completely or changes
nothing:

- **New task or existing task.** The request becomes a new project task, numbered after the original task
  by the **Follow-up Task Increment** on [Projects Setup](/help/projects/projects/), or adds its work to an
  existing task, by default the original one.
- **Planning lines.** The estimated hours become a resource planning line. Parts with an item number
  become item planning lines; parts described only in words become text planning lines.
- **Preview first.** The project manager's assistant can show what the conversion would create, without
  keeping any change, before converting.
- **Nothing is posted.** A converted request can then be quoted to the customer like any other project
  work.

## Good to know

- **A decision is final.** A request is converted or rejected once; it cannot be decided again. The
  rejection reason is kept on the request.
- **Open requests can still be edited.** While a request is Open, the technician who made it or the
  project manager responsible can change its content. After the decision it is kept as it was.
- **Technicians cannot decide.** A technician's assistant can make and list requests, but not convert or
  reject them.
- **Permissions.** Technicians need `BIFROST Read ori` and `PROJ FIELD TECH ori`. Project managers need
  `BIFROST Full ori` and permission to change project tasks and planning lines. **Enabled** on Projects
  Setup must be on.
- **No message is sent.** Making a request does not notify anyone; the project manager sees it here and
  in their assistant.

More about the app: [Bifröst Projects](/projects/).
