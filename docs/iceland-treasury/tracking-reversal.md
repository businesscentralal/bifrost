---
id: tracking-reversal
title: "Reversing payment and claim tracking"
sidebar_label: "Reversing tracking"
sidebar_position: 3
description: "How a payment or claim tracking record is reversed locally in Bifröst Iceland Treasury, what the reversal covers, what stays visible, and how long tracking records are kept."
---

# Reversing payment and claim tracking

This page is for the finance team and the administrator who need to take a payment or claim tracking record
out of the working view, for example a batch that was registered by mistake and refused or cancelled at the
bank. When you have read it you know what a reversal does, what it does not do, and how long Bifröst Iceland
Treasury keeps the tracking records.

## What a reversal does

A reversal marks a tracking record as **Reversed** (*Bakfært*) in Business Central. It is a local bookkeeping
step on the tracking pages. It is **not** a bank operation:

- It sends nothing to the bank and changes no status at the bank. A batch the bank has paid stays paid
  there. To cancel a claim or a payment at the bank, use the bank's own steps (see
  [Payments and claims](/iceland-treasury/payments-and-claims/)).
- It does not post, repay or reverse any money in Business Central.
- It does not delete anything. The record, its fields and its history stay in Business Central.

An assistant, an integration or a routine reverses a record: you give it the record and a reason of 1 to 150
characters. The reason is kept with the reversal. The installed operations are listed by the MCP tools
(`list_domains`, `describe_domains`, `describe_message_type`) and on the Bifrost Message Types page in Business
Central. Reversing needs its own permission set, `BIFROST TReverse ori`; see
[Permissions](/iceland-treasury/#permissions).

## What a reversal covers

You can reverse a single line or a whole family of records:

| You reverse | Also reversed |
|---|---|
| A payment batch | Its payment lines |
| A claim batch | Its claims, their lines and their payments |
| A single claim | Its lines and its payments |
| A single line or payment | Only that record |

The reversal of a batch or a claim is all or nothing: either every record in the family is marked, or none
is. Records that are already reversed are left as they are.

## Reversing twice does nothing

A record is reversed **once**. Each record that changes gets one entry on the
[Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/), with the action **Reverse** and the reason. Reversing the same record,
batch or claim again changes nothing, writes no new entry and reports that no record was newly reversed, so it
is safe to repeat the request if you are unsure whether it went through.

## What you see afterwards

Reversed records are hidden by default, so the working lists show only what is still live:

- On the tracking pages, a **Reversed** field marks the record, and **Show/Hide Reversed** brings reversed
  records back into the list or hides them again. Showing them does not change their status at the bank.
- Lists read through an assistant leave reversed records out unless the request asks for them.
- Reversed records offer no next steps and are not refreshed from the bank, and statement matching skips them.
- A claim that was reversed here is not reopened when the bank later reports it as active.
- Nothing can mark a record Reversed except the reversal itself; the ordinary create and change operations
  cannot.

## How long records are kept

The payment and claim tracking records are registered with Business Central's retention policies with a
minimum age of seven calendar years, counted from the last change to the record.

- Only a **whole family** is ever removed, and only when every record in it is completed and at least seven
  years old. A family with one open or recent record is kept as a whole.
- Open records are never removed.
- Reversed and not reversed records follow the same rule.
- Registering the tables does not start any deletion. Records are removed only if an administrator sets up and
  enables a retention policy for them in Business Central.
- Payment history that earlier Arion banki, Landsbankinn and savings bank versions kept in their own tables is
  not moved into the shared tracking records.

## Next steps

- [Payments and claims](/iceland-treasury/payments-and-claims/): how a batch or a claim is followed from the
  bank to paid.
- [Bank Tracking Log](/help/iceland-treasury/bank-tracking-log/): the entry each reversal leaves.
- [Permission sets](/iceland-treasury/#permissions): who may reverse.
