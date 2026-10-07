---
id: consent
slug: /consent
title: "Step 3: Consent once for your organisation"
sidebar_label: "3. Consent once"
sidebar_position: 3
description: "Give the Bifröst MCP server consent once in Microsoft Entra ID, so assistants can sign your users in."
---

# Step 3: Consent once for your organisation

**Who is needed:** A Global Administrator or Application Administrator in Microsoft Entra ID, once for
the whole organisation, after step 2.

Assistants connect to Bifröst through **MCP**, the standard AI assistants use to reach other
systems. Bifröst runs an MCP server for this; you do not install anything. Before anyone can sign in
to it, your organisation gives its consent once.

## What you get from the setup wizard

Online, step 5 of the setup wizard gives you:

- **the Bifröst MCP server address**, which assistants connect to. Your users need it in
  [Connect your assistant](/setup/connect-your-ai/), so keep it at hand;
- **the consent link** (*Open Authorization Page*) for the *Origo Bifrost* enterprise application;
- **links to the Bifröst connector** in the assistants' stores. Until the connector is published in
  a store, the link opens that store's public catalogue.

![Step 5 of the wizard: the MCP server address (hidden in this picture), the authorization page and the connector stores](/img/setup/wizard-5-mcp.png)

## Give the consent

The Entra administrator opens the consent link once and accepts. From then on the MCP server can
sign your users in. It acts on each user's behalf, so it reaches only what that user can reach in
Business Central.

You can finish the wizard first and send the link to your Entra administrator.

If step 5 shows no server address or consent link, or an address that does not look right, contact
your Business Central partner.

## Find it again later

Open the setup wizard again from **Bifrost Setup** (**Licensing › Setup Wizard**) and go to step 5;
close it with **X** if you do not want to finish it again. The **Connectors** group on Bifrost Setup
opens the Bifröst connector in each assistant's store.

![The Connectors group](/img/guides/en-us/menu-connectors.png)

**Next:** [Step 4: Set up your data](/setup/data-setup/)
