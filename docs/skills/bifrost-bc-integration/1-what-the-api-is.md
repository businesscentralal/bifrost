---
id: 1-what-the-api-is
title: "1. What the API Is"
sidebar_label: "1. What the API Is"
sidebar_position: 2
---

The Origo Bifrost extension for Business Central exposes a REST API (Bifrost API v1.0)
whose message envelope draws on ideas from the [CNCF CloudEvents specification](https://cloudevents.io/).
Instead of dozens of entity-specific OData endpoints, **every operation is a Bifrost message** sent to
one of three endpoints: `/tasks` (synchronous), `/queues` (asynchronous), or
`/responses` (fetch results).

All business logic (read records, write records, check credit limits, get PDFs, …) is
selected by the `type` field of the message envelope.

---
