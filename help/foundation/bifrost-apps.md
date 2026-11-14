---
id: bifrost-apps
title: "Bifröst Apps"
---

**Find Apps** is in the **Apps** group on [Bifrost Setup](/help/foundation/bifrost-setup/). It opens the **Bifröst Apps** list inside Business Central. The list shows every Bifröst app, which ones are installed in this environment, and whether a newer version is on AppSource.

## Columns

| Column | What it shows |
| --- | --- |
| **App Name** | The name of the Bifröst app. |
| **Summary** | A short description of what the app does. When your Business Central language is Icelandic, the Icelandic summary is shown when the registry has one. |
| **AppSource Status** | Whether the app is **Available** on AppSource, **Coming soon**, or **Unknown**. |
| **Installed Version** | The version installed in this environment. Empty when the app is not installed. |
| **Latest Version** | The latest version published on AppSource, when the registry knows it. |
| **State** | How the installed version compares with AppSource; see below. |

## States

| State | Meaning |
| --- | --- |
| **Not installed** | The app is available but not installed in this environment. |
| **Up to date** | The installed version is the latest version on AppSource. |
| **Update available** | A newer version is on AppSource. The row is highlighted. |
| **Newer than AppSource** | The installed version is newer than the latest on AppSource, for example a preview or a version not yet published. |
| **Coming soon** | The app is announced but not yet on AppSource. |
| **Unknown** | The versions cannot be compared, for example when the latest version is not known. |

## Sort order

Apps with an update available come first, then the other installed apps, then apps that are not installed, and last the apps that are coming soon. Within each group the apps are sorted by name.

## Actions

- **Open in AppSource** opens the app listing on Microsoft Marketplace.
- **Documentation** opens the documentation for the app.
- **Release notes** opens the release notes for the latest AppSource version.
- **Refresh** fetches the registry and the release versions again in the background.
- **Open the registry on the web** opens the public Bifröst app registry in your browser.

An action is available only when the selected app has the matching link.

## Caching and offline behaviour

The list opens at once from what Business Central already has. The registry and the release versions are fetched in the background, at most once a day, or when you choose **Refresh**. Only public information is read; no data from your environment is sent.

If the registry cannot be read, for example when outbound HTTP calls are not allowed for the app, you see a notice with a link to the registry on the web. The installed Bifröst apps are still listed.

## Updating apps

The list never installs or updates apps. Install from AppSource, and update in the Business Central admin center under **Environments**, **Apps**.

To see every installed extension, open **Extension Management**. Administrators in online environments also get the **Bifröst App Updates** list, described on the [Bifrost Applications](/help/foundation/registered-apps/) page, when a newer version of an installed Bifröst app is on AppSource.
