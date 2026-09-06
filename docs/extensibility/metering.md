---
id: metering
title: "Metering a message type"
sidebar_label: "Metering a message type"
sidebar_position: 3
description: "Opting a message type into the Msg Metering ori interface to control what one successful call costs, whether it is free, and which meter it reports under."
---

# Metering a message type

Bifröst charges the caller's licence pool once per successful, non-exempt message. Which
pool a call lands in — **User** or **App Registration** — is resolved centrally and is not
something a message type can influence. What a message type *can* influence is the price:
how many licence units one successful call consumes, whether it is free, and under which
meter the consumption is reported.

That is what `Msg Metering ori` is for. It is a second, optional interface on the same enum
value that already names your implementation.

## Two interfaces on one enum

Foundation's `Message Type ori` (10077894) now declares both:

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

`Msg Interface ori` says what the type **does**. `Msg Metering ori` says what it **costs**.
The two are separate so that pricing can change without touching business logic, and so
that a family of types can share one metering codeunit.

## Nothing to do for existing apps

Because the enum declares `DefaultImplementation`, every value that does not name a
`Msg Metering ori` implementation — including the enum-extension values in your app — falls
back to `Default Metering ori`, which reproduces exactly what Bifröst did before the
interface existed:

- charge weight **1** per successful call;
- `Help.*` and `Webhook.*` types **exempt**, by name prefix;
- **no** meter.

Bifrost Nornir and Bifrost Bragi were compiled unchanged against the new Foundation to
confirm it. If you are happy with one unit per call, add nothing.

## The contract

```al
interface "Msg Metering ori"
{
    procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer
    procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean
    procedure GetMeterName(): Text[50]
}
```

| Procedure | Returns |
| --- | --- |
| `GetChargeWeight` | The licence units one **successful** call consumes. `0` makes the call free; a negative value is treated as `0`. |
| `IsExempt` | `true` when the type is never charged **and** never blocked by a quota check. |
| `GetMeterName` | The optional meter the consumption is reported under, next to the pool total. Blank means pool total only. |

Both `GetChargeWeight` and `IsExempt` receive the `Message Argument ori` of the call and
are evaluated **before** the task runs, so the request payload is available: a weight may
depend on how much work the caller asked for. `GetMeterName` takes no argument — a meter
names a family of types, not a single call.

The full signatures, parameter meanings and the resulting behaviour matrix are in the
[metering interface reference](/foundation/reference/metering-interface/).

## Opting in

Name the metering implementation on the enum value, alongside the one you already have:

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

enumextension 10035535 "Orchestrator Msg Type ori" extends "Message Type ori"
{
    value(10035560; "Orchestrator.Playbook.Run")
    {
        Caption = 'Orchestrator.Playbook.Run', Locked = true;
        Implementation = "Msg Interface ori" = "Playbook Run Msg ori", "Msg Metering ori" = "Playbook Run Metering ori";
    }
}
```

Then write the metering codeunit. It is metadata, not business logic: keep it small, keep
it side-effect free, and never let it fail — it runs on the licensing path before your
implementation does.

```al
namespace Origo.Bifrost.Nornir;

using Origo.Bifrost;

/// <summary>
/// Metering for Orchestrator.Playbook.Run. A playbook run costs one unit per step the
/// caller asked for, so a caller that batches ten steps into one call is charged the same
/// as one that sends ten calls.
/// </summary>
codeunit 10035561 "Playbook Run Metering ori" implements "Msg Metering ori"
{
    Access = Internal;

    var
        PlaybookMeterTok: Label 'PLAYBOOK', Locked = true;

    /// <summary>
    /// Returns one unit per requested step, and one unit for a request without steps.
    /// </summary>
    /// <param name="Argument">The message argument of the call being metered.</param>
    /// <returns>The units to charge for this call.</returns>
    internal procedure GetChargeWeight(var Argument: Record "Message Argument ori"): Integer
    var
        RequestJson: JsonObject;
        LinesToken: JsonToken;
        LineCount: Integer;
    begin
        RequestJson := Argument.GetRequestJson();
        if not RequestJson.Get('lines', LinesToken) then
            exit(1);
        if not LinesToken.IsArray() then
            exit(1);
        LineCount := LinesToken.AsArray().Count();
        if LineCount < 1 then
            exit(1);
        exit(LineCount);
    end;

    /// <summary>
    /// Returns false: running a playbook is licensed work.
    /// </summary>
    /// <param name="Argument">The message argument of the call being metered.</param>
    /// <returns>Always false.</returns>
    internal procedure IsExempt(var Argument: Record "Message Argument ori"): Boolean
    begin
        exit(false);
    end;

    /// <summary>
    /// Returns the meter every playbook message type reports under.
    /// </summary>
    /// <returns>The playbook meter name.</returns>
    internal procedure GetMeterName(): Text[50]
    begin
        exit(PlaybookMeterTok);
    end;
}
```

Foundation upper-cases the meter name before storing it on the message, so `Playbook`,
`playbook` and `PLAYBOOK` are the same meter. Keep it short, stable and locked — like the
enum value name, a meter is a wire contract once it has been reported.

## Choosing a weight

- **Keep weights small and predictable.** A caller should be able to work out what a call
  costs from the help document without running it.
- **A weight above 1 has to be justified by real cost** — work the tenant would otherwise
  have paid for as several calls, or an outbound service Origo pays for per unit. It is not
  a pricing lever.
- **Use a meter to report a family of types together**, not to split one type into
  sub-buckets. `PLAYBOOK`, `LLM`, `STORAGE` are the shape; one meter per message type is
  not.
- **Exempt means "not licensed work".** Discovery, help and webhook callbacks are exempt so
  that a tenant with an exhausted pool can still find out what Bifröst does and buy more.
  An exemption is not a way to give away licensed work for free.

Exempt wins over weight: an exempt type is neither counted nor blocked, whatever
`GetChargeWeight` returns.

## What the caller sees

Metering is visible through the discovery types, so a caller can price a call before making
it:

- `Help.MessageTypes.Get` returns `exempt`, `chargeWeight` and `meter` for every type.
- `Help.License.Get` returns an optional `pendingMeters` object with the per-meter units
  charged locally but not yet reported.

`Help.MessageTypes.Get` is itself the worked example in Foundation: it declares its
exemption through `Msg Metering ori` rather than relying on the `Help.*` name prefix, so
the API directory stays free even if the type is ever renamed out of the `Help.*` group.

## Next

- What the fields on the message and the daily usage sync do with a weight and a meter:
  [Licensing](/foundation/reference/licensing/).
- The method-by-method contract and the behaviour matrix:
  [Metering interface](/foundation/reference/metering-interface/).
- The other interface on the same enum value:
  [Message types](/extensibility/message-types).
