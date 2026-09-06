---
id: 3-three-endpoints
title: "3. Three Endpoints"
sidebar_label: "3. Three Endpoints"
sidebar_position: 4
---

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

> **Tenant GUID note:** The `data` URL returned by BC uses the internal tenant GUID (e.g. `9069b642-…`), not the named tenant (`dynamics.is`). If you construct the URL yourself use the named tenant form like the example above — both work.

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
