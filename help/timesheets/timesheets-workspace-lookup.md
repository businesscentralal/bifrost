---
id: timesheets-workspace-lookup
title: "Clockify Workspaces"
sidebar_label: "Workspace Lookup"
sidebar_position: 5
---

**Clockify Workspaces** is a modal lookup that lists the Clockify workspaces the stored company API key can reach. It opens from the **Default Workspace ID** field on [Timesheets Setup](/help/timesheets/timesheets-setup/); choosing a row writes both the workspace identifier and its name onto the setup card.

The list is fetched from Clockify each time the lookup opens, so it always shows what the key can actually see. It is not stored in Business Central and cannot be edited.

## Fields

| Field | Description |
| --- | --- |
| Name | The name of the Clockify workspace. |
| Workspace ID | The Clockify workspace identifier. This is the value that a Bifröst request passes as `workspaceId`. |

## Why a default workspace matters

Most Clockify message types take a `workspaceId` in the request. When a request leaves it out, the connector falls back to the default workspace set here. Registering the real-time webhooks also requires a default workspace, because a webhook belongs to one workspace.

## If the list is empty or does not open

- **No key stored** — the lookup needs the company API key. Set it with **Set Company API Key** on [Timesheets Setup](/help/timesheets/timesheets-setup/) first.
- **No workspaces available** — the key is valid but the Clockify user it belongs to is not a member of any workspace. Add the user to a workspace in Clockify, or use a key from a user who is.
- **The workspaces could not be retrieved** — Clockify answered with an error. The message includes what Clockify said; a rejected key and an unreachable service look different, so read the text before replacing the key.
