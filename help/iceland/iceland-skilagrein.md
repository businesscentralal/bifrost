---
id: iceland-skilagrein
title: "Skilagrein Collectors"
sidebar_position: 2
---

**Skilagrein Collectors** lists the collectors (innheimtuaðilar) that take contribution returns through
skilagrein.is. It is for the accountant or administrator who sets up the connection to each collector
the company sends returns to.

Open it with **Skilagrein Collectors** on [Bifrost Iceland Setup](/help/iceland/iceland-setup/). The list
is read from skilagrein.is each time it opens and is not stored in Business Central; the page cannot be
edited. The pension funds, unions, rehabilitation funds and pension supplements (lífeyrisaukar) have lists
of the same kind: they show **No.**, **Name**, **Registration No.**, **Collector No.**, **City**,
**Phone No.** and **Email**, and have the **Refresh** action.

## Fields

| Field | Description |
| --- | --- |
| **No.** | The number of the collector. |
| **Name** | The name of the collector. |
| **Registration No.** | The kennitala of the collector. |
| **Web Service Active** | Whether the collector's web service is active. |
| **Web Service Authenticates** | Whether the web service requires a password. |
| **Has Password** | Whether a password is stored for the collector in Bifröst's protected storage. |
| **City** | The city of the collector. |
| **Phone No.** | The phone number of the collector. |
| **Email** | The email address of the collector. |

## Actions

| Action | Description |
| --- | --- |
| **Refresh** | Loads the list again from skilagrein.is. |
| **Set Web Service Password** | Opens a masked dialog and stores the password of the selected collector's web service. The value is never shown again. |
| **Clear Web Service Password** | Removes the stored password of the selected collector, after you confirm. Available when a password is stored. |
| **App Secrets** | Opens [Bifrost App Secrets](/help/foundation/bifrost-app-secrets/) filtered to this app, to see which credentials are stored. |

## Common tasks

**Connect a collector.** Find the collector, choose **Set Web Service Password** and enter the password the
collector gave you. **Has Password** is then on for that collector.

**Change a password.** Choose **Set Web Service Password** again; the new value replaces the old one.

## Good to know

- A contribution return must be sent by someone who has `BIFROST Collect ori`; see
  [Permissions](/iceland/#permissions).
- A password is never sent in the request itself. The app uses the one stored here, and it refuses a
  request that carries a password.
- Check the contribution return before you send it. It is your return to the collector.
