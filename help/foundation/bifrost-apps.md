---
id: bifrost-apps
title: "Bifröst Apps"
---

**Find Apps** is in the **Apps** group on [Bifrost Setup](/help/foundation/bifrost-setup/). It opens **Bifröst Apps**, a read-only list of every Bifröst application in the public registry on docs.bifrost.origo.is, together with any other Bifröst application installed in this environment. Every user who can open Bifrost Setup can open it.

| Field | Description |
| --- | --- |
| **App Name** | The application. |
| **Summary** | A one-line description of what the application does. |
| **AppSource Status** | Whether the application is **Available** on AppSource or **Coming soon**. |
| **Installed Version** | The version installed in this environment. Blank when the application is not installed. |
| **Latest Version** | The latest version published on AppSource. |
| **State** | How the installed version compares with the latest version, see below. |

## States

| State | Meaning |
| --- | --- |
| **Not installed** | The application is available but is not installed here. |
| **Up to date** | The installed version is the latest version. |
| **Update available** | A newer version is on AppSource. The row is highlighted and listed first. |
| **Newer than AppSource** | The installed version is newer than the published one, for example a build from a development or test environment. |
| **Coming soon** | The application is announced but not yet on AppSource. |
| **Unknown** | The application is installed but is not in the public registry, for example a per-tenant extension, or no latest version is known. |

Updates are listed first, then installed applications, then applications that are not installed, then those that are coming soon. Within each group the list is sorted by name.

## Actions

| Action | What it does |
| --- | --- |
| **Open in AppSource** | Opens the application's listing on Microsoft Marketplace. |
| **Documentation** | Opens the documentation for the application. |
| **Release notes** | Opens the release notes for the latest AppSource version. |
| **Open the registry on the web** | Opens the public registry in your browser. Always available. |
| **Refresh** | Reads the registry and the release versions again, in the background. |

**Open in AppSource**, **Documentation** and **Release notes** are available only when the registry has a link for the selected application. Applications that are not in the registry have no links.

The list opens at once with the information from the last time it was read. When that information is more than 24 hours old, Bifröst Foundation reads it again in the background and updates the list. Nothing about your tenant, company or users is sent when it does. If the registry cannot be read, because outbound HTTP is not enabled for Bifröst Foundation or the service cannot be reached, a notification says so and the list still shows the installed applications. Use **Open the registry on the web** to look them up in your browser. Outbound HTTP must be enabled for Bifröst Foundation, on-premises as well as online.

Find Apps does not install or update applications. Install from AppSource, and update in the Business Central admin center under **Environments**, **Apps**.

