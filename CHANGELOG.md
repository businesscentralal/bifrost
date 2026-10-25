# Changelog

## [Unreleased]

### Fixed

- The top navigation no longer overlaps on desktop screens: Foundation and the apps are now one Apps menu instead of a row of buttons, built from apps.ts so a new app appears there without a navbar change, and check:structure fails if app buttons come back on the bar. Same in English and Icelandic.

### Added

- Context-sensitive help for the Bifrost Warehouse assisted setup, Set up Bifrost Warehouse, in English and Icelandic.
- Publish Bifröst Iceland Treasury for its AppSource preparation: the app page (statements into bank reconciliation, payment batches for approval at the bank, foreign payments, claims and their payments, tracking, setup and permissions), a page on following payments and claims, a page for each of Arion banki, Íslandsbanki and Landsbankinn, the listing copy, the user scenarios and context-sensitive help for the setup page, the setup guide, bank secrets, user credentials, Payment Methods, the customer ledger entry FactBox, statement import and the tracking pages, in English and Icelandic. The catalogue entry is marked coming soon until the AppSource listing is live.
- Publish Bifröst Iceland DocEx for its AppSource preparation: the app page (sending posted invoices and credit memos as Peppol e-invoices through Advania and Unimaze, delivery status, receiving into incoming documents, purchase invoices or journal lines, answers to suppliers, setup and permissions), the listing copy, the user scenarios and context-sensitive help for Document Exchange Setup, BIS30 Code Map and Vendor VAT G/L Account Map, in English and Icelandic. The catalogue entry is marked coming soon until the AppSource listing is live.
- Publish Bifröst Iceland for its 28.1.0 AppSource release: the app page (national registry, VAT, payroll and capital income tax returns, central bank rates, Skilagrein, island.is lookups, SMS, setup and permissions) and context-sensitive help for Bifrost Iceland Setup, Skilagrein Collectors and National Registry Entries, in English and Icelandic. The catalogue entry is marked coming soon until the AppSource listing is live.
- Publish the Bifrost Warehouse documentation for its AppSource preparation: the app page in English and Icelandic and a catalogue entry marked coming soon. Warehouse has no Business Central pages of its own, so it has no help pages.
- English and Icelandic Bifröst Inventory documentation for release 28.3.0: the app page (transfers, assembly, item tracking reads, reservations and order tracking, availability by period, item references, item charges, item categories, counts, costing and periods) and context-sensitive help for Inventory Setup with all 15 areas, including the note that the four newest areas stay off on existing companies. The catalogue entry is marked coming soon until the AppSource listing is live.
- English and Icelandic Bifröst Subscription Billing documentation and a catalogue entry marked Coming soon.
- Publish the Bifrost Orchestrator documentation for its AppSource preparation: the app page, listing copy and user scenarios, and context-sensitive help for every Orchestrator page, in English and Icelandic. Orchestrator is listed in the app catalogue as coming soon.

- English and Icelandic Attachments documentation and context-sensitive help for setup, storage connections and file account selection.
- An Attachments catalogue entry with its documentation link and an explicit unpublished status.

### Changed

- Bifrost Language Models, Attachments, Orchestrator, Inventory, Subscription Billing, Warehouse and Iceland are listed as available on Microsoft AppSource, with links to their listings on the Apps page and on each app's page, in English and Icelandic.
- The Apps page shows the latest AppSource version of each released app, its release date and a link to its release notes, read from versions.json. On the Icelandic Apps page, Foundation's summary is now in Icelandic. Step 1 of the setup guide links to the Apps page for the apps built on Foundation.
- Allow Attachments documentation before AppSource publication. Every other unpublished app remains blocked, and the existing public-content restrictions still apply.

### Fixed

- Correct Icelandic wording for storage connection fields and account credentials in Attachments help.
- Correct the Icelandic feminine plural agreement in the Attachments setup account-credentials description.

### Tests

- Exercise the Attachments exception and retained public-content restrictions in the existing documentation boundary check.
