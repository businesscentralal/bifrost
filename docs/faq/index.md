---
id: index
title: "Frequently asked questions"
sidebar_label: "FAQ"
sidebar_position: 1
slug: /
displayed_sidebar: null
description: "Answers to common questions about Bifröst: how the MCP server signs users in, who holds the tokens, the permissions it asks for, and security testing."
---

# Frequently asked questions

## Sign-in and access

### How does the Bifröst MCP server get the token it uses to call Business Central? {#on-behalf-of}

Through an **on-behalf-of** exchange. When a user signs in, Microsoft Entra ID issues a token for that user to
the Bifröst MCP server. To call Business Central, the server exchanges it for a Business Central token on the
user's behalf. The user's token is not passed straight through.

As a result, every call runs as the signed-in user, and the user's own permissions always apply.

### Who holds the refresh tokens: Origo's server or the AI client? {#refresh-tokens}

The Bifröst MCP server acts as an OAuth proxy in front of Microsoft Entra ID.

- **Entra tokens.** When a user signs in, Entra issues an access token and a refresh token to the MCP server. The
  server keeps both, encrypted at rest, in its own database. They are never passed to the AI client.
- **Tokens for the AI client.** The AI client gets separate access and refresh tokens issued by the MCP server.
  They only work against the MCP server and contain no Microsoft credentials. Each client refresh token can be
  used once: every refresh returns a new one and invalidates the old one. It also only works for the client
  registration it was issued to.
- **Renewal.** When an MCP server token is used, the server renews the user's Entra token through Microsoft. If
  Microsoft refuses (the user was disabled, the session was revoked, or Conditional Access requires it), the
  client's refresh fails and the user has to sign in again.

### How long does a user's access last, and how is it ended? {#ending-access}

Because the MCP server holds the user's Entra refresh token, the user's AI client keeps working without a new
sign-in until the access is ended or Microsoft refuses to renew it. It always acts as that user, with that user's
permissions.

- **For one user:** disable the user or revoke the user's sessions in Microsoft Entra ID. The next refresh fails
  and the user has to sign in again.
- **For the whole organisation:** disable or delete the *Origo Bifrost* enterprise application; see
  [Withdraw it](/setup/consent/#withdraw-it).

### Why does the consent screen ask for Azure Resource Manager? {#azure-resource-manager}

Azure Resource Manager is for users whose account has access to several tenants. The MCP server reaches it the
same way as Business Central: on behalf of the signed-in user, with that user's own permissions.

### Where is the Bifröst application's own credential kept? {#app-credential}

The on-behalf-of exchange uses the credential of the *Origo Bifrost* application. Origo keeps it in its own Azure
tenant and rotates it regularly.

## Security testing

### Has Bifröst been penetration tested? {#penetration-test}

Yes. Bifröst has been penetration tested by Syndis.

To report a suspected vulnerability, write to bc@origo.is.
