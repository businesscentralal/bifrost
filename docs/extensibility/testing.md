---
id: testing
title: "Testing"
sidebar_label: "Testing"
sidebar_position: 6
description: "The test-only Test.* message type pattern, the Foundation test types, and test data conventions in a shared company."
---

# Testing

A Bifröst app ships two apps: the product app and a test app that depends on it. The test
app holds the unit tests, any mock implementations the product needs to be exercised
without a live external service, and — this is the part specific to Bifröst — **test-only
message types**.

## Why test-only message types exist

Foundation's own configuration is not reachable through the product API. `Setup ori` and
`ChangeLog Guard Exception ori` are declared `Access = Internal`, which means:

- `Data.Records.Get` and `Data.Records.Set` cannot read or write them;
- an automated test run driving the API from outside BC cannot change the ChangeLog Write
  Guard, cannot switch on Request Debug Mode, and cannot register a guard exception;
- the same run cannot write fields the write guard protects, in any table.

The alternative — asking a person to click through the Business Central UI in the middle of
a test run — is not one. So Foundation's **test app** registers a small set of `Test.*`
message types that do reach those tables. They exist only in the test app, so they are
never installed in a customer environment, and each one refuses to run in a production
environment regardless:

```al
internal procedure AssertNotProduction(var Argument: Record "Message Argument ori"): Boolean
var
    EnvironmentInformation: Codeunit "Environment Information";
begin
    if EnvironmentInformation.IsProduction() then begin
        Argument.RespondWithError(ProductionErr);
        exit(false);
    end;
    exit(true);
end;
```

Every `Test.*` implementation starts with `if not Helper.AssertNotProduction(Argument) then exit;`.

## The Foundation test types

Registered by the Foundation test app on the `Message Type ori` enum:

```al
enumextension 98981 "Test Tools MsgType" extends "Message Type ori"
{
    value(98860; "Test.Setup.Get")
    {
        Caption = 'Test Setup Get', Locked = true;
        Implementation = "Msg Interface ori" = "Test Setup Get Impl";
    }
    value(98861; "Test.Setup.Set")
    {
        Caption = 'Test Setup Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Setup Set Impl";
    }
    value(98862; "Test.Records.Set")
    {
        Caption = 'Test Records Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Records Set Impl";
    }
    value(98863; "Test.Records.Delete")
    {
        Caption = 'Test Records Delete', Locked = true;
        Implementation = "Msg Interface ori" = "Test Records Delete Impl";
    }
    value(98870; "Test.Secret.Set")
    {
        Caption = 'Test Secret Set', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret Set Impl";
    }
    value(98871; "Test.Secret.Clear")
    {
        Caption = 'Test Secret Clear', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret Clear Impl";
    }
    value(98872; "Test.Secret.List")
    {
        Caption = 'Test Secret List', Locked = true;
        Implementation = "Msg Interface ori" = "Test Secret List Impl";
    }
}
```

(`Test.Records.Get`, `Test.Blocking.Set` and `Test.Metering.Fail` also exist, at ordinals 98864–98866,
for reading records generically, forcing a blocked write, and forcing a metering failure in tests — same
shape, omitted here for brevity.)

### `Test.Setup.Get`

Returns every field of the internal `Setup ori` record as JSON, including
`ChangeLog Write Guard` and `Request Debug Mode`. No request parameters.

```json
{ "status": "Success", "setup": { "ChangeLog Write Guard": "Open", "Request Debug Mode": "false" } }
```

### `Test.Setup.Set`

Writes fields of `Setup ori` from a `fields` object and returns the updated record. Field
keys are field names — exact, or case-insensitive without punctuation; enum fields accept
the value name or the ordinal.

```json
{ "fields": { "ChangeLog Write Guard": "Blocked", "Request Debug Mode": true } }
```

`ChangeLog Write Guard` accepts `Open`, `Blocked` or `Via force`.

### `Test.Records.Set`

Inserts or modifies records in **any** table, including internal Bifröst tables and fields
the ChangeLog Write Guard would block. Each record is located by the primary key fields
present in `fields`: found means `Modify(true)`, not found means `Insert(true)`. BLOB and
Media fields are not supported.

```json
{ "tableName": "ChangeLog Guard Exception ori", "records": [ { "fields": { "Table No.": 18, "Field No.": 2 } } ] }
```

`tableId` may be used instead of `tableName`, and names may be given with or without the
` ori` suffix. The response reports `inserted`, `modified` and the resulting records.

### `Test.Records.Delete`

Deletes the records of a table that match a `tableView` filter, one `Delete(true)` per
record. **A filter is mandatory** — deleting a whole table is refused.

```json
{ "tableName": "Customer", "tableView": "WHERE(No.=FILTER(BIFT-*))" }
```

