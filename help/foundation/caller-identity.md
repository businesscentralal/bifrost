---
id: caller-identity
title: "Caller Identity"
sidebar_label: "Caller Identity"
sidebar_position: 31
---

The **Caller Identity** FactBox displays information about who created a bifrost message. It resolves the system-level user ID into a readable name and identifies whether the caller is a user or an AAD application.

## Fields

| Field | Description |
| --- | --- |
| **Caller Name** | The resolved display name of the user or application that created the message. |
| **Caller Type** | Indicates whether the caller is a _User_ or an _AAD Application_. |

## How It Works

The FactBox uses the `SystemCreatedBy` field on the message record to look up the caller's identity in the user and application registries. This provides audit visibility into which integration or user initiated each message.

## See Also

-   [Bifrost Messages](/help/foundation/bifrost-messages/) – Message list
