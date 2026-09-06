---
id: iceland-customs-categories
title: "Iceland.Customs.Categories"
sidebar_label: "Iceland.Customs.Categories"
sidebar_position: 23
description: "Request and response contract for the Iceland.Customs.Categories Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the full Icelandic customs tariff product category tree from island.is.
Use this to browse or search for the correct tariff number before calling `Iceland.Customs.Calculate`.

**Direction:** Outbound  
**Content-Type:** text/json  
**Authentication:** None — public island.is API.

## Use when
- You need to look up the correct tariff number for a product before calculating import duties.
- You want to display the Icelandic customs category tree to a user for selection.
- You are building a customs classification workflow and need the full category hierarchy.

## Request

- **Subject**: Not used. Leave empty.
- **Body**: Not used.

## Response structure

- `topLevel`: Hierarchical tree of product categories (up to 3 levels).
  - Each node: `id`, `label`, `description`, `children[]`
- `bottomLevel`: Flat list of all leaf categories with tariff numbers.
  - Each item: `id`, `tariffNumber`, `label`, `description`, `parentLabels[]`

## AI/Agent playbook
1. Call with empty subject to retrieve the full category tree.
2. Use `bottomLevel` for flat search — filter by `label` or `description` to find matching tariff numbers.
3. Pass the found `tariffNumber` to `Iceland.Customs.Calculate` to compute the actual duty amount.
4. Use `topLevel` for hierarchical navigation in a UI picker or guided classification flow.
Capability boundary: reads public API data only; no BC records are modified.

## Authentication

None required — public API.

## Status

> **NOT YET LIVE** — endpoint merged to island.is but not deployed to production as of 2026-06-27.

## Troubleshooting - outbound HTTP blocked
If a call fails with an outbound HTTP blocked error:
1. Open **Extension Management** in Business Central.
2. Find **Bifrost Iceland** and open **Extension Settings**.
3. Turn on **Allow HttpClient Requests**.
4. If your environment uses an endpoint allowlist, allow `https://api.island.is`.

