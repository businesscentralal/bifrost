---
id: metering-interface
title: "Metering interface"
sidebar_position: 8
---

`Msg Metering ori` is the metering hook of a Bifröst message type. Foundation calls it once
after every successful message call so that a billing or metering solution can record what
happened. It is the second interface on `Message Type ori`: `Msg Interface ori` says what a
type **does**, `Msg Metering ori` is told when it **has been done**.

Namespace `Origo.Bifrost`. Selector enum `Message Type ori`.

Because the enum names a default implementation that does nothing, **every** value has the hook — Foundation
values and the enum-extension values of dependent apps alike — without declaring anything.

## The method

```al
procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
```

| | |
|---|---|
| Parameter | `Argument` — the completed `Message Argument ori`. Carries the message type (`Type`), the `Subject`, the request content and the response the caller receives. |
| Returns | Nothing. |
| Called | Once, after a **successful** call, once the response has been written to the message log and committed. |
| May | Write to the database. The hook runs in its own transaction scope, so inserts, modifications and queued work are all allowed. |
| Must not | Change the response — the caller already holds it — or assume it runs inside the caller's transaction. |

## When Foundation calls it

Foundation runs the hook when all of the following hold:

- the message type is not one of the exempt types listed below;
- the implementation ran and the response is successful — a JSON object whose `status` is
  `Success`, or a non-JSON response such as PDF or CSV.

Nothing else gates it. In particular the hook runs:

| Condition | Hook runs |
|---|---|
| Production, on-premises, and SaaS sandbox | Yes, in all three |
| Message-quota licensing required | Yes |
| Message-quota licensing **not** required (SaaS sandbox) | Yes |
| Caller's pool exhausted, call refused | No — the call never ran |
| Response `status` is `Error` | No |
| A help, memory, session, webhook or change-log message type of an Origo application | No |

The exemption is the same rule that exempts those types from charging, and it applies only to
Origo's own message types - a type another publisher adds is metered and charged whatever its
name. It is the only exemption: a message type cannot opt itself out of the hook.

## Isolated invocation

A metering implementation must never cost the caller its response, so Foundation does not
call it inline. It runs it through `Codeunit.Run`.

The choice of `Codeunit.Run` over a `TryFunction` is deliberate. A metering implementation is
expected to **write** — a meter entry, a counter, a queued call to a billing service — and the
AL runtime refuses database writes inside a `TryFunction` nested in the message task.
`Codeunit.Run` allows those writes and still isolates a failure:

- an error raised by the implementation is caught by `Run` returning `false`;
- only the writes made inside the hook are rolled back;
- the failure is recorded in Origo's diagnostics;
- the caller receives exactly the response it would have received with no hook at all.

The hook is invoked **after** the response has been written to the message log and committed —
immediately before the webhook notification. By then the caller already holds its response,
which is why nothing the hook does, including failing outright, can reach it.

Foundation counts messages for licensing on its own and needs no help from the hook.

## What the hook does not do

The hook has no influence on charging, and charging is unchanged from before the hook
existed:

- a successful, non-exempt call costs exactly **one message** from the caller's pool;
- the pool — **User** or **App Registration** — is resolved centrally from the caller's
  identity and is recorded with the message;
- there is no charge weight, no meter and no per-type price in the platform.

A solution that needs per-call pricing keeps that model in its own tables and fills it from
the hook.

## Related

- [Metering a message type](/extensibility/metering) — how a dependent app opts in, with the
  codeunit and enum extension to copy.
- [Licensing](/foundation/reference/licensing/) — the pools, enforcement and the usage sync.
- [Foundation public surface](/extensibility/public-surface) — every public extension point.
