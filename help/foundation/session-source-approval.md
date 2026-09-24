---
id: session-source-approval
title: "Approve Session Source"
sidebar_label: "Approve Session Source"
sidebar_position: 64
---

**Approve Session Source** asks you to approve a message source - for example an AI assistant or an
integration - before it may submit Bifröst messages as your user. When your user setup requires
approval, messages from a source you have not approved are refused; the source then calls
`Session.Source.Approve`, which returns a link to this page for you to open.

| Field | Description |
| --- | --- |
| **Session Source** | The source that asks for approval. |
| **Description** | Why the source is trusted. |
| **I approve this session source** | Confirms that you trust the source. |

Choose **Approve** to allow the source, or **Cancel** to close the page without approving it. Until
you approve it, messages from the source are refused.
