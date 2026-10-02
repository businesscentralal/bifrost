---
id: iceland-skilagrein
title: "Skilagrein Master Data"
sidebar_label: "Skilagrein Master Data"
sidebar_position: 3
---

The Skilagrein pages show master data downloaded from the Skilagrein web service — pension fund codes, union codes and collector information. This data is what a payroll submission is built from. Open the pages from the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) card.

## Available pages

| Page | Description |
| --- | --- |
| Skilagrein Collectors | Collectors (innheimtuaðilar) registered for payroll deductions. |
| Pension Funds | Icelandic pension funds with codes and names. |
| Unions | Icelandic unions (stéttarfélög) with codes. |
| Rehabilitation Funds | Rehabilitation funds (endurhæfingarsjóðir). |
| Pension Supplements | Pension supplement funds (lífeyrisaukar). |

## Collector passwords

Each collector authenticates with its own web-service password. Select the collector on the **Skilagrein Collectors** page and use the **Set Web Service Password** action; the value goes into the Bifröst Foundation secret store and cannot be read back. There is no Skilagrein password on the [Bifrost Iceland Setup](/help/iceland/iceland-setup/) card.

## How data is refreshed

The pages are a local copy of the Skilagrein master data. They are refreshed when you, a scheduled
routine or an AI assistant ask Bifröst to fetch the collectors, pension funds, unions,
rehabilitation funds or pension supplements from Skilagrein. The pages themselves only display what
has already been downloaded.

## Submitting

Bifröst sends a contribution statement to a collector and confirms an extra amount the collector
reports. Both require the **BIFROST Collect ori** permission set and a stored password for the
collector.
