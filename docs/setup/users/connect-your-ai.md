---
id: connect-your-ai
slug: /connect-your-ai
title: "Connect your assistant"
sidebar_label: "2. Connect your assistant"
sidebar_position: 2
description: "For each user: add Bifröst to Claude, Copilot, ChatGPT or another assistant, and sign in as yourself."
---

# Connect your assistant

*For each user. You need the MCP server address from your administrator; see
[Pick your assistant](/setup/pick-your-assistant/#what-you-need-first).*

You connect once, and sign in as yourself, so the assistant works with exactly your permissions in
Business Central.

## Claude

In Claude, the connector is called **Bifröst Origo**. The steps are the same on the web and in
[Claude Desktop](https://claude.ai/download). Claude's own help describes them in
[Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

<details className="setup-panel" id="claude-steps">
<summary><span className="setup-panel__title">Add Bifröst Origo in Claude</span><span className="setup-panel__meta">On the web or in Claude Desktop · Customize › Connectors</span></summary>

1. **Add the connector.** In Claude, open **Customize** and then **Connectors** (in older versions of
   Claude Desktop: **Settings › Connectors**), and choose **+ Add**. Until Bifröst is in Claude's
   connector directory, choose **Add custom connector**: give it a name and paste the MCP server
   address you got from your administrator. Leave the options marked *Detected* as they are and choose **Add**. They
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

5. **Ask your first question**: see [Ask your first question](/setup/first-question/).

</details>

## Microsoft 365 Copilot {#microsoft-copilot}

Bifröst is an agent in Microsoft 365 Copilot, in a pilot: ask Origo whether it is available for your organisation. An administrator publishes it once for the organisation; after that, each user adds it and signs in as
themselves.

Each user can then use Bifröst in two ways: as a **plugin in Copilot Cowork**, or as an **agent in Copilot Chat**.

The **Microsoft Copilot** action under *Connectors* on **Bifrost Setup** still opens Microsoft's public store,
where Bifröst is not listed yet. Use the steps below instead.

### For the administrator {#copilot-administrator}

<details className="setup-panel" id="copilot-admin-steps">
<summary><span className="setup-panel__title">Publish the agent once</span><span className="setup-panel__meta">Microsoft 365 administrator · once for the organisation</span></summary>

*Who is needed: a Microsoft 365 administrator who may manage agents in the Microsoft 365 admin center. Your
organisation must also have given its [consent once](/setup/consent/) to Bifröst.*

1. **Download the agent package.** During the pilot, the agent is a `.zip` file:
   [appPackage.pilot-20261117.zip](https://origopublic.blob.core.windows.net/bifrost/appPackage.pilot-20261117.zip). Upload it as it is; don't unpack it.
2. **Upload it.** In the Microsoft 365 admin center, open **Agents › All agents**, choose **Add agent**, then
   upload the [`.zip` file](https://origopublic.blob.core.windows.net/bifrost/appPackage.pilot-20261117.zip).

   ![Add agent in the list of all agents in the Microsoft 365 admin center](/img/setup/copilot-add-agent.png)

3. **Choose who gets it.** Under **Publish**, choose **All users**, or **Specific users/groups**, for example a group
   of the people who have a Business Central user. Under **Install (optional)**, **None** lets each user add it
   themselves; choose users or groups here to have it pre-installed for them.

   ![Publish agent to selected users: who can install Bifröst, and who has it pre-installed](/img/setup/copilot-publish-to-users.png)

4. **Review and accept.** Go through **Security policy** and **Accept permissions**, read what the agent asks for,
   and accept. The agent signs each user in to Business Central as themselves, so it reaches only what that user
   can reach.
5. **Finish.** Check the summary on **Review & finish** and complete the upload. It can take a while before the
   agent shows up for users.

</details>

### For each user {#copilot-user}

Open the way you use Bifröst in Copilot:

<details className="setup-panel" id="copilot-cowork">
<summary><span className="setup-panel__title">Plugin for Cowork</span><span className="setup-panel__meta">In Copilot Cowork: Plugins › Cowork › Bifröst</span></summary>

1. **Open Plugins.** In Microsoft 365 Copilot, open **Plugins** and choose **Cowork**.
2. **Search for Bifröst.** Type *Bifröst* in the search box.

   ![Plugins in Microsoft 365 Copilot, on the Cowork tab, with the search box](/img/setup/copilot-cowork-plugins.png)

3. **Install the plugin.** Choose **Bifröst** and install it.
4. **Connect the plugin.** Once it is installed, Bifröst shows *Not connected* under **Connections**: choose
   **Connect**. Bifröst can't reach Business Central until the plugin is connected.

   ![The Bifröst plugin in Copilot Cowork, with Connect under Connections](/img/setup/copilot-cowork-connect.png)

5. **Ask your first question**: see [Ask your first question](/setup/first-question/).

</details>

<details className="setup-panel" id="copilot-chat-agent">
<summary><span className="setup-panel__title">Agent in Copilot Chat</span><span className="setup-panel__meta">In Copilot Chat: Agents › More agents › Bifröst</span></summary>

1. **Find the agent.** In Microsoft 365 Copilot, open **Agents** in the left pane and choose **More agents**.
   Find **Bifröst** and add it. If your administrator pre-installed it, it is already under *Agents*.

   ![The Agents menu in Microsoft 365 Copilot, with More agents](/img/setup/copilot-more-agents.png)

2. **Ask, and sign in.** Open Bifröst and ask a question, or pick one of its starters, such as *Which Business
   Central companies can I use?* The first time, Copilot asks you to sign in: use the account that has access
   to Business Central. Bifröst works as you, with exactly your permissions.
3. **Pick the company.** If you can use more than one company, Bifröst lists them and asks which one.
4. **Ask your first question**: see [Ask your first question](/setup/first-question/).

If sign-in or the company list fails, your organisation has probably not finished the one-time setup: ask your
administrator, and see [For your company](/setup/).

</details>

## ChatGPT

The Bifröst connector is not in OpenAI's store yet. Until it is, the **OpenAI ChatGPT** action under *Connectors* on
**Bifrost Setup** opens the store's public catalogue, without Bifröst in it.

Meanwhile, if your ChatGPT workspace lets you add a remote MCP server or a custom connector, add Bifröst that way:
see [Other assistants](#other-assistants). Whether it can depends on your plan and your organisation's settings; ask
your administrator.

## Other assistants

The steps follow the same pattern as for Claude: add the connector, sign in, turn it on, approve
its tools, ask.

An assistant that supports remote MCP servers can connect too: add the Bifröst MCP server address
as a remote MCP server or custom connector in its settings, and sign in with your work account. Where to find that
setting is in the assistant's own help.

**Next:** [Ask your first question](/setup/first-question/)
