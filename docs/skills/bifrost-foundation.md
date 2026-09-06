---
id: bifrost-foundation
title: "Foundation message types"
sidebar_label: "Foundation message types"
sidebar_position: 3
description: "Message types added to the Bifröst API by Bifrost Foundation. The message-based API surface for Business Central: a queue, a task and a response endpoint, self-describing message types, and the platform every other Bifröst app is built on. Load alongside bifrost-bc-integration…"
---

The message-based API surface for Business Central: a queue, a task and a response endpoint, self-describing message types, and the platform every other Bifröst app is built on.

---

## When to load this skill

Load it together with the core skill when:

- you need the exact request and response contract of a Foundation message type — the core skill explains the API and the patterns, these pages give the field-by-field contract of one type;
- you are checking whether a message type exists at all before calling it;
- you need the setup, secret store, licensing, event or field-restriction reference for the kernel.

It does not describe the API itself. The envelope, the endpoints, the error order, pagination and `tableView` are in [bifrost-bc-integration](./bifrost-bc-integration/index.md) and are not repeated here.

---

## Hard rules

- Foundation is the kernel. Every other app in the family depends on it, so its message types are available in every environment that runs any Bifröst app.
- Read [bifrost-bc-integration](./bifrost-bc-integration/index.md) first. These pages are contracts, not explanations — the envelope, the error order and the field-name rules are in the core skill and are not repeated here.
- Call `Help.MessageTypes.Get` against the environment before you use one of these types. An app that is not installed contributes nothing to the catalogue, and the failure looks like a typo.
- Read the page for a message type before calling it. The pages below are generated from the app’s own help codeunits, so they are the contract, not a summary of it.
- Keep calls serial, prefix test data with `BIFT-`, and never delete existing master data.

---

## Reference pages

**Reference base:** `../../foundation/reference/` — every path below is relative to it.

Append `message-types/<page>/` for a message type, or `<page>/` for the pages in the last table.
From the deployed site the same paths resolve against this file’s own URL.

### `Help.*` (20)

| Message type | Page |
| --- | --- |
| `Help.Bifrost.Get` | `message-types/help-bifrost-get/` |
| `Help.Fields.Get` | `message-types/help-fields-get/` |
| `Help.Implementation.Get` | `message-types/help-implementation-get/` |
| `Help.License.Environment.Set` | `message-types/help-license-environment-set/` |
| `Help.License.Get` | `message-types/help-license-get/` |
| `Help.License.Install.Run` | `message-types/help-license-install-run/` |
| `Help.License.OnPremSecrets.Set` | `message-types/help-license-onpremsecrets-set/` |
| `Help.License.Purchase.Write` | `message-types/help-license-purchase-write/` |
| `Help.License.Reset` | `message-types/help-license-reset/` |
| `Help.License.Set` | `message-types/help-license-set/` |
| `Help.License.Sync` | `message-types/help-license-sync/` |
| `Help.License.Usage.Write` | `message-types/help-license-usage-write/` |
| `Help.MessageTypes.Get` | `message-types/help-messagetypes-get/` |
| `Help.Namespaces.Get` | `message-types/help-namespaces-get/` |
| `Help.NextLineNo.Get` | `message-types/help-nextlineno-get/` |
| `Help.PageUrl.Get` | `message-types/help-pageurl-get/` |
| `Help.Permissions.Get` | `message-types/help-permissions-get/` |
| `Help.TableRelations.Get` | `message-types/help-tablerelations-get/` |
| `Help.Tables.Get` | `message-types/help-tables-get/` |
| `Help.WhoAmI.Get` | `message-types/help-whoami-get/` |

### `Inventory.*` (17)

