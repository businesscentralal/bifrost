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

- The message type is **not exempt**. `Help.*` and `Webhook.*` types are exempt — they always
  run, are never blocked, and never consume quota.
- The message was processed **successfully** (a JSON response with `status` other than `Success`
  is not counted; non-JSON responses such as PDF/CSV count as successful).

Counting and enforcement happen in one central place when a message is processed; individual
message-type implementations do not perform license checks.

## How much a message costs

One message. There is no charge weight, no meter and no per-type price: every chargeable
call costs exactly one unit from the pool, and the pool it was charged to is recorded in the
**Charge Type** field on the `Message ori` row.

A message type can, however, be told that it was called. `Msg Metering ori` is a hook that
Foundation invokes after every successful non-exempt call so a billing or metering solution
can keep its own books. The hook has no influence on the count above. See the
[metering interface](/foundation/reference/metering-interface/) for the contract, and
[Metering a message type](/extensibility/metering) for how a dependent app opts in.

## Trial

On installation, a trial of **1,000 User + 1,000 App Registration** messages is provisioned for
the tenant.

## Enforcement

Before a chargeable message is processed, the caller's pool is checked:

- A flat **100-message grace buffer** applies, so a pool keeps working slightly past its
  purchased amount. A pool counts as exhausted once its remaining quota has fallen more than
  100 messages below zero.
- When the pool is exhausted **and** the pool blocks (see below), the message is **not
  processed** and a structured error is returned:

  ```json
  { "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
  ```

- If remaining is unknown (a fresh install before the first sync, or the licensing service is
  temporarily unreachable), processing is **allowed** (fail-open).

### Blocking or warning

What happens to an exhausted pool is decided per pool. The setting is configuration rather
than a credential, so it lives in **module-scoped** IsolatedStorage — one value for the whole
tenant rather than one per company:

| Key | Data scope | Pool |
|-----|-----------|------|
| `BlockOnMissingQuota-User` | `DataScope::Module` | User |
| `BlockOnMissingQuota-AppRegistration` | `DataScope::Module` | App Registration |

| Value | Effect |
|-------|--------|
| `true`, **or the key is absent** | The call is refused with the quota-exhausted error above. Absent is the normal case, so this is the effective value almost everywhere. |
| `false` | The call runs. It is still charged against the pool, and the response still carries the quota warning — the tenant simply keeps working past its purchased quota. |

The keys are written by the **license sync** (`Usage Sync ori`) and by nothing else: no page
and no message type of the product app sets them. The sync code carries a `TODO` marking
where the values will be read from the Entra tenant configuration document in Azure Cosmos
DB. Until that document exists the keys stay absent and both pools block, exactly as Bifröst
always has.

The effective value of each pool is visible in two places:

- read-only in the **Quota Blocking** group of the **Bifrost Connection Status** page, which
  is reachable from the **Licensing** group of the Bifrost Setup page. A value that has never
  been synced is shown as the built-in default rather than as a stored setting;
- as `blockOnMissingQuota` per pool in the license status JSON, described under
  [Checking status](#checking-status).

## Low-quota warnings

Successful JSON responses carry a `warnings` array when the caller's pool is running low:

| Remaining | Severity | Meaning |
|-----------|----------|---------|
| 1 to 100 | `approaching` | The quota is about to run out. |
| 0 or fewer | `grace` | The quota is spent; the pool is drawing on its 100-message grace buffer. |
| more than 100 below zero | `exhausted` | The grace buffer is used up too. Only reachable for a pool whose `blockOnMissingQuota` flag is `false` — otherwise the call was refused instead of warned. |

```json
{
  "status": "Success",
  "result": { "...": "..." },
  "warnings": [
    { "code": "LicenseQuota", "severity": "approaching", "message": "…", "pool": "User", "remaining": 420, "requestUrl": "…" }
  ]
}
```

The Bifrost Setup page also shows a notification when either pool drops below 1,000.

## Daily usage sync

Usage is reported to the licensing service once per day **per company**:

- The first chargeable message of the day schedules a background task.
- The task counts each completed day's chargeable messages per pool, refreshes the cached
  remaining quota for both pools, and resets the reported messages.
- Usage is reported per **hashed company** under the **hashed tenant**.

```json
{
  "docType": "usage",
  "tenantId": "…",
  "companyId": "…",
  "date": "2026-09-05",
  "licenseType": "User",
  "quantity": 412
}
```

## Checking status

- `Help.Bifrost.Get` returns the current license status as `licenseStatus`.
- `Help.License.Get` returns the license and account documents, and now carries the same
  `licenseStatus` object, so a caller that already reads license entries does not need a
  second round-trip.
- `Help.License.Sync` (admin only) forces an immediate usage sync and returns the refreshed status.
- The **License** factbox on the Bifrost Setup page shows the same information plus the
  number of unreported messages and the last sync date.

The license status object looks like this:

```json
"licenseStatus": {
  "tenantIdHash": "a7f3c1…",
  "companyIdHash": "b2d4e6…",
  "companyName": "CRONUS International Ltd.",
  "user":            { "remaining": 812, "valid": true, "blockOnMissingQuota": true },
  "appRegistration": { "remaining": -40, "valid": true, "blockOnMissingQuota": false }
}
```

| Field | Type | Meaning |
|-------|------|---------|
| `remaining` | int / null | Messages left in the pool; `null` while no value has been synced. |
| `valid` | bool | False once the pool is past the 100-message grace buffer. |
| `blockOnMissingQuota` | bool | `true` (the default) refuses calls once the pool is exhausted; `false` lets them run, still charges them and still returns the quota warning. Read-only — only the license sync writes it. |

## Requesting licenses

Use **Request License** on the Bifrost Setup page (or the low-quota notification action) to
open a draft email to Origo. The email is pre-filled with your company name, the **hashed tenant id**,
the hashed company id, and the **real tenant id** so the request can be provisioned. It also includes
a placeholder where you should add any relevant details about your organisation before sending.
