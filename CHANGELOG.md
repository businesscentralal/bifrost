# Changelog

## [Unreleased]

### Changed

- Bifrost Iceland Treasury Setup help, in English and Icelandic: **Set My Bank Authorization** asks for the user's bank user name and personal authorization together (a blank name, or an unchanged company-default hint, keeps the company default); **Clear My Bank Authorization** can also clear that user name; the **Information** FactBox shows the user name in use (own or company default) and does not show a password; **SOAP Signer** is editable only for Íslandsbanki, Kvika banki and Sparisjóðir and read-only on other rows; it stays blank unless the bank asks for WSE2 or WSE3. The Icelandic setup help matches the English page, including the Information FactBox. Publish with the Iceland Treasury release that contains this behaviour. No objects added.
