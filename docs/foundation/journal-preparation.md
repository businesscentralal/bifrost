---
title: "Prepare and revise journals"
sidebar_position: 2
description: "Prepare general, item and project journals, remove unwanted lines and review document numbering before posting."
---

Use this workflow when an assistant prepares a general, item or project journal and you need to revise it before posting. Work in a dedicated journal batch so that you can review the intended lines separately from other work.

## Prepare the batch

1. Choose the journal template and batch, and ask the assistant to create the required lines.
2. Review the lines in the corresponding Business Central journal page. Check accounts or items, projects, dates, amounts, dimensions and document numbers as appropriate.
3. If lines are unwanted, ask the assistant to remove the selected lines or every line belonging to selected document numbers in that batch. Review a whole document before removing it: it may contain several lines.
4. If the remaining documents need new numbers, ask for Business Central's document renumbering. You can request removal, renumbering, or both; creating lines does not automatically remove or renumber existing ones.
5. Refresh the journal after a revision. Use the returned current lines and document numbers for subsequent checks rather than relying on the previous result.
6. Run the available journal checks and, where supported, preview posting. Resolve any errors and review the result before requesting posting as a separate action.

## Choose the right journal

| Journal | What to review |
|---|---|
| General journal | Accounts, balancing entries, document groups, dimensions and any applications to existing entries. |
| Item journal | Items, locations, quantities, entry types and document groups. |
| Project journal | Project and task, line type, resource or item, quantity and document groups. |

Removing or renumbering lines does not post the journal and is not a way to change arbitrary line fields. Business Central permissions and journal rules still apply. If a revision is rejected, review the error and the batch before retrying; do not assume that only part of the requested revision succeeded.

The operations available to your assistant depend on the installed app. Ask it to read the environment's live catalogue and help before preparing a request. See [How it works](/documentation/how-it-works/) and [Permissions](/documentation/administrators/permissions/).
