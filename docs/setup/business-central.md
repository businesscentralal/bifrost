---
id: business-central
title: "Step 2: Set up Business Central"
sidebar_label: "2. Set up Business Central"
sidebar_position: 3
description: "Run the setup wizard once per company, give people and apps permission, and decide which tools may act for a user."
---

# Step 2: Set up Business Central

**Who is needed:** A Business Central administrator (SUPER for outbound HTTP, SECURITY or SUPER for permissions), and someone entitled to accept terms for the company.

## Run the setup wizard

Open **Bifrost Setup** (search for it with *Tell me*). In Business Central the Bifröst pages are
spelled without the ö: *Bifrost Setup*, *Bifrost Messages* and so on. The notification at the top opens the
**setup wizard**. It covers every Bifröst app you have installed, so no app asks for setup on its
own. Some apps also have a setup page for their own area, described in that app's help.

The wizard takes you through the license agreement, outbound HTTP for every installed Bifröst
app, licensing, and, online, the connection to the MCP server. On-premises it also asks for the
credentials the apps need.
**Every company runs it once: until it is finished, Bifröst refuses calls for that company.**

Online in production, finishing the wizard activates the trial, if your Microsoft Entra tenant has
not had one yet. A sandbox needs no trial. On-premises,
the connection to the licensing service is verified first.

The wizard has six steps. Steps 1, 2, 4 and 6 are for you. Step 3, credentials, appears only
on-premises. Online, wizard step 5 gives the consent link for [setup step 3](/setup/connect-your-ai/); you can
finish the wizard first and send the link to your Entra administrator.

{/* OPEN-13 */}

![The first step of the Bifrost Setup Wizard: what is stored with Origo, and the license agreement. The tenant hash is hidden in this picture.](/img/setup/wizard-1-welcome.png)

![Step 2 of the wizard: outbound HTTP, per installed Bifröst app. Here it is already enabled for both apps.](/img/setup/wizard-2-http.png)

Step by step: [Setup wizard](/help/foundation/bifrost-setup-wizard/).

:::note Be aware
Accepting the license agreement accepts the [Terms of Use](/licensing/eula/) for the company. The
first step of the wizard says what Bifröst stores with Origo; see also [Privacy](/licensing/privacy/).
Read both before you accept.
:::

## Give people and apps permission

People use Bifröst through an assistant as themselves. An integration uses it as a
**Microsoft Entra application**: an app identity of its own, registered in your Microsoft Entra ID.
Both get their permissions in Business Central, on **Users** or **Microsoft Entra Applications**:

- **`BIFROST API ori`**, the permission set that lets an identity call Bifröst;
- the ordinary Business Central permissions for the data they work with;
- a **posting gate** for each ledger they may post to. A posting gate is a separate permission set,
  not part of the general Bifröst ones: `BIFROST GL Post ori`, `BIFROST ItemPost ori`,
  `BIFROST FA Post ori`, `BIFROST Job Post ori` and `BIFROST Res Post ori`. Warehouse posting comes
  with the Bifrost Warehouse app.
  Which posting each one allows: [Posting gates](/foundation/reference/setup/#posting-gates-bifrost-gl--item--fa--job--resource--warehouse-posting).

A typical setup:

| Who | Bifröst permission sets | Plus |
|---|---|---|
| A person using an assistant, who only asks and prepares | `BIFROST API ori` | Their ordinary Business Central permissions. A posting preview also needs the posting gate |
| A person who may also post through Bifröst | `BIFROST API ori` and the posting gate for each ledger, for example `BIFROST GL Post ori` for sales and purchase documents | The same |
| An integration (Entra application) | `BIFROST API ori`, and posting gates only if it posts | Permissions for the data it works with |
| Support staff who read the logs | `BIFROST Read ori` | – |
| Bifröst administrators | `BIFROST Full ori` | – |

On **Permission Sets**, search for *BIFROST* to see them all. For a typical setup you need only the sets named here; the
others are for particular areas, and each is described on the help page of its area.

![The Bifröst permission sets on the Permission Sets page](/img/setup/permission-sets.png)

Before you assign them, read [Permissions](/documentation/end-customers/administrators/#permissions).

## Decide which tools may act for a user

When an assistant calls as a named user, Bifröst records where the call comes from, and the user
may have to approve that source once. In **Bifrost User Setup**, the **Approval Type** of each user
decides whether new sources are accepted automatically (the default) or have to be approved
first. Requiring
approval is the safer choice when people may connect assistants you have not chosen.
See [Approve session source](/help/foundation/session-source-approval/).

**Next:** [Step 3: Connect your AI assistant](/setup/connect-your-ai/)
