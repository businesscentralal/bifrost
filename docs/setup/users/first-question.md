---
id: first-question
slug: /first-question
title: "Ask your first question"
sidebar_label: "3. Ask your first question"
sidebar_position: 3
description: "For each user: tell the assistant which company to work in, ask who you are, and check the answer."
---

# Ask your first question

*For each user, once the assistant is connected.*

## Tell the assistant where to work

**Bifrost Setup** in Business Central has a **Connection Prompt**, in its *Environment* section, with
the tenant, environment and company. Copy it, paste it into the chat and send it, so the assistant
knows where to work. If you cannot open Bifrost Setup, ask your administrator for the text.

Each company has its own prompt. To switch company, paste the prompt of the other one, or ask the
assistant to list your companies and switch.

## Ask who you are

Ask *"Who am I in Business Central?"*. The first time, the assistant asks before it uses a Bifröst
tool; choose **Allow once** so you see what it does.

![The answer to "Who am I in Business Central?" in Claude](/img/setup/claude-answer-whoami.png)

**Check the answer.** It should name your own user and the company you meant. Look at the
environment too: if it is your production environment, be careful with anything that changes data.

- **The company is wrong:** ask the assistant to switch company.
- **The user is wrong:** stop, and tell your administrator.
- **The assistant has no Business Central tools:** the connector is not switched on in this chat;
  see [Connect your assistant](/setup/connect-your-ai/#claude).

## What next

- [Using Bifröst](/documentation/end-customers/users/): what you can ask, what it will not do, and
  what to do when it says no.
- [Try it out](/try-it-out/#what-to-ask-first): questions to try, from a simple lookup to a change you
  preview first.
