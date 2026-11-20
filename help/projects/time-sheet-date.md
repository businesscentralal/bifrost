---
id: time-sheet-date
title: "Time Sheet Date"
sidebar_position: 1
---

**Time Sheet Date** is a column on the lines of sales invoices and sales credit memos, posted and not yet
posted. It shows the date of the work that a line invoices, so a customer can see which day each project
line is for.

The column is added by Bifrost Projects and appears on four pages: **Sales Invoice**, **Sales Credit Memo**,
**Posted Sales Invoice** and **Posted Sales Credit Memo**. It sits just before **Description** and is read-only.

## What it shows

When an invoice or credit memo is created from project planning lines, for example with **Create Sales
Invoice** on the planning lines, each new sales line gets the date of the planning line it came from: the
planning line's **Document Date**, or its **Planning Date** when the document date is blank. Posting copies
the date to the posted invoice or credit memo line.

The column is blank on a line that was not created from a project, such as a line typed in by hand. It is
also blank when no planning line can be found for the line.

Invoices and credit memos that already existed when Bifrost Projects was installed or updated are filled in
the same way once, for the lines that came from a project and have no date. A date that is already there is
never changed.

## When the column is visible

The column is shown in a company that has invoice or credit memo lines created from projects, and is
hidden in a company that has none. Business Central decides this when the lines part opens, so the choice
is made for the company and not for each document: in a company that invoices projects, the column is
shown on a document without project lines too, where it is blank.

The column also needs the **Jobs** application area, as the rest of the project functions do.

## Show or hide the column yourself

Each user can show or hide the column through personalization. Choose **Settings**, then
**Personalize**, on the page, and add or remove **Time Sheet Date**. The choice applies to that user only.

## Reading the date from outside Business Central

The field is returned by the generic record read of the Bifröst MCP server as `TimeSheetDateori`. It adds no
new message type.