| Message type | Page |
| --- | --- |
| `Inventory.AssemblyOrder.Create` | `message-types/inventory-assemblyorder-create/` |
| `Inventory.AssemblyOrder.Post` | `message-types/inventory-assemblyorder-post/` |
| `Inventory.AssemblyOrder.PreviewPost` | `message-types/inventory-assemblyorder-previewpost/` |
| `Inventory.AssemblyOrder.RefreshLines` | `message-types/inventory-assemblyorder-refreshlines/` |
| `Inventory.AssemblyOrder.Release` | `message-types/inventory-assemblyorder-release/` |
| `Inventory.AssemblyOrder.Reopen` | `message-types/inventory-assemblyorder-reopen/` |
| `Inventory.AssemblyOrder.Statistics` | `message-types/inventory-assemblyorder-statistics/` |
| `Inventory.ItemJournal.Check` | `message-types/inventory-itemjournal-check/` |
| `Inventory.ItemJournal.Post` | `message-types/inventory-itemjournal-post/` |
| `Inventory.ItemJournal.PreviewPost` | `message-types/inventory-itemjournal-previewpost/` |
| `Inventory.ItemJournal.SetupNewLine` | `message-types/inventory-itemjournal-setupnewline/` |
| `Inventory.TransferOrder.Create` | `message-types/inventory-transferorder-create/` |
| `Inventory.TransferOrder.Post` | `message-types/inventory-transferorder-post/` |
| `Inventory.TransferOrder.PreviewPost` | `message-types/inventory-transferorder-previewpost/` |
| `Inventory.TransferOrder.Release` | `message-types/inventory-transferorder-release/` |
| `Inventory.TransferOrder.Reopen` | `message-types/inventory-transferorder-reopen/` |
| `Inventory.TransferOrder.Statistics` | `message-types/inventory-transferorder-statistics/` |

### `Finance.*` (16)

| Message type | Page |
| --- | --- |
| `Finance.BankReconciliation.Create` | `message-types/finance-bankreconciliation-create/` |
| `Finance.BankReconciliation.Match` | `message-types/finance-bankreconciliation-match/` |
| `Finance.BankReconciliation.Post` | `message-types/finance-bankreconciliation-post/` |
| `Finance.BankReconciliation.Reset` | `message-types/finance-bankreconciliation-reset/` |
| `Finance.Currency.AdjustExchangeRates` | `message-types/finance-currency-adjustexchangerates/` |
| `Finance.FAJournal.Check` | `message-types/finance-fajournal-check/` |
| `Finance.FAJournal.Post` | `message-types/finance-fajournal-post/` |
| `Finance.FAJournal.PreviewPost` | `message-types/finance-fajournal-previewpost/` |
| `Finance.FAJournal.SetupNewLine` | `message-types/finance-fajournal-setupnewline/` |
| `Finance.FinancialReport.Calculate` | `message-types/finance-financialreport-calculate/` |
| `Finance.GeneralJournal.Check` | `message-types/finance-generaljournal-check/` |
| `Finance.GeneralJournal.Post` | `message-types/finance-generaljournal-post/` |
| `Finance.GeneralJournal.PreviewPost` | `message-types/finance-generaljournal-previewpost/` |
| `Finance.GeneralJournal.ReverseRegister` | `message-types/finance-generaljournal-reverseregister/` |
| `Finance.GeneralJournal.ReverseTransaction` | `message-types/finance-generaljournal-reversetransaction/` |
| `Finance.GeneralJournal.SetupNewLine` | `message-types/finance-generaljournal-setupnewline/` |

### `Sales.*` (16)

