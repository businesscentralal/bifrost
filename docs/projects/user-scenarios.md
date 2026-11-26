---
id: user-scenarios
title: "AppSource user scenarios"
sidebar_label: "User scenarios"
sidebar_position: 8
description: "The scenarios Microsoft's validation team executes to certify this extension for AppSource."
---

**Publisher:** Origo
**Test Environment:** A Business Central sandbox with the demo company, Bifrost Foundation installed from
AppSource, and an AI assistant connected to Bifröst. No external credentials are needed. See "AI
assistant" and "Test users" below.

---

## Test Credentials

This extension calls no external service and needs no credentials of its own. Bifrost Foundation, which
it depends on, is installed from AppSource in the same sandbox.

---

## AI assistant

Most scenarios are run through an AI assistant (for example Copilot, ChatGPT or Claude) connected to the
sandbox through the Bifröst MCP server, as described in [Connect your assistant](/setup/connect-your-ai/).
Every request the assistant makes is logged on the **Bifrost Messages** page in Business Central, where
the tester can check its status and result. The results are checked on the standard Business Central
pages.

---

## Test users

Scenario 4 needs two Business Central users, because nobody can approve their own time sheet: an
**employee** who owns the time sheet, and an **approver**. The other scenarios run as one user. Assign the
permission sets listed at the end of this page.

---

## Scenario 1: Installation and Projects Setup

**Area:** Installation & Activation

### Setup
1. Start with a Business Central sandbox with the demo company
2. Install "Bifrost Foundation" from AppSource and complete its setup as described in its own scenarios
3. Install the "Bifrost Projects" extension

### Steps
1. Open "Bifrost Setup" from the search bar and find "Bifrost Projects" in the list of installed apps
2. Search for "Projects Setup" and open the page that belongs to Bifrost Projects (it has the "General" and "Field service" groups)
3. Verify that "Enabled" is selected
4. Verify the default values in "Field service": "Rounding Minutes" = 1, "Client Time Tolerance Hours" = 24, "Allow Unplanned Tasks" not selected
5. Choose the help icon on the page

### Expected Results
- Step 1: Bifrost Projects is listed as installed
- Step 3: Projects is enabled for the company after installation
- Step 4: The field service fields show their defaults
- Step 5: The help page for Projects Setup opens on docs.bifrost.origo.is

---

## Scenario 2: Create a Project with Tasks and Planning Lines

**Area:** Core Functionality — Projects

### Setup
1. Complete Scenario 1
2. Note a customer number and a resource number from the demo data

### Steps
1. Ask the assistant: "Create a project TEST-PROJ for customer [customer number] with the description AppSource test project. Add task 1000 Installation with a budget planning line of 8 hours for resource [resource number], and task 2000 Materials."
2. Open "Projects" and open project TEST-PROJ
3. Open "Project Tasks" and the planning lines of task 1000
4. Ask the assistant: "Change the status of project TEST-PROJ to Open."
5. Ask the assistant: "Show me budget against actual for project TEST-PROJ."

### Expected Results
- Step 1: The assistant confirms the project with two tasks and one planning line
- Step 2: The project card shows customer and description as requested
- Step 3: Task 1000 has a resource planning line of 8 hours; task 2000 exists
- Step 4: The project card shows status Open
- Step 5: The answer lists the budgeted figures of task 1000 and no actual figures yet

### Error Cases
- A customer that does not exist: the assistant reports the error, and no project is created

---

## Scenario 3: Turn Projects Off for a Company

**Area:** Setup — Company Switch

### Setup
1. Complete Scenario 2

### Steps
1. Open "Projects Setup" and clear "Enabled"
2. Ask the assistant: "Change the description of project TEST-PROJ to Changed."
3. Open "Projects Setup" again and select "Enabled"
4. Repeat the request from step 2

### Expected Results
- Step 2: The assistant cannot make the change: the operation is not offered, or the request is refused with a message that Projects is disabled for this company and is enabled in Projects Setup; the project is unchanged
- Step 4: The description of project TEST-PROJ is changed

---

## Scenario 4: Submit and Approve a Time Sheet

**Area:** Core Functionality — Time Sheets

### Setup
1. Complete Scenario 2
2. In "Resources Setup", check the time sheet settings (for example the first weekday)
3. On the resource card of the resource from Scenario 2, select "Use Time Sheet", set "Time Sheet Owner User ID" to the employee user and "Time Sheet Approver User ID" to the approver user

### Steps
1. Signed in as the employee, ask the assistant: "Create my time sheet for this week."
2. Ask the assistant: "Add 4 hours today on project TEST-PROJ task 1000 to my time sheet."
3. Ask the assistant: "Submit my time sheet."
4. Signed in as the approver, ask the assistant: "Which time sheet lines are waiting for my approval?"
5. Ask the assistant: "Approve those lines."
6. Open "Time Sheets" and the time sheet of the resource

