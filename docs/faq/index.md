---
id: index
title: "Frequently asked questions"
sidebar_label: "FAQ"
sidebar_position: 1
slug: /
displayed_sidebar: null
description: "Answers to common questions about using Bifröst, connecting assistants, data and permissions, sign-in and security."
---

import LinkedFaqAnswer from '@site/src/components/LinkedFaqAnswer';

# Frequently asked questions

Click a question to see the answer.

## Using Bifröst {#using-bifrost}

<details id="what-can-my-assistant-do">
<summary>What can my assistant see or change in Business Central, and when will it ask me to confirm?</summary>

Your assistant acts on your behalf. What it can see or change depends on your Business Central
license, the permissions for each operation, and the Bifröst apps and restrictions your company has
set up. For example, your administrator can hide fields, and posting through Bifröst needs a
separate permission.

Bifröst does not delete records in Business Central. The assistant can give you a link to the record
and ask you to delete it there yourself.

Bifröst requires the assistant to confirm a change before submitting it to a production environment.
Lookups don't need that confirmation, though your assistant may still ask to use a tool. Say
**“Show me first”** before asking it to post or send anything, and check the company and the planned
change before you approve it. See [What you can ask](/documentation/end-customers/users/#what-you-can-ask).

</details>

<details id="where-does-my-data-go">
<summary>Where does my Business Central data go when I use an assistant, and who keeps a copy?</summary>

- **Your assistant's provider** receives the results Bifröst returns. Your organisation's agreement
  with that provider and its settings determine what the provider may keep or use.
- **Origo's hosted Bifröst service** passes requests and answers through without keeping their
  contents. Origo keeps separate service data for things like licensing and diagnostics.
- **Your Business Central** keeps the requests and answers in **Bifrost Messages**, according to
  your organisation's retention settings.

See [Where your data goes](/documentation/how-it-works/#where-your-data-goes) and the
[Privacy statement](/licensing/privacy/).

</details>

<details id="connect-and-approve">
<summary>Which assistants can I connect, and who needs to approve the connection?</summary>

Options include Claude, Microsoft 365 Copilot where available to your organisation, and ChatGPT or
another assistant where remote MCP connectors are allowed. See
[Pick your assistant](/setup/pick-your-assistant/#which-assistant) for current options and setup.

A Microsoft Entra administrator [gives consent once](/setup/consent/) for your organisation, and
your Business Central administrator gives you Bifröst permissions. In a managed AI workspace, an
administrator may also need to add or approve the connector. If Business Central asks for separate
approval, see [Approving a new assistant](/documentation/end-customers/users/#approving-a-new-assistant).

</details>

<details id="missing-company-or-sandbox">
<summary>Why isn't my company or sandbox listed?</summary>

- **A sandbox:** it's hidden from the company list by default. Ask your assistant to include sandboxes.
- **A newly created company or environment:** ask the assistant to refresh the company list.
- **A company in another tenant:** paste its
  [Connection Prompt](/setup/first-question/#tell-the-assistant-where-to-work) into the chat.

If you still can't find it, ask your administrator to check your access and that Bifröst is set up
in that company.

</details>

<details id="check-before-retrying">
<summary>If an action times out, how do I check whether it went through before trying again?</summary>

A timeout doesn't mean the action failed or was cancelled. Business Central may still be working
on it, or it may already have completed.

1. If the assistant has a reference for the original request, ask it to check the status without
   submitting the action again.
2. In the right company, check the affected record itself (for example, whether an invoice is
   already posted). Look for the request and its result in
   [Bifrost Messages](/documentation/end-customers/users/#check-what-the-assistant-did).
3. Only retry once you've confirmed that the action did not go through and is no longer pending.
   If you're not sure, give your administrator the time and any request reference so they can check.

</details>

## Sign-in and access

<details id="on-behalf-of">
<summary>How does the Bifröst MCP server get the token it uses to call Business Central?</summary>

Through an **on-behalf-of** exchange. When a user signs in, Microsoft Entra ID issues a token for that user to
the Bifröst MCP server. To call Business Central, the server exchanges it for a Business Central token on the
user's behalf. The user's token is not passed straight through.

As a result, every call runs as the signed-in user, and the user's own permissions always apply.

</details>

<details id="refresh-tokens">
<summary>Who holds the refresh tokens: Origo's server or the AI client?</summary>

When an assistant uses Bifröst's sign-in flow, the MCP server acts as an OAuth proxy in front of
Microsoft Entra ID.

- **Entra tokens.** The MCP server holds the tokens it gets from Microsoft Entra ID. It does not
  pass them to the assistant; see [how Origo protects sign-in tokens](#stored-sign-ins).
- **Tokens for the AI client.** The AI client gets separate access and refresh tokens issued by the MCP server.
  They only work against the MCP server and contain no Microsoft credentials. Each client refresh token can be
  used once: every refresh returns a new one and invalidates the old one. It also only works for the client
  registration it was issued to.

</details>

<LinkedFaqAnswer id="stored-sign-ins" question="Does Origo keep users' sign-ins on its servers, and if so, how are they protected and for how long?">

**Yes, when your assistant signs in through Bifröst.** Origo stores access and refresh tokens from
Microsoft Entra ID so your assistant can stay connected. These tokens are encrypted when stored.
Origo does not receive or store your Microsoft password. An assistant that gets its tokens directly
from Microsoft manages its own refresh tokens instead.

**For how long?** Your connection can stay active while Microsoft Entra ID allows the tokens to be
renewed. If Microsoft requires it, you need to sign in again. An expired or revoked token can no
longer be used, but that does not tell you when the stored copy is deleted. For the storage retention
period, [contact Bifröst support](/support/). See [Privacy](/licensing/privacy/) for how Origo handles
service data.

</LinkedFaqAnswer>

<details id="ending-access">
<summary>How long does a user's access last, and how is it ended?</summary>

An assistant can stay connected without a new sign-in while Microsoft Entra ID allows renewal. It
continues to act on the signed-in user's behalf, with that user's permissions.

- **For one user:** disable the user or revoke the user's sessions in Microsoft Entra ID. The next refresh fails
  and the user has to sign in again.
- **For the whole organisation:** disable or delete the *Origo Bifrost* enterprise application; see
  [Withdraw it](/setup/consent/#withdraw-it).

</details>

<details id="azure-resource-manager">
<summary>Does Bifröst still ask for Azure Resource Manager permissions?</summary>

No. Bifröst no longer requests or uses Azure Resource Manager (ARM). Your organisation still needs
to give [consent for Business Central](/setup/consent/#what-the-consent-grants).

If your organisation granted ARM access before, Entra does not revoke that grant automatically.
Your Entra administrator can revoke **Azure Service Management** without removing the Business Central
permission. See the [16 November MCP release note](/mcp/release-notes/#16-november-2026) for details
and for what to do if a company in another tenant isn't listed.

</details>

<details id="app-credential">
<summary>Where is the Bifröst application's own credential kept?</summary>

The on-behalf-of exchange uses the credential of the *Origo Bifrost* application. Origo keeps it in its own Azure
tenant and rotates it regularly.

</details>

## Security testing

<details id="penetration-test">
<summary>Has Bifröst been penetration tested?</summary>

Yes. Bifröst has been penetration tested by Syndis.

</details>
