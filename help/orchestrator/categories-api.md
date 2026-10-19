---
id: categories-api
title: "Job Queue Categories"
sidebar_label: "Job Queue Categories"
sidebar_position: 22
---

The **Job Queue Categories** API gives integrations access to the job queue categories in the company. A category groups job queue entries, and Business Central runs only one entry of a category at a time. An integration uses this API to read the categories, for example to pick one for a new job, and can also create or change them. It has no page in Business Central; people do not open it.

It is one of the [Job Queue Orchestrator APIs](/help/orchestrator/scheduled-entry-api/) and is published at `/api/origo/jobQueueOrchestrator/v1.0/queueCategories`.

## Fields

| Field | Description |
| --- | --- |
| `code` | The code of the category, up to 10 characters. |
| `description` | A description of the category, up to 30 characters. |
