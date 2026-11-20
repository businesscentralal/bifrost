---
id: playbook-template-editor
title: "Playbook Template Editor"
sidebar_label: "Playbook Template Editor"
sidebar_position: 26
---

The **Playbook Template Editor** shows the request template of one playbook step in a full-page text editor, which is easier to work in than the FactBox for a longer request. Open it with **Edit** in the [Request Template](/help/orchestrator/playbook-step-template-fact-box/) FactBox on the [Bifrost Playbook](/help/orchestrator/playbook-card/) card.

Your changes are saved to the step as you type. When you close the editor, the FactBox shows the updated template. If you cannot change the playbook, the editor opens read-only.

## Fields

| Field | Description |
| --- | --- |
| **Step Kind** | Read-only: **Message** for an operation request, or **Transform** for local data preparation. Change it in the **Steps** part of the playbook card. |

For a **Message** step, the template is the JSON request sent to the operation. For a **Transform**
step, the editor is labelled **Transform Input**: the template supplies the data for the
[Transform Fields](/help/orchestrator/playbook-card/#transform-fields) mappings on the card.

In both cases, values written as `@` followed by a path are filled in when the step runs, as described
for the [Request Template](/help/orchestrator/playbook-step-template-fact-box/) FactBox. After editing
the input, return to the card to check the step and its mappings.