| Message type | Page |
| --- | --- |
| `Sales.BlanketOrder.MakeOrder` | `message-types/sales-blanketorder-makeorder/` |
| `Sales.Document.Create` | `message-types/sales-document-create/` |
| `Sales.Document.Post` | `message-types/sales-document-post/` |
| `Sales.Document.PreviewPost` | `message-types/sales-document-previewpost/` |
| `Sales.Document.Release` | `message-types/sales-document-release/` |
| `Sales.Document.Reopen` | `message-types/sales-document-reopen/` |
| `Sales.Document.Statistics` | `message-types/sales-document-statistics/` |
| `Sales.Quote.MakeOrder` | `message-types/sales-quote-makeorder/` |
| `Sales.ReturnReceipt.Pdf` | `message-types/sales-returnreceipt-pdf/` |
| `Sales.SalesCreditMemo.Pdf` | `message-types/sales-salescreditmemo-pdf/` |
| `Sales.SalesCreditMemo.Send` | `message-types/sales-salescreditmemo-send/` |
| `Sales.SalesInvoice.Cancel` | `message-types/sales-salesinvoice-cancel/` |
| `Sales.SalesInvoice.Correct` | `message-types/sales-salesinvoice-correct/` |
| `Sales.SalesInvoice.Pdf` | `message-types/sales-salesinvoice-pdf/` |
| `Sales.SalesInvoice.Send` | `message-types/sales-salesinvoice-send/` |
| `Sales.SalesShipment.Pdf` | `message-types/sales-salesshipment-pdf/` |

### `Purchase.*` (10)

| Message type | Page |
| --- | --- |
| `Purchase.BlanketOrder.MakeOrder` | `message-types/purchase-blanketorder-makeorder/` |
| `Purchase.Document.Create` | `message-types/purchase-document-create/` |
| `Purchase.Document.Post` | `message-types/purchase-document-post/` |
| `Purchase.Document.PreviewPost` | `message-types/purchase-document-previewpost/` |
| `Purchase.Document.Release` | `message-types/purchase-document-release/` |
| `Purchase.Document.Reopen` | `message-types/purchase-document-reopen/` |
| `Purchase.Document.Statistics` | `message-types/purchase-document-statistics/` |
| `Purchase.PurchaseInvoice.Cancel` | `message-types/purchase-purchaseinvoice-cancel/` |
| `Purchase.PurchaseInvoice.Correct` | `message-types/purchase-purchaseinvoice-correct/` |
| `Purchase.Quote.MakeOrder` | `message-types/purchase-quote-makeorder/` |

### `Warehouse.*` (10)

| Message type | Page |
| --- | --- |
| `Warehouse.Pick.Create` | `message-types/warehouse-pick-create/` |
| `Warehouse.Pick.Register` | `message-types/warehouse-pick-register/` |
| `Warehouse.Putaway.Create` | `message-types/warehouse-putaway-create/` |
| `Warehouse.Putaway.Register` | `message-types/warehouse-putaway-register/` |
| `Warehouse.Receipt.Create` | `message-types/warehouse-receipt-create/` |
| `Warehouse.Receipt.Post` | `message-types/warehouse-receipt-post/` |
| `Warehouse.Receipt.Post.Preview` | `message-types/warehouse-receipt-post-preview/` |
| `Warehouse.Shipment.Create` | `message-types/warehouse-shipment-create/` |
| `Warehouse.Shipment.Post` | `message-types/warehouse-shipment-post/` |
| `Warehouse.Shipment.PreviewPost` | `message-types/warehouse-shipment-previewpost/` |

### `Data.*` (8)

| Message type | Page |
| --- | --- |
| `Data.Entries.Find` | `message-types/data-entries-find/` |
| `Data.Notes.Get` | `message-types/data-notes-get/` |
| `Data.Notes.Set` | `message-types/data-notes-set/` |
| `Data.RecordIds.Get` | `message-types/data-recordids-get/` |
| `Data.Records.Get` | `message-types/data-records-get/` |
| `Data.Records.Set` | `message-types/data-records-set/` |
| `Data.RequestLog.Get` | `message-types/data-requestlog-get/` |
| `Data.Totals.Get` | `message-types/data-totals-get/` |

### `Document.*` (7)