### `Test.Secret.Set`

Registers (idempotent) and writes a value into the shared `Secret Store ori` for an App Id
and Secret Code — exactly what an application does through `Register` + `Set`, without a
setup page or a masked dialog. The value is never returned in the response; the read-and-set
path runs in a single `[NonDebuggable]` procedure so it never surfaces in a debugger session
either. Use dummy values only — the same rule as any other secret written through this store.

```json
{ "appId": "11111111-1111-1111-1111-111111111111", "code": "API-KEY", "value": "dummy-value", "scope": "Company", "description": "Test secret" }
```

`scope` is `Company` (default) or `Company And User`; `description` is optional.

```json
{ "status": "Success", "appId": "...", "code": "API-KEY", "scope": "Company", "isSet": true }
```

### `Test.Secret.Clear`

Clears the stored value of a `Secret Store ori` entry (`codeunit "Secret Store ori".Clear`) —
the registration row stays, `isSet` goes back to `false`. A secret code that was never
registered is a harmless no-op, matching `Clear`'s own behaviour.

```json
{ "appId": "11111111-1111-1111-1111-111111111111", "code": "API-KEY" }
```

### `Test.Secret.List`

Lists the `App Secret ori` registry rows for an App Id — `code`, `description`, `scope`,
`isSet`, `setOn` — so a test can verify a `Test.Secret.Set` / `Test.Secret.Clear` round trip.
The value itself is never read or returned.

```json
{ "appId": "11111111-1111-1111-1111-111111111111" }
```

```json
{ "status": "Success", "appId": "...", "secrets": [ { "code": "API-KEY", "description": "Test secret", "scope": "Company", "isSet": true, "setOn": "2026-09-06T12:00:00Z" } ] }
```

## Add your own `Test.*` types

The rule generalises: **when your app has setup a test run must change and the product API
cannot reach it, add a test-only message type in your test app for it.** Same shape as
Foundation's:

- an `enumextension` on `Message Type ori` in the test app, using ordinals from your **test
  app's** registered range;
- one implementation codeunit per type, `Access = Internal`;
- `AssertNotProduction` as the first statement of `ExecuteBifrostTask`;
- a `GetMessageHelpAsMarkdownDocument` that opens with **"Test app only."** and says the
  type is refused in production;
- `GetDescription` prefixed with `TEST ONLY:`, so the type is unmistakable in
  `Help.MessageTypes.Get`.

Mock implementations follow the same idea for interfaces rather than message types.
Hnitbjörg's test app extends the product's storage-type enum with an in-memory backend, so
the whole connector pipeline can be exercised without a live storage account:

```al
namespace Origo.Bifrost.Hnitbjorg.Test;

using Origo.Bifrost.Hnitbjorg;

enumextension 96200 "Storage Type Test" extends "Storage Type ori"
{
    value(96200; Mock)
    {
        Caption = 'Mock', Locked = true;
        Implementation = "Storage Connector ori" = "Storage Mock Impl";
    }
}
```

An extensible enum in your product app is what makes this possible — design your own
interfaces that way.

## Running a message type from a test

There are two ways in, and they test different things.

**Through `Dispatcher ori`** — the production path. The test dispatches exactly like an
external caller does; see [Message types](/extensibility/message-types). `Execute` is the
lightweight route; `EnqueueAndProcess` exercises the full orchestrator when the test cares
about language switching, response time or the completion event. Use this whenever the
test is about behaviour a caller would see.

**Directly on the implementation codeunit** — the fast path, when the test is about the
implementation's own logic. Build a temporary `Message Argument ori`, fill the request, and
run the Impl against it:

```al
var
    TempArgument: Record "Message Argument ori" temporary;
    StorageFileGetImpl: Codeunit "Storage File Get Impl ori";
begin
    TempArgument.Init();
    TempArgument.SetRequestData(RequestJson);
    TempArgument.SetLicensed(true);
    StorageFileGetImpl.Execute(TempArgument);
end;
```

`SetLicensed(true)` is the part that is easy to miss. In production, `Message Task ori`
marks the call as licensed; a test that skips the task never does, so every
`Argument.AssertIsLicensed()` inside the implementation fails with *"This operation requires
a valid license."*

`SetLicensed` is **internal to Foundation**. For your test app to call it, Foundation's
`app.json` must list that test app under `internalsVisibleTo`:

```json
"internalsVisibleTo": [
    {
        "id": "194ecd04-5688-4af6-94bc-732c714251fc",
        "name": "Bifrost Nornir - Tests",
        "publisher": "Origo"
    }
]
```

