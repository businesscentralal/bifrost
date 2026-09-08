# Notifications and email drafts

Counting, reading, sending and marking notifications, retrieving a whole notification thread, and creating an email draft in the outbox without sending it.

[← back to SKILL.md](../SKILL.md) · originally sections 7.10 of the single-file skill.

---

### 7.10 NOTIFICATION OPERATIONS

In-app notification system for user-to-user messaging. All operations are scoped to the current user via FilterGroup(2) — users can only read their own notifications and cannot access other users' data.

#### `User.Notification.Count` — get notification counts

Direction: **Outbound**

No data parameters required.

**Request:**

```json
{
  "type": "User.Notification.Count"
}
```

**Response:**

```json
{
  "status": "Success",
  "total": 42,
  "unread": 5,
  "read": 37
}
```

**Response fields:**

- `total` — total number of notifications for the current user
- `unread` — number of notifications with `Is Read = false`
- `read` — number of notifications with `Is Read = true`

**Security:** Automatically filtered to the current user. No data from other users is accessible.

---

#### `User.Notification.Get` — retrieve notifications

Direction: **Outbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Integer | `0` | Number of records to skip (pagination) |
| `take` | Integer | `50` | Number of records to return |
| `tableView` | Text | *(none)* | Optional BC-style filter/sort string |

**Request:**

```json
{
  "type": "User.Notification.Get",
  "data": {
    "skip": 0,
    "take": 20
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "noOfRecords": 42,
  "result": [
    {
      "entryNo": 1001,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 0,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "relatedTableId": 36,
      "relatedRecordSystemId": "RECORD-GUID",
      "approvalEntryNo": 0,
      "subject": "Order approved",
      "body": "Sales Order 1042 has been approved.",
      "isRead": false,
      "sourceEntrySystemId": "SOURCE-GUID",
      "systemId": "NOTIFICATION-GUID",
      "systemCreatedAt": "2025-01-15T10:30:00Z",
      "systemModifiedAt": "2025-01-15T10:30:00Z",
      "notificationType": "New Record"
    }
  ]
}
```

**Response fields:**

- `entryNo` — unique notification entry number
- `threadId` — GUID linking related notifications in a conversation thread
- `parentEntryNo` — entry number of the parent notification (0 if top-level)
- `recipientUserId` — Code[50] user name of the recipient (BC User ID)
- `senderUserId` — Code[50] user name of the user who sent the notification
- `relatedTableId` — table ID of the related BC record (e.g., 36 for Sales Header)
- `relatedRecordSystemId` — SystemId of the related BC record
- `approvalEntryNo` — linked approval entry number (0 if not approval-related)
- `subject` — notification subject line
- `body` — notification body text
- `isRead` — whether the notification has been read
- `sourceEntrySystemId` — SystemId of the source notification entry
- `systemId` — SystemId of this notification record
- `systemCreatedAt` — UTC timestamp when created
- `systemModifiedAt` — UTC timestamp when last modified
- `notificationType` — type of notification ("New Record", "Approval", "Overdue")

**Security:** Automatically filtered to the current user via FilterGroup(2). Only notifications where the current user is the recipient are returned.

**Related:** `User.Notification.Count`, `User.Notification.Read`

---

#### `User.Notification.Read` — mark notifications as read/unread

Direction: **Inbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `entryNos` | Integer[] | *(required)* | Array of notification entry numbers to update |
| `isRead` | Boolean | `true` | Set to `false` to mark as unread |

**Request:**

```json
{
  "type": "User.Notification.Read",
  "data": {
    "entryNos": [1001, 1002, 1005],
    "isRead": true
  }
}
```

**Response:**

Only modified records are returned in the response. Entries that do not belong to the current user are silently skipped — no error is raised.

```json
{
  "status": "Success",
  "noOfRecords": 2,
  "result": [
    {
      "entryNo": 1001,
      "isRead": true
    }
  ]
}
```

**Security:** Silently skips any entry numbers that do not belong to the current user. This prevents enumeration of other users' notifications.

**Related:** `User.Notification.Get`, `User.Notification.Count`

---

#### `User.Notification.Send` — send a notification to a user

Direction: **Inbound**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `recipientUserId` | Code[50] | *(required)* | BC User ID (user name) of the recipient |
| `subject` | Text | *(required)* | Notification subject line |
| `body` | Text | *(optional)* | Notification body text |
| `threadId` | GUID | *(optional)* | Thread ID to group related notifications |
| `parentEntryNo` | Integer | *(optional)* | Parent entry number (required if `threadId` is set) |
| `relatedTableId` | Integer | *(optional)* | Table ID of the related BC record |
| `relatedRecordSystemId` | GUID | *(optional)* | SystemId of the related BC record |
| `notificationType` | Text | *(optional)* | Type of notification ("New Record", "Approval", "Overdue") |

**Request:**

```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JOHN.DOE",
    "subject": "Order requires review",
    "body": "Sales Order 1042 needs your attention.",
    "relatedTableId": 36,
    "relatedRecordSystemId": "RECORD-GUID"
  }
}
```