| Message type | Page |
| --- | --- |
| `Document.Approval.Approve` | `message-types/document-approval-approve/` |
| `Document.Approval.Cancel` | `message-types/document-approval-cancel/` |
| `Document.Approval.Delegate` | `message-types/document-approval-delegate/` |
| `Document.Approval.Get` | `message-types/document-approval-get/` |
| `Document.Approval.Me` | `message-types/document-approval-me/` |
| `Document.Approval.Reject` | `message-types/document-approval-reject/` |
| `Document.Approval.Send` | `message-types/document-approval-send/` |

### `Memory.*` (6)

| Message type | Page |
| --- | --- |
| `Memory.Company.Get` | `message-types/memory-company-get/` |
| `Memory.Company.List` | `message-types/memory-company-list/` |
| `Memory.Company.Set` | `message-types/memory-company-set/` |
| `Memory.User.Get` | `message-types/memory-user-get/` |
| `Memory.User.List` | `message-types/memory-user-list/` |
| `Memory.User.Set` | `message-types/memory-user-set/` |

### `Customer.*` (5)

| Message type | Page |
| --- | --- |
| `Customer.Application.Post` | `message-types/customer-application-post/` |
| `Customer.Application.Reverse` | `message-types/customer-application-reverse/` |
| `Customer.CreditLimit.Get` | `message-types/customer-creditlimit-get/` |
| `Customer.SalesHistory.Get` | `message-types/customer-saleshistory-get/` |
| `Customer.Statement.Pdf` | `message-types/customer-statement-pdf/` |

### `Incoming.*` (5)

| Message type | Page |
| --- | --- |
| `Incoming.Document.Attach` | `message-types/incoming-document-attach/` |
| `Incoming.Document.Create` | `message-types/incoming-document-create/` |
| `Incoming.Document.Get` | `message-types/incoming-document-get/` |
| `Incoming.Document.Process` | `message-types/incoming-document-process/` |
| `Incoming.Document.SetDefault` | `message-types/incoming-document-setdefault/` |

### `User.*` (5)

| Message type | Page |
| --- | --- |
| `User.Notification.Count` | `message-types/user-notification-count/` |
| `User.Notification.Get` | `message-types/user-notification-get/` |
| `User.Notification.Read` | `message-types/user-notification-read/` |
| `User.Notification.Send` | `message-types/user-notification-send/` |
| `User.Notification.Thread` | `message-types/user-notification-thread/` |

### `ChangeLog.*` (4)

| Message type | Page |
| --- | --- |
| `ChangeLog.Field.Enabled` | `message-types/changelog-field-enabled/` |
| `ChangeLog.Field.History` | `message-types/changelog-field-history/` |
| `ChangeLog.Field.Restore` | `message-types/changelog-field-restore/` |
| `ChangeLog.Records.Delta` | `message-types/changelog-records-delta/` |

### `Projects.*` (4)

| Message type | Page |
| --- | --- |
| `Projects.ProjectJournal.Check` | `message-types/projects-projectjournal-check/` |
| `Projects.ProjectJournal.Post` | `message-types/projects-projectjournal-post/` |
| `Projects.ProjectJournal.PreviewPost` | `message-types/projects-projectjournal-previewpost/` |
| `Projects.ProjectJournal.SetupNewLine` | `message-types/projects-projectjournal-setupnewline/` |

### `Field.*` (3)

| Message type | Page |
| --- | --- |
| `Field.Translation.Get` | `message-types/field-translation-get/` |
| `Field.Translation.Set` | `message-types/field-translation-set/` |
| `Field.Translations.Get` | `message-types/field-translations-get/` |

### `Resources.*` (3)

| Message type | Page |
| --- | --- |
| `Resources.ResourceJournal.Check` | `message-types/resources-resourcejournal-check/` |
| `Resources.ResourceJournal.Post` | `message-types/resources-resourcejournal-post/` |
| `Resources.ResourceJournal.SetupNewLine` | `message-types/resources-resourcejournal-setupnewline/` |

