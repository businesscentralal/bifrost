---
id: draupnir-signers
title: "Draupnir — IOBS SOAP-undirritarar"
sidebar_label: "Draupnir-undirritarar"
sidebar_position: 2
description: "IOBS SOAP-undirritunarramminn sem allar bankatengingar deila: eitt viðmót, fimm undirritunarsnið, valið eftir banka og þjónustu."
---

Draupnir er undirritunarramminn fyrir vefþjónustur IOBS (Icelandic Online Banking Standard, *Sambankaskema*). Íslensku bankarnir birta þjónustur sínar í gegnum WCF og hver þeirra krefst tiltekinnar WS-Security-uppbyggingar: hvaða hlutar envelope eru undirritaðir, hvernig tilvísun er gerð í viðskiptavottorð og hvort body sé einnig dulkóðað. Draupnir geymir þessi snið.

Bankatenging byggir innri SOAP-body og afhendir hann undirritara. Hún fær til baka heilt, undirritað og, þegar sniðið krefst þess, dulkóðað SOAP-envelope sem er tilbúið til sendingar. Tengingin þarf ekki að vita hvernig undirritunin var framkvæmd.

Eitt viðmót er til, `IOBS ISoap Signer ori`, og nokkrar útfærslur á bak við það. Hvaða útfærsla banka notar er gildi í `IOBS Soap Signer ori` enum, valið af tengingunni þegar kallið er framkvæmt. Draupnir er ekki bankatenging sjálf og bætir engum skilaboðategundum við.

## Undirritunarsnið

| Snið | Hvað það gerir | Notað af |
| --- | --- | --- |
| **WS-Security (Basic256)** | Sjálfgefið snið. Undirritar Body, Timestamp og `wsa:To`, `Action`, `MessageID` og `ReplyTo`-addressing-hausa. Vísað er í viðskiptavottorð með SHA-1 thumbprint. Aðeins undirritun. | Sameiginleg Sambankaskema-þjónusta hjá [Arion banka](../banks/arion.md) — yfirlit, gengi, kröfur og greiðslur. |
| **WSE2 (IOBS adapter)** | Microsoft WSE 2.0-snið: SOAP 1.1, WS-Addressing 2004/03, `UsernameToken` fyrir skilríki, bein tilvísun í öryggistákn og sex undirritaðir hlutar. | [Kvika banki](../banks/kvika.md) og [Sparisjóðir](../banks/sparisjodir.md). |
| **WSE3 UsernameToken** | Microsoft WSE 3.0-snið: SOAP 1.1, WS-Addressing 2004/08 og aðeins Body undirritað. | Engin tenging í núverandi útgáfu velur þetta. Það er varðveitt fyrir IOBS-þjónustur sem krefjast WSE 3.0-biðlarasniðs. |
| **Mutual Certificate 2013** | Gagnkvæma vottorðssnið IOBS 20131015-þjónustanna: SOAP 1.1, enginn WS-Addressing, undirritað Timestamp, Body og `UsernameToken`. Aðeins undirritun sjálfgefið; með viðtakandavottorði er body einnig dulkóðað. | [Landsbankinn](../banks/landsbankinn.md), aðeins undirritun. |
| **Mutual Certificate 2013 Symmetric** | WCF `SymmetricBinding`-snið gagnkvæmra vottorða: SOAP 1.2, RSA-OAEP-vafinn lotulykill, afleiddir lyklar (P_SHA1) fyrir undirritun og dulkóðun, dulkóðuð aðalundirritun og undirritun viðskiptavottorðs sem staðfestir hana. Undirritar og dulkóðar. | Sérþjónustur Arion fyrir reikninga og reikninga til greiðslu. |

Öll fimm snið deila sama dulritunargrunni þar sem sniðið leyfir það — exclusive C14N-canonicalisation, RSA-SHA1-undirritunum og SHA-1 digestum. Það er það sem Basic256-snið WCF framleiðir, þannig að svar undirritað af WCF-stafla bankans sannprófast hér og envelope sem er undirritað í Bifröst sannprófast hjá bankanum.

Ramminn er eingöngu AL og notar eigin `SignedXml`- og `X509Certificate2`-þjónustur vettvangsins. Ekkert .NET add-in er notað og ramminn keyrir í Business Central online.

## Hvernig beiðni er undirrituð

Öll köll fylgja sömu röð.

