---
id: using-bifrost
title: "Using Bifröst"
sidebar_label: "Using Bifröst"
sidebar_position: 2
description: "What you can ask an AI assistant to do in Business Central through Bifröst, what it will not do, and what to do when it says no."
---

# Using Bifröst

Someone in your company has connected an AI assistant, such as Copilot or Claude, to Business
Central, and told you that you can now ask it to do things. Bifröst is the part that turns your
request into something Business Central does. This page is what that means for you.

## What a conversation looks like

> **You:** Post the sales order for Adatum from yesterday.
>
> **Assistant:** I found sales order 1023 for Adatum Corporation, dated 17. september, 3 lines,
> 412.500 kr. Shall I post it?
>
> **You:** Yes.
>
> **Assistant:** Posted. Invoice 103045 was created.

Behind that, the assistant asked Bifröst which operations exist, read the instructions for
posting a sales order, asked you the one thing it could not know, and then Business Central posted
the order with the same checks, number series and entries as when you post it yourself.

## What you can ask

The assistant does not need to be taught what is possible: it asks Bifröst. What is possible grows
with the apps your company has installed.

- **Look something up.** *"What is Adatum's balance?" · "Is item 1936-S in stock?" · "Which sales
  orders are past their shipment date?"* These only read.
- **Do one thing.** *"Release order 1023." · "Post the purchase invoice from Fabrikam."* A good
  assistant confirms before it changes anything, and for posting it can show you first what posting
  would do.
- **Do a sequence.** *"Create a sales invoice for the September hours on the Adatum project and send
  it."* Several operations in a row, the result of one feeding the next. If a step fails, the
  assistant can tell you which one and why.
- **Bring in the outside world.** With the Iceland apps, for example, *"Fetch yesterday's bank
  statement and match it"* or *"Look up this kennitala in the national register."* Each app adds
  its own operations; see the [app list](/apps/).
- **Let it run without you.** With [Orchestrator](/orchestrator/), a sequence becomes a
  **playbook** that runs on a schedule and keeps a log of every step. An administrator or
  consultant sets up playbooks; you can ask the assistant to run one or tell you how the last run
  went.
- **Ask what is possible.** *"What can you do with purchase orders?"* The assistant reads the
  catalogue and tells you.

## Who can use it

Anyone whose Business Central user has been given the Bifröst permissions by an administrator. The
assistant then works with exactly that user's rights. There is no separate Bifröst login and nothing
to install on your side. If the assistant cannot reach Business Central at all, ask your
administrator.

## What it will not do

- **Anything you are not allowed to do.** The assistant acts as you, with your permissions. If you
  cannot post invoices in Business Central, neither can it.
- **Work around Business Central.** Posting rules, validations and the audit trail apply as they
  do in the Business Central client.
- **Return fields your administrator has restricted** for Bifröst. The answer then simply leaves
  them out.
- **Act for you from a tool you have not approved**, if your company requires that. A new assistant
  then has to be approved once before it can act as you.

The assistant is still software that can misunderstand you. Read what it proposes before you say
yes, especially when it posts, sends or deletes something.

## When it says no

| The assistant says | What it means | Who to ask |
| --- | --- | --- |
| The operation is not available | It is switched off in your company, or the app that provides it is not installed. | Your administrator |
| You do not have permission | You do not have that permission in Business Central, and the assistant has exactly your rights. | Your administrator |
| Part of the answer is missing | Those fields are restricted for you. | Your administrator, if you need them |
| The tool must be approved first, with a link | Your company requires new assistants to be approved once. Open the link, or send it to your administrator. | You, or your administrator |
| The allowance is used up | Your company's monthly allowance of operations is used. | Your administrator |
| Something was posted that should not have been | The assistant did what it was asked, with your rights. Reverse it in Business Central as you would any posting and tell your administrator; every request and answer is logged, so it can be traced. | Your administrator |

If the assistant fails with what looks like a technical error, ask it to show you the error text.
Bifröst's answer says what went wrong in plain words.

## Next

- [What Bifröst is](/start/): the overview
- [Set up Bifröst](/start/set-up/): for administrators