### `CSV.*` (2)

| Message type | Page |
| --- | --- |
| `CSV.DeletedRecords.Get` | `message-types/csv-deletedrecords-get/` |
| `CSV.Records.Get` | `message-types/csv-records-get/` |

### `Deleted.*` (2)

| Message type | Page |
| --- | --- |
| `Deleted.RecordIds.Get` | `message-types/deleted-recordids-get/` |
| `Deleted.Records.Get` | `message-types/deleted-records-get/` |

### `Item.*` (2)

| Message type | Page |
| --- | --- |
| `Item.Availability.Get` | `message-types/item-availability-get/` |
| `Item.Price.Get` | `message-types/item-price-get/` |

### `Project.*` (2)

| Message type | Page |
| --- | --- |
| `Project.Ledger.CreateSalesCreditMemo` | `message-types/project-ledger-createsalescreditmemo/` |
| `Project.Ledger.CreateSalesInvoice` | `message-types/project-ledger-createsalesinvoice/` |

### `Vendor.*` (2)

| Message type | Page |
| --- | --- |
| `Vendor.Application.Post` | `message-types/vendor-application-post/` |
| `Vendor.Application.Reverse` | `message-types/vendor-application-reverse/` |

### `Email.*` (1)

| Message type | Page |
| --- | --- |
| `Email.Draft.Set` | `message-types/email-draft-set/` |

### `Hello.*` (1)

| Message type | Page |
| --- | --- |
| `Hello.Bifrost.Get` | `message-types/hello-bifrost-get/` |

### `Webhook.*` (1)

| Message type | Page |
| --- | --- |
| `Webhook.Inbound.Receive` | `message-types/webhook-inbound-receive/` |

### Other reference pages

| Page | Path |
| --- | --- |
| API reference | `api/` |
| Events and webhooks | `events-and-webhooks/` |
| Field access restrictions | `field-access-restrictions/` |
| Licensing | `licensing/` |
| Secrets | `secrets/` |
| Setup reference | `setup/` |

---

## Related skills

- [bifrost-bc-integration](./bifrost-bc-integration/index.md) — the API itself. Always load this one.
- [bifrost-iceland](./bifrost-iceland.md) — Bifrost Iceland
- [bifrost-iceland-treasury](./bifrost-iceland-treasury.md) — Bifrost Iceland Treasury
- [bifrost-iceland-docex](./bifrost-iceland-docex.md) — Bifrost Iceland DocEx
- [bifrost-bragi](./bifrost-bragi.md) — Bifrost Bragi
- [bifrost-hnitbjorg](./bifrost-hnitbjorg.md) — Bifrost Hnitbjorg
- [bifrost-nornir](./bifrost-nornir.md) — Bifrost Nornir
- [bifrost-clockify](./bifrost-clockify.md) — Bifrost Clockify
- [bifrost-subscription-billing](./bifrost-subscription-billing.md) — Bifrost Subscription Billing
## Loading this skill

An agent loads the skill file itself: [SKILL.md](pathname:///skills/bifrost-foundation/SKILL.md).
It is an index: what the app adds, when to load it, and the path of every reference page.

<details>
<summary>The description an agent matches this skill against</summary>

Message types added to the Bifröst API by Bifrost Foundation. The message-based API surface for Business Central: a queue, a task and a response endpoint, self-describing message types, and the platform every other Bifröst app is built on. Load alongside bifrost-bc-integration, which carries the API itself; this skill is the index of what Foundation adds — 152 message types across 24 families (Help.*, Inventory.*, Finance.*, Sales.*, Purchase.*, Warehouse.*, Data.*, Document.*, Memory.*, Customer.*, Incoming.*, User.*, ChangeLog.*, Projects.*, Field.*, Resources.*, CSV.*, Deleted.*, Item.*, Project.*, Vendor.*, Email.*, Hello.*, Webhook.*).

</details>
