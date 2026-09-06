---
id: 3b-listing-message-history-get-queues-tasks
title: "3b. Listing Message History (get queues / tasks)"
sidebar_label: "3b. Listing Message History (get queues / tasks)"
sidebar_position: 5
---

Both endpoints support standard OData **GET** to list previously submitted messages. Use `$filter` on `source` to scope results to your own application.

> **Note:** Results are automatically scoped to the calling Entra Application — you will
> never see records created by another application. The `source` filter is an additional
> optional label you control; it does not replace or weaken security isolation.

Once you have a message `id`, call `/data` directly on either endpoint — no prior lookup needed:

| What you want | URL |
|---|---|
| Full response body | `GET /responses({id})/data` |
| Original request payload | `GET /requests({id})/data` |

### List queue history
```http
GET /companies({companyId})/queues?$filter=source eq 'MyApp v1.0'
Authorization: Bearer {token}
```

### List task history
```http
GET /companies({companyId})/tasks?$filter=source eq 'MyApp v1.0'
Authorization: Bearer {token}
```

Without a filter you get all your own application's messages — the Entra isolation
already ensures you never see another application's data.

### Response shape (same for both endpoints)

```json
{
  "@odata.context": ".../$metadata#companies(...)/queues",
  "value": [
    {
      "@odata.etag": "W/\"...\"",
      "id": "fb304e23-2aac-43fa-a16d-5bc837a52830",
      "specversion": "1.0",
      "type": "Data.Records.Get",
      "source": "MyApp v1.0",
      "time": "2026-03-16T10:18:51.303Z",
      "subject": "",
      "lcid": 0,
      "datacontenttype": "text/json",
      "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(fb304e23-2aac-43fa-a16d-5bc837a52830)/data"
    }
  ]
}
```

Key fields:

| Field | Description |
|---|---|
| `id` | Message GUID — use it as the queue/task ID and as the response ID |
| `type` | The message type that was executed |
| `source` | The caller identifier set in the original request |
| `time` | When the message was submitted (UTC) |
| `subject` | Optional subject sent by the caller (table name, document no., etc.) |
| `lcid` | Language requested (0 = default) |
| `datacontenttype` | Content type of the response (`text/json`, `text/markdown`, `application/pdf`, …) |
| `data` | Absolute URL to fetch the response body — GET this URL to retrieve results |

The `data` URL is always in the form `.../responses({id})/data`. You can fetch it at any time after the message is processed.

### Queue-specific: poll status, retry and cancel

These actions are only available on `/queues`, not `/tasks` (tasks are already completed synchronously).

**Poll status**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.GetStatus
Authorization: Bearer {token}
```

Returns the current processing status with standard HTTP status codes:

| Status | HTTP Code | Meaning |
|--------|-----------|---------|
| `Created` | 201 Created | Job is still running |
| `Updated` | 200 OK | Job completed successfully — `data` URL is ready |
| `Deleted` | 204 No Content | Queue entry no longer exists |
| `None` | 204 No Content | Unknown / not found |

**Retry a failed job**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.RetryTask
Authorization: Bearer {token}
```

Requeues the same message for re-processing. Use after investigating a `Created`-but-stalled or errored entry.

| Status | HTTP Code | Meaning |
|--------|-----------|--------|
| `Created` | 201 Created | Task is already running — cannot retry |
| `Updated` | 200 OK | Task successfully restarted |
| `None` | 204 No Content | Failed to create background task |

**Cancel a running job**
```http
POST /companies({companyId})/queues({id})/Microsoft.NAV.CancelTask
Authorization: Bearer {token}
```

Cancels a running or scheduled background task. If no task is scheduled, returns immediately.

| Status | HTTP Code | Meaning |
|--------|-----------|--------|
| `Deleted` | 204 No Content | No task was scheduled |
| `Updated` | 200 OK | Task successfully cancelled |
| `None` | 204 No Content | Cancellation failed |

### JavaScript polling pattern

```js
async function pollUntilDone(companyId, messageId, token, maxWaitMs = 30_000) {
  const base = `${BASE_URL}/companies(${companyId})/queues(${messageId})`;
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const st = await fetch(`${base}/Microsoft.NAV.GetStatus`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    if (st.value === 'Updated') return; // done
    if (st.value === 'Deleted')  throw new Error('Queue entry deleted');
    await new Promise(r => setTimeout(r, 2000)); // wait 2 s before next poll
  }
  throw new Error('Timed out waiting for queue message to complete');
}
```

---
