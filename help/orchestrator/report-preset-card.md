---
id: report-preset-card
title: "Report Request Preset"
sidebar_label: "Report Request Preset"
sidebar_position: 12
---

A **Report Request Preset** stores the filters and options of a report request page so that the report can be run later without any user interaction – from a playbook step or from a scheduled job. Presets are personal: each one belongs to the user who created it.

Enter a report ID, then use **Capture Request Page** to open the report's own request page and save the parameters you set there.

## Fields

| Field | Description |
| --- | --- |
| **Report ID** | The object ID of the report. When you enter an ID, the report caption is looked up and copied into the description if the description is still blank. |
| **Report Caption** | The caption of the report, read-only. |
| **Description** | A description of this preset. |
| **Has Request Page XML** | Read-only indicator showing whether request page parameters have been captured for this preset. |

## Actions

| Action | Description |
| --- | --- |
| **Capture Request Page** | Opens the report's request page with the currently saved parameters, so you can set filters and options, and saves them on the preset. Cancelling the request page leaves the preset unchanged. Enabled once a report ID has been entered. |
| **Clear Preset** | Removes the saved request page parameters from the preset. The report ID and description are kept. |
