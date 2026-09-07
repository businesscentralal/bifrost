---
id: treasury-setup-wizard
title: "Treasury Setup Wizard"
sidebar_label: "Setup Wizard"
sidebar_position: 3
---

The **Bifrost Iceland Treasury - Bank Setup** wizard walks you through connecting Business Central to the Icelandic banks. It appears in the **Assisted Setup** list, and you can also start it from the **Setup Wizard** action on [Bifrost Iceland Treasury Setup](./treasury-setup.md).

One wizard covers all five banks. You can configure a single bank now and come back for the others whenever you like — nothing you enter is lost by leaving early, and re-running the wizard never resets a bank you have already set up.

Outbound HTTP is not part of this wizard. Enable it once, for every installed Bifrost application including this one, in Bifrost Foundation's own **Bifrost Setup Wizard** (Bifrost Setup, action **Start setup wizard**) before configuring a bank here — nothing will reach a bank until that is done.

## Steps

### 1. Welcome

Explains what the guide covers and points you at Bifrost Setup Wizard for outbound HTTP if you have not enabled it yet. Choose **Next**.

### 2–6. One step per bank

Landsbankinn, then Arion banki, Íslandsbanki, Kvika banki and Sparisjóðir. Each step shows the same four things:

| Field | What to do |
|---|---|
| **Bank** | Read-only — the bank this step configures. |
| **Enabled** | Leave it on for a bank you use; turn it off for one you do not. |
| **Username** | The company-default B2B user name the bank issued you. |
| **Company Password** / **Certificate** / **API Key** | Status only — **Stored** or **Not stored**. Use the actions to enter them. |

The **Certificate** and **API Key** rows appear only for the banks that use them, so an Íslandsbanki step shows neither, and only Landsbankinn shows an API key.

Use **Set Company Password**, **Set Certificate** and **Set API Key** to enter the values. Each opens a masked dialog naming the bank and the secret, so it is clear what is being asked for. A certificate is verified against the password you type before either is stored.

### 7. Finish

**Finish** saves the last bank you were editing, marks the assisted setup complete and closes the guide. The Assisted Setup list then shows Bifrost Iceland Treasury as done.

## After the wizard

Everything the wizard sets can be changed later on [Bifrost Iceland Treasury Setup](./treasury-setup.md), which also shows the certificate details and lets you clear secrets.

If a bank still shows **Missing** under **Secrets** on that page, something the connector needs was not entered — most often the client certificate, which cannot be skipped for the four banks that sign their requests.
