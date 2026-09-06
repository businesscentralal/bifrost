---
id: help-whoami-get
title: "Help.WhoAmI.Get"
sidebar_label: "Help.WhoAmI.Get"
sidebar_position: 71
description: "Request and response contract for the Help.WhoAmI.Get Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview
Returns the BC identity context of the caller — user, roles, linked master-data records (Resource, Salesperson, Employee, Customer, Vendor, Contact), notification/approval setup, company info, warehouse locations, responsibility centers, and currently pending notifications and approval requests.

Most subsection links default to BC standard fields on `User Setup`. When a `Bifrost User Setup` row exists for the user, its override fields (Resource No., Salesperson Code, Employee No., G/L Account No., Customer No., Vendor No., Contact No.) take precedence.

## Direction
Outbound

## Response Content Type
`text/json`

## Request Parameters
None. The request body is not read.

## Request Example
```json
{ "type": "Help.WhoAmI.Get" }
```

## Response Format
```json
{
  "status": "Success",
  "user": { },
  "personalization": { },
  "userSetup": { },
  "approvalSetup": { },
  "notificationSetup": { },
  "resource": { },
  "salesperson": { },
  "employee": { },
  "manager": { },
  "companyInfo": { },
  "warehouseLocations": [ ],
  "responsibilityCenters": { },
  "dueFromToOwner": [ ],
  "customer": { },
  "vendor": { },
  "contact": { },
  "systemPrompt": "...",
  "unreadNotifications": [ { "sender": "USER.ID", "subject": "Subject text", "threadId": "{GUID}" } ],
  "pendingApprovals": [ { "documentType": "Invoice", "documentNo": "R02589", "amountLCY": "471200.00", "dueDate": "2026-03-01" } ],
  "canUpdateCompanyMemory": true,
  "canSendAndCancelApprovalRequests": true
}
```

## Top-Level Result Fields
| Field | Type | Description |
|-------|------|-------------|
| status | Text | `Success` |
| user | Object | Logged-in user (User Security Id, name, language, email) |
| personalization | Object | User personalization (profile, role center, language code) |
| userSetup | Object | `User Setup` record for the user |
| approvalSetup | Object | Approval-related fields from `User Setup` |
| notificationSetup | Object | Notification entry preferences |
| resource | Object | Linked Resource (override: `Bifrost User Setup.Resource No.`) |
| salesperson | Object | Linked Salesperson/Purchaser (override: `Salesperson Code`) |
| employee | Object | Linked Employee + Resource (override: `Employee No.`) |
| manager | Object | Employee record of `employee.managerNo` |
| companyInfo | Object | `Company Information` record |
| warehouseLocations | Array | Locations the user can access |
| responsibilityCenters | Object | Sales/Purchase/Service responsibility center on `User Setup` |
| dueFromToOwner | Array | Approval entries owed by or to the user |
| customer | Object | Linked Customer (override: `Customer No.`) |
| vendor | Object | Linked Vendor (override: `Vendor No.`) |
| contact | Object | Linked Contact (override: `Contact No.`) |
| systemPrompt | Text | Effective system prompt assembled from `Bifrost Setup.System Prompt` plus `User`, `Company`, and `Tenant` memory entries |
| unreadNotifications | Array | Unread notification threads for the user. Each item: `{ sender, subject, threadId }`. Empty array `[]` when none. Use `User.Notification.Get` to read full notification content. |
| pendingApprovals | Array | Approval entries pending the caller. Each item: `{ documentType, documentNo, amountLCY, dueDate }`. `null` when the user has no approval permission or no pending entries. Use `Document.Approval.Me` to act on them. |
| canUpdateCompanyMemory | Boolean | True if the user may write Company-scoped memory |
| canSendAndCancelApprovalRequests | Boolean | True if the user can send/cancel approval requests |

## Bifrost User Setup Override Fields
When a `Bifrost User Setup` row exists for the user, these fields override standard `User Setup` links:
- Resource No.
- Salesperson Code
- Employee No.
- G/L Account No.
- Customer No.
- Vendor No.
- Contact No.

## Errors
| Scenario | Error |
|----------|-------|
| Unsupported `specVersion` | `Unsupported specification version {specVersion}. Expected version 1.0.` |

## Related Message Types
- `Help.Implementation.Get`
- `Memory.User.Get` / `Memory.User.Set` / `Memory.Company.Get` / `Memory.Company.Set`
- `User.Notification.Get` / `User.Notification.Send` / `User.Notification.Read`
- `Document.Approval.Me` / `Document.Approval.Approve` / `Document.Approval.Reject`