1. **Tengingin byggir innri SOAP-body** fyrir aðgerðina — request-elementið og færibreytur þess, án envelope og hausa.
2. **Tengingin velur snið** og varpar enum-gildinu í viðmótið. Fyrir flesta banka er valið fast; Arion velur á milli tveggja sniða eftir þjónustufjölskyldu aðgerðarinnar.
3. **Draupnir opnar viðskiptavottorðið**, les opinbera hlutann og thumbprint þess og byggir envelope: SOAP-header með WS-Security-elementi, Timestamp, skilríkjum, viðskiptavottorði sem binary security token og innri body innan `soap:Body`.
4. **Draupnir undirritar.** Hann reiknar digest yfir hvern hluta sem sniðið nær yfir, síðan eina RSA-undirritun yfir tilvísanirnar og setur `ds:Signature` í security-headerinn með token-tilvísun aftur í viðskiptavottorðið.
5. **Þegar sniðið dulkóðar** er body dulkóðaður með opinbera vottorði bankans áður en envelope er skilað. Í samhverfa sniðinu er lotulykill búinn til fyrir hverja beiðni, vafinn með vottorði bankans og geymdur á undirritarainstansinum.
6. **Tengingin sendir envelope** og afhendir svarið sama undirritarainstans til afkóðunar. Þetta skiptir máli fyrir samhverfa sniðið: lotulykillinn sem þarf til að lesa svarið er í þeim instansi. Snið sem aðeins undirrita, og svör með ódulkóðuðum body eins og SOAP faults, eru skiluð óbreytt.

Ef undirritun mistekst — vottorð vantar, lykilorð er rangt eða body er ógildur — skráir tengingin villuna í sameiginlega request-logginn og skilar villusvari. Engin hálfkláruð beiðni berst bankanum.

## Vottorð

Tvö vottorð koma við sögu og aðeins annað þeirra er á ábyrgð þinni.

**Undirritunarvottorð viðskiptavinar** er gefið út til fyrirtækisins af bankanum. Það er PKCS#12 (`.pfx`) skrá með lykilorði. Hladdu því upp ásamt lykilorðinu á Treasury Setup-síðunni — sjá [hjálp í forriti](/help/iceland-treasury/treasury-setup/). Bæði gildi fara í dulkóðaða geymslu viðbótarinnar og eru aldrei skrifuð í töflu, logg eða villuboð. Sjá [leyndarmál](/help/iceland-treasury/treasury-secrets/).

FactBox uppsetningarsíðunnar les vistaða vottorðið og sýnir subject, issuer, thumbprint og gildistíma. Fyrningardagsetningin er lituð — græn meðan tími er eftir, gul þegar hún nálgast og rauð þegar hún er liðin — svo sjáist áður en köll fara að mistakast. Sjálft vottorðið er hvergi birt á síðunni.

**Vottorð bankans** þarf aðeins fyrir dulkóðandi snið og tengingin sækir það úr birtum lýsigögnum þjónustunnar. Ekkert þarf að skrá handvirkt.

Vottorð eru háð fyrirtæki og viðbót. Þau flytjast ekki frá eldri viðbót þar sem dulkóðuð geymsla tilheyrir viðbótinni sem skrifaði hana.

## Framlenging

Ný bankatenging þarf ekki að útfæra undirritun. Hún velur yfirleitt eitt snið og geymir hvaða enum-gildi bankinn þarfnast.

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

Enumið er extensible, þannig að banki sem krefst sniðs sem ekkert af fimm sniðunum framleiðir getur bætt sínu eigin við án breytinga á þessu appi:

1. Útfærðu `IOBS ISoap Signer ori` í nýrri codeunit. Viðmótið hefur þrjár aðgerðir: `BuildSignedEnvelope`, `SetRecipientCertificate` fyrir dulkóðandi sniðin og `DecryptResponseBody`.
2. Bættu gildi við `IOBS Soap Signer ori` enum með `Implementation`-ákvæði sem vísar í codeunitina.
3. Veittu execute-heimild á codeunitina í heimildasettinu sem nær yfir nýju tenginguna.

Þar sem sniðið er leyst í gegnum enum geymir tengingin aðeins hvaða gildi bankinn þarfnast og varpar því í viðmótið þegar hún kallar. Viðmótið er framlengingarpunkturinn — sjá [Byggja á Bifröst](/extensibility/).

## Næstu skref

- [Yfirlit Iceland Treasury](/iceland-treasury/)
- [Arion banki](../banks/arion.md)
- [Tilvísun í skilaboðategundir](/iceland-treasury/reference/message-types/)
- [Hjálp í forriti](/help/iceland-treasury/)
