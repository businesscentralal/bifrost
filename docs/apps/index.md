---
id: index
title: "Apps built on Bifröst"
sidebar_label: "Apps built on Bifröst"
sidebar_position: 1
slug: /
description: "The registry of Business Central extensions built on Bifröst Foundation — search, filter by domain, and find AppSource, docs and repository links for each one."
---

import AppRegistry from '@site/src/components/AppRegistry';

# Apps built on Bifröst

Every app on this page is a Business Central extension that depends on
[Bifröst Foundation](/foundation/) and adds its own message types, help pages
and setup. The list below is generated from a single JSON file,
[`data/apps.json`](https://github.com/businesscentralal/bifrost/blob/main/data/apps.json),
which is also published as-is at [`/apps.json`](https://businesscentralal.github.io/bifrost/apps.json) for tools and
in-product listings to read directly.

Search by name or summary, or filter by domain, to find the app you need.

## Apps and help: what is the difference

Each app has two kinds of pages on this site:

| | The app's section (for example [Foundation](/foundation/)) | The app's help (for example [Foundation help](/help/foundation/)) |
|---|---|---|
| **What it says** | What the app adds, and the message types it brings | What one page in Business Central is for, its fields and actions |
| **Who reads it** | Anyone choosing apps, administrators, developers, and agents looking up a message type | A user on that page, who opens it from Business Central with the help button |
| **Find it** | The **Apps** menu | The **Help** menu, or from inside Business Central |

An agent does not need either: it asks Bifröst which message types exist and reads their help
directly.

<AppRegistry />

## Building your own?

If you are building a Business Central extension that depends on Bifröst
Foundation, you can list it here too — whether it is published on AppSource
already or still in development. See
[Register your app](/apps/register-your-app/) for what is required and how to
open the pull request.
