---
id: index
title: "Set it up"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Getting Bifröst running, step by step, and who is needed for each step."
---

# Set it up

These steps take you from nothing to a first answer from Business Central in your AI assistant.
Do them in order. Each step says who is needed, so you can have the right people ready before you
start.

**In short:** install the app, run the setup wizard, consent once, connect your assistant, and ask.
Before real users and real data, add the permissions and the data decisions in steps 2 and 4.
Trying it first? [Try it out](/try-it-out/) is the quick path in a sandbox.

## Before you start

- **A supported Business Central**: see [Requirements](/foundation/#get-it-and-set-it-up).
- **A sandbox is a good first place.** Try everything there first; see [Try it out](/try-it-out/).
- **A license for production.** See [Price](/price/).

## The steps

import SetupFlow from '@site/src/components/SetupFlow';

<SetupFlow />

## Do I need a partner?

{/* OPEN-15 */}

No. Every step can be done by your own administrators. If you work with a Business Central partner,
or buy Bifröst through a Bifröst partner (a reseller), they can do the Business Central steps for you. The consent in step 3 is
given by an administrator of your organisation's Microsoft Entra ID.

## Sandbox, production and companies

- **Each environment** (sandbox, production) gets the apps installed separately.
- **Each company** runs the setup wizard once; until then Bifröst refuses calls for that company.
- **The consent in step 3** is given once for your whole organisation.

## After setup

Running Bifröst day to day, and the decisions behind each setting, are in
[Documentation for administrators](/documentation/end-customers/administrators/).
