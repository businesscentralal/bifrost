---
id: api
title: "API reference"
sidebar_position: 2
---

## Overview

The Origo Bifrost extension provides API endpoints for managing and processing bifrost messages following the Bifrost specification. This document describes the API endpoints, the message envelope and the response shapes.

**API Publisher:** `origo`  
**API Group:** `bifrost`  
**API Version:** `v1.0`

---

## API Endpoints

### 1. Bifrost Data API — Response Data {#bifrost-data-api-response-data}

**Purpose:** Returns the response data content for a given message.

**Endpoint Details:**

- **Entity Name:** `response`
- **Entity Set Name:** `responses`
- **Base URL:** `/api/origo/bifrost/v1.0/responses`
- **Access:** Read-only (no insert or modify operations)

**Fields:**

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | Guid | Unique identifier of the message |
| `data` | Blob | Response data content |

**Supported Operations:**

- **GET** (single): Retrieve response data for a specific message by ID
- **GET** (collection): Retrieve all response data entries

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

---

### 1b. Request Data API ori — Request Payload

**Purpose:** Returns the original request data payload for a given message. Useful for inspecting or re-replaying what was sent.

**Endpoint Details:**

- **Entity Name:** `request`
- **Entity Set Name:** `requests`
- **Base URL:** `/api/origo/bifrost/v1.0/requests`
- **Access:** Read-only (no insert or modify operations)

**Fields:**

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | Guid | Unique identifier of the message |
| `data` | Blob | Original request payload (JSON, XML, or plain text) |

**Supported Operations:**

- **GET** (single): Retrieve request payload for a specific message by ID
- **GET** (collection): Retrieve all request data entries (filtered to the current user)

**Preferred — fetch the raw payload directly (no prior lookup needed):**

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')/data
Authorization: Bearer {token}
```

Or fetch the OData record (returns the `id` and `data` fields as JSON):

```http
GET /api/origo/bifrost/v1.0/requests('{message-id}')
Authorization: Bearer {token}
```

**Security:** Results are limited to messages created by the calling identity.

---

### 2. Queue API ori {#queue-api-ori}

**Purpose:** Create message requests and get status for queued (asynchronous) messages.

**Endpoint Details:**

- **Entity Name:** `queue`
- **Entity Set Name:** `queues`
- **Base URL:** `/api/origo/bifrost/v1.0/queues`
- **Processing Mode:** Asynchronous (messages are scheduled for background processing)

**Fields:**

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `specversion` | Text | Bifrost specification version | Yes |
| `type` | Enum | Message type identifier | Yes |
| `source` | Text | Description of the application using the bifrost (e.g., "MyApp v1.2.3", "DataSync Service") | Yes |
| `id` | Guid | Unique identifier (auto-generated) | No |
| `time` | DateTime | Event timestamp | No |
| `subject` | Text | Subject of the event | No |
| `continueFromRecordId` | Guid | SystemId of the record to resume from in continuation-enabled message types (for example a large CSV export). Omit for the first request; set to the value returned in a previous response to continue. | No |
| `lcid` | Integer | Windows Language ID for language-specific captions (e.g., 1033 for English, 1031 for German). If not specified, uses the Default Language Code from Bifrost Setup | No |
| `datacontenttype` | Text | Content type of the data (application/json, application/xml, text/plain) | No |
| `data` | BigText | Request parameters (JSON, XML, or plain text depending on implementation; all built-in message types require JSON) | No |

**Supported Operations:**

#### POST - Create Queue Message

Creates a new message request that will be processed asynchronously.

**Request Body:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "lcid": 1033
}
```

**Response:** Returns the created message with assigned ID and timestamp. Once processing is complete, the `data` field will contain the download URL to retrieve the response data.

#### GET - Retrieve Queue Messages

Retrieves queued messages (messages with an assigned Task ID).

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/queues
```

#### PATCH - Update Queue Message

Not typically used for this API.

---

### Queue API Actions

#### RetryTask

Retries the processing of a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.RetryTask
```

**Description:** Attempts to reprocess a failed or completed message. If the task is already running it will not be restarted.

**Status Values:**

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Created | 201 Created | Task is already running and cannot be retried |
| Updated | 200 OK | Task was successfully restarted |
| None | 204 No Content | Failed to create a new background task |

---

#### CancelTask

