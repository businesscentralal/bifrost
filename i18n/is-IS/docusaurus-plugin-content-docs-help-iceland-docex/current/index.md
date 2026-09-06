---
id: index
title: "Bifröst Iceland DocEx — Help"
sidebar_label: "Bifröst Iceland DocEx — Help"
sidebar_position: 1
slug: /
---

**Bifröst Ísland DocEx** tengir Business Central við rafræn skjalaskiptakerfi. Sendið og móttakið reikninga, pantanir og önnur viðskiptaskjöl í gegnum Advania, Unimaze og InExchange, flettið upp Peppol BIS 3.0 viðmiðunargögnum og myndið UBL 2.1 XML — allt í gegnum skilaboðaviðmót Bifrastar.

Viðbótin bætir við 76 skilaboðategundum. Hver þeirra lýsir sér sjálf: sendið `Help.DocumentExchange.Get` með heiti skilaboðategundarinnar sem viðfang til að fá lýsingu á beiðni og svari á Markdown-sniði.

## Efnisyfirlit

-   [Byrjun](#byrjun)
-   [BIS 3.0 viðmiðunargögn](#bis30) — 10 skilaboðategundir
-   [Advania](#advania) — 30 skilaboðategundir
-   [Unimaze](#unimaze) — 23 skilaboðategundir
-   [InExchange](#inexchange) — 8 skilaboðategundir
-   [UBL-myndun](#ubl) — 4 skilaboðategundir
-   [Hjálp](#hjalp)
-   [Villumeðhöndlun](#villur)
-   [Aðstoð](#adstod)

## Byrjun {#byrjun}

Viðbótin krefst þess að **Bifröst Foundation** sé uppsett. Eftir uppsetningu þarf að slá inn aðgangsupplýsingar þjónustuaðila á Bifrastar-uppsetningarsíðunni.

1.  Veljið leitartáknið, sláið inn **Bifröst uppsetning** og veljið tengilinn.
2.  Opnið flipann **Skjalaskipti** og stillið **umhverfi** (Live eða Test) fyrir hvern þjónustuaðila sem þið notið.
3.  Sláið inn aðgangsupplýsingar: notandanafn og lykilorð fyrir Advania, notandanafn eða API-lykil fyrir Unimaze, API-lykil og biðlaratóka fyrir InExchange. Gildin eru geymd í Isolated Storage og birtast aldrei aftur — síðan sýnir aðeins gátreitinn **Innskráningarupplýsingar geymdar**.
4.  Veljið **Prófa tengingu** fyrir hvern þjónustuaðila og staðfestið að hún takist.
5.  Veljið **Uppfæra BII gagnaskiptaskilgreiningar** ef þið flytjið inn skjöl á innleið. Það endurgerir skilgreiningarnar `BIIINVOICE` og `BIICREDITMEMO`.
6.  Notið Bifröst Queue API til að senda skjalaskiptabeiðnir og sækið niðurstöður úr Bifröst Data API.

**Verið að skipta úr Origo Cloud Events DocEx?** Setjið Bifröst Ísland DocEx upp við hliðina á eldri viðbótinni. Kóðavarpanir, VSK-fjárhagsreikningsvarpanir og uppsetningargildi flytjast sjálfkrafa, en Business Central heldur geymdum aðgangsupplýsingum aðskildum eftir viðbótum, svo slá þarf aðgangsupplýsingar þjónustuaðila inn að nýju.

## BIS 3.0 viðmiðunargögn {#bis30}

Innbyggð Peppol BIS 3.0 viðmiðunargögn eru tiltæk án ytri aðgangsupplýsinga. Notið þessar skilaboðategundir til að fletta upp stöðluðum kóðum fyrir rafræn skjöl.

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.BIS30.CountryCodes | ISO-landskóðar fyrir Peppol-skjöl |
| DocumentExchange.BIS30.Currencies | Gjaldmiðlakóðar |
| DocumentExchange.BIS30.DocumentTypeCodes | Skjalategundarkóðar (380=Reikningur, 381=Kreditreikningur o.s.frv.) |
| DocumentExchange.BIS30.DocumentTypes | Lýsingar á skjalategundum |
| DocumentExchange.BIS30.ElectronicAddressSchemes | Rafræn auðkenniskerfi (EAS) |
| DocumentExchange.BIS30.InvoicedObjectIdentifiers | Auðkenniskerfi reikningaðra hluta |
| DocumentExchange.BIS30.MimeCodes | MIME-tegundakóðar fyrir viðhengi |
| DocumentExchange.BIS30.ParticipantSchemes | Auðkenniskerfi þátttakenda |
| DocumentExchange.BIS30.UnitCodes | Einingarkóðar (UN/ECE Rec 20) |
| DocumentExchange.BIS30.VatCodes | VSK-flokkakóðar |

## Advania {#advania}

Advania er aðalvettvangur skjalaskipta á Íslandi. Eftirfarandi skilaboðategundir eru tiltækar til móttöku, sendingar og umsjónar rafrænna skjala í gegnum Advania.

### Móttaka skjala

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.GetUnread | Sækja lista yfir ólesin skjöl |
| DocumentExchange.Advania.GetDocument | Sækja fullt skjal eftir auðkenni |
| DocumentExchange.Advania.GetDocumentInfo | Sækja lýsigögn skjals |
| DocumentExchange.Advania.GetDocumentLines | Sækja skjalalínur |
| DocumentExchange.Advania.GetAttachments | Sækja viðhengi skjals |
| DocumentExchange.Advania.GetDocumentHistory | Sækja stöðuferil skjals |

### Stöðustjórnun

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.UpdateStatus | Uppfæra stöðu skjals |
| DocumentExchange.Advania.StatusSync | Samstilla stöður allra rakinna skjala |
| DocumentExchange.Advania.GetStatuses | Sækja tiltæk stöðugildi |

### Senda skjöl

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.SubmitDocument | Senda skjal til afhendingar |
| DocumentExchange.Advania.CreateInvoice | Búa til og senda reikning úr BC-gögnum |

### Pósthólf

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.GetInbox | Sækja innhólf |
| DocumentExchange.Advania.GetSent | Sækja send skjöl |
| DocumentExchange.Advania.InboxSince | Sækja innhólf frá ákveðinni dagsetningu |

### Uppfletting viðskiptaaðila

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.GetTradingPartners | Sækja skráða viðskiptaaðila |
| DocumentExchange.Advania.GetAuthorizedPartners | Sækja heimilaða aðila |

### Skjalasótt

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.LookupDocument | Fletta upp skjali eftir tilvísun |
| DocumentExchange.Advania.GetDocumentPdf | Sækja skjal sem PDF |
| DocumentExchange.Advania.GetPresentation | Sækja sniðið skjal til birtingar |

### Notanda- og viðmótsaðgangur

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.GetUserAccess | Sækja aðgangsupplýsingar notanda |
| DocumentExchange.Advania.GetWebUIUrl | Sækja slóð á vefviðmót |
| DocumentExchange.Advania.GetSessionUrl | Sækja auðkennda lotuslóð |

### Skjalavinnsla

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.ConvertXml | Umbreyta XML á milli sniða |
| DocumentExchange.Advania.CompressPdf | Þjappa PDF-skjali |
| DocumentExchange.Advania.OcrPdf | Keyra stafakennsl (OCR) á PDF |

### Viðbótarþjónustur

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Advania.CheckUniversalService | Athuga framboð almennrar þjónustu |
| DocumentExchange.Advania.GetDocumentSupport | Sækja studdar skjalategundir fyrir aðila |
| DocumentExchange.Advania.GetDocumentTypes | Sækja allar tiltækar skjalategundir |
| DocumentExchange.Advania.GetDocumentLight | Sækja létta skjalasamantekt |
| DocumentExchange.Advania.GetUnreadRemittance | Sækja ólesnar greiðslutilkynningar |

## Unimaze {#unimaze}

Unimaze er norrænt skjalaskiptakerfi sem styður rafræna reikningagerð á Norðurlöndum.

### Móttaka skjala

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.GetUnread | Sækja ólesin skjöl |
| DocumentExchange.Unimaze.GetDocument | Sækja fullt skjal |
| DocumentExchange.Unimaze.GetDocumentInfo | Sækja lýsigögn skjals |
| DocumentExchange.Unimaze.GetDocumentHistory | Sækja feril skjals |

### Stöðustjórnun

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.UpdateStatus | Uppfæra stöðu skjals |
| DocumentExchange.Unimaze.StatusSync | Samstilla stöður skjala |

### Senda skjöl

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.CreateInvoice | Búa til og senda reikning |
| DocumentExchange.Unimaze.SubmitTransaction | Senda færslu |
| DocumentExchange.Unimaze.SubmitXml | Senda XML-skjal |

### Fyrirspurnir

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.GetInbox | Sækja innhólf |
| DocumentExchange.Unimaze.LookupDocument | Fletta upp skjali |
| DocumentExchange.Unimaze.GetPresentation | Sækja birtingarsnið skjals |
| DocumentExchange.Unimaze.GetPartyInfo | Sækja upplýsingar um aðila |

### Aðgerðir

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.AddAttachment | Bæta við viðhengi |
| DocumentExchange.Unimaze.GetValidations | Sækja villuleitarniðurstöður |
| DocumentExchange.Unimaze.RetryMessage | Endurreyna misheppnuð skilaboð |

### Verkflæði

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.RegisterPayment | Skrá greiðslu |
| DocumentExchange.Unimaze.RegisterRejection | Skrá höfnun skjals |
| DocumentExchange.Unimaze.GetPendingActions | Sækja aðgerðir sem bíða ákvörðunar |

### Annað

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.Unimaze.CreateGenericMessage | Búa til almenn skilaboð |
| DocumentExchange.Unimaze.GetDocumentOriginal | Sækja upprunalegt skjal |
| DocumentExchange.Unimaze.GetDocumentTransformed | Sækja umbreytt skjal |
| DocumentExchange.Unimaze.GetDocumentSupport | Sækja studdar skjalategundir |

## InExchange {#inexchange}

InExchange er sænskt rafrænt reikningakerfi sem notað er víða á Norðurlöndum.

### Móttaka skjala

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.InExchange.GetIncoming | Sækja skjöl á innleið |
| DocumentExchange.InExchange.GetDocument | Sækja fullt skjal |
| DocumentExchange.InExchange.GetDocumentInfo | Sækja lýsigögn skjals |

### Staða og sending

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.InExchange.MarkHandled | Merkja skjal sem afgreitt |
| DocumentExchange.InExchange.SendDocument | Senda skjal |
| DocumentExchange.InExchange.GetOutboundStatus | Rekja stöðu skjals á útleið |

### Uppfletting viðskiptaaðila

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.InExchange.BuyerLookup | Fletta upp kaupanda í netinu |
| DocumentExchange.InExchange.SellerLookup | Fletta upp seljanda í netinu |

## UBL-myndun {#ubl}

Búið til staðlaðar UBL 2.1 XML-skrár beint úr Business Central gögnum. Engar ytri aðgangsupplýsingar eru nauðsynlegar.

| Skilaboðategund | Lýsing |
| --- | --- |
| DocumentExchange.UBL.RenderBilling | Mynda reikning eða kreditreikning sem UBL XML |
| DocumentExchange.UBL.RenderOrder | Mynda pöntun sem UBL XML |
| DocumentExchange.UBL.RenderDespatchAdvice | Mynda sendingartilkynningu sem UBL XML |
| DocumentExchange.UBL.RenderStatement | Mynda yfirlit sem UBL XML |

## Hjálp {#hjalp}

| Skilaboðategund | Lýsing |
| --- | --- |
| Help.DocumentExchange.Get | Sækja hjálparskjöl fyrir skjalaskipti |

## Villumeðhöndlun {#villur}

Þegar aðgerð þjónustuaðila mistekst (auðkenningarvilla, netbilun, ógild beiðni) inniheldur svarið skipulegt JSON-villuobjekt með:

-   **error** — villukóði eða tegund
-   **message** — læsileg lýsing
-   **provider** — hvaða þjónustuaðili skilaði villunni
-   **callStack** — AL-kallstafli (þegar tiltækur)

Athugið stöðusvæði `Message ori` fyrir stöðu verkefnis.

## Aðstoð {#adstod}

Hafið samband við [Origo](https://www.origo.is/) til að fá aðstoð.
