# The queue API

What the Bifröst API is and how a call is made: the three endpoints (`/tasks` synchronous, `/queues` asynchronous, `/responses({id})/data` for results), reading back the original request, listing message history, polling, retrying and cancelling a queued message, and the exact shape of the request envelope. Read this before any other reference — every other message type rides on top of what is described here.

[← back to SKILL.md](../SKILL.md) · originally sections 1, 3, 3b, 4 of the single-file skill.

---

## 1. What the API Is

The Origo Bifrost extension for Business Central exposes a REST API (Bifrost API v1.0)
whose message envelope draws on ideas from the [CNCF CloudEvents specification](https://cloudevents.io/).
Instead of dozens of entity-specific OData endpoints, **every operation is a Bifrost message** sent to
one of three endpoints: `/tasks` (synchronous), `/queues` (asynchronous), or
`/responses` (fetch results).

All business logic (read records, write records, check credit limits, get PDFs, …) is
selected by the `type` field of the message envelope.

---

## 3. Three Endpoints

### 3.1 `/tasks` — Synchronous (preferred for real-time use)

POST a message. BC processes it immediately. The `data` field in the response is a
**full absolute URL** ending in `/data`. GET that URL to retrieve the result.

```http
POST /companies({companyId})/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "specversion": "1.0",
  "type": "Data.Records.Get",
  "source": "MyApp v1.0",
  "subject": "Customer",
  "data": "{\"tableName\":\"Customer\",\"take\":100}"
}
```

Response:
```json
{
  "id": "7df25b48-ec25-498f-b8cf-566044ae020d",
  "type": "Data.Records.Get",
  "data": "https://api.businesscentral.dynamics.com/v2.0/{tenantGuid}/UAT/api/origo/bifrost/v1.0/companies({companyId})/responses(7df25b48-ec25-498f-b8cf-566044ae020d)/data"
}
```

Then:
```http
GET {task.data}
Authorization: Bearer {token}
```

### 3.2 `/queues` — Asynchronous

Same request body. BC returns immediately; job runs in background.

```http
POST /companies({companyId})/queues                                         ← submit
POST /companies({companyId})/queues({id})/Microsoft.NAV.GetStatus           ← poll
POST /companies({companyId})/queues({id})/Microsoft.NAV.RetryTask           ← retry
POST /companies({companyId})/queues({id})/Microsoft.NAV.CancelTask          ← cancel
GET  /companies({companyId})/queues({id})                                   ← read
```

**GetStatus Response:**  
Returns standard HTTP status codes based on message state:

| Semantic Status | HTTP Status Code | Meaning |
|-----------------|------------------|----------|
| `Created` | 201 Created | Message is still running/processing |
| `Updated` | 200 OK | Processing complete, results available |
| `Deleted` | 204 No Content | No task scheduled |
| `None` | 204 No Content | Message status unknown |

### 3.3 `/responses({id})/data` — Download Results

If you already know the message ID, call `/data` directly — no prior lookup required:

```http
GET /companies({companyId})/responses({id})/data
Authorization: Bearer {token}
```

The URL in `task.data` / `queue.data` is always this same pattern with the internal tenant GUID. You can also construct it yourself from a known message ID (e.g. from webhooks or your own storage).

> **Tenant GUID note:** The `data` URL returned by BC uses the internal tenant GUID (e.g. `9069b642-…`), not the named tenant domain (e.g. `contoso.onmicrosoft.com`). If you construct the URL yourself use the named tenant form like the example above — both work.

### 3.4 `/requests({id})/data` — Read the Original Request Payload

Returns the raw request body that was originally sent for a message. Call `/data` directly when you know the ID:

```http
GET /companies({companyId})/requests({id})/data
Authorization: Bearer {token}
```

Or fetch the OData record (includes `id` + `data` fields) without the `/data` suffix:

```http
GET /companies({companyId})/requests({id})
Authorization: Bearer {token}
```

Response:
```json
{
  "id": "8440906f-113b-4c21-90a0-3a016a4ea043",
  "data": "{\"tableName\":\"G/L Entry\",\"startDateTime\":\"2020-01-01T00:00:00Z\"}"
}
```

The `id` is the same GUID as the queue or task message — no extra lookup needed. Results are scoped to the current application (`SystemCreatedBy`).

---

## 3b. Listing Message History (GET queues / tasks)

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

## 4. Request Envelope

Every POST body follows this structure:

| Field | Required | Type | Notes |
|---|---|---|---|
| `specversion` | Yes | string | Always `"1.0"` |
| `type` | Yes | string | Message type, e.g. `"Data.Records.Get"` |
| `source` | Yes | string | Caller identifier, e.g. `"MyApp v2.3"` |
| `id` | No | GUID | Auto-generated if omitted |
| `subject` | Depends | string | Target record key (customer no., table name, order no., item no., …). Required by some types. |
| `data` | Depends | **JSON string** | Input parameters. **Must be serialized to a string**: `"data": "{\"tableName\":\"Customer\"}"`. Not an object. |
| `lcid` | No | integer | Windows Language ID for localised captions. 1033 = English, 1039 = Icelandic. Defaults to Bifrost Setup language. |
| `datacontenttype` | No | string | `"application/json"` — informational only |
