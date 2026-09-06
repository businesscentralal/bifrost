---
id: index
title: "Build on Bifröst"
sidebar_label: "Build on Bifröst"
sidebar_position: 1
slug: /
description: "What Bifröst Foundation gives a dependent app, what the app owns, and the eight things every dependent app does."
---

# Build on Bifröst

Bifröst Foundation is a Business Central extension that turns AL business logic into a
callable, self-describing API. A **dependent app** is an ordinary BC extension that takes
a dependency on Foundation and adds its own message types to it. Foundation handles the
transport, the queue, the language switching, the licensing, the logging and the
discovery; the dependent app writes business logic and a help document.

Bifrost Nornir, Bifrost Hnitbjorg and Bifrost Bragi are all built exactly this way, and
the code samples in this section are taken from them.

## What Foundation gives you

| Area | What you get | Where it is described |
| --- | --- | --- |
| Message pipeline | The `tasks` API endpoint, the `Message ori` queue, the orchestrator that resolves your implementation and runs it | [Message types](/extensibility/message-types) |
| Extension point | The extensible `Message Type ori` enum and the `Msg Interface ori` contract | [Message types](/extensibility/message-types) |
| In-process dispatch | `Dispatcher ori`, the supported way to invoke a message type from AL | [Message types](/extensibility/message-types) |
| Discovery | `Help.MessageTypes.Get`, `Help.Implementation.Get` and the `OnAfterCreatingOverview` event behind `Help.Bifrost.Get` | [Help codeunits](/extensibility/help-codeunits) |
| Administration | The Bifröst Setup page, with an `Apps` action group and a matching `Category_Apps` promoted category your app hooks into | [Setup and secrets](/extensibility/setup-and-secrets) |
| Credentials | `Secret Store ori` — registration, a masked-input dialog, IsolatedStorage-backed values, and the shared **Bifrost App Secrets** page | [Setup and secrets](/extensibility/setup-and-secrets) |
| Outbound logging | The shared request log, the extensible `Request Log Type ori` enum and the `Request Log Masker ori` contract | [Setup and secrets](/extensibility/setup-and-secrets) |
| Data guards | The ChangeLog Write Guard and `AddChangeLogGuardException` for tables your app writes itself | [Install and upgrade](/extensibility/install-and-upgrade) |

## What your app is responsible for

Foundation never guesses what your message types do. Your app owns:

- the enum values that name your message types, and the codeunit behind each one;
- the Markdown help contract a caller reads before invoking a type;
- returning `status = Error` with a usable message instead of letting an exception escape;
- its own setup table and page, its own secrets registration, its own masker;
- its own install and upgrade path, including taking data over from a retired predecessor;
- its own test app, with unit tests and any test-only message types it needs.

## Declare the dependency

Foundation is app id `7505e808-6e52-4b96-a328-82573391297a`, publisher `Origo`:

```json
"dependencies": [
    {
        "id": "7505e808-6e52-4b96-a328-82573391297a",
        "name": "Bifrost Foundation",
        "publisher": "Origo",
        "version": "28.0.0.0"
    }
]
```

A dependency is not transitive in the sense you might expect: if you also build on
another Bifröst app — Bragi, say — list both that app **and** Foundation.

Foundation's public objects live in the namespace `Origo.Bifrost`, so every file that
touches them carries `using Origo.Bifrost;`.

## The eight things every dependent app does

1. **Claim an object ID range and follow the naming rules.** Each app has its own
   registered block; every object carries the ` ori` affix and lives in an
   `Origo.Bifrost.<App>` namespace. See [Object and naming conventions](/extensibility/conventions).
2. **Register its message types** by extending the `Message Type ori` enum, one `value`
   per type, each binding `Msg Interface ori` to an implementation codeunit. See
   [Message types](/extensibility/message-types).
3. **Implement each type** against `Msg Interface ori`, read the request and write the
   response through `Message Argument ori`, and return `status = Error` rather than
   throwing. See [Message types](/extensibility/message-types).
4. **Ship one help codeunit per domain**, expose them through a `Help.<Domain>.Get`
   message type, and add one row to the global overview. See
   [Help codeunits](/extensibility/help-codeunits).
5. **Hang its setup off the Bifröst Setup page** — exactly one action in the `Apps` group,
   and setup pages with `UsageCategory = None` so they are reachable from there and not
   from Tell Me. See [Setup and secrets](/extensibility/setup-and-secrets).
6. **Keep credentials out of tables**: register them with `Secret Store ori`, and register
   a request log type with a masker so nothing sensitive lands in the request log in clear
   text. See [Setup and secrets](/extensibility/setup-and-secrets).
7. **Install and upgrade deliberately**: take data over from the app it replaces, register
   retention policies, and declare any ChangeLog guard exceptions. See
   [Install and upgrade](/extensibility/install-and-upgrade).
8. **Ship a test app** with unit tests, and with test-only `Test.*` message types where the
   product API cannot reach internal setup. See [Testing](/extensibility/testing).

## The apps to read

When a page here says "as in Nornir" or "as in Hnitbjörg", these are the apps meant:

- [Bifrost Nornir](/nornir/) — scheduling and playbooks. A large dependent app: 20 message
  types, one help codeunit with a `case`, an install codeunit that takes data over from a
  retired Cloud Events app.
- [Bifrost Hnitbjorg](/hnitbjorg/) — external storage connectors. A small dependent app,
  and the clearest minimal example: one help codeunit per domain, a setup page reached
  from Bifröst Setup, a mock connector in the test app.
- [Bifrost Bragi](/bragi/) — chat and language models. Interesting for its own
  extensibility surface and for its request-log maskers.
- [Bifrost Foundation](/foundation/) — the platform itself. Its
  [public surface](/extensibility/public-surface) lists every interface, extensible enum,
  integration event and control add-in a dependent app may rely on; anything not listed
  there is internal.
