---
id: index
title: "Set it up"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Getting Bifröst running in two parts: the company's one-time setup, and each user connecting their own assistant."
---

# Set it up

When this is done, each person uses Business Central from their own AI assistant, within their own
permissions. Getting there has two parts. **Your company** sets it up once in Business Central. Then
**each user** connects the AI assistant they use, and signs in as themselves.

| | For your company | For each user |
|---|---|---|
| **Who** | The Business Central administrator, with an Entra administrator for one step | Each person who will use Bifröst, for example in finance or sales |
| **When** | Once per environment and company | Once per person, after the company's setup |
| **Steps** | [1 Get the app](/setup/get-the-app/) · [2 Set up Business Central](/setup/business-central/) · [3 Consent once](/setup/consent/) · [4 Set up your data](/setup/data-setup/) · [5 Check it and invite your users](/setup/first-call/) | [1 Pick your assistant](/setup/pick-your-assistant/) · [2 Connect your assistant](/setup/connect-your-ai/) · [3 Ask your first question](/setup/first-question/) |

Trying it first? [Try it out](/try-it-out/) is the quick path in a sandbox.

## For your company

import SetupFlow from '@site/src/components/SetupFlow';

<SetupFlow />

### Before you start

- **A supported Business Central**: see [Requirements](/foundation/#get-it-and-set-it-up).
- **A sandbox is a good first place.** Try everything there first; see [Try it out](/try-it-out/).
- **A license for production.** See [Price](/price/).

### Who does what

| Task | Who |
|---|---|
| Install the app from AppSource (step 1) | Your Business Central administrator, or your partner |
| Accept the Terms of Use and run the setup wizard (step 2) | Someone who may accept terms on your company's behalf |
| Give people and apps their permission sets (step 2) | Your Business Central administrator |
| Give the one-time consent in Microsoft Entra ID (step 3) | A Global Administrator or Application Administrator |
| Decide which fields agents must not get (step 4) | Your company: you know your data. Your partner can set it up |
| Connect the assistant | Each user, signed in as themselves ([For each user](/setup/pick-your-assistant/)) |

### Do I need a partner?

No. Every step can be done by your own administrators. If you work with a Business Central partner,
they can do the Business Central steps for you. The consent in step 3 is given by an administrator of
your organisation's Microsoft Entra ID.

### Sandbox, production and companies

- **Each environment** (sandbox, production) gets the apps installed separately.
- **Each company** runs the setup wizard once; until then Bifröst refuses calls for that company.
- **The consent in step 3** is given once for your whole organisation.

## For each user

Once the company's setup is done, each user [picks their assistant](/setup/pick-your-assistant/),
[connects it](/setup/connect-your-ai/) and [asks a first question](/setup/first-question/). It takes
about ten minutes; your administrator sends you the address you need.

## After setup

Running Bifröst day to day is in [For administrators](/documentation/end-customers/administrators/);
using it is in [For users](/documentation/end-customers/users/).