Adding an entry there changes Foundation, so **Foundation has to be rebuilt and republished
to the container** before the new test app's tests can run. Do that once, when the test app
is created — not the first time a test fails on a licence error.

## Autonomous testing

An agent driving a test run purely through the queue API (`POST tasks`, no BC UI) needs a
way to turn on the diagnostics it needs, seed the credentials the app under test calls for,
run its scenarios, and clean up afterwards — all through message types. The pattern:

1. **Turn on debug mode.** `Request Debug Mode` is a field on `Setup ori`, so
   `Test.Setup.Get` and `Test.Setup.Set` already cover it — there is no separate
   `Test.Debug.*` type. Read the current value first so it can be restored:

   ```json
   // Test.Setup.Get -> {"status":"Success","setup":{"Request Debug Mode":"false", ...}}
   // Test.Setup.Set
   { "fields": { "Request Debug Mode": true } }
   ```

   Debug mode only changes what `Request Logger ori` maskers keep unmasked for **outbound
   connector calls** your app makes (see [Secrets](/foundation/reference/secrets) and the
   masker interface in this app's own code). It does not affect the Bifröst message
   queue itself: `Message ori`'s `Request Data` / `Response Data` store the raw incoming
   payload for every message type, on or off — that is how the framework routes and
   replays messages, not a masking gap. **`Test.Secret.Set` is the one exception** (fixed
   2026-09-07): it calls `Record "Message Argument ori".RedactRequestData()` immediately
   after storing the value, which overwrites the persisted `Message ori` row's `Request
   Data` with a `{"redacted":true}` placeholder — so the value it received does not stay
   at rest in the queue table either, only in `Secret Store ori`'s protected storage. Any
   other message type still keeps the full request payload verbatim, so use dummy values
   in test payloads regardless of debug mode, the same rule as everywhere else in this
   page. A dependent app that adds its own credential-seeding test type (as Bifröst
   Iceland Treasury's `Test.Treasury.Secret.Set` does) should call the same procedure right
   after consuming the value.

2. **Seed credentials from the caller's own environment, never from a file.** The agent
   reads a value from its own environment variables (or a secret manager) and sends it as
   the `value` property of `Test.Secret.Set` — the value only ever exists in the agent's
   process memory and in `Secret Store ori`'s protected storage, never in a script or
   config file:

   ```json
   { "appId": "<app under test id>", "code": "<secret code>", "value": "<from an environment variable>", "scope": "Company" }
   ```

   Confirm it landed with `Test.Secret.List` (`isSet: true` — the list never echoes the
   value), run the scenarios, then `Test.Secret.Clear` when the run is done.

3. **Set up the application under test** with `Test.Records.Set` for anything the product
   API can't write directly (internal tables, guard-protected fields) — see the type above.

4. **Run the scenarios**: one happy path per message type that verifies the effect by
   reading data back, and at least one negative case that must return `status = Error`
   with a helpful message — never an unhandled exception, never an HTTP 5xx. See
   [Message types](/extensibility/message-types) for the two ways to invoke a type from
   a test.

5. **Turn debug mode back off** (`Test.Setup.Set` with `"Request Debug Mode": false`) and
   clear any secret the run seeded that would not otherwise be there. The run owns
   restoring the state it changed — see "Test data conventions" below.

## Test data conventions

Bifröst apps are tested in shared company databases — CRONUS IS on the Icelandic container,
CRONUS International on the W1 one — which are also used for manual verification and demos.
Two rules follow.

**Prefix everything you create, per test stream.** The convention across the family is
`BIFT-<letter>`: `BIFT-A0001`, `BIFT-B0001`. The prefix makes a test's own records
identifiable, keeps two streams from colliding, and makes cleanup a single filter:

```json
{ "tableName": "Customer", "tableView": "WHERE(No.=FILTER(BIFT-*))" }
```

**Never delete existing master data.** Customers, vendors, items, G/L accounts, dimensions
and posting setups in a shared test company are shared fixtures. A test that deletes them
breaks every other test and every demo in that company. Create your own records, filter to
your own prefix, and delete only what you created.

The same discipline applies to Foundation's own configuration: a run that opens the
ChangeLog Write Guard with `Test.Setup.Set` sets it back to `Blocked` when it is done. The
test run owns restoring the state it changed — not the next person to open the company.

## What a dependent app's test suite covers

- Every message type: a happy path that verifies the effect by reading the data back, and
  at least one negative case that must return `status = Error` with a helpful message —
  never an unhandled exception, never an HTTP 5xx.
- The install take-over, where the app replaces a published predecessor:
  [Install and upgrade](/extensibility/install-and-upgrade).
- Any interface your app defines, through a mock implementation registered on the enum.

Foundation's own test app is the reference for all of this, and it is where the `Test.*`
types documented above live.
