---
id: licensing
title: "Licensing"
sidebar_position: 7
---

Bifrost uses a **message-quota** license model. There is no per-user assignment and no
plan-tier checking. Two quota pools are tracked, each measured in **messages**:

| Pool | Consumed by |
|------|-------------|
| **User** | Messages processed under a normal (interactive or web service) user. |
| **App Registration** | Messages processed by a Microsoft Entra application (service principal). |

## What counts

A message consumes **one** unit from the caller's pool when **all** of the following hold:

- The message type is **not exempt**. `Help.*` and `Webhook.*` types are exempt ΓÇö they always
  run, are never blocked, and never consume quota.
- The message was processed **successfully** (a JSON response with `status` other than `Success`
  is not counted; non-JSON responses such as PDF/CSV count as successful).

Counting and enforcement happen in one central place when a message is processed; individual
message-type implementations do not perform license checks.

## Trial

On installation, a trial of **1,000 User + 1,000 App Registration** messages is provisioned for
the tenant.

## Enforcement

Before a chargeable message is processed, the caller's pool is checked:

- If the pool's remaining quota is **0 or less**, the message is **not processed** and a
  structured error is returned:

  ```json
  { "status": "Error", "error": "Message quota for the User pool is exhausted. Visit ΓÇª to request additional licenses.", "requestUrl": "ΓÇª" }
  ```

- If remaining is unknown (a fresh install before the first sync, or the licensing service is
  temporarily unreachable), processing is **allowed** (fail-open).

A flat **100-message grace** is applied by the licensing service, so a pool keeps working slightly
past its purchased amount before it is blocked.

## Low-quota warnings

Successful JSON responses carry a `warnings` array when the caller's pool is running low:

| Remaining | Severity |
|-----------|----------|
| below 1,000 | `approaching` |
| 100 or less | `grace` |

```json
{
  "status": "Success",
  "result": { "...": "..." },
  "warnings": [
    { "code": "LicenseQuota", "severity": "approaching", "message": "ΓÇª", "pool": "User", "remaining": 420, "requestUrl": "ΓÇª" }
  ]
}
```

The Bifrost Setup page also shows a notification when either pool drops below 1,000.

## Daily usage sync

Usage is reported to the licensing service once per day **per company**:

- The first chargeable message of the day schedules a background task.
- The task reports each completed day's chargeable counts per pool, refreshes the cached
  remaining quota for both pools, and resets the reported messages.
- Usage is reported per **hashed company** under the **hashed tenant**.

## Checking status

- `Help.Bifrost.Get` returns the current license status (hashed tenant and company, and the
  remaining quota and validity for each pool).
- `Help.License.Sync` (admin only) forces an immediate usage sync and returns the refreshed status.
- The **License** factbox on the Bifrost Setup page shows the same information plus the
  number of unreported messages and the last sync date.

## Requesting licenses

Use **Request License** on the Bifrost Setup page (or the low-quota notification action) to
open a draft email to Origo. The email is pre-filled with your company name, the **hashed tenant id**,
the hashed company id, and the **real tenant id** so the request can be provisioned. It also includes
a placeholder where you should add any relevant details about your organisation before sending.
