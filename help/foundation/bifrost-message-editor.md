---
id: bifrost-message-editor
title: "Bifrost Message Editor"
sidebar_label: "Bifrost Message Editor"
sidebar_position: 10
---

The **Bifrost Message Editor** is a card-part page that lets you view and modify the incoming request data (payload) attached to a bifrost message. It is opened from the [Bifrost Messages](/help/foundation/bifrost-messages/) list via the _Edit_ action in the Request group.

## How to Use

1.  Open the [Bifrost Messages](/help/foundation/bifrost-messages/) list.
2.  Select a message and choose the **Edit** action in the Request group.
3.  The editor opens with the full request payload displayed in a multi-line rich-content field.
4.  Make your changes and leave the field. The data is saved automatically when the field is validated.

## Important Notes

-   Editing the request data **will affect how the message is processed** if you retry or run the task afterwards. Use with caution.
-   The editor strips any HTML `<div>` tags before saving, so the stored data remains clean text.
-   You cannot insert new records or delete records from this page; it is for editing the request payload only.
