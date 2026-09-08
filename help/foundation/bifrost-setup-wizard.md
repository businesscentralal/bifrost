---
id: bifrost-setup-wizard
title: "Bifrost Setup Wizard"
sidebar_label: "Setup Wizard"
sidebar_position: 23
---

The **Bifrost Setup Wizard** is the single destination for every Bifrost setup notification. No individual Bifröst application ever shows its own setup banner — when something needs attention (outbound HTTP, credentials, a trial licence, the MCP server connection, the Entra enterprise app), [Bifrost Setup](/help/foundation/bifrost-setup/) points here, and the wizard walks through every application that is currently installed.

The wizard can also be opened at any time from the Assisted Setup list, or from **Start setup wizard** on the HTTP client requests notification on Bifrost Setup.

## Steps

| Step | What happens |
| --- | --- |
| **1. Welcome** | Explains what the wizard does and shows the licence agreement (EULA) for Bifröst Foundation. You must accept it before continuing. |
| **2. HTTP** | Lists every registered Bifröst application and whether outbound HTTP client requests are enabled for it. See [HTTP step](#http-step) below. |
| **3. Credentials** _(optional)_ | Lists the credentials every installed Bifröst application has registered, so you can enter values that are still missing. This step never blocks **Next** — see [Credentials step](#credentials-step) below. |
| **4. Trial activation** | Shows the trial licence status (1,000 User + 1,000 App Registration messages, provisioned automatically on install) and lets you request additional licences if the trial is running low. |
| **5. MCP server connection** | Shows whether the Origo BC MCP server can reach this environment, and the connection details an administrator needs to configure it. |
| **6. Entra enterprise app** | Confirms that the Entra ID enterprise application used for API authentication has been authorised for this tenant, with a link to complete the admin consent if it has not. |
| **7. Finish** | Marks the assisted setup as complete and closes the wizard. Every setting can be changed again later from [Bifrost Setup](/help/foundation/bifrost-setup/) or from the wizard itself. |

### HTTP step

Outbound HTTP is required by most Bifröst applications — for notifications, webhooks, and calls to external services. The step shows a table (one row per installed Bifröst application) with the application name and its current HTTP status.

-   **Enable HTTP for all apps** is shown whenever at least one installed Bifröst application still has outbound HTTP disabled — not only Bifröst Foundation itself. Running it enables outbound HTTP for every listed application in one action; the table and the action's own visibility refresh automatically afterwards.
-   If you do not have permission to change extension settings, the action stays visible but **disabled**, and a note explains: _"You do not have permission to change extension settings. Ask an administrator with the SUPER permission set (or write permission on table NAV App Setting) to enable Allow HttpClient Requests for the applications listed above."_
-   **Verify** re-reads the HTTP status of every application without leaving the step.

### Credentials step

Every installed Bifröst application can register the credentials it needs with the shared secret store (see [Secrets](/foundation/reference/secrets/)). This step lists all of them across every installed application. Select a row and choose **Set value...** to enter it through the shared masked dialog.

Missing credentials are never treated as an error here or on Bifrost Setup — a credential that is not set simply disables the message types that depend on it, and can be entered later at any time from Bifrost Setup, action **Secrets**.

## Tips

-   The Credentials step always appears, even when no installed application has registered a credential yet — it simply shows an empty list in that case.
-   Nothing you do in the wizard is destructive: **Back** and **Next** never discard values you have already entered, and you can reopen the wizard as many times as you like.
-   The **Start setup wizard** action on the HTTP client requests notification opens this same wizard — there is no separate, cut-down flow just for HTTP.
