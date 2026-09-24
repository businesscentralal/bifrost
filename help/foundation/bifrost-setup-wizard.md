---
id: bifrost-setup-wizard
title: "Bifrost Setup Wizard"
sidebar_label: "Setup Wizard"
sidebar_position: 23
---

The **Bifrost Setup Wizard** is the single destination for every Bifrost setup notification. No individual Bifröst application ever shows its own setup banner — when something needs attention (the licence agreement, outbound HTTP, credentials, the trial, the MCP server connection), [Bifrost Setup](/help/foundation/bifrost-setup/) points here, and the wizard walks through every application that is currently installed.

Open it from the Assisted Setup list, from **Setup Wizard** on Bifrost Setup, or from **Start setup wizard** on a Bifrost Setup notification. Every company runs it once: until the wizard is finished, Bifröst refuses all calls for the company.

## Steps

| Step | What happens |
| --- | --- |
| **1. Welcome** | Explains what Bifröst stores with Origo (a one-way hash of your tenant ID, the configuration of this company and its message usage) and shows the End-User License Agreement. Select **I accept the End-User License Agreement** to continue. |
| **2. HTTP** | Lists every installed Bifröst application and whether it may make outbound HTTP requests. See [HTTP step](#http-step). |
| **3. Credentials** _(optional)_ | Lists the credentials the installed applications need, so you can enter missing values. See [Credentials step](#credentials-step). |
| **4. Licensing** | Depends on the environment - see [Licensing step](#licensing-step). |
| **5. MCP server connection** | Online only. Shows the MCP server URL to add to your AI agent, the link an administrator (Global Administrator or Application Administrator in Microsoft Entra) uses to authorise the Origo Bifrost enterprise application, and links to the Bifröst connector in the AI agent stores. |
| **6. Finish** | Choose **Finish** to approve the licence agreement for this company, register the company with the licensing service and, in a production environment, activate the trial. The assisted setup is then marked as complete. |

On-premises installations skip step 5.

### HTTP step

Outbound HTTP is required by most Bifröst applications — Bifröst Foundation needs it to reach the licensing service. The step shows the [Bifrost Applications](/help/foundation/registered-apps/) list with each application's HTTP status.

-   **Enable HTTP for all apps** is shown whenever at least one installed Bifröst application still has outbound HTTP disabled. Running it enables outbound HTTP for every listed application in one action.
-   If you do not have permission to change extension settings, the action is disabled and a note explains: _"You do not have permission to change extension settings. Ask an administrator with the SUPER permission set (or write permission on table NAV App Setting) to enable Allow HttpClient Requests for the applications listed above."_
-   **Verify** re-reads the HTTP status of every application without leaving the step.

### Credentials step

Every installed Bifröst application can register the credentials it needs with the shared secret store (see [Secrets](/foundation/reference/secrets/)). The [Credentials](/help/foundation/wizard-credentials/) list shows all of them. Select a row and choose **Set value...** to enter one.

Missing credentials are never an error here or on Bifrost Setup — a credential that is not set disables the message types that depend on it, and can be entered later from **Secrets** on Bifrost Setup.

### Licensing step

| Environment | What the step shows |
| --- | --- |
| **Production (online)** | The trial: **1,000 User + 1,000 App Registration messages**, activated once per Microsoft Entra tenant. **Finish** activates it if the tenant has no trial yet. On Prepaid, the step also explains how the Subscription license starts: when your Bifröst Partner invites the tenant as a Customer and you accept. |
| **Sandbox** | **Sandbox Licensing**: no trial is needed and Bifröst itself does not limit messages; the public MCP server allows 1,000 messages per 24 hours per Microsoft Entra tenant. For unlimited sandbox testing, use the Local MCP server from [businesscentralal/origo-bc-mcp](https://github.com/businesscentralal/origo-bc-mcp). |
| **On-premises** | How to set up the Local MCP server next to your installation, and **Verify Connection** for the licensing-service connection Origo supplied with your on-premises licence. You cannot continue until the connection is verified. |

See [Licensing and partner program](/foundation/licensing) for the licence model.

## Tips

-   A new installation always starts on the **Prepaid** license. The **Subscription** license begins later, when the tenant accepts an invitation from a Bifröst Partner - see [Being a Customer](/foundation/licensing/customer/).
-   Nothing you do in the wizard is destructive: **Back** and **Next** never discard values you have already entered, and you can run the wizard again at any time.
-   **Revoke EULA Approval** on Bifrost Setup withdraws the approval for the company; run the wizard again to restore it.
