---
id: draupnir-signers
title: "Draupnir — IOBS SOAP signers"
sidebar_label: "Draupnir signers"
sidebar_position: 2
description: "How Bifröst Iceland Treasury signs requests to the banks, and what an administrator sets up for it: the client certificate and its password."
---

This page is for the Business Central administrator who connects the company to its banks. It
explains what Draupnir does and the one thing you have to provide for it: the bank's client
certificate.

## What a signer is

Landsbankinn, Arion banki, Kvika banki and Sparisjóðir require every request to be digitally signed
with a certificate the bank issued to your company. That is part of the Icelandic online banking
standard (IOBS, *Sambankaskema*), and each bank expects its own variant of the signature.

**Draupnir** is the part of Bifröst Iceland Treasury that does the signing. It knows which variant
each bank expects, signs every request before it leaves Business Central, and, where the bank
requires it, encrypts the request and decrypts the answer. You never choose a variant yourself:
the connector picks the right one for each bank and service.

Íslandsbanki signs nothing. It authenticates with a user name and password over an encrypted
connection, so it needs no client certificate.

If a request cannot be signed (no certificate, a wrong certificate password, an expired
certificate), nothing is sent to the bank. The call is logged on the Bifrost Request Log and answers
with an error saying what is wrong.

## Set up the certificate

The client signing certificate is a PKCS#12 file (`.pfx`) with a password, issued by the bank.

1. Get the certificate and its password from the bank, as part of your agreement for the services
   you use.
2. Open **Bifrost Iceland Treasury Setup** (or run the setup wizard from Assisted Setup) and select
   the bank's row.
3. Choose **Set Certificate**, upload the `.pfx` file and enter its password. The certificate is
   checked against the password before either is stored, so a typing error is caught immediately.
4. Check that the bank's **Secrets** column shows **Complete**.

The certificate and its password are kept in the app's encrypted storage. They are never written to a
table, a log or an error message, and never shown again. See
[Bank secrets](/help/iceland-treasury/treasury-secrets/) and the
[setup page help](/help/iceland-treasury/treasury-setup/).

The bank's own certificate, which some services use to encrypt, is obtained automatically. There
is nothing to enter, except for Íslandsbanki, whose bank certificate is uploaded with
**Set Bank Certificate**.

## Keep it current

The FactBox on the setup page shows the selected bank's certificate: subject, issuer, thumbprint and
the dates it is valid between. The expiry date turns amber as it approaches and red once it has
passed. Renew the certificate with the bank before it expires and upload the new one with
**Set Certificate**; the bank refuses requests signed with an expired certificate.

Certificates are stored per company. They do not carry over from the earlier Cloud Events bank
apps: upload them once after installing Bifröst Iceland Treasury.

## Where to go next

- [Iceland Treasury overview](/iceland-treasury/)
- [Landsbankinn](../banks/landsbankinn.md) · [Arion banki](../banks/arion.md) ·
  [Kvika banki](../banks/kvika.md) · [Sparisjóðir](../banks/sparisjodir.md)