### Expected Results
- Step 1: A time sheet for the week is created for the employee's resource
- Step 2: A project line with 4 hours today is added
- Step 3: The line has status Submitted
- Step 4: The answer shows the submitted line of the employee
- Step 5: The assistant confirms the approval
- Step 6: The line has status Approved

### Error Cases
- The employee asks the assistant to approve their own time sheet: the request is refused

---

## Scenario 5: Record a Field Visit

**Area:** Core Functionality — Field Service

### Setup
1. Complete Scenario 4 (the employee's time sheet for this week exists and has a line for task 1000)
2. On "Projects Setup", set "Travel Work Type Code" to a work type, "Mileage Resource No." to a resource that is not blocked and has a base unit of measure, and "Rounding Minutes" to 15
3. Ensure the resource from Scenario 2 uses hours as its unit of measure

### Steps
1. Signed in as the employee, ask the assistant: "I started work on project TEST-PROJ task 1000 one hour ago. Record the start."
2. Ask the assistant: "Stop the visit now."
3. Ask the assistant: "Complete the visit on project TEST-PROJ task 1000, I drove 42 km, the pump was replaced."
4. Open the employee's time sheet
5. Open "Time Sheet Usage Lines"

### Expected Results
- Step 1: The assistant confirms that a visit is running, started one hour ago
- Step 2: The visit stops and about 1 hour, rounded to a multiple of 15 minutes, is added to the time sheet
- Step 3: The visit is completed
- Step 4: The hours of the visit appear on an open line for task 1000 (a new line, because the line from Scenario 4 is already approved)
- Step 5: A usage line of 42 for the mileage resource has status Open

### Error Cases
- Starting a visit on a task the resource is not planned on, with "Allow Unplanned Tasks" not selected: the request is refused

---

## Scenario 6: Follow-up Request and Conversion

**Area:** Core Functionality — Field Service

### Setup
1. Complete Scenario 5
2. The approver user is the "Project Manager" of project TEST-PROJ and may change project tasks and planning lines

### Steps
1. Signed in as the employee, ask the assistant: "Request follow-up work on project TEST-PROJ task 1000: replace the second valve, about 3 hours."
2. Open "Project Follow-up Requests"
3. Signed in as the approver, ask the assistant: "Show the follow-up requests on project TEST-PROJ."
4. Ask the assistant: "Convert that request into a new task."
5. Open "Project Follow-up Requests" and then the project tasks of TEST-PROJ

### Expected Results
- Step 2: The employee sees their request with status Open
- Step 3: The approver sees the same request
- Step 4: The assistant confirms the conversion
- Step 5: The request has status Converted with a "Converted Task No."; the new task exists with a resource planning line of 3 hours

### Error Cases
- The employee asks the assistant to convert the request: the request is refused
- Converting a request that is already Converted: the request is refused

---

## Scenario 7: Time Sheet Date on a Sales Invoice

**Area:** Core Functionality — Invoicing

### Setup
1. Complete Scenario 2
2. On task 1000 of project TEST-PROJ, add a billable planning line with a planning date

### Steps
1. Open the planning lines of task 1000 and choose "Create Sales Invoice"
2. Open the sales invoice that was created
3. Look at the "Time Sheet Date" column on the invoice lines

### Expected Results
- Step 3: The line from the project shows the planning line's document date (or planning date) in "Time Sheet Date", just before "Description"; the column cannot be edited

---

## Permission Sets

The scenarios above use these assignable permission sets, in addition to the Bifrost Foundation sets:

| Permission set | Grants | Assign with |
| --- | --- | --- |
| `PROJ TS SELF ori` | The user's own time sheets | `BIFROST Read ori` |
| `PROJ TS APPROVER ori` | Approving and rejecting the time sheets addressed to the user | `BIFROST Read ori` |
| `PROJ TS POST ori` | Posting and archiving time sheets | `BIFROST Read ori` |
| `PROJ TS ADMIN ori` | Administering time sheets for others, and Technician Setup | `BIFROST Full ori` |
| `PROJ USAGE ori` | Handling usage lines | `BIFROST Full ori` |
| `PROJ FIELD TECH ori` | Field technicians: own time sheets and usage, visits, van stock, sign-off and follow-up requests | `BIFROST Read ori` |
| `PROJ VISIT ori` | Field visits | `BIFROST Read ori` and `PROJ TS SELF ori` |

For the scenarios: the employee needs `BIFROST Read ori` and `PROJ FIELD TECH ori`, with ordinary Business
Central read access (for example `D365 READ`); the approver needs
`BIFROST Full ori` and `PROJ TS APPROVER ori`, with Business Central permission to change projects. The user
of Scenarios 1 to 3 and 7 needs `BIFROST Full ori` and Business Central permission to projects and sales
documents.
