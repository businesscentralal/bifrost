---
id: metering-interface
title: "Metering interface"
sidebar_position: 8
---

`Msg Metering ori` is the contract a message type implements to control what one successful
call costs. It is the second interface on `Message Type ori`: `Msg Interface ori` says what
a type does, `Msg Metering ori` says what it costs.

Namespace `Origo.Bifrost`. Selector enum `Message Type ori` (10077894).

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

Metering is **optional per value**. Any value that does not name a `Msg Metering ori`
implementation — including enum-extension values from dependent apps — resolves to
`Default Metering ori`.

## Methods

| Signature | Returns |
|---|---|
| `procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer` | The licence units one successful call consumes. |
| `procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean` | `true` when the type is never charged and never blocked. |
| `procedure GetMeterName(): Text[50]` | The optional meter the consumption is reported under. |

### `GetChargeWeight`

| | |
|---|---|
| Parameter | `Argument` — the `Message Argument ori` of the call being metered. Carries the message type, subject and request payload. |
| Returns | The units to charge for one **successful** call. |
| `0` | The call is free: it runs, it is not counted, and it does not appear under a meter. |
| Negative | Treated as `0`. |
| Evaluated | **Before** the task runs, so the request payload is available and a weight may depend on how much work the caller asked for. |

The weight is only applied when the call succeeds. A response with `status` other than
`Success` is not charged, whatever the weight.

### `IsExempt`

| | |
|---|---|
| Parameter | `Argument` — the `Message Argument ori` of the call being metered. |
| Returns | `true` when the type is exempt from licensing. |
| Effect | An exempt call is never counted **and** never blocked by the quota check. It runs even when the caller's pool is exhausted. |

Exemption takes precedence over the weight.

### `GetMeterName`

| | |
|---|---|
| Parameters | None — a meter names a family of message types, not a single call. |
| Returns | A meter name of at most 50 characters, or an empty string. |
| Blank | Consumption is reported in the pool total only. |
| Storage | Foundation upper-cases the name before writing it to the `Meter` field, so `Playbook` and `PLAYBOOK` are one meter. |

A meter never replaces the pool total; it is an additional breakdown reported alongside it.

## Behaviour matrix

| `IsExempt` | `GetChargeWeight` | Quota checked before the call | Charged on success | Reported under the meter |
|---|---|---|---|---|
| `true` | any | No | No | No |
| `false` | `0` or negative | Yes | No | No |
| `false` | `N` (1 or more) | Yes, for `N` units | `N` units | Yes, when `GetMeterName` is not blank |

## Implementations in Foundation

| Codeunit | Used by | Behaviour |
|---|---|---|
| `Default Metering ori` (10078308) | Every value that does not name an implementation | Weight `1`; `Help.*` and `Webhook.*` exempt by name prefix; no meter. |
| `Help MsgTypes Metering ori` (10078309) | `Help.MessageTypes.Get` | Weight `0`, always exempt, no meter. |

`Help MsgTypes Metering ori` is the worked example: the API directory declares its
exemption through the interface instead of relying on the `Help.*` name prefix, so
discovery stays free even if the type is ever renamed out of the `Help.*` group.

## What is recorded

Each processed message records the result of metering on the `Message ori` row:

| Field | Type | Meaning |
|---|---|---|
| `Charge Type` | Enum `Charge Type ori` | The pool the message was charged against, or `None` when the message is exempt or already reported. |
| `Charge Weight` | Integer, default `1` | The units the message consumed. |
| `Meter` | Code[50] | The meter the message was reported under. Blank means pool total only. |

Both new fields are `Access = Internal`. See [Licensing](/foundation/reference/licensing/)
for how they reach the daily usage sync.

## Discovery

- `Help.MessageTypes.Get` returns `exempt`, `chargeWeight` and `meter` per message type, so
  a caller can price a call before making it.
- `Help.License.Get` returns an optional `pendingMeters` object with the per-meter units
  charged locally but not yet reported.

## Related

- [Licensing](/foundation/reference/licensing/) — the pools, enforcement and the usage sync.
- [Metering a message type](/extensibility/metering) — how a dependent app opts in.
- [Foundation public surface](/extensibility/public-surface) — every public extension point.
