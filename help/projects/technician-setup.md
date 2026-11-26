---
id: technician-setup
title: "Technician Setup"
sidebar_position: 3
---

**Technician Setup** links each field technician to the van they work from. It is for the administrator who
sets up field service. With a van set up, a technician's assistant can see what is in the van and record
the parts used on a visit, taken from the van's stock.

Search for **Technician Setup** in Business Central to open it. Add one line per technician.

<!-- screenshot: Technician Setup 1033 -->
<!-- screenshot: Technician Setup 1039 -->

## Fields

| Field | What it does |
| --- | --- |
| **Resource No.** | The technician's resource. One line per resource. |
| **Van Location Code** | The location that holds the stock in the technician's van. Set up each van as a location in Business Central. |
| **Default Bin Code** | The bin that parts are taken from when the technician does not say which bin. Only bins at the van location can be chosen. Leave it blank if the van location does not use bins. |

## What it is used for

- **Parts used on a visit.** When a technician tells the assistant which parts were used, each part is
  found by item number, item reference or description and recorded as an open usage line at the van
  location and default bin. If a part matches more than one item, nothing is recorded, so the technician
  can say which one was meant. A part that is short in the van is recorded with a warning.
- **Van stock.** The assistant can show what is in the van, after the parts already recorded but not yet
  posted, and which items are below their reorder point (the stockkeeping unit's for the van location, or
  else the item's).
- **Usage lines** recorded this way go through the same approval as other usage on time sheets; see
  [Time Sheet Usage Lines](/help/projects/ts-usage-lines/). Restocking the van is ordinary Business
  Central inventory work, for example a transfer order.

## Good to know

- **Who can change it.** Users with `PROJ TS ADMIN ori` can open and change this page. Technicians with
  `PROJ FIELD TECH ori` use the setup but cannot change it.
- **Without a line here**, a technician can still record visits and time, but not parts from a van: the
  assistant answers that an administrator must set the van location here.

More about the app: [Bifröst Projects](/projects/).
