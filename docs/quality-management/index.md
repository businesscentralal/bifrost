---
id: index
title: "Bifröst Quality Management"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Quality inspections and inventory dispositions in Business Central from an assistant or integration."
---

# Bifröst Quality Management

Bifröst Quality Management lets quality teams create inspections, record test results and decide what happens to inspected goods from an assistant or integration. It uses Microsoft's **Quality Management** app in Business Central. Review the results on the standard Quality Management pages.

An additional app on [Bifröst Foundation](/foundation/). New to Bifröst? Start with [How Bifröst works](/documentation/how-it-works/).

## What you can do

- **Create an inspection** for a source record, using a selected template or the configured generation rules.
- **Record a test value** on an open inspection. Business Central validates the value and recalculates the inspection result.
- **Finish an inspection** after the required checks, or reopen a finished inspection when your permissions and the inspection history allow it.
- **Create a re-inspection** to check the goods again, keeping the inspection history.
- **Move inspected goods** using the passed or failed quantity, for example to a quarantine location or bin. Depending on the method, prepare movement work or post a reclassification.
- **Create a purchase return order** for a failed quantity from a purchase inspection. The return order is created unposted for review.

## Before you start

1. Follow [Set it up](/setup/) to prepare Foundation and connect your assistant or integration.
2. Install Microsoft's Quality Management app and Bifröst Quality Management. Have your administrator configure quality templates, tests, number series, source mappings and generation rules in Business Central.
3. Ask your administrator for the app's **Bifrost Quality Full** permission set and the Business Central permissions needed for the source documents and inventory work. Read access alone does not allow changes. Reopening also requires Microsoft's quality administrator permissions.
4. Try an inspection with sample data and review its result in Business Central before using the workflow for daily work.

## Review before changing stock

An inventory movement can post immediately when you request posting with a reclassification method. Other movement methods prepare work for later handling. Check the inspection, passed or failed quantity, source and destination, and whether posting is requested before confirming.

Creating an inspection, a re-inspection, a movement or a purchase return again may create additional work. Check the previous result before retrying. A purchase return does not post a vendor credit memo; review and process the return in Business Central.

The app adds no pages of its own. Use the standard Quality Management pages to review inspections and their history, and the standard inventory and purchasing pages to review the resulting work.

Next: follow the [user scenarios](./user-scenarios.md), or read the [release notes](./release-notes.md).
