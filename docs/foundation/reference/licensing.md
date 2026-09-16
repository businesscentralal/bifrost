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

## Sandbox

In a **SaaS sandbox** environment, Bifröst itself has **no message limit** — the User / App
Registration quota pools are not enforced there. That is separate from the **public MCP
server**, which still limits sandbox traffic to **1,000 messages per 24 hours**.

For unlimited sandbox usage against your own environment, use the **Local MCP** server from
[businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp).

The Setup Wizard surfaces this on the Finish step as the **Sandbox Licensing** group (visible
only when the environment is a sandbox). See
[Bifrost Setup Wizard — Finish step (sandbox)](/help/foundation/bifrost-setup-wizard/#finish-step-sandbox).

## Enforcement

Before a chargeable message is processed, the caller's pool is checked:

- A small grace allowance may apply past the purchased amount. Exact grace size and related
  fail-over behaviour are part of the customer licence contract; they are not published here.
- When the pool is exhausted **and** the pool is configured to block, the message is **not
  processed** and a structured error is returned:

  ```json
  { "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
  ```

- When remaining quota is unknown (for example before the first sync), the product may still
  allow processing. Treat that as an operational detail of the licensing service, not as a
  guarantee that calls will always succeed without quota.

### Blocking or warning

What happens to an exhausted pool is decided per pool. The effective value for each pool is
exposed as `blockOnMissingQuota` in the license status JSON (see
[Checking status](#checking-status)):

| Value | Effect |
|-------|--------|
| `true` (the usual default) | The call is refused with the quota-exhausted error above. |
| `false` | The call runs. It is still charged against the pool, and the response still carries the quota warning — the tenant simply keeps working past its purchased quota. |

Callers should read `blockOnMissingQuota` from the public status payload rather than assuming
a particular storage or admin UI layout.

## Low-quota warnings

Successful JSON responses carry a `warnings` array when the caller's pool is running low.
Severity values you may see:

| Severity | Meaning |
|----------|---------|
| `approaching` | The quota is about to run out. |
| `grace` | The quota is spent; a small grace allowance may still apply. |
| `exhausted` | The pool is fully used. Only reachable for a pool whose `blockOnMissingQuota` flag is `false` — otherwise the call was refused instead of warned. |

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
- `Help.License.Get` returns the license and account entries, and carries the same
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
| `valid` | bool | False once the pool is past any grace allowance and is no longer considered within quota. |
| `blockOnMissingQuota` | bool | `true` (the default) refuses calls once the pool is exhausted; `false` lets them run, still charges them and still returns the quota warning. Read-only from the caller's point of view — refreshed by license sync. |

## Requesting licenses

Use **Request License** on the Bifrost Setup page (or the low-quota notification action) to
open a draft email to Origo. The email is pre-filled with your company name, the **hashed tenant id**,
the hashed company id, and the **real tenant id** so the request can be provisioned. It also includes
a placeholder where you should add any relevant details about your organisation before sending.
