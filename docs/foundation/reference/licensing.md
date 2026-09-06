---
id: licensing
title: "Licensing"
sidebar_position: 7
---

Bifrost uses a **message-quota** license model. There is no per-user assignment and no
plan-tier checking. Two quota pools are tracked, each measured in **license units**:

| Pool | Consumed by |
|------|-------------|
| **User** | Messages processed under a normal (interactive or web service) user. |
| **App Registration** | Messages processed by a Microsoft Entra application (service principal). |

## What counts

A message consumes units from the caller's pool when **all** of the following hold:

- The message type is **not exempt**. `Help.*` and `Webhook.*` types are exempt — they always
  run, are never blocked, and never consume quota.
- The message was processed **successfully** (a JSON response with `status` other than `Success`
  is not counted; non-JSON responses such as PDF/CSV count as successful).

Counting and enforcement happen in one central place when a message is processed; individual
message-type implementations do not perform license checks.

## How much a message costs

How many units a successful message consumes is decided by the message type itself, through
the `Msg Metering ori` interface on the `Message Type ori` enum. The interface answers three
questions per type: the **charge weight** (units per successful call), whether the type is
**exempt**, and the optional **meter** the consumption is reported under.

A message type that does not implement it — which is every type that has not opted in,
including the enum-extension values of dependent apps — falls back to `Default Metering ori`:
weight **1**, `Help.*` and `Webhook.*` exempt by name prefix, no meter. That is the behaviour
described above, unchanged.

Each processed message therefore records two fields on the `Message ori` row alongside the
charge type:

| Field | Type | Meaning |
|-------|------|---------|
| **Charge Weight** | Integer, `1` by default | The license units this message consumed. |
| **Meter** | Code[50] | The optional meter this message was reported under. Blank means the pool total only. |

Rows charged before this version carry no weight; the upgrade codeunit backfills them to
weight 1, so historical usage is counted exactly as it was reported.

See the [metering interface](/foundation/reference/metering-interface/) for the contract, and
[Metering a message type](/extensibility/metering) for how a dependent app opts in.

## Trial

On installation, a trial of **1,000 User + 1,000 App Registration** messages is provisioned for
the tenant.

## Enforcement

Before a chargeable message is processed, the caller's pool is checked for the number of units
the message type asks for:

- If the pool's remaining quota is **0 or less**, the message is **not processed** and a
  structured error is returned:

  ```json
  { "status": "Error", "error": "Message quota for the User pool is exhausted. Visit … to request additional licenses.", "requestUrl": "…" }
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
    { "code": "LicenseQuota", "severity": "approaching", "message": "…", "pool": "User", "remaining": 420, "requestUrl": "…" }
  ]
}
```

The Bifrost Setup page also shows a notification when either pool drops below 1,000.

## Daily usage sync

Usage is reported to the licensing service once per day **per company**:

- The first chargeable message of the day schedules a background task.
- The task **sums the charge weights** of each completed day's chargeable messages per pool
  (it no longer counts rows), refreshes the cached remaining quota for both pools, and resets
  the reported messages.
- Usage is reported per **hashed company** under the **hashed tenant**.

When the day's consumption was split across named meters, the usage document carries an
optional `meters` breakdown next to `quantity`. The breakdown is additive and backward
compatible: it is absent when no meter was used, and the meter totals always add up to at
most the quantity.

```json
{
  "docType": "usage",
  "tenantId": "…",
  "companyId": "…",
  "date": "2026-09-05",
  "licenseType": "User",
  "quantity": 412,
  "meters": { "PLAYBOOK": 180, "LLM": 96 }
}
```

## Checking status

- `Help.Bifrost.Get` returns the current license status (hashed tenant and company, and the
  remaining quota and validity for each pool).
- `Help.License.Get` returns the license and account documents, plus an optional
  `pendingMeters` object with the per-meter units charged locally but not yet reported. The
  property is written only when at least one metered message is pending, so responses for
  tenants that use no meters are unchanged.
- `Help.MessageTypes.Get` returns `exempt`, `chargeWeight` and `meter` per message type, so a
  caller can price a call before making it. The type is its own worked example: it declares
  its exemption through the metering interface rather than relying on the `Help.*` name
  prefix.
- `Help.License.Sync` (admin only) forces an immediate usage sync and returns the refreshed status.
- The **License** factbox on the Bifrost Setup page shows the same information plus the
  number of unreported messages and the last sync date.

## Requesting licenses

Use **Request License** on the Bifrost Setup page (or the low-quota notification action) to
open a draft email to Origo. The email is pre-filled with your company name, the **hashed tenant id**,
the hashed company id, and the **real tenant id** so the request can be provisioned. It also includes
a placeholder where you should add any relevant details about your organisation before sending.
