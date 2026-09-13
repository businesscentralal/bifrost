---
id: orchestrator-email-send
title: "Orchestrator.Email.Send"
sidebar_label: "Orchestrator.Email.Send"
sidebar_position: 2
description: "Request and response contract for the Orchestrator.Email.Send Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Sendir an email draft created by Email.Draft.Stilltu. Requires the outboxSystemId úr the draft response.

**Direction**: Inn á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `outboxSystemId` | GUID | Yes* | SystemId of the Email Outbox entry (from Email.Draft.Stilltu response) |
| `subject` | GUID | Yes* | Alternative: pass outboxSystemId as envelope subject |

## Svar

```json
{ "status": "Success", "messageId": "<guid>", "outboxSystemId": "<guid>" }
```

## Playbook Pattern

Two-step email flow in a playbook:
1. Step N: `Email.Draft.Set` — template: `{"to":"...","subject":"...","htmlBody":"@prev.report"}`
   Stilltu `ResultLogPaths = "outboxSystemId"` to capture the draft ID in vinnusvæði
2. Step N+10: `Orchestrator.Email.Send` — template: `{"outboxSystemId":"@N.outboxSystemId"}`
   Notaðus `@` vinnusvæði reference to the draft's outboxSystemId

This separation allows:
- Using Email.Draft.Stilltu fyrir review-before-send workflows (skip the Send step)
- Reusing Email.Draft.Stilltu's full feature set (attachments, scenarios, CC/BCC)
- Keeping Orchestrator.Email.Send simple og focused

