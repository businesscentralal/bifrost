---
id: time-sheet-date
title: "Time Sheet Date"
sidebar_position: 5
---

**Time Sheet Date** is a column on the lines of sales invoices and sales credit memos, posted and not yet
posted. It shows the date of the work that a line invoices, so a customer can see which day each project
line is for.

The column is added by Bifröst Projects and appears on four pages: **Sales Invoice**, **Sales Credit Memo**,
**Posted Sales Invoice** and **Posted Sales Credit Memo**. It sits just before **Description** and is read-only.

![Time Sheet Date on a demo sales invoice](/img/projects/en-us/time-sheet-date.png)

## What it shows

When an invoice or credit memo is created from project planning lines, for example with **Create Sales
Invoice** on the planning lines, each new sales line gets the date of the planning line it came from: the
planning line's **Document Date**, or its **Planning Date** when the document date is blank. Posting copies
the date to the posted invoice or credit memo line.

The column is blank on a line that was not created from a project, such as a line typed in by hand. It is
also blank when no planning line can be found for the line.

Invoices and credit memos that already existed when Bifröst Projects was installed or updated are filled in
the same way once, for the lines that came from a project and have no date. A date that is already there is
never changed.

## When the column is visible

The column is shown when the invoice or credit memo being viewed contains lines created from project
planning lines. It is hidden on a document without those lines, even if other documents in the company
invoice projects. Business Central checks this when the lines part opens. A manually added line on a
project invoice can therefore show the column with a blank date.

The column also needs the **Jobs** application area, as the rest of the project functions do.

## Show or hide the column yourself

Each user can show or hide the column through personalization. Choose **Settings**, then
**Personalize**, on the page, and add or remove **Time Sheet Date**. The choice applies to that user only.

## Good to know

Open invoices and credit memos with your normal Business Central sales permissions. The date is
read-only, and no separate action is needed to fill it when a line is created from project planning.

More about the app: [Bifröst Projects](/projects/).
