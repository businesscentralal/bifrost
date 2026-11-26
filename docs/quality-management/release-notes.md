---
id: release-notes
title: "Quality Management release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "Customer-facing changes in Bifröst Quality Management."
---

# Bifröst Quality Management release notes

These notes help quality teams and administrators review what the app changes. To check your installed version, open **Extension Management** in Business Central.

## 28.0.0.0 — Unreleased

### Initial capabilities

- Create an inspection from a source record with a selected template or Microsoft's configured generation rules.
- Record a test value on an open inspection with standard validation and recalculation of the result.
- Finish an inspection using the standard quality checks. Reopen a finished inspection with the required administrator permissions, or create a re-inspection with refreshed tests and preserved history.
- Prepare movements for passed or failed quantities, or post item or warehouse reclassification when requested and permitted.
- Create an unposted purchase return order for a failed quantity from a purchase inspection.
- Use English or Icelandic guidance, with the app available through Foundation and separate full and read access roles.

### Corrections included

- Clearer guidance for invalid inputs, missing inspections, insufficient permissions and inspections whose status does not allow the requested work. Business Central's standard validation still applies.
- Corrected permissions for finishing and reopening inspections, including the notification setting used during an interactive finish. Read access does not grant permission to change an inspection.
- Clearer confirmation guidance for inventory movements. Review the selected inspection and movement before proceeding; an omitted preview is not a substitute for deciding whether to post.
- Corrected help addresses and Icelandic help text.

### Requirements

This version requires Bifröst Foundation **28.0.15.6** or later and Microsoft's Quality Management app **28.5.0.0** or later, on a compatible Business Central version.

See the [overview](./index.md) for setup and the [user scenarios](./user-scenarios.md) for review steps before changing stock or creating returns.
