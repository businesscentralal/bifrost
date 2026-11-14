---
id: session-source-approval
title: "Approve Session Source"
---

**Approve Session Source** asks you to approve a message source - for example an AI assistant or an
integration - before it may submit Bifröst messages as your user. When your user setup requires
approval, messages from a source you have not approved are refused; the source then asks for
approval and gets a link to this page for you to open.

The request may also name the **caller** - the AI host the session comes from, such as Claude or
ChatGPT. The caller code is optional for now. A request without a caller code, or with a blank one,
is accepted, and a code the request does send is still checked. A request without a code checks a
caller already recorded for that source and keeps it. A recorded caller that is not allowed is
refused in the same way as a request that names it. A source with no recorded caller is not checked.
Core issue 1340 tracks when the caller code becomes mandatory again. The company keeps a **Bifrost
Callers** list of which callers may get session approvals here. Open the list from **Callers** on
[Bifrost Setup](/help/foundation/bifrost-setup/). The list is not shown in Tell Me.

| Field | Description |
| --- | --- |
| **Session Source** | The source that asks for approval. |
| **Caller** | The AI host recorded for this source. Shown when a caller is recorded. |
| **Description** | Why the source is trusted. |
| **I approve this session source** | Confirms that you trust the source. |
| **Allow this caller** | Shown when the caller is not allowed in this company. Turn it on to allow the caller here, then approve the source. Only a user who may change the Bifrost Callers can set it. |

If the caller is not allowed, the page shows this warning: *This is a new caller that is not allowed in this company. A user who may change the Bifrost Callers can allow it here; without that permission this session cannot be approved.*

Choose **Approve** to allow the source, or **Cancel** to close the page without approving it. Until
you approve it, messages from the source are refused. If the caller is not allowed, **Approve** is
refused until the caller is allowed — either with **Allow this caller** when you have permission,
or by an administrator on **Bifrost Callers**. A user without that permission sees the warning and
cannot approve the session.

Turning **Allowed** off for a caller on **Bifrost Callers** sets every session source approved under
that caller in this company back to Pending. Turning it back on does not re-approve those sources;
each user must approve again.

The list controls which hosts reach Business Central through the MCP. It is not a security boundary
against a client that calls Cloud Events directly; that client still needs an authorised Entra
identity, the approved Bifröst app, and the per-user session source approval.
