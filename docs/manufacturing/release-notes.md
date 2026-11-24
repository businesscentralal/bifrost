---
id: release-notes
title: "Release notes"
sidebar_label: "Release notes"
sidebar_position: 90
description: "What changed in each version of Bifröst Manufacturing published on Microsoft AppSource."
---

# Bifröst Manufacturing release notes

This page is for the people who decide on the app and run it. It lists the versions of Bifröst Manufacturing published on Microsoft AppSource, newest first. To see the version installed in your company, open **Extension Management** in Business Central.

## 28.0.0.0 — first release (date set at release)

### Added

- **Production orders.** Create a production order, or create orders from the lines of a released sales order (one order per sales line, or one for the whole sales order), each new order line reserved against its sales line. Refresh an order to calculate its lines, components and routing. Orders created from demand are firm planned by default; lines that cannot be produced come back with the reason and the next step.
- **Status and finishing.** Change the status of an order, check whether it can be finished, finish it, and reopen a finished order once. Missing output or consumption, consumption without output, and open subcontract orders or picks are reported and refused unless you accept them.
- **Production BOMs and routings.** Certify a production BOM or a routing version, or set it under development or closed. A version that cannot be certified is explained in your session language. Copy a version into a new Under Development version, and exchange one component for another across production BOMs, with new versions created and certification rolled back as a whole if it fails.
- **Where used.** See the production BOMs that use an item on a date, with levels and required quantities.
- **Availability and statistics.** Component availability with shortages that take reservations into account, and the cost and quantity statistics of a production order.
- **Production journal.** Look at the journal an order would produce, preview posting without keeping anything, and post it. Post exactly the lines you list, with line errors collected together.
- **Corrections.** Reverse a posted output or consumption entry as a whole, with the original tracking kept.
- Operations that post or cannot be undone report how many records they would affect and ask you to confirm that count first.
- Posting operations need the separate permission set **Bifrost Manufacturing Posting** (`BIFROST MfgPost ori`).
- Refusals say what was wrong, which value caused it and what to do next, in English and Icelandic.
- Bifröst Manufacturing needs Bifröst Foundation 28.0.11 or later.
