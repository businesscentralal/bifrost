---
id: report-preset-card
title: "Report Request Preset"
sidebar_label: "Report Request Preset"
sidebar_position: 12
---

A **Report Request Preset** saves the filters and options you set on a report's request page, so the
report can later run without anyone filling in the request page: when an assistant runs or saves the
report for you, or when a playbook step does. A preset is personal: it belongs to the user who saved
it, and one user has one preset per report.

An assistant gives you a link to this card when it looks up a report, so you can set the options
yourself. Enter a **Report ID**, then choose **Capture Request Page** and set the filters and options on
the report's own request page.

## General

| Field | Description |
| --- | --- |
| **Report ID** | The ID of the report. When you enter it, the report's caption is filled in, and copied to **Description** if that is still blank. |
| **Report Caption** | The caption of the report. |
| **Description** | A description of the preset. |
| **Has Request Page XML** | Shows whether request page options have been saved on the preset. |

## Actions

| Action | Description |
| --- | --- |
| **Capture Request Page** | Opens the report's request page with the options saved so far. When you choose **OK**, the options are saved on the preset; if you cancel, the preset is not changed. Available once a **Report ID** is entered. |
| **Clear Preset** | Removes the saved options. The report ID and description stay. |

## Good to know

- A preset is used only when the report runs without options of its own. When an assistant or a
  playbook step gives the options explicitly, the preset is neither read nor changed.
- A report run on a schedule or in a playbook uses the preset of the user it runs as.
