---
id: clockify-user-getcurrent
title: "Clockify.User.GetCurrent"
sidebar_label: "Clockify.User.GetCurrent"
sidebar_position: 37
description: "Request and response contract for the Clockify.User.GetCurrent Bifröst message type."
---

:::info Generated page
This page is generated from the message type's own help codeunit by
`tools/generate-message-type-docs.ps1`. Edit the help codeunit in the app, not this file.
:::


Returns the currently authenticated Clockify user. Use its id as userId for time-entry operations.

## Metadata
- **Direction:** Outbound
- **Content-Type:** text/json
- **Clockify API:** `GET /user`
- **Tracks in:** Clockify Integration table (`Clockify Type` = `user`)

## Request example
```json
{ }
```

## Response
Success:
```json
{ "status": "Success", "statusCode": 200, "data": ... }
```
`data` contains the authenticated user object (includes `id`, `name`, `email`, `activeWorkspace`, `defaultWorkspace`).

Failure:
```json
{ "status": "Error", "statusCode": <N>, "error": "<Clockify error message>" }
```

## Integration tracking
No tracking action required — this is a read operation. Use the returned `id` as `userId` in time-entry operations.

## Common errors

| HTTP | Error | Resolution |
|---|---|---|
| 401 | Unauthorized | Check API key on Clockify Setup |

## Notes
- No parameters needed — returns the user who owns the API key.\- The `id` field is the `userId` required by `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.List`, etc.\- `activeWorkspace` is the user's currently selected workspace ID.

## Related operations
- **List all users in workspace:** `Clockify.User.List`\- **Use userId for time entries:** `Clockify.TimeEntry.Create`, `Clockify.TimeEntry.List`

---
Full integration-table reference and entity model: request help for `Help.Clockify.Get`.

