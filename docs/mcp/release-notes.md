---
id: release-notes
title: "MCP release notes"
description: "New features, fixes and changes to the hosted Bifröst MCP service."
toc_max_heading_level: 2
---

# Bifröst MCP release notes

See what's changed in the hosted Bifröst service that connects your AI assistant to Business Central
through the Model Context Protocol (MCP). Dated rollouts are listed newest first. For updates to the
Business Central extensions, see the release notes for each app under [Apps](/apps/).

## 24 November 2026

### Changed

- **Sandboxes are hidden from the company list by default.** Ask your assistant to include
  sandboxes, or pass `show_sandbox=true` to `list_companies` in a custom MCP integration.
- **Refresh the company list on demand.** If a new company or environment doesn't appear, ask
  your assistant to refresh the list (`refresh=true` in `list_companies`).

### Fixed

- **Receivables and payables aging.** Reports now include open payments and refunds as well as
  invoices and credit memos. If a period can't be read, Bifröst marks the affected totals as
  unavailable instead of showing partial totals. Rerun any earlier MCP aging reports you used
  for reconciliation.
- **Incomplete searches.** If a search finds no records but couldn't check all the requested
  fields, Bifröst reports that it couldn't finish instead of reporting zero matches.
- **Incoming document processing.** When Business Central asks you to confirm the number of
  records to process, your assistant can now send the confirmed count and continue.

### Security & privacy

- **Business Central content is marked as data.** Bifröst labels content such as operation
  descriptions so assistants can distinguish it from instructions or approval to act.
- **Less business data in error messages.** Bifröst summarizes Business Central request failures
  instead of quoting the original error text, reducing the chance that business data appears in an
  error message.

## 16 November 2026

### Azure Resource Manager permission removed

Bifröst MCP no longer requests or uses the Azure Resource Manager (ARM) permission, called **Azure
Service Management** in Microsoft Entra ID. [Business Central consent and user permissions](/setup/consent/#what-the-consent-grants)
are still required.

- **Finding a company in another tenant.** Bifröst starts with the tenant you sign in to instead
  of looking for other tenants through Azure. If a company isn't listed, paste its
  [Connection Prompt](/setup/first-question/#tell-the-assistant-where-to-work) into your chat.
  Custom MCP integrations can pass `tenant_id` to `list_companies`.
- **If your organisation granted ARM access before:** Entra doesn't revoke that grant
  automatically. Ask your Entra administrator to [review the permissions for Origo Bifrost](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions#review-and-revoke-permissions-in-the-microsoft-entra-admin-center)
  and revoke **Azure Service Management** if it's still granted. Keep the Business Central permission.

## Other November 2026 changes {#november-2026}

### Added

- **Microsoft 365 Copilot pilot.** Pilot participants can sign in with their work account and choose
  a Business Central company from Copilot. See [Connect your assistant](/setup/connect-your-ai/#microsoft-copilot)
  for administrator and user steps.

### Changed

- **Company-selection tools renamed.** The tools for listing companies, switching companies and
  clearing the current selection are now called `list_companies`, `switch_company` and `clear_company`.
  If your custom MCP integration uses the previous dotted names, update those calls.
- **Sandbox requests.** The MCP service no longer applies a separate daily request limit to Business
  Central online sandboxes. [Sandbox usage reporting and licensing](/licensing/license-types/#sandbox-environments)
  still apply.