**Thread reply example:**

```json
{
  "type": "User.Notification.Send",
  "data": {
    "recipientUserId": "JOHN.DOE",
    "subject": "Re: Order requires review",
    "body": "I've updated the discount. Please check again.",
    "threadId": "THREAD-GUID",
    "parentEntryNo": 1001
  }
}
```

**Response:**

Returns the created notification record with all fields populated, including the auto-assigned `senderUserId` (set to the calling user's BC User ID).

```json
{
  "status": "Success",
  "result": [
    {
      "entryNo": 1006,
      "threadId": "THREAD-GUID",
      "parentEntryNo": 1001,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "subject": "Re: Order requires review",
      "body": "I've updated the discount. Please check again.",
      "isRead": false,
      "systemId": "NEW-NOTIFICATION-GUID",
      "systemCreatedAt": "2025-01-15T14:22:00Z"
    }
  ]
}
```

**Constraints:**

- `recipientUserId` and `subject` are required — omitting either produces an error
- `parentEntryNo` is required when `threadId` is provided
- `senderUserId` is automatically set to the calling user — cannot be overridden

**Related:** `User.Notification.Get`, `User.Notification.Thread`

---

#### `Email.Draft.Set` — create email draft in outbox (no send)

Direction: **Inbound**

Creates an email draft in the standard Business Central Email Outbox. This operation does not send email.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `to` | Text or Text[] | *(required)* | Recipient email address(es). Supports `;`/`,` delimited string or array. |
| `subject` | Text | *(required)* | Email subject line |
| `htmlBody` | Text | *(optional)* | HTML body content |
| `body` | Text | *(optional)* | Fallback body when htmlBody is omitted |
| `cc` | Text or Text[] | *(optional)* | CC recipient(s) |
| `bcc` | Text or Text[] | *(optional)* | BCC recipient(s) |
| `emailScenario` | Text | *(optional)* | Explicit Email Scenario enum name |
| `relatedTableId` | Integer | *(optional)* | Used for scenario best-guess when emailScenario is omitted |
| `attachments` | Object[] | *(optional)* | URL-based attachments (`fileName`, optional `contentType`, required `url` or `contentUrl`) |

**Request:**

```json
{
  "type": "Email.Draft.Set",
  "data": {
    "to": ["buyer@contoso.com"],
    "subject": "PO 1005",
    "htmlBody": "<p>Please review attached files.</p>",
    "relatedTableId": 38,
    "attachments": [
      {
        "fileName": "spec.pdf",
        "contentType": "application/pdf",
        "url": "https://example.com/spec.pdf"
      }
    ]
  }
}
```

**Response:**

```json
{
  "status": "Success",
  "messageId": "d8f0f4d7-2f8b-4a4c-90e2-9f5c2d9d0f42",
  "outboxSystemId": "26d55e6d-8b76-4d96-9f8c-2fb0fcf7e6a5",
  "outboxUrl": "https://businesscentral...",
  "emailScenarioResolved": "Purchasing"
}
```

**Scenario resolution order:**

1. Explicit `emailScenario`
2. Best-guess from `relatedTableId`
3. `Default`
4. First available value in enum `Email Scenario`

**Notes:**

- Standard BC email permissions and account setup apply.
- Attachment URLs must be reachable from the BC server environment.

**Related:** `User.Notification.Send`, `Help.WhoAmI.Get`

---

#### `User.Notification.Thread` — retrieve a full notification thread

Direction: **Outbound**

The `subject` field in the request envelope must be set to the thread GUID.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Integer | *(optional)* | Number of records to skip |
| `take` | Integer | *(all)* | Number of records to return (defaults to all thread entries) |

**Request:**

```json
{
  "type": "User.Notification.Thread",
  "subject": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "data": {}
}
```

**Response:**

Returns ALL notifications in the thread from all participants, ordered by `entryNo`. The current user must be a recipient of at least one notification in the thread.

```json
{
  "status": "Success",
  "noOfRecords": 4,
  "result": [
    {
      "entryNo": 1001,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 0,
      "recipientUserId": "JOHN.DOE",
      "senderUserId": "JANE.SMITH",
      "subject": "Order requires review",
      "body": "Sales Order 1042 needs your attention.",
      "isRead": true,
      "systemCreatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "entryNo": 1002,
      "threadId": "a1b2c3d4-...",
      "parentEntryNo": 1001,
      "recipientUserId": "JANE.SMITH",
      "senderUserId": "JOHN.DOE",
      "subject": "Re: Order requires review",
      "body": "I've updated the discount.",
      "isRead": false,
      "systemCreatedAt": "2025-01-15T14:22:00Z"
    }
  ]
}
```

**Key difference from `User.Notification.Get`:** Thread retrieval returns notifications from ALL participants in the thread (not just the current user's notifications), enabling full conversation view. However, the current user must be a recipient of at least one entry in the thread to access it.

**Security:** Access is gated — the current user must be a recipient of at least one notification in the requested thread. If not, no records are returned.

**Related:** `User.Notification.Send`, `User.Notification.Get`
