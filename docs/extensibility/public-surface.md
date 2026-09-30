---
id: public-surface
title: "Foundation public surface"
sidebar_label: "Foundation public surface"
sidebar_position: 9
description: "A map of the Bifröst Foundation objects a dependent app may rely on: interfaces, the message type enum, the dispatcher, secrets, app registration, setup, the request log and public events."
---

# Foundation public surface

This page is a map of what a dependent app may rely on in Bifrost Foundation. It names the
objects and says what each one is for. The exact signatures, with notes on how Foundation uses
each member, are in the partner guide's
[Foundation API cheat sheet (§5.7)](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#57-foundation-api-cheat-sheet).

**Anything not named here is internal.** Treat it as something that can change or disappear in
any release, even when it shows up in the symbols.

## Depending on Foundation

Your app depends on **Bifrost Foundation** (publisher Origo, app id
`7505e808-6e52-4b96-a328-82573391297a`), at minimum version `28.0.0.0`. All objects are in the
namespace `Origo.Bifrost`. The complete `app.json` block, and the rules for choosing versions and
id ranges, are in [START-HERE §5.0](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#50-appjson).

## Message types

| Object | What it is for |
|---|---|
| `Message Type ori` (extensible enum) | One value per message type. You add your values with an enum extension and bind each to your implementation. |
| `Msg Interface ori` (interface) | The contract every message type implements: whether it is enabled, its description, direction, filter table, help, and the execution itself. `IsEnabled` only decides whether the type is listed; a direct call is still decided by permissions. |
| `Msg Metering ori` (interface) | Optional hook after a successful call, for your own usage bookkeeping. See [Metering](/extensibility/metering). |
| `Msg Discovery ori` (interface) | Optional search keywords and a selection text that help callers find and choose your type. |
| `Msg Direction ori`, `Message Version ori` (enums) | The direction of a type and the request version. |
| `Message Argument ori` (table) | The one parameter every implementation receives. Its public helpers read the request body and subject, set the response (JSON, Markdown, text or PDF), answer with an error, check the version and licence, and redact a request that carried a secret. |

A successful call is one whose response has no `status`, or `status = "Success"`. An error
answer never contains a call stack.

## Calling message types from AL

`Dispatcher ori` runs a message type from AL code. `Execute` and `EnqueueAndProcess` both write
a message row and run the full Foundation pipeline, the same as a call over the API. Use it from
tests and from AL code that calls another app's type. The round trip, the transaction behaviour
and the language rules are in
[START-HERE §5.7](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#the-dispatcher-round-trip-exactly).

## Setup, registration and secrets

| Object | What it is for |
|---|---|
| `App Registry ori` (codeunit) and `Registered App ori` (table) | Register your app so Foundation includes it in the setup wizard, the setup notifications and App Secrets. |
| `Setup ori` (table and page) | Bifrost Setup. The table is public and its public procedures may be called; for example, `AddChangeLogGuardException` lets your install code exempt a table or field from the change-log write guard. The page takes exactly one action from your app. |
| `User Setup ori` (table) | Per-user Bifröst settings. |
| `Secret Store ori` (codeunit), `Secret Scope ori` (enum) | Store and read your app's credentials. An app reaches only its own secrets. |

How to use these is on [Setup, secrets and the request log](/extensibility/setup-and-secrets).
What an app does at install and upgrade is in [Platform integration in START-HERE](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#55-platform-integration).

## The request log

| Object | What it is for |
|---|---|
| `Request Logger ori` (codeunit) | Write an entry for one of your outbound HTTP calls. |
| `Request Log Reader ori` (codeunit) | Read an entry back. |
| `Request Log Type ori` (extensible enum) | Classify your traffic; each value picks the masker. |
| `Request Log Masker ori` (interface) | Decide what of the bodies, error text and URL is stored. |

## Events

| Codeunit | What you can do |
|---|---|
| `Message Events ori` | React when a message completes or fails (also available as business events for external subscribers), and add to Foundation's overview and line-to-header table mapping. |
| `Preview Events ori` | Add fields and calculated values to posting-preview responses. |
| `Webhook Inbound Events ori` | Handle an inbound webhook payload and mark it as handled. |
| `Data Records Set Events ori` | Inspect a record, or add your own validation, while `Data.Records.Set` writes it. |

## Pluggable behaviour

Each of these is an interface with a selector enum. You add a value to the enum, bind your
implementation, and an administrator chooses it in Bifrost Setup.

| Interface | Selector enum | What you replace |
|---|---|---|
| `Customer Credit Limit ori` | `Customer Credit Limit Type ori` | The credit-limit check. |
| `Customer Statement ori` | `Customer Statement Type ori` | The customer statement PDF. |
| `Item Price Calculation ori` | `Item Price Calc. Type ori` | The item price calculation. |
| `Company Name ori` | `Company Name Type ori` | Which company name outbound payloads carry. |
| `ChangeLog Write Guard ori` | `ChangeLog Write Guard Type ori` | Whether a record write is allowed, based on change-log coverage. |

## Stability

Treat the objects above as the contract. Build against the minimum version you need, do not
depend on internal field numbers, and extend with your own objects in your own id range.
