---
id: iceland-skilagrein
title: "Skilagrein Master Data"
---

Use the Skilagrein lists to find collector and fund information when preparing contribution statements.
Open **Skilagrein Collectors** from **Bifrost Iceland Setup**. The related fund lists describe the
reference information used by the service.

## Reference lists

| Page | Information |
|---|---|
| **Skilagrein Collectors** | Collectors and their contact details, with password-management actions. |
| **Skilagrein Pension Funds** | Pension funds and their collector information. |
| **Skilagrein Unions** | Unions and their collector information. |
| **Skilagrein Rehabilitation Funds** | Rehabilitation funds and their collector information. |
| **Skilagrein Pension Supplements** | Pension supplements and their collector information. |

These lists load information from the selected Skilagrein service when opened. Choose **Refresh** to
reload it. They are read-only reference lists: changes to the service's master data are made with the
service provider.

## Collector credentials

On **Skilagrein Collectors**, select the collector and choose **Set Web Service Password** to enter
its password. **Clear Web Service Password** asks for confirmation before removing that collector's
stored password. **App Secrets** opens the shared credential-management page for this app.

Your administrator arranges the collector's service account. Enter a password only through the
provided dialog, not into an assistant conversation or a contribution description.

## Before sending a statement

Check the collector and the company and period the statement concerns. The caller needs its Business
Central permissions and the applicable Iceland service permission set. See
[Permission sets and gates](/documentation/end-customers/permissions/) for the shared rules, then use
the assistant's live operation description to prepare and send the statement.
