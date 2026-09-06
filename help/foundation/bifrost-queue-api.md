---
id: bifrost-queue-api
title: "Bifrost Queue API"
sidebar_label: "Bifrost Queue API"
sidebar_position: 17
---

Use this API page to submit bifrost messages for asynchronous processing. Business Central stores the request, schedules a background task, and returns the response later through the response endpoint or webhook flow.

## Endpoint

`/api/origo/bifrost/v1.0/queues`

## What the page does

-   Accepts a Bifrost request payload with type, source, subject, and data.
-   Creates a Bifrost message record for the current user.
-   Schedules background processing and returns the queued message reference.
