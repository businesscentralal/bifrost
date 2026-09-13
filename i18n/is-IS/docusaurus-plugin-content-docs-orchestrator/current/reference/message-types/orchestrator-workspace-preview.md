---
id: orchestrator-workspace-preview
title: "Orchestrator.Workspace.Preview"
sidebar_label: "Orchestrator.Workspace.Preview"
sidebar_position: 20
description: "Request and response contract for the Orchestrator.Workspace.Preview Bifröst message type."
---

:::info Mynduð síða
Þessi síða er mynduð úr eigin hjálparkóðaeiningu skilaboðategundarinnar með
`tools/generate-message-type-docs.ps1`. Breyttu hjálparkóðaeiningunni í forritinu, ekki þessari skrá.
:::


## Yfirlit

Skilar the seeded vinnusvæði that every playbook sees at start — áður en any steps execute.
Notaðu this to discover the exact runtime gildi of `@_sys.*` og `@_who.*` fyrir the current notandi og dagsetning.

**Direction**: Út á við

## Beiðni

| Parameter | Type | Nauðsynlegt | Lýsing |
|---|---|---|---|
| `initialRequest` | Object | No | Simulates a runtime initial request — stored at `_initial` in the vinnusvæði |

## Svar

The full vinnusvæði JSON með `_sys` (dagsetnings, environment) og `_who` (notandi, salesperson, company info).
Ef `initialRequest` was gefið, it appears as `_initial`.

## Usage

**Before building a playbook** — call this to discover available vinnusvæði slóðs:
- `@_sys.lastMonthStart` / `@_sys.lastMonthEnd` fyrir monthly report filters
- `@_who.companyInfo.registrationNo` fyrir e-skjal exchange endpoints
- `@_who.salesperson.email` fyrir notification recipients
- `@_who.telegramChatId` fyrir Telegram messages

**When debugging** — compare the preview með the vinnusvæði snapshot úr a failed step log.

