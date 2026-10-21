# Changelog

## [Unreleased]

### Fixed

- The top navigation no longer overlaps on desktop screens: Foundation and the apps are now one Apps menu instead of a row of buttons, so the bar stays on one line as more apps are published. Same in English and Icelandic.

### Added

- Publish Bifröst Iceland for its 28.1.0 AppSource release: the app page (national registry, VAT, payroll and capital income tax returns, central bank rates, Skilagrein, island.is lookups, SMS, setup and permissions) and context-sensitive help for Bifrost Iceland Setup, Skilagrein Collectors and National Registry Entries, in English and Icelandic. The catalogue entry is marked coming soon until the AppSource listing is live.
- Publish the Bifrost Warehouse documentation for its AppSource preparation: the app page in English and Icelandic and a catalogue entry marked coming soon. Warehouse has no Business Central pages of its own, so it has no help pages.
- English and Icelandic Bifröst Inventory documentation for release 28.3.0: the app page (transfers, assembly, item tracking reads, reservations and order tracking, availability by period, item references, item charges, item categories, counts, costing and periods) and context-sensitive help for Inventory Setup with all 15 areas, including the note that the four newest areas stay off on existing companies. The catalogue entry is marked coming soon until the AppSource listing is live.
- English and Icelandic Bifröst Subscription Billing documentation and a catalogue entry marked Coming soon.
- Publish the Bifrost Orchestrator documentation for its AppSource preparation: the app page, listing copy and user scenarios, and context-sensitive help for every Orchestrator page, in English and Icelandic. Orchestrator is listed in the app catalogue as coming soon.

- English and Icelandic Attachments documentation and context-sensitive help for setup, storage connections and file account selection.
- An Attachments catalogue entry with its documentation link and an explicit unpublished status.

### Changed

- Allow Attachments documentation before AppSource publication. Every other unpublished app remains blocked, and the existing public-content restrictions still apply.

### Fixed

- Correct Icelandic wording for storage connection fields and account credentials in Attachments help.
- Correct the Icelandic feminine plural agreement in the Attachments setup account-credentials description.

### Tests

- Exercise the Attachments exception and retained public-content restrictions in the existing documentation boundary check.
