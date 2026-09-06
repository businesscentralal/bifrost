---
id: metering
title: "Metering a message type"
sidebar_label: "Metering a message type"
sidebar_position: 3
description: "The Msg Metering ori hook Bifröst calls after every successful message, and how a billing or metering solution attaches its own bookkeeping to it."
---

# Metering a message type

Bifröst calls one hook after every successful message: `Msg Metering ori`. It exists so a
billing or metering solution has somewhere to attach — a per-call rating, a tenant counter,
an external meter — without patching Foundation and without subscribing to an event that
fires for everything.

The hook is deliberately dull. It does not decide what a call costs, it cannot make a call
free, and it cannot change what the caller gets back. It is told that a call happened, and
that is all.

## The contract

One procedure:

```al
interface "Msg Metering ori"
{
    procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
}
```

`Argument` carries the whole completed call: the message type, the subject, the request
content, and the response the caller is about to receive. Read as much of it as you need —
but do not change the response.

The method-by-method contract, the telemetry event and the invocation rules are in the
[metering interface reference](/foundation/reference/metering-interface/).

## When it runs

`Message Task ori` calls the hook once after every **successful** message call:

- in **every environment** — production, sandbox and on-premises alike;
- whether or not message-quota licensing is required in that environment;
- for every message type of every app, Foundation and dependent apps alike.

The single exception is the name-prefix rule that has always governed charging: message
types whose key starts with `Help.` or `Webhook.` never reach the hook. Discovery and
callbacks are not billable work, so they are not metered either. There is no other way to
be exempt — a message type cannot opt itself out.

Nothing runs the hook after a failed call. A response whose `status` is not `Success` is
neither charged nor metered.

## Nothing to do for existing apps

`Message Type ori` declares the interface and a default implementation:

```al
enum 10077894 "Message Type ori" implements "Msg Interface ori", "Msg Metering ori"
{
    Extensible = true;
    DefaultImplementation = "Msg Metering ori" = "Default Metering ori";
    // …
}
```

`Default Metering ori` (10078308) has an empty body. Because the enum names it as the
default, every value — including the enum-extension values in your app — already has the
hook without declaring anything, and doing nothing costs one empty interface call per
successful message. If you are not building a billing solution, stop reading here.

## Charging is unchanged

The hook never influences charging. Charging works exactly as it did before the hook
existed:

- exactly **one message** per successful, non-exempt call;
- charged to the caller's pool, **User** or **App Registration**, resolved centrally;
- recorded in `Message ori."Charge Type"`.

There is no weight, no meter and no per-type price anywhere in the platform. If your
solution needs those, it keeps them in its own tables — which is what the hook is for.

See [Licensing](/foundation/reference/licensing/) for the pools, enforcement and the daily
usage sync.

## Opting in

Write a codeunit implementing the interface, then point the message types you price at it
on the enum value, alongside the implementation you already have:

```al
codeunit 50100 "Contoso Metering" implements "Msg Metering ori"
{
    Access = Internal;

    internal procedure OnMessageCompleted(var Argument: Record "Message Argument ori")
    var
        MeterEntry: Record "Contoso Meter Entry";
    begin
        MeterEntry.Init();
        MeterEntry."Message Type" := ...;      // Argument."Type"
        MeterEntry.Subject := Argument.Subject;
        MeterEntry."Metered At" := CurrentDateTime();
        MeterEntry.Insert(true);
    end;
}

enumextension 50100 "Contoso Msg Types" extends "Message Type ori"
{
    value(50100; "Contoso.Invoice.Rate")
    {
        Caption = 'Contoso.Invoice.Rate', Locked = true;
        Implementation = "Msg Interface ori" = "Contoso Invoice Rate Impl", "Msg Metering ori" = "Contoso Metering";
    }
}
```

Every value that does not name `"Msg Metering ori"` keeps `Default Metering ori`, so you
can meter three types out of thirty and leave the rest alone.

### Getting the type name

If your meter entry stores the message type as text rather than as the enum, do not reach
for `Format()` — the Origo standards forbid it on enum values, because it returns the
caption, not the member name. Go through `Names()` and `Ordinals()`:

```al
TypeName := Enum::"Message Type ori".Names().Get(
    Enum::"Message Type ori".Ordinals().IndexOf(Argument."Type".AsInteger()));
```

That yields the wire name — `Contoso.Invoice.Rate` — in every language.

### Three rules for the body

- **Keep it cheap.** The hook runs on every successful call of the types you claim, on the
  caller's thread, before the response is returned. An insert into your own ledger is fine.
  An outbound HTTP request per call is not — queue the work instead.
- **Never modify the response.** `Argument` is passed by reference so you can read the
  request and the response, not so you can rewrite them. Callers depend on getting exactly
  what the implementation produced.
- **Do not depend on the caller's transaction.** Foundation invokes the hook defensively:
  an error you raise is caught, logged as telemetry, and rolls back your own writes — the
  caller still receives the response it would have received with no hook at all. Your
  bookkeeping is therefore best-effort, and it must be written so that a lost entry is a
  gap in your ledger rather than a corrupt one.

## Next

- The invocation rules, the telemetry event and what is recorded on the message:
  [Metering interface](/foundation/reference/metering-interface/).
- The pools, the quota checks and the daily usage sync:
  [Licensing](/foundation/reference/licensing/).
- The other interface on the same enum value:
  [Message types](/extensibility/message-types).
