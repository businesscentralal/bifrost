---
id: connect-your-ai
title: "Step 3: Connect your AI assistant"
sidebar_label: "3. Connect your AI assistant"
sidebar_position: 4
description: "Consent to the Bifröst MCP server once for your organisation, then add Bifröst to Copilot, ChatGPT, Claude or another assistant."
---

# Step 3: Connect your AI assistant

**Who is needed:** A Global or Application Administrator in Microsoft Entra ID, once, after step 2; then the Business Central administrator. Users connect their own assistants after
[step 5](/setup/first-call/), once the data is set up.

Assistants connect to Bifröst through **MCP**, the standard AI assistants use to reach other
systems. Bifröst runs an MCP server for this; you do not install anything.

## Consent once for your organisation

Online, step 5 of the setup wizard gives you:

- **the Bifröst MCP server address**, which assistants connect to;
- **the consent link** (*Open Authorization Page*) for the *Origo Bifrost* enterprise application. An Entra administrator
  opens it once, so the MCP server can sign your users in;
- **links to the Bifröst connector** in the assistants' stores. Until the connector is published in
  a store, the link opens that store's public catalogue.

![Step 5 of the wizard: the MCP server address (hidden in this picture), the authorization page and the connector stores](/img/setup/wizard-5-mcp.png)

If step 5 shows no server address or consent link, or an address that does not look right,
contact your Business Central partner.

Need the address or the links again later? Open the setup wizard again from **Bifrost Setup** and
go to step 5; close it with **X** if you do not want to finish it again.

## Add Bifröst to the assistant

The same steps apply to the administrator now and to each user later. Each person signs in as
themselves, so the assistant works with exactly that user's permissions.

The **Connectors** group on Bifrost Setup opens the Bifröst connector in each assistant's store.

![The Connectors group](/img/guides/en-us/menu-connectors.png)

### Microsoft Copilot

Add the Bifröst connector from its store. On **Bifrost Setup**, the **Microsoft Copilot** action
under *Connectors* opens it.

### ChatGPT

Add the Bifröst connector from its store. On **Bifrost Setup**, the **OpenAI ChatGPT** action under
*Connectors* opens it.

### Claude

In Claude, the connector is called **Bifröst Origo**. The steps are the same on the web and in Claude Desktop.

1. **Add the connector.** In Claude, open **Customize** and then **Connectors** (in older versions of
   Claude Desktop: **Settings › Connectors**), and choose **+ Add**. Until Bifröst is in Claude's
   connector directory, choose **Add custom connector**: give it a name and paste the MCP server
   address from wizard step 5. Leave the options marked *Detected* as they are and choose **Add**. They
   mean that each person signs in as themselves, and that no client ID or secret is needed; if they are
   not detected, check the address. In a Claude Team or Enterprise organisation, an owner adds it once
   for everyone, and the owner may have to allow custom connectors first. Once it is listed, the
   **Anthropic Claude** action under *Connectors* on **Bifrost Setup** opens it.
2. **Sign in.** Choose **Connect** and sign in with the account that has access to Business Central;
   if you have more than one, pick that one. Microsoft shows what the connector asks for: it acts on
   your behalf, so it reaches only what you can reach yourself. Choose **Accept**. Leave *Consent on
   behalf of your organization* alone unless you are the administrator giving consent for everyone.
   The connector is connected when it shows **Disconnect**.

   ![Claude's list of connectors, with Bifröst Origo connected](/img/setup/claude-connector.png)

3. **Turn it on in a chat.** Choose **+**, then **Connectors**, and make sure Bifröst Origo is switched on.

   ![Switching Bifröst Origo on for a chat](/img/setup/claude-connector-in-chat.png)

4. **Approve its tools.** The first time Claude wants to use a Bifröst tool, it asks. **Allow once**
   lets you check each call; **Always allow** stops asking for that tool. Start with **Allow once**, so
   you see what is called; in the connector's settings you can later choose which tools always ask.

   ![Claude asks before it uses a Bifröst tool for the first time](/img/setup/claude-allow-tool.png)

5. **Ask the first question**, as in [step 5](/setup/first-call/).

### Other assistants

The steps follow the same pattern as for Claude: add the connector, sign in, turn it on, approve
its tools, ask.

An assistant that supports remote MCP servers can connect too: add the Bifröst MCP server address
as a remote MCP server or custom connector in its settings, and sign in with your work account.

## Tell the assistant where to work

Online, **Bifrost Setup** has a **Connection Prompt**, in its *Environment* section, with the tenant,
environment and company. Paste it into the chat, so the assistant knows where to work. Each company
has its own; to switch company, paste the prompt of the other one, or ask the assistant to list
your companies and switch.

Connecting another system rather than an assistant? See
[Documentation for developers](/documentation/end-customers/developers/).

**Next:** [Step 4: Set up your data](/setup/data-setup/)
