---
id: help-whoami-get
title: "Help.WhoAmI.Get"
sidebar_label: "Help.WhoAmI.Get"
sidebar_position: 71
description: "Beiðni- og svarsamningur fyrir Help.WhoAmI.Get Bifröst skilaboðategund."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóða skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðanum í forritinu, ekki þessari skrá.
:::


## Yfirlit
Skilar the BC identity context of Kallandinn — user, roles, linked master-data færslur (Resource, Salesperson, Employee, viðskiptamanni, birgi, Contact), notification/approval setup, company info, warehouse locations, responsibility centers, og currently pending notifications og approval requests.

Most subsection links Sjálfgefið til BC standard fields on `User Setup`. þegar a `Bifrost User Setup` row exists fyrir the user, its override fields (Resource No., Salesperson Code, Employee No., G/L Account No., viðskiptamanni No., birgi No., Contact No.) take precedence.

## Stefna
Útgående

## Response Content Gerð
`text/json`

## Beiðnibreytur
None. Beiðnin body er ekki lesa.

## Dæmi um beiðni
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
| Reitur | Gerð | Lýsing |
|-------|------|-------------|
| status | Text | `Success` |
| user | hlutur | Logged-in user (User Security Id, Heiti, language, email) |
| personalization | hlutur | User personalization (profile, role center, language code) |
| userSetup | hlutur | `User Setup` færsla fyrir the user |
| approvalSetup | hlutur | Approval-related fields úr `User Setup` |
| notificationSetup | hlutur | Notification færsla preferences |
| resource | hlutur | Linked Resource (override: `Bifrost User Setup.Resource No.`) |
| salesperson | hlutur | Linked Salesperson/Purchaser (override: `Salesperson Code`) |
| employee | hlutur | Linked Employee + Resource (override: `Employee No.`) |
| manager | hlutur | Employee færsla of `employee.managerNo` |
| companyInfo | hlutur | `Company Information` færsla |
| warehouseLocations | fylki | Locations the user getur access |
| responsibilityCenters | hlutur | Sales/Purchase/Service responsibility center on `User Setup` |
| dueFromToOwner | fylki | Approval færslur owed með eða til the user |
| viðskiptamanni | hlutur | Linked viðskiptamanni (override: `Customer No.`) |
| birgi | hlutur | Linked birgi (override: `Vendor No.`) |
| contact | hlutur | Linked Contact (override: `Contact No.`) |
| systemPrompt | Text | Effective system prompt assembled úr `Bifrost Setup.System Prompt` plus `User`, `Company`, og `Tenant` memory færslur |
| unreadNotifications | fylki | Unread notification threads fyrir the user. hver vöru: `{ sender, subject, threadId }`. Empty fylki `[]` þegar none. nota `User.Notification.Get` til lesa full notification content. |
| pendingApprovals | fylki | Approval færslur pending Kallandinn. hver vöru: `{ documentType, documentNo, amountLCY, dueDate }`. `null` þegar the user has no approval heimild eða no pending færslur. nota `Document.Approval.Me` til act on them. |
| canUpdateCompanyMemory | sanngildi | True ef the user may skrifa Company-scoped memory |
| canSendAndCancelApprovalRequests | sanngildi | True ef the user getur send/cancel approval requests |

## Bifrost User Setup Override Fields
þegar a `Bifrost User Setup` row exists fyrir the user, these fields override standard `User Setup` links:
- Resource No.
- Salesperson Code
- Employee No.
- G/L Account No.
- viðskiptamanni No.
- birgi No.
- Contact No.

## Villur
| Scenario | Villa |
|----------|-------|
| Unsupported `specVersion` | `Unsupported specification version {specVersion}. Expected version 1.0.` |

## Tengdar skilaboðategundir
- `Help.Implementation.Get`
- `Memory.User.Get` / `Memory.User.Set` / `Memory.Company.Get` / `Memory.Company.Set`
- `User.Notification.Get` / `User.Notification.Send` / `User.Notification.Read`
- `Document.Approval.Me` / `Document.Approval.Approve` / `Document.Approval.Reject`

