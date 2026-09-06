---
id: draupnir-signers
title: "Draupnir — IOBS SOAP signers"
sidebar_label: "Draupnir signers"
sidebar_position: 2
description: "The IOBS SOAP signing framework shared by every bank connector: one interface, five signing profiles, selected per bank and service."
---

Draupnir is the signing framework for the IOBS (Icelandic Online Banking Standard, *Sambankaskema*) web services. The Icelandic banks publish their services over WCF, and each expects a particular WS-Security shape: which parts of the envelope are signed, how the client certificate is referenced, whether the body is also encrypted. Draupnir holds those shapes.

A bank connector builds the inner SOAP body and hands it to a signer. It gets back a complete, signed — and where the profile requires it, encrypted — SOAP envelope, ready to post. The connector does not know how the signature was produced.

There is one interface, `IOBS ISoap Signer ori`, and several implementations behind it. Which one a bank uses is a value of the `IOBS Soap Signer ori` enum, chosen by the connector at call time. Draupnir is not a bank connector itself and adds no message types.

## Signing profiles

| Profile | What it does | Used by |
| --- | --- | --- |
| **WS-Security (Basic256)** | The default. Signs the Body, the Timestamp and the `wsa:To`, `Action`, `MessageID` and `ReplyTo` addressing headers. The client certificate is referenced by SHA-1 thumbprint. Sign only. | The shared Sambankaskema services at [Arion banki](../banks/arion.md) — statements, currency rates, claims and payments. |
| **WSE2 (IOBS adapter)** | The Microsoft WSE 2.0 shape: SOAP 1.1, WS-Addressing 2004/03, a `UsernameToken` for credentials, a direct reference to the security token, six signed parts. | [Kvika banki](../banks/kvika.md) and [Sparisjóðir](../banks/sparisjodir.md). |
| **WSE3 UsernameToken** | The Microsoft WSE 3.0 shape: SOAP 1.1, WS-Addressing 2004/08, only the Body is signed. | No connector in the current release selects it. It is kept for IOBS services that expect the WSE 3.0 client shape. |
| **Mutual Certificate 2013** | The mutual-certificate profile of the IOBS 20131015 services: SOAP 1.1, no WS-Addressing, a signed Timestamp, Body and `UsernameToken`. Signs only by default; set a recipient certificate and it also encrypts the body. | [Landsbankinn](../banks/landsbankinn.md), sign only. |
| **Mutual Certificate 2013 Symmetric** | The WCF `SymmetricBinding` mutual-certificate profile: SOAP 1.2, an RSA-OAEP wrapped session key, derived keys (P\_SHA1) for signing and encryption, an encrypted primary signature and an endorsing client-certificate signature. Signs and encrypts. | Arion's proprietary account and bill services. |

All five share the same cryptographic backbone where the profile allows it — exclusive C14N canonicalisation, RSA-SHA1 signatures, SHA-1 digests. That is what WCF's Basic256 profile produces, so a response signed by the bank's WCF stack validates here, and an envelope signed here validates at the bank.

The framework is pure AL and drives the platform's own `SignedXml` and `X509Certificate2` services. There is no .NET add-in, and it runs on Business Central online.

## How a request is signed

Every call follows the same sequence.

1. **The connector builds the inner SOAP body** for the operation — the request element and its arguments, with no envelope and no header.
2. **The connector selects a profile** and casts the enum value to the interface. For most banks this is a single fixed choice; Arion picks between two profiles depending on which service family the operation belongs to.
3. **Draupnir opens the client certificate**, reads its public part and its thumbprint, and builds the envelope: the SOAP header with the WS-Security element, a Timestamp, the credentials, the client certificate as a binary security token, and the inner body inside `soap:Body`.
4. **Draupnir signs.** It computes a digest over each part the profile covers, then one RSA signature over those references, and places the resulting `ds:Signature` in the security header with a token reference back to the client certificate.
5. **Where the profile encrypts**, the body is encrypted to the bank's public certificate before the envelope is returned. In the symmetric profile the session key is generated per request, wrapped to the bank's certificate, and kept on the signer instance.
6. **The connector posts the envelope** and passes the response back to the *same signer instance* for decryption. This matters for the symmetric profile: the session key needed to read the response lives in that instance. Sign-only profiles, and responses with no encrypted body such as SOAP faults, return the response unchanged.

If signing fails — a missing certificate, a wrong certificate password, a malformed body — the connector records the failure in the shared request log and returns an error response. No partial request reaches the bank.

## Certificates

Two certificates are involved, and only one of them is yours to manage.

**The client signing certificate** is issued to your company by the bank. It is a PKCS#12 (`.pfx`) file with a password. Upload it, and its password, on the Treasury Setup page — see the [in-product help](/help/iceland-treasury/treasury-setup/). Both values go into the extension's encrypted storage and are never written to a table, a log or an error message. See [secrets](/help/iceland-treasury/treasury-secrets/).

The setup page's FactBox reads the stored certificate and shows its subject, issuer, thumbprint and validity window. The expiry date is coloured — green while there is time, amber as it approaches, red once it has passed — so a certificate about to lapse is visible before the calls start failing. Nothing else on the page reveals the certificate itself.

**The bank's certificate** is only needed by the encrypting profiles, and the connector obtains it from the service's own published metadata. There is nothing to enter.

Certificates are per company and per extension. They do not carry over from a predecessor app, because encrypted storage belongs to the extension that wrote it.

## Extending it

A new bank connector does not implement signing. It selects a profile — usually one line — and stores which value that bank needs.

```al
var
    Signer: Interface "IOBS ISoap Signer ori";
    Envelope: Text;
begin
    Signer := Enum::"IOBS Soap Signer ori"::WsSecurity;
    Envelope := Signer.BuildSignedEnvelope(ServiceUrl, SoapAction, Username, Password, InnerBody, CertBase64, CertPassword);
    // post Envelope, then:
    ResponseEnvelope := Signer.DecryptResponseBody(ResponseEnvelope);
end;
```

The enum is extensible, so a bank whose service expects a shape none of the five profiles produces can add its own without touching this app:

1. Implement `IOBS ISoap Signer ori` in a new codeunit. The interface has three procedures: `BuildSignedEnvelope`, `SetRecipientCertificate` for the encrypting profiles, and `DecryptResponseBody`.
2. Add a value to the `IOBS Soap Signer ori` enum with an `Implementation` clause pointing at that codeunit.
3. Grant execute on the codeunit in the permission set that covers the new connector.

Because the profile is resolved through the enum, a connector only stores which value its bank requires and casts it to the interface when it calls. The interface is the extension point — see [Build on Bifröst](/extensibility/).

## Where to go next

- [Iceland Treasury overview](../index.md)
- [Arion banki](../banks/arion.md)
- [Message type reference](/iceland-treasury/reference/message-types/)
- [In-product help](/help/iceland-treasury/)
