---
id: iceland-skilagrein
title: "Skilagrein Master Data"
sidebar_label: "Skilagrein Master Data"
sidebar_position: 3
---

The Skilagrein pages show master data downloaded from the Skilagrein web service — pension fund codes, union codes and collector information. This data is what a payroll submission is built from. Open the pages from the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) card.

## Available pages

| Page | Object | Description |
| --- | --- | --- |
| Skilagrein Collectors | `Iceland Skg Collectors ori` | Collectors (innheimtuaðilar) registered for payroll deductions. |
| Pension Funds | `Iceland Skg Pension Funds ori` | Icelandic pension funds with codes and names. |
| Unions | `Iceland Skg Unions ori` | Icelandic unions (stéttarfélög) with codes. |
| Rehabilitation Funds | `Iceland Skg Rehab Funds ori` | Rehabilitation funds (endurhæfingarsjóðir). |
| Pension Supplements | `Iceland Skg Pen Suppl ori` | Pension supplement funds (lífeyrisaukar). |

## Collector passwords

Each collector authenticates with its own web-service password. Select the collector on the **Skilagrein Collectors** page and use the **Set Web Service Password** action; the value goes into the Bifröst Foundation secret store under the code `SKG-COLLECTOR-<collector no.>-PASSWORD` and cannot be read back. There is no Skilagrein password on the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) card.

## How data is refreshed

Call the message types below through the Bifrost API to refresh the local cache from Skilagrein. The pages themselves only display what has already been downloaded.

| Message type | Refreshes |
| --- | --- |
| `Iceland.Collector.Get` | Collectors |
| `Iceland.PensionFund.Get` | Pension funds |
| `Iceland.Union.Get` | Unions |
| `Iceland.RehabFund.Get` | Rehabilitation funds |
| `Iceland.PensionSupplement.Get` | Pension supplements |

## Submitting

`Iceland.CollectorPayment.Send` submits a contribution statement to a collector and `Iceland.CollectorExtraAmount.Confirm` confirms an extra amount. Both require the **BIFROST Collect ori** permission set and a stored password for the collector.
