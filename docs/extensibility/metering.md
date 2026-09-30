---
id: metering
title: "Metering a message type"
sidebar_label: "Metering a message type"
sidebar_position: 3
description: "What the Msg Metering ori interface is for, when Foundation calls it, and what it can and cannot do."
---

# Metering a message type

`Msg Metering ori` is an optional interface for apps that keep their own usage records: a meter
entry per call, a counter, or a queue for an external billing system. Most apps never need it.

## When it is called

Foundation calls `OnMessageCompleted` once after each **successful** call of a message type.
A call is successful when its response has no `status`, or `status = "Success"`. A failed call
is never passed to the hook.

- It runs **after** the response is written, in its own transaction scope.
- It **may write** to the database: insert a meter entry, update a counter, queue work.
- If it fails, only its own writes are rolled back. The caller still gets the response.
- It **cannot change** the response. The argument lets you read the type, subject, request and
  response, not rewrite them.
- It has **no influence on charging**. Bifröst counts usage the same way whether or not you
  implement the hook. See [Licensing](/foundation/reference/licensing/).

**Which calls are metered:** Foundation's own discovery and help types are not metered; your
app's types, including your own Help type, are.

## Nothing to do by default

Every value of `Message Type ori` already has a default implementation that does nothing. If you
do not meter, you declare nothing.

## Opting in

Write a codeunit that implements `Msg Metering ori`, and name it next to your
`Msg Interface ori` implementation on the enum values you want to meter. Values that do not name
it keep the default.

Keep the body cheap, because it runs on every successful call of those types: write a row, and
queue anything slow such as an outbound HTTP call. Write it so that a lost entry is a gap in your
records, not a corruption.

The pattern, with the exact declaration, is in the partner guide:
[START-HERE §5.7, `Msg Metering ori`](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#interface-msg-metering-ori-advanced-optional)
and [Metering your own types](https://github.com/businesscentralal/bc-bifrost-reference/blob/main/START-HERE.md#metering-your-own-types-advanced).
