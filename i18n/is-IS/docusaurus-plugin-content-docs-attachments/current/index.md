---
id: index
title: "Bifröst Attachments"
sidebar_label: "Overview"
sidebar_position: 1
slug: /
description: "Geymdu skrár Business Central í Azure Blob Storage, Azure File Share eða SharePoint og náðu í þær úr hvaða ferli sem er."
---

# Bifröst Attachments

**Geymdu skrár Business Central í skýgeymslu og náðu í þær úr hvaða ferli sem er.** Lestu,
skrifaðu og hengdu skrár við í Azure Blob Storage, Azure File Share eða SharePoint, og færðu
viðhengi út úr gagnagrunninum án þess að tapa þeim.

Önnur kerfi, aðstoðarmenn og ferli í Business Central nota sömu geymslutengingarnar, sem
kerfisstjóri setur upp einu sinni.

*Viðbótarapp ofan á [Bifröst Foundation](/foundation/). Nýr í Bifröst? Byrjaðu á
[Hvernig Bifröst virkar](/documentation/how-it-works/).*

## Hvað þú getur gert

- **Minnkað gagnagrunninn.** Færðu innihald fylgiskjals eða viðhengis innsends skjals út í
  geymslu og sæktu það aftur þegar á þarf að halda. Útfærðar skrár opnast áfram eðlilega í
  Business Central.
- **Unnið með skrár og möppur.** Skráð, sótt, hlaðið upp, afritað, fært og eytt skrám, og
  búið til, skráð og eytt möppum, í hvaða geymslutengingu sem þú hefur sett upp.
- **Hengt geymda skrá við færslu.** Hengdu skrá sem þegar er í geymslu við innsent skjal, eða
  bættu fylgiskjali við hvaða færslu sem er, til dæmis viðskiptamann, lánardrottin, eign eða
  skjal, án þess að hlaða henni upp aftur. Innsend skjöl eru síðan meðhöndluð eins og venjulega í
  [Bifröst Foundation](/foundation/).
- **Sent stórar skrár.** Skrá sem er of stór fyrir eina beiðni má senda í bútum og setja saman í
  geymslu, eða hengja beint við færslu.
- **Flett upp í uppsetningu gagnaskipta.** Lestu skilgreiningar og tegundir gagnaskipta og unnar
  færslur. Þetta er eingöngu lestur: engu er hlaðið upp og engu breytt.
- **Valið geymslu.** Azure Blob Storage, Azure File Share eða SharePoint, í gegnum stöðluðu
  tengiöpp Business Central.

## Sæktu appið

Settu **Bifrost Attachments** upp við hlið Bifröst Foundation, af AppSource eða í gegnum
samstarfsaðila þinn. Það þarf Business Central 28.0 eða nýrra, Essentials eða Premium, og að
minnsta kosti eitt tengiapp fyrir skráageymslu í Business Central, til dæmis Azure Blob Storage
Connector frá Microsoft.

## Uppsetning

| Skref | Hvað | Hver |
|---|---|---|
| 1 | Settu upp tengiapp fyrir skráageymslu (Azure Blob Storage, Azure File Share eða SharePoint) og skráðu skráareikning í því, til dæmis með **leiðsagnarforritinu fyrir skráareikninga**. | Kerfisstjóri Business Central |
| 2 | Leyfðu HTTP-biðlarabeiðnir fyrir viðbótina. Leiðsagnaruppsetningin **Setja upp Bifrost Attachments** leiðir þig í gegnum það. | Kerfisstjóri Business Central |
| 3 | Opnaðu **Uppsetningu Bifrost Attachments** í flokknum **Forrit** á **Uppsetningu Bifrost** og bættu við geymslutengingu: stuttum kóða, tenglinum, skráareikningnum og, ef þú vilt, grunnslóð. Veldu **Prófa tengingu**. | Kerfisstjóri Business Central |
| 4 | Gefðu fólki og þjónustum sem nota geymslu heimildasafnið **`BIFROST Attach ori`** (og `BIFROST DataExch ori` fyrir gagnaskipti). | Kerfisstjóri Business Central |
| 5 | Sendu beiðnir sem vísa á geymslutenginguna með kóða hennar. | Sá sem smíðar samþættinguna |

Leiðbeiningar skref fyrir skref eru í hjálpinni í appinu:
[Uppsetning Attachments](/help/attachments/attachments-setup/),
[Uppsetning Bifröst-geymslu](/help/attachments/storage-setup/),
[Geymslutenging](/help/attachments/storage-card/) og
[Velja skráareikning](/help/attachments/storage-account-lookup/).

## Gott að vita

- **Það vinnur sem þú.** Hvert kall keyrir með þínum eigin heimildum í Business Central og er skráð
  á **Bifrost Messages**.
- **Engin auðkenni í þessu appi.** Lyklar og teikn eru áfram í tengiöppum Business Central.
  Bifröst Attachments geymir aðeins auðkenni og heiti skráareikningsins.
- **Engin heimild, enginn aðgangur.** Notandi án `BIFROST Attach ori` fær heimildarvillu, og engin
  gögn eru sýnd eða þeim breytt.
- **Óvirk geymslutenging** hafnar öllum beiðnum þar til hún er virkjuð aftur.
- **Ókláraðar stórar upphleðslur skilja eftir gögn.** Upphleðslur sem aldrei var lokið eða hætt við
  má hreinsa með **Hreinsa upphleðslulotur** á Uppsetningu Bifrost Attachments.

## Tilvísun

Uppsettar skilaboðategundir og samningar þeirra eru lesnir úr Business Central sjálfu: með
MCP-verkfærunum `list_message_types` og `describe_message_type`, eða á síðunni **Bifrost Message
Types**.

Fyrir forritara: hver aðgerð fer í gegnum stöðluðu tengla Business Central fyrir ytri
skráageymslu, og innihald skráa ferðast sem base64, í bútum fyrir stórar skrár.

- [Texti AppSource-skráningar](./listing)
- [Prófunarsviðsmyndir fyrir AppSource](./user-scenarios)
- [Byggðu á Bifröst](/extensibility/)
- Heimildasöfn: `BIFROST Attach ori` (geymsla) og `BIFROST DataExch ori` (gagnaskipti).