Cancels the scheduled task for a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.CancelTask
```

**Description:** Cancels a running or scheduled background task. If no task is scheduled, the action returns immediately.

**Status Values:**

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Deleted | 204 No Content | No task was scheduled |
| Updated | 200 OK | Task was successfully cancelled |
| None | 204 No Content | Task cancellation failed |

---

#### GetStatus

Gets the status of a bifrost message.

**Endpoint:**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Status Values:**

- **Created:** Message is still running/processing
- **Deleted:** No task is scheduled
- **Updated:** Task has been completed and results are available
- **None:** Message status is not known

**HTTP Status Codes:**

The GetStatus action returns standard HTTP status codes based on the message state:

| Semantic Status | HTTP Status Code | Description |
|-----------------|------------------|-------------|
| Created | 201 Created | Message is still being processed |
| Updated | 200 OK | Processing completed successfully |
| Deleted | 204 No Content | No task scheduled for this message |
| None | 204 No Content | Message status is not known |

**Response:** Returns the current processing status via the WebServiceActionContext.

---

### 3. Task API ori {#task-api-ori}

**Purpose:** Create and process bifrost messages synchronously (immediate processing).

**Endpoint Details:**

- **Entity Name:** `task`
- **Entity Set Name:** `tasks`
- **Base URL:** `/api/origo/bifrost/v1.0/tasks`
- **Processing Mode:** Synchronous (messages are processed immediately upon creation)

**Fields:**

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `specversion` | Text | Bifrost specification version | Yes |
| `type` | Enum | Message type identifier | Yes |
| `source` | Text | Description of the application using the bifrost (e.g., "MyApp v1.2.3", "DataSync Service") | Yes |
| `id` | Guid | Unique identifier (auto-generated) | No |
| `time` | DateTime | Event timestamp | No |
| `subject` | Text | Subject of the event | No |
| `continueFromRecordId` | Guid | SystemId of the record to resume from in continuation-enabled message types (for example a large CSV export). Omit for the first request; set to the value returned in a previous response to continue. | No |
| `datacontenttype` | Text | Content type of the data (application/json, application/xml, text/plain) | No |
| `data` | BigText | Request parameters (JSON, XML, or plain text depending on implementation; all built-in message types require JSON) | No |

**Supported Operations:**

#### POST - Create and Process Task

Creates a new message and processes it immediately. The response will contain the download URL to the response data in the `data` field.

**Request Body:**

```json
{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Response:** Returns the message with the download URL to the response data in the `data` field.

#### GET - Retrieve Task Messages

Retrieves task messages (messages without an assigned Task ID).

**Example Request:**

```http
GET /api/origo/bifrost/v1.0/tasks
```

---

## Message Types

Every operation is a **message type**, named in the `type` field of the envelope. The installed
message types and their contracts are read from Business Central itself: the MCP tools
`list_message_types` and `describe_message_type`, or the Bifrost Message Types page. Over the API,
`Help.MessageTypes.Get` returns the list and `Help.Implementation.Get` (with the type name as
`subject`) returns the full request and response contract of one type. All built-in message types
take their parameters as JSON in the `data` field.

Other Bifröst apps add message types of their own to the same catalogue; they are listed and
described the same way.

---

## Events and Webhooks

The Bifrost extension provides **External Business Events** that enable external systems to receive webhook notifications when messages complete or fail processing. This eliminates the need for continuous polling and enables true event-driven architectures.

### Webhook Notifications

**Event Pattern:** Minimal Notification + API Fetch

1. **Message Submitted**: External system submits message to Queue API or Task API
2. **Processing**: Business Central processes the message asynchronously (Queue API) or synchronously (Task API)
3. **Event Raised**: When processing completes or fails, BC raises an External Business Event
4. **Webhook Notification**: Subscribed endpoints receive minimal notification (MessageId, MessageType, Timestamp)
5. **Data Retrieval**: External system calls Data API using MessageId to fetch full response

### Available Events

| Event Name | When Raised | Webhook Payload | Use Case |
|------------|-------------|-----------------|----------|
| **BifrostMessageCompleted** | Message processing succeeds | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Notify external systems of successful completion |
| **BifrostMessageFailed** | Message processing fails | `{ MessageId, MessageType, ResponseContentLink, Timestamp }` | Alert on processing failures |

### Configuration

Configure webhook subscriptions via Business Central's **Event Subscriptions** page:

1. Navigate to **Event Subscriptions**
2. Create new subscription
3. Select event: `BifrostMessageCompleted` or `BifrostMessageFailed`
4. Set **Event Category**: "Origo Bifrost"
5. Configure endpoint URL and authentication
6. Enable subscription

### Complete Documentation

For comprehensive webhook setup, security considerations, code examples, and troubleshooting:

**→ See [Events and Webhooks Reference](/foundation/reference/events-and-webhooks/)**

Includes:
- Webhook payload specifications
- Event subscription setup guide
- Security best practices
- Example implementations (Node.js, C#, Python)
- Troubleshooting guide

---

## Authentication

All API endpoints require proper authentication using OAuth 2.0 or Basic Authentication as configured in Business Central.

**Required Permissions:**

- Users must have appropriate permissions defined in the `BIFROST Full ori` permission set or equivalent permissions to access bifrost functionality.

### Data Isolation — Entra Application Boundary

All Bifrost endpoints (`/tasks`, `/queues`, `/responses`, `/requests`) enforce **strict data isolation at the Entra Application level**.

Every response is limited to the messages created by the identity that authenticated the request: for an integration, its **Entra application**.

**Consequences:**

| Scenario | Result |
|---|---|
| App A lists `/queues` | Returns only messages submitted by App A |
| App A requests `/responses({id})` for a message created by App B | Returns empty — no data leaked |
| App A requests `/requests({id})` for a message created by App B | Returns empty — no data leaked |
| Two apps share the same company + environment | Each sees only its own message history |

This isolation is **unconditional** — it cannot be widened by OData filters. It applies to GET (listing and single-record reads) on all four endpoints.

---

## Usage Examples

### Example 1: Get Available Message Types (Synchronous)

**Request:**

```http
POST /api/origo/bifrost/v1.0/tasks
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json",
  "data": "{}"
}
```

**Response:**

```json
{
  "@odata.context": "...",
  "specversion": "1.0",
  "type": "Help.MessageTypes.Get",
  "source": "MyIntegrationApp v1.0",
  "id": "12345678-1234-1234-1234-123456789abc",
  "time": "2026-02-25T10:30:00Z",
  "subject": "",
  "datacontenttype": "text/json",
  "data": "/api/origo/bifrost/v1.0/responses(12345678-1234-1234-1234-123456789abc)"
}
```

**Note:** The `data` field contains a download URL. Retrieve the actual response data by calling the URL.

---

### Example 2: Get Help Documentation for a Message Type (Asynchronous)

**Step 1: Queue the Request**

```http
POST /api/origo/bifrost/v1.0/queues
Content-Type: application/json

{
  "specversion": "1.0",
  "type": "Help.Implementation.Get",
  "subject": "{message-type}",
  "source": "MyIntegrationApp v1.0",
  "datacontenttype": "application/json"
}
```

**Step 2a: Option 1 - Poll for Status**

```http
POST /api/origo/bifrost/v1.0/queues('{message-id}')/Microsoft.NAV.GetStatus
```

**Step 2b: Option 2 - Webhook Notification (Recommended)**

Subscribe to the `BifrostMessageCompleted` event and receive automatic notification when processing completes:

```json
{
  "MessageId": "{message-id}",
  "MessageType": "Help.Implementation.Get",
  "ResponseContentLink": "/api/origo/bifrost/v1.0/responses({message-id})/data",
  "Timestamp": "2026-03-08T14:30:22Z"
}
```

**Step 3: Retrieve Results**

```http
GET /api/origo/bifrost/v1.0/responses('{message-id}')
```

The response data is the Markdown help of the message type named in `subject`.

**Note:** For webhook setup, see [Events and Webhooks Reference](/foundation/reference/events-and-webhooks/).

---

## Error Handling

### Common Error Scenarios

1. **Invalid Message Type**
   - Occurs when the specified type is not supported for the requested operation

2. **Missing Required Fields**
   - Occurs when required fields like `type` or `specversion` are not provided

---

## Best Practices

1. **Choosing Between Queue and Task APIs:**
   - Use **Task API** for immediate results and simple operations
   - Use **Queue API** for long-running operations or bulk processing

2. **Message Types:**
   - Use `Help.MessageTypes.Get` to discover the installed message types and their capabilities
   - Use `Help.Implementation.Get` to retrieve the detailed help of one message type

3. **Content Types:**
   - Use `application/json` for structured data payloads
   - Response content type is automatically set to `text/json`

4. **Status Checking:**
   - For queued messages, check status before retrieving results
   - Use the GetStatus action to determine if processing is complete

5. **Date/Time Filtering:**
   - Use ISO 8601 format for date/time values
   - All times should be in UTC
