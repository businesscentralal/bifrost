---
id: orchestrator-workspace-preview
title: "Orchestrator.Workspace.Preview"
sidebar_label: "Orchestrator.Workspace.Preview"
sidebar_position: 20
description: "Request and response contract for the Orchestrator.Workspace.Preview Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


## Overview

Returns the seeded workspace that every playbook sees at start — before any steps execute.
Use this to discover the exact runtime values of `@_sys.*` and `@_who.*` for the current user and date.

**Direction**: Outbound

## Request

| Parameter | Type | Required | Description |
|---|---|---|---|
| `initialRequest` | Object | No | Simulates a runtime initial request — stored at `_initial` in the workspace |

## Response

The full workspace JSON with `_sys` (dates, environment) and `_who` (user, salesperson, company info).
If `initialRequest` was provided, it appears as `_initial`.

## Usage

**Before building a playbook** — call this to discover available workspace paths:
- `@_sys.lastMonthStart` / `@_sys.lastMonthEnd` for monthly report filters
- `@_who.companyInfo.registrationNo` for e-document exchange endpoints
- `@_who.salesperson.email` for notification recipients
- `@_who.telegramChatId` for Telegram messages

**When debugging** — compare the preview with the workspace snapshot from a failed step log.

