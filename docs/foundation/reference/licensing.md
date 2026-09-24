---
id: licensing
title: "Licensing"
sidebar_position: 7
---

This page is the contract a caller sees: which calls count, the errors a call can be refused with,
the warnings a successful response can carry, and the licence status payload. For the licence
model itself - Prepaid and Subscription, the trial, the Vendor, Partner and Customer roles and who
invoices whom - see [Licensing and partner program](/foundation/licensing).

## What counts

A message consumes **one** unit from the caller's pool when **all** of the following hold:

- The message type is **not exempt**. The `Help.*`, `Memory.*`, `Session.*`, `Webhook.*` and
  `ChangeLog.*` types of Origo's Bifröst applications are exempt - they never consume quota and are
  never refused for quota. The prefix counts only for types in an Origo object-ID block; a type
  another publisher adds is chargeable whatever its name.
- The message was processed **successfully** (a JSON response with `status` other than `Success`
  is not counted; non-JSON responses such as PDF/CSV count as successful).

There is no charge weight and no per-type price: every chargeable call costs exactly one unit, and
the pool it was charged to is recorded in the **Charge Type** field of the message. Counting and
refusal happen in one central place; individual message types do not perform licence checks.

| Pool | Consumed by |
|------|-------------|
| **User** | Messages processed under a normal (interactive or web service) user. |
| **App Registration** | Messages processed by a Microsoft Entra application (service principal). |

A message type can be told that it was called: `Msg Metering ori` is a hook that Foundation invokes
after every successful non-exempt call so a billing solution can keep its own books. It has no
influence on the count. See the [metering interface](/foundation/reference/metering-interface/) and
[Metering a message type](/extensibility/metering).

## Why a call can be refused

Checks run in this order; the first that applies answers the call with `"status": "Error"` and the
call is not processed and not counted.

| Order | Condition | Applies to | Response |
|---|---|---|---|
| 1 | The company has not approved the EULA | Every call, including `Help.*` | `code: "EULA_REQUIRED"`, `setupUrl`, `setupWizardUrl` |
| 2 | Outbound HTTP is not allowed for Bifröst Foundation | Chargeable calls, outside a sandbox | The error names the setup page |
| 3 | The trial has not been activated | Chargeable calls, outside a sandbox | `activationMethod: "Setup"`, `requestUrl` |
| 4 | The user's monthly quota is reached | Both license types, outside a sandbox | `quotaScope: "user"`, `requestUrl` |
| 5 | The company's monthly quota is reached | Both license types, outside a sandbox | `quotaScope: "company"`, `requestUrl` |
| 6 | The caller's pool is exhausted and the pool blocks | Prepaid, outside a sandbox | `requestUrl` |

Nothing is refused for quota in a SaaS **sandbox**.

```json
{ "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
```

```json
{ "status": "Error", "error": "User monthly message quota is exhausted. Visit … to review quotas or request a higher limit.", "requestUrl": "…", "quotaScope": "user" }
```

### Prepaid pools, grace and blocking

The remaining quota of each pool is maintained by the licensing service (purchased minus reported
usage) and cached by the daily sync.

- When a pool reaches zero, a **grace of 100 messages** still runs.
- When the grace is used up, the pool is exhausted. Whether an exhausted pool refuses calls is
  agreed per tenant and exposed as `blockOnMissingQuota` (see [Checking status](#checking-status)):

| Value | Effect |
|-------|--------|
| `true` (the usual default) | The call is refused with the quota-exhausted error above. |
| `false` | The call runs. It is still counted, and the response still carries the quota warning. |

- Before the first sync, when the remaining quota is not known yet, calls are allowed.

### Monthly quotas

Any tenant can set a **Company Monthly Message Quota** (Bifröst Setup) and a **Monthly Msg Quota**
per user (Bifröst User Setup) - on Subscription they are the only limit. `0` means no limit. A reached quota refuses calls until
the next calendar month. The user quota is checked before the company quota.

The count is taken from the chargeable messages in the company's **Bifrost Messages** that have not
been reported to the licensing service yet: the daily usage sync and a retention policy on Bifrost
Messages both lower it. See [How the monthly quotas are counted](/foundation/licensing/license-types/#how-monthly-quotas-are-counted).

## Warnings

A successful JSON response carries a `warnings` array when a quota that applies to the caller has
**100 or fewer** messages left - a Prepaid pool or a monthly quota.

| Severity | Meaning |
|----------|---------|
| `approaching` | 100 or fewer messages left. |
| `grace` | The Prepaid pool is spent; the grace of 100 messages is being used. |
| `exhausted` | The Prepaid pool and its grace are spent. Only reachable when `blockOnMissingQuota` is `false` - otherwise the call was refused. |

```json
{
  "status": "Success",
  "result": { "...": "..." },
  "warnings": [
    { "code": "LicenseQuota", "severity": "approaching", "message": "Message quota is running low. Visit … to review quotas or request a higher limit.", "requestUrl": "…" }
  ]
}
```

The Bifröst Setup page also shows a notification when either Prepaid pool drops below 1,000.

## Daily usage sync

Usage is reported to the licensing service once per day **per company**. The first chargeable
message of the day schedules a background task that reports each completed day's chargeable messages
per pool and refreshes the cached remaining quota. **Sync** on the Bifröst Setup page does the same
immediately, including today's messages, and also applies invitations and cancellations - see
[Leaving and cancelling](/foundation/licensing/leaving-and-cancelling/). Usage is reported per
**hashed company** under the **hashed tenant**.

## Checking status

- `Help.Bifrost.Get` returns the current licence status as `licenseStatus`.
- [`Bifrost.Subscription.GetStatus`](/foundation/reference/message-types/bifrost-subscription-getstatus/)
  returns the tenant's configuration, licence status and current-month usage.
- The **License** fact box on the Bifröst Setup page shows the same information plus the number of
  unreported messages and the last sync date.

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
| `remaining` | int / null | Messages left in the pool; `null` while no value has been synced. Negative while the grace is being used. |
| `valid` | bool | False once the pool is past the grace and no longer within quota. |
| `blockOnMissingQuota` | bool | `true` (the default) refuses calls once the pool is exhausted; `false` lets them run, still counts them and still returns the warning. Read-only - refreshed by the licence sync. |

## Buying more quota

Prepaid message quota is purchased from Origo, per pool. After a purchase, the next sync refreshes
the remaining quota shown in `licenseStatus` and on the License fact box.
